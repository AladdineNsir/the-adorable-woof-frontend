import { API_BASE_URL } from "../config/api";

const CONSENT_KEY = "velora_analytics_consent";
const SESSION_KEY = "velora_tracking_session";
const ATTRIBUTION_KEY = "velora_tracking_attribution";
const CONSENT_VERSION = 1;

const readStoredConsent = () => {
  if (typeof window === "undefined") return null;

  try {
    const stored = JSON.parse(localStorage.getItem(CONSENT_KEY) || "null");
    if (
      stored?.version !== CONSENT_VERSION ||
      typeof stored.analytics !== "boolean" ||
      typeof stored.marketing !== "boolean"
    ) {
      return null;
    }

    return {
      version: CONSENT_VERSION,
      necessary: true,
      analytics: stored.analytics,
      marketing: stored.marketing,
    };
  } catch {
    return null;
  }
};

let runtime = {
  config: null,
  consent: readStoredConsent(),
};
const pendingEvents = [];

const hasAnalyticsConsent = () => runtime.consent?.analytics === true;
const hasMarketingConsent = () => runtime.consent?.marketing === true;
const hasAnyTrackingConsent = () => hasAnalyticsConsent() || hasMarketingConsent();

const getSessionId = () => {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

export const getStoredConsent = () => runtime.consent;
export const setStoredConsent = (choices) => {
  const consent = {
    version: CONSENT_VERSION,
    necessary: true,
    analytics: choices?.analytics === true,
    marketing: choices?.marketing === true,
  };

  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  runtime.consent = consent;

  if (!consent.analytics) {
    localStorage.removeItem(ATTRIBUTION_KEY);
  }

  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: consent.analytics ? "granted" : "denied",
      ad_storage: consent.marketing ? "granted" : "denied",
      ad_user_data: consent.marketing ? "granted" : "denied",
      ad_personalization: consent.marketing ? "granted" : "denied",
    });
  }

  if (typeof window.fbq === "function") {
    window.fbq("consent", consent.marketing ? "grant" : "revoke");
  }

  window.dispatchEvent(new Event("velora-consent-updated"));
  return consent;
};

export const openCookieSettings = () => {
  window.dispatchEvent(new Event("velora-open-cookie-settings"));
};

export const captureAttribution = () => {
  if (!hasAnalyticsConsent()) return;

  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source")?.trim();
  const utmMedium = params.get("utm_medium")?.trim();
  const hasUtmData = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
    .some((key) => params.get(key)?.trim());
  const normalizeSource = (value) => {
    const source = value.toLowerCase().replace(/^www\./, "").replace(/\.com$/, "");
    const aliases = {
      fb: "facebook",
      facebook: "facebook",
      ig: "instagram",
      insta: "instagram",
      instagram: "instagram",
      tt: "tiktok",
      tiktok: "tiktok",
      twitter: "x",
      "twitter.com": "x",
    };
    return aliases[source] || source;
  };

  let source = utmSource ? normalizeSource(utmSource) : hasUtmData ? "(not set)" : "direct";
  let medium = utmMedium || (hasUtmData ? "(not set)" : "none");

  if (!hasUtmData && document.referrer) {
    try {
      const referrer = new URL(document.referrer);
      const host = referrer.hostname.toLowerCase().replace(/^www\./, "");
      if (host !== window.location.hostname.toLowerCase()) {
        const referrals = [
          { source: "facebook", domains: ["facebook.com", "fb.com"] },
          { source: "instagram", domains: ["instagram.com"] },
          { source: "tiktok", domains: ["tiktok.com"] },
          { source: "youtube", domains: ["youtube.com", "youtu.be"] },
          { source: "pinterest", domains: ["pinterest.com"] },
          { source: "snapchat", domains: ["snapchat.com"] },
          { source: "x", domains: ["x.com", "twitter.com"] },
          { source: "whatsapp", domains: ["whatsapp.com", "wa.me"] },
        ];
        const referral = referrals.find(({ domains }) =>
          domains.some((domain) => host === domain || host.endsWith(`.${domain}`))
        );
        const searchEngines = [
          { source: "google", domains: ["google."] },
          { source: "bing", domains: ["bing."] },
          { source: "yahoo", domains: ["yahoo."] },
          { source: "duckduckgo", domains: ["duckduckgo.com"] },
          { source: "yandex", domains: ["yandex."] },
        ];
        const searchEngine = searchEngines.find(({ domains }) =>
          domains.some((domain) => host.includes(domain))
        );

        if (referral) {
          source = referral.source;
          medium = "social";
        } else if (searchEngine) {
          source = searchEngine.source;
          medium = "organic";
        } else {
          source = host;
          medium = "referral";
        }
      }
    } catch {
      // Ignore malformed referrer URLs and keep the UTM or direct attribution.
    }
  }

  const hasExternalReferrer = medium === "social" || medium === "organic" || medium === "referral";
  if (hasUtmData || hasExternalReferrer) {
    localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify({
      source,
      medium,
      campaign: params.get("utm_campaign") || "(not set)",
      content: params.get("utm_content") || "(not set)",
      term: params.get("utm_term") || "(not set)",
    }));
  }
};

