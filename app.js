// app.js - web version of popup.js (uses localStorage instead of chrome.storage)
document.addEventListener('DOMContentLoaded', async () => {
    const status = document.getElementById('status');
    const buyBtn = document.getElementById('buy-btn');
    const syncBtn = document.getElementById('sync-btn');
    const msg = document.getElementById('msg');

    const isPro = localStorage.getItem('isPro') === '1';
    if (isPro) {
        status.innerText = "License: Pro Active ✅";
        status.style.color = "#22c55e";
        if (buyBtn) buyBtn.style.display = 'none';
    }

    if (buyBtn) buyBtn.onclick = () => window.open('https://buy.stripe.com/YOUR_LINK');

    if (syncBtn) syncBtn.onclick = async () => {
        const emailInput = document.getElementById('email');
        if (!emailInput) return;
        const email = emailInput.value;
        if (!email) return;
        msg.innerText = "Verifying with Stripe...";

        try {
            const res = await fetch(`https://your-api.vercel.app/api/sync?email=${encodeURIComponent(email)}`);
            const result = await res.json();
            if (result.isPro) {
                localStorage.setItem('isPro', '1');
                msg.innerText = "Pro Unlocked! Restarting...";
                setTimeout(() => location.reload(), 1200);
            } else {
                msg.innerText = "No active subscription found.";
            }
        } catch (e) {
            console.error(e);
            msg.innerText = "Error connecting to server.";
        }
    };
});