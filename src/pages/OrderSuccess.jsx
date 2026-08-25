import { CheckCircle, ShoppingBag, Truck } from "lucide-react";
import { Link } from "react-router-dom";

export default function OrderSuccess() {
  return (
    <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center px-4 sm:px-6 py-8 sm:py-10 lg:py-14">

      <div className="w-full max-w-2xl rounded-xl border border-[#E8DED1] bg-white p-5 sm:p-8 lg:p-10 shadow-[0_8px_30px_rgba(17,17,17,0.05)] text-center">

        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-velora-gold">COMMANDE CONFIRMÉE</p>

        <div className="flex justify-center mb-6 mt-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#FFF7EE] border border-[#E7DED2] flex items-center justify-center text-velora-gold">
            <CheckCircle size={52} className="text-velora-gold" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-premium font-bold text-velora-dark">Merci !</h1>

        <p className="mt-4 max-w-lg mx-auto text-sm sm:text-base leading-7 text-velora-textGray">
          Votre commande a été enregistrée avec succès. Nous vous contacterons rapidement pour confirmer la livraison.
        </p>

        <div className="mt-8 rounded-xl border border-[#E8DED1] bg-[#FCFAF7] p-5 sm:p-6 text-left">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-[#FFF7EE] flex items-center justify-center text-velora-gold">
              <Truck size={18} />
            </div>
            <h2 className="text-lg font-premium font-bold text-velora-dark">Livraison</h2>
          </div>

          <div className="divide-y divide-[#EFE7DC]">
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-velora-textGray">Délai estimé</span>
              <strong className="text-sm font-semibold text-velora-dark">24 à 72 heures</strong>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-velora-textGray">Mode de paiement</span>
              <strong className="text-sm font-semibold text-velora-dark">Paiement à la livraison</strong>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-velora-textGray">Frais de livraison</span>
              <strong className="text-sm font-semibold text-velora-dark">7 DT</strong>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7 sm:mt-8">
          <Link to="/shop" aria-label="Continuer les achats" className="h-11 rounded-lg border border-[#E7DED2] bg-white text-velora-dark font-semibold text-sm flex items-center justify-center hover:border-velora-gold hover:text-velora-gold hover:bg-[#FFFDF9] transition-colors">
            Continuer les achats
          </Link>

          <Link to="/account/orders" aria-label="Voir mes commandes" className="h-11 rounded-lg bg-velora-gold text-white font-semibold text-sm flex items-center justify-center gap-2 hover:brightness-95 transition">
            <ShoppingBag size={18} />
            Mes commandes
          </Link>
        </div>

      </div>

    </div>
  );
}