import { TrendingUp } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "#C96A26",
  growth = "+0%",
}) {
  return (
    <div className="group relative rounded-xl border border-[#E8DED1] bg-white p-5 shadow-[0_6px_24px_rgba(17,17,17,0.035)] transition-colors duration-200 hover:border-velora-gold/40 hover:bg-[#FFFDF9]">
      <div className="flex justify-between gap-4">
        <div className="flex-1">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-velora-textGray">
            {title}
          </p>

          <h2 className="mt-2 text-2xl sm:text-3xl font-bold leading-none text-velora-dark">{value}</h2>

          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
            <TrendingUp size={14} className="h-3.5 w-3.5" />
            <span>{growth}</span>
          </div>
        </div>

        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#E7DED2] bg-[#FFF7EE]"
          style={{ color }}
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}
