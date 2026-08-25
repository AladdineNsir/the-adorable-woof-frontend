import React from "react";

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F5EF]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#C89B5A] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#1F1713] font-medium">
            Chargement...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}