const getAttribution = () => {
  if (!hasAnalyticsConsent()) {
    return { source: "direct", medium: "none", campaign: "(not set)", content: "(not set)", term: "(not set)" };
  }

  try {
    const stored = JSON.parse(localStorage.getItem(ATTRIBUTION_KEY) || "{}");
    return {
      source: stored.source || stored.utm_source || "direct",
      medium: stored.medium || stored.utm_medium || "none",
      campaign: stored.campaign || stored.utm_campaign || "(not set)",
      content: stored.content || stored.utm_content || "(not set)",
      term: stored.term || stored.utm_term || "(not set)",
    };
  } catch {
    return { source: "direct", medium: "none", campaign: "(not set)", content: "(not set)", term: "(not set)" };
  }
};

export const getTrackingAttribution = () => getAttribution();

const itemFromProduct = (product, quantity = 1) => ({
  itemId: String(product?.id || product?._id || product?.product || ""),
  itemName: product?.name || "Produit",
  price: Number(product?.price || 0),
  quantity: Number(quantity || 1),
  itemCategory: typeof product?.category === "object" ? product.category.name : product?.category || "",
});

const itemFromCart = (item) => itemFromProduct({ ...item, id: item.product }, item.quantity);

const sendToBackend = (eventName, payload = {}) => {
  if (!runtime.config?.enabled || !hasAnalyticsConsent()) return;
  void fetch(`${API_BASE_URL}/tracking/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventName,
      eventKey: `${eventName}:${getSessionId()}:${window.location.pathname}:${Date.now()}`,
      sessionId: getSessionId(),
      pagePath: window.location.pathname,
      attribution: getAttribution(),
      ...payload,
    }),
    keepalive: true,
  }).catch(() => {});
};

const sendToVendors = (eventName, payload = {}) => {
  if (!runtime.config?.enabled) return false;
  let sent = false;

  if (hasAnalyticsConsent() && runtime.config.googleAnalyticsId && typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
    sent = true;
  }

  if (hasMarketingConsent() && runtime.config.metaPixelId && typeof window.fbq === "function") {
    const metaEvent = {
      view_item: "ViewContent",
      add_to_cart: "AddToCart",
      begin_checkout: "InitiateCheckout",
      purchase: "Purchase",
      page_view: "PageView",
    }[eventName];
    if (metaEvent) {
      window.fbq("track", metaEvent, payload);
      sent = true;
    }
  }

  return sent;
};

export const configureAnalytics = (config) => {
  runtime.config = config;
  if (config.googleSiteVerification) {
    let meta = document.head.querySelector('meta[name="google-site-verification"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "google-site-verification";
      document.head.appendChild(meta);
    }
    meta.content = config.googleSiteVerification;
  }
};

export const loadAnalyticsVendors = () => {
  if (!runtime.config?.enabled || !hasAnyTrackingConsent()) return;

  if (hasAnalyticsConsent() && runtime.config.googleAnalyticsId) {
    if (!document.querySelector("script[data-velora-ga4]")) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = (...args) => window.dataLayer.push(args);
      window.gtag("consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
      window.gtag("js", new Date());
      window.gtag("config", runtime.config.googleAnalyticsId, { send_page_view: false });
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(runtime.config.googleAnalyticsId)}`;
      script.dataset.veloraGa4 = "true";
      document.head.appendChild(script);
    }

    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: hasMarketingConsent() ? "granted" : "denied",
        ad_user_data: hasMarketingConsent() ? "granted" : "denied",
        ad_personalization: hasMarketingConsent() ? "granted" : "denied",
      });
    }
  }

  if (hasMarketingConsent() && runtime.config.metaPixelId) {
    if (!document.querySelector("script[data-velora-pixel]")) {
      window.fbq = window.fbq || ((...args) => (window.fbq.queue = window.fbq.queue || []).push(args));
      window.fbq("init", runtime.config.metaPixelId);
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      script.dataset.veloraPixel = "true";
      document.head.appendChild(script);
    }

    if (typeof window.fbq === "function") {
      window.fbq("consent", "grant");
    }
  }

  if (hasAnyTrackingConsent()) {
    while (pendingEvents.length) {
      const pending = pendingEvents.shift();
      trackEvent(pending.eventName, pending.payload, pending.vendorPayload);
    }
  }
};

