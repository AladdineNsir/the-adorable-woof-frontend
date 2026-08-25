import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
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
        limit: 10,
        search,
        stock,
      });

      setProducts(data.products || data || []);
      setPagination(data.pagination || null);
    } catch (error) {
      console.log(error);
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

  return (
    <>
      <AdminPageHeader
        title="Produits"
        description="Gérez le catalogue, les prix, les images et la disponibilité des articles."
        breadcrumb={["Produits"]}
        action={
          <Link
            to="/admin/products/add"
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

      {/* ================= FILTERS ================= */}

      <div className="border-b border-[#efe7dc] bg-[#fcfaf7] px-4 py-4 sm:px-6">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">

          {/* Recherche */}

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
              placeholder="Rechercher un produit..."
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

          {/* Stock */}

          <select
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="
              h-11
              w-full
              rounded-xl
              border border-[#e7ded2]
              bg-white
              px-3
              text-sm
              font-medium
              text-velora-dark
              outline-none
              transition
              focus:border-velora-gold
              focus:ring-2
              focus:ring-velora-gold/10
            "
          >
            <option value="">Tous les stocks</option>
            <option value="available">Disponible</option>
            <option value="empty">Rupture</option>
          </select>

        </div>
      </div>

      {/* ================= PRODUCTS ================= */}

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
              Chargement des produits...
            </p>
          </div>

        ) : (

          <>

            <ProductTable
              products={products}
              refreshProducts={loadProducts}
            />

            <Pagination
              pagination={pagination}
              onPageChange={setPage}
            />

          </>

        )}

      </div>
    </>
  );
}