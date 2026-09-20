import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
  ReceiptText,
  Truck,
} from "lucide-react";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { getOrderById } from "../services/orderApi";
import { resolveAssetUrl } from "../config/api";

/* =========================================================
   HELPERS
========================================================= */

const formatDate = (date) => {
  if (!date) return "Date inconnue";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

const money = (value) => Number(value || 0).toFixed(2);

const getOrderNumber = (id) =>
  id?.slice(-8)?.toUpperCase() || "COMMANDE";

const getStatusLabel = (value) => {
  if (!value) return "En attente";

  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

/* =========================================================
   STATUS
========================================================= */

function StatusBadge({ children, type = "neutral" }) {
  const styles = {
    success:
      "bg-green-50 text-green-700 border-green-100",
    warning:
      "bg-[#FFF7EE] text-[#C96A26] border-[#F2DCC6]",
    neutral:
      "bg-[#FCFAF7] text-velora-dark border-[#E7DED2]",
    info:
      "bg-blue-50 text-blue-700 border-blue-100",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold ${styles[type]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          type === "success"
            ? "bg-green-500"
            : type === "info"
            ? "bg-blue-500"
            : "bg-[#C96A26]"
        }`}
      />

      {children}
    </span>
  );
}

/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FFF7EE] text-[#C96A26]">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-velora-textGray">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-velora-dark">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   ORDER TIMELINE
========================================================= */

function OrderTimeline({ order }) {
  const delivered = order.deliveryStatus === "Livré";

 const phoneStatus = order.phoneVerificationStatus || "En attente d'appel";

const confirmationActive =
  phoneStatus === "Confirmé au téléphone";

const confirmationCancelled =
  phoneStatus === "Annulé au téléphone";

const steps = [
  {
    label: "Commande",
    description: "Commande enregistrée",
    icon: Package,
    active: true,
    statusText: "Validé",
    statusType: "success",
  },
  {
    label: "Confirmation",
    description: phoneStatus,
    icon: CheckCircle2,
    active: confirmationActive,
    statusText: confirmationActive
      ? "Validé"
      : confirmationCancelled
      ? "Annulé"
      : phoneStatus === "Injoignable"
      ? "Non confirmé"
      : "En attente",
    statusType: confirmationActive
      ? "success"
      : confirmationCancelled
      ? "cancelled"
      : "pending",
  },
  {
    label: "Livraison",
    description: delivered
      ? "Commande livrée"
      : order.deliveryStatus || "En attente",
    icon: Truck,
    active: delivered,
    statusText: delivered ? "Livré" : "En attente",
    statusType: delivered ? "success" : "pending",
  },
];

  return (
    <div className="rounded-xl border border-[#E8DED1] bg-white">
      <div className="border-b border-[#EFE7DC] px-5 py-4 sm:px-6">
        {/* <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C96A26]">
          Suivi
        </p> */}

        <h2 className="mt-2 font-premium text-xl font-bold text-velora-dark sm:text-2xl">
          Évolution de la commande
        </h2>
      </div>

      <div className="px-5 py-6 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3 md:gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.label}
                className="relative flex items-start gap-3"
              >
                {index < steps.length - 1 && (
                  <div className="absolute left-[18px] top-10 hidden h-px w-[calc(100%-18px)] bg-[#E7DED2] md:block" />
                )}

                <div
                  className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                    step.active
                      ? "border-[#C96A26] bg-[#C96A26] text-white"
                      : "border-[#E7DED2] bg-[#FCFAF7] text-velora-textGray"
                  }`}
                >
                  {step.active ? (
                    <Check size={16} strokeWidth={2.5} />
                  ) : (
                    <Icon size={16} />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-velora-textGray">
                    {step.label}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-velora-dark">
                    {step.description}
                  </p>

                  <div
                    className={`mt-1 text-[11px] ${
                      step.active
                        ? "text-[#C96A26]"
                        : "text-velora-textGray"
                    }`}
                  >
                    <p
  className={`mt-1 text-[11px] ${
    step.statusType === "success"
      ? "text-green-600"
      : step.statusType === "cancelled"
      ? "text-red-500"
      : "text-velora-textGray"
  }`}
>
  {step.statusText}
</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SHIPPING ADDRESS
========================================================= */

function ShippingAddress({ address }) {
  return (
    <div className="rounded-xl border border-[#E8DED1] bg-white">
      <div className="border-b border-[#EFE7DC] px-5 py-4 sm:px-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C96A26]">
          Livraison
        </p>

        <h2 className="mt-2 font-premium text-xl font-bold text-velora-dark sm:text-2xl">
          Adresse de livraison
        </h2>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FFF7EE] text-[#C96A26]">
            <MapPin size={18} />
          </div>

          <div className="min-w-0 text-sm leading-7 text-velora-textGray">
            <p className="font-semibold text-velora-dark">
              {address?.fullName || "Client"}
            </p>

            <p>
              {address?.phone || "Téléphone non renseigné"}
            </p>

            <p>
              {address?.address || "Adresse non renseignée"}
            </p>

            <p>
              {[
                address?.city,
                address?.governorate,
              ]
                .filter(Boolean)
                .join(", ") || "Ville non renseignée"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ORDER ITEMS
========================================================= */

function OrderItems({ items = [] }) {

  const count = items.length;

  return (
    <div className="rounded-xl border border-[#E8DED1] bg-white">
      <div className="flex flex-col gap-2 border-b border-[#EFE7DC] px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C96A26]">
            Produits
          </p>

          <h2 className="mt-2 font-premium text-xl font-bold text-velora-dark sm:text-2xl">
            Produits commandés
          </h2>
        </div>

        <p className="text-xs text-velora-textGray">
          {count} {count > 1 ? "articles" : "article"}
        </p>
      </div>

      <div className="divide-y divide-[#EFE7DC]">
        {items.map((item, index) => {
          const imageSource =
  item.image ||
  item.product?.image ||
  item.product?.images?.[0] ||
  item.product?.images?.[0]?.url ||
  null;

const image = imageSource
  ? resolveAssetUrl(imageSource)
  : null;

          const quantity = Number(item.quantity || 1);
          const price = Number(item.price || 0);
          const subtotal = price * quantity;

          return (
            <div
              key={item._id || `${item.name}-${index}`}
              className="flex flex-col gap-4 px-5 py-5 transition-colors hover:bg-[#FCFAF7] sm:flex-row sm:items-center sm:px-6"
            >
              {/* IMAGE */}

             <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#EFE7DC] bg-[#FCFAF7] p-2">
  {image ? (
    <img
      src={image}
      alt={item.name || "Produit"}
      className="h-full w-full object-contain"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  ) : (
    <Package
      size={24}
      strokeWidth={1.7}
      className="text-[#C96A26]"
    />
  )}
</div>

              {/* INFO */}

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-velora-dark sm:text-base">
                  {item.name}
                </h3>

                <div className="mt-2 flex flex-wrap gap-2">
                  {item.size && (
                    <span className="rounded-md bg-[#FCFAF7] px-2.5 py-1 text-[10px] text-velora-textGray">
                      Taille : {item.size}
                    </span>
                  )}

                  {item.color && (
                    <span className="rounded-md bg-[#FCFAF7] px-2.5 py-1 text-[10px] text-velora-textGray">
                      Couleur : {item.color}
                    </span>
                  )}

                  <span className="rounded-md bg-[#FCFAF7] px-2.5 py-1 text-[10px] text-velora-textGray">
                    Quantité : {quantity}
                  </span>
                </div>
              </div>

              {/* PRICE */}

              <div className="flex items-center justify-between gap-5 sm:block sm:text-right">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-velora-textGray">
                  Sous-total
                </p>

                <p className="mt-1 font-premium text-lg font-bold text-velora-dark">
                  {money(subtotal)}
                  <span className="ml-1 text-[9px] font-semibold uppercase tracking-wider text-velora-textGray">
                    DT
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   ORDER SUMMARY
========================================================= */

function OrderSummary({ summary, paymentMethod }) {
  return (
    <aside className="lg:sticky lg:top-24 lg:h-fit">
      <div className="overflow-hidden rounded-xl border border-[#E8DED1] bg-white">
        <div className="border-b border-[#EFE7DC] px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              {/* <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C96A26]">
                Résumé
              </p> */}

              <h2 className="mt-2 font-premium text-xl font-bold text-velora-dark">
                Total commande
              </h2>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF7EE] text-[#C96A26]">
              <ReceiptText size={17} />
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-velora-textGray">
                Sous-total
              </span>

              <span className="font-semibold text-velora-dark">
                {money(summary.subtotal)} DT
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-velora-textGray">
                Livraison
              </span>

              <span className="font-semibold text-velora-dark">
                {money(summary.shipping)} DT
              </span>
            </div>
          </div>

          <div className="my-5 border-t border-[#E7DED2]" />

          <div className="flex items-center justify-end">
            <div className="flex flex-col items-end text-right">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#6F6259]">
                Total
              </span>

              <p className="mt-1 flex items-end justify-end gap-1 leading-none text-[#201B18]">
                <span className="text-[20px] font-semibold tracking-[-0.02em] sm:text-[24px]">
                  {money(summary.total)}
                </span>

                <span className="pb-[2px] text-[9px] font-bold uppercase tracking-[0.12em] text-[#6F6259]">
                  DT
                </span>
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-lg bg-[#FCFAF7] p-3.5">
            <div className="flex items-center gap-3">
              <CreditCard
                size={16}
                className="text-[#C96A26]"
              />

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-velora-textGray">
                  Paiement
                </p>

                <p className="mt-1 text-xs font-semibold text-velora-dark">
                  {paymentMethod || "À la livraison"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await getOrderById(id);

        setOrder(data.order || data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const summary = useMemo(() => {
    if (!order) {
      return {
        subtotal: 0,
        shipping: 0,
        total: 0,
      };
    }

    const shipping = Number(
      order.shippingPrice || 0
    );

    const total = Number(
      order.totalPrice || 0
    );

    return {
      subtotal: Math.max(total - shipping, 0),
      shipping,
      total,
    };
  }, [order]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3EC]">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex items-center gap-3">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#C96A26] border-t-transparent" />

            <span className="text-sm font-semibold text-velora-dark">
              Chargement de la commande...
            </span>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  /* =======================================================
     NOT FOUND
  ======================================================= */

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F7F3EC]">
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF7EE] text-[#C96A26]">
              <Package size={25} />
            </div>

            <h1 className="mt-5 font-premium text-2xl font-bold text-velora-dark">
              Commande introuvable
            </h1>

            <p className="mt-2 text-sm text-velora-textGray">
              Cette commande n'existe pas ou n'est plus disponible.
            </p>

            <Link
              to="/account/orders"
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-[#C96A26] px-5 text-sm font-semibold text-white transition hover:bg-[#B85E20]"
            >
              <ArrowLeft size={15} />
              Mes commandes
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const orderNumber = getOrderNumber(order._id);

  const itemCount = order.orderItems?.length || 0;

  const delivered =
    order.deliveryStatus === "Livré";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F7F3EC] pb-14 text-velora-dark">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          {/* =================================================
              HEADER
          ================================================= */}

          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-6"
          >
            <Link
              to="/account/orders"
              className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-velora-textGray transition-colors hover:text-[#C96A26]"
            >
              <ArrowLeft size={14} />
              Retour aux commandes
            </Link>

            <div className="flex flex-col gap-5 rounded-xl border border-[#E8DED1] bg-white px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#6F6259]">
                  Référence
                </p>

                <div className="mt-2 flex flex-col gap-2">
                  <h1 className="leading-none text-[26px] font-semibold tracking-[-0.04em] text-[#1F1713] sm:text-[30px]">
                    {order.orderNumber || orderNumber}
                  </h1>

                  <span className="flex items-center gap-2 text-xs text-velora-textGray">
                    <CalendarDays size={14} />

                    {order.createdAt
                      ? formatDate(order.createdAt)
                      : "Date inconnue"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-4 py-2.5 text-center">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-velora-textGray">
                    Articles
                  </p>

                  <p className="mt-1 text-sm font-bold text-velora-dark">
                    {itemCount}
                  </p>
                </div>

                <div className="rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-4 py-2.5 text-center">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-velora-textGray">
                    Total
                  </p>

                  <p className="mt-1 text-sm font-bold text-velora-dark">
                    {money(summary.total)} DT
                  </p>
                </div>

                <StatusBadge
                  type={delivered ? "success" : "warning"}
                >
                  {getStatusLabel(
                    order.deliveryStatus ||
                      order.phoneVerificationStatus ||
                      "En cours"
                  )}
                </StatusBadge>
              </div>
            </div>
          </motion.section>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">

            {/* LEFT */}

            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
              className="min-w-0 space-y-5"
            >
              <OrderTimeline order={order} />

          

              <OrderItems
                items={order.orderItems || []}
              />

              <ShippingAddress
                address={order.shippingAddress}
              />
            </motion.div>

            {/* RIGHT */}

            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
            >
              <OrderSummary
                summary={summary}
                paymentMethod={order.paymentMethod}
              />

              <div className="mt-4">
                <Link
                  to="/account/orders"
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#E7DED2] bg-white text-xs font-semibold text-velora-dark transition-colors hover:border-[#C96A26] hover:text-[#C96A26]"
                >
                  Toutes mes commandes
                </Link>
              </div>

              <Link
                to="/shop"
                className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#C96A26] text-xs font-semibold text-white transition-colors hover:bg-[#B85E20]"
              >
                Continuer mes achats
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}