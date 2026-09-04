import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({
  open,
  title = "Confirmation",
  message = "Voulez-vous vraiment continuer ?",
  confirmText = "Confirmer",
  cancelText = "Annuler",
  loading = false,
  onConfirm,
  onClose,
}) {
  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-black/40
        px-4
        backdrop-blur-[3px]
      "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="
          w-full max-w-[420px]
          overflow-hidden
          rounded-2xl
          border border-[#E7DED2]
          bg-white
          shadow-[0_24px_70px_rgba(17,17,17,0.18)]
          animate-in
          fade-in
          zoom-in-95
          duration-200
        "
      >
        {/* HEADER */}

        <div className="flex items-start gap-4 px-5 pt-5 sm:px-6 sm:pt-6">
          <div
            className="
              flex h-11 w-11
              shrink-0
              items-center justify-center
              rounded-xl
              bg-[#FFF4E9]
              text-[#C96A26]
            "
          >
            <AlertTriangle
              size={20}
              strokeWidth={1.8}
            />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="pr-6 text-base font-semibold text-velora-dark">
              {title}
            </h2>

            <p className="mt-1.5 text-sm leading-5 text-velora-textGray">
              {message}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              absolute
              ml-[-28px]
              mt-[-2px]
              flex h-8 w-8
              items-center justify-center
              rounded-lg
              text-[#918579]
              transition
              hover:bg-[#F8F3ED]
              hover:text-velora-dark
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
            aria-label="Fermer"
          >
            <X size={17} />
          </button>
        </div>

        {/* ACTIONS */}

        <div
          className="
            mt-6
            flex
            flex-col-reverse
            gap-2
            border-t border-[#F0E8DE]
            bg-[#FCFAF7]
            px-5
            py-4
            sm:flex-row
            sm:justify-end
            sm:px-6
          "
        >
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              inline-flex
              h-10
              items-center
              justify-center
              rounded-xl
              border border-[#E3D8CC]
              bg-white
              px-5
              text-sm
              font-semibold
              text-velora-dark
              transition-all
              duration-200
              hover:border-[#CFC1B4]
              hover:bg-[#F8F3ED]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="
              inline-flex
              h-10
              min-w-[110px]
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#B85D20]
              px-5
              text-sm
              font-semibold
              text-white
              shadow-[0_6px_16px_rgba(184,93,32,0.18)]
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-[#A9521B]
              hover:shadow-[0_8px_20px_rgba(184,93,32,0.24)]
              active:translate-y-0
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading ? (
              <>
                <span
                  className="
                    h-4 w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-white/40
                    border-t-white
                  "
                />
                Suppression...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}