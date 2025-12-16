import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

import WhiteLogo from "../assets/images/ezywhite.png";
import LoginBG from "../assets/images/login-bg.jpg";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email_or_phone: "",
    password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔒 LOCK SCROLL
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerUser(form);
      navigate("/login");
    } catch (err) {
      console.error("Register gagal:", err);
    }

    setLoading(false);
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
        className="relative z-10 flex flex-col items-center pt-25"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* LOGO */}
        <motion.div
          className="flex flex-col items-center mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <img src={WhiteLogo} alt="Ezytix" className="w-44" />
          <p className="text-white text-sm tracking-[0.3em] mt-1">
            CEPAT DAN AMAN
          </p>
        </motion.div>

        {/* REGISTER CARD */}
        <motion.div
          className="bg-white w-[420px] rounded-2xl shadow-2xl px-10 py-9"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-center font-semibold text-lg mb-6">
            Masukan Email untuk Daftar
          </h2>

          {/* FORM */}
          <form className="flex flex-col gap-4" onSubmit={handleRegister}>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Masukan Username"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg
                         bg-gray-50 focus:ring-2 focus:ring-red-400 outline-none"
              required
            />

            <input
              name="email_or_phone"
              value={form.email_or_phone}
              onChange={handleChange}
              placeholder="Masukan Email/No Handphone"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg
                         bg-gray-50 focus:ring-2 focus:ring-red-400 outline-none"
              required
            />

            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              placeholder="Masukan Password"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg
                         bg-gray-50 focus:ring-2 focus:ring-red-400 outline-none"
              required
            />

            <input
              name="confirm_password"
              value={form.confirm_password}
              onChange={handleChange}
              type="password"
              placeholder="Konfirmasi Password"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg
                         bg-gray-50 focus:ring-2 focus:ring-red-400 outline-none"
              required
            />

            {/* BUTTON */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              className="w-full bg-red-500 hover:bg-red-600
                         text-white font-semibold py-3 rounded-lg mt-2
                         transition disabled:opacity-70"
            >
              {loading ? "Memproses..." : "Daftar"}
            </motion.button>
          </form>

          {/* LINK LOGIN */}
          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-red-600 font-medium hover:underline"
            >
              Sudah punya akun?
            </Link>
          </div>

          {/* DISCLAIMER */}
          <p className="text-gray-400 text-xs text-center mt-4 leading-relaxed">
            Dengan log in, kamu menyetujui kebijakan Privasi
            <br />
            dan Syarat & ketentuan Ezytix.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
