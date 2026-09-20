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
import { trackPurchase } from "../analytics/analytics";

const ORDERS_PER_PAGE = 5;

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
          className="mb-1 hidden items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-velora-dark transition-colors duration-200 hover:bg-white hover:text-[#C96A26] lg:flex"
        >
          <User size={18} />
          Mon profil
        </Link>

        <Link
          to="/account/orders"
          className="mb-1 hidden items-center gap-2 rounded-lg bg-[#C96A26] px-3 py-2.5 text-sm font-semibold text-white lg:flex"
        >
          <Package size={18} />
          Mes commandes
        </Link>

        <button
          onClick={onLogout}
          className="mt-4 hidden w-full items-center gap-2 rounded-lg border border-red-100 bg-white px-3 py-2.5 text-sm font-semibold text-red-500 transition-colors duration-200 hover:bg-red-50 lg:flex"
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

// function OrderCard({ order, isOpen, onToggle }) {
//   const orderNumber =
//     order._id?.slice(-8)?.toUpperCase() || "COMMANDE";

//   const itemsCount = order.orderItems?.length || 0;

//   const isDelivered = order.deliveryStatus === "Livré";

//   const status =
//     order.phoneVerificationStatus || "En attente d'appel";

//   return (
//     <motion.article
//       layout
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className={`
//         overflow-hidden
//         rounded-xl
//         border
//         bg-white
//         transition-all
//         duration-300
//         ${
//           isOpen
//             ? "border-[#C96A26]/30 shadow-[0_12px_35px_rgba(35,25,18,0.07)]"
//             : "border-[#E8DED1] shadow-[0_4px_18px_rgba(35,25,18,0.025)] hover:border-[#C96A26]/25"
//         }
//       `}
//     >
//       {/* =====================================================
//           CLOSED / HEADER
//       ===================================================== */}

//       <button
//         type="button"
//         onClick={onToggle}
//         aria-expanded={isOpen}
//         className="w-full text-left"
//       >
//         <div className="px-5 py-5 sm:px-6">
//           <div className="flex items-center gap-5">

//             {/* LEFT */}
//             <div className="min-w-0 flex-1">
//               <div className="flex items-center gap-2">
//                 <span className="h-1.5 w-1.5 rounded-full bg-[#C96A26]" />

//                 <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#C96A26]">
//                   Commande
//                 </span>
//               </div>

//               <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
//   <h3 className="text-xs font-normal tracking-wide text-velora-dark sm:text-sm">
//   #{orderNumber}
// </h3>

//                 <span className="hidden h-3.5 w-px bg-[#E7DED2] sm:block" />

//                 <span className="flex items-center gap-1.5 text-[11px] text-velora-textGray">
//                   <CalendarDays size={12} />

//                   {order.createdAt
//                     ? formatDate(order.createdAt)
//                     : "Date inconnue"}
//                 </span>
//               </div>
//             </div>

//             {/* STATUS */}
//             <div className="hidden min-w-[150px] md:block">
//               <Status delivered={isDelivered}>
//                 {status}
//               </Status>
//             </div>

//             {/* ITEMS */}
//             <div className="hidden min-w-[80px] text-center sm:block">
//               <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-velora-textGray">
//                 Articles
//               </p>

//               <p className="mt-1 text-sm font-semibold text-velora-dark">
//                 {itemsCount}
//               </p>
//             </div>

//             {/* TOTAL */}
//             <div className="min-w-[90px] text-center">
//               <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-velora-textGray">
//                 Total
//               </p>

//               <p className="mt-1 text-base font-bold text-velora-dark sm:text-lg">
//                 <span className="ml-1 text-[9px] font-semibold uppercase tracking-wider text-velora-textGray">
//                   DT
//                 </span>
//               </p>
//             </div>

//             {/* CHEVRON */}
//             <motion.div
//               animate={{ rotate: isOpen ? 180 : 0 }}
//               transition={{ duration: 0.25 }}
//               className="
//                 flex
//                 h-8
//                 w-8
//                 shrink-0
//                 items-center
//                 justify-center
//                 rounded-full
//                 border
//                 border-[#E7DED2]
//                 bg-[#FCFAF7]
//                 text-velora-dark
//               "
//             >
//               <ChevronDown size={15} />
//             </motion.div>
//           </div>

//           {/* MOBILE STATUS */}
//           <div className="mt-4 flex items-center justify-between border-t border-[#F1EBE3] pt-3 md:hidden">
//             <Status delivered={isDelivered}>
//               {status}
//             </Status>

