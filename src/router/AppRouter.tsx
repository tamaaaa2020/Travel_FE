import { Routes, Route, Navigate } from "react-router-dom";

import { LandingPage } from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import VerifOtp from "../pages/VerifOtp";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";

import PesanTiketPage from "../pages/PesanTiketPage";
import CheckoutPage from "../pages/CheckoutPage";

import DashboardPage from "../pages/admin/DashboardPage";
import ProfilePage from "../pages/ProfilePage";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

export default function AppRouter() {
  return (
    <Routes>
      {/* ===== PUBLIC ROUTES ===== */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verif-otp" element={<VerifOtp />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route path="/pesan-tiket" element={<PesanTiketPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />

      {/* ===== PROTECTED USER ===== */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* ===== ADMIN ===== */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/dashboard" element={<DashboardPage />} />
      </Route>

      {/* ===== FALLBACK (PALING BAWAH!) ===== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
