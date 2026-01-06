import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const context = createContext(null);

export const StoreContext = ({ children }) => {
  const [sarees, setSarees] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [cartItem, setCartItem] = useState({});

  const url = "https://handloom-saree-e-commerce-webapp-1-hcwc.onrender.com";

  // 🔹 Fetch sarees
  useEffect(() => {
    const fetchSarees = async () => {
      try {
        const res = await axios.get(`${url}/api/saree/list`);
        setSarees(res.data?.data || res.data?.sarees || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSarees();
  }, []);

  // Load cart from backend (ONLY once per login)
 const loadCartData = async () => {
  if (!token) {
    setCartItem({});
    return;
  }

  try {
    const res = await axios.get(`${url}/api/cart/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data.success) {
      setCartItem(res.data.cartData || {});
    } else {
      setCartItem({});  
    }
  } catch (err) {
    console.error("Cart load error:", err);
    setCartItem({});  
  }
};

const filteredSarees = sarees.filter((item) =>
  item.name.toLowerCase().includes(searchText.toLowerCase()) ||
  item.category?.toLowerCase().includes(searchText.toLowerCase())
);



  useEffect(() => {
    loadCartData();
  }, [token]);

  // 🔹 Add to cart
  const addToCart = async (id) => {
  if (!token) return;

  setCartItem((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
 await axios.post(
  `${url}/api/cart/add`,
  { id },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

};


  // 🔹 Remove from cart
 const removeFromCart = async (id) => {
  if (!token) return;

  setCartItem((prev) => {
    const updated = { ...prev };
    if (updated[id] > 1) updated[id]--;
    else delete updated[id];
    return updated;
  });

 await axios.post(
  `${url}/api/cart/remove`,
  { id },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

};


   

  //  Total amount
  const getTotalCartAmount = () =>
    sarees.reduce(
      (acc, item) => acc + (cartItem[item._id] || 0) * item.price,
      0
    );

    const logout = () => {
  localStorage.removeItem("token");
  setToken("");
  setCartItem({});
};


  
  


  return (
    <context.Provider
      value={{
        sarees,
        cartItem,
        addToCart,
        removeFromCart,
         filteredSarees,  
    searchText,       
    setSearchText, 
        url,
        token,
        setToken,
        getTotalCartAmount,
         logout
      }}
    >
      {children}
    </context.Provider>
  );
};

export default StoreContext;