//             <span className="text-[10px] text-velora-textGray">
//               {itemsCount}{" "}
//               {itemsCount > 1 ? "articles" : "article"}
//             </span>
//           </div>
//         </div>
//       </button>

//       {/* =====================================================
//           EXPANDED CONTENT
//       ===================================================== */}

//       <AnimatePresence initial={false}>
//         {isOpen && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             transition={{
//               height: { duration: 0.3 },
//               opacity: { duration: 0.2 },
//             }}
//             className="overflow-hidden"
//           >
//             <div className="border-t border-[#EFE7DC]">

//               {/* DETAILS GRID */}

//               <div className="grid grid-cols-1 sm:grid-cols-3">

//                 {/* ARTICLES */}

//                 <div className="px-5 py-5 sm:border-r sm:border-[#EFE7DC] sm:px-6">
//                   <div className="flex items-center gap-3">
//                     <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF5EA]">
//                       <ReceiptText
//                         size={16}
//                         className="text-[#C96A26]"
//                       />
//                     </div>

//                     <div>
//                       <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-velora-textGray">
//                         Articles
//                       </p>

//                       <p className="mt-1 text-sm font-semibold text-velora-dark">
//                         {itemsCount}{" "}
//                         {itemsCount > 1
//                           ? "articles"
//                           : "article"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* PAIEMENT */}

//                 <div className="border-t border-[#EFE7DC] px-5 py-5 sm:border-r sm:border-t-0 sm:px-6">
//                   <div className="flex items-center gap-3">
//                     <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF5EA]">
//                       <CheckCircle2
//                         size={16}
//                         className="text-[#C96A26]"
//                       />
//                     </div>

//                     <div>
//                       <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-velora-textGray">
//                         Paiement
//                       </p>

//                       <p className="mt-1 text-sm font-semibold text-velora-dark">
//                         À la livraison
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* LIVRAISON */}

//                 <div className="border-t border-[#EFE7DC] px-5 py-5 sm:border-t-0 sm:px-6">
//                   <div className="flex items-center gap-3">
//                     <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF5EA]">
//                       <Truck
//                         size={16}
//                         className="text-[#C96A26]"
//                       />
//                     </div>

//                     <div>
//                       <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-velora-textGray">
//                         Livraison
//                       </p>

//                       <p className="mt-1 text-sm font-semibold text-velora-dark">
//                         {order.deliveryStatus || "En cours"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* FOOTER */}

//               <div className="flex flex-col gap-4 border-t border-[#EFE7DC] bg-[#FCFAF7] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

//                 <div>
//                   <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-velora-textGray">
//                     Statut
//                   </p>

//                   <div className="mt-1">
//                     <Status delivered={isDelivered}>
//                       {status}
//                     </Status>
//                   </div>
//                 </div>

