// src/components/Navbar.jsx
import React, { useContext, useState, useEffect } from "react";
import { Menu, X, ShoppingCart, Search } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { context } from "../Context/StoreContext";
import { FaUserCircle, FaSignOutAlt, FaBoxOpen } from "react-icons/fa";

const Navbar = ({ setShowLogine }) => {
  const nav = useNavigate();

  const {
    cartItem,
    setCartItem,
    token,
    setToken,
    searchText,
    setSearchText,
  } = useContext(context);

  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // verify token on refresh
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    fetch("http://localhost:5000/api/verify", {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) setToken(storedToken);
        else {
          localStorage.removeItem("token");
          setToken("");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        setToken("");
      });
  }, [setToken]);

  const totalItem = Object.values(cartItem).reduce(
    (sum, qty) => sum + qty,
    0
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItem({});
    nav("/");
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="container max-w-screen-xl mx-auto flex justify-between items-center px-6 py-4">
        <h1
          className="text-2xl font-serif text-pink-700 cursor-pointer"
          onClick={() => nav("/")}
        >
          Handloom Sarees
        </h1>

        <ul className="hidden md:flex space-x-8">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/collection">Collections</NavLink>
          <NavLink to="/about">About Us</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </ul>

        <div className="flex items-center space-x-6">
          {/* SEARCH */}
          <button
            onClick={() => {
              setShowSearch((prev) => !prev);
              nav("/collection");
            }}
          >
            <Search />
          </button>

          {/* CART */}
          <button onClick={() => nav("/cart")} className="relative">
            <ShoppingCart />
            {totalItem > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItem}
              </span>
            )}
          </button>

          {/* AUTH */}
          {!token ? (
            <button
              className="bg-pink-600 text-white px-4 py-2 rounded-full"
              onClick={() => setShowLogine(true)}
            >
              Sign In
            </button>
          ) : (
            <div
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
              className="relative"
            >
              <FaUserCircle size={28} />
              {showDropdown && (
                <ul className="absolute right-0 bg-white shadow-md w-36">
                  <li onClick={() => nav("/myorders")}>Orders</li>
                  <li onClick={handleLogout} className="text-red-600">
                    Logout
                  </li>
                </ul>
              )}
            </div>
          )}

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      {showSearch && (
        <div className="bg-white shadow-md px-6 py-3">
          <input
            type="text"
            placeholder="Search sarees..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full border rounded-full px-4 py-2"
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
