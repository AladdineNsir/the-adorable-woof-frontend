import { useEffect, useState } from "react";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";

import AdminPageHeader from "../components/AdminPageHeader";
import { getCategories, deleteCategory } from "../services/categoryApi";
import toast from "react-hot-toast";

function Badge({ active }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
        active
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {active ? "Active" : "Désactivée"}
    </span>
  );
}

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.categories || []);
        setFilteredCategories(data.categories || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const result = categories.filter((item) =>
      item.name?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCategories(result);
  }, [search, categories]);

  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      setDeleting(true);

      await deleteCategory(selectedCategory._id);

      const updated = categories.filter((c) => c._id !== selectedCategory._id);

      setCategories(updated);
      setFilteredCategories(updated);

      toast.success("Catégorie supprimée avec succès.");

      setOpenDelete(false);
      setSelectedCategory(null);
    } catch (error) {
      console.log(error);
      toast.error("Erreur lors de la suppression.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Catégories"
        description="Organisez les collections visibles dans la boutique SMILEY WOOF."
        breadcrumb={["Catégories"]}
        action={
          <Link
            to="/admin/categories/add"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-velora-gold px-5 text-sm font-semibold text-white transition-colors duration-200 hover:brightness-95"
          >
            <Plus size={18} />
            Ajouter
          </Link>
        }
      />

      <div className="border-b border-[#EFE7DC] px-4 py-4 sm:px-6">
        <label className="relative flex h-11 items-center rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-3 transition-colors duration-200 focus-within:border-velora-gold/70 focus-within:ring-2 focus-within:ring-velora-gold/10">
          <Search size={16} className="text-velora-textGray" />
          <input
            type="text"
            aria-label="Rechercher une catégorie"
            placeholder="Rechercher une catégorie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-full flex-1 bg-transparent pl-2 text-sm text-velora-dark outline-none"
          />
        </label>
      </div>

      <div className="p-4 sm:p-6 lg:p-7">
        {loading ? (
          <div className="flex h-64 items-center justify-center rounded-xl border border-[#E7DED2] bg-white text-sm text-velora-textGray shadow-[0_6px_24px_rgba(17,17,17,0.035)]">
            Chargement...
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#E7DED2] bg-white shadow-[0_6px_24px_rgba(17,17,17,0.035)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead className="border-b border-[#E7DED2] bg-[#FCFAF7]">
                  <tr className="text-left text-[10px] font-bold uppercase tracking-[0.14em] text-velora-textGray">
                    <th className="px-5 py-4">Nom</th>
                    <th className="px-5 py-4">Description</th>
                    <th className="px-5 py-4">Statut</th>
                    <th className="px-5 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-5 py-14 text-center text-sm text-velora-textGray">
                        Aucune catégorie trouvée.
                      </td>
                    </tr>
                  )}

                  {filteredCategories.map((category) => (
                    <tr key={category._id} className="border-t border-[#F1E9DF] transition-colors duration-200 hover:bg-[#FCFAF7]">
                      
                      <td className="px-5 py-4 text-sm font-semibold text-velora-dark">
                        {category.name}
                      </td>
                      <td className="max-w-sm px-5 py-4 text-sm leading-6 text-velora-textGray">
                        <span className="line-clamp-2">{category.description || "-"}</span>
                      </td>
                      <td className="px-5 py-4">
                        <Badge active={category.isActive} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <Link
                            to={`/admin/categories/edit/${category._id}`}
                            aria-label="Modifier la catégorie"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-200/70 bg-amber-50/70 text-amber-700 transition-colors duration-200 hover:bg-amber-100"
                          >
                            <Edit size={16} />
                          </Link>
                           <button
  onClick={() => {
    setSelectedCategory(category);
    setOpenDelete(true);
  }}
  aria-label="Supprimer la catégorie"
  className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200/70 bg-red-50/70 text-red-700 transition-colors duration-200 hover:bg-red-100"
>
  <Trash2 size={16} />
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
      </div>

      <ConfirmModal
  open={openDelete}
  loading={deleting}
  title="Supprimer la catégorie"
  message={`Voulez-vous vraiment supprimer "${selectedCategory?.name}" ? Cette action est irréversible.`}
  confirmText="Supprimer"
  onConfirm={handleDelete}
  onClose={() => {
    setOpenDelete(false);
    setSelectedCategory(null);
  }}
/>
    </>

    
  );
  
}