//                 <Link
//                   to={`/account/orders/${order._id}`}
//                   onClick={(e) => e.stopPropagation()}
//                   className="
//                     inline-flex
//                     h-9
//                     items-center
//                     justify-center
//                     gap-2
//                     rounded-lg
//                     bg-[#C96A26]
//                     px-4
//                     text-xs
//                     font-semibold
//                     text-white
//                     transition-all
//                     duration-200
//                     hover:bg-[#B85E20]
//                   "
//                 >
//                   Voir les détails
//                   <ArrowRight size={14} />
//                 </Link>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.article>
//   );
// }
function OrderCard({ order }) {
  const navigate = useNavigate();

  const orderNumber =
    order.orderNumber || order._id?.slice(-8)?.toUpperCase() || "COMMANDE";

  const itemsCount = order.orderItems?.length || 0;

  const status =
    order.phoneVerificationStatus || "En attente d'appel";

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/account/orders/${order._id}`)}
      className="
        group
        cursor-pointer
        overflow-hidden
        rounded-xl
        border border-[#E8DED1]
        bg-white
        transition-all
        duration-300
        hover:-translate-y-[1px]
        hover:border-[#C96A26]/30
        hover:shadow-[0_10px_30px_rgba(35,25,18,0.06)]
      "
    >
      <div className="px-5 py-5 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1.8fr)_auto_auto_auto] items-center gap-3 sm:gap-4 md:gap-5">

          {/* LEFT */}
          <div className="min-w-0">

            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C96A26]" />

              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#C96A26]">
                Commande
              </span>
            </div>

            <div className="mt-2 flex flex-nowrap items-center gap-x-3 gap-y-1 overflow-hidden">

              <h3 className="truncate text-xs font-normal tracking-wide text-velora-dark sm:text-sm">
                {orderNumber}
              </h3>

              <span className="hidden h-3.5 w-px bg-[#E7DED2] sm:block" />

              <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[11px] text-velora-textGray">
                <CalendarDays size={12} />

                {order.createdAt
                  ? formatDate(order.createdAt)
                  : "Date inconnue"}
              </span>

            </div>
          </div>

          {/* ARTICLES */}
          <div className="min-w-[80px] text-center">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-velora-textGray">
              Articles
            </p>

            <p className="mt-1 text-sm font-semibold text-velora-dark">
              {itemsCount}
            </p>
          </div>

          {/* TOTAL */}
          <div className="min-w-[110px] shrink-0 text-center">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-velora-textGray">
              Total
            </p>

            <p className="mt-1 flex items-end justify-center gap-1 whitespace-nowrap leading-none text-[17px] font-semibold tracking-normal text-[#201B18] sm:text-[18px]">
              <span>{Math.floor(Number(order.totalPrice || 0))}</span>
              <span className="pb-[1px] text-[9px] font-bold uppercase tracking-[0.12em] text-velora-textGray">
                DT
              </span>
            </p>
          </div>

          {/* EYE + VOIR LES DÉTAILS */}
          <div className="flex shrink-0 items-center justify-end gap-2">

            <span
              className="
                hidden
                text-[10px]
                font-semibold
                text-[#C96A26]
                opacity-0
                transition-all
                duration-200
                group-hover:opacity-100
                sm:block
              "
            >
              Voir les détails
            </span>

            <div
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
                transition-all
                duration-200
                group-hover:border-[#C96A26]
                group-hover:bg-[#FFF5EA]
                group-hover:text-[#C96A26]
              "
            >
              <Eye size={15} />
            </div>

          </div>

        </div>

        {/* MOBILE STATUS */}
        <div className="mt-4 flex items-center justify-between border-t border-[#F1EBE3] pt-3 md:hidden">

          <Status>
            {status}
          </Status>

          <span className="text-[10px] text-velora-textGray">
            {itemsCount}{" "}
            {itemsCount > 1 ? "articles" : "article"}
          </span>

        </div>

      </div>
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: ORDERS_PER_PAGE,
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await getMyOrders({
          page: currentPage,
          limit: ORDERS_PER_PAGE,
        });

        const result = Array.isArray(data) ? data : data.orders || [];

        setOrders(result);
        result
          .filter((order) => order.phoneVerificationStatus === "Confirmé au téléphone")
          .forEach((order) => trackPurchase(order));
        setPagination(
          data.pagination || {
            page: currentPage,
            limit: ORDERS_PER_PAGE,
            total: result.length,
            pages: Math.max(Math.ceil(result.length / ORDERS_PER_PAGE), 1),
          }
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [currentPage]);

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
                    />
                  ))
                )}

                {pagination.pages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-1">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7DED2] bg-white text-xs transition hover:border-velora-gold disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ←
                    </button>

                    {Array.from({ length: pagination.pages }).map((_, index) => {
                      const pageNum = index + 1;
                      const showPage =
                        pageNum === 1 ||
                        pageNum === pagination.pages ||
                        Math.abs(pageNum - currentPage) <= 1 ||
                        (currentPage <= 3 && pageNum <= 3) ||
                        (currentPage > pagination.pages - 3 && pageNum > pagination.pages - 3);

                      if (!showPage) {
                        if (pageNum === 2 && currentPage > 3) {
                          return (
                            <span key={`ellipsis-${index}`} className="px-1 text-velora-textGray">
                              …
                            </span>
                          );
                        }

                        if (pageNum === pagination.pages - 1 && currentPage < pagination.pages - 2) {
                          return (
                            <span key={`ellipsis-${index}`} className="px-1 text-velora-textGray">
                              …
                            </span>
                          );
                        }

                        return null;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`h-9 w-9 rounded-lg text-xs font-semibold transition-all ${
                            currentPage === pageNum
                              ? "bg-velora-gold text-white shadow-sm"
                              : "border border-[#E7DED2] bg-white text-velora-dark hover:border-velora-gold hover:bg-[#F8F4EF]"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      disabled={currentPage === pagination.pages}
                      onClick={() => setCurrentPage((page) => Math.min(page + 1, pagination.pages))}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7DED2] bg-white text-xs transition hover:border-velora-gold disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      →
                    </button>
                  </div>
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