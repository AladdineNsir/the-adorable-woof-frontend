import { useEffect, useState } from "react";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import AdminPageHeader from "../components/AdminPageHeader";
import ConfirmModal from "../components/ConfirmModal";

import {
  getSubCategories,
  deleteSubCategory,
} from "../services/subCategoryApi";

function Badge({ active }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${
        active
          ? "border-emerald-200/70 bg-emerald-50/70 text-emerald-700"
          : "border-red-200/70 bg-red-50/70 text-red-700"
      }`}
    >
      {active ? "Active" : "Désactivée"}
    </span>
  );
}

export default function SubCategories() {
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadSubCategories = async () => {
    try {
      setLoading(true);

      const data = await getSubCategories();

      const list = data.subCategories || [];

      setSubCategories(list);
      setFilteredSubCategories(list);
    } catch (error) {
      console.log(error);
      toast.error("Impossible de charger les sous-catégories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubCategories();
  }, []);

  useEffect(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      setFilteredSubCategories(subCategories);
      return;
    }

    const result = subCategories.filter(
      (item) =>
        item.name?.toLowerCase().includes(query) ||
        item.category?.name?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
    );

    setFilteredSubCategories(result);
  }, [search, subCategories]);

  const handleDelete = async () => {
    if (!selectedSubCategory) return;

    try {
      setDeleting(true);

      await deleteSubCategory(selectedSubCategory._id);

      const updated = subCategories.filter(
        (item) => item._id !== selectedSubCategory._id
      );

      setSubCategories(updated);
      setFilteredSubCategories(updated);

      toast.success("Sous-catégorie supprimée avec succès.");

      setOpenDelete(false);
      setSelectedSubCategory(null);
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la suppression."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Sous-catégories"
        description="Structurez les accessoires pour une navigation boutique plus précise."
        breadcrumb={["Sous-catégories"]}
        action={
          <Link
            to="/admin/subcategories/add"
            className="
              inline-flex h-11 items-center gap-2
              rounded-xl
              bg-gradient-to-r from-velora-gold to-[#A3541E]
              px-5
              text-sm font-medium text-white
              transition-all duration-200
              hover:-translate-y-0.5
              hover:shadow-[0_8px_18px_rgba(201,106,38,0.25)]
            "
          >
            <Plus size={18} />
            Ajouter
          </Link>
        }
      />

      {/* ================= SEARCH ================= */}

      <div className="border-b border-[#efe7dc] bg-[#fcfaf7] px-4 py-4 sm:px-6">
        <label
          className="
            relative flex h-11 items-center
            rounded-xl
            border border-[#e7ded2]
            bg-white
            px-3
            shadow-[0_6px_20px_rgba(17,17,17,0.03)]
            transition
            focus-within:border-velora-gold
            focus-within:ring-2
            focus-within:ring-velora-gold/10
          "
        >
          <Search
            size={17}
            className="shrink-0 text-velora-textGray"
          />

          <input
            type="text"
            placeholder="Rechercher une sous-catégorie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              h-full flex-1
              bg-transparent
              pl-3
              text-sm
              text-velora-dark
              outline-none
              placeholder:text-velora-textGray/70
            "
          />
        </label>
      </div>

      {/* ================= TABLE ================= */}

      <div className="p-4 sm:p-6 lg:p-7">
        {loading ? (
          <div
            className="
              flex min-h-[45vh]
              items-center justify-center
              rounded-[24px]
              border border-[#efe7dc]
              bg-white
              shadow-[0_10px_30px_rgba(17,17,17,0.04)]
            "
          >
            <p className="text-sm font-semibold text-velora-textGray">
              Chargement des sous-catégories...
            </p>
          </div>
        ) : (
          <div
            className="
              overflow-hidden
              rounded-[24px]
              border border-[#efe7dc]
              bg-white
              shadow-[0_12px_30px_rgba(17,17,17,0.04)]
            "
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px]">
                <thead className="border-b border-[#efe7dc] bg-[#faf7f2]">
                  <tr
                    className="
                      text-left
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.2em]
                      text-velora-textGray
                    "
                  >
                    <th className="px-6 py-4">
                      Nom
                    </th>

                    <th className="px-6 py-4">
                      Catégorie
                    </th>

                    <th className="px-6 py-4">
                      Description
                    </th>

                    <th className="px-6 py-4">
                      Statut
                    </th>

                    <th className="px-6 py-4 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#f3ebe1]">
                  {filteredSubCategories.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="
                          px-6
                          py-14
                          text-center
                          text-sm
                          text-velora-textGray
                        "
                      >
                        Aucune sous-catégorie trouvée.
                      </td>
                    </tr>
                  )}

                  {filteredSubCategories.map((sub) => (
                    <tr
                      key={sub._id}
                      className="
                        border-t border-[#f5ece2]
                        transition-colors
                        hover:bg-[#fcfaf7]
                      "
                    >
                      {/* Nom */}

                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-velora-dark">
                          {sub.name}
                        </p>
                      </td>

                      {/* Catégorie */}

                      <td className="px-6 py-4">
                        <span
                          className="
                            inline-flex
                            rounded-full
                            border
                            border-[#e7ded2]
                            bg-[#fbf8f2]
                            px-3
                            py-1.5
                            text-xs
                            font-medium
                            text-velora-dark
                          "
                        >
                          {sub.category?.name || "-"}
                        </span>
                      </td>

                      {/* Description */}

                      <td className="max-w-sm px-6 py-4">
                        <span className="line-clamp-2 text-sm text-velora-textGray">
                          {sub.description || "-"}
                        </span>
                      </td>

                      {/* Status */}

                      <td className="px-6 py-4">
                        <Badge active={sub.isActive} />
                      </td>

                      {/* Actions */}

                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <Link
                            to={`/admin/subcategories/edit/${sub._id}`}
                            className="
                              flex h-9 w-9
                              items-center justify-center
                              rounded-xl
                              border border-amber-200/70
                              bg-amber-50/70
                              text-amber-700
                              transition
                              hover:bg-amber-100
                            "
                            aria-label="Modifier"
                          >
                            <Edit size={16} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSubCategory(sub);
                              setOpenDelete(true);
                            }}
                            className="
                              flex h-9 w-9
                              items-center justify-center
                              rounded-xl
                              border border-red-200/70
                              bg-red-50/70
                              text-red-700
                              transition
                              hover:bg-red-100
                            "
                            aria-label="Supprimer"
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

      {/* ================= DELETE MODAL ================= */}

      <ConfirmModal
        open={openDelete}
        loading={deleting}
        title="Supprimer la sous-catégorie"
        message={`Voulez-vous vraiment supprimer "${selectedSubCategory?.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        onConfirm={handleDelete}
        onClose={() => {
          if (deleting) return;

          setOpenDelete(false);
          setSelectedSubCategory(null);
        }}
      />
    </>
  );
}