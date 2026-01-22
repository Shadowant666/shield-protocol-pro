document.addEventListener('DOMContentLoaded', async () => {
    const statusText = document.getElementById('status-text');
    const usageInfo = document.getElementById('usage-info');
    const msg = document.getElementById('msg');
    const syncBtn = document.getElementById('sync-btn');

    // 1. Load user data from local storage
    const data = await chrome.storage.local.get(['isPro', 'perUseTokens', 'trialCount']);
    let trialCount = data.trialCount !== undefined ? data.trialCount : 3;
    let tokens = data.perUseTokens || 0;

    // 2. Update the visual UI based on license status
    if (data.isPro) {
        statusText.innerText = "Pro Active ✅";
        statusText.style.color = "#22c55e";
        usageInfo.innerText = "Unlimited monthly protection";
        // Hide the payment area if already Pro
        if(document.getElementById('upgrade-area')) document.getElementById('upgrade-area').style.display = 'none';
    } else if (tokens > 0) {
        statusText.innerText = "Per-Use Active 🛡️";
        usageInfo.innerText = `${tokens} secure uses remaining`;
    } else {
        statusText.innerText = "Trial Version";
        usageInfo.innerText = `${trialCount} free uses remaining`;
    }

    // 3. Initialize the PayPal Hosted Button (Your specific ID: RZ94PA7RP9F2U)
    if (window.paypal) {
        window.paypal.HostedButtons({
            hostedButtonId: "RZ94PA7RP9F2U",
        }).render("#paypal-container-RZ94PA7RP9F2U");
    }

    // 4. Sync Logic (Connecting to your specific Vercel URL)
    syncBtn.onclick = async () => {
        const email = document.getElementById('sync-email').value;
        if (!email) {
            msg.innerText = "Please enter your email.";
            return;
        }
        
        msg.innerText = "Verifying PayPal...";
        try {
            // Updated to use your specific Vercel live link
            const baseUrl = "https://shield-protocol-7s6jrb0nh-akbouret-3815s-projects.vercel.app";
            const res = await fetch(`${baseUrl}/api/sync-paypal?id=${encodeURIComponent(email)}`);
            const result = await res.json();
            
            if (result.isPro) {
                await chrome.storage.local.set({ isPro: true });
                msg.innerText = "Success! Pro Unlocked.";
            } else if (result.newTokens > 0) {
                // Calculate new token balance
                const currentTokens = tokens + result.newTokens;
                await chrome.storage.local.set({ perUseTokens: currentTokens });
                msg.innerText = "Success! Tokens added.";
            } else {
                msg.innerText = "No payment found for this email.";
            }
            
            // Refresh the popup to show new status after 1.5 seconds
            setTimeout(() => location.reload(), 1500);
        } catch (e) {
            console.error(e);
            msg.innerText = "Connection error. Check your internet.";
        }
    };
});