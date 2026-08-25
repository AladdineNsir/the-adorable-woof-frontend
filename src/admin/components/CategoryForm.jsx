import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { createCategory, updateCategory } from "../services/categoryApi";
import { resolveAssetUrl } from "../../config/api";

const inputClass =
  "h-11 w-full rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-4 text-sm text-velora-dark outline-none transition focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10";
const labelClass =
  "mb-2 block text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-velora-textGray";

export default function CategoryForm({ category = null, isEdit = false }) {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name || "",
        description: category.description || "",
        isActive: category.isActive,
      });
      setPreview(category.image ? resolveAssetUrl(category.image) : "");
    }
  }, [category]);

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
    const categoryData = {
      name: form.name,
      description: form.description,
      isActive: form.isActive,
      image: "",
    };

    if (isEdit) {
      await updateCategory(category._id, categoryData);

      toast.success("Catégorie modifiée avec succès.");

      navigate("/admin/categories");
    } else {
      await createCategory(categoryData);

      toast.success("Catégorie ajoutée avec succès.");

      navigate("/admin/categories");
    }
  } catch (error) {
    console.log(error);

    toast.error("Une erreur est survenue.");
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-[#E8DED1] bg-white p-4 sm:p-6 lg:p-7 shadow-[0_6px_24px_rgba(17,17,17,0.035)]">
      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        <div>
          <label htmlFor="category-name" className={labelClass}>Nom</label>
          <input id="category-name" name="name" required value={form.name} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label htmlFor="category-image" className={labelClass}>Image</label>
          <input id="category-image" type="file" onChange={handleImage} aria-label="Choisir une image" className="w-full rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-3 py-2.5 text-sm text-velora-textGray cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-[#FFF7EE] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-velora-dark" />
        </div>

        <div className="lg:col-span-2">
          <label htmlFor="category-description" className={labelClass}>Description</label>
          <textarea
            id="category-description"
            rows="5"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="min-h-[120px] w-full resize-y rounded-lg border border-[#E7DED2] bg-[#FCFAF7] p-4 text-sm leading-6 text-velora-dark outline-none transition focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10"
          />
        </div>

        <div className="lg:col-span-2 flex flex-col sm:flex-row sm:items-start sm:gap-6">
          {preview && (
            <div className="mb-4">
              <div className="text-sm mb-2 text-velora-textGray">Aperçu</div>
              <img
                src={preview}
                alt="Aperçu"
                className="h-28 w-28 sm:h-32 sm:w-32 rounded-lg border border-[#E7DED2] bg-[#FCFAF7] object-cover"
              />
            </div>
          )}

          <div className="flex-1">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-4 py-3 text-sm">
              <input id="category-active" type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="accent-velora-gold" aria-label="Activer la catégorie" />
              <div>
                <div className="text-sm font-semibold text-velora-dark">Catégorie active</div>
                <div className="text-xs text-velora-textGray">Visible dans la boutique</div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-7 border-t border-[#EFE7DC] pt-5 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
        <button type="button" onClick={() => window.history.back()} className="w-full sm:w-auto h-10 rounded-lg border border-[#E7DED2] bg-white px-4 text-sm font-semibold text-velora-dark transition-colors duration-200 hover:border-velora-gold hover:text-velora-gold hover:bg-[#FFFDF9]">
          Annuler
        </button>
        <button type="submit" disabled={loading} className="w-full sm:w-auto h-10 rounded-lg bg-velora-gold px-5 sm:px-6 text-sm font-semibold text-white transition-colors duration-200 hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? "Enregistrement..." : isEdit ? "Modifier la catégorie" : "Ajouter la catégorie"}
        </button>
      </div>
    </form>
  );
}
