export async function onRequestGet(context) {
  return new Response(JSON.stringify({
    status: 'ok',
    service: 'imgpdf',
    platform: 'Cloudflare Pages',
    basePath: '/imgpdf',
    timestamp: new Date().toISOString()
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
