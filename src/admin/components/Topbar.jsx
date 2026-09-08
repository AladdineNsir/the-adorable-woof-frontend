import { useEffect, useRef, useState } from "react";
import { Bell, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { getOrders } from "../../services/orderApi";

import { useAuth } from "../../context/AuthContext";

export default function Topbar({
  onMenuClick = () => {},
  collapsed = false,
  onToggleSidebar = () => {},
}) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    let active = true;

    const loadNotifications = async () => {
      try {
        const data = await getOrders({ page: 1, limit: 5 });
        const latestOrders = data.orders || data || [];
        const storedIds = JSON.parse(
          localStorage.getItem("velora_seen_order_notifications") || "[]"
        );

        if (!storedIds.length) {
          localStorage.setItem(
            "velora_seen_order_notifications",
            JSON.stringify(latestOrders.map((order) => order._id))
          );
          return;
        }

        if (active) {
          setNotifications(
            latestOrders.filter((order) => !storedIds.includes(order._id))
          );
        }
      } catch {
        // Notifications should never interrupt the admin workspace.
      }
    };

    loadNotifications();
    const interval = window.setInterval(loadNotifications, 15000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [user]);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const markNotificationsAsRead = () => {
    const currentIds = notifications.map((order) => order._id);
    const storedIds = JSON.parse(
      localStorage.getItem("velora_seen_order_notifications") || "[]"
    );
    localStorage.setItem(
      "velora_seen_order_notifications",
      JSON.stringify([...new Set([...storedIds, ...currentIds])])
    );
    setNotifications([]);
    setShowNotifications(false);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#E7DED2] bg-white/95 backdrop-blur-sm">
      <div className="flex min-w-0 h-[68px] w-full items-center justify-between px-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 lg:gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7DED2] bg-[#FCFAF7] text-velora-dark transition-all duration-200 hover:border-velora-gold hover:bg-[#FFFDF9] hover:text-velora-gold lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu size={18} strokeWidth={1.8} />
          </button>

          <button
            type="button"
            onClick={onToggleSidebar}
            className="hidden h-10 w-10 items-center justify-center rounded-lg border border-[#E7DED2] bg-white text-[#C96A26] shadow-sm lg:flex"
            aria-label={collapsed ? "Agrandir la sidebar" : "Réduire la sidebar"}
            title={collapsed ? "Agrandir la sidebar" : "Réduire la sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen size={18} strokeWidth={1.8} />
            ) : (
              <PanelLeftClose size={18} strokeWidth={1.8} />
            )}
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div ref={notificationRef} className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications((previous) => !previous)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#E7DED2] bg-white text-[#C96A26] shadow-sm"
              aria-label={`Notifications${notifications.length ? ` (${notifications.length} nouvelles)` : ""}`}
              aria-expanded={showNotifications}
            >
              <Bell size={17} strokeWidth={1.8} />
              {notifications.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C96A26] px-1 text-[9px] font-bold text-white">
                  {notifications.length > 9 ? "9+" : notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 z-50 w-[min(350px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-[#E7DED2] bg-white shadow-[0_14px_36px_rgba(17,17,17,0.12)]">
                <div className="flex items-center justify-between border-b border-[#EFE7DC] px-4 py-3">
                  <p className="text-sm font-bold text-velora-dark">Notifications</p>
                  {notifications.length > 0 && (
                    <button type="button" onClick={markNotificationsAsRead} className="text-[11px] font-semibold text-velora-gold hover:text-velora-dark">
                      Tout lire
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-center text-xs text-velora-textGray">Aucune nouvelle commande.</p>
                ) : (
                  <div className="max-h-80 divide-y divide-[#EFE7DC] overflow-y-auto">
                    {notifications.map((order) => (
                      <Link
                        key={order._id}
                        to={`/admin/orders/${order._id}`}
                        onClick={markNotificationsAsRead}
                        className="block px-4 py-3 transition-colors hover:bg-[#FCFAF7]"
                      >
                        <p className="text-xs font-bold text-velora-dark">Nouvelle commande {order.orderNumber || ""}</p>
                        <p className="mt-1 text-xs text-velora-textGray">{order.shippingAddress?.fullName || "Client invité"} · {Number(order.totalPrice || 0).toFixed(2)} DT</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}