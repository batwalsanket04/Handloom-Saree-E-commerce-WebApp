import React from "react";
import { UserCircle2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../AuthContext/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

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
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <p className="text-xs sm:text-sm font-medium text-gray-700">{user?.name || "Admin"}</p>
              <button
                onClick={handleLogout}
                className="text-xs text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
            <UserCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700 cursor-pointer hover:text-pink-600 transition" />
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
