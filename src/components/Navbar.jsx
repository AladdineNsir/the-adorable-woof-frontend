import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  User,
  ShoppingBag,
  ChevronDown,
  Package,
  LogOut,
  Home,
  Ruler,
  Info,
  Mail,
  LayoutDashboard,
  Tags,
  FolderTree,
  Users,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { getItemsCount } = useCart();
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [focusedIndex, setFocusedIndex] = useState(null);

  const navItems = [
    { to: '/', label: 'Accueil', Icon: Home },
    { to: '/shop', label: 'Boutique', Icon: ShoppingBag },
    { to: '/size-guide', label: 'Guide', Icon: Ruler },
    { to: '/about', label: 'À Propos', Icon: Info },
    { to: '/contact', label: 'Contact', Icon: Mail },
  ];

  // focusedIndex controls pill visibility for keyboard focus; activeLink controls for route

const [showMenu, setShowMenu] = useState(false);
const menuRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (e) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target)
    ) {
      setShowMenu(false);
    }
  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () =>
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
}, []);

  // activeIndex removed: rely on NavLink / location as source of truth

// reduced-motion handling removed (not used)

const handleLogout = () => {
  logout();
  setShowMenu(false);
  navigate("/");
};

  const adminQuickLinks = [
    { to: "/admin", label: "Dashboard", Icon: LayoutDashboard },
    { to: "/admin/products", label: "Produits", Icon: Package },
    { to: "/admin/categories", label: "Catégories", Icon: Tags },
    { to: "/admin/subcategories", label: "Sous-catégories", Icon: FolderTree },
    { to: "/admin/orders", label: "Commandes", Icon: ShoppingBag },
    { to: "/admin/clients", label: "Clients", Icon: Users },
  ];

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50 py-2.5">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
      {/* Logo + Brand */}
      <Link to="/" className="flex items-center shrink-0 py-0.5 gap-2 sm:gap-3">
        <img src="/assets/logoOs.png" className="h-7 sm:h-8 md:h-9 w-auto max-w-[140px] sm:max-w-[150px] md:max-w-[170px] object-contain" />
<img
  src="/assets/1.png"
  className="h-9 sm:h-10 md:h-11 w-auto max-w-[380px] sm:max-w-[480px] md:max-w-[550px] object-contain"
