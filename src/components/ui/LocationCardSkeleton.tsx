export default function LocationCardSkeleton() {
  return (
    <div className="p-4 rounded-2xl border border-zinc-100 bg-white animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
        <div className="h-4 bg-zinc-200 rounded-full w-2/3" />
      </div>
      <div className="h-3 bg-zinc-100 rounded-full w-1/3 ml-4 mb-4" />
      <div className="flex gap-3 ml-4">
        <div className="h-3 bg-zinc-100 rounded-full w-20" />
        <div className="h-3 bg-zinc-100 rounded-full w-16" />
      </div>
      <div className="flex gap-1.5 mt-3 ml-4">
        <div className="h-5 bg-zinc-100 rounded-full w-12" />
        <div className="h-5 bg-zinc-100 rounded-full w-16" />
        <div className="h-5 bg-zinc-100 rounded-full w-10" />
      </div>
    </div>
  );
}