import { useEffect, useState } from "react";
import { BarChart3, Check, Save } from "lucide-react";

import AdminPageHeader from "../components/AdminPageHeader";
import { API_BASE_URL, authHeaders } from "../../config/api";

const emptyConfig = {
  enabled: false,
  googleAnalyticsId: "",
  metaPixelId: "",
  googleSiteVerification: "",
};

const statusLabel = (value) => (value ? "Configuré" : "Non configuré");

export default function Tracking() {
  const [config, setConfig] = useState(emptyConfig);
  const [analytics, setAnalytics] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [configResponse, analyticsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/tracking/admin/config`, authHeaders()),
          fetch(`${API_BASE_URL}/tracking/admin/analytics`, authHeaders()),
        ]);
        if (!configResponse.ok) throw new Error("Impossible de charger la configuration.");
        setConfig({ ...emptyConfig, ...(await configResponse.json()) });
        if (analyticsResponse.ok) setAnalytics(await analyticsResponse.json());
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const update = (name, value) => setConfig((current) => ({ ...current, [name]: value }));

  const save = async (event) => {
    event.preventDefault();
    setError("");
    setSaved(false);
    try {
      const response = await fetch(`${API_BASE_URL}/tracking/admin/config`, {
        method: "PUT",
        ...authHeaders(),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(config),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Impossible d'enregistrer.");
      setConfig({ ...emptyConfig, ...data });
      setSaved(true);
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  if (loading) return <div className="py-12 text-sm text-velora-textGray">Chargement du tracking...</div>;

  return (
    <section>
      <AdminPageHeader title="Tracking" description="Configuration privée des outils de mesure et de référencement." />

      <form onSubmit={save} className="mt-6 max-w-4xl space-y-5">
        <div className="border border-[#E7DED2] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FFF4E8] text-velora-gold"><BarChart3 size={19} /></div>
            <div>
              <h2 className="text-base font-semibold text-velora-dark">État du tracking</h2>
              <p className="mt-1 text-sm leading-6 text-velora-textGray">Les scripts ne sont chargés que si le tracking est activé et que le visiteur donne son consentement.</p>
            </div>
          </div>

          <label className="mt-6 flex items-center justify-between gap-4 border border-[#E7DED2] p-4">
            <span>
              <span className="block text-sm font-semibold text-velora-dark">{config.enabled ? "Tracking activé" : "Tracking désactivé"}</span>
              <span className="mt-1 block text-xs text-velora-textGray">{config.enabled ? "Les visiteurs consentants peuvent être mesurés." : "Aucun script analytics n'est chargé."}</span>
            </span>
            <input type="checkbox" checked={config.enabled} onChange={(event) => update("enabled", event.target.checked)} className="h-5 w-5 accent-[#C96A26]" />
          </label>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block"><span className="mb-2 block text-xs font-semibold text-velora-dark">Google Analytics 4 Measurement ID</span><input value={config.googleAnalyticsId} onChange={(event) => update("googleAnalyticsId", event.target.value.toUpperCase())} placeholder="G-XXXXXXXXXX" className="h-11 w-full rounded-lg border border-[#E7DED2] px-3 text-sm outline-none focus:border-velora-gold" /><span className="mt-1 block text-xs text-velora-textGray">{statusLabel(config.googleAnalyticsId)}</span></label>
            <label className="block"><span className="mb-2 block text-xs font-semibold text-velora-dark">Meta Pixel ID</span><input value={config.metaPixelId} onChange={(event) => update("metaPixelId", event.target.value.replace(/\D/g, ""))} placeholder="123456789012345" className="h-11 w-full rounded-lg border border-[#E7DED2] px-3 text-sm outline-none focus:border-velora-gold" /><span className="mt-1 block text-xs text-velora-textGray">{statusLabel(config.metaPixelId)}</span></label>
          </div>

          <label className="mt-4 block"><span className="mb-2 block text-xs font-semibold text-velora-dark">Google Search Console Verification</span><input value={config.googleSiteVerification} onChange={(event) => update("googleSiteVerification", event.target.value)} placeholder="Code de vérification" className="h-11 w-full rounded-lg border border-[#E7DED2] px-3 text-sm outline-none focus:border-velora-gold" /><span className="mt-1 block text-xs text-velora-textGray">{statusLabel(config.googleSiteVerification)}</span></label>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="inline-flex h-11 items-center gap-2 rounded-lg bg-velora-gold px-5 text-sm font-semibold text-white transition hover:bg-velora-goldHover">{saved ? <Check size={16} /> : <Save size={16} />}{saved ? "Enregistré" : "Enregistrer"}</button>
      </form>

      <section className="mt-8 max-w-4xl border border-[#E7DED2] bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-base font-semibold text-velora-dark">Statistiques réelles enregistrées</h2>
        <p className="mt-1 text-sm text-velora-textGray">Aucune statistique n'est simulée. Les valeurs apparaissent après consentement et événements reçus.</p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[['Visiteurs', analytics?.visitors || 0], ['Pages vues', analytics?.pageViews || 0], ['Ajouts panier', analytics?.addToCart || 0], ['Commandes', analytics?.orders || 0], ['Checkouts', analytics?.checkouts || 0], ['CA', `${Number(analytics?.revenue || 0).toFixed(2)} DT`], ['Vues produits', analytics?.productViews || 0], ['Conversion', `${analytics?.conversionRate || 0}%`]].map(([label, value]) => <div key={label} className="border border-[#E7DED2] p-3"><span className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-velora-textGray">{label}</span><strong className="mt-2 block text-lg text-velora-dark">{value}</strong></div>)}
        </div>
      </section>
    </section>
  );
}
