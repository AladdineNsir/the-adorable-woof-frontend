import { useEffect, useRef, useState } from "react";
import { Bell, Inbox, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { getOrders } from "../../services/orderApi";

import { useAuth } from "../../context/AuthContext";

const formatNotificationTime = (dateValue) => {
  if (!dateValue) return "Il y a peu";

  const elapsedMinutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(dateValue).getTime()) / 60000)
  );

  if (elapsedMinutes < 1) return "À l’instant";
  if (elapsedMinutes < 60) return `Il y a ${elapsedMinutes} min`;

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `Il y a ${elapsedHours} h`;

  const elapsedDays = Math.floor(elapsedHours / 24);
  return `Il y a ${elapsedDays} j`;
};

export default function Topbar({
  onMenuClick = () => {},
  collapsed = false,
  onToggleSidebar = () => {},
}) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState("all");
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
        }

        if (active) {
          setNotifications(
            latestOrders.map((order) => ({
              ...order,
              isRead: storedIds.includes(order._id) || !storedIds.length,
            }))
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

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setShowNotifications(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  const markNotificationAsRead = (notificationId) => {
    const storedIds = JSON.parse(
      localStorage.getItem("velora_seen_order_notifications") || "[]"
    );
    localStorage.setItem(
      "velora_seen_order_notifications",
      JSON.stringify([...new Set([...storedIds, notificationId])])
    );
    setNotifications((currentNotifications) =>
      currentNotifications.map((order) =>
        order._id === notificationId ? { ...order, isRead: true } : order
      )
    );
  };

  const markNotificationsAsRead = () => {
    const currentIds = notifications.map((order) => order._id);
    const storedIds = JSON.parse(
      localStorage.getItem("velora_seen_order_notifications") || "[]"
    );
    localStorage.setItem(
      "velora_seen_order_notifications",
      JSON.stringify([...new Set([...storedIds, ...currentIds])])
    );
    setNotifications((currentNotifications) =>
      currentNotifications.map((order) => ({ ...order, isRead: true }))
    );
  };

  const unreadNotifications = notifications.filter((order) => !order.isRead);
  const visibleNotifications =
    notificationFilter === "unread" ? unreadNotifications : notifications;

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
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#E7DED2] bg-white text-velora-gold shadow-sm"
              aria-label={`Notifications${unreadNotifications.length ? ` (${unreadNotifications.length} nouvelles)` : ""}`}
              aria-expanded={showNotifications}
              aria-haspopup="true"
            >
              <Bell size={17} strokeWidth={1.8} />
              {unreadNotifications.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-velora-gold px-1 text-[9px] font-bold text-white">
                  {unreadNotifications.length > 9 ? "9+" : unreadNotifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[min(376px,calc(100vw-1.5rem))] overflow-hidden rounded-[16px] border border-[#E7DED2] bg-velora-cream shadow-[0_18px_42px_rgba(77,54,35,0.14)]">
                <div className="border-b border-[#EFE7DC] px-5 pb-3 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-premium text-base font-semibold text-velora-dark">Notifications</p>
                      <p className="mt-0.5 text-[11px] text-velora-textGray">
                        {unreadNotifications.length
                          ? `${unreadNotifications.length} non lue${unreadNotifications.length > 1 ? "s" : ""}`
                          : "Tout est à jour"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={markNotificationsAsRead}
                      disabled={unreadNotifications.length === 0}
                      className="text-[11px] font-semibold text-velora-gold transition-colors hover:text-velora-goldHover disabled:cursor-default disabled:opacity-45"
                    >
                      Tout lire
                    </button>
                  </div>

                  <div className="mt-3 flex gap-5" role="tablist" aria-label="Filtrer les notifications">
                    {[
                      ["all", "Toutes"],
                      ["unread", "Non lues"],
                    ].map(([filter, label]) => (
                      <button
                        key={filter}
                        type="button"
                        role="tab"
                        aria-selected={notificationFilter === filter}
                        onClick={() => setNotificationFilter(filter)}
                        className={`border-b-2 pb-1 text-[11px] font-semibold transition-colors ${
                          notificationFilter === filter
                            ? "border-velora-gold text-velora-dark"
                            : "border-transparent text-velora-textGray hover:text-velora-dark"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {visibleNotifications.length === 0 ? (
                  <div className="flex flex-col items-center px-5 py-10 text-center">
                    <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#E7DED2] text-velora-gold">
                      <Inbox size={18} strokeWidth={1.5} />
                    </span>
                    <p className="font-premium text-sm font-semibold text-velora-dark">
                      {notificationFilter === "unread" ? "Aucune notification non lue" : "Aucune notification"}
                    </p>
                    <p className="mt-1 text-xs text-velora-textGray">Votre espace est à jour.</p>
                  </div>
                ) : (
                  <div className="max-h-[min(420px,60vh)] divide-y divide-[#EFE7DC] overflow-y-auto p-2">
                    {visibleNotifications.map((order) => (
                      <Link
                        key={order._id}
                        to={`/admin/orders/${order._id}`}
                        onClick={() => markNotificationAsRead(order._id)}
                        className={`group relative block rounded-xl px-4 py-3.5 pl-7 transition-colors hover:bg-white/55 focus-visible:bg-white/55 focus-visible:outline-none ${
                          order.isRead
                            ? "border border-[#EFE7DC]"
                            : "border border-velora-gold/30 bg-velora-ivory"
                        }`}
                      >
                        {!order.isRead && (
                          <span className="absolute left-3 top-[19px] h-1.5 w-1.5 rounded-full bg-velora-gold" aria-hidden="true" />
                        )}
                        <p className={`text-[13px] leading-5 ${order.isRead ? "font-medium text-velora-textGray" : "font-bold text-velora-dark"}`}>
                          Nouvelle commande {order.orderNumber || ""}
                        </p>
                        <p className={`mt-0.5 text-xs leading-5 ${order.isRead ? "text-velora-textGray" : "text-velora-dark/80"}`}>
                          {order.shippingAddress?.fullName || "Client invité"} · {Math.floor(Number(order.totalPrice || 0))} DT
                        </p>
                        <p className="mt-0.5 text-[11px] leading-4 text-velora-textGray">
                          {formatNotificationTime(order.createdAt)}
                        </p>
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