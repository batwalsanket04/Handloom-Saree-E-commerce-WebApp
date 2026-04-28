import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { context } from '../Context/StoreContext';

const ProtectedRoute = ({ children, requireAuth = true, allowedRoles = [] }) => {
  const { token, user, loading } = useContext(context);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If user is logged in but trying to access login page
  if (token && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  // If specific roles are required
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;