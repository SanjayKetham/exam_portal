import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean; // optional prop to force admin-only route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly }) => {
  const { user } = useAuth(); // from AuthContext
  const location = useLocation();

  // Loading state check (if needed in AuthContext)
  if (user === undefined) {
    return <div>Loading...</div>; // or a spinner
  }

  const isAuthenticated = !!user;

  // 1️⃣ Redirect to login if not authenticated
  if (!isAuthenticated) {
    if (
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    ) {
      return <>{children}</>;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2️⃣ Already logged in → prevent accessing login/register
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") || location.pathname.includes("/register"))
  ) {
    return user.role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/portal/home" replace />
    );
  }

  // 3️⃣ Role-based protection
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/unauth-page" replace />;
  }

  if (!adminOnly && user.role === "admin" && location.pathname.includes("/portal")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // 4️⃣ Otherwise render children
  return <>{children}</>;
};

export default ProtectedRoute;
