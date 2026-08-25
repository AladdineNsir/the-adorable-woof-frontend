export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.pages <= 1) return null;

  return (
    <div className="mt-6 border-t border-[#EFE7DC] pt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs sm:text-sm text-velora-textGray">
          Page {pagination.page} sur {pagination.pages} • {pagination.total} résultat
          {pagination.total > 1 ? "s" : ""}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Page précédente"
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
            className="h-10 rounded-lg border border-[#E7DED2] bg-white px-4 text-sm font-semibold text-velora-dark transition-colors duration-200 hover:border-velora-gold hover:text-velora-gold hover:bg-[#FFFDF9] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Précédent
          </button>

          <button
            type="button"
            aria-label="Page suivante"
            disabled={pagination.page >= pagination.pages}
            onClick={() => onPageChange(pagination.page + 1)}
            className="h-10 rounded-lg border border-[#E7DED2] bg-white px-4 text-sm font-semibold text-velora-dark transition-colors duration-200 hover:border-velora-gold hover:text-velora-gold hover:bg-[#FFFDF9] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}
