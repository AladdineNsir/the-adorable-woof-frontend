import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getStoredConsent, openCookieSettings, setStoredConsent } from "../analytics/analytics";

const emptyChoices = { analytics: false, marketing: false };

export default function CookieConsent() {
  const location = useLocation();
  const [consent, setConsent] = useState(getStoredConsent);
  const [customizing, setCustomizing] = useState(false);
  const [choices, setChoices] = useState(() => {
    const stored = getStoredConsent();
    return stored
      ? { analytics: stored.analytics, marketing: stored.marketing }
      : emptyChoices;
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const syncConsent = () => {
      const stored = getStoredConsent();
      setConsent(stored);
      if (stored) {
        setChoices({ analytics: stored.analytics, marketing: stored.marketing });
      }
    };
    const openSettings = () => {
      const stored = getStoredConsent();
      setChoices(stored
        ? { analytics: stored.analytics, marketing: stored.marketing }
        : emptyChoices);
      setCustomizing(true);
      setError("");
    };

    window.addEventListener("velora-consent-updated", syncConsent);
    window.addEventListener("velora-open-cookie-settings", openSettings);
    return () => {
      window.removeEventListener("velora-consent-updated", syncConsent);
      window.removeEventListener("velora-open-cookie-settings", openSettings);
    };
  }, []);

  const saveChoices = (nextChoices) => {
    try {
      setStoredConsent(nextChoices);
      setCustomizing(false);
      setError("");
    } catch {
      setError("Impossible d’enregistrer vos préférences. Vérifiez les paramètres de stockage de votre navigateur.");
    }
  };

  const acceptAll = () => saveChoices({ analytics: true, marketing: true });
  const rejectOptional = () => saveChoices(emptyChoices);
  const isAdmin = location.pathname.startsWith("/admin");
  const isVisible = !isAdmin && (!consent || customizing);

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Préférences de cookies"
      className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-4"
      data-testid="cookie-consent"
    >
      <div className="mx-auto max-w-3xl rounded-xl border border-[#E7DED2] bg-[#FFFDF9] p-4 shadow-[0_12px_40px_rgba(27,24,20,0.16)] sm:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-lg">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#C96A26]">
              The aDoraBle Woof Co.
            </p>
            <h1 className="mt-1 font-premium text-lg font-semibold text-[#241A14]">
              Votre confidentialité compte
            </h1>
            <p className="mt-1 text-xs leading-5 text-[#665B51]">
              Les cookies essentiels assurent le fonctionnement du site. Les cookies facultatifs nécessitent votre accord.
            </p>
          </div>

          {!customizing && (
            <div className="grid shrink-0 gap-2 sm:grid-cols-2 md:min-w-[250px]">
              <button
                type="button"
                onClick={acceptAll}
                className="min-h-10 rounded-lg bg-[#C96A26] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#A94F1D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96A26] focus-visible:ring-offset-2"
              >
                Accepter
              </button>
              <button
                type="button"
                onClick={rejectOptional}
                className="min-h-10 rounded-lg border border-[#D8C8B8] bg-white px-3 py-2 text-xs font-semibold text-[#493B30] transition hover:bg-[#F7F3EC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96A26] focus-visible:ring-offset-2"
              >
                Refuser
              </button>
            </div>
          )}
        </div>

        {customizing && (
          <div className="mt-5 border-t border-[#E7DED2] pt-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[#E7DED2] bg-[#F7F3EC] p-3">
                <p className="text-sm font-semibold text-[#35291F]">Cookies nécessaires</p>
                <p className="mt-1 text-xs leading-5 text-[#665B51]">Toujours actifs pour assurer les fonctions essentielles.</p>
                <span className="mt-2 inline-block text-xs font-semibold text-[#8A6A4D]">Toujours actifs</span>
              </div>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E7DED2] bg-white p-3">
                <input
                  type="checkbox"
                  checked={choices.analytics}
                  onChange={(event) => setChoices((current) => ({ ...current, analytics: event.target.checked }))}
                  className="mt-0.5 h-4 w-4 accent-[#C96A26]"
                />
                <span>
                  <span className="block text-sm font-semibold text-[#35291F]">Mesure d’audience</span>
                  <span className="mt-1 block text-xs leading-5 text-[#665B51]">Google Analytics aide à comprendre l’utilisation du site.</span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E7DED2] bg-white p-3">
                <input
                  type="checkbox"
                  checked={choices.marketing}
                  onChange={(event) => setChoices((current) => ({ ...current, marketing: event.target.checked }))}
                  className="mt-0.5 h-4 w-4 accent-[#C96A26]"
                />
                <span>
                  <span className="block text-sm font-semibold text-[#35291F]">Marketing</span>
                  <span className="mt-1 block text-xs leading-5 text-[#665B51]">Meta Pixel mesure les campagnes et interactions publicitaires.</span>
                </span>
              </label>
            </div>

            {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}

            <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              {consent && (
                <button
                  type="button"
                  onClick={() => setCustomizing(false)}
                  className="min-h-11 rounded-lg px-4 py-2 text-sm font-semibold text-[#665B51] transition hover:bg-[#F7F3EC]"
                >
                  Annuler
                </button>
              )}
              <button
                type="button"
                onClick={rejectOptional}
                className="min-h-11 rounded-lg border border-[#D8C8B8] bg-white px-4 py-2 text-sm font-semibold text-[#493B30] transition hover:bg-[#F7F3EC]"
              >
                Tout refuser
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="min-h-11 rounded-lg border border-[#C96A26] bg-[#FFF7EF] px-4 py-2 text-sm font-semibold text-[#A94F1D] transition hover:bg-[#FCE9D9]"
              >
                Accepter tout
              </button>
              <button
                type="button"
                onClick={() => saveChoices(choices)}
                className="min-h-11 rounded-lg bg-[#C96A26] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#A94F1D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96A26] focus-visible:ring-offset-2"
              >
                Enregistrer mes choix
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
