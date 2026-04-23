import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black text-center">
        
        {/* Logo ou Título do Projeto */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-emerald-600">
            CaminhoFit
          </h1>
          <p className="text-zinc-500 mt-2">Descubra onde treinar em Teresina</p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <h2 className="max-w-xs text-2xl font-semibold leading-tight text-black dark:text-zinc-50">
            Ambiente configurado com sucesso! 🚀
          </h2>
          <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
            O banco de dados Supabase está conectado e o Tailwind v4 está voando. 
            Pronto para começar a mapear os locais de treino?
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-10 sm:flex-row">
          <button
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-8 text-white transition-colors hover:bg-emerald-700 md:w-39.5"
          >
            Ver Mapa (Em breve)
          </button>
          
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/8 px-8 transition-colors hover:border-transparent hover:bg-black/4 dark:border-white/15 dark:hover:bg-zinc-900 md:w-39.5"
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir Supabase
          </a>
        </div>
      </main>
    </div>
  );
}