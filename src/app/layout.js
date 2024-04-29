import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Matrix Connect',
  description: 'High Speed HotSpot',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
        <Script src="https://cdn.fedapay.com/checkout.js?v=1.1.7" />
      </body>
    </html>
  );
}
