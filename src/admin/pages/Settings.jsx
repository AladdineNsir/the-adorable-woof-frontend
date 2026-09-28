import { useEffect, useState } from "react";
import { ImagePlus, RotateCcw } from "lucide-react";

import AdminPageHeader from "../components/AdminPageHeader";
import { uploadSettingsImage } from "../services/settingsApi";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import { getPacks } from "../../services/packApi";

const colorFields = [
  ["primary", "Couleur principale"],
  ["primaryHover", "Couleur au survol"],
  ["cream", "Fond principal"],
  ["dark", "Texte principal"],
  ["textGray", "Texte secondaire"],
  ["border", "Bordures"],
];

const imageFields = [
  ["heroImage", "Image principale du Home"],
  ["constructionImage", "Image section conception"],
];

const aboutImageField = ["aboutImage", "Image principale de About"];

const collectionFields = [
  ["harnais", "Image Harnais"],
  ["colliers", "Image Colliers"],
  ["laisses", "Image Laisses"],
];

function ImageSetting({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");
    uploadSettingsImage(file)
      .then(onChange)
      .catch(() => setUploadError("Échec du chargement de l'image."))
      .finally(() => setUploading(false));
  };

  return (
    <div className="border border-[#E7DED2] bg-white p-4">
      <div className="flex items-start gap-4">
        <div className="h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-[#F8F5EF]">
          <img src={value} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <label className="text-sm font-semibold text-velora-dark">{label}</label>
          <input
            value={value.startsWith("data:") ? "Image chargée depuis votre appareil" : value}
            onChange={(event) => onChange(event.target.value)}
            className="mt-2 h-10 w-full rounded-lg border border-[#E7DED2] px-3 text-xs text-velora-dark outline-none focus:border-velora-gold"
            placeholder="https://..."
          />
          <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-velora-gold">
            <ImagePlus size={15} />
            {uploading ? "Chargement..." : "Charger une image sur Cloudinary"}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
          </label>
          {uploadError && <p className="mt-1 text-xs text-red-600">{uploadError}</p>}
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const { settings, updateSettings, resetSettings } = useSiteSettings();
  const [packs, setPacks] = useState([]);

  useEffect(() => {
    getPacks()
      .then((data) => setPacks(Array.isArray(data?.packs) ? data.packs : []))
      .catch(() => setPacks([]));
  }, []);

  const updateTheme = (name, value) => updateSettings({ theme: { [name]: value } });
  const updateHome = (name, value) => updateSettings({ home: { [name]: value } });
  const updateAbout = (value) => updateSettings({ about: { image: value } });
  const updateCollection = (name, value) =>
    updateSettings({ home: { collections: { [name]: value } } });

  return (
    <section>
      <AdminPageHeader
        title="Paramètres"
        description=""
        action={
          <button
            type="button"
            onClick={resetSettings}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E7DED2] bg-white px-4 text-sm font-semibold text-velora-dark hover:border-velora-gold hover:text-velora-gold"
          >
            <RotateCcw size={15} />
            Réinitialiser
          </button>
        }
      />

      <div className="mt-6 space-y-6">
        <div className="border border-[#E7DED2] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-semibold text-velora-dark">Couleurs du thème</h2>
          {/* <p className="mt-1 text-sm text-velora-textGray">Les changements sont enregistrés automatiquement.</p> */}
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {colorFields.map(([name, label]) => (
              <label key={name} className="flex items-center justify-between gap-3 border border-[#E7DED2] p-3">
                <span className="text-sm font-medium text-velora-dark">{label}</span>
                <input
                  type="color"
                  value={settings.theme[name]}
                  onChange={(event) => updateTheme(name, event.target.value)}
                  className="h-9 w-12 cursor-pointer rounded border-0 bg-transparent p-0"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="border border-[#E7DED2] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-semibold text-velora-dark">Images du Home</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="border border-[#E7DED2] bg-[#FCFAF7] p-4 lg:col-span-2">
              <label className="block text-sm font-semibold text-velora-dark">
                Pack affiché sur la Home
              </label>
              <select
                value={settings.home.featuredPack || ""}
                onChange={(event) => updateHome("featuredPack", event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-[#E7DED2] bg-white px-3 text-sm text-velora-dark outline-none focus:border-velora-gold"
              >
                <option value="">Afficher tous les packs</option>
                <option value="__none__">Ne pas afficher les packs</option>
                {packs.map((pack) => (
                  <option key={pack._id} value={pack._id}>
                    {pack.name}
                  </option>
                ))}
              </select>
            </div>

            {imageFields.map(([name, label]) => (
              <ImageSetting
                key={name}
                label={label}
                value={settings.home[name]}
                onChange={(value) => updateHome(name, value)}
              />
            ))}
            <ImageSetting
              label={aboutImageField[1]}
              value={settings.about.image}
              onChange={updateAbout}
            />
            {collectionFields.map(([name, label]) => (
              <ImageSetting
                key={name}
                label={label}
                value={settings.home.collections[name]}
                onChange={(value) => updateCollection(name, value)}
              />
            ))}
          </div>
        </div>

        <p className="text-xs text-velora-textGray">
          Les réglages sont enregistrés sur le serveur et visibles par tous les visiteurs.
        </p>
      </div>
    </section>
  );
}
