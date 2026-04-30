'use client';

import { Share2 } from 'lucide-react';

export default function ShareButton({ name }: { name: string }) {
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${name} — CaminhoFit`,
        text: `Confira ${name} no CaminhoFit!`,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copiado!');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-700 transition-colors active:scale-95"
    >
      <Share2 size={14} />
      Compartilhar
    </button>
  );
}