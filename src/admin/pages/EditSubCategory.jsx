import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import AdminPageHeader from "../components/AdminPageHeader";
import SubCategoryForm from "../components/SubCategoryForm";
import { getSubCategoryById } from "../services/subCategoryApi";

export default function EditSubCategory() {
  const { id } = useParams();

  const [subCategory, setSubCategory] = useState(null);

  const [loading, setLoading] = useState(true);

  const loadSubCategory = async () => {
    try {
      const data = await getSubCategoryById(id);

      setSubCategory(data.subCategory);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubCategory();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm font-semibold text-velora-textGray">Chargement...</p>
      </div>
    );
  }

  if (!subCategory) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm font-semibold text-red-600">Sous-catégorie introuvable</p>
      </div>
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Modifier la sous-catégorie"
        description="Modifiez les informations de cette sous-catégorie."
        breadcrumb={["Sous-catégories", "Modifier"]}
        backTo="/admin/subcategories"
      />

      <div className="p-4 sm:p-6 lg:p-7">
        <SubCategoryForm subCategory={subCategory} isEdit />
      </div>
    </>
  );
}