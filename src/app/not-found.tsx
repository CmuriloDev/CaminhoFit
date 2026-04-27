import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <MapPin size={28} className="text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Local não encontrado</h1>
        <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
          Este local pode ter sido removido ou o link está incorreto.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-semibold text-sm transition-all active:scale-95 shadow-sm shadow-green-200"
        >
          Voltar ao mapa
        </Link>
      </div>
    </div>
  );
}