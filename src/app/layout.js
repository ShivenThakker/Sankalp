import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ReliefNet — Disaster Relief Coordination',
  description: 'A platform to coordinate disaster relief efforts seamlessly.',
  themeColor: '#0f0f23',
};

export const viewport = {
  themeColor: '#0f0f23',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
