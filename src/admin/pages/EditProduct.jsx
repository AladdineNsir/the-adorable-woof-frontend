import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import AdminPageHeader from "../components/AdminPageHeader";
import ProductForm from "../components/ProductForm";
import { getProductById } from "../services/productApi";

export default function EditProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm font-semibold text-velora-textGray">Chargement...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm font-semibold text-red-600">Produit introuvable</p>
      </div>
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Modifier le produit"
        description="Mettez à jour les informations, images et options du produit."
        breadcrumb={["Produits", "Modifier"]}
        backTo="/admin/products"
      />
      <div className="p-4 sm:p-6 lg:p-7">
        <ProductForm product={product} isEdit />
      </div>
    </>
  );
}
