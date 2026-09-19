import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { resolveAssetUrl } from "../config/api";
import { trackSelectItem } from "../analytics/analytics";

const resolveImage = resolveAssetUrl;

export default function ProductCard({ product }) {
  const fallbackImage =
    product.category === "chats"
      ? "/assets/chat2.png"
      : "/assets/chien2.png";

  const imageSrc =
    product.image ||
    resolveImage(product.images?.[0]) ||
    resolveImage(fallbackImage);

  const productUrl = product.slug || product.id || product._id;
  const colorSwatches = (product.colors || []).filter(
    (color) => color.code || color.hex || color.image || color.name
  );
  const sizePrices = (product.sizes || [])
    .map((entry) => (typeof entry === "object" ? Number(entry.price) : NaN))
    .filter((price) => Number.isFinite(price));
  const legacySizePrices = (product.sizeStocks || [])
    .map((entry) => Number(entry.price))
    .filter((price) => Number.isFinite(price));
  const hasSizePricing = sizePrices.length > 0 || legacySizePrices.length > 0;
  const displayPrice = hasSizePricing
    ? Math.min(...(sizePrices.length ? sizePrices : legacySizePrices))
    : Number(product.price ?? 0);

  const stockStatus =
    !product.available || product.stock <= 0
      ? {
          text: "Rupture de stock",
          className: "bg-[#FDECEC] text-[#B84C47]",
        }
      : product.stock <= 5
      ? {
          text: `Plus que ${product.stock} en stock`,
          className: "bg-[#FFF3E6] text-[#A76228]",
        }
      : {
          text: "En stock",
          className: "bg-[#EEF9F1] text-[#2F7D57]",
        };

  return (
    <article className="group overflow-hidden rounded-[16px] border border-[#E9E0D6] bg-[#FFFDFB] shadow-[0_8px_22px_rgba(17,17,17,0.04)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(17,17,17,0.05)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F8F5F0] p-2.5">
        <Link
          to={`/produit/${productUrl}`}
          onClick={() => trackSelectItem(product)}
          className="flex h-full w-full items-center justify-center overflow-hidden rounded-[12px]"
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={product.name}
              loading="lazy"
              decoding="async"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.srcset = "";
                event.currentTarget.src = resolveImage(fallbackImage);
              }}
              className="h-full w-full scale-[1.28] rounded-[10px] object-contain transition-transform duration-500 group-hover:scale-[1.34]"
            />
          ) : (
            <div className="text-xs text-[var(--velora-textGray)]">
              Image indisponible
            </div>
          )}
        </Link>

        {product.badge === "new" && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[var(--velora-primary)] px-2 py-0.5 text-[7px] font-bold uppercase tracking-[0.12em] text-white shadow-sm">
            Nouveau
          </span>
        )}

        {product.badge === "special" && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#FFCB56] px-2 py-0.5 text-[7px] font-bold uppercase tracking-[0.12em] text-white shadow-sm">
            Offre spéciale
          </span>
        )}
      </div>

      <div className="space-y-2 p-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {colorSwatches.slice(0, 4).map((color, index) => (
              <span
                key={`${color.name}-${index}`}
                className="relative h-3.5 w-3.5 overflow-hidden rounded-[4px] border border-[#D8C7B2] bg-white"
                style={{
                  backgroundColor: color.code || color.hex || "#F4EEE7",
                }}
                title={color.name}
              >
                {color.type === "image" && color.image && (
                  <img
                    src={resolveImage(color.image)}
                    alt={color.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </span>
            ))}

            {colorSwatches.length === 0 && (
              <span className="text-[9px] font-semibold text-[var(--velora-textGray)]">
                Couleurs variées
              </span>
            )}

            {colorSwatches.length > 4 && (
              <span className="text-[9px] font-semibold text-[var(--velora-textGray)]">
                +{colorSwatches.length - 4}
              </span>
            )}
          </div>

          <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[var(--velora-textGray)]">
            {product.category || "Produit"}
          </span>
        </div>

        <Link to={`/produit/${productUrl}`} className="block" onClick={() => trackSelectItem(product)}>
          <h3 className="line-clamp-2 text-[12.5px] font-semibold leading-5 text-[var(--velora-dark)] transition-colors hover:text-[var(--velora-primary)]">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="line-clamp-2 text-[10.5px] leading-5 text-[var(--velora-textGray)]">
            {product.description.length > 70
              ? `${product.description.slice(0, 70)}…`
              : product.description}
          </p>
        )}

        <div className="flex items-end justify-between gap-2 pt-0.5">
          <div className="min-w-0">
            <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[var(--velora-textGray)]">
              {hasSizePricing ? "À partir de" : "Prix"}
            </p>
            <p className="mt-1 text-[19px] font-bold leading-none text-[var(--velora-dark)]">
              {displayPrice.toFixed(0)}
              <span className="ml-1 text-[11px] font-semibold">DT</span>
            </p>
          </div>

          <Link
            to={`/produit/${productUrl}`}
            className="group/cart inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#E7DED2] bg-white text-[var(--velora-dark)] transition-all duration-200 hover:border-[var(--velora-primary)] hover:bg-[var(--velora-primary)] hover:text-white"
            aria-label={`Voir ${product.name}`}
          >
            <ShoppingCart
              size={14}
              className="transition-transform duration-200 group-hover/cart:scale-105"
            />
          </Link>
        </div>

        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-[8px] font-semibold ${stockStatus.className}`}
        >
          {stockStatus.text}
        </span>
      </div>
    </article>
  );
}
