import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import AdminPageHeader from "../components/AdminPageHeader";
import PackImageField from "../components/PackImageField";
import { getPackById, updatePack } from "../../services/packApi";
import { getCategories } from "../../services/categoryApi";
import { getProducts } from "../services/productApi";

export default function EditPack() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    categories: [],
    image: "",
    isActive: true,
    discountType: "none",
    discountValue: 0,
    components: [{ product: "", quantity: 1 }],
  });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [productData, packData, categoryData] = await Promise.all([
          getProducts({ limit: 200, stock: "available" }),
          getPackById(id),
          getCategories(),
        ]);
        setProducts(productData.products || []);
        const activeCategories = (categoryData.categories || []).filter((category) => category.isActive !== false);
        setCategories(activeCategories);
        const legacyCategory = String(packData.category || "").toLowerCase();
        const selectedCategories = packData.categories?.length
          ? packData.categories.map((category) => category._id || category)
          : legacyCategory === "mixte"
            ? activeCategories.map((category) => category._id)
            : activeCategories.filter((category) => category.slug === legacyCategory).map((category) => category._id);
        setForm({
          name: packData.name || "",
          description: packData.description || "",
          categories: selectedCategories,
          image: packData.image || "",
          isActive: Boolean(packData.isActive),
          discountType: packData.discountType || "none",
          discountValue: Number(packData.discountValue || 0),
          components: (packData.components || []).map((item) => ({ product: item.product?._id || item.product || "", quantity: Number(item.quantity || 1) })),
        });
        setExistingImages(packData.images?.length ? packData.images : (packData.image ? [packData.image] : []));
      } catch (error) {
        toast.error(error?.response?.data?.message || "Impossible de charger le pack.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const addComponent = () => {
    setForm((prev) => ({ ...prev, components: [...prev.components, { product: "", quantity: 1 }] }));
  };

  const updateComponent = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      components: prev.components.map((component, itemIndex) => itemIndex === index ? { ...component, [field]: value } : component),
    }));
  };

  const removeComponent = (index) => {
    setForm((prev) => ({ ...prev, components: prev.components.filter((_, itemIndex) => itemIndex !== index) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const components = form.components.filter((item) => item.product).map((item) => ({ product: item.product, quantity: Number(item.quantity || 1) }));

    if (components.length === 0) {
      toast.error("Ajoutez au moins un produit au pack.");
      return;
    }

    try {
      setSaving(true);
      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("description", form.description);
      payload.append("categories", JSON.stringify(form.categories));
      payload.append("isActive", String(form.isActive));
      payload.append("discountType", form.discountType);
      payload.append("discountValue", String(Number(form.discountValue || 0)));
      payload.append("components", JSON.stringify(components));
      payload.append("existingImages", JSON.stringify(existingImages));
      images.forEach((image) => payload.append("images", image));
      await updatePack(id, payload);
      toast.success("Pack mis à jour.");
      navigate("/admin/packs");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Impossible de modifier le pack.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="rounded-xl border border-[#E7DED2] bg-white p-6 text-sm text-velora-textGray">Chargement du pack…</div>;
  }

  return (
    <div className="w-full">
      <AdminPageHeader title="Modifier le pack" description="Mettez à jour les produits et les règles de cette offre." breadcrumb={["Packs", "Modifier"]} backTo="/admin/packs" />
      <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <div className="mx-auto w-full max-w-6xl rounded-2xl border border-[#E7DED2] bg-white p-5 shadow-[0_8px_30px_rgba(17,17,17,0.035)] sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 md:col-span-2">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#786B5E]">Nom du pack</span>
                <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} className="h-11 w-full rounded-xl border border-[#E7DED2] bg-white px-3.5 text-sm text-velora-dark outline-none transition-all duration-200 hover:border-[#D9CCBE] focus:border-[#C96A26] focus:ring-4 focus:ring-[#C96A26]/10" required />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#786B5E]">Description</span>
                <textarea value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} rows={4} className="w-full rounded-xl border border-[#E7DED2] bg-white px-3.5 py-3 text-sm leading-6 text-velora-dark outline-none transition-all duration-200 hover:border-[#D9CCBE] focus:border-[#C96A26] focus:ring-4 focus:ring-[#C96A26]/10" />
              </label>

              <fieldset className="space-y-2">
                <legend className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#786B5E]">Catégories</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {categories.map((category) => (
                    <label key={category._id} className="flex min-h-11 items-center gap-2 rounded-xl border border-[#E7DED2] bg-white px-3.5 text-sm text-velora-dark">
                      <input
                        type="checkbox"
                        checked={form.categories.includes(category._id)}
                        onChange={(event) => setForm((prev) => ({
                          ...prev,
                          categories: event.target.checked
                            ? [...prev.categories, category._id]
                            : prev.categories.filter((selectedId) => selectedId !== category._id),
                        }))}
                        className="h-4 w-4 accent-[#C96A26]"
                      />
                      {category.name}
                    </label>
                  ))}
                </div>
                {categories.length === 0 && <p className="text-xs text-[#786B5E]">Aucune catégorie active disponible.</p>}
              </fieldset>

              <label className="space-y-2">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#786B5E]">Statut</span>
                <select value={form.isActive ? "active" : "inactive"} onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.value === "active" }))} className="h-11 w-full rounded-xl border border-[#E7DED2] bg-white px-3.5 text-sm text-velora-dark outline-none transition-all duration-200 focus:border-[#C96A26] focus:ring-4 focus:ring-[#C96A26]/10">
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#786B5E]">Type de réduction</span>
                <select value={form.discountType} onChange={(event) => setForm((prev) => ({ ...prev, discountType: event.target.value }))} className="h-11 w-full rounded-xl border border-[#E7DED2] bg-white px-3.5 text-sm text-velora-dark outline-none transition-all duration-200 focus:border-[#C96A26] focus:ring-4 focus:ring-[#C96A26]/10">
                  <option value="none">Aucune réduction</option>
                  <option value="percentage">Pourcentage</option>
                  <option value="fixed">Montant fixe</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#786B5E]">Valeur</span>
                <input type="number" min="0" step="0.01" value={form.discountValue} onChange={(event) => setForm((prev) => ({ ...prev, discountValue: Number(event.target.value || 0) }))} disabled={form.discountType === "none"} className="h-11 w-full rounded-xl border border-[#E7DED2] bg-white px-3.5 text-sm text-velora-dark outline-none transition-all duration-200 focus:border-[#C96A26] focus:ring-4 focus:ring-[#C96A26]/10 disabled:bg-[#FCFAF7] disabled:opacity-60" />
              </label>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-velora-dark">Produits inclus</h3>
                <button type="button" onClick={addComponent} className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#E7DED2] bg-white px-3.5 text-sm font-semibold text-velora-dark transition-colors hover:border-[#C96A26] hover:text-[#C96A26]"><Plus size={16} /> Ajouter un produit</button>
              </div>

              {form.components.map((component, index) => (
                <div key={index} className="grid gap-3 rounded-2xl border border-[#E7DED2] bg-[#FCFAF7] p-4 md:grid-cols-[minmax(0,1fr)_140px_50px] md:items-end">
                  <label className="space-y-2">
                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#786B5E]">Produit</span>
                    <select value={component.product} onChange={(event) => updateComponent(index, "product", event.target.value)} className="h-11 w-full rounded-xl border border-[#E7DED2] bg-white px-3.5 text-sm text-velora-dark outline-none transition-all duration-200 focus:border-[#C96A26] focus:ring-4 focus:ring-[#C96A26]/10" required>
                      <option value="">Sélectionner un produit</option>
                      {products.map((product) => (
                        <option key={product._id || product.id} value={product._id || product.id}>{product.name}</option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#786B5E]">Quantité</span>
                    <input type="number" min="1" value={component.quantity} onChange={(event) => updateComponent(index, "quantity", Number(event.target.value || 1))} className="h-11 w-full rounded-xl border border-[#E7DED2] bg-white px-3.5 text-sm text-velora-dark outline-none transition-all duration-200 focus:border-[#C96A26] focus:ring-4 focus:ring-[#C96A26]/10" />
                  </label>

                  <button type="button" onClick={() => removeComponent(index)} className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100" aria-label="Supprimer le produit"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>

            <PackImageField images={images} setImages={setImages} existingImages={existingImages} setExistingImages={setExistingImages} />

            <div className="flex justify-end gap-3 border-t border-[#EFE7DC] pt-6">
              <button type="button" onClick={() => navigate("/admin/packs")} className="h-11 rounded-xl border border-[#E7DED2] bg-white px-5 text-sm font-semibold text-velora-dark transition-colors hover:border-[#C96A26] hover:text-[#C96A26]">Annuler</button>
              <button type="submit" disabled={saving} className="h-11 rounded-xl bg-[#C96A26] px-5 text-sm font-semibold text-white shadow-[0_5px_16px_rgba(201,106,38,0.18)] transition-all hover:bg-[#B85D20] disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Enregistrement..." : "Enregistrer"}</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
