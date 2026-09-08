import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import {
  captureAttribution,
  configureAnalytics,
  getStoredConsent,
  loadAnalyticsVendors,
  setStoredConsent,
  trackPageView,
} from "./analytics";

export default function AnalyticsProvider({ children }) {
  const location = useLocation();
  const [consent, setConsent] = useState(getStoredConsent());
  const [configLoaded, setConfigLoaded] = useState(false);
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    captureAttribution();
    const loadConfig = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/tracking/config`);
        configureAnalytics(await response.json());
      } catch {
        configureAnalytics({ enabled: false });
      } finally {
        setConfigLoaded(true);
      }
    };
    loadConfig();

    const handleConsent = () => setConsent(getStoredConsent());
    window.addEventListener("velora-consent-updated", handleConsent);
    return () => window.removeEventListener("velora-consent-updated", handleConsent);
  }, []);

  useEffect(() => {
    if (isAdmin || !configLoaded || consent !== "granted") return;
    loadAnalyticsVendors();
    trackPageView(location.pathname);
  }, [configLoaded, consent, isAdmin, location.pathname]);

  return (
    <>
      {children}
      {configLoaded && consent === null && !isAdmin && (
        <div className="fixed inset-x-4 bottom-4 z-[100] mx-auto flex max-w-2xl flex-col gap-3 rounded-xl border border-[#E7DED2] bg-white p-4 shadow-[0_15px_45px_rgba(17,17,17,0.16)] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-velora-textGray">Nous utilisons des outils de mesure anonymisés pour améliorer votre expérience.</p>
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={() => setStoredConsent("denied")} className="rounded-lg border border-[#E7DED2] px-3 py-2 text-xs font-semibold text-velora-dark">Refuser</button>
            <button type="button" onClick={() => setStoredConsent("granted")} className="rounded-lg bg-velora-gold px-3 py-2 text-xs font-semibold text-white">Accepter</button>
          </div>
        </div>
      )}
    </>
  );
}
