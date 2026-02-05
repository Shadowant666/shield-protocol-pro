document.addEventListener('DOMContentLoaded', async () => {
    const statusText = document.getElementById('status-text');
    const usageInfo = document.getElementById('usage-info');
    const msg = document.getElementById('msg');
    const syncBtn = document.getElementById('sync-btn');
    const baseUrl = "https://shield-protocol-7s6jrb0nh-akbouret-3815s-projects.vercel.app";

    // 1. Check current status
    const data = await chrome.storage.local.get(['isPro']);
    if (data.isPro) {
        statusText.innerText = "Pro Active ✅";
        statusText.style.color = "#22c55e";
        usageInfo.innerText = "Unlimited monthly protection";
        document.getElementById('upgrade-area').style.display = 'none';
    }

    // 2. Initialize PayPal Button
    if (window.paypal) {
        paypal.Buttons({
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [{
                        amount: { value: '9.99' } // Set your price here
                    }]
                });
            },
            onApprove: async (data, actions) => {
                const details = await actions.order.capture();
                const email = details.payer.email_address;
                
                msg.innerText = "Payment successful! Syncing...";
                // Call your backend to record the purchase
                try {
                    await fetch(`${baseUrl}/api/sync-paypal?email=${encodeURIComponent(email)}`);
                    await chrome.storage.local.set({ isPro: true });
                    window.location.reload();
                } catch (e) {
                    msg.innerText = "Payment recorded, but sync failed. Please use Sync button.";
                }
            }
        }).render('#paypal-button-container');
    }

    // 3. Sync Button Logic
    syncBtn.onclick = async () => {
        const email = document.getElementById('sync-email').value;
        if (!email) return msg.innerText = "Please enter your email.";
        
        msg.innerText = "Verifying with PayPal...";
        try {
            const res = await fetch(`${baseUrl}/api/sync-paypal?email=${encodeURIComponent(email)}`);
            const result = await res.json();
            
            if (result.isPro) {
                await chrome.storage.local.set({ isPro: true });
                msg.innerText = "Success! Pro Unlocked.";
                setTimeout(() => window.location.reload(), 1500);
            } else {
                msg.innerText = "No active subscription found.";
            }
        } catch (e) {
            msg.innerText = "Sync failed. Try again.";
        }
    };
});