import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "velora_site_settings";

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
  const [settings, setSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      return savedSettings ? mergeSettings(JSON.parse(savedSettings)) : defaultSiteSettings;
    } catch {
      return defaultSiteSettings;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(settings.theme).forEach(([name, value]) => {
      root.style.setProperty(`--velora-${name}`, value);
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (updates) => {
    setSettings((currentSettings) =>
      mergeSettings({
        ...currentSettings,
        ...updates,
        theme: { ...currentSettings.theme, ...updates.theme },
        home: {
          ...currentSettings.home,
          ...updates.home,
          collections: {
            ...currentSettings.home.collections,
            ...updates.home?.collections,
          },
        },
        about: { ...currentSettings.about, ...updates.about },
      })
    );
  };

  const resetSettings = () => setSettings(defaultSiteSettings);

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
