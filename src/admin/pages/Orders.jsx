import { useEffect, useMemo, useState } from "react";
import { Eye, Search } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import AdminPageHeader from "../components/AdminPageHeader";
import {
  getOrders,
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

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(date))
    : "-";

const money = (value) => `${Number(value || 0).toFixed(2)} DT`;
const normalizePhoneStatus = (status) =>
  status === "En attente d d'appel" ? "En attente d'appel" : status;

function Badge({ children, tone = "neutral" }) {
  const styles = {
    success: "border-green-100 bg-green-50 text-green-700",
    warning: "border-amber-100 bg-amber-50 text-amber-700",
    danger: "border-red-100 bg-red-50 text-red-600",
    neutral: "border-[#E7DED2] bg-[#FBF8F2] text-velora-dark",
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-semibold ${styles[tone]}`}>
      {children}
    </span>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deliveryFilter, setDeliveryFilter] = useState("");
  const [savingId, setSavingId] = useState("");

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data.orders || data || []);
    } catch (error) {
      console.log(error);
      toast.error("Impossible de charger les commandes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const query = search.toLowerCase();
      const matchesSearch =
        !query ||
        order.orderNumber?.toLowerCase().includes(query) ||
        order._id?.toLowerCase().includes(query) ||
        order.shippingAddress?.fullName?.toLowerCase().includes(query) ||
        order.shippingAddress?.phone?.toLowerCase().includes(query) ||
        order.user?.name?.toLowerCase().includes(query);

      const matchesDelivery =
        !deliveryFilter || order.deliveryStatus === deliveryFilter;

      return matchesSearch && matchesDelivery;
    });
  }, [orders, search, deliveryFilter]);

  const updateOrder = async (orderId, field, status) => {
    try {
      setSavingId(`${orderId}-${field}`);
      const updated =
        field === "phone"
          ? await updatePhoneStatus(orderId, status)
          : await updateDeliveryStatus(orderId, status);

      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? updated : order))
      );
      toast.success("Statut mis à jour.");
    } catch (error) {
      console.log(error);
      toast.error("Erreur lors de la mise à jour.");
    } finally {
      setSavingId("");
    }
  };

  return (
    <>
          <AdminPageHeader
            title="Commandes"
            description="Suivez les commandes, la confirmation téléphone et l'avancement de la livraison."
            breadcrumb={["Commandes"]}
          />

      <div className="border-b border-[#efe7dc] bg-[#fcfaf7] px-4 py-4 sm:px-6">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_240px]">
          <label className="relative flex items-center h-11 w-full rounded-xl border border-[#e7ded2] bg-white px-3 shadow-[0_6px_20px_rgba(17,17,17,0.03)] outline-none transition focus-within:border-velora-gold focus-within:ring-2 focus-within:ring-velora-gold/10">
            <Search size={16} className="text-velora-textGray" />
            <input
              type="text"
              placeholder="Rechercher par numéro, client ou téléphone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-full flex-1 bg-transparent pl-3 text-sm text-velora-dark outline-none placeholder:text-velora-textGray"
            />
          </label>

          <select
            value={deliveryFilter}
            onChange={(e) => setDeliveryFilter(e.target.value)}
            className="h-11 w-full rounded-xl border border-[#e7ded2] bg-white px-3 text-sm font-medium text-velora-dark outline-none transition focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10"
          >
            <option value="">Toutes les livraisons</option>
            {deliveryStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-7">
        {loading ? (
          <div className="flex min-h-[45vh] items-center justify-center rounded-[24px] border border-[#efe7dc] bg-white shadow-[0_10px_30px_rgba(17,17,17,0.04)]">
            <p className="text-sm font-semibold text-velora-textGray">Chargement des commandes...</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[24px] border border-[#efe7dc] bg-white shadow-[0_12px_30px_rgba(17,17,17,0.04)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1120px]">
                <thead className="bg-[#faf7f2]">
                  <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-velora-textGray">
                    <th className="px-5 py-4">Commande</th>
                    <th className="px-5 py-4">Client</th>
                    <th className="px-5 py-4">Total</th>
                    <th className="px-5 py-4">Téléphone</th>
                    <th className="px-5 py-4">Livraison</th>
                    <th className="px-5 py-4">Facture</th>
                    <th className="px-5 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#efe7dc]">
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-5 py-14 text-center text-sm text-velora-textGray">
                        Aucune commande trouvée.
                      </td>
                    </tr>
                  )}

                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="border-t border-[#f3ebe1] transition-colors hover:bg-[#fcfaf7]">
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-velora-dark">
                          {order.orderNumber || `#${order._id.slice(-8)}`}
                        </p>
                        <p className="mt-1 text-xs text-velora-textGray">{formatDate(order.createdAt)}</p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-velora-dark">
                          {order.shippingAddress?.fullName || order.user?.name || "Client invité"}
                        </p>
                        <p className="mt-1 text-xs text-velora-textGray">{order.shippingAddress?.phone || "-"}</p>
                      </td>

                      <td className="px-5 py-4 text-sm font-bold text-velora-dark">{money(order.totalPrice)}</td>

                      <td className="px-5 py-4">
                        <select
                          value={normalizePhoneStatus(order.phoneVerificationStatus) || phoneStatuses[0]}
                          disabled={savingId === `${order._id}-phone`}
                          onChange={(e) => updateOrder(order._id, "phone", e.target.value)}
                          className="h-10 w-full min-w-[190px] rounded-xl border border-[#e7ded2] bg-[#fcfaf7] px-3 text-xs font-medium text-velora-dark outline-none transition focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {phoneStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={order.deliveryStatus || deliveryStatuses[0]}
                          disabled={savingId === `${order._id}-delivery`}
                          onChange={(e) => updateOrder(order._id, "delivery", e.target.value)}
                          className="h-10 w-full min-w-[190px] rounded-xl border border-[#e7ded2] bg-[#fcfaf7] px-3 text-xs font-medium text-velora-dark outline-none transition focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deliveryStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-5 py-4">
                        {order.invoiceSent ? (
                          <Badge tone="success">Envoyée</Badge>
                        ) : (
                          <Badge tone="warning">Non envoyée</Badge>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-center">
                          <Link
                            to={`/admin/orders/${order._id}`}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e7ded2] bg-white text-velora-dark transition-all duration-200 hover:-translate-y-0.5 hover:border-velora-gold hover:bg-[#fffaf4] hover:text-velora-gold"
                            aria-label="Voir la commande"
                          >
                            <Eye size={16} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

