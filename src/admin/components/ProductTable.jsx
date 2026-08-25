import { Edit, Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { deleteProduct } from "../services/productApi";
import { resolveAssetUrl } from "../../config/api";

const imageUrl = (src) => {
  if (!src) return "/assets/no-image.png";
  return resolveAssetUrl(src);
};

function Badge({ children, tone = "neutral" }) {
  const styles = {
    success: "border-emerald-200/70 bg-emerald-50/70 text-emerald-700",
    danger: "border-red-200/70 bg-red-50/70 text-red-700",
    neutral: "border-[#efe7dc] bg-[#fcfaf7] text-velora-dark",
  };

  return (
    <span className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${styles[tone]}`}>
      {children}
    </span>
  );
}

export default function ProductTable({ products, refreshProducts }) {
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Voulez-vous supprimer ce produit ?");

    if (!confirmDelete) return;

    try {
      await deleteProduct(id);
      refreshProducts();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-[#E8DED1] bg-white shadow-[0_6px_24px_rgba(17,17,17,0.035)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="border-b border-[#E7DED2] bg-[#FCFAF7]">
            <tr className="text-left text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray">
              <th className="px-5 py-3.5">Image</th>
              <th className="px-5 py-3.5">Produit</th>
              <th className="px-5 py-3.5">Catégorie</th>
              <th className="px-5 py-3.5">Sous-catégorie</th>
              <th className="px-5 py-3.5">Prix</th>
              <th className="px-5 py-3.5">Stock</th>
              <th className="px-5 py-3.5">Statut</th>
              <th className="px-5 py-3.5 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan="8" className="px-5 py-14 text-center text-sm text-velora-textGray">
                  Aucun produit trouvé.
                </td>
              </tr>
            )}

            {products.map((product) => (
              <tr key={product._id} className="border-b border-[#EFE7DC] transition-colors duration-200 hover:bg-[#FCFAF7]">
                <td className="px-5 py-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#E7DED2] bg-[#FCFAF7] p-1">
                    <img
                      src={imageUrl(product.images?.[0])}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </td>

                <td className="px-5 py-3.5">
                  <h3 className="max-w-[200px] truncate text-sm font-semibold text-velora-dark">
                    {product.name}
                  </h3>
                </td>

                <td className="px-5 py-3.5 text-sm text-velora-textGray">
                  {product.category?.name || "-"}
                </td>

                <td className="px-5 py-3.5 text-sm text-velora-textGray">
                  {product.subCategory?.name || "-"}
                </td>

                <td className="px-5 py-3.5 text-sm font-bold text-velora-dark">
                  {Number(product.price || 0).toFixed(2)} DT
                </td>

                <td className="px-5 py-3.5">
                  {Number(product.stock || 0) > 0 ? (
                    <Badge tone="success">{product.stock} en stock</Badge>
                  ) : (
                    <Badge tone="danger">Rupture</Badge>
                  )}
                </td>

                <td className="px-5 py-3.5">
                  {product.isActive === false ? (
                    <Badge tone="danger">Inactif</Badge>
                  ) : (
                    <Badge tone="success">Actif</Badge>
                  )}
                </td>

                <td className="px-5 py-3.5">
                  <div className="flex justify-center gap-2">
                    <Link
                      to={`/product/${product._id}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7DED2] bg-white text-velora-dark transition-colors duration-200 hover:border-velora-gold hover:text-velora-gold hover:bg-[#FFFDF9]"
                      aria-label="Voir le produit"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      to={`/admin/products/edit/${product._id}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-velora-gold/30 bg-[#FFF7EE] text-velora-gold transition-colors duration-200 hover:border-velora-gold hover:bg-velora-gold hover:text-white"
                      aria-label="Modifier le produit"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition-colors duration-200 hover:bg-red-100 hover:border-red-300"
                      aria-label="Supprimer le produit"
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
  );
}
