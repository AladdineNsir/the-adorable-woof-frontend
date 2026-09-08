export function PageSkeleton() {
  return (
    <div className="min-h-[60vh] bg-velora-cream px-4 py-8 sm:px-6 lg:px-8" aria-label="Chargement" role="status">
      <div className="mx-auto max-w-7xl animate-pulse space-y-5">
        <div className="h-8 w-48 rounded-lg bg-white/80" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => <div key={index} className="h-64 rounded-2xl border border-[#E7DED2] bg-white/80" />)}
        </div>
      </div>
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-[#F7F3EC] px-4 py-8 sm:px-6 lg:px-12" aria-label="Chargement" role="status">
      <div className="mx-auto grid max-w-7xl animate-pulse gap-6 rounded-2xl border border-[#E8DED1] bg-white p-4 sm:p-6 lg:grid-cols-2">
        <div className="aspect-square rounded-2xl bg-[#F4EEE7]" />
        <div className="space-y-5 py-4"><div className="h-5 w-28 rounded bg-[#F4EEE7]" /><div className="h-10 w-3/4 rounded bg-[#F4EEE7]" /><div className="h-20 w-full rounded bg-[#F4EEE7]" /><div className="h-12 w-full rounded bg-[#F4EEE7]" /></div>
      </div>
    </div>
  );
}
