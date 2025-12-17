import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute() {
  const { user, loading } = useAuth();

  /**
   * ===============================
   * DEV MODE (TANPA BACKEND)
   * ===============================
   * ⛔️ sementara DIBUKA dulu
   * ⛔️ biar UI admin bisa diliat
   * ⛔️ nanti tinggal hapus blok ini
   */
  const DEV_BYPASS_ADMIN = true;

  if (DEV_BYPASS_ADMIN) {
    return <Outlet />;
  }

  /**
   * ===============================
   * PROD MODE (STRICT)
   * ===============================
   */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
