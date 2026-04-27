import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin text-green-500" size={28} />
        <span className="text-sm text-zinc-400">Carregando...</span>
      </div>
    </div>
  );
}