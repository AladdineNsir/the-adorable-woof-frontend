import { Link } from "react-router-dom";

export default function AdminPageHeader({
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

{/*           
          <div className="mb-2 flex items-center gap-2 text-[11px] font-medium text-velora-textGray/70">
            <span>Admin</span>

            {breadcrumb.map((item) => (
              <span
                key={item}
                className="text-velora-textGray/40"
              >
                / {item}
              </span>
            ))}
          </div> */}

          {/* TITRE */}
          <h1 className="mt-3 font-premium text-2xl sm:text-3xl lg:text-4xl font-bold text-smiley-warning">
            {title}
          </h1>

          {/* DESCRIPTION */}
          {description && (
            <p className="mt-2 max-w-2xl text-sm sm:text-base leading-6 text-velora-textGray">
              {description}
            </p>
          )}

        </div>

        {/* ACTIONS */}
        <div className="flex w-full flex-wrap items-center gap-2.5 lg:w-auto lg:justify-end">

          {backTo && (
            <Link
              to={backTo}
              aria-label="Retour"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-[#E7DED2] bg-white px-4 text-sm font-semibold text-velora-dark transition-colors duration-200 hover:border-velora-gold hover:bg-[#FFFDF9] hover:text-velora-gold"
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