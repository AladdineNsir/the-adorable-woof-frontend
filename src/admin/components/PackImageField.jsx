import { useEffect, useMemo } from "react";
import { ImagePlus, Trash2, X } from "lucide-react";
import { resolveAssetUrl } from "../../config/api";

const labelClass = "mb-3 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#786B5E]";

export default function PackImageField({ images, setImages, existingImages = [], setExistingImages }) {
  const previewImages = useMemo(
    () => images.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [images]
  );

  useEffect(() => () => {
    previewImages.forEach(({ url }) => URL.revokeObjectURL(url));
  }, [previewImages]);

  const handleChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (!selectedFiles.length) return;

    setImages((current) => {
      const keys = new Set(current.map((file) => `${file.name}-${file.size}-${file.lastModified}`));
      return [
        ...current,
        ...selectedFiles.filter((file) => !keys.has(`${file.name}-${file.size}-${file.lastModified}`)),
      ];
    });
    event.target.value = "";
  };

  const setExistingMain = (index) => {
    if (index === 0 || !setExistingImages) return;
    setExistingImages((current) => {
      const reordered = [...current];
      const [main] = reordered.splice(index, 1);
      reordered.unshift(main);
      return reordered;
    });
  };

  const setNewMain = (index) => {
    if (index === 0) return;
    setImages((current) => {
      const reordered = [...current];
      const [main] = reordered.splice(index, 1);
      reordered.unshift(main);
      return reordered;
    });
  };

  return (
    <section className="rounded-2xl border border-[#E7DED2] bg-white shadow-[0_8px_30px_rgba(17,17,17,0.035)]">
      <div className="flex items-center gap-3 border-b border-[#EFE7DC] px-5 py-4 sm:px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8D8C8] bg-[#FFF7EE] text-[#C96A26]"><ImagePlus size={17} strokeWidth={1.8} /></div>
        <div>
          <h2 className="text-sm font-bold text-velora-dark sm:text-[15px]">Images du pack</h2>
          <p className="mt-0.5 text-xs text-velora-textGray">Ajoutez plusieurs photos et choisissez la photo principale.</p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {existingImages.length > 0 && (
          <div className="mb-6">
            <p className={labelClass}>Images actuelles</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {existingImages.map((image, index) => (
                <div key={`${image}-${index}`} className="group overflow-hidden rounded-xl border border-[#E7DED2] bg-[#FCFAF7]">
                  <div className="relative aspect-square overflow-hidden bg-[#F8F4EE]">
                    <img src={resolveAssetUrl(image)} alt="Pack" className="h-full w-full object-cover" />
                    {index === 0 && <div className="absolute left-2 top-2 rounded-md bg-[#C96A26] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Principale</div>}
                    {index !== 0 && <button type="button" onClick={() => setExistingMain(index)} className="absolute bottom-2 left-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-velora-dark shadow-md hover:bg-[#FFF7EE] hover:text-[#C96A26]">Principale</button>}
                    <button type="button" onClick={() => setExistingImages((current) => current.filter((_, imageIndex) => imageIndex !== index))} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-red-600 shadow-sm hover:bg-red-50" aria-label="Supprimer l'image"><Trash2 size={15} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <label htmlFor="pack-images" className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#DCCFC1] bg-[#FCFAF7] px-5 py-9 text-center transition-all duration-200 hover:border-[#C96A26] hover:bg-[#FFF9F3]">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E8D8C8] bg-white text-[#C96A26] shadow-sm transition-transform duration-200 group-hover:-translate-y-1"><ImagePlus size={21} strokeWidth={1.7} /></div>
          <p className="mt-3 text-sm font-bold text-velora-dark">Ajouter des images</p>
          <p className="mt-1 text-xs text-velora-textGray">PNG, JPG, WEBP ou AVIF, plusieurs images possibles</p>
          <span className="mt-4 inline-flex h-9 items-center rounded-lg border border-[#E7DED2] bg-white px-4 text-xs font-semibold text-velora-dark">Sélectionner des fichiers</span>
          <input id="pack-images" type="file" multiple accept="image/png,image/jpeg,image/jpg,image/webp,image/avif" onChange={handleChange} className="hidden" />
        </label>

        {previewImages.length > 0 && (
          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between"><p className={labelClass}>Nouvelles images</p><span className="text-xs font-semibold text-velora-textGray">{previewImages.length} image{previewImages.length > 1 ? "s" : ""}</span></div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {previewImages.map(({ file, url }, index) => (
                <div key={`${file.name}-${file.lastModified}-${index}`} className="group overflow-hidden rounded-xl border border-[#E7DED2] bg-[#FCFAF7]">
                  <div className="relative aspect-square overflow-hidden bg-[#F8F4EE]">
                    <img src={url} alt={file.name} className="h-full w-full object-cover" />
                    {index === 0 && <div className="absolute left-2 top-2 rounded-md bg-[#C96A26] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Principale</div>}
                    {index !== 0 && <button type="button" onClick={() => setNewMain(index)} className="absolute bottom-2 left-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-velora-dark shadow-md hover:bg-[#FFF7EE] hover:text-[#C96A26]">Principale</button>}
                    <button type="button" onClick={() => setImages((current) => current.filter((_, fileIndex) => fileIndex !== index))} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#C95B4B] opacity-0 shadow-md transition group-hover:opacity-100 hover:bg-[#C95B4B] hover:text-white" aria-label="Supprimer cette image"><X size={16} /></button>
                  </div>
                  <p className="truncate px-2.5 py-2 text-[11px] font-medium text-velora-textGray">{file.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
