import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import AdminPageHeader from "../components/AdminPageHeader";
import CategoryForm from "../components/CategoryForm";
import { getCategoryById } from "../services/categoryApi";

export default function EditCategory() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const data = await getCategoryById(id);
        setCategory(data.category);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm font-semibold text-velora-textGray">Chargement...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm font-semibold text-red-600">Catégorie introuvable</p>
      </div>
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Modifier la catégorie"
        description="Ajustez le nom, la description et le visuel de la catégorie."
        breadcrumb={["Catégories", "Modifier"]}
        backTo="/admin/categories"
      />
      <div className="p-4 sm:p-6 lg:p-7">
        <CategoryForm category={category} isEdit />
      </div>
    </>
  );
}
