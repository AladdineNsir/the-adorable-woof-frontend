import AdminPageHeader from "../components/AdminPageHeader";
import SubCategoryForm from "../components/SubCategoryForm";

export default function AddSubCategory() {
  return (
    <>
      <AdminPageHeader
        title="Ajouter une sous-catégorie"
        description="Créez une nouvelle sous-catégorie."
        breadcrumb={["Sous-catégories", "Ajouter"]}
        backTo="/admin/subcategories"
      />

      <div className="p-4 sm:p-6 lg:p-7">
        <SubCategoryForm />
      </div>
    </>
  );
}