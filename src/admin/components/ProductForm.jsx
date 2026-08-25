import { useEffect, useState } from "react";

import { getCategories } from "../services/categoryApi";
import { createProduct, updateProduct } from "../services/productApi";
import { getSubCategories } from "../services/subCategoryApi";
import { resolveAssetUrl } from "../../config/api";

const inputClass =
  "h-11 w-full rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-4 text-sm text-velora-dark outline-none transition-colors duration-200 focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10";
const textAreaClass =
  "w-full rounded-lg border border-[#E7DED2] bg-[#FCFAF7] p-4 text-sm leading-6 text-velora-dark outline-none transition-colors duration-200 focus:border-velora-gold focus:ring-2 focus:ring-velora-gold/10";
const labelClass =
  "mb-2 block text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-velora-textGray";
const smallButtonClass =
  "h-10 rounded-lg border border-[#E7DED2] bg-white px-4 text-sm font-semibold text-velora-dark transition-colors duration-200 hover:border-velora-gold hover:text-velora-gold";

function Option({ children, ...props }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-3.5 py-3 text-sm font-medium transition-colors duration-150 hover:border-velora-gold/40">
      <input type="checkbox" className="accent-velora-gold rounded" {...props} />
      {children}
    </label>
  );
}

export default function ProductForm({ product = null, isEdit = false }) {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState({ name: "", code: "#000000" });

  const [form, setForm] = useState({
    name: "",
    description: "",
    details: "",
    price: "",
    oldPrice: "",
    category: "",
    subCategory: "",
    stock: "",
    sizes: [],
    colors: [],
    materials: [],
    isCustomizable: false,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isActive: true,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [categoryData, subCategoryData] = await Promise.all([
          getCategories(),
          getSubCategories(),
        ]);
        setCategories(categoryData.categories || []);
        setSubCategories(subCategoryData.subCategories || []);
      } catch (err) {
        console.log(err);
      }
    };

    load();

    if (product) {
      setForm({
        ...product,
        category: product.category?._id || "",
        subCategory: product.subCategory?._id || "",
      });
      setExistingImages(product.images || []);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "category" ? { subCategory: "" } : {}),
    }));
  };

  const addSize = () => {
    const value = sizeInput.trim();
    if (!value || form.sizes.includes(value)) return;

    setForm((prev) => ({
      ...prev,
      sizes: [...prev.sizes, value],
    }));
    setSizeInput("");
  };

  const removeSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((item) => item !== size),
    }));
  };

  const addColor = () => {
    const name = colorInput.name.trim();
    const code = colorInput.code || "#000000";

    if (!name) return;

    setForm((prev) => ({
      ...prev,
      colors: [
        ...prev.colors.filter(
          (color) => color.name.toLowerCase() !== name.toLowerCase()
        ),
        { name, code },
      ],
    }));
    setColorInput({ name: "", code });
  };

  const removeColor = (name) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((color) => color.name !== name),
    }));
  };

  const removeExistingImage = (image) => {
    setExistingImages((prev) => prev.filter((item) => item !== image));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(
          key,
          Array.isArray(form[key]) ? JSON.stringify(form[key]) : form[key]
        );
      });

      images.forEach((image) => formData.append("images", image));
      formData.append("existingImages", JSON.stringify(existingImages));

      if (isEdit) {
        await updateProduct(product._id, formData);
        alert("Produit modifié.");
      } else {
        await createProduct(formData);
        alert("Produit ajouté.");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-[#E8DED1] bg-white p-4 sm:p-6 lg:p-7 shadow-[0_6px_24px_rgba(17,17,17,0.035)]">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
        <div>
          <label htmlFor="name" className={labelClass}>Nom du produit</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} required className={inputClass} />
        </div>

        <div>
          <label htmlFor="price" className={labelClass}>Prix</label>
          <input id="price" type="number" name="price" value={form.price} onChange={handleChange} required className={inputClass} />
        </div>

        <div>
          <label htmlFor="oldPrice" className={labelClass}>Ancien prix</label>
          <input id="oldPrice" type="number" name="oldPrice" value={form.oldPrice || ""} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label htmlFor="stock" className={labelClass}>Stock</label>
          <input id="stock" type="number" name="stock" value={form.stock} onChange={handleChange} required className={inputClass} />
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

        <div>
          <label htmlFor="subCategory" className={labelClass}>Sous-catégorie</label>
          <select id="subCategory" name="subCategory" value={form.subCategory} onChange={handleChange} required className={inputClass}>
            <option value="">Choisir une sous-catégorie</option>
            {subCategories
              .filter((sub) => sub.category?._id === form.category)
              .map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="description" className={labelClass}>Description</label>
        <textarea id="description" rows={4} name="description" value={form.description || ""} onChange={handleChange} className={`${textAreaClass} min-h-[110px] resize-y`} />
      </div>

      <div className="mt-5">
        <label htmlFor="details" className={labelClass}>Détails</label>
        <textarea id="details" rows={4} name="details" value={form.details || ""} onChange={handleChange} className={`${textAreaClass} min-h-[110px] resize-y`} />
      </div>

      <div className="mt-5">
        <label className={labelClass}>Images</label>
        {isEdit && existingImages.length > 0 && (
          <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {existingImages.map((image) => (
              <div key={image} className="overflow-hidden rounded-lg border border-[#E7DED2] bg-[#FCFAF7]">
                <img
                  src={resolveAssetUrl(image)}
                  alt="Produit"
                  className="aspect-square w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(image)}
                  className="h-9 w-full border-t border-[#EFE7DC] bg-white text-xs font-semibold text-red-600 transition-colors duration-150 hover:bg-red-50"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          multiple
          accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
          onChange={(e) => setImages([...e.target.files])}
          id="images"
          className="w-full rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-3 py-2.5 text-sm cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-[#FFF7EE] file:px-3 file:py-1.5 file:text-xs file:font-semibold"
        />
        <p className="mt-2 text-xs text-velora-textGray">
          Vous pouvez sélectionner plusieurs images en même temps.
        </p>
        {images.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {images.map((image) => (
              <div key={`${image.name}-${image.lastModified}`} className="overflow-hidden rounded-lg border border-[#E7DED2] bg-[#FCFAF7]">
                <img
                  src={URL.createObjectURL(image)}
                  alt={image.name}
                  className="aspect-square w-full object-cover"
                />
                <div className="truncate px-2 py-2 text-xs text-velora-textGray">
                  {image.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-lg border border-[#E7DED2] bg-[#FCFAF7] p-4">
          <label className={labelClass}>Tailles</label>
          <div className="flex gap-2">
            <input
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSize();
                }
              }}
              placeholder="Ex: S, M, L, 35 cm"
              className={inputClass}
            />
            <button type="button" onClick={addSize} className={smallButtonClass}>
              Ajouter
            </button>
          </div>
          <div className="mt-3 flex min-h-10 flex-wrap gap-2">
            {form.sizes.length === 0 ? (
              <span className="text-sm text-velora-textGray">Aucune taille ajoutée</span>
            ) : (
              form.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => removeSize(size)}
                  className="rounded-lg border border-[#E7DED2] bg-white px-3 py-1.5 text-sm font-medium text-velora-dark transition-colors duration-150 hover:border-red-300 hover:text-red-600"
                  title="Supprimer cette taille"
                >
                  {size} x
                </button>
              ))
            )}
          </div>
        </div>
        <div className="rounded-lg border border-[#E7DED2] bg-[#FCFAF7] p-4">
          <label className={labelClass}>Couleurs</label>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_48px_auto] gap-2">
            <input
              value={colorInput.name}
              onChange={(e) =>
                setColorInput((prev) => ({ ...prev, name: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addColor();
                }
              }}
              placeholder="Ex: Noir, Rouge"
              className={inputClass}
            />
            <input
              type="color"
              value={colorInput.code}
              onChange={(e) =>
                setColorInput((prev) => ({ ...prev, code: e.target.value }))
              }
              className="h-11 w-12 cursor-pointer rounded-lg border border-[#E7DED2] bg-white p-1"
              title="Choisir la couleur"
            />
            <button type="button" onClick={addColor} className={smallButtonClass}>
              Ajouter
            </button>
          </div>
          <div className="mt-3 flex min-h-10 flex-wrap gap-2">
            {form.colors.length === 0 ? (
              <span className="text-sm text-velora-textGray">Aucune couleur ajoutee</span>
            ) : (
              form.colors.map((color) => (
                <button
                  key={`${color.name}-${color.code}`}
                  type="button"
                  onClick={() => removeColor(color.name)}
                  className="flex items-center gap-2 rounded-lg border border-[#E7DED2] bg-white px-3 py-2 text-sm font-medium text-velora-dark transition-colors duration-150 hover:border-red-300 hover:text-red-600"
                  title="Supprimer cette couleur"
                >
                  <span
                    className="h-4 w-4 rounded-sm border border-[#D8CDBF]"
                    style={{ backgroundColor: color.code }}
                  />
                  {color.name} x
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          <Option name="isNewArrival" checked={form.isNewArrival} onChange={handleChange}>Nouveau</Option>
          <Option name="isFeatured" checked={form.isFeatured} onChange={handleChange}>Vedette</Option>
          <Option name="isBestSeller" checked={form.isBestSeller} onChange={handleChange}>Best seller</Option>
          <Option name="isCustomizable" checked={form.isCustomizable} onChange={handleChange}>Personnalisable</Option>
          <Option name="isActive" checked={form.isActive} onChange={handleChange}>Produit actif</Option>
        </div>

        <div className="mt-7 border-t border-[#EFE7DC] pt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="h-10 w-full sm:w-auto rounded-lg border border-[#E7DED2] bg-white px-5 text-sm font-semibold text-velora-dark transition-colors duration-200 hover:border-velora-gold hover:text-velora-gold hover:bg-[#FFFDF9] disabled:opacity-40"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="h-10 w-full sm:w-auto rounded-lg bg-velora-gold px-5 sm:px-6 text-sm font-semibold text-white transition-colors duration-200 hover:brightness-95 disabled:opacity-60"
          >
            {loading ? "Enregistrement..." : isEdit ? "Modifier le produit" : "Ajouter le produit"}
          </button>
        </div>
      </div>
    </form>
  );
}
