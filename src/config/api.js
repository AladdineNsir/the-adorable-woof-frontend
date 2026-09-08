export const API_BASE_URL =
  import.meta.env.PROD
    ? "/api"
    : import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const SERVER_URL =
  API_BASE_URL.replace(/\/api\/?$/, "");

export const authHeaders = () => ({
  withCredentials: true,
});

/* =========================================
   CLOUDINARY IMAGE OPTIMIZATION
========================================= */

export const optimizeCloudinaryUrl = (
  src,
  width = "auto"
) => {
  if (!src) return "";

  // Pas une image Cloudinary
  if (
    !src.includes("res.cloudinary.com") ||
    !src.includes("/image/upload/")
  ) {
    return src;
  }

  if (src.includes("f_auto") && src.includes("q_auto") && /(?:^|,)w_[^,/]*/.test(src)) {
    return src;
  }

  const transformation = `f_auto,q_auto,w_${width}`;

  return src.replace(
    "/image/upload/",
    `/image/upload/${transformation}/`
  );
};

/* =========================================
   RESOLVE ASSET URL
========================================= */

export const resolveAssetUrl = (
  src,
  width = "auto"
) => {
  if (!src || typeof src !== "string") return "";

  if (src.includes("res.cloudinary.com")) {
    return optimizeCloudinaryUrl(src, width);
  }

  if (src.startsWith("http")) {
    return src;
  }

  if (src.startsWith("/assets/")) {
    return src;
  }

  return `${SERVER_URL}${src}`;
};

export const buildResponsiveImageSet = (src, widths = [360, 768, 1200], format = "auto") => {
  if (!src || typeof src !== "string") {
    return { src: "", srcSet: "", sizes: "(max-width: 640px) 100vw, 50vw" };
  }

  if (src.includes("res.cloudinary.com")) {
    const srcSet = widths
      .map((width) => `${optimizeCloudinaryUrl(src, width).replace(/q_auto/, `${format},q_auto`)} ${width}w`)
      .join(", ");

    return {
      src: optimizeCloudinaryUrl(src, 768),
      srcSet,
      sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
    };
  }

  return {
    src,
    srcSet: "",
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  };
};