/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import WhiteLogo from "../assets/images/ezywhite.png";
import LoginBG from "../assets/images/login-bg.jpg";

export default function VerifOtp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // 🔒 Lock scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    inputsRef.current[0]?.focus();
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const otpCode = otp.join("");
    console.log("OTP:", otpCode);

    // simulasi verifikasi
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1200);
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
          <img
            src={WhiteLogo}
            alt="Ezytix Logo"
            className="w-56 md:w-64"
          />
          <p className="text-white tracking-[0.35em] text-sm mt-2">
            CEPAT DAN AMAN
          </p>
        </motion.div>

        {/* OTP CARD */}
        <motion.div
          className="bg-white w-[420px] rounded-2xl shadow-2xl px-10 py-9"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-center text-lg font-semibold mb-2">
            Masukan Kode OTP
          </h2>

          <p className="text-center text-sm text-gray-500 mb-6">
            Masukan kode yang dikirim ke email kamu
          </p>

          {/* OTP INPUT */}
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-4 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleChange(index, e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="
                    w-14 h-14 text-center text-xl font-semibold
                    border border-red-300 rounded-xl
                    focus:ring-2 focus:ring-red-400
                    outline-none
                  "
                />
              ))}
            </div>

            {/* BUTTON */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="
                w-full bg-red-500 hover:bg-red-600
                text-white font-semibold py-3 rounded-lg
                disabled:opacity-70
              "
            >
              {loading ? "Memverifikasi..." : "Verifikasi"}
            </motion.button>
          </form>

          {/* FOOTER */}
          <p className="text-gray-400 text-xs text-center mt-4">
            Tidak menerima kode?
            <span className="text-red-500 font-medium cursor-pointer ml-1">
              Kirim ulang
            </span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
