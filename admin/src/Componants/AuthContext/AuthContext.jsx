import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children, url }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on app startup
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      // If no token exists, not authenticated
      if (!storedToken) {
        setLoading(false);
        setIsAuthenticated(false);
        return;
      }

      // If token exists but no user data, invalid state - clear both
      if (!storedUser) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setLoading(false);
        setIsAuthenticated(false);
        return;
      }

      try {
        const userData = JSON.parse(storedUser);
        
        // Verify this is an admin user
        if (userData.role !== "admin") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
          setLoading(false);
          setIsAuthenticated(false);
          return;
        }

        setUser(userData);
        setToken(storedToken);
        setIsAuthenticated(true);
        
        // Also set axios default header
        axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        
      } catch (e) {
        console.error("Error parsing stored user:", e);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData, authToken) => {
    // Store token and user in localStorage
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    
    // Update state
    setToken(authToken);
    setUser(userData);
    setIsAuthenticated(true);
    
    // Set axios default header
    axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common["Authorization"];
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
