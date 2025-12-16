/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

import WhiteLogo from "../assets/images/ezywhite.png";
import LoginBG from "../assets/images/login-bg.jpg";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔒 Lock scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 🔧 nanti ganti ke API kirim OTP
    setTimeout(() => {
      setLoading(false);
      navigate("/verif-otp");
    }, 1000);
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
        {/* LOGO */}
        <motion.div
          className="flex flex-col items-center mb-14"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <img src={WhiteLogo} alt="Ezytix Logo" className="w-56 md:w-64" />
          <p className="text-white tracking-[0.35em] text-sm mt-2">
            CEPAT DAN AMAN
          </p>
        </motion.div>

        {/* CARD */}
        <motion.div
          className="bg-white w-[420px] rounded-2xl shadow-2xl px-10 py-9"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-center text-lg font-semibold mb-2">
            Lupa Kata Sandi?
          </h2>

          <p className="text-center text-sm text-gray-500 mb-6">
            Masukkan email untuk membuat kata sandi baru
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan Email"
              className="
                w-full border border-gray-300 px-4 py-3 rounded-lg
                bg-gray-50 focus:ring-2 focus:ring-red-400 outline-none
              "
              required
            />

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="
                w-full bg-red-500 hover:bg-red-600
                text-white font-semibold py-3 rounded-lg
                disabled:opacity-70
              "
            >
              {loading ? "Memproses..." : "Lanjutkan"}
            </motion.button>
          </form>

          {/* FOOTER */}
          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-gray-400 text-sm hover:text-red-500"
            >
              Kembali ke Login
            </Link>
          </div>

          <p className="text-red-500 text-xs text-center mt-4 font-semibold">
            Ezytix
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
