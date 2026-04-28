import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CaminhoFit — Onde treinar em Teresina',
  description: 'Descubra parques, academias, espaços de calistenia e muito mais para treinar em Teresina-PI.',
  keywords: ['treino', 'academia', 'corrida', 'Teresina', 'fitness', 'esporte'],
  openGraph: {
    title: 'CaminhoFit',
    description: 'Descubra onde treinar em Teresina-PI.',
    locale: 'pt_BR',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#22c55e',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}