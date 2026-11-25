import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import {
  captureAttribution,
  configureAnalytics,
  getStoredConsent,
  loadAnalyticsVendors,
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

  return children;
}
