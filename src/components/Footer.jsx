import React from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaBone } from "react-icons/fa";
import { trackClick } from "../analytics/analytics";

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] border-t border-velora-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">

        <div className="flex flex-col md:flex-row items-center justify-between gap-5">

          {/* Copyright */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-[11px] sm:text-xs text-white/50">© 2026 The Adorable Woof Company. Tous droits réservés.</p>
          </div>

          {/* Réseaux sociaux */}
          <div className="flex items-center justify-center gap-3">
            {[
              { Icon: FaInstagram, href: "https://www.instagram.com/theadorablewoof.tn/", label: "Instagram" },
              { Icon: FaFacebookF, href: "https://www.facebook.com/theadorablewoof/", label: "Facebook" },
              { Icon: FaTiktok, href: "https://www.tiktok.com/@the.adorable.woof", label: "TikTok" },
            ].map(({ Icon, href, label }, index) => (
              <a
                key={index}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                onClick={() => label === "Instagram" && trackClick("click_instagram")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition-all duration-300 hover:border-[#C85F1E] hover:bg-[#C85F1E] hover:text-white"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>

          {/* Made in Tunisia */}
          <div className="flex-1 text-center md:text-right">
            <div className="text-xs text-white/50 flex items-center justify-center md:justify-end gap-1">
  <span>Made with</span>
  <FaBone className="text-velora-gold" size={12} />
  <span>in Tunisia</span>
</div>
          </div>

        </div>

      </div>
    </footer>
  );
}