// Cloudflare Pages Function: /api/download
// High-speed streaming proxy & progressive range handler for video downloads

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, HEAD",
    "Access-Control-Allow-Headers": "Content-Type, Range, Authorization",
    "Access-Control-Expose-Headers": "Content-Range, Content-Length, Accept-Ranges, Content-Disposition"
  };
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function onRequest(context) {
  const { request } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  try {
    const urlObj = new URL(request.url);
    let targetUrl = "";
    let filename = "thebhom_video.mp4";

    if (request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      targetUrl = body.download_url || body.url || "";
      filename = body.filename || filename;
    } else {
      targetUrl = urlObj.searchParams.get("url") || "";
      filename = urlObj.searchParams.get("filename") || filename;
    }

    if (!targetUrl) {
      return new Response(JSON.stringify({ error: "Missing download URL" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders() }
      });
    }

    // Clean filename for HTTP header
    const safeFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, "_");

    // Check if client requested byte range (YouTube-style progressive chunked playback)
    const clientRange = request.headers.get("Range") || urlObj.searchParams.get("range");
    const isPreview = urlObj.searchParams.get("preview") === "true" || urlObj.searchParams.get("inline") === "true";

    const upstreamHeaders = {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Referer": "https://vidssave.com/",
      "Accept": "*/*"
    };

    if (clientRange) {
      upstreamHeaders["Range"] = clientRange;
    }

    let finalUrl = targetUrl;
    // Resolve redirect manually if target is a redirect gateway, so Range header isn't stripped by cross-origin redirect
    if (targetUrl.includes("download_redirect")) {
      try {
        const headCheck = await fetch(targetUrl, {
          method: "HEAD",
          headers: upstreamHeaders,
          redirect: "manual"
        });
        if (headCheck.status === 302 || headCheck.status === 301) {
          const loc = headCheck.headers.get("Location");
          if (loc) finalUrl = loc;
        }
      } catch (e) {}
    }

    // Fetch upstream media stream
    const upstreamRes = await fetch(finalUrl, {
      headers: upstreamHeaders
    });

    if (!upstreamRes.ok && upstreamRes.status !== 206) {
      // Fallback: direct 302 redirect so user browser downloads directly from source
      return Response.redirect(finalUrl, 302);
    }

    const contentType = upstreamRes.headers.get("Content-Type") || "video/mp4";
    const contentLength = upstreamRes.headers.get("Content-Length");
    const contentRange = upstreamRes.headers.get("Content-Range");
    const acceptRanges = upstreamRes.headers.get("Accept-Ranges") || "bytes";

    const respHeaders = new Headers({
      "Content-Type": contentType,
      "Content-Disposition": isPreview ? "inline" : `attachment; filename="${safeFilename}"`,
      "Accept-Ranges": acceptRanges,
      "Cache-Control": "public, max-age=7200",
      ...corsHeaders()
    });

    if (contentLength) respHeaders.set("Content-Length", contentLength);
    if (contentRange) respHeaders.set("Content-Range", contentRange);

    return new Response(upstreamRes.body, {
      status: upstreamRes.status, // HTTP 206 for progressive range or 200 for full stream
      headers: respHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders() }
    });
  }
}
