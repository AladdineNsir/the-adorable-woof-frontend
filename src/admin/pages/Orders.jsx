import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  FileText,
  Package,
  Phone,
  Search,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import AdminPageHeader from "../components/AdminPageHeader";
import {
  getOrders,
  updateDeliveryStatus,
  updatePhoneStatus,
} from "../../services/orderApi";

/* =========================================================
   CONSTANTES
========================================================= */

const PHONE_STATUSES = [
  "En attente d'appel",
  "Confirmé au téléphone",
  "Annulé au téléphone",
  "Injoignable",
];

const DELIVERY_STATUSES = [
  "En attente",
  "En cours de préparation",
  "Expédié",
  "Livré",
  "Retourné",
];

/* =========================================================
   HELPERS
========================================================= */

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(date))
    : "-";

const formatDateTime = (date) =>
  date
    ? new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(date))
    : "-";

const formatMoney = (value) =>
  `${Number(value || 0).toFixed(2)} DT`;

const normalizePhoneStatus = (status) => {
  if (status === "En attente d d'appel") {
    return "En attente d'appel";
  }

  return status || "En attente d'appel";
};

/* =========================================================
   BADGE
========================================================= */

function StatusBadge({ status, type }) {
  let classes =
    "border-[#E7DED2] bg-[#FBF8F2] text-velora-dark";

  if (type === "phone") {
    if (status === "Confirmé au téléphone") {
      classes =
        "border-[#D7E7D4] bg-[#F5FAF4] text-[#557C50]";
    } else if (
      status === "Annulé au téléphone" ||
      status === "Injoignable"
    ) {
      classes =
        "border-[#EFD6D3] bg-[#FFF7F6] text-[#B85D55]";
    } else {
      classes =
        "border-[#E7DED2] bg-[#FBF8F2] text-[#9A7535]";
    }
  }

  if (type === "delivery") {
    if (status === "Livré") {
      classes =
        "border-[#D7E7D4] bg-[#F5FAF4] text-[#557C50]";
    } else if (status === "Retourné") {
      classes =
        "border-[#EFD6D3] bg-[#FFF7F6] text-[#B85D55]";
    } else if (
      status === "Expédié" ||
      status === "En cours de préparation"
    ) {
      classes =
        "border-[#E7D8BA] bg-[#FCF8EF] text-[#9A7535]";
    } else {
      classes =
        "border-[#E7DED2] bg-[#FBF8F2] text-velora-dark";
    }
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-semibold ${classes}`}
    >
      {status}
    </span>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  iconClassName = "bg-[#FBF8F2] text-velora-gold",
}) {
  return (
    <div className="rounded-xl border border-[#E7DED2] bg-white p-5 shadow-[0_6px_24px_rgba(17,17,17,0.035)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-velora-textGray">
            {label}
          </p>

          <p className="mt-2 font-premium text-2xl font-bold text-velora-dark sm:text-3xl">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-velora-textGray">
              {description}
            </p>
          )}
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}
        >
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [deliveryFilter, setDeliveryFilter] =
    useState("");

  const [savingId, setSavingId] = useState("");

  /* =======================================================
     CHARGEMENT
  ======================================================= */

  const loadOrders = async () => {
    try {
      setLoading(true);

      const data = await getOrders();

      setOrders(data?.orders || data || []);
    } catch (error) {
      console.error(error);

      toast.error(
        "Impossible de charger les commandes."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  /* =======================================================
     STATISTIQUES
  ======================================================= */

  const statistics = useMemo(() => {
    const total = orders.length;

    const pending = orders.filter(
      (order) =>
        !order.deliveryStatus ||
        order.deliveryStatus === "En attente"
    ).length;

    const preparation = orders.filter(
      (order) =>
        order.deliveryStatus ===
        "En cours de préparation"
    ).length;

    const shipped = orders.filter(
      (order) =>
        order.deliveryStatus === "Expédié"
    ).length;

    const delivered = orders.filter(
      (order) =>
        order.deliveryStatus === "Livré"
    ).length;

    const returned = orders.filter(
      (order) =>
        order.deliveryStatus === "Retourné"
    ).length;

    const revenue = orders.reduce(
      (sum, order) =>
        sum + Number(order.totalPrice || 0),
      0
    );

    return {
      total,
      pending,
      preparation,
      shipped,
      delivered,
      returned,
      revenue,
    };
  }, [orders]);

  /* =======================================================
     FILTRAGE
  ======================================================= */

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const customerName =
        order.shippingAddress?.fullName ||
        order.user?.name ||
        "";

      const customerEmail =
        order.shippingAddress?.email ||
        order.user?.email ||
        "";

      const customerPhone =
        order.shippingAddress?.phone ||
        order.user?.phone ||
        "";

      const matchesSearch =
        !query ||
        order.orderNumber
          ?.toLowerCase()
          .includes(query) ||
        order._id
          ?.toLowerCase()
          .includes(query) ||
        customerName
          .toLowerCase()
          .includes(query) ||
        customerEmail
          .toLowerCase()
          .includes(query) ||
        customerPhone
          .toLowerCase()
          .includes(query);

      const matchesDelivery =
        !deliveryFilter ||
        order.deliveryStatus === deliveryFilter;

      return (
        matchesSearch &&
        matchesDelivery
      );
    });
  }, [orders, search, deliveryFilter]);

  /* =======================================================
     UPDATE STATUT
  ======================================================= */

  const handleUpdatePhoneStatus = async (
    orderId,
    status
  ) => {
    try {
      setSavingId(`${orderId}-phone`);

      const response =
        await updatePhoneStatus(
          orderId,
          status
        );

      const updatedOrder =
        response?.order || response;

      setOrders((current) =>
        current.map((order) =>
          order._id === orderId
            ? {
                ...order,
                ...updatedOrder,
                phoneVerificationStatus:
                  status,
              }
            : order
        )
      );

      toast.success("Statut téléphone mis à jour.");
    } catch (error) {
      console.error(error);

      toast.error(
        "Impossible de modifier le statut téléphone."
      );
    } finally {
      setSavingId("");
    }
  };

  const handleUpdateDeliveryStatus = async (
    orderId,
    status
  ) => {
    try {
      setSavingId(`${orderId}-delivery`);

      const response =
        await updateDeliveryStatus(
          orderId,
          status
        );

      const updatedOrder =
        response?.order || response;

      setOrders((current) =>
        current.map((order) =>
          order._id === orderId
            ? {
                ...order,
                ...updatedOrder,
                deliveryStatus: status,
              }
            : order
        )
      );

      toast.success("Statut livraison mis à jour.");
    } catch (error) {
      console.error(error);

      toast.error(
        "Impossible de modifier le statut livraison."
      );
    } finally {
      setSavingId("");
    }
  };

  /* =======================================================
     RESET
  ======================================================= */

  const resetFilters = () => {
    setSearch("");
    setDeliveryFilter("");
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <AdminPageHeader
        title="Commandes"
        breadcrumb={["Commandes"]}
      />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="p-4 sm:p-6 lg:p-7">

        {/* ===================================================
            STATISTIQUES
        =================================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            icon={ShoppingBag}
            label="Total commandes"
            value={statistics.total}
            description={`${statistics.revenue.toFixed(
              2
            )} DT de chiffre d'affaires`}
          />

          <StatCard
            icon={Clock3}
            label="En attente"
            value={
              statistics.pending +
              statistics.preparation
            }
            description="Commandes à traiter"
            iconClassName="bg-[#FCF8EF] text-[#9A7535]"
          />

          <StatCard
            icon={CheckCircle2}
            label="Livrées"
            value={statistics.delivered}
            description={`${statistics.shipped} expédiée${
              statistics.shipped > 1 ? "s" : ""
            }`}
            iconClassName="bg-[#F5FAF4] text-[#557C50]"
          />
        </div>

        {/* ===================================================
            SEARCH
        =================================================== */}

        <div className="mb-5 mt-5">
          <div className="flex flex-col gap-3 lg:flex-row">
            <label
              className="
                relative
                flex
                h-11
                flex-1
                items-center
                rounded-lg
                border
                border-[#E7DED2]
                bg-[#FCFAF7]
                px-3
                transition-colors
                duration-200
                focus-within:border-velora-gold/70
                focus-within:ring-2
                focus-within:ring-velora-gold/10
              "
            >
              <Search
                size={18}
                className="shrink-0 text-velora-textGray"
              />

              <input
                type="text"
                aria-label="Rechercher une commande"
                placeholder="Rechercher une commande..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="
                  h-full
                  flex-1
                  bg-transparent
                  pl-3
                  text-sm
                  text-velora-dark
                  outline-none
                  placeholder:text-velora-textGray
                "
              />
            </label>

            <div className="relative w-full lg:w-[260px]">
              <Package
                size={16}
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  z-10
                  -translate-y-1/2
                  text-velora-textGray
                "
              />

              <select
                value={deliveryFilter}
                onChange={(e) =>
                  setDeliveryFilter(
                    e.target.value
                  )
                }
                className="
                  h-11
                  w-full
                  appearance-none
                  rounded-lg
                  border
                  border-[#E7DED2]
                  bg-[#FCFAF7]
                  pl-9
                  pr-9
                  text-sm
                  text-velora-dark
                  outline-none
                  transition-colors
                  focus:border-velora-gold/70
                  focus:ring-2
                  focus:ring-velora-gold/10
                "
              >
                <option value="">
                  Toutes les livraisons
                </option>

                {DELIVERY_STATUSES.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  )
                )}
              </select>

              <ChevronDown
                size={16}
                className="
                  pointer-events-none
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-velora-textGray
                "
              />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-velora-textGray">
              <span className="font-semibold text-velora-dark">
                {filteredOrders.length}
              </span>{" "}
              commande
              {filteredOrders.length > 1
                ? "s"
                : ""}{" "}
              trouvée
              {filteredOrders.length > 1
                ? "s"
                : ""}
            </p>

            {(search || deliveryFilter) && (
              <button
                type="button"
                onClick={resetFilters}
                className="
                  text-xs
                  font-semibold
                  text-velora-gold
                  transition-colors
                  hover:text-velora-dark
                  hover:underline
                  hover:underline-offset-4
                "
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* ===================================================
            TABLE / MOBILE
        =================================================== */}

        <div className="mt-0">
          {loading ? (
            <div
              className="
                flex
                h-64
                items-center
                justify-center
                rounded-xl
                border
                border-[#E7DED2]
                bg-white
                text-sm
                text-velora-textGray
                shadow-[0_6px_24px_rgba(17,17,17,0.035)]
              "
            >
              <p className="text-sm text-velora-textGray">
                Chargement des commandes...
              </p>
            </div>
          ) : (
            <>
              {/* =================================================
                  DESKTOP / TABLET
              ================================================= */}

              <div
                className="
                  hidden
                  overflow-hidden
                  rounded-xl
                  border
                  border-[#E7DED2]
                  bg-white
                  shadow-[0_6px_24px_rgba(17,17,17,0.035)]
                  md:block
                "
              >
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1080px]">
                    <thead className="border-b border-[#E7DED2] bg-[#FCFAF7]">
                      <tr className="text-left text-[10px] font-bold uppercase tracking-[0.14em] text-velora-textGray">
                        <th className="px-5 py-4">
                          Commande
                        </th>

                        <th className="px-5 py-4">
                          Client
                        </th>

                        <th className="px-5 py-4">
                          Total
                        </th>

                        <th className="px-5 py-4">
                          Téléphone
                        </th>

                        <th className="px-5 py-4">
                          Livraison
                        </th>

                        <th className="px-5 py-4">
                          Facture
                        </th>

                        <th className="px-5 py-4 text-center">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#F1E9DF]">
                      {filteredOrders.length === 0 && (
                        <tr>
                          <td
                            colSpan="7"
                            className="px-5 py-14 text-center text-sm text-velora-textGray"
                          >
                            Aucune commande trouvée.
                          </td>
                        </tr>
                      )}

                      {filteredOrders.map(
                        (order) => {
                          const phoneStatus =
                            normalizePhoneStatus(
                              order.phoneVerificationStatus
                            );

                          const deliveryStatus =
                            order.deliveryStatus ||
                            "En attente";

                          const customerName =
                            order
                              .shippingAddress
                              ?.fullName ||
                            order.user?.name ||
                            "Client invité";

                          const customerPhone =
                            order
                              .shippingAddress
                              ?.phone ||
                            order.user?.phone ||
                            "-";

                          return (
                            <tr
                              key={order._id}
                              className="
                                border-t
                                border-[#F1E9DF]
                                transition-colors
                                duration-200
                                hover:bg-[#FCFAF7]
                              "
                            >
                              {/* COMMANDE */}

                              <td className="px-5 py-4">
                                <p className="text-sm font-semibold text-velora-dark">
                                  {order.orderNumber ||
                                    `#${order._id.slice(
                                      -8
                                    )}`}
                                </p>

                                <p className="mt-1 text-xs text-velora-textGray">
                                  {formatDate(
                                    order.createdAt
                                  )}
                                </p>
                              </td>

                              {/* CLIENT */}

                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-velora-gold text-sm font-bold text-white">
                                    {customerName
                                      ?.charAt(0)
                                      ?.toUpperCase() ||
                                      "C"}
                                  </div>

                                  <div>
                                    <p className="text-sm font-semibold text-velora-dark">
                                      {customerName}
                                    </p>

                                    <p className="mt-1 text-xs text-velora-textGray">
                                      {customerPhone}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* TOTAL */}

                              <td className="px-5 py-4">
                                <p className="text-sm font-semibold text-velora-dark">
                                  {formatMoney(
                                    order.totalPrice
                                  )}
                                </p>
                              </td>

                              {/* TELEPHONE */}

                              <td className="px-5 py-4">
                                <div className="flex min-w-[200px] flex-col gap-2">
                                  <StatusBadge
                                    type="phone"
                                    status={
                                      phoneStatus
                                    }
                                  />

                                  <select
                                    value={
                                      phoneStatus
                                    }
                                    disabled={
                                      savingId ===
                                      `${order._id}-phone`
                                    }
                                    onChange={(e) =>
                                      handleUpdatePhoneStatus(
                                        order._id,
                                        e.target.value
                                      )
                                    }
                                    className="
                                      h-9
                                      rounded-lg
                                      border
                                      border-[#E7DED2]
                                      bg-white
                                      px-3
                                      text-xs
                                      text-velora-dark
                                      outline-none
                                      focus:border-velora-gold/70
                                      focus:ring-2
                                      focus:ring-velora-gold/10
                                      disabled:opacity-60
                                    "
                                  >
                                    {PHONE_STATUSES.map(
                                      (status) => (
                                        <option
                                          key={status}
                                          value={status}
                                        >
                                          {status}
                                        </option>
                                      )
                                    )}
                                  </select>
                                </div>
                              </td>

                              {/* LIVRAISON */}

                              <td className="px-5 py-4">
                                <div className="flex min-w-[200px] flex-col gap-2">
                                  <StatusBadge
                                    type="delivery"
                                    status={
                                      deliveryStatus
                                    }
                                  />

                                  <select
                                    value={
                                      deliveryStatus
                                    }
                                    disabled={
                                      savingId ===
                                      `${order._id}-delivery`
                                    }
                                    onChange={(e) =>
                                      handleUpdateDeliveryStatus(
                                        order._id,
                                        e.target.value
                                      )
                                    }
                                    className="
                                      h-9
                                      rounded-lg
                                      border
                                      border-[#E7DED2]
                                      bg-white
                                      px-3
                                      text-xs
                                      text-velora-dark
                                      outline-none
                                      focus:border-velora-gold/70
                                      focus:ring-2
                                      focus:ring-velora-gold/10
                                      disabled:opacity-60
                                    "
                                  >
                                    {DELIVERY_STATUSES.map(
                                      (status) => (
                                        <option
                                          key={status}
                                          value={status}
                                        >
                                          {status}
                                        </option>
                                      )
                                    )}
                                  </select>
                                </div>
                              </td>

                              {/* FACTURE */}

                              <td className="px-5 py-4">
                                {order.invoiceSent ? (
                                  <StatusBadge
                                    type="delivery"
                                    status="Envoyée"
                                  />
                                ) : (
                                  <StatusBadge
                                    type="phone"
                                    status="Non envoyée"
                                  />
                                )}
                              </td>

                              {/* ACTION */}

                              <td className="px-5 py-4">
                                <div className="flex justify-center">
                                  <Link
                                    to={`/admin/orders/${order._id}`}
                                    title="Voir la commande"
                                    aria-label="Voir la commande"
                                    className="
                                      inline-flex
                                      h-9
                                      w-9
                                      items-center
                                      justify-center
                                      rounded-lg
                                      border
                                      border-[#E7DED2]
                                      bg-white
                                      text-velora-textGray
                                      transition-colors
                                      duration-200
                                      hover:border-velora-gold
                                      hover:bg-[#FFFDF9]
                                      hover:text-velora-gold
                                    "
                                  >
                                    <Eye size={16} />
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* =================================================
                  MOBILE
              ================================================= */}

              <div className="space-y-3 md:hidden">
                {filteredOrders.length === 0 && (
                  <div
                    className="
                      rounded-xl
                      border
                      border-[#E7DED2]
                      bg-white
                      px-5
                      py-14
                      text-center
                      text-sm
                      text-velora-textGray
                      shadow-[0_6px_24px_rgba(17,17,17,0.035)]
                    "
                  >
                    Aucune commande trouvée.
                  </div>
                )}

                {filteredOrders.map(
                  (order) => {
                    const phoneStatus =
                      normalizePhoneStatus(
                        order.phoneVerificationStatus
                      );

                    const deliveryStatus =
                      order.deliveryStatus ||
                      "En attente";

                    const customerName =
                      order.shippingAddress
                        ?.fullName ||
                      order.user?.name ||
                      "Client invité";

                    const customerPhone =
                      order.shippingAddress
                        ?.phone ||
                      order.user?.phone ||
                      "-";

                    return (
                      <div
                        key={order._id}
                        className="
                          rounded-xl
                          border
                          border-[#E7DED2]
                          bg-white
                          p-4
                          shadow-[0_6px_24px_rgba(17,17,17,0.035)]
                        "
                      >
                        {/* TOP */}

                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-velora-gold text-sm font-bold text-white">
                              {customerName
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "C"}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-velora-dark">
                                {customerName}
                              </p>

                              <p className="mt-1 text-xs text-velora-textGray">
                                {customerPhone}
                              </p>
                            </div>
                          </div>

                          <Link
                            to={`/admin/orders/${order._id}`}
                            title="Voir la commande"
                            aria-label="Voir la commande"
                            className="
                              inline-flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-[#E7DED2]
                              bg-white
                              text-velora-textGray
                              transition-colors
                              hover:border-velora-gold
                              hover:text-velora-gold
                            "
                          >
                            <Eye size={16} />
                          </Link>
                        </div>

                        {/* ORDER INFO */}

                        <div className="mt-4 grid grid-cols-2 gap-3 border-y border-[#F1E9DF] py-3">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">
                              Commande
                            </p>

                            <p className="mt-1 text-xs font-semibold text-velora-dark">
                              {order.orderNumber ||
                                `#${order._id.slice(
                                  -8
                                )}`}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">
                              Total
                            </p>

                            <p className="mt-1 text-sm font-bold text-velora-dark">
                              {formatMoney(
                                order.totalPrice
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">
                              Date
                            </p>

                            <p className="mt-1 text-xs text-velora-textGray">
                              {formatDateTime(
                                order.createdAt
                              )}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">
                              Facture
                            </p>

                            <div className="mt-1 flex justify-end">
                              {order.invoiceSent ? (
                                <StatusBadge
                                  type="delivery"
                                  status="Envoyée"
                                />
                              ) : (
                                <StatusBadge
                                  type="phone"
                                  status="Non envoyée"
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* PHONE */}

                        <div className="mt-3">
                          <div className="mb-2 flex items-center gap-2">
                            <Phone
                              size={14}
                              className="text-velora-textGray"
                            />

                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">
                              Vérification téléphone
                            </p>
                          </div>

                          <StatusBadge
                            type="phone"
                            status={phoneStatus}
                          />

                          <select
                            value={phoneStatus}
                            disabled={
                              savingId ===
                              `${order._id}-phone`
                            }
                            onChange={(e) =>
                              handleUpdatePhoneStatus(
                                order._id,
                                e.target.value
                              )
                            }
                            className="
                              mt-2
                              h-10
                              w-full
                              rounded-lg
                              border
                              border-[#E7DED2]
                              bg-[#FCFAF7]
                              px-3
                              text-xs
                              text-velora-dark
                              outline-none
                              focus:border-velora-gold/70
                              focus:ring-2
                              focus:ring-velora-gold/10
                              disabled:opacity-60
                            "
                          >
                            {PHONE_STATUSES.map(
                              (status) => (
                                <option
                                  key={status}
                                  value={status}
                                >
                                  {status}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        {/* DELIVERY */}

                        <div className="mt-4">
                          <div className="mb-2 flex items-center gap-2">
                            <Truck
                              size={14}
                              className="text-velora-textGray"
                            />

                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">
                              Livraison
                            </p>
                          </div>

                          <StatusBadge
                            type="delivery"
                            status={
                              deliveryStatus
                            }
                          />

                          <select
                            value={
                              deliveryStatus
                            }
                            disabled={
                              savingId ===
                              `${order._id}-delivery`
                            }
                            onChange={(e) =>
                              handleUpdateDeliveryStatus(
                                order._id,
                                e.target.value
                              )
                            }
                            className="
                              mt-2
                              h-10
                              w-full
                              rounded-lg
                              border
                              border-[#E7DED2]
                              bg-[#FCFAF7]
                              px-3
                              text-xs
                              text-velora-dark
                              outline-none
                              focus:border-velora-gold/70
                              focus:ring-2
                              focus:ring-velora-gold/10
                              disabled:opacity-60
                            "
                          >
                            {DELIVERY_STATUSES.map(
                              (status) => (
                                <option
                                  key={status}
                                  value={status}
                                >
                                  {status}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}