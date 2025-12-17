import React from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import StatCard from "../../components/admin/StatCard";

export default function DashboardPage() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />

      <main className="ml-64 p-8 w-full">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Airports" value="120" />
          <StatCard title="Flights" value="1.245" />
          <StatCard title="Payments" value="8.921" />
          <StatCard title="Users" value="15.432" />
        </div>

        {/* PLACEHOLDER */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="font-semibold mb-4">Aktivitas Terbaru</h2>
          <p className="text-sm text-gray-500">
            Belum ada aktivitas terbaru.
          </p>
        </div>
      </main>
    </div>
  );
}
