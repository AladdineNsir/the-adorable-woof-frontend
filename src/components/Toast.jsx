import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  X,
} from "lucide-react";

export default function Toast({
  message,
  visible,
  type = "success",
  onClose,
}) {
  const styles = {
    success: {
      icon: CheckCircle2,
      iconBg: "bg-[#F1F8F2]",
      iconColor: "text-[#4F7A57]",
      accent: "bg-[#5F8A67]",
    },
    error: {
      icon: AlertCircle,
      iconBg: "bg-[#FFF3F1]",
      iconColor: "text-[#C95B4B]",
      accent: "bg-[#C95B4B]",
    },
    info: {
      icon: Info,
      iconBg: "bg-[#FFF7EE]",
      iconColor: "text-[#C96A26]",
      accent: "bg-[#C96A26]",
    },
  };

  const current = styles[type] || styles.success;
  const Icon = current.icon;

  return (
    <AnimatePresence>
      {visible && (
        <div className="pointer-events-none fixed bottom-4 left-4 right-4 z-[200] flex justify-center sm:bottom-6 sm:left-auto sm:right-6 sm:justify-end">
          <motion.div
            initial={{
              opacity: 0,
              y: 18,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 10,
              scale: 0.98,
            }}
            transition={{
              duration: 0.24,
              ease: [0.22, 1, 0.36, 1],
            }}
            role="status"
            aria-live="polite"
            className="
              pointer-events-auto
              relative
              flex
              w-full
              max-w-[390px]
              items-center
              gap-3
              overflow-hidden
              rounded-2xl
              border
              border-[#E7DED2]
              bg-white
              px-4
              py-3.5
              shadow-[0_14px_40px_rgba(17,17,17,0.10)]
            "
          >
            {/* Accent vertical */}
            <span
              className={`absolute left-0 top-0 h-full w-[3px] ${current.accent}`}
            />

            {/* Icon */}
            <div
              className={`
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-xl
                ${current.iconBg}
                ${current.iconColor}
              `}
            >
              <Icon size={19} strokeWidth={2} />
            </div>

            {/* Message */}
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8D7D6D]">
                {type === "success"
                  ? "Succès"
                  : type === "error"
                  ? "Erreur"
                  : "Information"}
              </p>

              <p className="mt-0.5 break-words text-sm font-semibold leading-5 text-velora-dark">
                {message}
              </p>
            </div>

            {/* Close */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="
                  flex h-8 w-8 shrink-0
                  items-center justify-center
                  rounded-lg
                  text-[#A99D91]
                  transition
                  hover:bg-[#FCFAF7]
                  hover:text-velora-dark
                "
                aria-label="Fermer"
              >
                <X size={16} />
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}