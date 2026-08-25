import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Mail, MapPin, Package, Phone, ReceiptText, User } from "lucide-react";
import toast from "react-hot-toast";

import AdminPageHeader from "../components/AdminPageHeader";
import {
  getOrderById,
  updateDeliveryStatus,
  updatePhoneStatus,
} from "../../services/orderApi";

const phoneStatuses = [
  "En attente d'appel",
  "Confirmé au téléphone",
  "Annulé au téléphone",
  "Injoignable",
];

const deliveryStatuses = [
  "En attente",
  "En cours de préparation",
  "Expédié",
  "Livré",
  "Retourné",
];

const money = (value) => Number(value || 0).toFixed(2);
const normalizePhoneStatus = (status) =>
  status === "En attente d d'appel" ? "En attente d'appel" : status;

function InfoPanel({ icon: Icon, title, children }) {
  return (
    <div className="rounded-[20px] border border-[#efe7dc] bg-white p-5 shadow-[0_10px_30px_rgba(17,17,17,0.04)]">
      <div className="mb-3 flex items-center gap-2">
        <Icon size={17} className="text-velora-gold" />
        <h3 className="text-sm font-semibold text-velora-dark">{title}</h3>
      </div>
      <div className="text-sm leading-7 text-velora-textGray">{children}</div>
    </div>
  );
}

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data.order || data);
      } catch (error) {
        console.log(error);
        toast.error("Commande introuvable.");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const totals = useMemo(() => {
    if (!order) return { items: 0, shipping: 0, total: 0 };
    return {
      items: Number(order.itemsPrice || 0),
      shipping: Number(order.shippingPrice || 0),
      total: Number(order.totalPrice || 0),
    };
  }, [order]);

  const updateStatus = async (field, status) => {
    try {
      setSaving(field);
      const updated =
        field === "phone"
          ? await updatePhoneStatus(order._id, status)
          : await updateDeliveryStatus(order._id, status);
      setOrder(updated);
      toast.success("Statut mis à jour.");
    } catch (error) {
      console.log(error);
      toast.error("Erreur lors de la mise à jour.");
    } finally {
      setSaving("");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm font-semibold text-velora-textGray">Chargement de la commande...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm font-semibold text-red-600">Commande introuvable</p>
      </div>
    );
  }

  return (
    <>
      <AdminPageHeader
        title={order.orderNumber || `Commande #${order._id.slice(-8)}`}
        description="Détail complet de la commande, client, adresse, articles et statuts."
        breadcrumb={["Commandes", "Détail"]}
        backTo="/admin/orders"
      />

      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-7">
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <InfoPanel icon={User} title="Client">
              <p className="font-semibold text-velora-dark">
                {order.shippingAddress?.fullName || order.user?.name || "Client invite"}
              </p>
              <p>{order.user?.email || order.shippingAddress?.email || "-"}</p>
            </InfoPanel>

            <InfoPanel icon={Phone} title="Contact">
              <p>{order.shippingAddress?.phone || "-"}</p>
              <p>{order.shippingAddress?.email || "-"}</p>
            </InfoPanel>

            <InfoPanel icon={MapPin} title="Adresse">
              <p>{order.shippingAddress?.address || "-"}</p>
              <p>
                {order.shippingAddress?.city || "-"} {order.shippingAddress?.zipCode || ""}
              </p>
            </InfoPanel>
          </div>

          <div className="overflow-hidden rounded-[20px] border border-[#efe7dc] bg-white shadow-[0_10px_30px_rgba(17,17,17,0.04)]">
            <div className="border-b border-[#efe7dc] px-5 py-5 sm:px-6">
              <h2 className="font-premium text-2xl font-bold text-velora-dark">Articles</h2>
            </div>
            <div className="divide-y divide-[#efe7dc]">
              {order.orderItems?.map((item) => (
                <div key={`${item.product}-${item.selectedSize}-${item.selectedColor}`} className="grid gap-4 px-5 py-5 transition-colors hover:bg-[#fcfaf7] sm:px-6 md:grid-cols-[minmax(0,1fr)_120px]">
                  <div>
                    <p className="font-semibold text-velora-dark">{item.name}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-velora-textGray">
                      <span>Quantité: {item.quantity}</span>
                      <span>Taille: {item.selectedSize || "-"}</span>
                      <span>Couleur: {item.selectedColor || "-"}</span>
                      {item.customization?.petName && (
                        <span>Nom: {item.customization.petName}</span>
                      )}
                      {item.customization?.phoneNumber && (
                        <span>Téléphone: {item.customization.phoneNumber}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-velora-dark md:text-right">
                    {money(Number(item.price || 0) * Number(item.quantity || 1))} DT
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[20px] border border-[#efe7dc] bg-white p-5 shadow-[0_10px_30px_rgba(17,17,17,0.04)]">
            <div className="flex items-center gap-2">
              <Package size={18} className="text-velora-gold" />
              <h3 className="font-semibold text-velora-dark">Statuts</h3>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-velora-textGray">
                Confirmation téléphone
              </span>
              <select
                value={normalizePhoneStatus(order.phoneVerificationStatus) || phoneStatuses[0]}
                disabled={saving === "phone"}
                onChange={(e) => updateStatus("phone", e.target.value)}
                className="h-11 w-full rounded-xl border border-[#e7ded2] bg-[#fcfaf7] px-3 text-sm text-velora-dark outline-none transition focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {phoneStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 block">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-velora-textGray">
                Livraison
              </span>
              <select
                value={order.deliveryStatus || deliveryStatuses[0]}
                disabled={saving === "delivery"}
                onChange={(e) => updateStatus("delivery", e.target.value)}
                className="h-11 w-full rounded-xl border border-[#e7ded2] bg-[#fcfaf7] px-3 text-sm text-velora-dark outline-none transition focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deliveryStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="rounded-[20px] border border-[#efe7dc] bg-white p-5 shadow-[0_10px_30px_rgba(17,17,17,0.04)]">
            <div className="mb-5 flex items-center gap-2">
              <ReceiptText size={18} className="text-velora-gold" />
              <h3 className="font-semibold text-velora-dark">Total</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-velora-textGray">
                <span>Articles</span>
                <strong className="text-velora-dark">{money(totals.items)} DT</strong>
              </div>
              <div className="flex justify-between text-velora-textGray">
                <span>Livraison</span>
                <strong className="text-velora-dark">{money(totals.shipping)} DT</strong>
              </div>
              <div className="border-t border-[#efe7dc] pt-4">
                <div className="flex items-center justify-between text-velora-dark">
                  <span className="font-semibold">Total</span>
                  <strong className="text-lg font-bold">{money(totals.total)} DT</strong>
                </div>
              </div>
            </div>
          </div>

          <InfoPanel icon={Mail} title="Facture">
            {order.invoiceSent ? "Facture envoyée au client." : "Facture non envoyée."}
          </InfoPanel>
        </aside>
      </div>
    </>
  );
}

