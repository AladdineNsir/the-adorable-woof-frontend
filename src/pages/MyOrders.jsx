import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  LogOut,
  Package,
  ReceiptText,
  Truck,
  User,
  ChevronDown,
} from "lucide-react";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getMyOrders } from "../services/orderApi";

/* =========================================================
   DATE
========================================================= */

const formatDate = (date) =>
  new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

/* =========================================================
   ACCOUNT SIDEBAR
========================================================= */

function AccountSidebar({ user, onLogout }) {
  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <motion.aside
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      className="lg:sticky lg:top-24 lg:h-fit"
    >
      <div className="border-b border-[#EFE7DC] pb-5 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#C96A26] text-2xl font-bold text-white ring-4 ring-white">
          {initial}
        </div>

        <h2 className="mt-4 truncate font-premium text-lg font-bold text-velora-dark">
          {user?.name || "Utilisateur"}
        </h2>

        <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.14em] text-[#C96A26]">
          LA FAMILLE WOOF
        </p>
      </div>

      <div className="pt-5">
        <Link
          to="/account"
          className="mb-1 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-velora-dark transition-colors duration-200 hover:bg-white hover:text-[#C96A26]"
        >
          <User size={18} />
          Mon profil
        </Link>

        <Link
          to="/account/orders"
          className="mb-1 flex items-center gap-2 rounded-lg bg-[#C96A26] px-3 py-2.5 text-sm font-semibold text-white"
        >
          <Package size={18} />
          Mes commandes
        </Link>

        <button
          onClick={onLogout}
          className="mt-4 flex w-full items-center gap-2 rounded-lg border border-red-100 bg-white px-3 py-2.5 text-sm font-semibold text-red-500 transition-colors duration-200 hover:bg-red-50"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </motion.aside>
  );
}

/* =========================================================
   STATUS
========================================================= */

// function Status({ children, delivered = false }) {
//   return (
//     <span
//       className={`inline-flex items-center gap-2 text-xs font-semibold ${
//         delivered ? "text-green-700" : "text-[#C96A26]"
//       }`}
//     >
//       <span
//         className={`h-1.5 w-1.5 rounded-full ${
//           delivered ? "bg-green-500" : "bg-[#C96A26]"
//         }`}
//       />

