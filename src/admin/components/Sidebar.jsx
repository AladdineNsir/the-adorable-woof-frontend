import {
  ArrowLeft,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  PawPrint,
  ShoppingCart,
  Tags,
  Users,
  X,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { useAuth } from "../../context/AuthContext";

const menu = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { title: "Produits", icon: Package, path: "/admin/products" },
  { title: "Catégories", icon: Tags, path: "/admin/categories" },
  { title: "Sous-catégories", icon: FolderTree, path: "/admin/subcategories" },
  { title: "Commandes", icon: ShoppingCart, path: "/admin/orders" },
  { title: "Clients", icon: Users, path: "/admin/clients" },
];

export default function Sidebar({ sidebarOpen = false, setSidebarOpen = () => {} }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Close sidebar on navigation (mobile only)
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-[#E7DED2] bg-white px-4 py-5 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
      <NavLink to="/admin" className="flex items-center gap-3 border-b border-[#EFE7DC] pb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFF7EE] border border-[#E7DED2] text-velora-gold">
          <PawPrint size={18} />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold tracking-[0.12em] text-velora-dark">
            SMILEY WOOF
          </h1>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden flex h-8 w-8 items-center justify-center rounded-md hover:bg-[#FCFAF7]"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </NavLink>

      <nav className="mt-6 flex-1 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-[#FFF7EE] text-velora-gold border border-[#F1DDC7]"
                    : "border border-transparent text-velora-dark hover:bg-[#FCFAF7] hover:text-velora-gold"
                }`
              }
            >
              <Icon size={18} />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-[#EFE7DC] pt-5">
        <Link
          to="/"
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#E7DED2] bg-white px-4 text-sm font-semibold text-velora-dark transition-colors duration-200 hover:border-velora-gold hover:text-velora-gold hover:bg-[#FFFDF9]"
        >
          <ArrowLeft size={16} />
          Site Web
        </Link>

        <button
          onClick={handleLogout}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#E7DED2] bg-white px-4 text-sm font-semibold text-velora-dark transition-colors duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
    </>
  );
}
