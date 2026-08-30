import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, Feather, Minus, Plus, Ruler, ShieldCheck, ShoppingBag, SlidersHorizontal, Sparkles } from "lucide-react";
import ValuesSection from '../components/ValuesSection';

import { useCart } from "../context/CartContext";
import { API_BASE_URL, resolveAssetUrl } from "../config/api";

const fallbackSizes = ["XS", "S", "M", "L"];
const fallbackColors = [{ name: "Noir", code: "#111111" }];


const formatPrice = (price) => `${Number(price || 0).toFixed(0)} DT`;

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const setInitialProductState = (item) => {
      setProduct(item);
      setSelectedSize(item.sizes?.[0] || fallbackSizes[0]);
      setSelectedColor(item.colors?.[0] || fallbackColors[0]);
      setImageIndex(0);
      setQuantity(1);
    };

    const fetchProduct = async () => {
      setLoading(true);

      try {
        const { data } = await axios.get(`${API_BASE_URL}/products/${id}`);
        setInitialProductState(data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // const gallery = useMemo(() => {
  //   if (!product) return [];
  //   const images = [product.image, ...(product.images || [])].map(resolveImage).filter(Boolean);
  //   return [...new Set(images)];
  // }, [product]);
  const gallery = useMemo(() => {
  if (!product) return [];

  const rawImages = product.images?.length
    ? product.images
    : product.image
      ? [product.image]
      : [];

  const images = rawImages
    .map((image) => resolveAssetUrl(image))
    .filter(Boolean);

  return [...new Set(images)];
}, [product]);

  const currentImage = gallery[imageIndex] || gallery[0] || null;
  const hasMultipleImages = gallery.length > 1;

  const nextImage = () => {
    if (!hasMultipleImages) return;
    setImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (!hasMultipleImages) return;
    setImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F3EC] font-premium text-xl text-velora-dark">
        Chargement...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F3EC] font-premium text-xl text-velora-dark">
        Produit introuvable
      </div>
    );
  }

  const colors = product.colors?.length ? product.colors : fallbackColors;
  const sizes = product.sizes?.length ? product.sizes : fallbackSizes;
  // const inStock = product.stock === undefined || Number(product.stock) > 0;
  const stockCount =
  product.stock === undefined
    ? null
    : Number(product.stock);

