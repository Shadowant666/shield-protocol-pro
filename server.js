// Minimal Express server to proxy simulate requests to Tenderly
// Usage: set environment variables TENDERLY_KEY, TENDERLY_ACCOUNT, TENDERLY_PROJECT
// Deploy to Vercel/Render/Heroku or run locally with `node server.js`

require('dotenv').config();
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const TENDERLY_KEY = process.env.TENDERLY_KEY;
const ACCOUNT = process.env.TENDERLY_ACCOUNT;
const PROJECT = process.env.TENDERLY_PROJECT;

if (!TENDERLY_KEY || !ACCOUNT || !PROJECT) {
  console.error("Missing TENDERLY_KEY, TENDERLY_ACCOUNT or TENDERLY_PROJECT env vars.");
  process.exit(1);
}

app.post('/api/simulate', async (req, res) => {
  try {
    const body = {
      network_id: req.body.network_id || '1',
      from: req.body.from,
      to: req.body.to,
      input: req.body.input,
      value: req.body.value || '0',
      save: req.body.save || false
    };

    const r = await fetch(`https://api.tenderly.co/api/v1/account/${ACCOUNT}/project/${PROJECT}/simulate`, {
      method: 'POST',
      headers: {
        'X-Access-Key': TENDERLY_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const json = await r.json();
    res.json(json);
  } catch (err) {
    console.error('Simulate error', err);
    res.status(500).json({ error: 'Simulation failed', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Simulator proxy listening on ${PORT}`);
});