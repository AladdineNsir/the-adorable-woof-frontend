import React, { useEffect, useState } from "react";
import { createOrder } from "../services/orderApi";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  CheckCircle2,
  CreditCard,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getTrackingAttribution, trackAddPaymentInfo, trackAddShippingInfo, trackBeginCheckout, trackRemoveFromCart, trackViewCart } from "../analytics/analytics";

const initialShippingAddress = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  address: "",
  zipCode: "",
};

const inputClass =
  "h-11 w-full rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-4 text-sm text-velora-dark outline-none transition focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10";

const formatPrice = (price) => `${Math.floor(Number(price || 0))} DT`;
const getCartItemPrice = (item) => item.type === "pack" ? Math.floor(Number(item.price || 0)) : Number(item.price || 0);

const getUserShippingAddress = (user) => ({
  fullName: user?.name || "",
  phone: user?.phone || "",
  email: user?.email || "",
  city: user?.address?.city || "",
  address: user?.address?.street || "",
  zipCode: user?.address?.zipCode || "",
});

export default function Cart() {
  const [searchParams] = useSearchParams();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  } = useCart();

  const { user } = useAuth();

  const [shippingAddress, setShippingAddress] = useState(
    initialShippingAddress
  );
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [error, setError] = useState("");

  const shippingPrice = cart.length > 0 ? 7 : 0;
  const itemsTotal = getCartTotal();
  const total = itemsTotal + shippingPrice;
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    if (!user) return;

    const userShippingAddress = getUserShippingAddress(user);

    setShippingAddress((prev) => ({
      fullName: prev.fullName || userShippingAddress.fullName,
      phone: prev.phone || userShippingAddress.phone,
      email: prev.email || userShippingAddress.email,
      city: prev.city || userShippingAddress.city,
      address: prev.address || userShippingAddress.address,
      zipCode: prev.zipCode || userShippingAddress.zipCode,
    }));
  }, [user]);

  useEffect(() => {
    if (cart.length > 0) trackViewCart(cart);
  }, [cart]);

  useEffect(() => {
    if (searchParams.get("checkout") === "1") {
      window.setTimeout(() => {
        document.getElementById("checkout-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    }
  }, [searchParams]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;

    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (cart.length === 0) {
      toast.error("Votre panier est vide.");
      return;
    }

    const orderItems = cart.map((item) => ({
      type: item.type || "product",
      product: item.product,
      packId: item.packId,
      packSlug: item.packSlug,
      name: item.name,
      image: item.image,
      components: item.components,
      quantity: item.quantity,
      price: item.type === "pack" ? Math.floor(Number(item.price || 0)) : item.price,
      selectedSize: item.selectedSize || "Standard",
      selectedColor: item.selectedColor || "Standard",
      customization: item.customization || {
        petName: "",
        phoneNumber: "",
      },
    }));

    try {
      setSubmitting(true);
      trackBeginCheckout(cart, total);
      trackAddShippingInfo(cart, total);
      trackAddPaymentInfo(cart, total);

     const data = await createOrder({
  orderItems,
  shippingAddress,
  shippingPrice,
  trackingAttribution: getTrackingAttribution(),
});

setOrderResult(data);
      clearCart();
      toast.success("Commande confirmee avec succes.");
      setShippingAddress(initialShippingAddress);
    } catch (err) {
      const message =
        err.response?.data?.message || "Impossible de creer la commande.";

      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] pt-0 pb-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-16 xl:px-16 py-6 sm:py-8">
       

        <div>
          <div className="px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="mt-2 text-2xl sm:text-3xl font-premium font-bold text-velora-dark">Finaliser la commande</h1>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-[#E7DED2] bg-white px-3 py-2 text-sm font-semibold text-velora-dark">
                <ShoppingBag size={16} className="text-velora-gold" />
<span>{cart.length} article{cart.length > 1 ? "s" : ""}</span>            </div>
            </div>
          </div>

          {orderResult && cart.length === 0 && (
            <div className="rounded-xl border border-green-200 bg-green-50/60 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 text-green-600" size={20} />
                <div>
                  <p className="text-sm font-semibold text-velora-dark">Commande envoyée avec succès.</p>
                  <p className="mt-1 text-sm leading-5 text-velora-textGray">Notre équipe vous contactera pour confirmer la livraison.</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-6 lg:gap-8 px-4 py-6 sm:grid-cols-[minmax(0,1fr)_360px] lg:grid-cols-[minmax(0,1fr)_380px] sm:px-6">
            <motion.main
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="min-w-0"
            >
              {cart.length === 0 ? (
                <div className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-[#E8DED1] bg-white px-6 py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF7EE] text-velora-gold">
                    <ShoppingBag size={30} />
                  </div>

                  <h2 className="mt-6 font-premium text-2xl sm:text-3xl font-bold text-velora-dark">Votre panier est vide</h2>

                  <p className="mt-3 max-w-md text-sm leading-7 text-velora-textGray">Decouvrez notre selection de colliers, laisses et harnais elegants pour chiens et chats.</p>

                  <Link to="/shop" className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-velora-gold px-6 text-sm font-semibold text-white transition hover:brightness-95">Continuer mes achats</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#EFE7DC] pb-3">
                    <div>
                      {/* <h2 className="font-premium text-xl font-bold text-velora-dark">
                        Articles selectionnes
                      </h2> */}
                      
                    </div>

                    <Link
                      to="/shop"
                      className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-velora-gold transition hover:text-velora-dark sm:inline-flex"
                    >
                      Continuer mes achats
                    </Link>
                  </div>

                  {cart.map((item) => (
                    <motion.article key={item.cartItemId} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-xl border border-[#E8DED1] bg-white transition-all duration-300 hover:border-velora-gold/50">
                      <div className="grid gap-3 p-3 md:grid-cols-[88px_minmax(0,1fr)_118px_118px_36px] md:items-center">
                        <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border border-[#EFE7DC] bg-[#FCFAF7] md:h-24 md:w-24">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                          ) : (
                            <Package size={22} className="text-[#C96A26]" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="line-clamp-2 text-sm sm:text-base font-semibold text-velora-dark">{item.name}</h3>
                          <p className="mt-1 text-sm font-semibold text-velora-dark">{formatPrice(item.price, item.type === "pack")}</p>

                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <span className="inline-flex items-center rounded-md border border-[#E7DED2] bg-[#FCFAF7] px-2 py-0.5 text-[10px] font-medium text-velora-dark">Taille: {item.selectedSize || "Standard"}</span>
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-[#E7DED2] bg-[#FCFAF7] px-2 py-0.5 text-[10px] font-medium text-velora-dark">{item.colorCode && (<span className="h-2.5 w-2.5 rounded-full border border-black/10" style={{ backgroundColor: item.colorCode }} />)}Couleur: {item.selectedColor || "Standard"}</span>
                          </div>

                          {(item.customization?.petName || item.customization?.phoneNumber) && (
                            <div className="mt-2 text-sm text-velora-textGray">
                              <span className="font-semibold text-velora-gold">Perso:</span>{' '}
                              <span className="text-velora-dark">{[item.customization.petName, item.customization.phoneNumber].filter(Boolean).join(' - ')}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex w-fit overflow-hidden rounded-lg border border-[#E7DED2]">
                          <button type="button" onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center rounded-l-lg transition hover:bg-[#F8F5EF]" aria-label="Diminuer la quantite"><Minus size={14} /></button>

                          <span className="flex h-8 w-9 items-center justify-center border-x border-[#E7DED2] text-sm font-semibold">{item.quantity}</span>

                          <button type="button" onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center rounded-r-lg transition hover:bg-[#F8F5EF]" aria-label="Augmenter la quantite"><Plus size={14} /></button>
                        </div>

                        <div className="text-left md:text-right">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-velora-textGray">Total</p>
                          <p className="mt-0.5 text-sm font-bold text-velora-dark">{formatPrice(getCartItemPrice(item) * item.quantity, item.type === "pack")}</p>
                        </div>

                        <button type="button" onClick={() => { trackRemoveFromCart(item); removeFromCart(item.cartItemId); }} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border border-[#EFE7DC] text-velora-textGray transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 md:static" aria-label="Supprimer l'article"><Trash2 size={14} /></button>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </motion.main>

            <motion.aside
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              className="h-full lg:sticky lg:top-24"
            >
              <div className="flex h-full flex-col overflow-hidden rounded-xl border border-[#E8DED1] bg-white shadow-[0_8px_30px_rgba(17,17,17,0.04)]">
                <div className="border-b border-[#E8DED1] p-5">
                  <h2 className="mt-2 text-xl sm:text-2xl font-premium font-bold text-velora-dark">Votre commande</h2>
                </div>

                <div className="flex flex-1 flex-col justify-between gap-6 p-5">
                  <div className="space-y-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-velora-textGray">Sous-total</span>
                        <span className="font-semibold text-velora-dark">{formatPrice(itemsTotal, cart.length > 0 && cart.every((item) => item.type === "pack"))}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-velora-textGray">Livraison</span>
                        <span className="font-semibold text-velora-dark">{formatPrice(shippingPrice)}</span>
                      </div>
                    </div>

                    <div className="h-px bg-[#EFE7DC]" />
                  </div>

                  <div className="flex items-end justify-between">
                    <span className="text-lg font-semibold text-velora-dark">Total</span>
                    <span className="text-2xl font-premium font-bold text-velora-dark">{formatPrice(total, cart.length > 0 && cart.every((item) => item.type === "pack"))}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 border-t border-[#E8DED1] bg-[#FAF8F4] lg:grid-cols-2"> 
                </div>
              </div>
            </motion.aside>

            {cart.length > 0 && (
            <form id="checkout-form" onSubmit={handleSubmit} className="rounded-xl border border-[#E8DED1] bg-white p-5 shadow-[0_8px_30px_rgba(17,17,17,0.04)] sm:col-span-2">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF7EE] text-velora-gold">
                  <PackageCheck size={18} />
                </div>
                <h3 className="text-lg sm:text-xl font-premium font-bold text-velora-dark">Informations de livraison</h3>
              </div>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">Nom complet</label>
                  <input name="fullName" value={shippingAddress.fullName} onChange={handleShippingChange} placeholder="Nom complet" required minLength={2} className={inputClass} />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">Téléphone</label>
                  <input name="phone" type="tel" inputMode="tel" pattern="(?:\+216\s?)?[2-9][0-9]{7}" title="Entrez un numéro tunisien valide de 8 chiffres." value={shippingAddress.phone} onChange={handleShippingChange} placeholder="Telephone" required className={inputClass} />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">Adresse email</label>
                  <input type="email" name="email" value={shippingAddress.email} onChange={handleShippingChange} placeholder="Adresse email" required className={inputClass} />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">Ville</label>
                  <input name="city" value={shippingAddress.city} onChange={handleShippingChange} placeholder="Ville" required minLength={2} className={inputClass} />
                </div>

                <div className="lg:col-span-2">
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">Adresse</label>
                  <input name="address" value={shippingAddress.address} onChange={handleShippingChange} placeholder="Adresse" required minLength={5} className={inputClass} />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">Code postal</label>
                  <input name="zipCode" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} title="Le code postal doit contenir 4 chiffres." value={shippingAddress.zipCode} onChange={handleShippingChange} placeholder="Code postal" required className={inputClass} />
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-600">{error}</p>
                </div>
              )}

              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_260px] lg:items-center">
                <div className="rounded-xl border border-[#E8DED1] bg-[#FCFAF7] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-velora-gold">
                      <Truck size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-velora-dark">Livraison rapide</h4>
                      <p className="mt-1 text-sm leading-5 text-velora-textGray">Partout en Tunisie sous 2 a 4 jours.</p>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={submitting || cart.length === 0} className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-velora-gold px-4 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-velora-gold/30">
                  <CreditCard size={18} />
                  {submitting ? "Validation..." : "Confirmer la commande"}
                </button>
              </div>

              {/* <p className="mt-4 text-center text-xs leading-5 text-velora-textGray">En validant, vous acceptez nos conditions de vente et notre politique de confidentialite.</p> */}
            </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
