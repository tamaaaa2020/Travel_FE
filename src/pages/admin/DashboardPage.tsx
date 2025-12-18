import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import StatCard from "../../components/admin/StatCard";
import { api } from "../../lib/axios";

export default function DashboardPage() {
  const [stats, setStats] = useState({ airports: 0, flights: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resAir, resFlight] = await Promise.all([
          api.get("/airports"),
          api.get("/flights")
        ]);
        setStats({
          airports: resAir.data?.data?.length || 0,
          flights: resFlight.data?.data?.length || 0
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />

      <main className="ml-64 p-8 w-full">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <StatCard title="Total Airports" value={stats.airports.toString()} />
          <StatCard title="Total Flights" value={stats.flights.toString()} />
        </div>

        {/* PLACEHOLDER */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="font-semibold mb-4">Selamat Datang, Admin</h2>
          <p className="text-sm text-gray-500">
            Silakan kelola data Airport dan Flight melalui sidebar di sebelah kiri.
          </p>
        </div>
      </main>
    </div>
  );
}
