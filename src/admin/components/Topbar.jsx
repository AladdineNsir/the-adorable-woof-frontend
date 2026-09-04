import { Bell, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function Topbar({
  onMenuClick = () => {},
  collapsed = false,
  onToggleSidebar = () => {},
}) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-[#E7DED2] bg-white/95 backdrop-blur-sm">
      <div className="flex h-[68px] w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 lg:gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7DED2] bg-[#FCFAF7] text-velora-dark transition-all duration-200 hover:border-velora-gold hover:bg-[#FFFDF9] hover:text-velora-gold lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu size={18} strokeWidth={1.8} />
          </button>

          <button
            type="button"
            onClick={onToggleSidebar}
            className="hidden h-10 w-10 items-center justify-center rounded-lg border border-[#E7DED2] bg-white text-velora-dark shadow-sm transition-all duration-200 hover:border-[#C96A26] hover:bg-[#FFF7EE] hover:text-[#C96A26] lg:flex"
            aria-label={collapsed ? "Agrandir la sidebar" : "Réduire la sidebar"}
            title={collapsed ? "Agrandir la sidebar" : "Réduire la sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen size={18} strokeWidth={1.8} />
            ) : (
              <PanelLeftClose size={18} strokeWidth={1.8} />
            )}
          </button>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E7DED2] bg-white text-velora-dark shadow-sm transition-all duration-200 hover:border-velora-gold hover:bg-[#FFFDF9] hover:text-velora-gold"
            aria-label="Notifications"
          >
            <Bell size={17} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </header>
  );
}