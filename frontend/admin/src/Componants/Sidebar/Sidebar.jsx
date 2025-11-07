import React from "react";
import { PlusCircle, List, ShoppingCart } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-white shadow-lg rounded-r-3xl p-6 flex flex-col gap-4 sticky top-0 mt-[100px]">
      <NavLink
        to="/add"
        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-300 hover:border-pink-500 hover:bg-pink-50 cursor-pointer transition"
      >
        <PlusCircle className="w-6 h-6 text-pink-600" />
        <p className="text-gray-700 font-medium">Add Items</p>
      </NavLink>

      <NavLink
        to="/list"
        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-300 hover:border-pink-500 hover:bg-pink-50 cursor-pointer transition"
      >
        <List className="w-6 h-6 text-pink-600" />
        <p className="text-gray-700 font-medium">List Items</p>
      </NavLink>

      <NavLink
        to="/order"
        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-300 hover:border-pink-500 hover:bg-pink-50 cursor-pointer transition"
      >
        <ShoppingCart className="w-6 h-6 text-pink-600" />
        <p className="text-gray-700 font-medium">Orders</p>
      </NavLink>
    </aside>
  );
};

export default Sidebar;
