import React from "react";
import { UserCircle2 } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md fixed w-full h-[70px] left-0 z-50 flex items-center overflow-hidden px-4 sm:px-6">
      <div className="container max-w-screen-xl mx-auto flex justify-between items-center">
        
        {/* Left: Brand */}
        <h1 className="text-xl sm:text-2xl md:text-2xl font-serif text-pink-700 cursor-pointer">
          Handloom Sarees
        </h1>

        {/* Right: Admin Panel + Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          <h4 className="text-sm sm:text-base md:text-lg font-medium text-gray-700">
            Admin Panel
          </h4>
          <UserCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700 cursor-pointer hover:text-pink-600 transition" />
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
