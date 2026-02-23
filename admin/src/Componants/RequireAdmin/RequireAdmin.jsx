import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";

const RequireAdmin = ({ children, url }) => {
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const check = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      console.log("RequireAdmin check - Token:", token ? "✓ Exists" : "✗ Missing");
      
      if (!token) {
        console.log("No token found, denying access");
        setOk(false);
        setLoading(false);
        return;
      }
      try {
        console.log("Checking admin status with token...");
        const res = await axios.get(`${url}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Profile response:", res.data);
        
        if (res.data?.user?.role === "admin") {
          console.log("✓ Admin access granted");
          setOk(true);
        } else {
          console.log("✗ User is not admin. Role:", res.data?.user?.role);
          setOk(false);
        }
      } catch (err) {
        console.error("Profile check failed:", err.response?.data || err.message);
        setOk(false);
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [url, location.pathname]); // Re-check when route changes

  if (loading) return <div className="p-6 text-center font-medium">Checking admin permissions...</div>;
  if (!ok) {
    console.log("Access denied, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default RequireAdmin;
