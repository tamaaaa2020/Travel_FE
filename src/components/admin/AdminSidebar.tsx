import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiMapPin,
  FiAirplay,
  FiCreditCard,
  FiUsers,
} from "react-icons/fi";

export default function AdminSidebar() {
  const linkClass =
    "flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50";

  const active =
    "bg-red-500 text-white hover:bg-red-500";

  return (
    <aside className="w-64 bg-white border-r min-h-screen fixed">
      <div className="p-6 font-bold text-xl text-red-600">
        Ezytix Admin
      </div>

      <nav className="px-3 space-y-2 text-sm">
        <NavLink to="/admin/dashboard" className={({ isActive }) => `${linkClass} ${isActive && active}`}>
          <FiHome /> Dashboard
        </NavLink>

        <NavLink to="/admin/airports" className={({ isActive }) => `${linkClass} ${isActive && active}`}>
          <FiMapPin /> Airports
        </NavLink>

        <NavLink to="/admin/flights" className={({ isActive }) => `${linkClass} ${isActive && active}`}>
          <FiAirplay /> Flights
        </NavLink>

        <NavLink to="/admin/payments" className={({ isActive }) => `${linkClass} ${isActive && active}`}>
          <FiCreditCard /> Payments
        </NavLink>

        <NavLink to="/admin/users" className={({ isActive }) => `${linkClass} ${isActive && active}`}>
          <FiUsers /> Users
        </NavLink>
      </nav>
    </aside>
  );
}
