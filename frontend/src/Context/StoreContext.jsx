import React, { createContext, useEffect, useState, useCallback } from "react";

import api from "../api/axios";

export const context = createContext(null);

const StoreContext = ({ children }) => {
  const url = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const [sarees, setSarees] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("accessToken") || "");
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored && stored !== "undefined" ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [cartItem, setCartItem] = useState({});
  const [loading, setLoading] = useState(true);

  const loadCartData = useCallback(async () => {
    if (!token) {
      const stored = localStorage.getItem("cartItem");
      setCartItem(stored ? JSON.parse(stored) : {});
      return;
    }

    try {
      const res = await api.post("/cart/get", {});
      setCartItem(res.data?.cartData || {});
    } catch (err) {
      console.error("Cart load error:", err);
    }
  }, [token, url]);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/user/profile");

        if (res.data.success) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        } else {
          logout();
        }
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, url]);

  useEffect(() => {
    const fetchSarees = async () => {
      try {
        const res = await api.get("/saree/list");
        setSarees(res.data?.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSarees();
  }, [url]);

  useEffect(() => {
    loadCartData();
  }, [loadCartData]);

  useEffect(() => {
    if (!token) {
      localStorage.setItem("cartItem", JSON.stringify(cartItem));
    }
  }, [cartItem, token]);

  useEffect(() => {
    if (!token) {
      setWishlist([]);
      return;
    }

    const loadWishlist = async () => {
      try {
        const res = await api.get("/wishlist");
        setWishlist(res.data?.wishlist || []);
      } catch (err) {
        console.error("Wishlist error:", err);
      }
    };

    loadWishlist();
  }, [token, url]);

  const login = useCallback((userData, accessToken) => {
    setToken(accessToken);
    setUser(userData);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/user/logout");
    } catch (error) {
      console.log(error);
    }

    setToken("");
    setUser(null);
    setCartItem({});
    setWishlist([]);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }, []);

  const addToCart = useCallback(async (id) => {
    if (!token) {
      setCartItem((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
      }));
      return;
    }

    try {
      const res = await api.post("/cart/add", { id });
      setCartItem(res.data?.cartData || {});
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const removeFromCart = useCallback(async (id) => {
    if (!token) {
      setCartItem((prev) => {
        const updated = { ...prev };
        if (updated[id] > 1) updated[id]--;
        else delete updated[id];
        return updated;
      });
      return;
    }

    try {
      const res = await api.post("/cart/remove", { id });
      setCartItem(res.data?.cartData || {});
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const addToWishlist = useCallback(async (id) => {
    if (!token) return;
    try {
      const res = await api.post("/wishlist/add", { sareeId: id });
      setWishlist(res.data?.wishlist || []);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const removeFromWishlist = useCallback(async (id) => {
    if (!token) return;
    try {
      const res = await api.post("/wishlist/remove", { sareeId: id });
      setWishlist(res.data?.wishlist || []);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const isInWishlist = useCallback(
    (id) => wishlist.some((item) => item._id === id || item === id || item.id === id),
    [wishlist]
  );

  const getTotalCartAmount = useCallback(() => {
    return sarees.reduce(
      (total, item) => total + (cartItem[item._id] || cartItem[item.id] || 0) * (Number(item.price) || 0),
      0
    );
  }, [sarees, cartItem]);

  const filteredSarees = sarees.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchText.toLowerCase())
  );

  const value = {
    url,
    sarees: filteredSarees,
    filteredSarees,
    searchText,
    setSearchText,
    token,
    user,
    cartItem,
    wishlist,
    loading,
    login,
    logout,
    addToCart,
    removeFromCart,
    loadCartData,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getTotalCartAmount,
  };

  return <context.Provider value={value}>{children}</context.Provider>;
};

export default StoreContext;
