// Cloudflare Pages Function: /api/parse
// Handles universal video parsing requests for TheBhom Video Downloader

const VIDSSAVE_API = "https://api.vidssave.com/api/contentsite_api/media/parse";
const AUTH_TOKEN = "20250901majwlqo";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8"
  };
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders()
  });
}

function detectPlatform(url) {
  const u = (url || "").toLowerCase();
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  if (u.includes("instagram.com")) return "instagram";
  if (u.includes("tiktok.com")) return "tiktok";
  if (u.includes("facebook.com") || u.includes("fb.watch")) return "facebook";
  if (u.includes("twitter.com") || u.includes("x.com")) return "twitter";
  if (u.includes("pinterest.com") || u.includes("pin.it")) return "pinterest";
  if (u.includes("reddit.com") || u.includes("redd.it")) return "reddit";
  return "general";
}

async function callVidsSave(url, origin = "cache") {
  const params = new URLSearchParams({
    auth: AUTH_TOKEN,
    domain: "api-ak.vidssave.com",
    link: url.trim(),
    origin: origin
  });

  const res = await fetch(VIDSSAVE_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Referer": "https://vidssave.com/index-3tz",
      "Origin": "https://vidssave.com"
    },
    body: params.toString()
  });

  if (!res.ok) return null;
  return await res.json().catch(() => null);
}

export async function onRequestPost(context) {
  try {
    const { request } = context;
    const body = await request.json().catch(() => ({}));
    const rawUrl = (body.url || "").trim();

    if (!rawUrl) {
      return new Response(JSON.stringify({ status: "error", error: "Missing video URL" }), {
        status: 400,
        headers: corsHeaders()
      });
    }

    // 1. Try VidsSave with cache mode (provides verified direct redirect download links)
    let result = await callVidsSave(rawUrl, "cache");

    // 2. Fallback to source mode if cache has no resources
    if (!result || result.status !== 1 || !result.data?.resources?.length) {
      result = await callVidsSave(rawUrl, "source");
    }

    if (result && result.status === 1 && result.data) {
      const raw = result.data;
      const resources = [];

      for (const r of raw.resources || []) {
        const dlUrl = r.download_url || "";
        if (dlUrl) {
          resources.push({
            format: (r.format || "MP4").toUpperCase(),
            quality: r.quality || "HD",
            size_bytes: r.size || 0,
            download_url: dlUrl,
            type: r.type || (r.format?.toLowerCase() === "mp3" || r.quality?.toLowerCase().includes("kbps") ? "audio" : "video")
          });
        }
      }

      if (resources.length > 0) {
        return new Response(
          JSON.stringify({
            status: "success",
            data: {
              engine: "vidssave",
              title: raw.title || "Online Video",
              duration_sec: raw.duration || 0,
              thumbnail: raw.thumbnail || "",
              author: raw.user_item?.nickname || "Creator",
              resources: resources,
              platform: detectPlatform(rawUrl)
            }
          }),
          { status: 200, headers: corsHeaders() }
        );
      }
    }

    // Fallback response with detected platform helper links
    const platform = detectPlatform(rawUrl);
    return new Response(
      JSON.stringify({
        status: "fallback",
        platform: platform,
        url: rawUrl,
        message: `Video stream was protected or unavailable via primary cloud node. Use our 1-click ${platform} gateway.`
      }),
      { status: 200, headers: corsHeaders() }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ status: "error", error: err.message || "Failed to parse video" }),
      { status: 500, headers: corsHeaders() }
    );
  }
}
