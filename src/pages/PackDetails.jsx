import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag } from "lucide-react";

import { getPackById } from "../services/packApi";
import { useCart } from "../context/CartContext";
import ValuesSection from "../components/ValuesSection";
import { resolveAssetUrl } from "../config/api";

const formatPrice = (value) => `${Math.floor(Number(value || 0))} DT`;

export default function PackDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addPackToCart } = useCart();

  const [pack, setPack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("Standard");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchPack = async () => {
      setLoading(true);
      try {
        const data = await getPackById(id);
        setPack(data);
        setImageIndex(0);
        setSelectedSize(data?.compatibleSizes?.includes("Standard") ? "Standard" : data?.compatibleSizes?.[0] || "Standard");
      } catch (error) {
        toast.error(error?.response?.data?.message || "Pack introuvable.");
        setPack(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPack();
  }, [id]);

  const gallery = useMemo(() => {
    if (!pack) return [];

    const rawImages = pack.images?.length
      ? pack.images
      : pack.image
        ? [pack.image]
        : [];

    return [...new Set(rawImages.map((image) => resolveAssetUrl(image)).filter(Boolean))];
  }, [pack]);

  const currentImage = gallery[imageIndex] || gallery[0] || "/assets/chien2.png";
  const hasMultipleImages = gallery.length > 1;

  const nextImage = () => {
    if (hasMultipleImages) setImageIndex((previous) => (previous + 1) % gallery.length);
  };

  const previousImage = () => {
    if (hasMultipleImages) setImageIndex((previous) => (previous - 1 + gallery.length) % gallery.length);
  };

  const pricePreview = useMemo(() => {
    if (!pack) return { final: 0, subtotal: 0, discount: 0 };
    const selected = pack.compatibleSizes?.includes(selectedSize)
      ? selectedSize
      : pack.compatibleSizes?.[0] || "Standard";

    const preview = pack.pricePreview?.[selected] || pack.pricePreview || { final: 0 };
    return typeof preview === "object" ? preview : { final: Number(preview || 0) };
  }, [pack, selectedSize]);

  const stockPreview = useMemo(() => {
    if (!pack) return 0;
    const selected = pack.compatibleSizes?.includes(selectedSize)
      ? selectedSize
      : pack.compatibleSizes?.[0] || "Standard";
    return Number(pack.stockPreview?.[selected] ?? pack.stockPreview ?? 0);
  }, [pack, selectedSize]);

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center text-velora-dark">Chargement du pack…</div>;
  }

  if (!pack) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 bg-[#F7F3EC] px-6 text-center">
        <h1 className="font-premium text-3xl text-velora-dark">Pack introuvable</h1>
        <Link to="/shop" className="inline-flex h-11 items-center rounded-lg bg-velora-gold px-5 text-sm font-semibold text-white">Retour à la boutique</Link>
      </div>
    );
  }

  const availableSizes = pack.compatibleSizes || ["Standard"];
  const inStock = stockPreview > 0;

  const handleAddToCart = () => {
    if (!inStock) {
      toast.error("Ce pack n'est plus disponible dans cette taille.");
      return;
    }

    addPackToCart({ ...pack, pricePreview: { final: pricePreview.final }, price: pricePreview.final }, selectedSize, quantity);
    toast.success(`${pack.name} ajouté au panier`);
  };

  const handleBuyNow = () => {
    if (!inStock) {
      toast.error("Ce pack n'est plus disponible dans cette taille.");
      return;
    }

    addPackToCart({ ...pack, pricePreview: { final: pricePreview.final }, price: pricePreview.final }, selectedSize, quantity);
    navigate("/cart?checkout=1");
  };

  const discountPercentage = pack.discountType === "percentage" ? Math.floor(Number(pack.discountValue || 0)) : 0;

  return (
    <div className="min-h-[60vh] bg-[#F7F3EC] py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-16">
        <Link to="/shop" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-velora-gold">
          <ArrowLeft size={16} /> Retour boutique
        </Link>

        <div className="overflow-hidden rounded-2xl border border-[#E8DED1] bg-white shadow-[0_12px_40px_rgba(17,17,17,0.06)]">
          <div className="grid items-start gap-2 px-2 pb-4 pt-3 sm:gap-4 sm:px-4 sm:pb-5 sm:pt-4 lg:grid-cols-2 lg:gap-5 lg:px-6 lg:pb-6 lg:pt-5">
            <div className="flex flex-col">
              <div className="overflow-hidden rounded-[22px] border border-[#E8DED1] bg-[#FAF8F4] shadow-[0_12px_32px_rgba(17,17,17,0.04)]">
                <div className="relative aspect-square w-full overflow-hidden rounded-[18px] bg-[#FAF8F4] p-3 sm:p-4">
                  {discountPercentage > 0 && (
                    <span className="absolute left-4 top-4 z-20 rounded-md bg-[#9B2C2C] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white shadow-sm">
                      -{discountPercentage} %
                    </span>
                  )}
                  <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end gap-2">
                    <div className="flex h-[30px] items-center justify-center rounded-lg border border-[#D9D5CF] bg-[#F2F8F3] px-3 text-[10px] font-semibold text-[#C95318]">
                      {formatPrice(pricePreview.final)}
                    </div>
                    <div className={`flex h-[30px] min-w-[76px] items-center justify-center gap-1.5 rounded-lg border border-[#D9D5CF] px-2 text-[10px] font-semibold ${inStock ? "bg-[#EAF7EE] text-[#16803C]" : "bg-[#FBF1F1] text-[#A45A5A]"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${inStock ? "bg-[#16803C]" : "bg-[#B86666]"}`} />
                      {inStock ? "En stock" : "Rupture"}
                    </div>
                  </div>
                  {hasMultipleImages && (
                    <>
                      <button type="button" onClick={previousImage} aria-label="Image précédente" className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E8DED1] bg-white/90 shadow-sm transition hover:border-velora-gold hover:text-velora-gold">
                        <ChevronLeft size={16} />
                      </button>
                      <button type="button" onClick={nextImage} aria-label="Image suivante" className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E8DED1] bg-white/90 shadow-sm transition hover:border-velora-gold hover:text-velora-gold">
                        <ChevronRight size={16} />
                      </button>
                    </>
                  )}
                  <img src={currentImage} alt={pack.name} className="h-full w-full scale-[1.05] rounded-[14px] object-contain" loading="eager" />
                </div>
              </div>
              {gallery.length > 1 && (
                <div className="mt-2 flex justify-center gap-2 overflow-x-auto sm:mt-3 sm:gap-3">
                  {gallery.map((image, index) => (
                    <button key={image} type="button" onClick={() => setImageIndex(index)} aria-label={`Afficher l'image ${index + 1}`} className={`flex-none overflow-hidden rounded-xl border transition-all duration-200 ${imageIndex === index ? "border-[#C89B5A] shadow-[0_0_0_1px_rgba(200,155,90,0.2)]" : "border-[#E8DED1] hover:border-[#C89B5A]/70"}`}>
                      <div className="h-16 w-20 overflow-hidden rounded-lg bg-[#FAF8F4] p-1.5">
                        <img src={image} alt={`${pack.name} ${index + 1}`} loading="lazy" decoding="async" className="mx-auto h-full w-full rounded-md object-contain" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex h-full flex-col lg:pt-4">
              <div className="mb-3">
                <span className="inline-flex items-center rounded-lg border border-[#D9D5CF] bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#4E4741]">
                  Pack signature
                </span>
              </div>

              <h1 className="font-premium text-xl font-medium leading-tight tracking-[-0.02em] text-black sm:text-2xl">{pack.name}</h1>
              <p className="mt-3 max-w-xl whitespace-pre-line text-sm leading-6 text-[#77716B]">
                {pack.description || "Un pack pensé pour un quotidien plus simple et élégant."}
              </p>

              <div className="mt-5 flex items-end gap-3 border-y border-[#EFE7DC] py-4">
                <span className="font-premium text-2xl font-semibold text-[#292929]">{formatPrice(pricePreview.final)}</span>
                {pricePreview.subtotal > pricePreview.final && (
                  <span className="text-sm text-[#9A938C] line-through">{formatPrice(pricePreview.subtotal)}</span>
                )}
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold uppercase tracking-[0.18em] text-[#403A35]">Taille</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`relative flex h-11 w-11 items-center justify-center rounded-md border text-base font-bold transition-all duration-200 ${selectedSize === size ? "border-[#C89B5A] bg-[#C89B5A] text-white ring-1 ring-[#C89B5A] ring-offset-1" : "border-[#DED7CF] bg-white text-[#4B4743] hover:scale-105 hover:border-[#C89B5A]"}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row">
                <div className="flex h-12 w-fit items-center rounded-lg border border-[#DED7CF] bg-white">
                  <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Réduire la quantité" className="flex h-12 w-11 items-center justify-center text-[#4A4540] transition hover:bg-[#F8F5F0]"><Minus size={15} strokeWidth={1.8} /></button>
                  <div className="flex h-7 min-w-[38px] items-center justify-center border-x border-[#E7E0D8] text-sm font-semibold text-[#292929]">{quantity}</div>
                  <button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label="Augmenter la quantité" className="flex h-12 w-11 items-center justify-center text-[#4A4540] transition hover:bg-[#F8F5F0]"><Plus size={15} strokeWidth={1.8} /></button>
                </div>

                <button type="button" onClick={handleBuyNow} disabled={!inStock} className="flex h-12 min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-velora-gold px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-velora-goldHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-velora-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <ShoppingBag size={17} strokeWidth={1.8} /> Commander maintenant
                </button>
              </div>

            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-[#E8DED1] bg-white p-5 sm:p-6">
          <h2 className="font-premium text-2xl font-bold text-velora-dark">Contenu du pack</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {(pack.components || []).map((item) => (
              <div key={item.product?._id || item.product} className="flex items-start gap-3 rounded-xl border border-[#E7DED2] bg-[#FCFAF7] p-3">
                <div className="flex shrink-0 gap-2 overflow-x-auto">
                  {(item.product?.images?.length ? item.product.images : [item.product?.image]).filter(Boolean).map((image, imageIndex) => (
                    <img key={`${image}-${imageIndex}`} src={resolveAssetUrl(image) || "/assets/chien2.png"} alt={item.product?.name || "Produit"} className="h-16 w-16 rounded-lg object-cover" />
                  ))}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-velora-dark">{item.product?.name || "Produit"}</p>
                  <p className="text-sm text-velora-textGray">Quantité : {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <ValuesSection />
      </div>
    </div>
  );
}
