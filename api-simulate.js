import fetch from 'node-fetch';

export default async function handler(req, res) {
    // 1. Get secrets from your Vercel environment variables
    const TENDERLY_KEY = process.env.TENDERLY_KEY;
    const ACCOUNT = process.env.TENDERLY_ACCOUNT;
    const PROJECT = process.env.TENDERLY_PROJECT;

    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    try {
        const { from, to, input, value } = req.body;

        // 2. Call Tenderly API securely
        const response = await fetch(
            `https://api.tenderly.co/api/v1/account/${ACCOUNT}/project/${PROJECT}/simulate`,
            {
                method: 'POST',
                headers: { 
                    'X-Access-Key': TENDERLY_KEY, 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    network_id: '1',
                    from, to, input,
                    value: value || "0",
                    save: true
                })
            }
        );

        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: "Simulation failed" });
    }
}