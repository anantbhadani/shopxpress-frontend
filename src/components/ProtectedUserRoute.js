import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedUserRoute = ({ children }) => {
  const userRole = localStorage.getItem("userRole");
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  // If admin tries to access user routes, redirect to admin dashboard
  if (userRole === "admin" && isAuthenticated === "true") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
};

export default ProtectedUserRoute;