const inStock =
  stockCount === null || stockCount > 0;
  const categoryLabel = product.category?.name || product.category || "Chats";
  const discount = product.oldPrice > product.price ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : null;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    toast.success(`${product.name} ajouté au panier`);
  };

  return (
    <div className="min-h-[60vh] bg-[#F7F3EC] py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-16 xl:px-16">
        <div className="bg-white border border-[#E8DED1] rounded-md shadow-[0_12px_40px_rgba(17,17,17,0.06)] overflow-hidden">

          {/* Subtle back link */}
         {/* Retour à la boutique — coin droit */}
{/* <div className="flex justify-end px-4 py-4">
  <Link
    to="/shop"
    className="inline-flex items-center rounded-lg border border-[#E7DED2] bg-white px-3 py-2 text-xs font-medium text-[#5F5750] transition-all duration-200 hover:border-[#CFC5B8] hover:bg-[#FCFAF7] hover:text-velora-gold"
  >
    ← Boutique
  </Link>
</div> */}

<div className="grid items-start gap-2 px-2 pt-3 pb-4 sm:gap-4 sm:px-4 sm:pt-4 sm:pb-5 lg:grid-cols-2 lg:gap-5 lg:px-6 lg:pt-5 lg:pb-6">   <div className="flex flex-col">
  <div className="flex-1 overflow-hidden rounded-[22px] border border-[#E8DED1] bg-[#FAF8F4] shadow-[0_12px_32px_rgba(17,17,17,0.04)]">
                  <div className="relative">
                    {/* PRICE + STOCK — bottom right of image */}
<div className="absolute bottom-4 right-4 z-20 flex flex-col items-end gap-2">

  {/* PRICE */}
  <div className="flex h-[30px] w-[76px] items-center justify-center border border-[#D9D5CF] rounded-lg bg-[#F2F8F3] text-[10px] font-semibold text-[#C95318]">
    {formatPrice(product.price)}
  </div>

  {/* STOCK */}
  <div
  className={`flex h-[30px] w-auto min-w-[76px] items-center justify-center gap-1.5 border border-[#D9D5CF] rounded-lg text-[10px] font-semibold ${
  !inStock
    ? "bg-[#FBF1F1] text-[#A45A5A]"
    : stockCount !== null && stockCount <= 5
    ? "bg-[#FFF4E8] text-[#C95318]"
    : "bg-[#EAF7EE] text-[#16803C]"
}`}
  >
   <span
  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
    !inStock
      ? "bg-[#B86666]"
      : stockCount !== null && stockCount <= 5
      ? "bg-[#C95318]"
      : "bg-[#16803C]"
  }`}
/>

{!inStock
  ? "Rupture"
  : stockCount !== null && stockCount <= 5
  ? `Plus que ${stockCount}`
  : "En stock"}  </div>

</div>
                  {hasMultipleImages && (
                    <>
                      <button
                        type="button"
                        onClick={prevImage}
                        aria-label="Image précédente"
                        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 border border-[#E8DED1] shadow-sm hover:border-smiley-warning hover:text-velora-gold"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={nextImage}
                        aria-label="Image suivante"
                        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 border border-[#E8DED1] shadow-sm hover:border-velora-gold hover:text-velora-gold"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </>
                  )}

<div className="aspect-square w-full overflow-hidden rounded-[18px] bg-[#FAF8F4] p-3 sm:p-4">
  {currentImage ? (
    <img
      src={currentImage}
      alt={product.name}
className="h-full w-full scale-[1.10] rounded-[14px] object-contain"      loading="eager"
      onError={(e) => {
        console.error("Erreur image produit:", currentImage);
        e.currentTarget.style.display = "none";
      }}
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center rounded-[14px] text-sm text-velora-textGray">
      Image indisponible
    </div>
  )}
</div>
                </div>
              </div>

            {gallery.length > 1 && (
<div className="mt-2 flex justify-center gap-2 overflow-x-auto sm:mt-3 sm:gap-3">
      {gallery.map((image, index) => (
      <button
        key={index}
        type="button"
        onClick={() => setImageIndex(index)}
        className={`flex-none overflow-hidden rounded-xl border transition-all duration-200 ${
          imageIndex === index
            ? "border-[#C89B5A] shadow-[0_0_0_1px_rgba(200,155,90,0.2)]"
            : "border-[#E8DED1] hover:border-[#C89B5A]/70"
        }`}
      >
        <div className="h-16 w-20 overflow-hidden rounded-lg bg-[#FAF8F4] p-1.5">
          <img
            src={image}
            alt={`${product.name} ${index + 1}`}
            className="mx-auto h-full w-full rounded-md object-contain"
          />
        </div>
      </button>
    ))}
  </div>
)}
            </div>

            {/* RIGHT: Info */}
            {/* =========================================================
    RIGHT: INFO — UI / UX
========================================================= */}
<div className="flex h-full flex-col lg:pt-4">
  {/* Category */}
  <div className="mb-3">
<span className="inline-flex items-center rounded-lg border border-[#D9D5CF] bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#4E4741] transition-all duration-200 hover:border-smiley-warning hover:text-smiley-warning">      {categoryLabel}
    </span>
  </div>

  {/* Product title + description */}
  <div>
    <h1 className="font-premium text-black text-xl sm:text-2xl font-medium leading-tight tracking-[-0.02em] ">
  {product.name}
</h1>
      

    <p className="mt-3 max-w-xl text-sm leading-6 text-[#77716B]">
      {product.description ||
        "Un collier élégant et confortable pour votre compagnon, léger et ajustable."}
    </p>
  </div>

  {/* Price / Stock */}
  {/* <div className="mt-5 flex items-center justify-between border-y border-[#EFE7DC] py-4">

    <div className="flex items-end gap-3">
      <span className="font-premium text-2xl font-semibold text-[#292929]">
        {formatPrice(product.price)}
      </span>

      {product.oldPrice > product.price && (
        <span className="pb-0.5 text-sm text-[#9A938C] line-through">
          {formatPrice(product.oldPrice)}
        </span>
      )}

      {discount && (
        <span className="rounded-md bg-[#F4EEE7] px-2 py-1 text-[10px] font-semibold text-[#5F5750]">
          -{discount}%
        </span>
      )}
    </div>

    <div
  className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-semibold ${
    inStock
      ? "bg-[#F2F8F3] text-[#4E7958]"
      : "bg-[#FBF1F1] text-[#A45A5A]"
  }`}
>
  <span
    className={`h-1.5 w-1.5 rounded-full ${
      inStock
        ? "bg-[#5B9365]"
        : "bg-[#B86666]"
    }`}
  />

  {inStock ? "En stock" : "Rupture"}
