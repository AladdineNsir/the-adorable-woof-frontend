import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Package,
  RefreshCw,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Users,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getDashboardStats } from "../services/dashboardApi";

const PERIOD_OPTIONS = [
  "Année",
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const numberFormatter = new Intl.NumberFormat("fr-FR");

const formatMoney = (value) =>
  `${Number(value || 0).toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} DT`;

const formatPercent = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }

  const number = Number(value);
  return `${number >= 0 ? "+" : ""}${number.toFixed(1)}%`;
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getTrendClass = (value) => {
  if (value > 0) {
    return "border-[#D9E8D8] bg-[#F3F8F1] text-[#4E744A]";
  }

  if (value < 0) {
    return "border-[#ECD6D1] bg-[#FBF4F2] text-[#A85749]";
  }

  return "border-[var(--velora-border)] bg-[var(--velora-cream)] text-[var(--velora-textGray)]";
};

const getStatusStyle = (status) => {
  const value = String(status || "").toLowerCase();

  if (value.includes("livré")) {
    return "border-[#D9E8D8] bg-[#F3F8F1] text-[#4E744A]";
  }

  if (value.includes("expédi")) {
    return "border-[#D9E0E8] bg-[#F5F7FA] text-[#58697C]";
  }

  if (value.includes("préparation")) {
    return "border-[#F1DDC7] bg-[#FFF7EE] text-[#A76228]";
  }

  if (value.includes("retourn")) {
    return "border-[#ECD6D1] bg-[#FBF4F2] text-[#A85749]";
  }

  return "border-[var(--velora-border)] bg-[var(--velora-cream)] text-[var(--velora-textGray)]";
};

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function TrendBadge({ value }) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return (
      <span className="inline-flex items-center rounded-full border border-[var(--velora-border)] bg-[var(--velora-cream)] px-2.5 py-1 text-[10px] font-semibold text-[var(--velora-textGray)]">
        Pas de comparaison
      </span>
    );
  }

  const positive = numericValue > 0;
  const negative = numericValue < 0;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${getTrendClass(
        numericValue
      )}`}
    >
      {positive ? (
        <ArrowUpRight size={12} strokeWidth={2} />
      ) : negative ? (
        <ArrowDownRight size={12} strokeWidth={2} />
      ) : null}

      {formatPercent(numericValue)}
    </span>
  );
}

function PrimaryMetric({
  eyebrow,
  value,
  trend,
  icon: Icon,
  accent = false,
  description,
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 sm:p-6 ${
        accent
          ? "border-[var(--velora-primary)] bg-[var(--velora-primary)] text-white shadow-[0_12px_40px_rgba(201,106,38,0.16)]"
          : "border-[var(--velora-border)] bg-white text-[var(--velora-dark)] shadow-[0_8px_30px_rgba(17,17,17,0.035)]"
      }`}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className={`text-[9px] font-bold uppercase tracking-[0.18em] ${
                accent ? "text-white/70" : "text-[var(--velora-textGray)]"
              }`}
            >
              {eyebrow}
            </p>

            <p
              className={`mt-3 font-premium text-3xl font-semibold tracking-tight sm:text-[34px] ${
                accent ? "text-white" : "text-[var(--velora-dark)]"
              }`}
            >
              {value}
            </p>
          </div>

          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
              accent
                ? "border-white/20 bg-white/10 text-white"
                : "border-[var(--velora-border)] bg-[var(--velora-cream)] text-[var(--velora-primary)]"
            }`}
          >
            <Icon size={18} strokeWidth={1.8} />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <TrendBadge value={trend} />

          {description && (
            <span
              className={`text-[10px] ${
                accent ? "text-white/65" : "text-[var(--velora-textGray)]"
              }`}
            >
              {description}
            </span>
          )}
        </div>
      </div>

      {accent && (
        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full border border-white/10" />
      )}
    </div>
  );
}

function SecondaryMetric({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[var(--velora-border)] bg-white px-4 py-4 shadow-[0_6px_24px_rgba(17,17,17,0.025)]">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--velora-cream)] text-[var(--velora-primary)]">
        <Icon size={16} strokeWidth={1.8} />
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--velora-textGray)]">
          {label}
        </p>

        <p className="mt-0.5 truncate text-lg font-semibold text-[var(--velora-dark)]">
          {value}
        </p>
      </div>
    </div>
  );
}

function Section({ title, description, action, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-[var(--velora-border)] bg-white shadow-[0_8px_30px_rgba(17,17,17,0.03)] ${className}`}
    >
      <div className="flex flex-col gap-3 border-b border-[var(--velora-border)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="font-premium text-base font-semibold tracking-tight text-[var(--velora-dark)] sm:text-lg">
            {title}
          </h2>

          {description && (
            <p className="mt-0.5 text-[11px] text-[var(--velora-textGray)]">
              {description}
            </p>
          )}
        </div>

        {action}
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

