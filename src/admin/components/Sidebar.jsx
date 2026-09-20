import {
  ArrowLeft,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Tags,
  Users,
  X,
  BarChart3,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { useAuth } from "../../context/AuthContext";

const menu = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { title: "Produits", icon: Package, path: "/admin/products" },
  { title: "Packs", icon: Package, path: "/admin/packs" },
  { title: "Catégories", icon: Tags, path: "/admin/categories" },
  { title: "Sous-catégories", icon: FolderTree, path: "/admin/subcategories" },
  { title: "Commandes", icon: ShoppingCart, path: "/admin/orders" },
  { title: "Clients", icon: Users, path: "/admin/clients" },
  { title: "Paramètres", icon: Settings, path: "/admin/settings" },
  { title: "Tracking", icon: BarChart3, path: "/admin/tracking" },
];

export default function Sidebar({
  sidebarOpen = false,
  setSidebarOpen = () => {},
  collapsed = false,
}) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [sidebarOpen, setSidebarOpen]);

  const isDesktopCollapsed = !sidebarOpen && collapsed;

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex max-w-[calc(100vw-1rem)] flex-col overflow-hidden border-r border-[#E7DED2] bg-white shadow-[4px_0_20px_rgba(17,17,17,0.025)] transition-[width,transform] duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0 w-[280px]" : "-translate-x-full lg:translate-x-0",
          !sidebarOpen && collapsed ? "lg:w-[72px]" : "",
          !sidebarOpen && !collapsed ? "lg:w-[280px]" : "",
          "lg:translate-x-0",
        ].join(" ")}
      >
        <div
          className={[
            "flex h-[68px] shrink-0 items-center border-b border-[#E7DED2] px-4 transition-all duration-300 ease-in-out",
            isDesktopCollapsed ? "justify-center px-2" : "justify-center",
          ].join(" ")}
        >
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className={[
              "flex w-full items-center justify-center transition-all duration-300 ease-in-out",
              isDesktopCollapsed ? "h-[40px]" : "h-[44px]",
            ].join(" ")}
            title="Retour à l'accueil"
          >
            {collapsed ? (
              <img
                src="/assets/logoOs.png"
                alt="The aDoraBle woof co."
                className="h-8 w-8 object-contain transition-all duration-300 ease-in-out"
              />
            ) : (
              <img
                src="/assets/1.png"
                alt="The aDoraBle woof co."
                className="h-10 w-full max-w-[220px] object-contain transition-all duration-300 ease-in-out"
              />
            )}
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-velora-textGray transition-colors hover:bg-[#FCFAF7] hover:text-velora-dark lg:hidden"
            aria-label="Fermer le menu"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        <nav className="mt-7 flex-1 space-y-1 px-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const isCollapsedDesktop = !sidebarOpen && collapsed;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                onClick={() => setSidebarOpen(false)}
                title={isCollapsedDesktop ? item.title : undefined}
                className={({ isActive }) =>
                  [
                    "group flex h-11 items-center rounded-xl border text-sm font-medium transition-all duration-200",
                    isCollapsedDesktop ? "justify-center px-0" : "gap-3 px-3.5",
                    isActive
                      ? "border-[#F1DDC7] bg-[#FFF7EE] text-velora-gold"
                      : "border-transparent text-velora-dark hover:bg-[#FCFAF7] hover:text-velora-gold",
                  ].join(" ")
                }
              >
                <Icon
                  size={19}
                  strokeWidth={1.8}
                  className="shrink-0 transition-transform duration-200 group-hover:scale-105"
                />

                {!isCollapsedDesktop && (
                  <span className="whitespace-nowrap overflow-hidden transition-all duration-200 max-w-[180px] opacity-100">
                    {item.title}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-[#EFE7DC] px-2 pt-5">
          {/* <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            title={isDesktopCollapsed ? "Site Web" : undefined}
            className={[
              "flex h-11 items-center rounded-xl border border-[#E7DED2] bg-white text-sm font-semibold text-velora-dark transition-all duration-200 hover:border-velora-gold hover:bg-[#FFFDF9] hover:text-velora-gold",
              isDesktopCollapsed ? "justify-center px-0" : "justify-start gap-3 px-3.5",
            ].join(" ")}
          >
            <ArrowLeft size={17} strokeWidth={1.8} className="shrink-0" />
            {!isDesktopCollapsed && (
              <span className="whitespace-nowrap overflow-hidden transition-all duration-200 max-w-[180px] opacity-100">
                Site Web
              </span>
            )}
          </Link> */}

          <button
            type="button"
            onClick={handleLogout}
            title={isDesktopCollapsed ? "Déconnexion" : undefined}
            className={[
              "flex h-11 w-full items-center rounded-xl border border-[#E7DED2] bg-white text-sm font-semibold text-velora-dark transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600",
              isDesktopCollapsed ? "justify-center px-0" : "justify-start gap-3 px-3.5",
            ].join(" ")}
          >
            <LogOut size={17} strokeWidth={1.8} className="shrink-0" />
            {!isDesktopCollapsed && (
              <span className="whitespace-nowrap overflow-hidden transition-all duration-200 max-w-[180px] opacity-100">
                Déconnexion
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}