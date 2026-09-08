import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const siteName = "The Adorable Woof";
const defaultDescription =
  "Découvrez les accessoires premium pour chiens et chats de The Adorable Woof, une marque tunisienne pensée pour le confort et le style de vos compagnons.";

const pageMetadata = {
  "/": {
    title: "Accessoires premium pour chiens et chats | The Adorable Woof",
    description: defaultDescription,
  },
  "/shop": {
    title: "Boutique d'accessoires pour chiens et chats | The Adorable Woof",
    description:
      "Harnais, colliers et laisses élégants pour chiens et chats. Livraison partout en Tunisie.",
  },
  "/about": {
    title: "Notre histoire | The Adorable Woof",
    description:
      "Découvrez l'histoire de The Adorable Woof, une marque tunisienne qui crée des accessoires beaux, confortables et durables pour vos compagnons.",
  },
  "/contact": {
    title: "Contactez-nous | The Adorable Woof",
    description:
      "Une question sur nos accessoires ou votre commande ? Contactez l'équipe The Adorable Woof en Tunisie.",
  },
  "/faq": {
    title: "Questions fréquentes | The Adorable Woof",
    description:
      "Retrouvez les réponses sur la livraison, les commandes et les retours The Adorable Woof.",
  },
  "/size-guide": {
    title: "Guide des tailles | The Adorable Woof",
    description:
      "Trouvez la taille idéale pour le harnais, le collier ou les accessoires de votre compagnon.",
  },
};

const noIndexPrefixes = ["/account", "/admin", "/login", "/register", "/cart", "/order-success"];

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function setJsonLd(id, value) {
  let element = document.head.querySelector(`script[data-seo="${id}"]`);
  if (!element) {
    element = document.createElement("script");
    element.type = "application/ld+json";
    element.dataset.seo = id;
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(value);
}

export default function SEO({ title, description, image, type = "website", structuredData }) {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if ((path.startsWith("/product/") || path.startsWith("/produit/")) && !title) return;

    const metadata = pageMetadata[path] || {};
    const finalTitle = title || metadata.title || `${siteName} | Accessoires pour animaux`;
    const finalDescription = description || metadata.description || defaultDescription;
    const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
    const canonicalUrl = `${siteUrl.replace(/\/$/, "")}${path}`;
    const shouldNoIndex = noIndexPrefixes.some((prefix) => path.startsWith(prefix));
    const imageUrl = image || `${siteUrl.replace(/\/$/, "")}/assets/logoOS-favicon.png`;

    document.title = finalTitle;
    setMeta("name", "description", finalDescription);
    setMeta("name", "robots", shouldNoIndex ? "noindex, nofollow" : "index, follow");
    setMeta("property", "og:title", finalTitle);
    setMeta("property", "og:description", finalDescription);
    setMeta("property", "og:type", type);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:image", imageUrl);
    setMeta("property", "og:site_name", siteName);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", finalTitle);
    setMeta("name", "twitter:description", finalDescription);
    setMeta("name", "twitter:image", imageUrl);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    setJsonLd("identity", {
      "@context": "https://schema.org",
      "@type": ["Organization", "Brand"],
      name: siteName,
      url: siteUrl,
      logo: imageUrl,
      description: defaultDescription,
      areaServed: "TN",
      address: {
        "@type": "PostalAddress",
        addressCountry: "TN",
      },
    });
    setJsonLd("page", structuredData || {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteName,
      url: siteUrl,
      inLanguage: "fr-TN",
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/shop?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    });
  }, [description, image, location.pathname, structuredData, title, type]);

  return null;
}

export { defaultDescription, siteName };
