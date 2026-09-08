import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Check, ImagePlus, Package, Save, X } from "lucide-react";
import { getCategories } from "../services/categoryApi";
import { createSubCategory, updateSubCategory } from "../services/subCategoryApi";
import { resolveAssetUrl } from "../../config/api";

const inputClass =
  "h-11 w-full rounded-xl border border-[#E7DED2] bg-white px-3.5 text-sm text-velora-dark outline-none transition-all duration-200 placeholder:text-[#B8ADA1] hover:border-[#D9CCBE] focus:border-[#C96A26] focus:ring-4 focus:ring-[#C96A26]/10";

const textAreaClass =
  "w-full rounded-xl border border-[#E7DED2] bg-white px-3.5 py-3 text-sm leading-6 text-velora-dark outline-none transition-all duration-200 placeholder:text-[#B8ADA1] hover:border-[#D9CCBE] focus:border-[#C96A26] focus:ring-4 focus:ring-[#C96A26]/10";

const labelClass =
  "mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#786B5E]";

const sectionClass =
  "rounded-2xl border border-[#E7DED2] bg-white shadow-[0_8px_30px_rgba(17,17,17,0.035)]";

const sectionHeaderClass =
  "flex items-center gap-3 border-b border-[#EFE7DC] px-5 py-4 sm:px-6";

function SectionTitle({ icon: Icon, title, description }) {
  return (
    <div className={sectionHeaderClass}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E8D8C8] bg-[#FFF7EE] text-[#C96A26]">
        <Icon size={17} strokeWidth={1.8} />
      </div>

      <div className="min-w-0">
        <h2 className="text-sm font-bold text-velora-dark sm:text-[15px]">
          {title}
        </h2>

        {description && (
          <p className="mt-0.5 text-xs text-velora-textGray">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

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

    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      toast.error("Choisissez une image valide de 5 Mo maximum.");
      e.target.value = "";
      return;
    }

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
        isActive: String(form.isActive),
      };
      const payload = new FormData();
      Object.entries(subCategoryData).forEach(([key, value]) => payload.append(key, value));
      if (image) payload.append("image", image);

      if (isEdit) {
        await updateSubCategory(subCategory._id, payload);
        toast.success("Sous-catégorie modifiée avec succès.");
      } else {
        await createSubCategory(payload);
        toast.success("Sous-catégorie ajoutée avec succès.");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Erreur lors de l'enregistrement."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pb-4">
      <section className={sectionClass}>
        <SectionTitle
          icon={Package}
          title="Informations générales"
          description="Les informations principales de la sous-catégorie."
        />

        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div>
              <label htmlFor="name" className={labelClass}>
                Nom de la sous-catégorie *
              </label>

              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Ex : Laisses premium"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="category" className={labelClass}>
                Catégorie *
              </label>

              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Choisir une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label htmlFor="description" className={labelClass}>
                Description
              </label>

              <textarea
                id="description"
                rows="5"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Décrivez la sous-catégorie ..."
                className={`${textAreaClass} resize-y`}
              />
            </div>

            <div className="lg:col-span-2">
              <label htmlFor="image" className={labelClass}>
                Image
              </label>

              <div className="rounded-xl border border-dashed border-[#E7DED2] bg-[#FCFAF7] p-3">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#E7DED2] bg-white px-3.5 py-3 text-sm font-medium text-velora-dark transition-all duration-200 hover:border-[#C96A26] hover:text-[#C96A26]">
                  <ImagePlus size={16} strokeWidth={1.8} />
                  <span>{image ? image.name : "Choisir une image"}</span>
                  <input
                    id="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={handleImage}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {preview && (
              <div className="lg:col-span-2">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#786B5E]">
                  Aperçu
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-[#E7DED2] bg-[#FCFAF7] p-3">
                  <img
                    src={preview}
                    alt="Aperçu de la sous-catégorie"
                    className="h-20 w-20 rounded-lg border border-[#E7DED2] bg-white object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setPreview("");
                      setImage(null);
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition-colors duration-200 hover:bg-red-100"
                  >
                    <X size={14} />
                    Retirer
                  </button>
                </div>
              </div>
            )}

            <div className="lg:col-span-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E7DED2] bg-[#FCFAF7] px-4 py-3.5 transition-all duration-200 hover:border-[#DCC9B5] hover:bg-white">
                <input
                  id="isActive"
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 accent-[#C96A26]"
                />

                <span className="text-sm font-semibold text-velora-dark">
                  Sous-catégorie active
                </span>
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <SectionTitle
          icon={Save}
          title="Publication"
          description="Contrôlez la visibilité de la sous-catégorie dans la boutique."
        />

        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-3 rounded-xl border border-[#EFE7DC] bg-[#FCFAF7] px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF7EE] text-[#1F9D5A]">
              <Check size={15} strokeWidth={2.2} />
            </div>

            <div>
              <p className="text-sm font-semibold text-velora-dark">
                {form.isActive ? "Visible dans la boutique" : "Masquée dans la boutique"}
              </p>
              <p className="text-xs text-velora-textGray">
                {form.isActive
                  ? "La sous-catégorie apparaît pour les clients."
                  : "La sous-catégorie est désactivée et ne s’affiche plus."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-2.5 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="h-10 w-full rounded-lg border border-[#E7DED2] bg-white px-4 text-sm font-semibold text-velora-dark transition-colors duration-200 hover:border-velora-gold hover:bg-[#FFFDF9] hover:text-velora-gold sm:w-auto"
        >
          Annuler
        </button>

        <button
          type="submit"
          disabled={loading}
          className="h-10 w-full rounded-lg bg-[#C96A26] px-5 text-sm font-semibold text-white shadow-[0_5px_16px_rgba(201,106,38,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#B85D20] hover:shadow-[0_8px_22px_rgba(201,106,38,0.24)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {loading ? "Enregistrement..." : isEdit ? "Modifier la sous-catégorie" : "Ajouter la sous-catégorie"}
        </button>
      </div>
    </form>
  );
}
