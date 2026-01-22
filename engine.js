(function() {
    const BACKEND_URL = "https://shield-protocol-7s6jrb0nh-akbouret-3815s-projects.vercel.app/api/simulate";
    const TIMEOUT_MS = 8000;

    const originalRequest = window.ethereum ? window.ethereum.request : null;
    if (!originalRequest) return;

    window.ethereum.request = async (args) => {
        if (args.method === 'eth_sendTransaction') {
            const tx = args.params[0];
            try {
                const response = await fetch(BACKEND_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    signal: AbortSignal.timeout(TIMEOUT_MS),
                    body: JSON.stringify({
                        from: tx.from, 
                        to: tx.to,
                        input: tx.data, 
                        value: tx.value || "0"
                    })
                });

                const data = await response.json();
                const sim = data.transaction;

                // Send the report to content.js
                window.postMessage({
                    type: "SHIELD_REPORT",
                    payload: {
                        risk: sim.status ? "Low Risk" : "High Risk",
                        color: sim.status ? "#22c55e" : "#ef4444",
                        changes: (sim.transaction_info.asset_changes || []).map(c => `${c.amount} ${c.token_info.symbol}`).join(", ") || "No asset changes",
                        details: sim.status ? "Safe: Transaction predicted to succeed." : "Critical: Transaction likely to fail/revert."
                    }
                }, "*");
            } catch (err) {
                console.error("Shield Simulation Failed", err);
            }
        }
        return originalRequest(args);
    };
})();