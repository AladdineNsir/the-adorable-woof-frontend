import { Link } from "react-router-dom";

export default function AdminPageHeader({
  eyebrow = "SMILEY WOOF",
  title,
  description,
  breadcrumb = [],
  action,
  backTo,
}) {
  return (
    <div className="border-b border-[#E8DED1] px-4 py-5 sm:px-6 sm:py-6 lg:px-0 bg-transparent">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-medium text-velora-textGray/70">
            <span>Admin</span>
            {breadcrumb.map((item) => (
              <span key={item} className="text-velora-textGray/40">/ {item}</span>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-velora-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-velora-gold" />
            <span>{eyebrow}</span>
          </div>

          <h1 className="mt-3 font-premium text-2xl sm:text-3xl lg:text-4xl font-bold text-velora-dark">
            {title}
          </h1>

          {description && (
            <p className="mt-2 max-w-2xl text-sm sm:text-base leading-6 text-velora-textGray">
              {description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {backTo && (
            <Link
              to={backTo}
              aria-label="Retour"
              className="inline-flex h-10 items-center justify-center rounded-lg px-4 border border-[#E7DED2] bg-white text-velora-dark text-sm font-semibold transition-colors duration-200 hover:border-velora-gold hover:text-velora-gold hover:bg-[#FFFDF9]"
            >
              Retour
            </Link>
          )}
          {action}
        </div>
      </div>
    </div>
  );
}
