import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Edit,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../services/authApi";
import { getMyOrders } from "../services/orderApi";

const panel =
  "rounded-xl border border-[#E8DED1] bg-white shadow-[0_8px_30px_rgba(17,17,17,0.04)] p-4 sm:p-5";

const formatAddress = (address) => {
  if (!address) return "Aucune adresse renseignée";

  const parts = [
    address.street,
    address.city,
    address.zipCode,
    address.country,
  ].filter(Boolean);

  return parts.length ? parts.join(", ") : "Aucune adresse renseignée";
};

const formatDate = (date) => {
  if (!date) return "Non disponible";

  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

function AccountSidebar({ user, active, onLogout }) {
  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <motion.aside
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      className="lg:sticky lg:top-24 lg:h-fit"
    >
      <div className="border-b border-[#EFE7DC] pb-5 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-velora-gold text-lg font-bold text-white ring-4 ring-white">
          {initial}
        </div>
        <h2 className="mt-4 truncate font-premium text-xl font-bold text-velora-dark">
          {user?.name || "Utilisateur"}
        </h2>
        <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.16em] text-velora-gold">
          {user?.role === "admin" ? "Administrateur" : "LA FAMILLE WOOF"}
        </p>
      </div>

      <div className="pt-5">
  <Link
    to="/account"
    className={`mb-1 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors duration-200 ${
      active === "profile"
        ? "bg-[#C96A26] font-semibold text-white"
        : "font-medium text-velora-dark hover:bg-white hover:text-velora-gold"
    }`}
    aria-current={active === "profile" ? "page" : undefined}
  >
    <User size={18} />
    Mon profil
  </Link>

  <Link
    to="/account/orders"
    className={`mb-1 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors duration-200 ${
      active === "orders"
        ? "bg-[#C96A26] font-semibold text-white"
        : "font-medium text-velora-dark hover:bg-white hover:text-velora-gold"
    }`}
    aria-current={active === "orders" ? "page" : undefined}
  >
    <Package size={18} />
    Mes commandes
  </Link>

  <button
    onClick={onLogout}
    className="mt-4 flex w-full items-center gap-2 rounded-lg border border-red-100 bg-white px-3 py-2.5 text-sm font-semibold text-red-500 transition-colors duration-200 hover:bg-red-50"
    aria-label="Déconnexion"
  >
    <LogOut size={18} />
    Déconnexion
  </button>
</div>
    </motion.aside>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-4 px-4 py-4 sm:px-5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF7EE] text-velora-gold">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-velora-textGray">
          {label}
        </p>
        <h3 className="mt-1 break-words text-sm font-semibold text-velora-dark">
          {value}
        </h3>
      </div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadAccount = async () => {
      try {
        const [profileData, ordersData] = await Promise.all([
          getProfile(),
          getMyOrders(),
        ]);

        setUser(profileData.user);
        setOrders(ordersData.orders || ordersData || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadAccount();
  }, []);

  const stats = useMemo(() => {
    const delivered = orders.filter((order) => order.deliveryStatus === "Livré").length;
    const total = orders.reduce(
      (sum, order) => sum + Number(order.totalPrice || 0),
      0
    );

    return { delivered, total };
  }, [orders]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="h-4 w-4 rounded-full border-2 border-velora-dark border-t-transparent animate-spin" aria-hidden="true" />
          <div className="text-sm font-semibold text-velora-dark">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F7F3EC] text-velora-dark">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <section className="mb-6">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
            >
              <div>
               <h1 className="mt-2 font-premium text-2xl sm:text-3xl lg:text-4xl font-bold text-velora-dark">
                  Bonjour, {user?.name?.split(" ")[0] || "client"}
                </h1>
                
              </div>

              <Link
                to="/account/edit"
                className="inline-flex items-center gap-2 rounded-lg border border-[#E7DED2] bg-white px-4 h-10 text-sm font-semibold text-velora-dark transition-colors duration-200 hover:border-velora-gold hover:text-velora-gold"
              >
                <Edit size={17} />
                Modifier
              </Link>
            </motion.div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
            <AccountSidebar user={user} active="profile" onLogout={handleLogout} />

            <motion.div
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
              className="min-w-0 space-y-6"
            >
            

              <div className="rounded-xl border border-[#E8DED1] bg-white">
                <div className="border-b border-[#EFE7DC] px-4 py-4 sm:px-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-velora-gold">Profil</p>
                  <h2 className="mt-2 text-xl sm:text-2xl font-premium font-bold text-velora-dark">Informations personnelles</h2>
                  {/* <p className="mt-2 text-sm leading-6 text-velora-textGray">Ces informations nous aident à préparer vos commandes avec précision.</p> */}
                </div>

                <div className="divide-y divide-[#EFE7DC]">
                  <InfoRow icon={User} label="Nom complet" value={user?.name || "Non renseigné"} />
                  <InfoRow icon={Mail} label="Adresse email" value={user?.email || "Non renseignée"} />
                  <InfoRow icon={Phone} label="Téléphone" value={user?.phone || "Non renseigné"} />
                  <InfoRow icon={MapPin} label="Adresse" value={formatAddress(user?.address)} />
                </div>
              </div>

              {/* <div className="rounded-xl border border-[#E8DED1] bg-[#FCFAF7] p-5 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-velora-gold">Suivi</p>
                    <h2 className="mt-2 text-2xl font-premium font-bold text-velora-dark">Vos commandes</h2>
                    <p className="mt-2 text-sm leading-7 text-velora-textGray">Consultez vos achats et statuts de livraison.</p>
                  </div>
                  <Link to="/account/orders" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#E7DED2] bg-white px-4 text-sm font-semibold text-velora-dark transition-colors duration-200 hover:border-velora-gold hover:text-velora-gold">
                    <Package size={17} />
                    Voir
                  </Link>
                </div>
              </div> */}
            </motion.div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
