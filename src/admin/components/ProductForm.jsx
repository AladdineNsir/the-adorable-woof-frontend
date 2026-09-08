import { useEffect, useMemo, useState } from "react";
import Toast from "../../components/Toast";
import {
  Check,
  ChevronDown,
  ImagePlus,
  Package,
  Palette,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import { getCategories } from "../services/categoryApi";
import { createProduct, updateProduct } from "../services/productApi";
import { getSubCategories } from "../services/subCategoryApi";
import { resolveAssetUrl } from "../../config/api";

/* =========================================================
   STYLES
========================================================= */

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

function Option({ children, ...props }) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 rounded-xl border border-[#E7DED2] bg-[#FCFAF7] px-4 py-3.5 transition-all duration-200 hover:border-[#DCC9B5] hover:bg-white">
      <input
        type="checkbox"
        className="h-4 w-4 accent-[#C96A26]"
        {...props}
      />

      <span className="text-sm font-semibold text-velora-dark">
        {children}
      </span>
    </label>
  );
}

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

/* =========================================================
   COMPONENT
========================================================= */

export default function ProductForm({
  product = null,
  isEdit = false,
}) {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
const [toastMessage, setToastMessage] = useState("");
const [toastType, setToastType] = useState("success");
useEffect(() => {
  if (!toastVisible) return;

  const timer = setTimeout(() => {
    setToastVisible(false);
  }, 3000);

  return () => clearTimeout(timer);
}, [toastVisible]); 

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);


const [colorInput, setColorInput] = useState({
  name: "",
  type: "color",
  code: "#000000",
  image: null,
});

  const imagePreviewUrls = useMemo(
    () =>
      images.map((image) => ({
        file: image,
        url: URL.createObjectURL(image),
      })),
    [images]
  );

  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [imagePreviewUrls]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    details: "",

    price: "",
    costPrice: "",
    oldPrice: "",

    category: "",
    subCategory: "",

    stock: "",

    sizes: [],
    colors: [],
    materials: [],

    isCustomizable: false,
    badge: "",
    isActive: true,
  });

  const colorPreviewUrls = useMemo(
    () =>
      new Map(
        form.colors
          .filter((color) => color.type === "image" && color.image instanceof File)
          .map((color) => [color.name, URL.createObjectURL(color.image)])
      ),
    [form.colors]
  );

  useEffect(() => {
    return () => {
      colorPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [colorPreviewUrls]);

  /* =========================================================
     LOAD CATEGORIES
  ========================================================= */

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingData(true);

        const [categoryData, subCategoryData] = await Promise.all([
          getCategories(),
          getSubCategories(),
        ]);

        setCategories(categoryData.categories || []);
        setSubCategories(subCategoryData.subCategories || []);
      } catch (err) {
        console.error("Erreur chargement catégories :", err);
      } finally {
        setLoadingData(false);
      }
    };

    load();
  }, []);

  /* =========================================================
     LOAD PRODUCT FOR EDIT
  ========================================================= */

  useEffect(() => {
    if (!product) return;

    setForm({
      name: product.name || "",
      description: product.description || "",
      details: product.details || "",

      price: product.price ?? "",
      costPrice: product.costPrice ?? "",
      oldPrice: product.oldPrice ?? "",

      category: product.category?._id || product.category || "",
      subCategory:
        product.subCategory?._id || product.subCategory || "",

      stock: product.stock ?? "",

      sizes: product.sizes || [],
      colors: product.colors || [],
      materials: product.materials || [],

      isCustomizable: Boolean(product.isCustomizable),
      badge: product.badge || "",
      isActive:
        product.isActive === undefined
          ? true
          : Boolean(product.isActive),
    });

    setExistingImages(product.images || []);
  }, [product]);

  /* =========================================================
     HANDLE CHANGE
  ========================================================= */

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,

      ...(name === "category"
        ? { subCategory: "" }
        : {}),
    }));
  };

  /* =========================================================
     SIZES
  ========================================================= */

  const removeSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((item) => item !== size),
    }));
  };

  /* =========================================================
     COLORS
  ========================================================= */

  const addColor = () => {
  const name = colorInput.name.trim();

  if (!name) return;

  if (colorInput.type === "image" && !colorInput.image) {
    setToastMessage("Choisissez une image pour ce motif.");
    setToastType("error");
    setToastVisible(true);
    return;
  }

  const newColor =
    colorInput.type === "image"
      ? {
          name,
          type: "image",
          code: "",
          image: colorInput.image,
        }
      : {
          name,
          type: "color",
          code: colorInput.code || "#000000",
          image: null,
        };

  setForm((prev) => ({
    ...prev,
    colors: [
      ...prev.colors.filter(
        (color) =>
          color.name.toLowerCase() !== name.toLowerCase()
      ),
      newColor,
    ],
  }));

  setColorInput({
    name: "",
    type: "color",
    code: "#000000",
    image: null,
  });
};
  const removeColor = (name) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter(
        (color) => color.name !== name
      ),
    }));
  };

  /* =========================================================
     EXISTING IMAGES
  ========================================================= */

  const removeExistingImage = (image) => {
    setExistingImages((prev) =>
      prev.filter((item) => item !== image)
    );
  };
 const setMainExistingImage = (index) => {
  if (index === 0) return;

  setExistingImages((prev) => {
    const reordered = [...prev];
    const [selectedImage] = reordered.splice(index, 1);

    reordered.unshift(selectedImage);

    return reordered;
  });
};