/* =========================================================
   SALES CHART
========================================================= */

function SalesChart({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-dashed border-[#E7DED2] bg-[#FCFAF7] px-6 text-center">
        <div>
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#C96A26] shadow-sm">
            <BarChart3 size={19} strokeWidth={1.7} />
          </div>

          <p className="mt-4 text-sm font-semibold text-velora-dark">
            Aucune vente disponible
          </p>

          <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-[#9B9085]">
            Aucune donnée n’est disponible pour la période sélectionnée.
          </p>
        </div>
      </div>
    );
  }

  const chartWidth = 900;
  const chartHeight = 300;

  const revenues = data.map((item) => Number(item.revenue || 0));
  const profits = data.map((item) => Number(item.profit || 0));

  const maxValue = Math.max(...revenues, ...profits, 1);

  const getPoint = (value, index) => {
    const x =
      35 +
      (index / Math.max(data.length - 1, 1)) *
        (chartWidth - 65);

    const y =
      chartHeight -
      40 -
      (Number(value || 0) / maxValue) * (chartHeight - 75);

    return { x, y };
  };

  const revenuePoints = data
    .map((item, index) => {
      const point = getPoint(item.revenue, index);
      return `${point.x},${point.y}`;
    })
    .join(" ");

  const profitPoints = data
    .map((item, index) => {
      const point = getPoint(item.profit, index);
      return `${point.x},${point.y}`;
    })
    .join(" ");

  const areaPoints = `35,${chartHeight - 40} ${revenuePoints} ${
    chartWidth - 30
  },${chartHeight - 40}`;

  return (
    <div>
      <div className="overflow-hidden rounded-xl bg-[#FCFAF7]">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-[280px] w-full sm:h-[320px]"
          preserveAspectRatio="none"
          role="img"
          aria-label="Évolution du chiffre d'affaires et du bénéfice"
        >
          {[0, 0.25, 0.5, 0.75, 1].map((step) => {
            const y =
              chartHeight -
              40 -
              step * (chartHeight - 75);

            return (
              <line
                key={step}
                x1="35"
                x2={chartWidth - 30}
                y1={y}
                y2={y}
                stroke="#E9E0D6"
                strokeDasharray="3 6"
              />
            );
          })}

          <polygon
            points={areaPoints}
            fill="#C96A26"
            opacity="0.055"
          />

          <polyline
            fill="none"
            stroke="#C96A26"
            strokeWidth="3.2"
            points={revenuePoints}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <polyline
            fill="none"
            stroke="#9B7655"
            strokeWidth="2"
            points={profitPoints}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="5 5"
          />

          {data.map((point, index) => {
            const revenuePoint = getPoint(point.revenue, index);

            return (
              <g key={`${point.label}-${index}`}>
                <circle
                  cx={revenuePoint.x}
                  cy={revenuePoint.y}
                  r="4"
                  fill="#FFFFFF"
                  stroke="#C96A26"
                  strokeWidth="2"
                />

                <text
                  x={revenuePoint.x}
                  y={chartHeight - 14}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#8F857A"
                >
                  {point.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        <div className="flex items-center gap-2 text-[11px] font-medium text-[#766B62]">
          <span className="h-2 w-5 rounded-full bg-[#C96A26]" />
          Chiffre d'affaires
        </div>

        <div className="flex items-center gap-2 text-[11px] font-medium text-[#766B62]">
          <span className="h-0.5 w-5 border-t-2 border-dashed border-[#9B7655]" />
          Bénéfice
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ORDER STATUS
========================================================= */

function OrderStatus({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-dashed border-[#E7DED2] bg-[#FCFAF7] px-5 text-center">
        <div>
          <ShoppingCart
            size={20}
            className="mx-auto text-[#C96A26]"
            strokeWidth={1.7}
          />

          <p className="mt-3 text-sm font-semibold text-velora-dark">
            Aucune commande
          </p>

          <p className="mt-1 text-xs text-[#9B9085]">
            La répartition apparaîtra ici.
          </p>
        </div>
      </div>
    );
  }

  const total = data.reduce(
    (sum, item) => sum + Number(item.count || 0),
    0
  );

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#9B9085]">
            Total
          </p>

          <p className="mt-1 font-premium text-3xl font-semibold text-velora-dark">
            {numberFormatter.format(total)}
          </p>
        </div>

        <ShoppingBag
          size={22}
          className="text-[#C96A26]"
          strokeWidth={1.6}
        />
      </div>

      <div className="space-y-3">
        {data.map((item) => {
          const count = Number(item.count || 0);
          const percentage = total
            ? Math.round((count / total) * 100)
            : 0;

          return (
            <div key={item.status}>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <span className="truncate text-xs font-medium text-velora-dark">
                  {item.status}
                </span>

                <span className="shrink-0 text-[10px] font-semibold text-[#8F857A]">
                  {count} · {percentage}%
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-[#F0E9E0]">
                <div
                  className="h-full rounded-full bg-[#C96A26] transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN DASHBOARD
========================================================= */

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    period: "Année",
  });

  const loadDashboard = async (nextFilters = filters) => {
    try {
      setLoading(true);
      setError(false);

      const data = await getDashboardStats(nextFilters);

      setDashboard(data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard(filters);
  }, [filters.year, filters.period]);

  const stats = dashboard?.statistics || {};

  const availableYears =
    dashboard?.availableYears || [new Date().getFullYear()];

  const yearOptions = useMemo(() => {
    const years = [
      ...new Set(
        availableYears
          .map((year) => Number(year))
          .filter(Boolean)
      ),
    ];

    if (years.length === 0) {
      years.push(new Date().getFullYear());
    }

    return years.sort((a, b) => b - a);
  }, [availableYears]);

  const hasCostPrice = dashboard?.profitConfig
    ? !dashboard.profitConfig.requiresCostPrice
    : true;

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading && !dashboard) {
    return (
      <>
        <main className="p-4 sm:p-6 lg:p-7">
          <div className="mx-auto w-full max-w-[1500px] animate-pulse space-y-5">
            <div className="h-20 rounded-2xl bg-white" />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="h-40 rounded-2xl bg-white" />
              <div className="h-40 rounded-2xl bg-white" />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="h-20 rounded-2xl bg-white" />
              <div className="h-20 rounded-2xl bg-white" />
              <div className="h-20 rounded-2xl bg-white" />
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.65fr_0.85fr]">
              <div className="h-[420px] rounded-2xl bg-white" />
              <div className="h-[420px] rounded-2xl bg-white" />
            </div>
          </div>
        </main>
      </>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <>
        <main className="p-4 sm:p-6 lg:p-7">
          <div className="mx-auto flex min-h-[420px] max-w-[1500px] items-center justify-center rounded-2xl border border-[#E7DED2] bg-white px-6 text-center shadow-[0_8px_30px_rgba(17,17,17,0.03)]">
            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF7EE] text-[#C96A26]">
                <RefreshCw size={21} strokeWidth={1.7} />
              </div>

              <h2 className="mt-5 font-premium text-xl font-semibold text-velora-dark">
                Impossible de charger le dashboard
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8F857A]">
                Une erreur est survenue lors de la récupération
                des données de votre boutique.
              </p>

              <button
                type="button"
                onClick={() => loadDashboard(filters)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#C96A26] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#B85E21] hover:shadow-lg"
              >
                <RefreshCw size={15} />
                Réessayer
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="px-4 py-5 sm:px-6 lg:px-7 lg:py-6">
        <div className="mx-auto w-full max-w-[1500px]">

          {/* =================================================
              HEADER / FILTERS
          ================================================= */}

          <div className="mb-6 flex flex-col gap-5 border-b border-[#E7DED2] pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="select-none">
              <div className="mb-2 flex items-center gap-2">
              
              </div>

              
            </div>

            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              {/* Year */}
              <select
                value={filters.year}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    year: Number(event.target.value),
                  }))
                }
                className="min-h-[46px] w-[92px] cursor-pointer rounded-xl border border-[#E7DED2] bg-white px-3 text-xs font-semibold text-velora-dark outline-none transition-colors focus:border-[#C96A26]"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              {/* Period */}
              <select
                value={filters.period}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    period: event.target.value,
                  }))
                }
                className="min-h-[46px] w-[112px] cursor-pointer rounded-xl border border-[#E7DED2] bg-white px-3 text-xs font-semibold text-velora-dark outline-none transition-colors focus:border-[#C96A26]"
              >
                {PERIOD_OPTIONS.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>

              {/* Date */}
              <div className="flex min-h-[46px] min-w-[155px] flex-1 items-center gap-2 rounded-xl border border-[#E7DED2] bg-white px-3 sm:flex-none">
                <CalendarDays
                  size={15}
                  className="text-[#C96A26]"
                  strokeWidth={1.7}
                />

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#A59A8E]">
                    Aujourd'hui
                  </p>

                  <p className="text-xs font-semibold text-velora-dark">
                    {new Date().toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <SecondaryMetric
              label="Commandes"
              value={numberFormatter.format(
                stats.totalOrders || 0
              )}
              icon={ShoppingCart}
            />

            <SecondaryMetric
              label="Clients"
              value={numberFormatter.format(
                stats.totalUsers || 0
              )}
              icon={Users}
            />

            <SecondaryMetric
              label="Produits"
              value={numberFormatter.format(
                stats.totalProducts || 0
              )}
              icon={Package}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <PrimaryMetric
              eyebrow="Chiffre d'affaires"
              value={formatMoney(stats.totalRevenue)}
              trend={stats.revenueTrendPercent}
              icon={CircleDollarSign}
              accent
              description="vs période précédente"
            />

            <PrimaryMetric
              eyebrow="Bénéfice réel"
              value={
                hasCostPrice
                  ? formatMoney(stats.totalProfit)
                  : "—"
              }
              trend={
                hasCostPrice
                  ? stats.profitTrendPercent
                  : null
              }
              icon={TrendingUp}
              description={
                hasCostPrice
                  ? "marge calculée"
                  : "costPrice requis"
              }
            />
          </div>

          {/* =================================================
              SALES ANALYTICS
          ================================================= */}

          <div className="mt-5 grid grid-cols-1 gap-5">
            <Section
              title="Évolution des ventes"
              description="Chiffre d'affaires et bénéfice"
            >
              <SalesChart
                data={dashboard?.salesEvolution || []}
              />
            </Section>

          </div>

          {/* =================================================
              ORDERS + TOP PRODUCTS
          ================================================= */}

          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">

            {/* Recent orders */}
            <Section
              title="Commandes récentes"
              description="Les dernières commandes enregistrées"
              action={
                <Link
                  to="/admin/orders"
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#C96A26] transition-colors hover:text-[#A9551D]"
                >
                  Toutes les commandes
                  <ArrowRight size={13} />
                </Link>
              }
            >
              {dashboard?.recentOrders?.length ? (
                <div className="overflow-hidden rounded-xl border border-[#E7DED2]">
                  {/* Desktop header */}
                  <div className="hidden grid-cols-[1.2fr_1fr_0.7fr_0.9fr] border-b border-[#E7DED2] bg-[#FCFAF7] px-4 py-3 text-[8px] font-bold uppercase tracking-[0.14em] text-[#9B9085] sm:grid">
                    <span>Commande</span>
                    <span>Date</span>
                    <span>Montant</span>
                    <span>Statut</span>
                  </div>

                  <div className="divide-y divide-[#F0E9E0]">
                    {dashboard.recentOrders.map((order) => (
                      <Link
                        key={order._id}
                        to={`/admin/orders/${order._id}`}
                        className="grid grid-cols-1 gap-2 px-4 py-4 transition-colors hover:bg-[#FCFAF7] sm:grid-cols-[1.2fr_1fr_0.7fr_0.9fr] sm:items-center sm:gap-3"
                      >
                        <div>
                          <p className="text-xs font-bold text-[#C96A26]">
                            {order.orderNumber}
                          </p>

                          {order.shippingAddress?.fullName && (
                            <p className="mt-0.5 truncate text-[10px] text-[#9B9085]">
                              {order.shippingAddress.fullName}
                            </p>
                          )}
                        </div>

                        <span className="text-[11px] text-[#766B62]">
                          {formatDate(order.createdAt)}
                        </span>

                        <span className="text-sm font-semibold text-velora-dark">
                          {formatMoney(order.totalPrice)}
                        </span>

                        <span
                          className={`w-fit rounded-full border px-2.5 py-1 text-[9px] font-semibold ${getStatusStyle(
                            order.deliveryStatus
                          )}`}
                        >
                          {order.deliveryStatus}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon={ShoppingCart}
                  title="Aucune commande"
                  text="Les nouvelles commandes apparaîtront ici."
                />
              )}
            </Section>

            <Section
              title="Statuts des commandes"
              description="Répartition sur la période"
            >
              <OrderStatus
                data={dashboard?.orderStatuses || []}
              />
            </Section>

          </div>

          {/* =================================================
              INVENTORY + COMMERCIAL INSIGHTS
          ================================================= */}

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">

            {/* Low stock */}
            <Section
              title="Stock faible"
              description="Produits nécessitant votre attention"
              action={
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#A76228]">
                  <AlertTriangle size={13} />
                  Surveillance
                </div>
              }
            >
              {dashboard?.lowStockProducts?.length ? (
                <div className="space-y-2">
                  {dashboard.lowStockProducts.map(
                    (product) => {
                      const stock = Number(product.stock || 0);

                      return (
                        <div
                          key={product._id}
                          className="flex items-center justify-between gap-4 rounded-xl bg-[#FCFAF7] px-4 py-3"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#C96A26]">
                              <Package
                                size={16}
                                strokeWidth={1.7}
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-velora-dark">
                                {product.name}
                              </p>

                              <p className="mt-0.5 text-[10px] text-[#9B9085]">
                                Niveau de stock faible
                              </p>
                            </div>
                          </div>

                          <span
                            className={`shrink-0 text-xs font-bold ${
                              stock <= 2
                                ? "text-[#A85749]"
                                : "text-[#A76228]"
                            }`}
                          >
                            {stock} restant
                            {stock > 1 ? "s" : ""}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <EmptyState
                  icon={CheckCircle2}
                  title="Stock en bonne santé"
                  text="Aucun produit ne nécessite votre attention."
                  positive
                />
              )}
            </Section>

            {/* Best sellers */}
            <Section
              title="Produits les plus vendus"
              description="Top produits par quantité"
            >
              {dashboard?.bestSellingProducts?.length ? (
                <div className="space-y-2">
                  {dashboard.bestSellingProducts.map((product, index) => (
                    <Link
                      key={product.productId}
                      to={`/admin/products/edit/${product.productId}`}
                      className="group flex items-center gap-3 rounded-xl border border-transparent px-2 py-2.5 transition-all hover:border-[#E7DED2] hover:bg-[#FCFAF7]"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF7EE] text-[10px] font-bold text-[#C96A26]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-velora-dark">{product.name}</p>
                        <p className="mt-0.5 text-[10px] text-[#9B9085]">Produit le plus performant</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-velora-dark">{numberFormatter.format(product.quantity || 0)}</p>
                        <p className="text-[9px] text-[#9B9085]">vendus</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={ShoppingBag}
                  title="Aucun produit vendu"
                  text="Les meilleures ventes apparaîtront ici."
                />
              )}
            </Section>

          </div>

          {/* =================================================
              COST PRICE WARNING
          ================================================= */}

        
        </div>
      </main>
    </>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  icon: Icon,
  title,
  text,
  positive = false,
}) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-[#E7DED2] bg-[#FCFAF7] px-5 text-center">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${
          positive
            ? "bg-[#F3F8F1] text-[#4E744A]"
            : "bg-white text-[#C96A26]"
        }`}
      >
        <Icon size={17} strokeWidth={1.7} />
      </div>

      <p className="mt-3 text-sm font-semibold text-velora-dark">
        {title}
      </p>

      <p className="mt-1 max-w-xs text-[11px] leading-5 text-[#9B9085]">
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   INSIGHT
========================================================= */

function Insight({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-[#E7DED2] bg-[#FCFAF7] p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#9B9085]">
          {label}
        </p>

        <Icon
          size={14}
          className="text-[#C96A26]"
          strokeWidth={1.7}
        />
      </div>

      <p className="mt-3 truncate font-premium text-xl font-semibold text-velora-dark">
        {value}
      </p>
    </div>
  );
}