export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const event = req.body;

    // These are the events you selected in PayPal Webhooks section
    if (event.event_type === 'BILLING.SUBSCRIPTION.ACTIVATED' || 
        event.event_type === 'CHECKOUT.ORDER.APPROVED') {
        
        const email = event.resource.subscriber?.email_address || event.resource.payer?.email_address;
        
        console.log(`Verified Payment for: ${email}`);
        // TODO: Here you would save this email to your database (like Supabase or MongoDB)
        // For now, it will be logged in your Vercel logs.
    }

    res.status(200).send('OK');
}