import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const RequireAdmin = ({ children, url }) => {
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setOk(false);
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${url}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.user?.role === "admin") setOk(true);
      } catch (err) {
        setOk(false);
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [url]);

  if (loading) return <div className="p-6">Checking permissions...</div>;
  if (!ok) return <Navigate to="/login" replace />;
  return children;
};

export default RequireAdmin;
