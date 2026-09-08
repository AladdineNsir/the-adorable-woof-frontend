import AdminPageHeader from "../components/AdminPageHeader";
import ProductForm from "../components/ProductForm";

export default function AddProduct() {
  return (
    <div className="w-full">
      <AdminPageHeader
        title="+ Ajouter"
        description=""
        breadcrumb={["Produits", "Ajouter"]}
        backTo="/admin/products"
      />

      <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <div className="mx-auto w-full max-w-6xl">
          <ProductForm />
        </div>
      </main>
    </div>
  );
}