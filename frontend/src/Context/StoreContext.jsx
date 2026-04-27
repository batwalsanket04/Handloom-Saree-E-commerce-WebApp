import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const context = createContext(null);

export const StoreContext = ({ children }) => {
  const url =
    import.meta.env.VITE_API_URL || "http://localhost:4000";

  /* -------------------- STATES -------------------- */
  const [sarees, setSarees] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [wishlist, setWishlist] = useState([]);

  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored && stored !== "undefined"
        ? JSON.parse(stored)
        : null;
    } catch {
      return null;
    } 
  });

  const [cartItem, setCartItem] = useState(() => {
    try {
      const stored = localStorage.getItem("cartItem");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  
  useEffect(() => {
    localStorage.setItem("cartItem", JSON.stringify(cartItem));
  }, [cartItem]);

  /* -------------------- SETUP AXIOS DEFAULTS -------------------- */
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  /* -------------------- RESTORE LOGIN ON REFRESH -------------------- */
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) setToken(savedToken);

    if (savedUser && savedUser !== "undefined") {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  /* -------------------- VERIFY USER ON MOUNT -------------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const verifyUser = async () => {
      try {
        const res = await axios.get(`${url}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setUser(res.data.user);
          setToken(token);
        } else {
          logout();
        }
      } catch (error) {
        console.error("User verification failed:", error);
        logout();
      }
    };

    verifyUser();
  }, []);

  /* -------------------- FETCH SAREES -------------------- */
  useEffect(() => {
    const fetchSarees = async () => {
      try {
        const res = await axios.get(`${url}/api/saree/list`);
        setSarees(res.data?.data || res.data?.sarees || []);
      } catch (error) {
        console.error("Saree fetch error:", error);
      }
    };
    fetchSarees();
  }, []);

  /* -------------------- LOAD CART DATA -------------------- */
  useEffect(() => {
    if (!token) return;

    const loadCartData = async () => {
      try {
        const res = await axios.post(
          `${url}/api/cart/get`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) {
          setCartItem(res.data.cartData || {});
        }
      } catch (err) {
        console.error("Cart load error:", err);
      }
    };

    loadCartData();
  }, [token, url]);

  /* -------------------- LOAD WISHLIST -------------------- */
  useEffect(() => {
    const loadWishlist = async () => {
      const t = localStorage.getItem("token") || token;
      if (!t) return;
      try {
        const res = await axios.get(`${url}/api/wishlist/`, {
          headers: { Authorization: `Bearer ${t}` },
        });
        setWishlist(res.data?.wishlist || []);
      } catch (err) {
        console.error("Wishlist load error:", err);
      }
    };
    loadWishlist();
  }, [token, url]);

  /* -------------------- CART OPERATIONS -------------------- */
  const addToCart = async (id) => {
    if (!token) return;

    // Optimistic update
    setCartItem(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

    try {
      await axios.post(
        `${url}/api/cart/add`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Add to cart error:", error);
      // Revert optimistic update on error
      setCartItem(prev => {
        const updated = { ...prev };
        updated[id] = Math.max(0, (updated[id] || 1) - 1);
        if (updated[id] === 0) delete updated[id];
        return updated;
      });
    }
  };

  const removeFromCart = async (id) => {
    if (!token) return;

    // Optimistic update
    setCartItem((prev) => {
      const updated = { ...prev };
      if (updated[id] > 1) {
        updated[id] -= 1;
      } else {
        delete updated[id];
      }
      return updated;
    });

    try {
      await axios.post(
        `${url}/api/cart/remove`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Remove from cart error:", error);
      // Revert optimistic update on error
      setCartItem(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    }
  };

  /* -------------------- TOTAL AMOUNT -------------------- */
  const getTotalCartAmount = () =>
    sarees.reduce(
      (total, item) =>
        total + (cartItem[item._id] || 0) * (Number(item.price) || 0),
      0
    );

  /* -------------------- WISHLIST OPERATIONS -------------------- */
  const isInWishlist = (id) => wishlist.some((s) => (s && s._id ? s._id === id : s === id));

  const addToWishlist = async (sareeId) => {
    if (!token) return;
    try {
      const res = await axios.post(
        `${url}/api/wishlist/add`,
        { sareeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setWishlist(res.data?.wishlist || []);
      }
    } catch (err) {
      console.error("Add to wishlist error:", err);
    }
  };

  const removeFromWishlist = async (sareeId) => {
    if (!token) return;
    try {
      const res = await axios.post(
        `${url}/api/wishlist/remove`,
        { sareeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setWishlist(res.data?.wishlist || []);
      }
    } catch (err) {
      console.error("Remove from wishlist error:", err);
    }
  };

  /* -------------------- LOGOUT -------------------- */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cartItem");
    setToken("");
    setUser(null);
    setCartItem({});
    setWishlist([]);
    delete axios.defaults.headers.common["Authorization"];
  };

  /* -------------------- SEARCH & FILTER -------------------- */
  const filteredSarees = sarees.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Remote search API
  const remoteSearch = async (q) => {
    try {
      const res = await axios.get(`${url}/api/saree/search`, { params: { q } });
      return res.data?.data || [];
    } catch (err) {
      console.error("Remote search error:", err);
      return [];
    }
  };

  const getRelatedProducts = async (id) => {
    try {
      const res = await axios.get(`${url}/api/saree/related/${id}`);
      return res.data?.data || [];
    } catch (err) {
      console.error("Related fetch error:", err);
      return [];
    }
  };

  return (
    <context.Provider
      value={{
        sarees,
        filteredSarees,
        cartItem,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        searchText,
        setSearchText,
        token,
        setToken,
        user,
        setUser,
        logout,
        url,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        remoteSearch,
        getRelatedProducts,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default StoreContext;