const setMainNewImage = (index) => {
  if (index === 0) return;

  setImages((prev) => {
    const reordered = [...prev];
    const [selectedImage] = reordered.splice(index, 1);

    reordered.unshift(selectedImage);

    return reordered;
  });
};

  /* =========================================================
     NEW IMAGES
  ========================================================= */

const handleImagesChange = (e) => {
  const selectedFiles = Array.from(e.target.files || []);

  if (selectedFiles.length === 0) return;

  setImages((prev) => {
    const existingKeys = new Set(
      prev.map((file) => `${file.name}-${file.size}-${file.lastModified}`)
    );

    const newFiles = selectedFiles.filter(
      (file) =>
        !existingKeys.has(
          `${file.name}-${file.size}-${file.lastModified}`
        )
    );

    return [...prev, ...newFiles];
  });

  // Permet de sélectionner à nouveau le même fichier
  e.target.value = "";
};

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

   if (!form.name.trim()) {
  setToastMessage("Le nom du produit est obligatoire.");
  setToastType("error");
  setToastVisible(true);
  return;
}

if (!form.price || Number(form.price) < 0) {
  setToastMessage("Veuillez renseigner un prix valide.");
  setToastType("error");
  setToastVisible(true);
  return;
}

if (!form.description.trim()) {
  setToastMessage("La description du produit est obligatoire.");
  setToastType("error");
  setToastVisible(true);
  return;
}

if (!form.category) {
  setToastMessage("Veuillez sélectionner une catégorie.");
  setToastType("error");
  setToastVisible(true);
  return;
}

if (!form.subCategory) {
  setToastMessage("Veuillez sélectionner une sous-catégorie.");
  setToastType("error");
  setToastVisible(true);
  return;
}

