// AI API endpoint - Phase 3 integration
// This file handles AI utility requests (summarize, rewrite, title, translate)
// Production setup: connect to OpenAI/Gemini-compatible backend

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, text } = req.body;

    if (!action || !text) {
      return res.status(400).json({ error: 'Missing action or text' });
    }

    // Demo mode - replace with actual provider integration
    const responses = {
      summarize: text.split(/\s+/).slice(0, 55).join(' ') + (text.split(/\s+/).length > 55 ? '…' : ''),
      rewrite: `Rewritten: ${text}`,
      title: `Suggested title: ${text.split(/\s+/).slice(0, 8).join(' ')}`,
      translate: `Translation: ${text}`,
    };

    res.status(200).json({
      success: true,
      action,
      result: responses[action] || responses.summarize,
    });
  } catch (error) {
    console.error('AI endpoint error:', error);
    res.status(500).json({ error: 'AI processing failed' });
  }
}
