import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import axios from "axios";

const RequireAdmin = ({ children }) => {
  const { isAuthenticated, user, token } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsValid(false);
        return;
      }

      setIsVerifying(true);
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/user/verify-token`);
        
        if (!res.data.success || !res.data.valid) {
          setIsValid(false);
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        setIsValid(false);
      } finally {
        setIsVerifying(false);
      }
    };

    // Only verify if we have a token and think we're authenticated
    if (isAuthenticated && token) {
      verifyToken();
    }
  }, [isAuthenticated, token]);

  // Show loading while verifying
  if (isVerifying) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-pink-600">Verifying...</div>
      </div>
    );
  }

  // Check if user is authenticated and has admin role
  if (!isAuthenticated || !isValid || user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAdmin;
