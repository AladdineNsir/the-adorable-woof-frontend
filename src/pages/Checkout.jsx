import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, CreditCard, User, MapPin } from "lucide-react";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orderApi";
import { getProfile } from "../services/authApi";

export default function Checkout() {
  const navigate = useNavigate();

  const { cart, clearCart } = useCart();
    const [profileLoading, setProfileLoading] = useState(true);


  const shippingPrice = 7;

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const total = subtotal + shippingPrice;

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    governorate: "",
    zipCode: "",
    notes: "",
  });

  useEffect(() => {
  const loadProfile = async () => {
    try {
      const data = await getProfile();
      const user = data.user;

      setForm((prev) => ({
        ...prev,
        fullName: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address?.street || user?.address?.address || "",
        city: user?.address?.city || "",
        governorate: user?.address?.governorate || "",
        zipCode: user?.address?.zipCode || "",
      }));
    } catch (error) {
      console.log("Impossible de récupérer le profil :", error);
    } finally {
      setProfileLoading(false);
    }
  };

  loadProfile();
}, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOrder = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // API après

      await createOrder({
        orderItems: cart,
        shippingAddress: form,
        paymentMethod: "Paiement à la livraison",
        shippingPrice,
        totalPrice: total,
      });

      clearCart();

      alert("Commande enregistrée avec succès.");

      navigate("/order-success");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] py-8 sm:py-10 lg:py-12">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-16">

        {/* Page header */}
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-velora-gold">Votre commande</p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-premium font-bold text-velora-dark">Finaliser votre commande</h1>
          <p className="mt-2 text-sm text-velora-textGray">Renseignez vos informations pour recevoir votre commande.</p>
        </div>

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_380px]">

          {/* LEFT: form */}
          <form onSubmit={handleOrder} className="lg:col-span-1 bg-white rounded-xl border border-[#E8DED1] p-5 sm:p-6 lg:p-8 shadow-[0_8px_30px_rgba(17,17,17,0.04)]">

            {/* Informations */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#FFF7EE] flex items-center justify-center text-velora-gold">
                <User size={18} />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-velora-dark">Informations</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">Nom complet</label>
                <input id="fullName" name="fullName" type="text" placeholder="Nom complet" required value={form.fullName} onChange={handleChange} className="h-11 w-full rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-4 text-sm text-velora-dark outline-none transition focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10" />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">Email</label>
                <input id="email" name="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange} className="w-full h-11 rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-4 text-sm text-velora-dark outline-none transition focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10" />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">Téléphone</label>
                <input id="phone" name="phone" type="text" placeholder="Téléphone" required value={form.phone} onChange={handleChange} className="w-full h-11 rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-4 text-sm text-velora-dark outline-none transition focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10" />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">Ville</label>
                <input id="city" name="city" type="text" placeholder="Ville" required value={form.city} onChange={handleChange} className="w-full h-11 rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-4 text-sm text-velora-dark outline-none transition focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10" />
              </div>
            </div>

            {/* Adresse */}
            <div className="flex items-center gap-3 mt-8 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#FFF7EE] flex items-center justify-center text-velora-gold">
                <MapPin size={18} />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-velora-dark">Adresse de livraison</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">Adresse complète</label>
                <input id="address" name="address" type="text" placeholder="Adresse complète" required value={form.address} onChange={handleChange} className="h-11 w-full rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-4 text-sm text-velora-dark outline-none transition focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10" />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">Gouvernorat</label>
                <input id="governorate" name="governorate" type="text" placeholder="Gouvernorat" required value={form.governorate} onChange={handleChange} className="w-full h-11 rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-4 text-sm text-velora-dark outline-none transition focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10" />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">Code postal</label>
                <input id="zipCode" name="zipCode" type="text" placeholder="Code postal" value={form.zipCode} onChange={handleChange} className="w-full h-11 rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-4 text-sm text-velora-dark outline-none transition focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10" />
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6">
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">Instructions pour le livreur (optionnel)</label>
              <textarea id="notes" name="notes" rows={4} placeholder="Instructions pour le livreur (optionnel)" value={form.notes} onChange={handleChange} className="w-full min-h-[110px] resize-none rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-4 py-3 text-sm text-velora-dark outline-none transition focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10" />
            </div>

            {/* Livraison */}
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-[#FFF7EE] flex items-center justify-center text-velora-gold"><Truck size={18} /></div>
                <h2 className="text-lg sm:text-xl font-semibold text-velora-dark">Livraison</h2>
              </div>

              <div className="border border-velora-gold/40 bg-[#FFF9F2] rounded-xl p-4 sm:p-5 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-sm">Livraison Standard</h3>
                  <p className="text-sm text-velora-textGray">Livraison sous 24 à 72 heures.</p>
                </div>
                <span className="font-semibold text-velora-dark">{shippingPrice.toFixed(2)} DT</span>
              </div>
            </div>

            {/* Paiement */}
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-[#FFF7EE] flex items-center justify-center text-velora-gold"><CreditCard size={18} /></div>
                <h2 className="text-lg sm:text-xl font-semibold text-velora-dark">Paiement</h2>
              </div>

              <div className="border border-velora-gold bg-[#FFF9F2] rounded-xl p-4 sm:p-5">
                <label className="flex items-start gap-4 cursor-pointer">
                  <input type="radio" checked readOnly className="mt-1 accent-velora-gold" />
                  <div>
                    <h3 className="font-semibold text-sm">Paiement à la livraison</h3>
                    <p className="text-sm text-velora-textGray mt-1">Vous payerez directement au livreur lors de la réception de votre commande.</p>
                  </div>
                </label>
              </div>
            </div>

          </form>

          {/* RIGHT: summary */}
          <div className="bg-white rounded-xl border border-[#E8DED1] p-4 sm:p-5 h-fit lg:sticky lg:top-24">
            <h2 className="text-lg sm:text-xl font-premium font-bold text-velora-dark mb-4">Résumé</h2>

            <div className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-sm text-velora-textGray">Votre panier est vide.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.cartItemId} className="flex gap-3 items-center">
                    <img src={item.images?.[0]} alt={item.name} className="w-16 h-16 sm:w-18 sm:h-18 rounded-lg object-cover border border-[#E8DED1]" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-velora-dark truncate">{item.name}</h3>
                      <p className="text-xs text-velora-textGray">Qté : {item.quantity}</p>
                    </div>
                    <div className="text-sm font-semibold text-velora-dark">{(item.price * item.quantity).toFixed(2)} DT</div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-[#EFE7DC] my-5" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-velora-textGray"><span>Sous-total</span><span>{subtotal.toFixed(2)} DT</span></div>
              <div className="flex justify-between text-velora-textGray"><span>Livraison</span><span>{shippingPrice.toFixed(2)} DT</span></div>
              <div className="flex justify-between pt-3 border-t border-[#EFE7DC] text-lg font-bold text-velora-dark"><span>Total</span><span>{total.toFixed(2)} DT</span></div>
            </div>

            <button type="submit" onClick={handleOrder} disabled={loading || cart.length === 0} className="w-full h-12 mt-6 rounded-lg bg-velora-gold text-white font-semibold hover:bg-velora-goldHover transition disabled:opacity-60">
              {loading ? 'Enregistrement...' : 'Confirmer la commande'}
            </button>

            <p className="text-center text-xs text-velora-textGray mt-4">Paiement à la livraison uniquement</p>
          </div>

        </div>

      </div>

    </div>
  );
}