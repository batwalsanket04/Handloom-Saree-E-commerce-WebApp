import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const context = createContext(null);

 export const StoreContext = ({ children }) => {
  const [sarees, setSarees] = useState([]);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [cartItem, setCartItem] = useState(() => {
    //  Load saved cart from localStorage on first render
    const savedCart = localStorage.getItem("cartData");
    return savedCart ? JSON.parse(savedCart) : {};
  });

  const url = "http://localhost:4000"; // backend URL

  //  Fetch saree list
  useEffect(() => {
  const fetchSarees = async () => {
    try {
      const res = await axios.get(`${url}/api/saree/list`);
      const sareeData = res.data?.data || res.data?.sarees || [];
      setSarees(sareeData);
    } catch (err) {
      console.error("Error fetching sarees:", err);
    }
  };
  fetchSarees();
}, []);


  //  Fetch cart from backend when token available
  const loadCartData = async (token) => {
  try {
    const res = await axios.post(`${url}/api/cart/get`, {}, { headers: { token } });
    const cart = res.data?.cartData || {};
    setCartItem(cart);
    localStorage.setItem("cartData", JSON.stringify(cart));
  } catch (err) {
    console.error("Error loading cart data:", err);
  }
};


  //  Auto-load cart when token changes
  useEffect(() => {
    if (token) {
      loadCartData(token);
    }
  }, [token]);

  //  Keep localStorage in sync whenever cart changes
  useEffect(() => {
    localStorage.setItem("cartData", JSON.stringify(cartItem));
  }, [cartItem]);

  //  Add to cart
  const addToCart = async (id) => {
    setCartItem((prev) => ({ ...prev, [id]: prev[id] ? prev[id] + 1 : 1 }));

    if (token) {
      try {
        await axios.post(`${url}/api/cart/add`, { id }, { headers: { token } });
      } catch (err) {
        console.error("Error adding to cart:", err);
      }
    }
  };

  //  Remove from cart
  const removeFromCart = async (id) => {
    setCartItem((prev) => {
      if (!prev[id]) return prev;
      const qty = prev[id] - 1;
      if (qty <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: qty };
    });

    if (token) {
      try {
        await axios.post(`${url}/api/cart/remove`, { id }, { headers: { token } });
      } catch (err) {
        console.error("Error removing from cart:", err);
      }
    }
  };

  //  Get total amount
  const getTotalCartAmount = () => {
    return sarees.reduce((acc, item) => {
      const qty = cartItem[item._id] || 0;
      return acc + item.price * qty;
    }, 0);
  };

  //  Optional: clear everything on logout
  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setCartItem({});
    localStorage.removeItem("cartData");
  };

  return (
    <context.Provider
      value={{
        sarees,
        cartItem,
        addToCart,
        setCartItem,
        removeFromCart,
        url,
        token,
        setToken,
        getTotalCartAmount,
        logout,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default StoreContext;
