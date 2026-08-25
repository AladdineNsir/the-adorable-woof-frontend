import AdminPageHeader from "../components/AdminPageHeader";
import ProductForm from "../components/ProductForm";

export default function AddProduct() {
  return (
    <>
      <AdminPageHeader
        title="Ajouter un produit"
        description="Créez un nouvel article avec ses informations, visuels et options de vente."
        breadcrumb={["Produits", "Ajouter"]}
        backTo="/admin/products"
      />
      <div className="p-4 sm:p-6 lg:p-7">
        <ProductForm />
      </div>
    </>
  );
}