/>
     {/* <span className="hidden sm:flex items-center whitespace-nowrap text-velora-gold">
  <span className="font-[cursive] text-[14px] md:text-[16px] mr-1">
    the
  </span>

  <span className="font-serif font-bold text-[18px] md:text-[22px] tracking-tight">
    aDoraBle
  </span>

  <span className="font-[cursive] text-[13px] md:text-[15px] ml-1">
    woof company
  </span>
</span> */}
     
      </Link>

      {/* Liens de Navigation centrés - Hidden on mobile, visible on md and up */}
      <div className="relative hidden md:flex flex-1 items-center justify-center gap-1">
        {navItems.map((item, i) => {
          const Icon = item.Icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onFocus={() => setFocusedIndex(i)}
              onBlur={() => setFocusedIndex(null)}
              className={({ isActive }) => `relative inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-velora-gold/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-full`}
              aria-label={item.label}
            >
              {({ isActive }) => {
                const shouldShowAnimation = focusedIndex === i || (focusedIndex === null && isActive);
                
                return (
                  <div className="relative inline-flex items-center">
                    <div className="relative z-10 flex items-center gap-2 px-3 py-1.5 min-w-[44px] justify-center">
                      <motion.div 
                        whileTap={{ scale: 0.95 }} 
                        className={`${isActive ? 'text-velora-gold' : 'text-gray-400'} transition-colors duration-150 p-1`}
                      >
                        <Icon size={19} strokeWidth={1.8} />
                      </motion.div>
                      <AnimatePresence mode="wait">
                        {shouldShowAnimation ? (
                          <motion.span
                            key={`label-${i}`}
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-sm font-medium text-velora-dark overflow-hidden whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              }}
            </NavLink>
          );
        })}
      </div>

      {/* Icônes d'actions à droite */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-velora-dark ml-auto">
        {user?.role === "admin" && (
          <Link
            to="/admin"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E7DED2] bg-[#FFF7EE] text-velora-gold transition-colors duration-200 hover:bg-[#F5E6D3]"
            aria-label="Dashboard administrateur"
            title="Dashboard administrateur"
          >
            <LayoutDashboard size={18} strokeWidth={1.9} />
          </Link>
        )}

        {!user ? (

  <Link to="/login" className="text-velora-dark hover:text-velora-gold transition-colors duration-200 flex-shrink-0">
    <User size={18} strokeWidth={1.8} />
  </Link>

) : (

        <div ref={menuRef} className="relative">

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 md:gap-3 text-velora-dark hover:text-velora-gold transition-colors duration-200"
          >

            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-velora-gold text-white flex items-center justify-center font-bold text-sm flex-shrink-0">

              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="hidden lg:block text-left">

              <p className="text-xs md:text-sm font-semibold">{user?.name?.split(" ")[0] || "Utilisateur"}</p>

              {/* <p className={`text-[10px] uppercase font-semibold ${user?.role === "admin" ? "text-[#C89B5A]" : "text-gray-500"}`}>
                {user?.role === "admin" ? "ADMIN" : "CLIENT"}
              </p> */}

            </div>

            <ChevronDown size={16} className={`hidden md:block transition-transform duration-200 ${showMenu ? "rotate-180" : ""}`} />

          </button>

          <AnimatePresence>
            {showMenu && (

              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 md:top-14 w-56 md:w-64 bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-[#E8DED1] overflow-hidden z-50"
              >
              <div className="px-4 md:px-5 py-3 md:py-4 border-b border-[#EFE7DC]">
                <h3 className="font-semibold text-sm md:text-base">{user.name}</h3>
                <p className="text-xs md:text-sm text-gray-500">{user.email}</p>
              </div>

              {user?.role === "admin" && (
                <div className="border-b border-[#EFE7DC] px-3 py-3">
                  <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.15em] text-velora-textGray">
                    Administration
                  </p>

                  <div className="space-y-1">
                    {adminQuickLinks.map(({ to, label, Icon }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setShowMenu(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-[#FFF7EE] hover:text-velora-gold"
                      >
                        <Icon size={16} />
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {user?.role !== "admin" && (
  <>
    <Link
      to="/account"
      onClick={() => setShowMenu(false)}
      className="flex items-center gap-3 px-4 md:px-5 py-3 hover:bg-gray-100 text-sm md:text-base"
    >
      <User size={18} />
      Mon profil
    </Link>

    <Link
      to="/account/orders"
      onClick={() => setShowMenu(false)}
      className="flex items-center gap-3 px-4 md:px-5 py-3 hover:bg-gray-100 text-sm md:text-base"
    >
      <Package size={18} />
      Mes commandes
    </Link>
  </>
)}

              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 md:px-5 py-3 hover:bg-red-50 text-red-500 text-sm md:text-base">
                <LogOut size={18} />
                Déconnexion
              </button>

            </motion.div>

            )}
          </AnimatePresence>

        </div>

      )}
        {/* <Link to="/cart" className="hover:text-velora-gold transition-colors duration-200 relative flex-shrink-0">
          <ShoppingBag size={18} strokeWidth={1.8} />
          {getItemsCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-velora-gold/60 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-velora-cream">
              {getItemsCount()}
            </span>
          )}
        </Link> */}
        {user?.role !== "admin" && (
  <Link
    to="/cart"
    className="hover:text-velora-gold transition-colors duration-200 relative flex-shrink-0"
  >
    <ShoppingBag size={18} />

    {getItemsCount() > 0 && (
      <span className="absolute -top-2 -right-2 bg-velora-gold/60 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-velora-cream">
        {getItemsCount()}
      </span>
    )}
  </Link>
)}
      </div>
      </div>
    </nav>
  );
}