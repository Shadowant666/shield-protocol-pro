// engine.js - Finalized with Transaction Timeout
(function() {
    const TENDERLY_KEY = "bzBU6v3eRWfPaEVQwxxRi7lNhhZtgEOb"; 
    const ACCOUNT = "Shadowant"; 
    const PROJECT = "shield-protocol";
    const TIMEOUT_MS = 8000; // 8 Seconds - PM Recommendation for 2026 UX

    const originalRequest = window.ethereum ? window.ethereum.request : null;
    if (!originalRequest) return;

    window.ethereum.request = async (args) => {
        if (args.method === 'eth_sendTransaction') {
            const tx = args.params[0];

            try {
                // The 'signal' will automatically cancel the fetch if it takes > 8 seconds
                const response = await fetch(
                    `https://api.tenderly.co/api/v1/account/${ACCOUNT}/project/${PROJECT}/simulate`,
                    {
                        method: 'POST',
                        headers: { 'X-Access-Key': TENDERLY_KEY, 'Content-Type': 'application/json' },
                        signal: AbortSignal.timeout(TIMEOUT_MS), // NEW: Timeout Logic
                        body: JSON.stringify({
                            network_id: '1', 
                            from: tx.from, to: tx.to,
                            input: tx.data, value: tx.value || "0",
                            save: true
                        })
                    }
                );

                const data = await response.json();
                const sim = data.transaction;
                const changes = sim.transaction_info.asset_changes || [];

                window.postMessage({engine js - Finalized with Transaction Timeout
                    type: "SHIELD_SIM_RESULT",
                    result: {
                        status: sim.status ? "SUCCESS" : "REVERTED",
                        assets: changes.map(c => `${c.amount} ${c.token_info.symbol}`),
                        details: sim.status ? "Transaction likely to succeed." : "Warning: Transaction may fail."
                    }
                }, "*");

            } catch (err) {
                // If it times out or fails, we notify the UI to show a 'Service Busy' message
                console.error("Shield Error:", err);
                
                window.postMessage({
                    type: "SHIELD_SIM_RESULT",
                    result: {
                        status: "TIMEOUT",
                        assets: [],
                        details: err.name === 'TimeoutError' 
                            ? "Simulation timed out. Proceed with caution." 
                            : "Simulation service currently unavailable."
                    }
                }, "*");
            }
        }
        return originalRequest(args);
    };
})();