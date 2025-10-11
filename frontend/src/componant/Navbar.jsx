import React, { useContext, useState } from "react";
import { Menu, X, ShoppingCart, Search } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { context } from "../Context/StoreContext";

const Navbar = ({setShowLogine}) => {
  const nav=useNavigate();
  const {cartItem,getTotalCartAmount}=useContext(context);

  const [isOpen, setIsOpen] = useState(false);

  const totalItem= Object.values(cartItem).reduce((sum,qty)=>sum+qty,0)

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="container max-w-screen-xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Brand Logo */}
        <h1 className="text-2xl font-serif text-pink-700 whitespace-nowrap cursor-pointer" onClick={()=>nav('/')}>
          Handloom Sarees
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <li><NavLink to="/" className="hover:text-pink-600">Home</NavLink></li>
          <li><NavLink to="/collection" className="hover:text-pink-600">Collections</NavLink></li>
          <li><NavLink to="/about" className="hover:text-pink-600">About Us</NavLink></li>
          <li><NavLink to="/contact" className="hover:text-pink-600">Contact</NavLink></li>
        </ul>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* Search */}
          <button className="  text-gray-700 hover:text-pink-600">
            <Search size={22} />
          </button>

          {/* Cart */}
          <button className="relative text-gray-700 hover:text-pink-600" onClick={()=>nav('/cart')}>
            <ShoppingCart size={22}  />
            
            {totalItem>0 &&
            <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {totalItem}
            </span>

}
          </button>
            

          {/* CTA Button */}
          <button className="hidden md:block bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition"onClick={()=>setShowLogine(true)} >
            Sign In
          </button>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} />:<Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-4">
          <NavLink to="/" className="block text-gray-700 hover:text-pink-600">Home</NavLink>
          <NavLink to="/collection" className="block text-gray-700 hover:text-pink-600">Collections</NavLink>
          <NavLink to="/about" className="block text-gray-700 hover:text-pink-600">About Us</NavLink>
          <NavLink to="/contact" className="block text-gray-700 hover:text-pink-600">Contact</NavLink>
          <button className="w-full bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700"onClick={()=>setShowLogine(true)} >
            Sign In
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
