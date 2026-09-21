import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Ne force pas le scroll au premier chargement.
    // Ça évite d'interrompre le premier swipe mobile
    // pendant que la page est encore en train de se monter.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);

  return null;
}