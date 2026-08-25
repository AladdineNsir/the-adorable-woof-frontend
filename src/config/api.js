  export const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  export const SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, "");

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

  export const resolveAssetUrl = (src) => {
    if (!src) return "";
    return src.startsWith("http") ? src : `${SERVER_URL}${src}`;
  };
