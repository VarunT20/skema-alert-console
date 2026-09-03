// Vercel serverless function — forwards the browser's request to Workato
// server-to-server, so the browser never needs cross-origin access to Workato.

const WORKATO_WEBHOOK_URL = "https://webhooks.workato.com/webhooks/rest/68572e93-427b-475e-a6b0-33e58300fb8f/aml_alert_intake";

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Only POST is supported' });
    return;
  }

  try {
    const workatoRes = await fetch(WORKATO_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const text = await workatoRes.text();
    res.status(workatoRes.status).send(text || '{"status":"sent"}');
  } catch (err) {
    res.status(502).json({ error: 'Relay failed to reach Workato', detail: err.message });
  }
};
