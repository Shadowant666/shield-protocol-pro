document.addEventListener('DOMContentLoaded', async () => {
    const overlay = document.getElementById('consent-overlay');
    const acceptBtn = document.getElementById('accept-consent');
    const statusText = document.getElementById('status-text');
    const usageInfo = document.getElementById('usage-info');
    const msg = document.getElementById('msg');
    const syncBtn = document.getElementById('sync-btn');

    // 1. Check for Prominent Disclosure Consent
    const consentData = await chrome.storage.local.get(['hasConsented']);
    if (!consentData.hasConsented) {
        overlay.style.display = 'flex';
    }

    acceptBtn.onclick = async () => {
        await chrome.storage.local.set({ hasConsented: true });
        overlay.style.display = 'none';
        location.reload(); 
    };

    // 2. Load User Status
    const data = await chrome.storage.local.get(['isPro', 'perUseTokens', 'trialCount']);
    let trialCount = data.trialCount !== undefined ? data.trialCount : 3;
    let tokens = data.perUseTokens || 0;

    if (data.isPro) {
        statusText.innerText = "Pro Active ✅";
        statusText.style.color = "#22c55e";
        usageInfo.innerText = "Unlimited monthly protection";
        if(document.getElementById('upgrade-area')) document.getElementById('upgrade-area').style.display = 'none';
    } else if (tokens > 0) {
        statusText.innerText = "Per-Use Active 🛡️";
        usageInfo.innerText = `${tokens} secure uses remaining`;
    } else {
        usageInfo.innerText = `${trialCount} free uses remaining`;
    }

    // 3. Initialize PayPal Button
    if (window.paypal) {
        window.paypal.HostedButtons({
            hostedButtonId: "RZ94PA7RP9F2U",
        }).render("#paypal-container-RZ94PA7RP9F2U");
    }

    // 4. Sync Logic (Using your specific Vercel URL)
    syncBtn.onclick = async () => {
        const email = document.getElementById('sync-email').value;
        if (!email) {
            msg.innerText = "Please enter your email.";
            return;
        }
        
        msg.innerText = "Verifying PayPal...";
        try {
            const baseUrl = "https://shield-protocol-7s6jrb0nh-akbouret-3815s-projects.vercel.app";
            const res = await fetch(`${baseUrl}/api/sync-paypal?id=${encodeURIComponent(email)}`);
            const result = await res.json();
            
            if (result.isPro) {
                await chrome.storage.local.set({ isPro: true });
                msg.innerText = "Success! Pro Unlocked.";
            } else if (result.newTokens > 0) {
                const totalTokens = tokens + result.newTokens;
                await chrome.storage.local.set({ perUseTokens: totalTokens });
                msg.innerText = "Success! Tokens added.";
            } else {
                msg.innerText = "No payment found for this email.";
            }
            
            setTimeout(() => location.reload(), 1500);
        } catch (e) {
            msg.innerText = "Connection error. Please try again.";
        }
    };
});