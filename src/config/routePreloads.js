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

export const prefetchRoute = (path) => {
  const basePath = path.split("?")[0];
  const loader = routeLoaders[basePath];
  if (!loader) return;

  if (!loadedRoutes.has(basePath)) {
    loadedRoutes.set(basePath, loader());
  }
};
