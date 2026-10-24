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

  // Verify token with backend
  const verifyTokenWithBackend = async (storedToken) => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      const res = await axios.get(`${url}/api/user/verify-token`);
      
      // Check if response indicates success with valid token
      if (res.data.success && res.data.valid) {
        return res.data.user;
      }
      // Token is invalid (user no longer exists, role changed, etc.)
      return null;
    } catch (error) {
       
      if (error.response) {
        console.error("Token verification failed with status:", error.response.status);
      } else {
        console.error("Token verification failed:", error.message);
      }
      return null;
    }
  };

  // Check authentication on app startup - now with backend verification
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

      // If token exists but no user data, verify with backend
      if (!storedUser) {
        try {
          const userData = await verifyTokenWithBackend(storedToken);
          if (userData && userData.role === "admin") {
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
            setToken(storedToken);
            setIsAuthenticated(true);
          } else {
            // Token invalid or not admin
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
            delete axios.defaults.headers.common["Authorization"];
          }
        } catch (e) {
          console.error("Error verifying token:", e);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          delete axios.defaults.headers.common["Authorization"];
        }
        setLoading(false);
        return;
      }

      try {
        const userData = JSON.parse(storedUser);
        
        
        if (userData.role !== "admin") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
          setLoading(false);
          setIsAuthenticated(false);
          return;
        }

        // Verify token with backend to ensure it's still valid
        const verifiedUser = await verifyTokenWithBackend(storedToken);
        
        if (verifiedUser && verifiedUser.role === "admin") {
          // Token is valid, use verified user data
          setUser(verifiedUser);
          localStorage.setItem("user", JSON.stringify(verifiedUser));
          setToken(storedToken);
          setIsAuthenticated(true);
          axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        } else {
          // Token is invalid or expired - clear storage
          console.log("Token invalid or expired, clearing auth");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          delete axios.defaults.headers.common["Authorization"];
        }
        
      } catch (e) {
        console.error("Error parsing stored user:", e);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        delete axios.defaults.headers.common["Authorization"];
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [url]);

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
