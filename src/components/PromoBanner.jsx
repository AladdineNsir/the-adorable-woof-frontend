import React from 'react';

export default function PromoBanner() {
  return (
    <div
      role="note"
      aria-label="Promotion livraison gratuite à partir de 100 DT"
      className="w-full flex items-center justify-center text-center min-h-[32px] py-2 bg-velora-dark text-white/90 border-b border-velora-gold/10 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] px-3"
    >
      <span className="truncate">
        Livraison gratuite à partir de&nbsp;
        <span className="text-velora-gold">100 DT</span>
      </span>
    </div>
  );
}