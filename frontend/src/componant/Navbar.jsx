// src/components/Navbar.jsx
import React, { useContext, useState } from "react";
import { Menu, X, ShoppingCart, Search } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { context } from "../Context/StoreContext";
import { FaUserCircle, FaSignOutAlt, FaBoxOpen } from "react-icons/fa";

const Navbar = ({ setShowLogine }) => {
  const nav = useNavigate();

  const {
    cartItem,
    token,
    searchText,
    setSearchText,
    user,
    logout,
  } = useContext(context);

  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const totalItem = Object.values(cartItem).reduce(
    (sum, qty) => sum + qty,
    0
  );

  

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    nav("/");
    
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      {/* MAIN BAR */}
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-6 py-4">
        <h1
          className="text-2xl font-serif text-pink-700 cursor-pointer"
          onClick={() => nav("/")}
        >
          Handloom Sarees
        </h1>

        {/* DESKTOP LINKS */}
        <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
  <li><NavLink to="/">Home</NavLink></li>
  <li><NavLink to="/collection">Collections</NavLink></li>
  <li><NavLink to="/about">About</NavLink></li>
  <li><NavLink to="/contact">Contact</NavLink></li>
</ul>


        {/* RIGHT ICONS */}
        <div className="flex items-center gap-6">
          {/* SEARCH */}
          <button
            onClick={() => {
              setShowSearch(!showSearch);
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

          {/* AUTH DESKTOP */}
          {!token ? (
            <button
              className="hidden md:block bg-pink-600 text-white px-4 py-2 rounded-full"
              onClick={() => setShowLogine(true)}
            >
              Sign In
            </button>
          ) : (
            <div
              className="hidden md:flex items-center gap-2 relative cursor-pointer"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <span className="text-gray-700 font-medium">
                Hi, {user?.name || "User"}
              </span>
              <FaUserCircle size={28} className="text-pink-600" />

              {showDropdown && (
                <div className="absolute right-0 top-10 w-44 bg-white border shadow-lg rounded-xl">
                  <button
                    onClick={() => nav("/myorders")}
                    className="w-full px-4 py-3 flex gap-2 hover:bg-pink-50"
                  >
                    <FaBoxOpen /> My Orders
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 flex gap-2 text-red-600 hover:bg-red-50"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MOBILE TOGGLE */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      {showSearch && (
        <div className="bg-white px-6 py-3 shadow-md">
          <input
            type="text"
            placeholder="Search sarees..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full border rounded-full px-4 py-2"
          />
        </div>
      )}

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg border-t">
          <ul className="flex flex-col px-6 py-4 space-y-4 text-gray-700 font-medium">
            <li onClick={() => { nav("/"); setIsOpen(false); }}>Home</li>
            <li onClick={() => { nav("/collection"); setIsOpen(false); }}>Collections</li>
            <li onClick={() => { nav("/about"); setIsOpen(false); }}>About</li>
            <li onClick={() => { nav("/contact"); setIsOpen(false); }}>Contact</li>

            {!token ? (
              <li
                className="text-pink-600 font-semibold"
                onClick={() => {
                  setShowLogine(true);
                  setIsOpen(false);
                }}
              >
                Sign In
              </li>
            ) : (
              <>
                <li onClick={() => { nav("/myorders"); setIsOpen(false); }}>
                  My Orders
                </li>
                <li className="text-red-600" onClick={handleLogout}>
                  Logout
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
