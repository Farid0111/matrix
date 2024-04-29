// utils/fedapay.js
import crypto from 'crypto';

export function generateRandomString(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0, length); /** return required number of characters */
}

export const initFedaPay = () => {
  // Initialiser FedaPay avec votre clé publique
  window.FedaPay.init('.pay-btn', { public_key: 'YOUR_API_PUBLIC_KEY' });
};

export const createCheckout = async (amount, code_id, website, ticket_type) => {
  try {
    const response = await fetch(
      'https://sandbox-api.fedapay.com/v1/transactions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer sk_sandbox_GbV2J0gR7NPdpwGjkCqRYzPw',
        },
        body: JSON.stringify({
          description: ticket_type,
          amount,
          currency: { iso: 'XOF' },
          callback_url: `${website}/ticket/${code_id}`,
          customer: {
            firstname: '',
            lastname: '',
            email: 'customer@mail.com',
            phone_number: {
              number: '+22990909090',
              country: 'bj',
            },
          },
        }),
      }
    );
    return response.json();
  } catch (error) {
    console.log('Error creating checkout:', error);
    return undefined;
    // throw new Error();
  }
};

export const createCheckoutLink = async (id) => {
  try {
    const response = await fetch(
      `https://sandbox-api.fedapay.com/v1/transactions/${id}/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer sk_sandbox_GbV2J0gR7NPdpwGjkCqRYzPw',
        },
        body: JSON.stringify(),
      }
    );
    return response.json();
  } catch (error) {
    console.log('Error creating checkout Link:', error);
    return undefined;
    // throw new Error();
  }
};
