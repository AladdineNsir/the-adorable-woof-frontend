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
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [period, setPeriod] = useState("all");
  const [error, setError] = useState("");
  const [analyticsError, setAnalyticsError] = useState("");

  useEffect(() => {
    let active = true;
    const loadConfig = async () => {
      try {
        const configResponse = await fetch(`${API_BASE_URL}/tracking/admin/config`, {
          ...authHeaders(),
          credentials: "include",
        });
        if (!configResponse.ok) throw new Error("Impossible de charger la configuration.");
        const data = await configResponse.json();
        if (active) setConfig({ ...emptyConfig, ...data });
      } catch (loadError) {
        if (active) setError(loadError.message);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadConfig();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const loadAnalytics = async () => {
      setAnalyticsLoading(true);
      setAnalyticsError("");
      const query = new URLSearchParams();
      if (period !== "all") {
        query.set("start", new Date(Date.now() - Number(period) * 24 * 60 * 60 * 1000).toISOString());
        query.set("end", new Date().toISOString());
      }

      try {
        const queryString = query.toString();
        const response = await fetch(
          `${API_BASE_URL}/tracking/admin/analytics${queryString ? `?${queryString}` : ""}`,
          { ...authHeaders(), credentials: "include" }
        );
        if (!response.ok) throw new Error("Impossible de charger les statistiques marketing.");
        const data = await response.json();
        if (active) setAnalytics(data);
      } catch (loadError) {
        if (active) setAnalyticsError(loadError.message);
      } finally {
        if (active) setAnalyticsLoading(false);
      }
    };
    loadAnalytics();
    return () => {
      active = false;
    };
  }, [period]);

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

  const sourceRows = analytics?.sources || [];
  const productRows = analytics?.products || [];
  const pageRows = analytics?.topPages || [];
  const funnelSteps = [
    ["Pages vues", analytics?.pageViews || 0],
    ["Vues produits", analytics?.productViews || 0],
    ["Ajouts panier", analytics?.addToCart || 0],
    ["Checkouts", analytics?.checkouts || 0],
    ["Commandes", analytics?.orders || 0],
  ];
  const formatRevenue = (value) => `${Math.floor(Number(value || 0))} DT`;

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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-velora-dark">Statistiques marketing</h2>
            <p className="mt-1 text-sm text-velora-textGray">Données réelles reçues avec le consentement analytics.</p>
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-velora-textGray">
            Période
            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              className="h-10 rounded-lg border border-[#E7DED2] bg-white px-3 text-sm text-velora-dark outline-none focus:border-velora-gold"
            >
              <option value="7">7 derniers jours</option>
              <option value="30">30 derniers jours</option>
              <option value="all">Depuis le début</option>
            </select>
          </label>
        </div>

        {analyticsError && <p role="alert" className="mt-4 text-sm text-red-600">{analyticsError}</p>}
        {analyticsLoading && <p className="mt-4 text-sm text-velora-textGray">Chargement des statistiques…</p>}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Visiteurs", analytics?.visitors || 0],
            ["Pages vues", analytics?.pageViews || 0],
            ["Ajouts panier", analytics?.addToCart || 0],
            ["Commandes", analytics?.orders || 0],
            ["Checkouts", analytics?.checkouts || 0],
            ["Chiffre d'affaires", formatRevenue(analytics?.revenue)],
            ["Vues produits", analytics?.productViews || 0],
            ["Conversion", `${Number(analytics?.conversionRate || 0).toFixed(1)}%`],
          ].map(([label, value]) => (
            <div key={label} className="border border-[#E7DED2] p-3">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-velora-textGray">{label}</span>
              <strong className="mt-2 block text-lg text-velora-dark">{value}</strong>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-semibold text-velora-dark">D'où viennent les visiteurs ?</h3>
          <p className="mt-1 text-xs leading-5 text-velora-textGray">
            Facebook, Instagram, TikTok et les autres plateformes sont détectés par leur lien d’arrivée. Ajoute des paramètres UTM aux liens publicitaires pour distinguer chaque campagne.
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-[#E7DED2] text-velora-textGray">
                  <th className="px-3 py-2 font-semibold">Source / campagne</th>
                  <th className="px-3 py-2 font-semibold">Reel / contenu</th>
                  <th className="px-3 py-2 font-semibold">Visiteurs</th>
                  <th className="px-3 py-2 font-semibold">Pages vues</th>
                  <th className="px-3 py-2 font-semibold">Paniers</th>
                  <th className="px-3 py-2 font-semibold">Commandes</th>
                  <th className="px-3 py-2 font-semibold">Conversion</th>
                  <th className="px-3 py-2 font-semibold">CA</th>
                </tr>
              </thead>
              <tbody>
                {sourceRows.map((row) => {
                  const conversionRate = row.visitors ? (row.purchases / row.visitors) * 100 : 0;
                  return (
                    <tr key={`${row.source}:${row.medium}:${row.campaign}:${row.content}`} className="border-b border-[#F0E9E0] last:border-0">
                      <td className="px-3 py-3">
                        <span className="block font-semibold text-velora-dark">{row.source || "inconnu"}</span>
                        <span className="mt-1 block text-velora-textGray">
                          {row.medium || "(non défini)"} · {row.campaign && row.campaign !== "(not set)" ? row.campaign : "sans campagne UTM"}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-velora-dark">
                        {row.content && row.content !== "(not set)" ? row.content : "non identifié"}
                      </td>
                      <td className="px-3 py-3 text-velora-dark">{row.visitors}</td>
                      <td className="px-3 py-3 text-velora-dark">{row.pageViews}</td>
                      <td className="px-3 py-3 text-velora-dark">{row.addToCart}</td>
                      <td className="px-3 py-3 text-velora-dark">{row.purchases}</td>
                      <td className="px-3 py-3 text-velora-dark">{conversionRate.toFixed(1)}%</td>
                      <td className="px-3 py-3 text-velora-dark">{formatRevenue(row.revenue)}</td>
                    </tr>
                  );
                })}
                {!sourceRows.length && !analyticsLoading && (
                  <tr><td colSpan="8" className="px-3 py-6 text-center text-velora-textGray">Pas encore de données pour cette période.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11px] leading-5 text-velora-textGray">
            Chaque Reel doit avoir son propre utm_content, par exemple : ?utm_source=instagram&amp;utm_medium=social&amp;utm_campaign=promo&amp;utm_content=reel_01
          </p>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-semibold text-velora-dark">Parcours d'achat</h3>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {funnelSteps.map(([label, value]) => (
              <div key={label} className="border border-[#E7DED2] p-3">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-velora-textGray">{label}</span>
                <strong className="mt-2 block text-lg text-velora-dark">{value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-velora-dark">Produits les plus consultés</h3>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[440px] border-collapse text-left text-xs">
                <thead><tr className="border-b border-[#E7DED2] text-velora-textGray"><th className="px-3 py-2 font-semibold">Produit</th><th className="px-3 py-2 font-semibold">Vues</th><th className="px-3 py-2 font-semibold">Paniers</th><th className="px-3 py-2 font-semibold">Commandes</th><th className="px-3 py-2 font-semibold">CA</th></tr></thead>
                <tbody>
                  {productRows.map((product) => (
                    <tr key={product.productId || product.name} className="border-b border-[#F0E9E0] last:border-0">
                      <td className="px-3 py-3 font-medium text-velora-dark">{product.name || "Produit"}</td>
                      <td className="px-3 py-3 text-velora-dark">{product.views}</td>
                      <td className="px-3 py-3 text-velora-dark">{product.addToCart}</td>
                      <td className="px-3 py-3 text-velora-dark">{product.orders}</td>
                      <td className="px-3 py-3 text-velora-dark">{formatRevenue(product.revenue)}</td>
                    </tr>
                  ))}
                  {!productRows.length && !analyticsLoading && (
                    <tr><td colSpan="5" className="px-3 py-6 text-center text-velora-textGray">Pas encore de produits consultés.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-velora-dark">Pages d'entrée les plus fréquentes</h3>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[320px] border-collapse text-left text-xs">
                <thead><tr className="border-b border-[#E7DED2] text-velora-textGray"><th className="px-3 py-2 font-semibold">Page</th><th className="px-3 py-2 font-semibold">Sessions arrivées</th></tr></thead>
                <tbody>
                  {pageRows.map((page) => (
                    <tr key={page.path} className="border-b border-[#F0E9E0] last:border-0">
                      <td className="max-w-[200px] truncate px-3 py-3 font-medium text-velora-dark" title={page.path}>{page.path || "/"}</td>
                      <td className="px-3 py-3 text-velora-dark">{page.visits}</td>
                    </tr>
                  ))}
                  {!pageRows.length && !analyticsLoading && (
                    <tr><td colSpan="2" className="px-3 py-6 text-center text-velora-textGray">Pas encore de pages d'entrée enregistrées.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
