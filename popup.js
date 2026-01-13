document.addEventListener('DOMContentLoaded', async () => {
    const status = document.getElementById('status');
    const buyBtn = document.getElementById('buy-btn');
    const syncBtn = document.getElementById('sync-btn');
    const msg = document.getElementById('msg');

    const data = await chrome.storage.local.get(['isPro']);
    if (data.isPro) {
        status.innerText = "License: Pro Active ✅";
        status.style.color = "#22c55e";
        buyBtn.style.display = 'none';
    }

    buyBtn.onclick = () => window.open('https://buy.stripe.com/YOUR_LINK');

    syncBtn.onclick = async () => {
        const email = document.getElementById('email').value;
        if (!email) return;
        msg.innerText = "Verifying with Stripe...";
        
        try {
            const res = await fetch(`https://your-api.vercel.app/api/sync?email=${email}`);
            const result = await res.json();
            if (result.isPro) {
                await chrome.storage.local.set({ isPro: true });
                msg.innerText = "Pro Unlocked! Restarting...";
                setTimeout(() => location.reload(), 1500);
            } else {
                msg.innerText = "No active subscription found.";
            }
        } catch (e) {
            msg.innerText = "Error connecting to server.";
        }
    };
});