</div>

  </div> */}


  {/* Product options */}
  <div className="mt-6 space-y-6">

    {/* SIZE */}
    <div>

      <div className="mb-3 flex items-center justify-between">

        <div>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#625B54]">
            Taille
          </span>
           <Link
          to="/size-guide"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-smiley-warning underline underline-offset-4 transition hover:text-velora-gold"
        >
          <Ruler size={14} strokeWidth={1.7} />
          Guide des tailles
        </Link>
          {/* <span className="mt-1 block text-xs text-[#99918A]">
            Sélectionnez une taille
          </span> */}
        </div>

        

      </div>

      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => setSelectedSize(size)}
            className={`flex h-11 w-[54px] items-center justify-center rounded-md border text-xs font-semibold transition-all duration-200 ${
              selectedSize === size
                ? "border-[#C89B5A] bg-[#C89B5A] text-white shadow-[0_0_0_1px_rgba(200,155,90,0.15)]"
                : "border-[#E2DCD4] bg-white text-[#4B4743] hover:border-[#C89B5A] hover:text-[#C89B5A]"
            }`}
          >
            {size}
          </button>
        ))}
      </div>

    </div>


    {/* COLOR */}
    <div>

      <div className="mb-3">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#625B54]">
          Couleur
        </span>

        <span className="mt-1 block text-xs text-smiley-warning">
          {selectedColor?.name || "Sélectionnez une couleur"}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">

        {colors.map((color) => (
          <button
            key={color.name}
            type="button"
            onClick={() => setSelectedColor(color)}
            style={{
              backgroundColor: color.code || color.hex,
            }}
            aria-label={`Choisir ${color.name}`}
            className={`relative h-10 w-10 rounded-md border transition-all duration-200 ${
              selectedColor?.name === color.name
                ? "border-[#C89B5A] ring-1 ring-[#C89B5A] ring-offset-1"
                : "border-[#DED7CF] hover:border-[#C89B5A] hover:scale-105"
            }`}
          >
            {selectedColor?.name === color.name && (
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white drop-shadow-sm">
                ✓
              </span>
            )}
          </button>
        ))}

      </div>

    </div>

  </div>


  {/* Quantity + Add to cart */}
{/* Quantity + Add to cart */}
<div className="mt-7 flex flex-row items-stretch gap-3 sm:flex-row">

  {/* Quantity */}
  <div className="flex h-12 w-fit items-center rounded-lg border border-[#DED7CF] bg-white">

    <button
      type="button"
      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
      aria-label="Réduire la quantité"
      className="flex h-12 w-11 items-center justify-center text-[#4A4540] transition hover:bg-[#F8F5F0]"
    >
      <Minus size={15} strokeWidth={1.8} />
    </button>

    <div className="flex h-7 min-w-[38px] items-center justify-center border-x border-[#E7E0D8] text-sm font-semibold text-[#292929]">
      {quantity}
    </div>

    <button
      type="button"
      onClick={() => setQuantity((q) => q + 1)}
      aria-label="Augmenter la quantité"
      className="flex h-12 w-11 items-center justify-center text-[#4A4540] transition hover:bg-[#F8F5F0]"
    >
      <Plus size={15} strokeWidth={1.8} />
    </button>

  </div>

  {/* Add to cart */}
  <button
    type="button"
    onClick={handleAddToCart}
    disabled={!inStock}
    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-smiley-warning px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-velora-goldHover hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
  >
    <ShoppingBag size={17} strokeWidth={1.8} />
    Ajouter au panier
  </button>

</div>


  {/* Trust / Benefits */}
  {/* <div className="mt-7 border-t border-[#EFE7DC] pt-5">

    <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4">

      {[
        {
          icon: ShieldCheck,
          title: "Qualité",
          text: "Matériaux durables",
        },
        {
          icon: Feather,
          title: "Confort",
          text: "Léger au quotidien",
        },
        {
          icon: SlidersHorizontal,
          title: "Ajustable",
          text: "Adapté à votre compagnon",
        },
        {
          icon: Sparkles,
          title: "Design",
          text: "Élégant & moderne",
        },
      ].map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="flex flex-col items-center text-center"
          >

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F8F4EE] text-[#5F5750]">
              <Icon size={17} strokeWidth={1.7} />
            </div>

            <h4 className="mt-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#3F3A36]">
              {item.title}
            </h4>

            <p className="mt-1 text-[10px] leading-4 text-[#928A83]">
              {item.text}
            </p>

          </div>
        );
      })}

    </div>

  </div> */}


</div>

          </div>
            <ValuesSection />

        </div>
      </div>
    </div>
  );
}
