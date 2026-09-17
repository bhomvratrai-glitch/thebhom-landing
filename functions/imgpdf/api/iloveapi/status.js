export async function onRequest(context) {
  return new Response(JSON.stringify({
    configured: true,
    status: 'operational',
    service: 'iLoveAPI Gateway',
    timestamp: new Date().toISOString()
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
