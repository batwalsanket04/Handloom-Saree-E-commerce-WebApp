import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";

const RequireAdmin = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  // Check if user is authenticated and has admin role
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAdmin;
