import AdminPageHeader from "../components/AdminPageHeader";
import CategoryForm from "../components/CategoryForm";

export default function AddCategory() {
  return (
    <>
      <AdminPageHeader
        title="Ajouter une catégorie"
        description="Créez une collection principale pour organiser la boutique."
        breadcrumb={["Catégories", "Ajouter"]}
        backTo="/admin/categories"
      />
      <div className="p-4 sm:p-6 lg:p-7">
        <CategoryForm />
      </div>
    </>
  );
}
