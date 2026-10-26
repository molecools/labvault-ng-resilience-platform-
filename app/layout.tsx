import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from './providers';
import { TopNav } from '@/components/TopNav';

export const metadata: Metadata = {
  title: 'LabVault NG | Nigeria Lab Resilience Network',
  description: 'A shared resilience network for Nigerian laboratories, reagents, and cold-chain visibility.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <TopNav />
          <main>{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
