import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, Minus, Plus, Ruler, ShoppingBag } from "lucide-react";

import { useCart } from "../context/CartContext";
import { API_BASE_URL, resolveAssetUrl } from "../config/api";

const fallbackSizes = ["XS", "S", "M", "L"];
const fallbackColors = [{ name: "Noir", code: "#111111" }];

const resolveImage = resolveAssetUrl;

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

  const gallery = useMemo(() => {
    if (!product) return [];
    const images = [product.image, ...(product.images || [])]
      .map(resolveImage)
      .filter(Boolean);
    return [...new Set(images)];
  }, [product]);

  const currentImage = gallery[imageIndex] || gallery[0] || "";
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
  const inStock = product.stock === undefined || Number(product.stock) > 0;
  const categoryLabel = product.category?.name || product.category || "Collection SMILEY WOOF";
  const discount = product.oldPrice > product.price ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : null;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    toast.success(`${product.name} ajoute au panier`);
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] pb-16">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 pt-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#C87422] transition">
            Accueil
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#C87422] transition">
            Boutique
          </Link>
          <span>/</span>
          <span className="font-semibold text-gray-900">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-[90px_1fr_430px] gap-8">
          {/* THUMBNAILS */}
          <div className="flex lg:flex-col gap-4">
            {gallery.map((image, index) => (
              <button
                key={index}
                onClick={() => setImageIndex(index)}
                className={`
                  h-20
                  w-20
                  rounded-2xl
                  overflow-hidden
                  bg-white
                  border
                  transition-all
                  duration-300
                  ${
                    imageIndex === index
                      ? "border-[#C87422] ring-2 ring-[#C87422] shadow-lg"
                      : "border-[#ECE6DE] hover:border-[#C87422]"
                  }
                `}
              >
                <img src={image} alt={`${product.name} ${index + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          {/* IMAGE */}
          <div className="relative bg-white rounded-3xl shadow-lg border border-[#EEE6DC] p-8">
            <div className="relative h-[650px] rounded-2xl bg-[#FAF8F4] flex items-center justify-center overflow-hidden">
              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    className="
                      absolute
                      left-6
                      top-1/2
                      -translate-y-1/2
                      h-12
                      w-12
                      rounded-full
                      bg-white
                      shadow-lg
                      hover:scale-105
                      transition
                      z-20
                    "
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="
                      absolute
                      right-6
                      top-1/2
                      -translate-y-1/2
                      h-12
                      w-12
                      rounded-full
                      bg-white
                      shadow-lg
                      hover:scale-105
                      transition
                      z-20
                    "
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              <motion.img
                key={currentImage}
                src={currentImage}
                alt={product.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="max-h-full max-w-full object-contain"
              />

              <button className="absolute bottom-6 right-6 h-12 w-12 rounded-full bg-white shadow-lg flex items-center justify-center">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path d="M15 3h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M21 3L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M9 21H3v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M3 21l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* PRODUCT CARD */}
          <motion.aside
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-white rounded-3xl border border-[#EEE6DC] shadow-lg p-8 h-fit sticky top-24"
          >
            <span className="uppercase tracking-[0.3em] text-xs font-bold text-[#C87422]">{categoryLabel}</span>
            <h1 className="mt-3 text-5xl font-black text-[#222] leading-tight">{product.name}</h1>

            <div className="mt-6 flex items-center justify-between">
              <div>
                <div className="text-5xl font-black text-[#C87422]">{formatPrice(product.price)}</div>
                {product.oldPrice > product.price && (
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-lg line-through text-gray-400">{formatPrice(product.oldPrice)}</span>
                    <span className="bg-[#C87422] text-white rounded-full px-3 py-1 text-xs font-bold">-{discount}%</span>
                  </div>
                )}
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                {inStock ? "En stock" : "Rupture"}
              </span>
            </div>

            <hr className="my-8 border-[#EFE7DC]" />
            <div>
              <h3 className="uppercase tracking-[0.2em] text-xs font-bold text-gray-500">Description</h3>
              <p className="mt-4 leading-8 text-gray-600">{product.description}</p>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between">
                <span className="uppercase tracking-[0.2em] text-xs font-bold">Taille</span>
                <Link to="/size-guide" className="flex items-center gap-2 text-sm text-[#C87422]">
                  <Ruler size={15} />
                  Guide des tailles
                </Link>
              </div>

              <div className="flex gap-3 mt-4 flex-wrap">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      h-12
                      min-w-[52px]
                      rounded-xl
                      border
                      font-semibold
                      transition
                      ${selectedSize === size ? "bg-[#C87422] text-white border-[#C87422]" : "bg-white border-[#E5DED5] hover:border-[#C87422]"}
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <span className="uppercase tracking-[0.2em] text-xs font-bold">Couleur</span>
              <div className="flex gap-4 mt-4">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    style={{ backgroundColor: color.code || color.hex }}
                    className={`
                      relative
                      h-12
                      w-12
                      rounded-xl
                      border-2
                      transition
                      ${selectedColor?.name === color.name ? "border-[#C87422] scale-105" : "border-[#E5DED5]"}
                    `}
                  >
                    {selectedColor?.name === color.name && (
                      <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">✓</div>
                    )}
                  </button>
                ))}
              </div>

              <p className="mt-3 text-sm text-gray-500">
                Couleur sélectionnée :
                <span className="font-semibold text-[#222]"> {selectedColor?.name}</span>
              </p>
            </div>

            <div className="mt-10 flex items-end gap-5">
              <div>
                <span className="uppercase tracking-[0.2em] text-xs font-bold">Quantité</span>
                <div className="mt-3 flex h-14 overflow-hidden rounded-xl border border-[#E5DED5]">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-14 hover:bg-[#F7F3EC]">
                    <Minus size={18} />
                  </button>
                  <div className="flex w-14 items-center justify-center border-x">{quantity}</div>
                  <button onClick={() => setQuantity((q) => q + 1)} className="w-14 hover:bg-[#F7F3EC]">
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 h-14 rounded-xl bg-[#C87422] text-white font-bold uppercase tracking-wider shadow-lg transition-all duration-300 hover:bg-[#B7641B] hover:-translate-y-1"
              >
                <div className="flex justify-center items-center gap-3">
                  <ShoppingBag size={20} />
                  Ajouter au panier
                </div>
              </button>
            </div>
          </motion.aside>
        </div>

        <div className="mt-12">
          <div className="grid md:grid-cols-4 bg-white rounded-3xl border border-[#ECE6DE] shadow-md overflow-hidden">
            {[
              {
                icon: "🛡️",
                title: "MATÉRIAUX DE QUALITÉ",
                text: "Résistants et durables",
              },
              {
                icon: "🪶",
                title: "LÉGER & CONFORTABLE",
                text: "Conçu pour le bien-être",
              },
              {
                icon: "🎚️",
                title: "AJUSTABLE",
                text: "S'adapte parfaitement",
              },
              {
                icon: "✨",
                title: "DESIGN ÉLÉGANT",
                text: "Style moderne",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className={`p-8 text-center ${index !== 3 ? "border-b md:border-b-0 md:border-r border-[#F0EBE4]" : ""}`}
              >
                <div className="text-4xl mb-5">{item.icon}</div>
                <h4 className="text-sm font-bold tracking-widest text-[#222]">{item.title}</h4>
                <p className="mt-3 text-sm text-gray-500 leading-7">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-2xl border border-[#ECE6DE] shadow-md p-7 flex items-center gap-5 hover:shadow-xl transition">
            <div className="w-14 h-14 rounded-2xl bg-[#F8F3EC] flex items-center justify-center text-3xl">🚚</div>
            <div>
              <h4 className="font-bold text-lg">Livraison rapide</h4>
              <p className="text-gray-500 mt-1">Livraison partout en Tunisie</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#ECE6DE] shadow-md p-7 flex items-center gap-5 hover:shadow-xl transition">
            <div className="w-14 h-14 rounded-2xl bg-[#F8F3EC] flex items-center justify-center text-3xl">🔄</div>
            <div>
              <h4 className="font-bold text-lg">Retours</h4>
              <p className="text-gray-500 mt-1">Retour sous 14 jours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
