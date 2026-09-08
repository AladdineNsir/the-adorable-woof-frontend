import { API_BASE_URL } from "../config/api";

const CONSENT_KEY = "velora_analytics_consent";
const SESSION_KEY = "velora_tracking_session";
const ATTRIBUTION_KEY = "velora_tracking_attribution";

let runtime = {
  config: null,
  consent: typeof window !== "undefined" ? localStorage.getItem(CONSENT_KEY) : null,
};
const pendingEvents = [];

const getSessionId = () => {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

export const getStoredConsent = () => runtime.consent;
export const setStoredConsent = (value) => {
  runtime.consent = value;
  localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new Event("velora-consent-updated"));
};

export const captureAttribution = () => {
  const params = new URLSearchParams(window.location.search);
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const current = Object.fromEntries(keys.map((key) => [key, params.get(key)]).filter(([, value]) => value));
  if (Object.keys(current).length) localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(current));
};

const getAttribution = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(ATTRIBUTION_KEY) || "{}");
    return {
      source: stored.utm_source || "direct",
      medium: stored.utm_medium || "none",
      campaign: stored.utm_campaign || "(not set)",
      content: stored.utm_content || "(not set)",
      term: stored.utm_term || "(not set)",
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
  if (!runtime.config?.enabled || runtime.consent !== "granted") return;
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
  if (!runtime.config?.enabled || runtime.consent !== "granted") return;

  if (runtime.config.googleAnalyticsId && typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
  }

  if (runtime.config.metaPixelId && typeof window.fbq === "function") {
    const metaEvent = {
      view_item: "ViewContent",
      add_to_cart: "AddToCart",
      begin_checkout: "InitiateCheckout",
      purchase: "Purchase",
      page_view: "PageView",
    }[eventName];
    if (metaEvent) window.fbq("track", metaEvent, payload);
  }
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
  if (runtime.consent === "granted") {
    while (pendingEvents.length) {
      const pending = pendingEvents.shift();
      trackEvent(pending.eventName, pending.payload, pending.vendorPayload);
    }
  }
};

export const loadAnalyticsVendors = () => {
  if (!runtime.config?.enabled || runtime.consent !== "granted") return;

  if (runtime.config.googleAnalyticsId && !document.querySelector("script[data-velora-ga4]")) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args) => window.dataLayer.push(args);
    window.gtag("js", new Date());
    window.gtag("config", runtime.config.googleAnalyticsId, { send_page_view: false });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(runtime.config.googleAnalyticsId)}`;
    script.dataset.veloraGa4 = "true";
    document.head.appendChild(script);
  }

  if (runtime.config.metaPixelId && !document.querySelector("script[data-velora-pixel]")) {
    window.fbq = window.fbq || ((...args) => (window.fbq.queue = window.fbq.queue || []).push(args));
    window.fbq("init", runtime.config.metaPixelId);
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    script.dataset.veloraPixel = "true";
    document.head.appendChild(script);
  }
};

export const trackEvent = (eventName, payload = {}, vendorPayload = payload) => {
  if (!runtime.config) {
    if (runtime.consent === "granted") {
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
  localStorage.setItem(`velora_purchase_sent:${transactionId}`, "1");
  const items = (order.orderItems || []).map(itemFromCart);
  sendToVendors("purchase", { transaction_id: transactionId, value: Number(order.totalPrice || 0), currency: "TND", items, content_ids: items.map((item) => item.itemId), content_type: "product", contents: items.map((item) => ({ id: item.itemId, quantity: item.quantity })) });
  return true;
};

export { itemFromCart };
