// pages/api/create-checkout.js

export default async function handler(req, res) {
  const { amount, email, lastName } = req.body;

  try {
    // Code pour créer le paiement via FedaPay
    const response = await fetch('https://api.fedapay.com/v1/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.FEDAPAY_SECRET_KEY}`,
      },
      body: JSON.stringify({
        amount,
        email,
        last_name: lastName,
        currency: 'XOF', // ou toute autre devise supportée
        callback_url: 'https://yourwebsite.com/payment-callback', // URL à laquelle FedaPay doit rediriger l'utilisateur après paiement
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error creating checkout:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
