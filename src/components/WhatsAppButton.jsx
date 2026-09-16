import { FaWhatsapp } from "react-icons/fa";
import { useLocation } from "react-router-dom";

import { trackClick } from "../analytics/analytics";

const WHATSAPP_URL = "https://wa.me/21621142311";
const hiddenPrefixes = ["/admin", "/login", "/register", "/account"];

export default function WhatsAppButton() {
  const { pathname } = useLocation();

  if (hiddenPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackClick("click_whatsapp")}
      aria-label="Contacter The Adorable Woof sur WhatsApp"
      title="Contacter sur WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.35)] transition hover:scale-105 hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 sm:bottom-6 sm:right-6"
    >
      <FaWhatsapp size={18} aria-hidden="true" />
    </a>
  );
}
