import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { context } from '../Context/StoreContext';

/**
 * ProtectedRoute Component
 * Ensures only authenticated users can access certain routes
 * Redirects to home if user is not logged in
 */
export const ProtectedRoute = ({ children }) => {
  const { token } = useContext(context);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * AdminRoute Component
 * Ensures only admin users can access admin routes
 * Redirects to home if user is not an admin
 */
export const AdminRoute = ({ children }) => {
  const { token, user } = useContext(context);

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
