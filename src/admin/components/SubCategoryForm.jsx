import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getCategories } from "../services/categoryApi";
import { createSubCategory, updateSubCategory } from "../services/subCategoryApi";
import { resolveAssetUrl } from "../../config/api";

const inputClass =
  "h-11 w-full rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-4 text-sm text-velora-dark outline-none transition-colors duration-200 focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10";
const labelClass =
  "mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-velora-textGray";

export default function SubCategoryForm({ subCategory = null, isEdit = false }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    isActive: true,
  });

  useEffect(() => {
    const loadCategories = async () => {
  try {
    const data = await getCategories();

    const activeCategories = (data.categories || []).filter(
      (cat) => cat.isActive
    );

    setCategories(activeCategories);
  } catch (error) {
    console.log(error);
  }
};

    loadCategories();

    if (subCategory) {
      setForm({
        name: subCategory.name || "",
        description: subCategory.description || "",
        category: subCategory.category?._id || "",
        isActive: subCategory.isActive,
      });
      setPreview(subCategory.image ? resolveAssetUrl(subCategory.image) : "");
    }
  }, [subCategory]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

      const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const subCategoryData = {
      name: form.name,
      description: form.description,
      category: form.category,
      isActive: form.isActive,
      image: "",
    };

    if (isEdit) {
      await updateSubCategory(subCategory._id, subCategoryData);

      toast.success("Sous-catégorie modifiée avec succès.");
    } else {
      await createSubCategory(subCategoryData);

      toast.success("Sous-catégorie ajoutée avec succès.");
    }
  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message ||
        "Erreur lors de l'enregistrement."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-[#E8DED1] bg-white p-5 sm:p-6 shadow-[0_6px_24px_rgba(17,17,17,0.035)]">
      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        <div>
          <label htmlFor="name" className={labelClass}>Nom</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} required className={inputClass} />
        </div>

        <div>
          <label htmlFor="category" className={labelClass}>Catégorie</label>
          <select id="category" name="category" value={form.category} onChange={handleChange} required className={inputClass}>
            <option value="">Choisir une catégorie</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2">
          <label htmlFor="description" className={labelClass}>Description</label>
          <textarea
            id="description"
            rows="5"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full min-h-[110px] resize-y rounded-lg border border-[#E7DED2] bg-[#FCFAF7] p-4 text-sm leading-6 text-velora-dark outline-none transition-colors duration-200 focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10"
          />
        </div>

        <div className="lg:col-span-2">
          <label htmlFor="image" className={labelClass}>Image</label>
          <input id="image" type="file" onChange={handleImage} className="w-full rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-3 py-2.5 text-sm cursor-pointer" />
        </div>

        {preview && (
          <div className="lg:col-span-2">
            <img src={preview} alt="Aperçu" className="h-32 w-32 overflow-hidden rounded-lg border border-[#E7DED2] bg-[#FCFAF7] object-cover" />
          </div>
        )}

        <div className="lg:col-span-2">
          <label htmlFor="isActive" className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-4 py-3 text-sm font-medium text-velora-dark transition-colors duration-200 hover:border-velora-gold/50 hover:bg-[#FFFDF9]">
            <input id="isActive" type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="accent-[#C89B5A]" />
            Sous-catégorie active
          </label>
        </div>
      </div>

      <div className="mt-7 border-t border-[#EFE7DC] pt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
        <button type="button" onClick={() => window.history.back()} className="h-10 w-full sm:w-auto rounded-lg border border-[#E7DED2] bg-white px-5 text-sm font-semibold text-velora-dark transition-colors duration-200 hover:border-velora-gold hover:bg-[#FFFDF9] hover:text-velora-gold">
          Annuler
        </button>
        <button type="submit" disabled={loading} className="h-10 w-full sm:w-auto rounded-lg bg-velora-gold px-5 sm:px-6 text-sm font-semibold text-white transition-colors duration-200 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Enregistrement..." : isEdit ? "Modifier" : "Ajouter"}
        </button>
      </div>
    </form>
  );
}
