import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Package, Plus, Search, Trash2, X, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";

import AdminPageHeader from "../components/AdminPageHeader";
import ConfirmModal from "../../components/ConfirmModal";
import { getPacks, deletePack, updatePack } from "../../services/packApi";

const PACKS_PER_PAGE = 8;

function StatusBadge({ active }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${active ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-red-500"}`} />
      {active ? "Actif" : "Inactif"}
    </span>
  );
}

export default function Packs() {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedPack, setSelectedPack] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadPacks = async () => {
    try {
      setLoading(true);
      const data = await getPacks();
      setPacks(data.packs || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Impossible de charger les packs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPacks();
  }, []);

  const filteredPacks = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return packs;
    return packs.filter((pack) => {
      const name = String(pack.name || "").toLowerCase();
      const description = String(pack.description || "").toLowerCase();
      return name.includes(term) || description.includes(term);
    });
  }, [packs, search]);

  const totalPages = Math.max(1, Math.ceil(filteredPacks.length / PACKS_PER_PAGE));
  const paginatedPacks = filteredPacks.slice((page - 1) * PACKS_PER_PAGE, page * PACKS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleDelete = async () => {
    if (!selectedPack) return;
    try {
      setDeleting(true);
      await deletePack(selectedPack._id);
      setPacks((prev) => prev.filter((pack) => pack._id !== selectedPack._id));
      toast.success("Pack supprimé.");
      setDeleteOpen(false);
      setSelectedPack(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Erreur lors de la suppression.");
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async (pack) => {
    try {
      const updated = await updatePack(pack._id, { isActive: !pack.isActive });
      setPacks((prev) => prev.map((item) => (item._id === pack._id ? { ...item, ...updated } : item)));
      toast.success(updated.isActive ? "Pack activé." : "Pack désactivé.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Impossible de modifier le statut.");
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Packs"
        breadcrumb={["Packs"]}
        action={
          <Link to="/admin/packs/add" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#C96A26] px-5 text-sm font-semibold text-white shadow-[0_5px_16px_rgba(201,106,38,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#B85D20] hover:shadow-[0_8px_22px_rgba(201,106,38,0.24)] active:translate-y-0 sm:w-auto">
            <Plus size={17} strokeWidth={2} />
            <span>Ajouter</span>
          </Link>
        }
      />

      <section className="border-b border-[#E7DED2] bg-[#FCFAF7]">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative flex h-11 min-w-0 w-full flex-1 items-center rounded-xl border border-[#E7DED2] bg-white px-3.5 shadow-[0_4px_14px_rgba(17,17,17,0.025)] focus-within:border-velora-gold focus-within:ring-4 focus-within:ring-velora-gold/10">
              <Search size={17} strokeWidth={1.8} className="shrink-0 text-[#8D8176]" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher un pack..."
                className="h-full min-w-0 flex-1 bg-transparent pl-3 text-sm text-velora-dark outline-none placeholder:text-[#A59A90]"
              />
              {search && (
                <button type="button" onClick={() => setSearch("")} className="flex h-7 w-7 items-center justify-center rounded-lg text-[#8D8176] hover:bg-[#FCF5EE] hover:text-[#C96A26]" aria-label="Effacer la recherche">
                  <X size={14} />
                </button>
              )}
            </label>
          </div>
        </div>
      </section>

      <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF7EE] text-[#C96A26]">
                <Package size={16} strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-sm font-semibold text-velora-dark">Catalogue des packs</p>
                <p className="text-xs text-[#8D8176]">{packs.length} pack{packs.length > 1 ? "s" : ""}</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="rounded-xl border border-[#E7DED2] bg-white p-8 text-sm text-velora-textGray">Chargement des packs…</div>
          ) : filteredPacks.length === 0 ? (
            <div className="rounded-xl border border-[#E7DED2] bg-white p-10 text-center">
              <h3 className="font-premium text-2xl font-bold text-velora-dark">Aucun pack trouvé</h3>
              <Link to="/admin/packs/add" className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-[#C96A26] px-5 text-sm font-semibold text-white">Créer un pack</Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-[#E7DED2] bg-white shadow-[0_10px_30px_rgba(17,17,17,0.04)]">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[#FCFAF7] text-[#6D5E53]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Nom</th>
                      <th className="hidden px-4 py-3 font-semibold md:table-cell">Produits</th>
                      <th className="px-4 py-3 font-semibold">Prix</th>
                      <th className="px-4 py-3 font-semibold">Réduction</th>
                      <th className="px-4 py-3 font-semibold">Stock</th>
                      <th className="px-4 py-3 font-semibold">Statut</th>
                      <th className="px-4 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPacks.map((pack) => (
                      <tr key={pack._id} className="border-t border-[#EFE7DC] align-top">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {pack.image ? <img src={pack.image} alt={pack.name} className="h-12 w-12 rounded-lg object-cover" /> : <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#F8F3ED] text-[#C96A26]"><Package size={18} /></div>}
                            <div>
                              <div className="font-semibold text-velora-dark">{pack.name}</div>
                              <div className="text-xs text-velora-textGray">{pack.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden px-4 py-4 text-velora-textGray md:table-cell">
                          {pack.components?.map((item) => item.product?.name || "Produit").join(", ") || "-"}
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-semibold text-velora-dark">Après réduction : {Math.floor(Number(pack.pricePreview?.final ?? 0))} DT</div>
                          <div className="text-xs text-velora-textGray">Prix produits : {Math.floor(Number(pack.pricePreview?.subtotal ?? 0))} DT</div>
                        </td>
                        <td className="px-4 py-4 text-velora-textGray">
                          {pack.discountType === "percentage" ? `${pack.discountValue || 0}%` : pack.discountType === "fixed" ? `${pack.discountValue || 0} DT` : "Aucune"}
                        </td>
                        <td className="px-4 py-4 text-velora-textGray">
                          {pack.compatibleSizes?.length ? pack.compatibleSizes.map((size) => `${size}: ${pack.stockPreview?.[size] ?? 0}`).join(" / ") : "Aucune taille commune"}
                        </td>
                        <td className="px-4 py-4"><StatusBadge active={pack.isActive} /></td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/admin/packs/edit/${pack._id}`}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7DED2] bg-white text-[#8D8176] transition-all duration-200 hover:border-[#C96A26] hover:bg-[#FFF7EE] hover:text-[#C96A26]"
                              aria-label="Modifier le pack"
                            >
                              <Edit size={16} strokeWidth={1.8} />
                            </Link>
                            <button
                              type="button"
                              onClick={() => toggleActive(pack)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7DED2] bg-white text-[#8D8176] transition-all duration-200 hover:border-[#C96A26] hover:bg-[#FFF7EE] hover:text-[#C96A26]"
                              aria-label={pack.isActive ? "Désactiver" : "Activer"}
                            >
                              {pack.isActive ? <ToggleRight size={16} strokeWidth={1.8} /> : <ToggleLeft size={16} strokeWidth={1.8} />}
                            </button>
                            <button
                              type="button"
                              onClick={() => { setSelectedPack(pack); setDeleteOpen(true); }}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7DED2] bg-white text-[#8D8176] transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                              aria-label="Supprimer le pack"
                            >
                              <Trash2 size={16} strokeWidth={1.8} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredPacks.length > PACKS_PER_PAGE && (
            <div className="mt-6 flex justify-center">
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <button key={pageNumber} type="button" onClick={() => setPage(pageNumber)} className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold ${page === pageNumber ? "bg-velora-gold text-white" : "border border-[#E7DED2] bg-white text-velora-dark hover:border-velora-gold"}`}>
                    {pageNumber}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <ConfirmModal
        open={deleteOpen}
        title="Supprimer ce pack ?"
        description="Cette action est irréversible."
        confirmLabel={deleting ? "Suppression..." : "Supprimer"}
        onCancel={() => { setDeleteOpen(false); setSelectedPack(null); }}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  );
}
