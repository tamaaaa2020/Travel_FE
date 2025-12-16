import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import RedLogo from "../../assets/images/ezyred.png";

export const NavPesanTiket: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getInitial = (name?: string) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const isActive = (path: string) =>
    location.pathname === path
      ? "text-red-600 font-semibold"
      : "hover:text-red-600";

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <img src={RedLogo} alt="Ezytix Logo" className="h-8 w-auto" />
        </Link>

        {/* MENU */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-800">
          <Link to="/" className={isActive("/")}>
            Home
          </Link>

          <Link to="/pesan-tiket" className={isActive("/pesan-tiket")}>
            Pesan Tiket
          </Link>

          <Link to="/partner" className={isActive("/partner")}>
            Jadi Partner
          </Link>

          {user && (
            <Link
              to="/riwayat-pemesanan"
              className={isActive("/riwayat-pemesanan")}
            >
              Riwayat Pemesanan
            </Link>
          )}
        </nav>

        {/* USER / AUTH */}
        <div className="flex items-center gap-3 text-sm">
          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Daftar
              </Link>
            </>
          ) : (
            <Link to="/profile" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-gray-800 text-white flex items-center justify-center font-semibold">
                {getInitial(user.full_name)}
              </div>
              <span className="font-medium">{user.full_name}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
