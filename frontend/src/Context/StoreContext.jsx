import React, { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

export const context = createContext(null);

const StoreContext = ({ children }) => {
  const url = import.meta.env.VITE_API_URL || "http://localhost:4000";

  /* -------------------- STATES -------------------- */
  const [sarees, setSarees] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
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

  /* -------------------- LOAD CART DATA (exposed for components) -------------------- */
  const loadCartData = useCallback(async () => {
    if (!token) {
      const stored = localStorage.getItem("cartItem");
      setCartItem(stored ? JSON.parse(stored) : {});
      return;
    }

    try {
      const res = await axios.post(`${url}/api/cart/get`, {});
      setCartItem(res.data?.cartData || {});
    } catch (err) {
      console.error("Cart load error:", err);
    }
  }, [token, url]);

  /* -------------------- AXIOS SETUP -------------------- */
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  /* -------------------- VERIFY TOKEN -------------------- */
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${url}/api/user/profile`);
        if (res.data.success) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        } else {
          logout();
        }
      } catch (err) {
        if (err.response?.status === 401) logout();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, url]);

  /* -------------------- FETCH SAREES -------------------- */
  useEffect(() => {
    const fetchSarees = async () => {
      try {
            const res = await axios.get(`${url}/api/saree/list`);
        setSarees(res.data?.data || []);
      } catch (err) {
        console.error("Saree fetch error:", err);
      }
    };

    fetchSarees();
  }, [url]);

  /* -------------------- CART LOAD -------------------- */
  useEffect(() => {
    loadCartData();
  }, [loadCartData]);

  /* -------------------- SAVE LOCAL CART -------------------- */
  useEffect(() => {
    if (!token) {
      localStorage.setItem("cartItem", JSON.stringify(cartItem));
    }
  }, [cartItem, token]);

  /* -------------------- LOAD WISHLIST -------------------- */
  useEffect(() => {
    if (!token) {
      setWishlist([]);
      return;
    }

    const loadWishlist = async () => {
      try {
        const res = await axios.get(`${url}/api/wishlist`);
        setWishlist(res.data?.wishlist || []);
      } catch (err) {
        console.error("Wishlist error:", err);
      }
    };

    loadWishlist();
  }, [token, url]);

  /* -------------------- AUTH -------------------- */
  const login = useCallback((userData, userToken) => {
    setToken(userToken);
    setUser(userData);
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setToken("");
    setUser(null);
    setCartItem({});
    setWishlist([]);
    localStorage.clear();
    delete axios.defaults.headers.common["Authorization"];
  }, []);

  /* -------------------- CART -------------------- */
  const addToCart = useCallback(
    async (id) => {
      if (!token) {
        setCartItem((prev) => ({
          ...prev,
          [id]: (prev[id] || 0) + 1,
        }));
        return;
      }

      try {
        const res = await axios.post(`${url}/api/cart/add`, { id });
        setCartItem(res.data?.cartData || {});
      } catch (err) {
        console.error(err);
      }
    },
    [token, url]
  );

  const removeFromCart = useCallback(
    async (id) => {
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
        const res = await axios.post(`${url}/api/cart/remove`, { id });
        setCartItem(res.data?.cartData || {});
      } catch (err) {
        console.error(err);
      }
    },
    [token, url]
  );

  /* -------------------- WISHLIST -------------------- */
  const addToWishlist = useCallback(
    async (id) => {
      if (!token) return;
      try {
        const res = await axios.post(`${url}/api/wishlist/add`, { sareeId: id });
        setWishlist(res.data?.wishlist || []);
      } catch (err) {
        console.error(err);
      }
    },
    [token, url]
  );

  const removeFromWishlist = useCallback(
    async (id) => {
      if (!token) return;
      try {
        const res = await axios.post(`${url}/api/wishlist/remove`, { sareeId: id });
        setWishlist(res.data?.wishlist || []);
      } catch (err) {
        console.error(err);
      }
    },
    [token, url]
  );

  const isInWishlist = useCallback(
    (id) => wishlist.some((item) => item._id === id || item === id),
    [wishlist]
  );

  /* -------------------- TOTAL -------------------- */
  const getTotalCartAmount = useCallback(() => {
    return sarees.reduce(
      (total, item) =>
        total + (cartItem[item._id] || 0) * (Number(item.price) || 0),
      0
    );
  }, [sarees, cartItem]);

  /* -------------------- FILTER -------------------- */
const filteredSarees = sarees.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchText.toLowerCase())
  );

  /* -------------------- CONTEXT VALUE -------------------- */
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