//       {children}
//     </span>
//   );
// }
function Status({ children }) {
  const statusStyles = {
    "En attente d'appel": {
      text: "text-[#D97706]",
      dot: "bg-[#D97706]",
    },

    "Confirmé au téléphone": {
      text: "text-[#16A34A]",
      dot: "bg-[#16A34A]",
    },

    "Annulé au téléphone": {
      text: "text-[#DC2626]",
      dot: "bg-[#DC2626]",
    },

    "Injoignable": {
      text: "text-[#7C3AED]",
      dot: "bg-[#7C3AED]",
    },

    "En attente": {
      text: "text-[#6B7280]",
      dot: "bg-[#6B7280]",
    },

    

    "En cours de préparation": {
      text: "text-[#D97706]",
      dot: "bg-[#D97706]",
    },

    "Expédié": {
      text: "text-[#2563EB]",
      dot: "bg-[#2563EB]",
    },

    "Livré": {
      text: "text-[#16A34A]",
      dot: "bg-[#16A34A]",
    },

    "Retourné": {
      text: "text-[#DC2626]",
      dot: "bg-[#DC2626]",
    },
  };

  const style = statusStyles[children] || {
    text: "text-[#6B7280]",
    dot: "bg-[#6B7280]",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-semibold ${style.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {children}
    </span>
  );
}

/* =========================================================
   ORDER CARD
========================================================= */

function OrderCard({ order, isOpen, onToggle }) {
  const orderNumber =
    order._id?.slice(-8)?.toUpperCase() || "COMMANDE";

  const itemsCount = order.orderItems?.length || 0;

  const isDelivered = order.deliveryStatus === "Livré";

  const status =
    order.phoneVerificationStatus || "En attente d'appel";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        overflow-hidden
        rounded-xl
        border
        bg-white
        transition-all
        duration-300
        ${
          isOpen
            ? "border-[#C96A26]/30 shadow-[0_12px_35px_rgba(35,25,18,0.07)]"
            : "border-[#E8DED1] shadow-[0_4px_18px_rgba(35,25,18,0.025)] hover:border-[#C96A26]/25"
        }
      `}
    >
      {/* =====================================================
          CLOSED / HEADER
      ===================================================== */}

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full text-left"
      >
        <div className="px-5 py-5 sm:px-6">
          <div className="flex items-center gap-5">

            {/* LEFT */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C96A26]" />

                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#C96A26]">
                  Commande
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="text-base font-bold tracking-wide text-velora-dark sm:text-lg">
                  #{orderNumber}
                </h3>

                <span className="hidden h-3.5 w-px bg-[#E7DED2] sm:block" />

                <span className="flex items-center gap-1.5 text-[11px] text-velora-textGray">
                  <CalendarDays size={12} />

                  {order.createdAt
                    ? formatDate(order.createdAt)
                    : "Date inconnue"}
                </span>
              </div>
            </div>

            {/* STATUS */}
            <div className="hidden min-w-[150px] md:block">
              <Status delivered={isDelivered}>
                {status}
              </Status>
            </div>

            {/* ITEMS */}
            <div className="hidden min-w-[80px] text-right sm:block">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-velora-textGray">
                Articles
              </p>

              <p className="mt-1 text-sm font-semibold text-velora-dark">
                {itemsCount}
              </p>
            </div>

            {/* TOTAL */}
            <div className="min-w-[90px] text-right">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-velora-textGray">
                Total
              </p>

              <p className="mt-1 text-base font-bold text-velora-dark sm:text-lg">
                {Number(order.totalPrice || 0).toFixed(2)}
                <span className="ml-1 text-[9px] font-semibold uppercase tracking-wider text-velora-textGray">
                  DT
                </span>
              </p>
            </div>

            {/* CHEVRON */}
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-[#E7DED2]
                bg-[#FCFAF7]
                text-velora-dark
              "
            >
              <ChevronDown size={15} />
            </motion.div>
          </div>

          {/* MOBILE STATUS */}
          <div className="mt-4 flex items-center justify-between border-t border-[#F1EBE3] pt-3 md:hidden">
            <Status delivered={isDelivered}>
              {status}
            </Status>

            <span className="text-[10px] text-velora-textGray">
              {itemsCount}{" "}
              {itemsCount > 1 ? "articles" : "article"}
            </span>
          </div>
        </div>
      </button>

      {/* =====================================================
          EXPANDED CONTENT
      ===================================================== */}

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.3 },
              opacity: { duration: 0.2 },
            }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#EFE7DC]">

              {/* DETAILS GRID */}

              <div className="grid grid-cols-1 sm:grid-cols-3">

                {/* ARTICLES */}

                <div className="px-5 py-5 sm:border-r sm:border-[#EFE7DC] sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF5EA]">
                      <ReceiptText
                        size={16}
                        className="text-[#C96A26]"
                      />
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-velora-textGray">
                        Articles
                      </p>

                      <p className="mt-1 text-sm font-semibold text-velora-dark">
                        {itemsCount}{" "}
                        {itemsCount > 1
                          ? "articles"
                          : "article"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* PAIEMENT */}

                <div className="border-t border-[#EFE7DC] px-5 py-5 sm:border-r sm:border-t-0 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF5EA]">
                      <CheckCircle2
                        size={16}
                        className="text-[#C96A26]"
                      />
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-velora-textGray">
                        Paiement
                      </p>

                      <p className="mt-1 text-sm font-semibold text-velora-dark">
                        À la livraison
                      </p>
                    </div>
                  </div>
                </div>

                {/* LIVRAISON */}

                <div className="border-t border-[#EFE7DC] px-5 py-5 sm:border-t-0 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF5EA]">
                      <Truck
                        size={16}
                        className="text-[#C96A26]"
                      />
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-velora-textGray">
                        Livraison
                      </p>

                      <p className="mt-1 text-sm font-semibold text-velora-dark">
                        {order.deliveryStatus || "En cours"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FOOTER */}

              <div className="flex flex-col gap-4 border-t border-[#EFE7DC] bg-[#FCFAF7] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-velora-textGray">
                    Statut
                  </p>

                  <div className="mt-1">
                    <Status delivered={isDelivered}>
                      {status}
                    </Status>
                  </div>
                </div>

                <Link
                  to={`/account/orders/${order._id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="
                    inline-flex
                    h-9
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-[#C96A26]
                    px-4
                    text-xs
                    font-semibold
                    text-white
                    transition-all
                    duration-200
                    hover:bg-[#B85E20]
                  "
                >
                  Voir les détails
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

/* =========================================================
   MY ORDERS
========================================================= */

export default function MyOrders() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openOrderId, setOpenOrderId] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getMyOrders();

        setOrders(data.orders || data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const summary = useMemo(() => {
    const pending = orders.filter(
      (order) => order.deliveryStatus !== "Livré"
    ).length;

    const total = orders.reduce(
      (sum, order) =>
        sum + Number(order.totalPrice || 0),
      0
    );

    return {
      pending,
      total,
    };
  }, [orders]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-velora-cream">
        <div className="animate-pulse text-lg font-semibold text-velora-dark">
          Chargement...
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F7F3EC] pb-12 pt-3 text-velora-dark">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          <section className="grid gap-8 px-5 py-5 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)]">

            {/* SIDEBAR */}

            <AccountSidebar
              user={user}
              onLogout={handleLogout}
            />

            {/* CONTENT */}

            <motion.div
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
              className="min-w-0"
            >

              {/* HEADER */}

              <div className="mb-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C96A26]">
                  Commandes
                </p>

                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h1 className="font-premium text-2xl font-bold text-velora-dark sm:text-3xl">
                      Historique des commandes
                    </h1>

                    {/* <p className="mt-2 text-sm text-velora-textGray">
                      Retrouvez toutes vos commandes et leur évolution.
                    </p> */}
                  </div>

                  {/* <Link
                    to="/shop"
                    className="
                      inline-flex
                      h-9
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      border
                      border-[#DED3C7]
                      bg-white
                      px-4
                      text-xs
                      font-semibold
                      text-velora-dark
                      transition-all
                      hover:border-[#C96A26]
                      hover:text-[#C96A26]
                    "
                  >
                    Boutique
                    <ArrowRight size={14} />
                  </Link> */}
                </div>
              </div>

              {/* ORDERS */}

              <div className="space-y-3">

                {orders.length === 0 ? (
                  <div className="rounded-xl border border-[#E8DED1] bg-white px-5 py-16 text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF5EA] text-[#C96A26]">
                      <Package size={28} />
                    </div>

                    <h3 className="mt-5 font-premium text-xl font-bold text-velora-dark">
                      Aucune commande
                    </h3>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-velora-textGray">
                      Votre historique est encore vide.
                      Découvrez notre collection et trouvez
                      les accessoires parfaits pour votre compagnon.
                    </p>

                    <Link
                      to="/shop"
                      className="
                        mt-6
                        inline-flex
                        h-10
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-[#C96A26]
                        px-5
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-[#B85E20]
                      "
                    >
                      Découvrir
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <OrderCard
                      key={order._id}
                      order={order}
                      isOpen={openOrderId === order._id}
                      onToggle={() =>
                        setOpenOrderId(
                          openOrderId === order._id
                            ? null
                            : order._id
                        )
                      }
                    />
                  ))
                )}
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}