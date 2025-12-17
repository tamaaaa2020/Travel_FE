import React from "react";
import { NavPesanTiket } from "../components/layout/NavPesanTiket";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        User tidak ditemukan
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavPesanTiket />

      <div className="pt-24 max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow p-8">
          <h1 className="text-2xl font-bold mb-6">Profil Saya</h1>

          <div className="flex items-center gap-6 mb-8">
            {/* AVATAR */}
            <div className="h-20 w-20 rounded-full bg-gray-800 text-white flex items-center justify-center text-3xl font-bold">
              {user.full_name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-lg font-semibold">{user.full_name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* DATA USER */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <ProfileItem label="Nama Lengkap" value={user.full_name} />
            <ProfileItem label="Email" value={user.email} />
            <ProfileItem label="No. Telepon" value={user.phone || "-"} />
            <ProfileItem label="Role" value={user.role || "user"} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== COMPONENT ITEM ===== */
function ProfileItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-gray-500 mb-1">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  );
}
