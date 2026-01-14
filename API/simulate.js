// Vercel serverless function: /api/simulate
// Proxies simulation requests to Tenderly using server-side env variables.
// Environment variables required:
//   - TENDERLY_KEY        <- API KEY (server-side env var; DO NOT put this in client code)
//   - TENDERLY_ACCOUNT
//   - TENDERLY_PROJECT
//
// IMPORTANT: The API KEY is read from process.env.TENDERLY_KEY below. Do NOT hard-code it in this file.
const fetch = global.fetch || require("node-fetch");

module.exports = async function (req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*"); // replace "*" with your origin in prod
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // <-- API KEY is read from this environment variable. Do NOT hard-code the key here.
  const TENDERLY_KEY = process.env.TENDERLY_KEY; // <-- "api key" (server-side env var)
  const TENDERLY_ACCOUNT = process.env.TENDERLY_ACCOUNT;
  const TENDERLY_PROJECT = process.env.TENDERLY_PROJECT;

  if (!TENDERLY_KEY || !TENDERLY_ACCOUNT || !TENDERLY_PROJECT) {
    return res.status(500).json({
      error: "Server misconfigured: TENDERLY_KEY, TENDERLY_ACCOUNT and TENDERLY_PROJECT must be set in environment.",
    });
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch (err) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  if (!body) {
    return res.status(400).json({ error: "Missing request body" });
  }

  const tenderlyUrl = `https://api.tenderly.co/api/v1/account/${encodeURIComponent(
    TENDERLY_ACCOUNT
  )}/project/${encodeURIComponent(TENDERLY_PROJECT)}/simulate`;

  try {
    const tenderlyRes = await fetch(tenderlyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Tenderly expects the key in X-Access-Key — using server-side env var above
        "X-Access-Key": TENDERLY_KEY,
      },
      body: JSON.stringify(body),
    });

    const text = await tenderlyRes.text();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (_) {
      parsed = text;
    }

    // Production: replace "*" with your real origin
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(tenderlyRes.status).json(parsed);
  } catch (err) {
    console.error("Error proxying to Tenderly:", err);
    res.status(502).json({ error: "Failed to reach Tenderly", detail: String(err) });
  }
};q
