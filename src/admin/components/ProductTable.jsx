
import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import ConfirmModal from "./ConfirmModal";
import { deleteProduct } from "../services/productApi";
import { resolveAssetUrl } from "../../config/api";

const imageUrl = (src) => {
  if (!src) return "/assets/no-image.png";
  return resolveAssetUrl(src);
};

function Badge({ children, tone = "neutral" }) {
  const styles = {
    success:
      "border-emerald-200/70 bg-emerald-50/70 text-emerald-700",

    danger:
      "border-red-200/70 bg-red-50/70 text-red-700",

    neutral:
      "border-[#efe7dc] bg-[#fcfaf7] text-velora-dark",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${styles[tone]}`}
    >
      {children}
    </span>
  );
}

export default function ProductTable({
  products,
  refreshProducts,
}) {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // =========================================
  // SUPPRESSION
  // =========================================

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      setDeleting(true);

      await deleteProduct(selectedProduct._id);

      await refreshProducts();

      toast.success("Produit supprimé avec succès.");

      setOpenDelete(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Erreur lors de la suppression du produit."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {/* =========================================
          TABLE
      ========================================= */}

      <div className="overflow-hidden rounded-xl border border-[#E8DED1] bg-white shadow-[0_6px_24px_rgba(17,17,17,0.035)]">
        <div className="space-y-3 p-3 sm:hidden">
          {products.length === 0 && (
            <p className="px-3 py-10 text-center text-sm text-velora-textGray">
              Aucun produit trouvé.
            </p>
          )}

          {products.map((product) => (
            <article
              key={product._id}
              className="rounded-xl border border-[#EFE7DC] bg-[#FCFAF7] p-3"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-[#E7DED2] bg-white p-1">
                  <img
                    src={imageUrl(product.images?.[0])}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-velora-dark">
                    {product.name}
                  </h3>
                  <p className="mt-1 truncate text-xs text-velora-textGray">
                    {product.category?.name || "Sans catégorie"}
                    {product.subCategory?.name ? ` · ${product.subCategory.name}` : ""}
                  </p>
                  <p className="mt-2 text-sm font-bold text-velora-dark">
                    {Number(product.price || 0).toFixed(2)} DT
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  {product.isActive === false ? <Badge tone="danger">Inactif</Badge> : <Badge tone="success">Actif</Badge>}
                  {Number(product.stock || 0) <= 0 ? <Badge tone="danger">Rupture</Badge> : <span className="text-xs font-semibold text-velora-textGray">Stock: {product.stock}</span>}
                </div>
              </div>

              <div className="mt-3 flex gap-2 border-t border-[#EFE7DC] pt-3">
                <Link
                  to={`/admin/products/edit/${product._id}`}
                  className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-[#E7DED2] bg-white text-xs font-semibold text-velora-dark transition hover:border-[#C96A26] hover:text-[#C96A26]"
                >
                  <Edit size={15} strokeWidth={1.8} />
                  Modifier
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProduct(product);
                    setOpenDelete(true);
                  }}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#E7DED2] bg-white text-[#8D8176] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  aria-label={`Supprimer ${product.name}`}
                >
                  <Trash2 size={15} strokeWidth={1.8} />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[850px]">

            {/* HEADER */}

            <thead className="border-b border-[#E7DED2] bg-[#FCFAF7]">
              <tr className="text-left text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">

                <th className="px-5 py-3.5">
                  Image
                </th>

                <th className="px-5 py-3.5">
                  Produit
                </th>

                <th className="px-5 py-3.5">
                  Catégorie
                </th>

                <th className="px-5 py-3.5">
                  Sous-catégorie
                </th>

                <th className="px-5 py-3.5">
                  Prix
                </th>

                <th className="px-5 py-3.5">
                  Stock
                </th>

                <th className="px-5 py-3.5">
                  Statut
                </th>

                <th className="px-5 py-3.5 text-center">
                  Actions
                </th>

              </tr>
            </thead>

            {/* BODY */}

            <tbody>

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-14 text-center text-sm text-velora-textGray"
                  >
                    Aucun produit trouvé.
                  </td>
                </tr>
              )}

              {products.map((product) => (
                <tr
                  key={product._id}
                  className="
                    border-b
                    border-[#EFE7DC]
                    transition-colors
                    duration-200
                    hover:bg-[#FCFAF7]
                  "
                >

                  {/* IMAGE */}

                  <td className="px-5 py-3.5">
                    <div
                      className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-[#E7DED2]
                        bg-[#FCFAF7]
                        p-1
                      "
                    >
                      <img
                        src={imageUrl(product.images?.[0])}
                        alt={product.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </td>

                  {/* PRODUIT */}

                  <td className="px-5 py-3.5">
                    <div className="flex flex-col items-start gap-1.5">

                      <h3 className="max-w-[190px] truncate text-sm font-semibold text-velora-dark">
                        {product.name}
                      </h3>

                      {product.badge === "new" && (
                        <span
                          className="
                            inline-flex
                            rounded-full
                            bg-velora-gold
                            px-2.5
                            py-1
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.08em]
                            text-white
                          "
                        >
                          Nouveau
                        </span>
                      )}

                      {product.badge === "special" && (
                        <span
                          className="
                            inline-flex
                            rounded-full
                            bg-[#FFCB56]
                            px-2.5
                            py-1
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.08em]
                            text-white
                          "
                        >
                          Offre spéciale
                        </span>
                      )}

                    </div>
                  </td>

                  {/* CATÉGORIE */}

                  <td className="px-5 py-3.5 text-sm text-velora-textGray">
                    {product.category?.name || "-"}
                  </td>

                  {/* SOUS-CATÉGORIE */}

                  <td className="px-5 py-3.5 text-sm text-velora-textGray">
                    {product.subCategory?.name || "-"}
                  </td>

                  {/* PRIX */}

                  <td className="px-5 py-3.5 text-sm font-bold text-velora-dark">
                    <span className="whitespace-nowrap">
                      {Number(product.price || 0).toFixed(2)} DT
                    </span>
                  </td>

                  {/* STOCK */}

                  <td className="px-5 py-3.5">

                    {Number(product.stock || 0) <= 0 ? (

                      <Badge tone="danger">
                        Rupture
                      </Badge>

                    ) : Number(product.stock) < 10 ? (

                      <span
                        className="
                          inline-flex
                          rounded-full
                          border
                          border-orange-200/70
                          bg-orange-50/70
                          px-3
                          py-1.5
                          text-xs
                          font-medium
                          text-orange-700
                        "
                      >
                        {product.stock}
                      </span>

                    ) : (

                      <Badge tone="success">
                        {product.stock}
                      </Badge>

                    )}

                  </td>

                  {/* STATUT */}

                  <td className="px-5 py-3.5">

                    {product.isActive === false ? (

                      <Badge tone="danger">
                        Inactif
                      </Badge>

                    ) : (

                      <Badge tone="success">
                        Actif
                      </Badge>

                    )}

                  </td>

                  {/* ACTIONS */}

                  <td className="px-5 py-3.5">

                    <div className="flex justify-end gap-2">

                      {/* MODIFIER */}

                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-[#E7DED2]
                          bg-white
                          text-[#8D8176]
                          transition-all duration-200
                          hover:border-[#C96A26]
                          hover:bg-[#FFF7EE]
                          hover:text-[#C96A26]
                        "
                        aria-label="Modifier le produit"
                      >
                        <Edit size={16} strokeWidth={1.8} />
                      </Link>

                      {/* SUPPRIMER */}

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProduct(product);
                          setOpenDelete(true);
                        }}
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-[#E7DED2]
                          bg-white
                          text-[#8D8176]
                          transition-all duration-200
                          hover:border-red-200
                          hover:bg-red-50
                          hover:text-red-600
                        "
                        aria-label="Supprimer le produit"
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

      {/* =========================================
          CONFIRMATION MODAL
      ========================================= */}

      <ConfirmModal
        open={openDelete}
        loading={deleting}
        title="Supprimer le produit"
        message={
          selectedProduct
            ? `Voulez-vous vraiment supprimer "${selectedProduct.name}" ? Cette action est irréversible.`
            : "Voulez-vous vraiment supprimer ce produit ?"
        }
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={handleDelete}
        onClose={() => {
          if (!deleting) {
            setOpenDelete(false);
            setSelectedProduct(null);
          }
        }}
      />
    </>
  );
} 