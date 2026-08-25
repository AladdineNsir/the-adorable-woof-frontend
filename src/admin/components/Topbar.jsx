import { ArrowLeft, Bell, Menu, Search } from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function Topbar({ onMenuClick = () => {} }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-[#E7DED2] bg-white px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E7DED2] bg-white text-velora-dark transition-colors duration-200 hover:border-velora-gold hover:text-velora-gold hover:bg-[#FFFDF9]"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm sm:text-base font-bold tracking-[0.10em] text-velora-dark">SMILEY WOOF</span>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#E7DED2] bg-white text-velora-dark transition-colors duration-200 hover:border-velora-gold hover:text-velora-gold hover:bg-[#FFFDF9]">
            <Bell size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