export const trackEvent = (eventName, payload = {}, vendorPayload = payload) => {
  if (!runtime.config) {
    if (hasAnyTrackingConsent()) {
      pendingEvents.push({ eventName, payload, vendorPayload });
    }
    return;
  }
  sendToVendors(eventName, vendorPayload);
  sendToBackend(eventName, payload);
};

export const trackPageView = (path) => {
  const key = `velora_page_view:${path}`;
  const lastSent = Number(sessionStorage.getItem(key) || 0);
  if (Date.now() - lastSent < 1000) return;
  sessionStorage.setItem(key, String(Date.now()));
  trackEvent("page_view", { pagePath: path }, { page_path: path });
};
export const trackViewItem = (product) => {
  const item = itemFromProduct(product);
  const key = `velora_view_item:${item.itemId}`;
  const lastSent = Number(sessionStorage.getItem(key) || 0);
  if (Date.now() - lastSent < 1000) return;
  sessionStorage.setItem(key, String(Date.now()));
  trackEvent("view_item", { value: item.price, currency: "TND", items: [item] }, { currency: "TND", value: item.price, items: [item] });
};
export const trackSelectItem = (product) => trackEvent("select_item", { items: [itemFromProduct(product)] });
export const trackViewCart = (cart) => trackEvent("view_cart", { value: cart.reduce((sum, item) => sum + item.price * item.quantity, 0), currency: "TND", items: cart.map(itemFromCart) });
export const trackAddToCart = (product, quantity) => {
  const item = itemFromProduct(product, quantity);
  trackEvent("add_to_cart", { value: item.price * item.quantity, currency: "TND", items: [item] }, { value: item.price * item.quantity, currency: "TND", content_ids: [item.itemId], content_type: "product", contents: [{ id: item.itemId, quantity: item.quantity }] });
};
export const trackRemoveFromCart = (item) => trackEvent("remove_from_cart", { value: item.price * item.quantity, currency: "TND", items: [itemFromCart(item)] });
export const trackBeginCheckout = (cart, value) => trackEvent("begin_checkout", { value, currency: "TND", items: cart.map(itemFromCart) }, { value, currency: "TND", content_ids: cart.map((item) => String(item.product)), content_type: "product", num_items: cart.reduce((sum, item) => sum + item.quantity, 0) });
export const trackAddShippingInfo = (cart, value) => trackEvent("add_shipping_info", { value, currency: "TND", items: cart.map(itemFromCart) });
export const trackAddPaymentInfo = (cart, value) => trackEvent("add_payment_info", { value, currency: "TND", items: cart.map(itemFromCart) });
export const trackClick = (eventName, payload = {}) => trackEvent(eventName, payload);

export const trackPurchase = (order) => {
  const transactionId = order?.orderNumber;
  if (!transactionId || localStorage.getItem(`velora_purchase_sent:${transactionId}`)) return false;
  if (!runtime.config?.enabled || !hasAnyTrackingConsent()) return false;

  const items = (order.orderItems || []).map(itemFromCart);
  const sent = sendToVendors("purchase", { transaction_id: transactionId, value: Number(order.totalPrice || 0), currency: "TND", items, content_ids: items.map((item) => item.itemId), content_type: "product", contents: items.map((item) => ({ id: item.itemId, quantity: item.quantity })) });
  if (sent) {
    localStorage.setItem(`velora_purchase_sent:${transactionId}`, "1");
  }
  return sent;
};

export { itemFromCart };
