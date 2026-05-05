import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://caminhofit.com.br'),
  title: {
    default: 'CaminhoFit — Onde treinar em Teresina',
    template: '%s — CaminhoFit',
  },
  description:
    'Descubra parques, academias, espaços de calistenia e muito mais para treinar em Teresina-PI. Mapa interativo com informações úteis para quem quer se exercitar.',
  keywords: ['treino', 'academia', 'corrida', 'Teresina', 'fitness', 'esporte', 'calistenia', 'crossfit'],
  authors: [{ name: 'CaminhoFit' }],
  openGraph: {
    title: 'CaminhoFit — Onde treinar em Teresina',
    description: 'Descubra os melhores lugares para treinar em Teresina-PI.',
    locale: 'pt_BR',
    type: 'website',
    siteName: 'CaminhoFit',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CaminhoFit',
    description: 'Descubra onde treinar em Teresina-PI.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#22C55E',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${geist.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}