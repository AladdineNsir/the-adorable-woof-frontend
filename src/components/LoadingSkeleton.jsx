export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-velora-cream" aria-label="Chargement" role="status" aria-busy="true">
      <div className="h-[68px] border-b border-[#E7DED2] bg-white/80" />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-44 rounded-lg bg-white/80" />
          <div className="h-3 w-64 rounded bg-white/70" />
          <div className="min-h-[280px] rounded-2xl border border-[#E7DED2] bg-white/70" />
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

export function ErrorState({
  title = "Une erreur est survenue",
  message = "Impossible de charger ces informations pour le moment.",
  onRetry,
}) {
  return (
    <div
      className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-[#E8DED1] bg-white px-5 py-12 text-center"
      role="alert"
    >
      <h2 className="font-premium text-xl font-bold text-velora-dark">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-velora-textGray">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-velora-gold px-5 text-sm font-semibold text-white transition hover:bg-velora-goldHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-velora-gold focus-visible:ring-offset-2"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}
