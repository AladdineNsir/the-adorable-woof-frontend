import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { resolveAssetUrl } from "../config/api";

const resolveImage = resolveAssetUrl;

// const fallbackColors = ['#111111', '#7A5A44', '#D8C7B2'];

export default function ProductCard({ product }) {
  const imageSrc = product.image || resolveImage(product.images?.[0]);
  const productId = product.id || product._id;
  const colorSwatches = (product.colors || [])
    .map((color) => color.code || color.hex || color.name)
    .filter(Boolean);

  return (
    <article className="group overflow-hidden rounded-xl border border-[#E8DED1] bg-white shadow-[0_6px_24px_rgba(17,17,17,0.035)] transition-all duration-300 ease-out transform hover:-translate-y-0.5 hover:border-velora-gold/60">
      <div className="relative flex aspect-square items-center justify-center bg-[#FCFAF7] p-4 sm:p-5">
        <Link
          to={`/product/${productId}`}
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={product.name}
              className="h-[90%] w-[90%] object-contain transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="text-xs text-velora-textGray">
              Image indisponible
            </div>
          )}
        </Link>

        {product.isNew && (
          <span className="absolute left-3 top-3 rounded-md bg-velora-gold px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white">
            Nouveau
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-[9px] font-semibold text-velora-textGray">
          {colorSwatches.slice(0, 4).map((color, index) => (
            <span
              key={`${color}-${index}`}
              className="h-3.5 w-3.5 rounded-none border border-[#D8C7B2] transition-transform hover:scale-110"
              style={{ backgroundColor: color }}
            />
          ))}

          {colorSwatches.length === 0 && <span className="text-[9px] font-semibold text-velora-textGray">Couleurs variées</span>}
          {colorSwatches.length > 4 && <span className="text-[10px] font-semibold text-velora-textGray">+{colorSwatches.length - 4}</span>}
        </div>

        <Link to={`/product/${productId}`} className="block">
          <h3 className="text-sm font-semibold text-velora-dark leading-5 line-clamp-2 transition-colors hover:text-velora-gold">{product.name}</h3>
        </Link>

        {product.description && (
          <p className="mt-1.5 text-xs leading-5 text-velora-textGray line-clamp-2">
            {product.description.length > 60 ? `${product.description.slice(0, 60)}…` : product.description}
          </p>
        )}

        <div className="mt-4 flex items-start justify-between gap-2">
          <div className="flex flex-col items-start gap-1.5">
            <p className="text-base sm:text-lg font-bold text-velora-dark">{Number(product.price ?? 0).toFixed(0)} DT</p>
            <span className={`inline-flex rounded-md px-2 py-1 text-[10px] font-semibold ${product.available ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>{product.available ? 'En stock' : 'Rupture'}</span>
          </div>

          <Link
            to={`/product/${productId}`}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E7DED2] bg-white px-3 text-xs sm:text-sm font-semibold text-velora-dark transition-colors duration-200 hover:border-velora-gold hover:bg-velora-gold hover:text-white"
            aria-label={`Voir ${product.name}`}
          >
            <ShoppingCart size={14} />
            Voir
          </Link>
        </div>
      </div>
    </article>
  );
}
