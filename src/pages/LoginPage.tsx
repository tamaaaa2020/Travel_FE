/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

import WhiteLogo from "../assets/images/ezywhite.png";
import LoginBG from "../assets/images/login-bg.jpg";

export default function LoginPage() {
  const { login, loading } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 🔒 LOCK SCROLL
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(identifier, password);
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "Login gagal. Periksa kembali data Anda."
      );
    }
  };

  return (
    <div className="fixed inset-0 w-full h-screen">
      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${LoginBG})` }}
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/25" />

      {/* CONTENT */}
      <motion.div
        className="relative z-10 flex flex-col items-center pt-24"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* LOGO SECTION */}
        <motion.div
          className="flex flex-col items-center mb-14"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <img
            src={WhiteLogo}
            alt="Ezytix Logo"
            className="w-56 md:w-64"
          />
          <p className="text-white tracking-[0.35em] text-sm mt-2">
            CEPAT DAN AMAN
          </p>
        </motion.div>

        {/* LOGIN CARD */}
        <motion.div
          className="bg-white w-[420px] rounded-2xl shadow-2xl px-10 py-9"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-center text-lg font-semibold mb-6">
            Masukan Email untuk Masuk
          </h2>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Masukan Email / No Handphone"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg
                         bg-gray-50 focus:ring-2 focus:ring-red-400 outline-none"
              required
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukan Password"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg
                         bg-gray-50 focus:ring-2 focus:ring-red-400 outline-none"
              required
            />

            {/* ERROR */}
            {error && (
              <motion.p
                className="text-red-600 text-sm text-center"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}
            {/* LINKS */}
            <div className="flex justify-between text-sm mt-1">
              <Link
                to="/register"
                className="text-red-600 font-medium hover:underline"
              >
                Belum Punya Akun?
              </Link>

             <Link
                to="/forgot-password"
                className="text-gray-400 hover:text-red-500 transition"
              >
                Lupa Kata Sandi?
              </Link>

            </div>


            {/* BUTTON */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              className="w-full bg-red-500 hover:bg-red-600
                         text-white font-semibold py-3 rounded-lg mt-2
                         disabled:opacity-70"
            >
              {loading ? "Memproses..." : "Masuk"}
            </motion.button>
          </form>

          {/* DISCLAIMER */}
          <p className="text-gray-400 text-xs text-center mt-4 leading-relaxed">
            Dengan login, kamu menyetujui kebijakan Privasi
            <br />
            dan Syarat & Ketentuan Ezytix.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
