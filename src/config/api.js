export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export const SERVER_URL =
  API_BASE_URL.replace(/\/api\/?$/, "");

export const authHeaders = () => {
  const token = localStorage.getItem("token");

  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
};

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

  // Image Cloudinary
  if (src.includes("res.cloudinary.com")) {
    return optimizeCloudinaryUrl(
      src,
      width
    );
  }

  // Image externe classique
  if (src.startsWith("http")) {
    return src;
  }

  // Assets publics du frontend
  if (src.startsWith("/assets/")) {
    return src;
  }

  // Anciennes images locales /uploads
  return `${SERVER_URL}${src}`;
};