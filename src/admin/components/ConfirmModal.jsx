import { Trash2, X } from "lucide-react";

export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Supprimer",
  cancelText = "Annuler",
  loading = false,
  onConfirm,
  onClose,
}) {
  if (!open) return null;

  const titleId = "confirm-modal-title";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#111111]/45 backdrop-blur-[2px] p-4">

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md mx-4 overflow-hidden rounded-xl border border-[#E8DED1] bg-white shadow-[0_12px_40px_rgba(17,17,17,0.12)]"
      >

        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-5 py-5 sm:px-6 border-b border-[#EFE7DC]">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center">
              <Trash2 size={20} className="text-red-600" />
            </div>

            <div>
              <h2 id={titleId} className="text-base sm:text-lg font-semibold text-velora-dark">
                {title}
              </h2>
              <p className="mt-0.5 text-xs text-velora-textGray">Cette action est définitive.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            aria-label="Fermer"
            className="h-9 w-9 rounded-lg flex items-center justify-center text-velora-textGray transition-colors duration-200 hover:bg-[#F7F3EC] hover:text-velora-dark"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 sm:px-6 sm:py-6">
          <p className="text-sm leading-6 text-velora-textGray">{message}</p>

          <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-3.5 py-3">
            <span className="text-xs sm:text-sm font-medium text-red-700">Cette opération est irréversible.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 sm:px-6 border-t border-[#EFE7DC] bg-[#FCFAF7]">
          <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full sm:w-auto h-10 rounded-lg border border-[#E7DED2] bg-white px-4 text-sm font-semibold text-velora-dark transition-colors duration-200 hover:border-velora-gold hover:text-velora-gold hover:bg-[#FFFDF9]"
            >
              {cancelText}
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className="w-full sm:w-auto h-10 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Suppression..." : confirmText}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}