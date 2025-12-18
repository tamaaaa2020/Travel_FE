import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiMapPin,
  FiAirplay,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const linkClass =
    "flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors";

  const active =
    "!bg-red-500 !text-white hover:!bg-red-600";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white border-r min-h-screen fixed flex flex-col">
      <div className="p-6 font-bold text-xl text-red-600 border-b mb-4">
        Ezytix Admin
      </div>

      <nav className="px-3 space-y-2 text-sm flex-1">
        <NavLink to="/admin/dashboard" className={({ isActive }) => `${linkClass} ${isActive ? active : ""}`}>
          <FiHome className="text-lg" /> Dashboard
        </NavLink>

        <NavLink to="/admin/airports" className={({ isActive }) => `${linkClass} ${isActive ? active : ""}`}>
          <FiMapPin className="text-lg" /> Airports
        </NavLink>

        <NavLink to="/admin/flights" className={({ isActive }) => `${linkClass} ${isActive ? active : ""}`}>
          <FiAirplay className="text-lg" /> Flights
        </NavLink>
      </nav>

      <div className="p-3 border-t">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
        >
          <FiLogOut className="text-lg" /> Logout
        </button>
      </div>
    </aside>
  );
}