if (form.sizes.length === 0 || form.colors.length === 0) {
  setToastMessage("Ajoutez au moins une taille et une couleur.");
  setToastType("error");
  setToastVisible(true);
  return;
}

    setLoading(true);

    try {
      const formData = new FormData();
      const colorImages = [];
      const colors = form.colors.map((color) => {
        if (color.type !== "image" || !(color.image instanceof File)) {
          return color;
        }

        const imageIndex = colorImages.push(color.image) - 1;

        return {
          ...color,
          image: "",
          imageIndex,
        };
      });

      Object.keys(form).forEach((key) => {
        const value = key === "colors" ? colors : form[key];

        formData.append(
          key,
          Array.isArray(value)
            ? JSON.stringify(value)
            : value
        );
      });

      images.forEach((image) => {
        formData.append("images", image);
      });

      colorImages.forEach((image) => {
        formData.append("colorImages", image);
      });

      formData.append(
        "existingImages",
        JSON.stringify(existingImages)
      );

   if (isEdit) {
  await updateProduct(product._id, formData);

  setToastMessage("Produit modifié avec succès.");
  setToastType("success");
  setToastVisible(true);
} else {
    await createProduct(formData);

  setToastMessage("Produit ajouté avec succès.");
  setToastType("success");
  setToastVisible(true);
}
    } catch (error) {
  setToastMessage(
  error.response?.data?.message ||
    "Erreur lors de l'enregistrement du produit."
);
setToastType("error");
setToastVisible(true);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FILTER SUBCATEGORIES
  ========================================================= */

  const filteredSubCategories = subCategories.filter(
    (sub) => {
      const categoryId =
        sub.category?._id || sub.category;

      return categoryId === form.category;
    }
  );

  /* =========================================================
     LOADING
  ========================================================= */

  if (loadingData) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-[#E7DED2] bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E7DED2] border-t-[#C96A26]" />

          <p className="text-sm font-medium text-velora-textGray">
            Chargement du formulaire...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 pb-4"
    >

      {/* =====================================================
          INFORMATIONS GENERALES
      ===================================================== */}

      <section className={sectionClass}>
        <SectionTitle
          icon={Package}
          title="Informations générales"
          description=""
        />

        <div className="p-5 sm:p-6">

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

            {/* Nom */}

            <div className="lg:col-span-2">
              <label
                htmlFor="name"
                className={labelClass}
              >
                Nom du produit *
              </label>

              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Ex : Harnais Premium Caramel"
                className={inputClass}
              />
            </div>

            {/* Description */}

            <div>
              <label
                htmlFor="description"
                className={labelClass}
              >
                Description *
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                required
                placeholder="Décrivez brièvement le produit..."
                className={`${textAreaClass} resize-y`}
              />
            </div>

            {/* Détails */}

            <div>
              <label
                htmlFor="details"
                className={labelClass}
              >
                Détails
              </label>

              <textarea
                id="details"
                name="details"
                value={form.details}
                onChange={handleChange}
                rows={5}
                placeholder="Dimensions, matière, entretien..."
                className={`${textAreaClass} resize-y`}
              />
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          PRIX & STOCK
      ===================================================== */}

      <section className={sectionClass}>
        <SectionTitle
          icon={Save}
          title="Prix & stock"
          description=""
        />

        <div className="p-5 sm:p-6">

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {/* Prix */}

            <div>
              <label
                htmlFor="price"
                className={labelClass}
              >
                Prix de vente *
              </label>

              <div className="relative">
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                  className={`${inputClass} pr-14`}
                />

                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-bold text-[#8D7D6D]">
                  TND
                </span>
              </div>
            </div>

            {/* Cost price */}

            <div>
              <label
                htmlFor="costPrice"
                className={labelClass}
              >
                Prix coûtant
              </label>

              <div className="relative">
                <input
                  id="costPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  name="costPrice"
                  value={form.costPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`${inputClass} pr-14`}
                />

                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-bold text-[#8D7D6D]">
                  TND
                </span>
              </div>

              <p className="mt-1.5 text-[11px] text-velora-textGray">
                Utilisé pour calculer votre bénéfice réel.
              </p>
            </div>

            {/* Old price */}

            <div>
              <label
                htmlFor="oldPrice"
                className={labelClass}
              >
                Ancien prix
              </label>

              <div className="relative">
                <input
                  id="oldPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  name="oldPrice"
                  value={form.oldPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`${inputClass} pr-14`}
                />

                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-bold text-[#8D7D6D]">
                  TND
                </span>
              </div>
            </div>

            {/* Stock */}

            <div>
              <label
                htmlFor="stock"
                className={labelClass}
              >
                Stock disponible *
              </label>

              <input
                id="stock"
                type="number"
                min="0"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
                placeholder="0"
                className={inputClass}
              />
            </div>

          </div>

          {/* Profit preview */}

          {form.price !== "" &&
            form.costPrice !== "" && (
              <div className="mt-5 flex items-center justify-between rounded-xl border border-[#DDEBDD] bg-[#F7FBF7] px-4 py-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#628067]">
                    Bénéfice unitaire estimé
                  </p>

                  <p className="mt-1 text-xs text-[#718073]">
                    Prix de vente − prix coûtant
                  </p>
                </div>

                <p className="text-lg font-bold text-[#47724F]">
                  {(
                    Number(form.price || 0) -
                    Number(form.costPrice || 0)
                  ).toFixed(2)}{" "}
                  TND
                </p>
              </div>
            )}

        </div>
      </section>

      {/* =====================================================
          CATEGORISATION
      ===================================================== */}

      <section className={sectionClass}>
        <SectionTitle
          icon={ChevronDown}
          title="Catégorisation"
          description=""
        />

        <div className="grid grid-cols-1 gap-5 p-5 sm:p-6 lg:grid-cols-2">

          <div>
            <label
              htmlFor="category"
              className={labelClass}
            >
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
              <option value="">
                Choisir une catégorie
              </option>

              {categories.map((cat) => (
                <option
                  key={cat._id}
                  value={cat._id}
                >
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="subCategory"
              className={labelClass}
            >
              Sous-catégorie *
            </label>

            <select
              id="subCategory"
              name="subCategory"
              value={form.subCategory}
              onChange={handleChange}
              required
              disabled={!form.category}
              className={`${inputClass} disabled:cursor-not-allowed disabled:bg-[#F7F3EC] disabled:text-[#A99D91]`}
            >
              <option value="">
                {form.category
                  ? "Choisir une sous-catégorie"
                  : "Choisissez d'abord une catégorie"}
              </option>

              {filteredSubCategories.map((sub) => (
                <option
                  key={sub._id}
                  value={sub._id}
                >
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

        </div>
      </section>

      {/* =====================================================
          IMAGES
      ===================================================== */}

      <section className={sectionClass}>
        <SectionTitle
          icon={ImagePlus}
          title="Images du produit"
          description=""
        />

        <div className="p-5 sm:p-6">

          {/* Existing images */}

          {isEdit &&
            existingImages.length > 0 && (
              <div className="mb-6">

                <p className={labelClass}>
                  Images actuelles
                </p>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {existingImages.map((image, index) => (
                    <div
                      key={image}
                      className="group overflow-hidden rounded-xl border border-[#E7DED2] bg-[#FCFAF7]"
                    >
                      <div className="relative aspect-square overflow-hidden bg-[#F8F4EE]">

  <img
    src={resolveAssetUrl(image)}
    alt="Produit"
    loading="lazy"
    decoding="async"
    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
  />

  {/* Badge principale */}
  {index === 0 && (
    <div className="absolute left-2 top-2 rounded-md bg-[#C96A26] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
      Principale
    </div>
  )}

  {/* Bouton principale */}
  {index !== 0 && (
    <button
      type="button"
      onClick={() => setMainExistingImage(index)}
      className="absolute bottom-2 left-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-velora-dark shadow-md hover:bg-[#FFF7EE] hover:text-[#C96A26]"
    >
      Principale
    </button>
  )}

  {/* Supprimer */}
  <button
    type="button"
    onClick={() => removeExistingImage(image)}
    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-red-600 shadow-sm transition hover:bg-red-50"
    title="Supprimer"
  >
    <Trash2 size={15} />
  </button>

</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Upload */}

          <label
            htmlFor="images"
            className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#DCCFC1] bg-[#FCFAF7] px-5 py-9 text-center transition-all duration-200 hover:border-[#C96A26] hover:bg-[#FFF9F3]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E8D8C8] bg-white text-[#C96A26] shadow-sm transition-transform duration-200 group-hover:-translate-y-1">
              <ImagePlus size={21} strokeWidth={1.7} />
            </div>

            <p className="mt-3 text-sm font-bold text-velora-dark">
              Ajouter des images
            </p>

            <p className="mt-1 text-xs text-velora-textGray">
              PNG, JPG, WEBP ou AVIF · plusieurs images possibles
            </p>

            <span className="mt-4 inline-flex h-9 items-center rounded-lg border border-[#E7DED2] bg-white px-4 text-xs font-semibold text-velora-dark">
              Sélectionner des fichiers
            </span>

            <input
              id="images"
              type="file"
              multiple
              accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
              onChange={handleImagesChange}
              className="hidden"
            />
          </label>

          {/* New images preview */}

          {images.length > 0 && (
            <div className="mt-5">

              <div className="mb-3 flex items-center justify-between">
                <p className={labelClass}>
                  Nouvelles images
                </p>

                <span className="text-xs font-semibold text-velora-textGray">
                  {images.length} image
                  {images.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {imagePreviewUrls.map(({ file: image, url: previewUrl }, index) => {

  return (
    <div
      key={`${image.name}-${image.lastModified}-${index}`}
      className="group overflow-hidden rounded-xl border border-[#E7DED2] bg-[#FCFAF7]"
    >
     <div className="relative aspect-square overflow-hidden bg-[#F8F4EE]">

  <img
    src={previewUrl}
    alt={image.name}
    decoding="async"
    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
  />

  {/* Badge principale */}
  {index === 0 && (
    <div className="absolute left-2 top-2 rounded-md bg-[#C96A26] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
      Principale
    </div>
  )}

  {/* Bouton définir comme principale */}
  {index !== 0 && (
    <button
      type="button"
      onClick={() => setMainNewImage(index)}
      className="absolute bottom-2 left-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-velora-dark shadow-md transition hover:bg-[#FFF7EE] hover:text-[#C96A26]"
    >
      Principale
    </button>
  )}

  {/* Supprimer */}
  <button
    type="button"
    onClick={() => {
      setImages((prev) =>
        prev.filter((_, i) => i !== index)
      );
    }}
    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#C95B4B] opacity-0 shadow-md transition-all duration-200 group-hover:opacity-100 hover:bg-[#C95B4B] hover:text-white"
    title="Supprimer"
    aria-label="Supprimer cette image"
  >
    <X size={16} />
  </button>

</div>

      <p className="truncate px-2.5 py-2 text-[11px] font-medium text-velora-textGray">
        {image.name}
      </p>
    </div>
  );
})}
              </div>

            </div>
          )}

        </div>
      </section>

      {/* =====================================================
          TAILLES & COULEURS
      ===================================================== */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

        {/* Sizes */}

        <section className={sectionClass}>
  <SectionTitle
    icon={Plus}
    title="Tailles"
    description=""
  />

  <div className="p-5 sm:p-6">
    <div className="flex flex-wrap gap-2.5">
      {["XS", "S", "M", "L", "XL"].map((size) => {
        const isSelected = form.sizes.includes(size);

        return (
          <button
            key={size}
            type="button"
            onClick={() => {
              if (isSelected) {
                removeSize(size);
              } else {
                setForm((current) => ({
                  ...current,
                  sizes: [...current.sizes, size],
                }));
              }
            }}
            className={`
              inline-flex h-11 min-w-[54px] items-center justify-center
              rounded-xl border px-4
              text-sm font-semibold
              transition-all duration-200
              ${
                isSelected
                  ? "border-[#C96A26] bg-[#C96A26] text-white shadow-[0_5px_14px_rgba(201,106,38,0.18)]"
                  : "border-[#E7DED2] bg-white text-velora-dark hover:border-[#C96A26] hover:bg-[#FCFAF7] hover:text-[#C96A26]"
              }
            `}
          >
            {size}
          </button>
        );
      })}
    </div>

    <div className="mt-4 rounded-xl border border-[#EFE7DC] bg-[#FCFAF7] px-4 py-3">
      {form.sizes.length === 0 ? (
        <p className="text-xs text-velora-textGray">
          Aucune taille sélectionnée.
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-xs font-medium text-velora-textGray">
            Tailles disponibles :
          </span>

          <span className="text-xs font-bold text-velora-dark">
            {form.sizes.join(" · ")}
          </span>
        </div>
      )}
    </div>
  </div>
</section>

        {/* Colors */}

        <section className={sectionClass}>
          <SectionTitle
            icon={Palette}
            title="Couleurs"
            description=""
          />

          <div className="p-5 sm:p-6">

            <div className="space-y-4">

  {/* Nom + type */}
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px_auto]">

    <input
      value={colorInput.name}
      onChange={(e) =>
        setColorInput((prev) => ({
          ...prev,
          name: e.target.value,
        }))
      }
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addColor();
        }
      }}
      placeholder="Ex : Noir, Caramel, Motif floral..."
      className={inputClass}
    />

    <select
      value={colorInput.type}
      onChange={(e) =>
        setColorInput((prev) => ({
          ...prev,
          type: e.target.value,
          image: null,
        }))
      }
      className={inputClass}
    >
      <option value="color">Couleur</option>
      <option value="image">Motif / Image</option>
    </select>

    <button
      type="button"
      onClick={addColor}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E7DED2] bg-white px-5 text-sm font-semibold text-velora-dark transition-all hover:border-[#C96A26] hover:text-[#C96A26]"
    >
      <Plus size={16} />
      Ajouter
    </button>

  </div>

  {/* Type = couleur */}
  {colorInput.type === "color" && (
    <div className="flex items-center gap-3">

      <div className="relative h-11 w-[52px] overflow-hidden rounded-xl border border-[#E7DED2] bg-white p-1">
        <input
          type="color"
          value={colorInput.code}
          onChange={(e) =>
            setColorInput((prev) => ({
              ...prev,
              code: e.target.value,
            }))
          }
          className="h-full w-full cursor-pointer rounded-lg border-0 bg-transparent"
          title="Choisir la couleur"
        />
      </div>

      <span className="text-xs font-medium text-velora-textGray">
        {colorInput.code}
      </span>

    </div>
  )}

  {/* Type = image */}
  {colorInput.type === "image" && (
    <div className="rounded-xl border border-dashed border-[#DCCFC1] bg-[#FCFAF7] p-4">

      <label className="flex cursor-pointer items-center gap-3">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E8D8C8] bg-white text-[#C96A26]">
          <ImagePlus size={19} />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-velora-dark">
            {colorInput.image
              ? colorInput.image.name
              : "Choisir une image / un motif"}
          </p>

          <p className="mt-0.5 text-[11px] text-velora-textGray">
            PNG, JPG ou WEBP
          </p>
        </div>

        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={(e) =>
            setColorInput((prev) => ({
              ...prev,
              image: e.target.files?.[0] || null,
            }))
          }
          className="hidden"
        />

      </label>

    </div>
  )}

  {/* Liste des couleurs / motifs */}
  <div className="min-h-[42px]">

    {form.colors.length === 0 ? (
      <div className="flex items-center rounded-xl border border-dashed border-[#E3D8CC] px-4 py-3">
        <p className="text-xs text-velora-textGray">
          Aucune couleur ou motif ajouté.
        </p>
      </div>
    ) : (
      <div className="flex flex-wrap gap-2">

        {form.colors.map((color) => (
          <button
            key={`${color.name}-${color.code}-${color.image || ""}`}
            type="button"
            onClick={() => removeColor(color.name)}
            className="group flex items-center gap-2 rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-3 py-2 text-xs font-bold text-velora-dark transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >

            {/* Aperçu couleur */}
            {color.type !== "image" ? (
              <span
                className="h-5 w-5 rounded-md border border-[#D6CABC] shadow-inner"
                style={{
                  backgroundColor: color.code,
                }}
              />
            ) : (
              <span className="h-5 w-5 overflow-hidden rounded-md border border-[#D6CABC] bg-white">
                {color.image ? (
                  <img
                    src={
                      colorPreviewUrls.get(color.name) ||
                      resolveAssetUrl(color.image)
                    }
                    alt={color.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlus
                    size={13}
                    className="m-auto mt-1 text-[#9A8D80]"
                  />
                )}
              </span>
            )}

            <span>
              {color.name}
            </span>

            <X
              size={13}
              className="text-[#9A8D80] group-hover:text-red-500"
            />

          </button>
        ))}

      </div>
    )}

  </div>

</div>

          </div>
        </section>

      </div>

      {/* =====================================================
          OPTIONS
      ===================================================== */}

      <section className={sectionClass}>
        <SectionTitle
          icon={Check}
          title="Options du produit"
          description=""
        />

        <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 sm:p-6">

          <Option
            name="isCustomizable"
            checked={form.isCustomizable}
            onChange={handleChange}
          >
            Produit personnalisable
          </Option>

          <Option
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          >
            Produit actif
          </Option>

        </div>
      </section>

      {/* =====================================================
          BADGE
      ===================================================== */}

      <section className={sectionClass}>

        <div className="border-b border-[#EFE7DC] px-5 py-4 sm:px-6">
          <h2 className="text-sm font-bold text-velora-dark">
            Badge produit
          </h2>

        </div>

        <div className="p-5 sm:p-6">

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition-all ${
                form.badge === "new"
                  ? "border-[#F1CDAF] bg-[#FFF7EE]"
                  : "border-[#E7DED2] bg-[#FCFAF7] hover:bg-white"
              }`}
            >
              <input
                type="radio"
                name="badge"
                value="new"
                checked={form.badge === "new"}
                onChange={handleChange}
                className="h-4 w-4 accent-[#C96A26]"
              />

              <div>
                <p className="text-sm font-bold text-velora-dark">
                  Nouveau
                </p>

                <p className="mt-0.5 text-[11px] text-velora-textGray">
                  Afficher le badge Nouveau
                </p>
              </div>
            </label>

            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition-all ${
                form.badge === "special"
                  ? "border-[#F1CDAF] bg-[#FFF7EE]"
                  : "border-[#E7DED2] bg-[#FCFAF7] hover:bg-white"
              }`}
            >
              <input
                type="radio"
                name="badge"
                value="special"
                checked={form.badge === "special"}
                onChange={handleChange}
                className="h-4 w-4 accent-[#C96A26]"
              />

              <div>
                <p className="text-sm font-bold text-velora-dark">
                  Offre spéciale
                </p>

                <p className="mt-0.5 text-[11px] text-velora-textGray">
                  Afficher une offre spéciale
                </p>
              </div>
            </label>

          </div>

          {form.badge && (
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  badge: "",
                }))
              }
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-velora-textGray underline underline-offset-2 transition hover:text-red-600"
            >
              <X size={13} />
              Retirer le badge
            </button>
          )}

        </div>
      </section>

      {/* =====================================================
          ACTIONS
      ===================================================== */}

      <div className="flex flex-col-reverse gap-3 rounded-2xl border border-[#E7DED2] bg-white p-4 shadow-[0_8px_30px_rgba(17,17,17,0.035)] sm:flex-row sm:items-center sm:justify-between sm:p-5">

        <button
          type="button"
          onClick={() => window.history.back()}
          disabled={loading}
          className="h-11 w-full rounded-xl border border-[#E7DED2] bg-white px-6 text-sm font-semibold text-velora-dark transition-all hover:border-[#C96A26] hover:bg-[#FFFDF9] hover:text-[#C96A26] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          Annuler
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#C96A26] px-7 text-sm font-bold text-white shadow-[0_8px_20px_rgba(201,106,38,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#B85D20] hover:shadow-[0_10px_24px_rgba(201,106,38,0.24)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save size={16} />
              {isEdit
                ? "Enregistrer les modifications"
                : "Ajouter le produit"}
            </>
          )}
        </button>

      </div>

      <Toast
  message={toastMessage}
  visible={toastVisible}
  type={toastType}
  onClose={() => setToastVisible(false)}
/>

    </form>
  );
}