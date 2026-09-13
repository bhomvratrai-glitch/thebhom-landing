// Health check endpoint for Vercel deployment
// Use this to monitor service status and API availability

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'production',
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
}
