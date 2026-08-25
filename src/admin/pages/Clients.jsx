import { useEffect, useMemo, useState } from "react";
import { Mail, Phone, Search, ShoppingCart, User } from "lucide-react";
import toast from "react-hot-toast";

import AdminPageHeader from "../components/AdminPageHeader";
import { getClients } from "../services/clientApi";

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(date))
    : "-";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await getClients();
        setClients(data.clients || []);
      } catch (error) {
        console.log(error);
        toast.error("Impossible de charger les clients.");
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  const filteredClients = useMemo(() => {
    const query = search.toLowerCase();
    if (!query) return clients;

    return clients.filter(
      (client) =>
        client.name?.toLowerCase().includes(query) ||
        client.email?.toLowerCase().includes(query) ||
        client.phone?.toLowerCase().includes(query)
    );
  }, [clients, search]);

  return (
    <>
      <AdminPageHeader
        title="Clients"
        description="Consultez les comptes clients, leurs coordonnées et leur historique d’achat."
        breadcrumb={["Clients"]}
      />

      <div className="p-4 sm:p-6 lg:p-7">
        <div className="mb-5">
          <label className="relative flex h-11 items-center rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-3 transition-colors duration-200 focus-within:border-velora-gold/70 focus-within:ring-2 focus-within:ring-velora-gold/10">
            <Search size={18} className="text-velora-textGray" />
            <input
              type="text"
              aria-label="Rechercher un client"
              placeholder="Rechercher un client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-full flex-1 bg-transparent pl-3 text-sm text-velora-dark outline-none placeholder:text-velora-textGray"
            />
          </label>
        </div>

        <div className="mt-0">
          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-[#E7DED2] bg-white text-sm text-velora-textGray shadow-[0_6px_24px_rgba(17,17,17,0.035)]">
              <p className="text-sm text-velora-textGray">Chargement des clients...</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-[#E7DED2] bg-white shadow-[0_6px_24px_rgba(17,17,17,0.035)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[940px]">
                  <thead className="border-b border-[#E7DED2] bg-[#FCFAF7]">
                    <tr className="text-left text-[10px] font-bold uppercase tracking-[0.14em] text-velora-textGray">
                      <th className="px-5 py-4">Client</th>
                      <th className="px-5 py-4">Contact</th>
                      <th className="px-5 py-4">Adresse</th>
                      <th className="px-5 py-4">Commandes</th>
                      <th className="px-5 py-4">Total achats</th>
                      <th className="px-5 py-4">Inscription</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1E9DF]">
                    {filteredClients.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-5 py-14 text-center text-sm text-velora-textGray">
                          Aucun client trouvé.
                        </td>
                      </tr>
                    )}

                    {filteredClients.map((client) => (
                      <tr key={client._id} className="border-t border-[#F1E9DF] transition-colors duration-200 hover:bg-[#FCFAF7]">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-velora-gold text-sm font-bold text-white">
                              {client.name?.charAt(0)?.toUpperCase() || "C"}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-velora-dark">
                                {client.name || "Client"}
                              </p>
                              <p className="mt-1 text-xs text-velora-textGray">
                                {client.role}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-velora-textGray">
                          <p className="flex items-center gap-2">
                            <Mail size={14} />
                            {client.email || "-"}
                          </p>
                          <p className="mt-1.5 flex items-center gap-2">
                            <Phone size={14} />
                            {client.phone || "-"}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm leading-6 text-velora-textGray">
                          <p>{client.address?.street || "-"}</p>
                          <p>{client.address?.city || ""} {client.address?.zipCode || ""}</p>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-2 rounded-full border border-[#E7DED2] bg-[#FBF8F2] px-3 py-1.5 text-xs font-semibold text-velora-dark">
                            <ShoppingCart size={14} />
                            {client.ordersCount || 0}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-velora-dark">
                          {Number(client.totalSpent || 0).toFixed(2)} DT
                        </td>

                        <td className="px-5 py-4 text-sm text-velora-textGray">
                          <span className="inline-flex items-center gap-2 text-sm text-velora-textGray">
                            <User size={14} />
                            {formatDate(client.createdAt)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
