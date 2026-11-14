import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'ShopMate Admin', description: 'ShopMate ecommerce control panel' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
