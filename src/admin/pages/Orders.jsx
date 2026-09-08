import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
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
import Pagination from "../components/Pagination";
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

const ORDERS_PER_PAGE = 8;

/* =========================================================
   HELPERS
========================================================= */

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(date))
    : "-";

const formatDateTime = (date) =>
  date
    ? new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
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
   STATUS BADGE
========================================================= */

function StatusBadge({ status, type }) {
  let classes =
    "border-[#E7DED2] bg-[#FBF8F2] text-[#8D8176]";

  if (type === "phone") {
    if (status === "Confirmé au téléphone") {
      classes =
        "border-[#CFE8D8] bg-[#F3FBF6] text-[#3E8057]";
    } else if (
      status === "Annulé au téléphone" ||
      status === "Injoignable"
    ) {
      classes =
        "border-[#F0D4D1] bg-[#FFF7F6] text-[#B85D55]";
    } else {
      classes =
        "border-[#EBDDBF] bg-[#FFF9EE] text-[#9A7535]";
    }
  }

  if (type === "delivery") {
    if (status === "Livré") {
      classes =
        "border-[#CFE8D8] bg-[#F3FBF6] text-[#3E8057]";
    } else if (status === "Retourné") {
      classes =
        "border-[#F0D4D1] bg-[#FFF7F6] text-[#B85D55]";
    } else if (
      status === "Expédié" ||
      status === "En cours de préparation"
    ) {
      classes =
        "border-[#EBDDBF] bg-[#FFF9EE] text-[#9A7535]";
    }
  }

  return (
    <span
      className={`
        inline-flex w-fit items-center rounded-full
        border px-2.5 py-1
        text-[10px] font-semibold
        whitespace-nowrap
        ${classes}
      `}
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
  iconClassName,
}) {
  return (
    <div
      className="
        rounded-2xl
        border border-[#E7DED2]
        bg-white
        p-4 sm:p-5
        shadow-[0_8px_28px_rgba(17,17,17,0.035)]
      "
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-velora-textGray
            "
          >
            {label}
          </p>

          <p
            className="
              mt-1.5
              font-premium
              text-2xl
              font-bold
              leading-none
              text-velora-dark
              sm:text-[27px]
            "
          >
            {value}
          </p>

          {description && (
            <p className="mt-2 truncate text-[11px] text-velora-textGray">
              {description}
            </p>
          )}
        </div>

        <div
          className={`
            flex h-10 w-10
            shrink-0
            items-center justify-center
            rounded-xl
            ${iconClassName}
          `}
        >
          <Icon size={18} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SELECT STATUS
========================================================= */

function StatusSelect({
  value,
  options,
  disabled,
  onChange,
}) {
  return (
    <div className="relative">
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="
          h-9
          w-full
          appearance-none
          rounded-lg
          border border-[#E7DED2]
          bg-[#FCFAF7]
          px-3
          pr-8
          text-[11px]
          font-medium
          text-velora-dark
          outline-none
          transition-all
          duration-200
          hover:border-[#D9CABB]
          focus:border-velora-gold
          focus:ring-4
          focus:ring-velora-gold/10
          disabled:cursor-wait
          disabled:opacity-50
        "
      >
        {options.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <ChevronDown
        size={14}
        className="
          pointer-events-none
          absolute
          right-2.5
          top-1/2
          -translate-y-1/2
          text-[#9A8D80]
        "
      />
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

  const [page, setPage] = useState(1);
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * ORDERS_PER_PAGE,
    page * ORDERS_PER_PAGE
  );

  useEffect(() => {
    setPage(1);
  }, [search, deliveryFilter]);

  /* =======================================================
     UPDATE PHONE
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

      toast.success(
        "Statut téléphone mis à jour."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Impossible de modifier le statut téléphone."
      );
    } finally {
      setSavingId("");
    }
  };

  /* =======================================================
     UPDATE DELIVERY
  ======================================================= */

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

      toast.success(
        "Statut livraison mis à jour."
      );
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
      <AdminPageHeader
        title="Commandes"
        breadcrumb={["Commandes"]}
      />

      <div className="px-4 pb-4 sm:px-6 sm:pb-6 lg:px-7 lg:pb-7">

        {/* =================================================
            FILTRES
        ================================================= */}

        <div className="-mx-4 border-b border-[#E7DED2] bg-[#FCFAF7] sm:-mx-6 lg:-mx-7">

          <div
            className="
              px-4 py-4
              sm:px-6
              lg:px-8
            "
          >

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 lg:flex-row">

              {/* SEARCH */}

              <label
                className="
                  relative
                  flex h-11
                  min-w-0
                  flex-1
                  items-center
                  rounded-xl
                  border border-[#E7DED2]
                  bg-white
                  px-3.5
                  shadow-[0_3px_12px_rgba(17,17,17,0.025)]
                  transition-all
                  duration-200
                  focus-within:border-velora-gold
                  focus-within:bg-white
                  focus-within:ring-4
                  focus-within:ring-velora-gold/10
                "
              >
                <Search
                  size={17}
                  strokeWidth={1.8}
                  className="shrink-0 text-[#918579]"
                />

                <input
                  type="text"
                  aria-label="Rechercher une commande"
                  placeholder="Rechercher une commande, un client, téléphone..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="
                    h-full
                    min-w-0
                    flex-1
                    bg-transparent
                    pl-3
                    text-sm
                    text-velora-dark
                    outline-none
                    placeholder:text-[#A59A90]
                  "
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="
                      flex h-7 w-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      text-[#918579]
                      transition
                      hover:bg-[#F5EEE7]
                      hover:text-velora-gold
                    "
                    aria-label="Effacer"
                  >
                    <XCircle size={15} />
                  </button>
                )}
              </label>

              {/* DELIVERY FILTER */}

              <div className="relative w-full lg:w-[190px]">

                <Package
                  size={16}
                  strokeWidth={1.8}
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    z-10
                    -translate-y-1/2
                    text-[#918579]
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
                    rounded-xl
                    border border-[#E7DED2]
                    bg-white
                    pl-9
                    pr-9
                    text-sm
                    font-medium
                    text-velora-dark
                    shadow-[0_3px_12px_rgba(17,17,17,0.025)]
                    outline-none
                    transition-all
                    duration-200
                    hover:border-[#D9CABB]
                    focus:border-velora-gold
                    focus:bg-white
                    focus:ring-4
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
                  size={15}
                  className="
                    pointer-events-none
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-[#918579]
                  "
                />

              </div>

            </div>

            {/* FILTER INFO */}

            {(search || deliveryFilter) && (
              <div className="mt-3 flex justify-end px-1">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="
                    text-xs
                    font-semibold
                    text-velora-gold
                    transition
                    hover:text-velora-dark
                    hover:underline
                    hover:underline-offset-4
                  "
                >
                  Réinitialiser
                </button>
              </div>
            )}

          </div>

        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="mt-5 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF7EE] text-[#C96A26]">
            <ShoppingBag size={16} strokeWidth={1.8} />
          </div>

          <div>
            <p className="text-sm font-semibold text-velora-dark">
              Liste des commandes
            </p>
            <p className="text-xs text-[#8D8176]">
              {filteredOrders.length} commande
              {filteredOrders.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="mt-5">

          {loading ? (

            <div
              className="
                flex min-h-[320px]
                items-center justify-center
                rounded-xl
                border border-[#E8DED1]
                bg-white
                shadow-[0_6px_24px_rgba(17,17,17,0.035)]
              "
            >
              <div className="text-center">

                <div
                  className="
                    mx-auto
                    flex h-11 w-11
                    items-center justify-center
                    rounded-full
                    bg-[#FFF7EE]
                    text-velora-gold
                  "
                >
                  <ShoppingBag size={19} />
                </div>

                <p className="mt-3 text-sm font-semibold text-velora-dark">
                  Chargement des commandes...
                </p>

                <p className="mt-1 text-xs text-velora-textGray">
                  Veuillez patienter
                </p>

              </div>
            </div>

          ) : (

            <div
              className="
                overflow-hidden
                rounded-2xl
                border border-[#E7DED2]
                bg-white
                shadow-[0_8px_28px_rgba(17,17,17,0.035)]
              "
            >

              {/* =================================================
                  DESKTOP TABLE
              ================================================= */}

              <div className="hidden md:block">

                <div className="overflow-hidden">

                  <table
                    className="
                      w-full
                      min-w-0
                      table-fixed
                    "
                  >

                    <colgroup>
                      <col className="w-[17%]" />
                      <col className="w-[20%]" />
                      <col className="w-[10%]" />
                      <col className="w-[20%]" />
                      <col className="w-[20%]" />
                      <col className="w-[13%]" />
                    </colgroup>

                    <thead
                      className="
                        border-b border-[#E7DED2]
                        bg-[#FCFAF7]
                      "
                    >

                      <tr
                        className="
                          text-left
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-[0.12em]
                          text-velora-textGray
                        "
                      >

                        <th className="px-5 py-3.5">
                          Commande
                        </th>

                        <th className="px-5 py-3.5">
                          Client
                        </th>

                        <th className="px-5 py-3.5">
                          Total
                        </th>

                        <th className="px-5 py-3.5">
                          Téléphone
                        </th>

                        <th className="px-5 py-3.5">
                          Livraison
                        </th>

                        <th className="px-5 py-3.5 text-center">
                          Action
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {filteredOrders.length === 0 && (

                        <tr>
                          <td
                            colSpan="6"
                            className="
                              px-5
                              py-16
                              text-center
                              text-sm
                              text-velora-textGray
                            "
                          >
                            <div className="flex flex-col items-center">

                              <div
                                className="
                                  flex h-12 w-12
                                  items-center justify-center
                                  rounded-full
                                  bg-[#FCFAF7]
                                  text-[#A59A90]
                                "
                              >
                                <Search size={19} />
                              </div>

                              <p className="mt-3 font-semibold text-velora-dark">
                                Aucune commande trouvée
                              </p>

                              <p className="mt-1 text-xs">
                                Essayez de modifier votre recherche.
                              </p>

                            </div>
                          </td>
                        </tr>

                      )}

                      {paginatedOrders.map((order) => {

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

                        const initials =
                          customerName
                            .split(" ")
                            .map((word) =>
                              word.charAt(0)
                            )
                            .join("")
                            .slice(0, 2)
                            .toUpperCase();

                        return (

                          <tr
                            key={order._id}
                            className="
                              group
                              border-b border-[#EFE7DC]
                              transition-colors
                              duration-200
                              hover:bg-[#FEFCF9]
                            "
                          >

                            {/* ORDER */}

                            <td className="px-4 py-4 align-middle">

                              <p
                                className="
                                  truncate
                                  text-[12px]
                                  font-bold
                                  text-velora-dark
                                "
                                title={
                                  order.orderNumber
                                }
                              >
                                {order.orderNumber ||
                                  `#${order._id.slice(-8)}`}
                              </p>

                              <p className="mt-1 text-[10px] text-[#9A8D80]">
                                {formatDate(
                                  order.createdAt
                                )}
                              </p>

                            </td>

                            {/* CLIENT */}

                            <td className="px-4 py-4 align-middle">

                              <div className="flex min-w-0 items-center gap-2.5">

                                <div
                                  className="
                                    flex h-9 w-9
                                    shrink-0
                                    items-center justify-center
                                    rounded-xl
                                    bg-[#F8F1EA]
                                    text-[11px]
                                    font-bold
                                    text-velora-gold
                                  "
                                >
                                  {initials || "C"}
                                </div>

                                <div className="min-w-0">

                                  <p
                                    className="
                                      truncate
                                      text-[12px]
                                      font-semibold
                                      text-velora-dark
                                    "
                                  >
                                    {customerName}
                                  </p>

                                  <p
                                    className="
                                      mt-0.5
                                      truncate
                                      text-[10px]
                                      text-[#9A8D80]
                                    "
                                  >
                                    {customerPhone}
                                  </p>

                                </div>

                              </div>

                            </td>

                            {/* TOTAL */}

                            <td className="px-4 py-4 align-middle">

                              <p
                                className="
                                  whitespace-nowrap
                                  text-[12px]
                                  font-bold
                                  text-velora-dark
                                "
                              >
                                {formatMoney(
                                  order.totalPrice
                                )}
                              </p>

                              <p className="mt-1 text-[10px] text-[#9A8D80]">
                                {order.orderItems?.length ||
                                  0}{" "}
                                article
                                {(
                                  order.orderItems
                                    ?.length || 0
                                ) > 1
                                  ? "s"
                                  : ""}
                              </p>

                            </td>

                            {/* PHONE */}

                            <td className="px-4 py-4 align-middle">

                              <div className="space-y-2">

                                <StatusBadge
                                  type="phone"
                                  status={
                                    phoneStatus
                                  }
                                />

                                <StatusSelect
                                  value={
                                    phoneStatus
                                  }
                                  options={
                                    PHONE_STATUSES
                                  }
                                  disabled={
                                    savingId ===
                                    `${order._id}-phone`
                                  }
                                  onChange={(
                                    status
                                  ) =>
                                    handleUpdatePhoneStatus(
                                      order._id,
                                      status
                                    )
                                  }
                                />

                              </div>

                            </td>

                            {/* DELIVERY */}

                            <td className="px-4 py-4 align-middle">

                              <div className="space-y-2">

                                <StatusBadge
                                  type="delivery"
                                  status={
                                    deliveryStatus
                                  }
                                />

                                <StatusSelect
                                  value={
                                    deliveryStatus
                                  }
                                  options={
                                    DELIVERY_STATUSES
                                  }
                                  disabled={
                                    savingId ===
                                    `${order._id}-delivery`
                                  }
                                  onChange={(
                                    status
                                  ) =>
                                    handleUpdateDeliveryStatus(
                                      order._id,
                                      status
                                    )
                                  }
                                />

                              </div>

                            </td>

                            {/* ACTION */}

                            <td className="px-4 py-4 align-middle">

                              <div className="flex justify-center">

                                <Link
                                  to={`/admin/orders/${order._id}`}
                                  title="Voir la commande"
                                  aria-label="Voir la commande"
                                  className="
                                    flex h-9 w-9
                                    items-center justify-center
                                    rounded-xl
                                    border border-[#E7DED2]
                                    bg-white
                                    text-[#8D8176]
                                    transition-all
                                    duration-200
                                    hover:border-velora-gold
                                    hover:bg-[#FFF9F3]
                                    hover:text-velora-gold
                                    hover:shadow-[0_5px_15px_rgba(201,106,38,0.10)]
                                  "
                                >
                                  <Eye
                                    size={16}
                                    strokeWidth={1.8}
                                  />
                                </Link>

                              </div>

                            </td>

                          </tr>

                        );
                      })}

                    </tbody>

                  </table>

                </div>

              </div>

              {/* =================================================
                  MOBILE CARDS
              ================================================= */}

              <div className="space-y-3 p-3 md:hidden">

                {filteredOrders.length === 0 && (

                  <div className="px-4 py-14 text-center">

                    <div
                      className="
                        mx-auto
                        flex h-12 w-12
                        items-center justify-center
                        rounded-full
                        bg-[#FCFAF7]
                        text-[#A59A90]
                      "
                    >
                      <Search size={19} />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-velora-dark">
                      Aucune commande trouvée
                    </p>

                  </div>

                )}

                {paginatedOrders.map((order) => {

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

                  const initials =
                    customerName
                      .split(" ")
                      .map((word) =>
                        word.charAt(0)
                      )
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();

                  return (

                    <div
                      key={order._id}
                      className="
                        rounded-2xl
                        border border-[#E7DED2]
                        bg-white
                        p-4
                        shadow-[0_5px_18px_rgba(17,17,17,0.03)]
                      "
                    >

                      {/* TOP */}

                      <div className="flex items-center justify-between gap-3">

                        <div className="flex min-w-0 items-center gap-3">

                          <div
                            className="
                              flex h-10 w-10
                              shrink-0
                              items-center justify-center
                              rounded-xl
                              bg-[#F8F1EA]
                              text-xs
                              font-bold
                              text-velora-gold
                            "
                          >
                            {initials || "C"}
                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-sm font-semibold text-velora-dark">
                              {customerName}
                            </p>

                            <p className="mt-0.5 text-[11px] text-[#9A8D80]">
                              {customerPhone}
                            </p>

                          </div>

                        </div>

                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="
                            flex h-9 w-9
                            shrink-0
                            items-center justify-center
                            rounded-xl
                            border border-[#E7DED2]
                            bg-white
                            text-[#8D8176]
                            hover:border-velora-gold
                            hover:text-velora-gold
                          "
                        >
                          <Eye size={16} />
                        </Link>

                      </div>

                      {/* ORDER SUMMARY */}

                      <div
                        className="
                          mt-4
                          grid
                          grid-cols-2
                          gap-3
                          rounded-xl
                          bg-[#FCFAF7]
                          p-3
                        "
                      >

                        <div>

                          <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#9A8D80]">
                            Commande
                          </p>

                          <p className="mt-1 text-xs font-bold text-velora-dark">
                            {order.orderNumber ||
                              `#${order._id.slice(-8)}`}
                          </p>

                        </div>

                        <div className="text-right">

                          <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#9A8D80]">
                            Total
                          </p>

                          <p className="mt-1 text-sm font-bold text-velora-dark">
                            {formatMoney(
                              order.totalPrice
                            )}
                          </p>

                        </div>

                        <div>

                          <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#9A8D80]">
                            Date
                          </p>

                          <p className="mt-1 text-[11px] text-[#81756A]">
                            {formatDateTime(
                              order.createdAt
                            )}
                          </p>

                        </div>

                      </div>

                      {/* PHONE */}

                      <div className="mt-4">

                        <div className="mb-2 flex items-center gap-2">

                          <Phone
                            size={14}
                            className="text-velora-gold"
                          />

                          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#8D8176]">
                            Vérification téléphone
                          </p>

                        </div>

                        <StatusSelect
                          value={phoneStatus}
                          options={PHONE_STATUSES}
                          disabled={
                            savingId ===
                            `${order._id}-phone`
                          }
                          onChange={(status) =>
                            handleUpdatePhoneStatus(
                              order._id,
                              status
                            )
                          }
                        />

                      </div>

                      {/* DELIVERY */}

                      <div className="mt-4">

                        <div className="mb-2 flex items-center gap-2">

                          <Truck
                            size={14}
                            className="text-velora-gold"
                          />

                          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#8D8176]">
                            Livraison
                          </p>

                        </div>

                        <StatusSelect
                          value={
                            deliveryStatus
                          }
                          options={
                            DELIVERY_STATUSES
                          }
                          disabled={
                            savingId ===
                            `${order._id}-delivery`
                          }
                          onChange={(status) =>
                            handleUpdateDeliveryStatus(
                              order._id,
                              status
                            )
                          }
                        />

                      </div>

                    </div>

                  );
                })}

              </div>

            </div>

          )}

        </div>

        <Pagination
          pagination={{
            page,
            pages: Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE)),
            total: filteredOrders.length,
          }}
          onPageChange={setPage}
        />

      </div>
    </>
  );
}