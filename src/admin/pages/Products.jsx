import { useEffect, useState } from "react";
import {
  Package,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import AdminPageHeader from "../components/AdminPageHeader";
import Pagination from "../components/Pagination";
import ProductTable from "../components/ProductTable";
import { getProducts } from "../services/productApi";

export default function Products() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stock, setStock] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await getProducts({
        page,
        limit: 8,
        search,
        stock,
      });

      setProducts(data.products || data || []);
      setPagination(data.pagination || null);
    } catch (error) {
      console.error("Erreur chargement produits :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page, search, stock]);

  useEffect(() => {
    setPage(1);
  }, [search, stock]);

  const hasFilters = search || stock;

  const clearFilters = () => {
    setSearch("");
    setStock("");
    setPage(1);
  };

  return (
    <div className="w-full">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <AdminPageHeader
        title="Produits"
        description=""
        breadcrumb={["Produits"]}
        action={
          <Link
            to="/admin/products/add"
            className="
              group inline-flex h-11 items-center justify-center
              gap-2 rounded-xl
              bg-[#C96A26]
              px-5
              text-sm font-semibold text-white
              shadow-[0_5px_16px_rgba(201,106,38,0.18)]
              transition-all duration-200
              hover:-translate-y-0.5
              hover:bg-[#B85D20]
              hover:shadow-[0_8px_22px_rgba(201,106,38,0.24)]
              active:translate-y-0
              w-full sm:w-auto
            "
          >
            {/* <Plus
              size={17}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:rotate-90"
            /> */}
            <span>+ Ajouter</span>
          </Link>
        }
      />

      {/* =====================================================
          FILTER BAR
      ===================================================== */}

      <section className="border-y border-[#E7DED2] bg-[#FCFAF7]">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div
            className="
              mx-auto flex w-full max-w-7xl
              flex-col gap-3
              lg:flex-row lg:items-center
            "
          >
            {/* Search */}

            <div className="relative flex-1">
              <label
                className="
                  flex h-11 w-full items-center
                  rounded-xl
                  border border-[#E7DED2]
                  bg-white
                  px-3.5
                  shadow-[0_3px_12px_rgba(17,17,17,0.025)]
                  transition-all duration-200
                  focus-within:border-[#C96A26]
                  focus-within:ring-4
                  focus-within:ring-[#C96A26]/5
                "
              >
                <Search
                  size={17}
                  strokeWidth={1.8}
                  className="shrink-0 text-[#8D8176]"
                />

                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="
                    h-full min-w-0 flex-1
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
            </div>

            {/* Stock */}

            <div className="relative lg:w-[190px]">
              <SlidersHorizontal
                size={15}
                strokeWidth={1.8}
                className="
                  pointer-events-none
                  absolute left-3.5 top-1/2
                  -translate-y-1/2
                  text-[#8D8176]
                "
              />

              <select
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="
                  h-11 w-full
                  cursor-pointer
                  appearance-none
                  rounded-xl
                  border border-[#E7DED2]
                  bg-white
                  pl-10 pr-9
                  text-sm font-medium
                  text-velora-dark
                  shadow-[0_3px_12px_rgba(17,17,17,0.025)]
                  outline-none
                  transition-all duration-200
                  focus:border-[#C96A26]
                  focus:ring-4
                  focus:ring-[#C96A26]/5
                "
              >
                <option value="">Tous les stocks</option>
                <option value="available">Disponible</option>
                <option value="empty">Rupture</option>
              </select>

              <span
                className="
                  pointer-events-none
                  absolute right-3.5 top-1/2
                  -translate-y-1/2
                  text-xs text-[#8D8176]
                "
              >
                ↓
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <div className="mx-auto w-full max-w-7xl">

          {/* Top information */}

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div
                className="
                  flex h-8 w-8 items-center justify-center
                  rounded-lg
                  bg-[#FFF7EE]
                  text-[#C96A26]
                "
              >
                <Package size={16} strokeWidth={1.8} />
              </div>

              <div>
                <p className="text-sm font-semibold text-velora-dark">
                  Catalogue produits
                </p>

                {pagination && (
                  <p className="text-xs text-[#8D8176]">
                    {pagination.total || 0} produit
                    {(pagination.total || 0) > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>

            {hasFilters && !loading && (
              <button
                type="button"
                onClick={clearFilters}
                className="
                  inline-flex items-center gap-1.5
                  rounded-lg
                  px-2.5 py-1.5
                  text-xs font-semibold
                  text-[#8D8176]
                  transition-colors
                  hover:bg-[#FFF7EE]
                  hover:text-[#C96A26]
                "
              >
                <X size={13} />
                Réinitialiser les filtres
              </button>
            )}
          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (
            <div
              className="
                flex min-h-[420px]
                items-center justify-center
                rounded-2xl
                border border-[#E7DED2]
                bg-white
                shadow-[0_8px_28px_rgba(17,17,17,0.035)]
              "
            >
              <div className="flex flex-col items-center gap-3">
                <div
                  className="
                    h-9 w-9
                    animate-spin
                    rounded-full
                    border-2
                    border-[#E7DED2]
                    border-t-[#C96A26]
                  "
                />

                <p className="text-sm font-medium text-[#756B62]">
                  Chargement des produits...
                </p>
              </div>
            </div>
          ) : products.length === 0 ? (
            /* ===============================================
               EMPTY STATE
            =============================================== */

            <div
              className="
                flex min-h-[420px]
                flex-col items-center justify-center
                rounded-2xl
                border border-[#E7DED2]
                bg-white
                px-6 text-center
                shadow-[0_8px_28px_rgba(17,17,17,0.035)]
              "
            >
              <div
                className="
                  flex h-14 w-14
                  items-center justify-center
                  rounded-2xl
                  bg-[#FFF7EE]
                  text-[#C96A26]
                "
              >
                <Package size={25} strokeWidth={1.6} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-velora-dark">
                Aucun produit trouvé
              </h3>

              <p className="mt-1.5 max-w-sm text-sm leading-6 text-[#8D8176]">
                {hasFilters
                  ? "Aucun produit ne correspond à vos critères de recherche."
                  : "Votre catalogue est encore vide. Commencez par ajouter votre premier produit."}
              </p>

              {hasFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="
                    mt-5 inline-flex h-10
                    items-center gap-2
                    rounded-xl
                    border border-[#E7DED2]
                    bg-white
                    px-4
                    text-sm font-semibold
                    text-velora-dark
                    transition-colors
                    hover:border-[#C96A26]
                    hover:text-[#C96A26]
                  "
                >
                  <X size={15} />
                  Effacer les filtres
                </button>
              ) : (
                <Link
                  to="/admin/products/add"
                  className="
                    mt-5 inline-flex h-10
                    items-center gap-2
                    rounded-xl
                    bg-[#C96A26]
                    px-4
                    text-sm font-semibold
                    text-white
                    transition-all
                    hover:-translate-y-0.5
                    hover:bg-[#B85D20]
                  "
                >
                  <Plus size={16} />
                  Ajouter un produit
                </Link>
              )}
            </div>
          ) : (
            /* ===============================================
               PRODUCTS TABLE
            =============================================== */

            <>
              <ProductTable
                products={products}
                refreshProducts={loadProducts}
              />

              {pagination && pagination.total > 0 && (
                <div className="mt-4 border-t border-[#EFE7DC] pt-4">
                  <p className="text-xs text-velora-textGray">
                    Affichage de{" "}
                    <span className="font-semibold text-velora-dark">
                      {(pagination.page - 1) * 8 + 1}
                    </span>{" "}
                    à{" "}
                    <span className="font-semibold text-velora-dark">
                      {Math.min(pagination.page * 8, pagination.total)}
                    </span>{" "}
                    sur{" "}
                    <span className="font-semibold text-velora-dark">
                      {pagination.total}
                    </span>{" "}
                    produit{pagination.total > 1 ? "s" : ""}
                  </p>
                </div>
              )}

              <div className="mt-5">
                <Pagination
                  pagination={pagination}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}