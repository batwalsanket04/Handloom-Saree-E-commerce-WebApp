import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const context = createContext(null);

export const StoreContext = ({ children }) => {
  const url =
    "https://handloom-saree-e-commerce-webapp-1-hcwc.onrender.com";

  /* -------------------- STATES -------------------- */
  const [sarees, setSarees] = useState([]);
  const [searchText, setSearchText] = useState("");

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

  const [cartItem, setCartItem] = useState({});
  
  useEffect(() => {
  localStorage.setItem("cartItem", JSON.stringify(cartItem));
}, [cartItem]);


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
  }, []);useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const verifyUser = async () => {
    try {
      const res = await axios.get(`${url}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data.user);
      setToken(token);
    } catch (error) {
    
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

  /* -------------------- LOAD CART (FIXED) -------------------- */
 // ONLY SHOWING FIXED PARTS (LOGIC ONLY)

const loadCartData = async () => {
  if (!token) return;

  try {
    const res = await axios.post(
      `${url}/api/cart/get`,
      {},
      { headers: { token } }
    );
    setCartItem(res.data?.cartData || {});
  } catch (err) {
    console.error(err);
  }
};

const addToCart = async (id) => {
  if (!token) return;

  setCartItem(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

  await axios.post(
    `${url}/api/cart/add`,
    { id },
    { headers: { token } }
  );
};

const removeFromCart = async (id) => {
  if (!token) return;

 setCartItem((prev) => {
    const updatedCart = { ...prev };
    delete updatedCart[id];
    return updatedCart;
  });

  await axios.post(
    `${url}/api/cart/remove`,
    { id },
    { headers: { token } }
  );
};


  /* -------------------- TOTAL AMOUNT -------------------- */
  const getTotalCartAmount = () =>
    sarees.reduce(
      (total, item) =>
        total + (cartItem[item._id] || 0) * item.price,
      0
    );

  /* -------------------- LOGOUT -------------------- */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
    setCartItem({});
  };

  /* -------------------- SEARCH FILTER -------------------- */
  const filteredSarees = sarees.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchText.toLowerCase())
  );

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
        loadCartData
      }}
    >
      {children}
    </context.Provider>
  );
};

export default StoreContext;
