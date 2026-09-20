const routeLoaders = {
  "/": () => import("../pages/Home"),
  "/shop": () => import("../pages/Shop"),
  "/size-guide": () => import("../pages/SizeGuide"),
  "/about": () => import("../pages/About"),
  "/contact": () => import("../pages/Contact"),
  "/faq": () => import("../pages/FAQ"),
  "/cart": () => import("../pages/Cart"),
  "/login": () => import("../pages/Login"),
  "/register": () => import("../pages/Register"),
};

const loadedRoutes = new Map();

export const loadRoute = (path) => {
  const basePath = path.split("?")[0];
  const loader = routeLoaders[basePath];
  if (!loader) return null;

  if (!loadedRoutes.has(basePath)) {
    loadedRoutes.set(
      basePath,
      loader().catch((error) => {
        loadedRoutes.delete(basePath);
        throw error;
      })
    );
  }

  return loadedRoutes.get(basePath);
};

export const prefetchRoute = (path) => {
  const promise = loadRoute(path);
  if (promise) promise.catch(() => {});
};
