import { useEffect, useState } from "react";
import { Search, Eye, Package } from "lucide-react";
import { Link } from "react-router-dom";

import { getOrders } from "../services/orderApi";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const loadOrders = async () => {
    try {
      const data = await getOrders();

      setOrders(data.orders || data);

      setFilteredOrders(data.orders || data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    let result = [...orders];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((order) =>
        (order._id || "").toLowerCase().includes(q) ||
        (order.user?.name || "").toLowerCase().includes(q)
      );
    }

    setFilteredOrders(result);
  }, [search, orders]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-velora-gold">GESTION DES COMMANDES</p>
        <div className="flex justify-between items-center mt-2">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-premium font-bold text-[#1F1713]">Commandes</h1>
            <p className="text-sm text-gray-500 mt-2">Gérez toutes les commandes.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E8DED1] p-4 sm:p-5 shadow-[0_6px_24px_rgba(17,17,17,0.035)] mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            aria-label="Rechercher une commande"
            placeholder="Rechercher une commande..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 rounded-lg border border-[#E7DED2] bg-[#FCFAF7] pl-11 pr-4 text-sm text-[#1F1713] outline-none focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10"
          />
        </div>
      </div>
      {loading ? (

        <div className="rounded-xl border border-[#E8DED1] bg-white min-h-[280px] flex items-center justify-center shadow-[0_6px_24px_rgba(17,17,17,0.035)]">
          <p className="text-sm font-semibold text-gray-500 animate-pulse">Chargement...</p>
        </div>

      ) : (

        <div className="rounded-xl border border-[#E8DED1] bg-white overflow-hidden shadow-[0_6px_24px_rgba(17,17,17,0.035)]">

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">

              <thead className="bg-[#FCFAF7] border-b border-[#E7DED2]">
                <tr>
                  <th className="text-left px-5 lg:px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#6F6259]">Commande</th>
                  <th className="text-left px-5 lg:px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#6F6259]">Client</th>
                  <th className="text-left px-5 lg:px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#6F6259]">Total</th>
                  <th className="text-left px-5 lg:px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#6F6259]">Paiement</th>
                  <th className="text-left px-5 lg:px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#6F6259]">Livraison</th>
                  <th className="text-left px-5 lg:px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#6F6259]">Statut</th>
                  <th className="text-center px-5 lg:px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#6F6259]">Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-16 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#FFF7EE] flex items-center justify-center text-velora-gold">
                          <Package size={18} />
                        </div>
                        <p className="text-sm text-gray-500">Aucune commande trouvée.</p>
                      </div>
                    </td>
                  </tr>
                )}

                {filteredOrders.map((order) => (
                  <tr key={order._id} className="border-b border-[#EFE7DC] hover:bg-[#FCFAF7] transition-colors duration-200">

                    <td className="px-5 lg:px-6 py-4 align-middle font-semibold text-sm text-[#1F1713]">#{order._id.slice(-8)}</td>

                    <td className="px-5 lg:px-6 py-4 align-middle">
                      <div className="space-y-1">
                        <p className="font-semibold text-sm text-[#1F1713]">{order.user?.name || "Client"}</p>
                        <p className="text-xs text-gray-500">{order.user?.email}</p>
                      </div>
                    </td>

                    <td className="px-5 lg:px-6 py-4 align-middle text-sm font-bold text-[#1F1713]">{order.totalPrice?.toFixed(2)} DT</td>

                    <td className="px-5 lg:px-6 py-4 align-middle">
                      <span className="inline-flex items-center rounded-md border border-amber-100 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">A la livraison</span>
                    </td>

                    <td className="px-5 lg:px-6 py-4 align-middle">
                      {order.deliveryStatus === "Livré" ? (
                        <span className="inline-flex items-center rounded-md border border-green-100 bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-700">Livrée</span>
                      ) : (
                        <span className="inline-flex items-center rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700">{order.deliveryStatus || "En cours"}</span>
                      )}
                    </td>

                    <td className="px-5 lg:px-6 py-4 align-middle">
                      <span className="inline-flex items-center rounded-md border border-[#E7DED2] bg-[#FCFAF7] px-2.5 py-1 text-[10px] font-semibold text-gray-700">{order.phoneVerificationStatus || "En attente d'appel"}</span>
                    </td>

                    <td className="px-5 lg:px-6 py-4 align-middle text-center">
                      <Link to={`/admin/orders/${order._id}`} aria-label={`Voir la commande ${order._id.slice(-8)}`} className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-[#E7DED2] bg-white text-[#1F1713] hover:border-velora-gold hover:text-velora-gold hover:bg-[#FFFDF9] transition-colors">
                        <Eye size={17} />
                      </Link>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>
          </div>

        </div>

      )}
    </div>
  );
}
