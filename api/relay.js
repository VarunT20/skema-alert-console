// Vercel serverless function — forwards the browser's request to whichever
// Workato webhook URL the console specifies, server-to-server, so the
// browser never needs cross-origin access to Workato directly.

const DEFAULT_WORKATO_URL = "https://webhooks.workato.com/webhooks/rest/68572e93-427b-475e-a6b0-33e58300fb8f/aml_alert_intake";

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

  const body = req.body || {};
  const targetUrl = (typeof body.targetUrl === 'string' && body.targetUrl.startsWith('https://'))
    ? body.targetUrl
    : DEFAULT_WORKATO_URL;
  const payload = body.payload || {};

  try {
    const workatoRes = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await workatoRes.text();
    res.status(workatoRes.status).send(text || '{"status":"sent"}');
  } catch (err) {
    res.status(502).json({ error: 'Relay failed to reach target webhook', detail: err.message });
  }
};