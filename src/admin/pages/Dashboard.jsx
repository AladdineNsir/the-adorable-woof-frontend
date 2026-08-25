import { useEffect, useState } from "react";
import {
  DollarSign,
  FolderTree,
  Package,
  ShoppingCart,
  Tags,
  Users,
} from "lucide-react";

import AdminPageHeader from "../components/AdminPageHeader";
import StatCard from "../components/StatCard";
import { getDashboardStats } from "../services/dashboardApi";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboardStats();
        setDashboard(data.statistics);
      } catch (error) {
        console.log(error);
      }
    };

    loadDashboard();
  }, []);

  if (!dashboard) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <h2 className="text-sm font-semibold text-velora-textGray">Chargement...</h2>
      </div>
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Vue d'ensemble claire pour suivre les produits, commandes, clients et revenus."
      />

      <div className="p-4 sm:p-6 lg:p-7">
        <div className="mb-5 rounded-xl border border-[#E7DED2] bg-white p-5 shadow-[0_6px_24px_rgba(17,17,17,0.035)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-velora-gold">
            Performance actuelle
          </p>

          <h2 className="mt-2 font-premium text-xl font-semibold text-velora-dark sm:text-2xl">
            Votre boutique SMILEY WOOF à portée de main
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          <StatCard title="Produits" value={dashboard.totalProducts} icon={Package} />
          <StatCard title="Catégories" value={dashboard.totalCategories} icon={Tags} />
          <StatCard
            title="Sous-catégories"
            value={dashboard.totalSubCategories}
            icon={FolderTree}
          />
          <StatCard title="Commandes" value={dashboard.totalOrders} icon={ShoppingCart} />
          <StatCard title="Clients" value={dashboard.totalUsers} icon={Users} />
          <StatCard
            title="Revenus"
            value={`${Number(dashboard.totalRevenue || 0).toFixed(2)} DT`}
            icon={DollarSign}
          />
        </div>
      </div>
    </>
  );
}
