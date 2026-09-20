import { createContext, useContext, useEffect, useRef, useState } from "react";

import { getSiteSettings, updateSiteSettings } from "../services/settingsApi";

export const defaultSiteSettings = {
  theme: {
    primary: "#C96A26",
    primaryHover: "#B4571D",
    cream: "#F8F5EF",
    dark: "#1F1713",
    textGray: "#7B675D",
    border: "#E7DED2",
  },
  home: {
    heroImage: "/assets/d1.png",
    constructionImage: "/assets/pp.png",
    featuredPack: "",
    collections: {
      harnais: "/assets/chien-harnais.png",
      colliers: "/assets/chien-collier.png",
      laisses: "/assets/chien-laisse.png",
    },
  },
  about: {
    image: "/assets/about-velora.png",
  },
};

const SiteSettingsContext = createContext(null);

function mergeSettings(savedSettings) {
  return {
    ...defaultSiteSettings,
    ...savedSettings,
    theme: { ...defaultSiteSettings.theme, ...savedSettings?.theme },
    home: {
      ...defaultSiteSettings.home,
      ...savedSettings?.home,
      collections: {
        ...defaultSiteSettings.home.collections,
        ...savedSettings?.home?.collections,
      },
    },
    about: { ...defaultSiteSettings.about, ...savedSettings?.about },
  };
}

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSiteSettings);
  const saveTimerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    getSiteSettings()
      .then((serverSettings) => {
        if (isMounted) setSettings(mergeSettings(serverSettings));
      })
      .catch((error) => {
        console.error("Impossible de charger les paramètres du site", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(settings.theme).forEach(([name, value]) => {
      root.style.setProperty(`--velora-${name}`, value);
    });
  }, [settings]);

  useEffect(() => () => clearTimeout(saveTimerRef.current), []);

  const queueSave = (nextSettings) => {
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      updateSiteSettings(nextSettings).catch((error) => {
        console.error("Impossible d'enregistrer les paramètres du site", error);
      });
    }, 350);
  };

  const updateSettings = (updates) => {
    const nextSettings = mergeSettings({
      ...settings,
      ...updates,
      theme: { ...settings.theme, ...updates.theme },
      home: {
        ...settings.home,
        ...updates.home,
        collections: {
          ...settings.home.collections,
          ...updates.home?.collections,
        },
      },
      about: { ...settings.about, ...updates.about },
    });

    setSettings(nextSettings);
    queueSave(nextSettings);
  };

  const resetSettings = () => {
    const nextSettings = mergeSettings(defaultSiteSettings);
    setSettings(nextSettings);
    queueSave(nextSettings);
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error("useSiteSettings must be used inside SiteSettingsProvider");
  }
  return context;
}
