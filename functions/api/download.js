// Cloudflare Pages Function: /api/download
// High-speed streaming proxy & attachment header handler for video downloads

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
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
    let targetUrl = "";
    let filename = "thebhom_video.mp4";

    if (request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      targetUrl = body.download_url || body.url || "";
      filename = body.filename || filename;
    } else {
      const urlObj = new URL(request.url);
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

    // Fetch upstream media stream
    const upstreamRes = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://vidssave.com/"
      }
    });

    if (!upstreamRes.ok && !upstreamRes.body) {
      // Fallback redirect
      return Response.redirect(targetUrl, 302);
    }

    const contentType = upstreamRes.headers.get("Content-Type") || "video/mp4";
    const contentLength = upstreamRes.headers.get("Content-Length");

    const isPreview = (request.method === "POST" ? false : (new URL(request.url).searchParams.get("preview") === "true" || new URL(request.url).searchParams.get("inline") === "true"));
    const disposition = isPreview ? "inline" : `attachment; filename="${safeFilename}"`;

    const respHeaders = new Headers({
      "Content-Type": contentType,
      "Content-Disposition": disposition,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600"
    });

    if (contentLength) {
      respHeaders.set("Content-Length", contentLength);
    }

    return new Response(upstreamRes.body, {
      status: 200,
      headers: respHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders() }
    });
  }
}
