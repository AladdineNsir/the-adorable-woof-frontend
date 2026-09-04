import { useEffect, useState } from "react";
import {
  Edit,
  FolderTree,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import ConfirmModal from "../components/ConfirmModal";
import AdminPageHeader from "../components/AdminPageHeader";
import Pagination from "../components/Pagination";
import { getCategories, deleteCategory } from "../services/categoryApi";

const CATEGORIES_PER_PAGE = 10;

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
        active
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-500" : "bg-red-500"
        }`}
      />

      {active ? "Active" : "Désactivée"}
    </span>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* =========================================================
     LOAD CATEGORIES
  ========================================================= */

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);

        const data = await getCategories();

        const list = data.categories || [];

        setCategories(list);
        setFilteredCategories(list);
      } catch (error) {
        console.log(error);
        toast.error("Impossible de charger les catégories.");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  /* =========================================================
     SEARCH
  ========================================================= */

  useEffect(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const result = categories.filter((category) => {
      if (!normalizedSearch) return true;

      return (
        category.name?.toLowerCase().includes(normalizedSearch) ||
        category.description?.toLowerCase().includes(normalizedSearch)
      );
    });

    setFilteredCategories(result);
    setPage(1);
  }, [search, categories]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / CATEGORIES_PER_PAGE)
  );

  const paginatedCategories = filteredCategories.slice(
    (page - 1) * CATEGORIES_PER_PAGE,
    page * CATEGORIES_PER_PAGE
  );

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      setDeleting(true);

      await deleteCategory(selectedCategory._id);

      const updated = categories.filter(
        (category) => category._id !== selectedCategory._id
      );

      setCategories(updated);
      setFilteredCategories(updated);

      toast.success("Catégorie supprimée avec succès.");

      setOpenDelete(false);
      setSelectedCategory(null);
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message ||
          "Erreur lors de la suppression."
      );
    } finally {
      setDeleting(false);
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <AdminPageHeader
        title="Catégories"
        description="Organisez vos produits avec une structure claire et facile à gérer."
        breadcrumb={["Catégories"]}
        action={
          <Link
            to="/admin/categories/add"
            className="
              group
              inline-flex h-11 items-center gap-2
              rounded-xl
              bg-gradient-to-r from-[#C96A26] to-[#A3541E]
              px-5
              text-sm font-semibold text-white
              shadow-[0_6px_18px_rgba(201,106,38,0.16)]
              transition-all duration-200
              hover:-translate-y-0.5
              hover:shadow-[0_10px_24px_rgba(201,106,38,0.22)]
            "
          >
            <Plus
              size={17}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:rotate-90"
            />

            Ajouter
          </Link>
        }
      />

      {/* =====================================================
          SEARCH / SUMMARY
      ===================================================== */}

      <section className="border-y border-[#E7DED2] bg-[#FCFAF7]">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

            {/* SEARCH */}

            <label
              className="
                relative flex h-11 w-full
                items-center
                rounded-xl
                border border-[#E7DED2]
                bg-white
                px-3.5
                shadow-[0_4px_14px_rgba(17,17,17,0.025)]
                transition-all duration-200
                focus-within:border-[#C96A26]
                focus-within:ring-4
                focus-within:ring-[#C96A26]/5
                lg:max-w-xl
              "
            >
              <Search
                size={17}
                strokeWidth={1.8}
                className="shrink-0 text-[#8D8176]"
              />

              <input
                type="text"
                aria-label="Rechercher une catégorie"
                placeholder="Rechercher une catégorie..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
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
                    flex h-7 w-7 shrink-0
                    items-center justify-center
                    rounded-lg
                    text-[#8D8176]
                    transition-colors
                    hover:bg-[#FCF5EE]
                    hover:text-[#C96A26]
                  "
                  aria-label="Effacer la recherche"
                >
                  <X size={14} />
                </button>
              )}
            </label>

            {/* COUNT */}

            <div className="flex items-center justify-between gap-4 lg:justify-end">
              <div className="flex items-center gap-2">
                <div
                  className="
                    flex h-9 w-9
                    items-center justify-center
                    rounded-lg
                    border border-[#E7DED2]
                    bg-white
                    text-[#C96A26]
                  "
                >
                  <FolderTree size={16} strokeWidth={1.8} />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">
                    Catégories
                  </p>

                  <p className="text-sm font-semibold text-velora-dark">
                    {filteredCategories.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="p-4 sm:p-6 lg:p-7">
        {loading ? (
          /* =================================================
             LOADING
          ================================================= */

          <div
            className="
              flex min-h-[360px]
              items-center justify-center
              rounded-[22px]
              border border-[#E7DED2]
              bg-white
              shadow-[0_8px_28px_rgba(17,17,17,0.035)]
            "
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className="
                  h-8 w-8
                  animate-spin
                  rounded-full
                  border-2
                  border-[#E7DED2]
                  border-t-[#C96A26]
                "
              />

              <p className="text-sm font-medium text-velora-textGray">
                Chargement des catégories...
              </p>
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          /* =================================================
             EMPTY STATE
          ================================================= */

          <div
            className="
              flex min-h-[360px]
              flex-col items-center justify-center
              rounded-[22px]
              border border-[#E7DED2]
              bg-white
              px-6
              text-center
              shadow-[0_8px_28px_rgba(17,17,17,0.035)]
            "
          >
            <div
              className="
                flex h-14 w-14
                items-center justify-center
                rounded-2xl
                border border-[#E7DED2]
                bg-[#FCFAF7]
                text-[#C96A26]
              "
            >
              <FolderTree size={24} strokeWidth={1.6} />
            </div>

            <h3 className="mt-4 text-sm font-bold text-velora-dark">
              Aucune catégorie trouvée
            </h3>

            <p className="mt-1 max-w-sm text-xs leading-5 text-velora-textGray">
              {search
                ? "Aucune catégorie ne correspond à votre recherche."
                : "Commencez par créer votre première catégorie."}
            </p>

            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="
                  mt-5
                  inline-flex h-10
                  items-center gap-2
                  rounded-xl
                  border border-[#E7DED2]
                  bg-white
                  px-4
                  text-sm font-semibold
                  text-velora-dark
                  transition-all duration-200
                  hover:border-[#C96A26]
                  hover:bg-[#FCFAF7]
                  hover:text-[#C96A26]
                "
              >
                <X size={15} />
                Effacer la recherche
              </button>
            ) : (
              <Link
                to="/admin/categories/add"
                className="
                  mt-5
                  inline-flex h-10
                  items-center gap-2
                  rounded-xl
                  bg-[#C96A26]
                  px-4
                  text-sm font-semibold text-white
                  transition-all duration-200
                  hover:bg-[#B85D20]
                  hover:shadow-[0_8px_18px_rgba(201,106,38,0.18)]
                "
              >
                <Plus size={16} />
                Ajouter une catégorie
              </Link>
            )}
          </div>
        ) : (
          /* =================================================
             TABLE
          ================================================= */

          <div
            className="
              overflow-hidden
              rounded-[22px]
              border border-[#E7DED2]
              bg-white
              shadow-[0_8px_28px_rgba(17,17,17,0.035)]
            "
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                {/* TABLE HEADER */}

                <thead className="border-b border-[#E7DED2] bg-[#FCFAF7]">
                  <tr className="text-left text-[10px] font-bold uppercase tracking-[0.14em] text-velora-textGray">
                    <th className="px-6 py-4">
                      Catégorie
                    </th>

                    <th className="px-6 py-4">
                      Description
                    </th>

                    <th className="px-6 py-4">
                      Statut
                    </th>

                    <th className="px-6 py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                {/* TABLE BODY */}

                <tbody>
                  {paginatedCategories.map((category) => (
                    <tr
                      key={category._id}
                      className="
                        border-t border-[#F1E9DF]
                        transition-colors duration-200
                        hover:bg-[#FCFAF7]
                      "
                    >
                      {/* CATEGORY */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div
                            className="
                              flex h-10 w-10 shrink-0
                              items-center justify-center
                              rounded-xl
                              border border-[#E7DED2]
                              bg-[#FCFAF7]
                              text-[#C96A26]
                            "
                          >
                            <FolderTree
                              size={17}
                              strokeWidth={1.7}
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-velora-dark">
                              {category.name}
                            </p>

                            <p className="mt-0.5 text-[11px] text-velora-textGray">
                              Catégorie
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* DESCRIPTION */}

                      <td className="max-w-md px-6 py-5">
                        <span className="line-clamp-2 text-sm leading-6 text-velora-textGray">
                          {category.description || (
                            <span className="italic text-[#B2A79C]">
                              Aucune description
                            </span>
                          )}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">
                        <StatusBadge
                          active={category.isActive}
                        />
                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/admin/categories/edit/${category._id}`}
                            aria-label="Modifier la catégorie"
                            className="
                              flex h-9 w-9
                              items-center justify-center
                              rounded-lg
                              border border-[#E7DED2]
                              bg-white
                              text-[#8D8176]
                              transition-all duration-200
                              hover:border-[#C96A26]
                              hover:bg-[#FFF7EE]
                              hover:text-[#C96A26]
                            "
                          >
                            <Edit
                              size={16}
                              strokeWidth={1.8}
                            />
                          </Link>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCategory(category);
                              setOpenDelete(true);
                            }}
                            aria-label="Supprimer la catégorie"
                            className="
                              flex h-9 w-9
                              items-center justify-center
                              rounded-lg
                              border border-[#E7DED2]
                              bg-white
                              text-[#8D8176]
                              transition-all duration-200
                              hover:border-red-200
                              hover:bg-red-50
                              hover:text-red-600
                            "
                          >
                            <Trash2
                              size={16}
                              strokeWidth={1.8}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TABLE FOOTER */}

            <div
              className="
                flex flex-col gap-2
                border-t border-[#EFE7DC]
                bg-[#FCFAF7]
                px-6 py-3.5
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <p className="text-xs text-velora-textGray">
                Affichage de{" "}
                <span className="font-semibold text-velora-dark">
                  {(page - 1) * CATEGORIES_PER_PAGE + 1}
                </span>{" "}
                à{" "}
                <span className="font-semibold text-velora-dark">
                  {Math.min(
                    page * CATEGORIES_PER_PAGE,
                    filteredCategories.length
                  )}
                </span>{" "}
                sur{" "}
                <span className="font-semibold text-velora-dark">
                  {filteredCategories.length}
                </span>{" "}
                catégorie
                {filteredCategories.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}

        {/* ===================================================
            PAGINATION
        =================================================== */}

        {!loading && filteredCategories.length > 0 && (
          <Pagination
            pagination={{
              page,
              pages: totalPages,
              total: filteredCategories.length,
            }}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

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