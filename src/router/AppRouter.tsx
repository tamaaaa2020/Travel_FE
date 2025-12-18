import { Routes, Route, Navigate } from "react-router-dom";

/* ===== PUBLIC PAGES ===== */
import { LandingPage } from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import VerifOtp from "../pages/VerifOtp";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";

/* ===== BOOKING FLOW ===== */
import PesanTiketPage from "../pages/PesanTiketPage";
import CheckoutPage from "../pages/CheckoutPage";
import PaymentPage from "../pages/PaymentPage";
import PaymentMethodPage from "../pages/PaymentMethodPage";
import RiwayatPemesananPage from "../pages/RiwayatPemesananPage";

/* ===== USER ===== */
import ProfilePage from "../pages/ProfilePage";

/* ===== ADMIN PAGES ===== */
import DashboardPage from "../pages/admin/DashboardPage";
import AirportsPage from "../pages/admin/AirportsPage";
import FlightsPage from "../pages/admin/FlightsPage";

/* ===== ROUTE GUARD ===== */
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

export default function AppRouter() {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verif-otp" element={<VerifOtp />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* ================= BOOKING FLOW ================= */}
      <Route path="/pesan-tiket" element={<PesanTiketPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment-method" element={<PaymentMethodPage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Route>

      {/* ================= USER (LOGIN REQUIRED) ================= */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route
          path="/riwayat-pemesanan"
          element={<RiwayatPemesananPage />}
        />
      </Route>

      {/* ================= ADMIN ================= */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="/admin/airports" element={<AirportsPage />} />
        <Route path="/admin/flights" element={<FlightsPage />} />

      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
