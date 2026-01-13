// content.js - Shield Protocol Premium UI & Interceptor
(function() {
    // 1. Inject the 'engine.js' into the page context to catch wallet calls
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('engine.js');
    script.onload = function() { this.remove(); };
    (document.head || document.documentElement).appendChild(script);

    // 2. Listen for the simulation reports from 'engine.js'
    window.addEventListener("message", (event) => {
        if (event.data.type === "SHIELD_REPORT") {
            showPremiumModal(event.data.payload);
        }
    });

    // 3. The Premium UI Function
    function showPremiumModal(data) {
        // Prevent duplicate modals
        if (document.getElementById('shield-root')) return;

        const host = document.createElement('div');
        host.id = 'shield-root';
        document.body.appendChild(host);

        // Attach Shadow DOM for style isolation
        const shadow = host.attachShadow({ mode: 'open' });

        // High-end CSS for the Premium look
        const style = document.createElement('style');
        style.textContent = `
            .overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px);
                z-index: 2147483646; display: flex; justify-content: center; align-items: center;
            }
            .card {
                width: 350px; background: #0f172a; color: white; border-radius: 20px;
                border: 1px solid #334155; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                animation: slideUp 0.3s ease-out;
            }
            @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
            .badge { 
                background: ${data.color}; color: white; padding: 4px 12px; 
                border-radius: 99px; font-size: 11px; font-weight: 800; text-transform: uppercase; 
            }
            .title { font-size: 18px; font-weight: 700; color: #f8fafc; }
            .receipt { 
                background: #1e293b; padding: 16px; border-radius: 12px; margin: 15px 0;
                border-left: 4px solid ${data.color};
            }
            .label { color: #94a3b8; font-size: 12px; margin-bottom: 4px; }
            .value { font-family: monospace; font-size: 14px; color: #e2e8f0; }
            .insight { font-size: 13px; line-height: 1.6; color: #cbd5e1; margin-bottom: 20px; }
            .btn { 
                width: 100%; padding: 12px; background: #3b82f6; border: none; 
                color: white; border-radius: 10px; font-weight: 600; cursor: pointer;
                transition: background 0.2s;
            }
            .btn:hover { background: #2563eb; }
            .footer { text-align: center; margin-top: 15px; font-size: 11px; color: #64748b; }
        `;

        const modalMarkup = `
            <div class="overlay">
                <div class="card">
                    <div class="header">
                        <span class="title">Shield Protocol</span>
                        <span class="badge">${data.risk}</span>
                    </div>
                    
                    <div class="receipt">
                        <div class="label">Predicted Net Change</div>
                        <div class="value">${data.changes || "No Asset Change"}</div>
                    </div>

                    <div class="insight">
                        ${data.details.replace(/\n/g, '<br>')}
                    </div>

                    <button class="btn" id="confirm-btn">Confirm Security Insight</button>
                    
                    <div class="footer">
                        Shield Pro Active • Secure Transaction Simulation
                    </div>
                </div>
            </div>
        `;

        shadow.appendChild(style);
        const container = document.createElement('div');
        container.innerHTML = modalMarkup;
        shadow.appendChild(container);

        // Close logic
        shadow.getElementById('confirm-btn').onclick = () => {
            host.remove();
        };
    }
})();