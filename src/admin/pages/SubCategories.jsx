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
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium ${
        active
          ? "border-emerald-200/70 bg-emerald-50/70 text-emerald-700"
          : "border-red-200/70 bg-red-50/70 text-red-700"
      }`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-500" : "bg-red-500"
        }`}
      />
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
        breadcrumb={["Sous-catégories"]}
        action={
          <Link
            to="/admin/subcategories/add"
            className="
              inline-flex h-10 items-center justify-center gap-2
              rounded-lg
              bg-velora-gold
              px-4
              text-sm font-semibold
              text-white
              transition-all duration-200
              hover:bg-[#A3541E]
              hover:-translate-y-0.5
              hover:shadow-[0_8px_18px_rgba(201,106,38,0.20)]
              sm:h-11 sm:px-5
            "
          >
            <Plus size={17} />
            <span>Ajouter</span>
          </Link>
        }
      />

      <div className="p-4 sm:p-6 lg:p-7">
        {/* SEARCH */}
        <div className="mb-5">
          <label
            className="
              relative flex h-11 w-full items-center
              rounded-lg
              border border-[#E7DED2]
              bg-[#FCFAF7]
              px-3
              transition-colors duration-200
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
              aria-label="Rechercher une sous-catégorie"
              placeholder="Rechercher une sous-catégorie..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                h-full flex-1
                min-w-0
                bg-transparent
                pl-3
                text-sm
                text-velora-dark
                outline-none
                placeholder:text-velora-textGray
              "
            />
          </label>
        </div>

        {/* TABLE */}
        <div className="mt-0">
          {loading ? (
            <div
              className="
                flex h-64
                items-center justify-center
                rounded-xl
                border border-[#E7DED2]
                bg-white
                shadow-[0_6px_24px_rgba(17,17,17,0.035)]
              "
            >
              <p className="text-sm text-velora-textGray">
                Chargement des sous-catégories...
              </p>
            </div>
          ) : (
            <div
              className="
                overflow-hidden
                rounded-xl
                border border-[#E7DED2]
                bg-white
                shadow-[0_6px_24px_rgba(17,17,17,0.035)]
              "
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px]">
                  <thead className="border-b border-[#E7DED2] bg-[#FCFAF7]">
                    <tr
                      className="
                        text-left
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.14em]
                        text-velora-textGray
                      "
                    >
                      <th className="px-5 py-4">
                        Nom
                      </th>

                      <th className="px-5 py-4">
                        Catégorie
                      </th>

                      <th className="px-5 py-4">
                        Description
                      </th>

                      <th className="px-5 py-4">
                        Statut
                      </th>

                      <th className="px-5 py-4 text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#F1E9DF]">
                    {filteredSubCategories.length === 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          className="
                            px-5
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
                          border-t
                          border-[#F1E9DF]
                          transition-colors
                          duration-200
                          hover:bg-[#FCFAF7]
                        "
                      >
                        {/* NOM */}
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-velora-dark">
                            {sub.name || "-"}
                          </p>
                        </td>

                        {/* CATÉGORIE */}
                        <td className="px-5 py-4">
                          <span
                            className="
                              inline-flex
                              items-center
                              rounded-full
                              border border-[#E7DED2]
                              bg-[#FBF8F2]
                              px-3
                              py-1.5
                              text-xs
                              font-semibold
                              text-velora-dark
                            "
                          >
                            {sub.category?.name || "-"}
                          </span>
                        </td>

                        {/* DESCRIPTION */}
                        <td className="max-w-md px-5 py-4">
                          <p
                            className="
                              line-clamp-2
                              text-sm
                              leading-6
                              text-velora-textGray
                            "
                          >
                            {sub.description || "-"}
                          </p>
                        </td>

                        {/* STATUT */}
                        <td className="px-5 py-4">
                          <Badge active={sub.isActive} />
                        </td>

                        {/* ACTIONS */}
                        <td className="px-5 py-4">
                          <div className="flex justify-center gap-2">
                            <Link
                              to={`/admin/subcategories/edit/${sub._id}`}
                              aria-label="Modifier"
                              title="Modifier"
                              className="
                                flex h-9 w-9
                                items-center justify-center
                                rounded-lg
                                border border-amber-200/70
                                bg-amber-50/70
                                text-amber-700
                                transition-colors duration-200
                                hover:bg-amber-100
                              "
                            >
                              <Edit size={16} />
                            </Link>

                            <button
                              type="button"
                              aria-label="Supprimer"
                              title="Supprimer"
                              onClick={() => {
                                setSelectedSubCategory(sub);
                                setOpenDelete(true);
                              }}
                              className="
                                flex h-9 w-9
                                items-center justify-center
                                rounded-lg
                                border border-red-200/70
                                bg-red-50/70
                                text-red-700
                                transition-colors duration-200
                                hover:bg-red-100
                              "
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
      </div>

      {/* DELETE MODAL */}
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