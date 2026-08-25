import { Outlet } from "react-router-dom";
import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  return (
    <div className="min-h-screen bg-[#F7F3EC] text-velora-dark">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex min-h-screen flex-col lg:pl-72">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
