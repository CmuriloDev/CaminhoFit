export default function LocationCardSkeleton() {
  return (
    <div className="p-4 rounded-2xl border border-stone-100 bg-white/80 backdrop-blur-sm animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {/* Dot shimmer */}
          <div className="w-3 h-3 rounded-full bg-stone-200 animate-pulse-soft" />
          {/* Título shimmer */}
          <div className="h-4 bg-linear-to-r from-stone-200 via-stone-100 to-stone-200 rounded-full w-32 animate-shimmer" />
        </div>
        {/* Badge shimmer */}
        <div className="h-5 w-16 bg-stone-100 rounded-full animate-shimmer" />
      </div>
      
      {/* Descrição shimmer */}
      <div className="h-3 bg-linear-to-r from-stone-100 via-stone-50 to-stone-100 rounded-full w-3/4 ml-5.5 mb-3 animate-shimmer" />
      
      {/* Métricas shimmer */}
      <div className="flex gap-2 ml-5.5">
        <div className="h-6 bg-linear-to-r from-stone-100 via-stone-50 to-stone-100 rounded-lg w-20 animate-shimmer" />
        <div className="h-6 bg-linear-to-r from-stone-100 via-stone-50 to-stone-100 rounded-lg w-16 animate-shimmer" />
      </div>
    </div>
  );
}