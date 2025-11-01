// src/components/Navbar.jsx
import React, { useContext, useState, useEffect } from "react";
import { Menu, X, ShoppingCart, Search } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
 import{context} from "../Context/StoreContext"
import { FaUserCircle, FaSignOutAlt, FaBoxOpen } from "react-icons/fa";

const Navbar = ({ setShowLogine }) => {
  const nav = useNavigate();
  const { cartItem,setCartItem,token, setToken } = useContext(context);
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // load token on refresh
  useEffect(() => {
    const savedToken = sessionStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, [setToken]);

  const totalItem = Object.values(cartItem).reduce((sum, qty) => sum + qty, 0);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setToken("");
    setCartItem({});
    setShowDropdown(false);
    nav("/");
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="container max-w-screen-xl mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-serif text-pink-700 cursor-pointer" onClick={() => nav("/")}>
          Handloom Sarees
        </h1>

        <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <li><NavLink to="/" className="hover:text-pink-600">Home</NavLink></li>
          <li><NavLink to="/collection" className="hover:text-pink-600">Collections</NavLink></li>
          <li><NavLink to="/about" className="hover:text-pink-600">About Us</NavLink></li>
          <li><NavLink to="/contact" className="hover:text-pink-600">Contact</NavLink></li>
        </ul>

        <div className="flex items-center space-x-6 relative">
          <button className="text-gray-700 hover:text-pink-600">
            <Search size={22} />
          </button>

          <button className="relative text-gray-700 hover:text-pink-600" onClick={() => nav("/cart")}>
            <ShoppingCart size={22} />
            {totalItem > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItem}
              </span>
            )}
          </button>

          {!token ? (
  <button
    className="hidden md:block bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700"
    onClick={() => setShowLogine(true)}
  >
    Sign In
  </button>
) : (
  <div
    className="relative"
    onMouseEnter={() => setShowDropdown(true)}
    onMouseLeave={() => setShowDropdown(false)}
  >
    <FaUserCircle className="text-3xl text-gray-700 cursor-pointer hover:text-pink-600" />
    {showDropdown && (
      <ul className="absolute right-0 mt-2 w-40 bg-white shadow-lg border rounded-lg text-gray-700">
        <li
          className="px-4 py-2 hover:bg-pink-100 flex items-center gap-2 cursor-pointer"
          onClick={() => { setShowDropdown(false); nav("/myorders"); }}
        >
          <FaBoxOpen /> Orders
        </li>
        <hr />
        <li
          className="px-4 py-2 hover:bg-pink-100 flex items-center gap-2 cursor-pointer text-red-600"
          onClick={handleLogout}
        >
          <FaSignOutAlt /> Logout
        </li>
      </ul>
    )}
  </div>
)}

          <button className="md:hidden text-gray-700" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-4">
          <NavLink to="/" className="block text-gray-700 hover:text-pink-600">Home</NavLink>
          <NavLink to="/collection" className="block text-gray-700 hover:text-pink-600">Collections</NavLink>
          <NavLink to="/about" className="block text-gray-700 hover:text-pink-600">About Us</NavLink>
          <NavLink to="/contact" className="block text-gray-700 hover:text-pink-600">Contact</NavLink>
          {!token ? (
            <button
              className="w-full bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700"
              onClick={() => setShowLogine(true)}
            >
              Sign In
            </button>
          ) : (
            <button
              className="w-full bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
