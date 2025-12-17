import React, { useEffect, useMemo, useState } from "react";
import { NavPesanTiket } from "../components/layout/NavPesanTiket";
import { useNavigate } from "react-router-dom";
type BookingDetailResponse = {
  booking_code: string;
  flight_code: string;
  origin: string;
  destination: string;
  departure_time: string;
  total_passengers: number;
  total_price: number;
};

type BookingResponse = {
  order_id: string;
  total_amount: number;
  status: string; // pending | paid | cancelled | failed
  transaction_time: string;
  payment_url?: string;
  bookings: BookingDetailResponse[];
};

export default function RiwayatPemesananPage() {
  const navigate = useNavigate();
  const [pendingOrder, setPendingOrder] = useState<BookingResponse | null>(null);
  const [ordersHistory, setOrdersHistory] = useState<BookingResponse[]>([]);

  useEffect(() => {
    try {
      const p = localStorage.getItem("pending_order");
      if (p) setPendingOrder(JSON.parse(p));

      const h = localStorage.getItem("orders_history");
      if (h) setOrdersHistory(JSON.parse(h));
    } catch {}
  }, []);

  const activeTicket = useMemo(() => {
    const paid = ordersHistory.find((o) => o.status === "paid");
    if (!paid || paid.bookings.length === 0) return null;
    const b = paid.bookings[0];
    const departStr = b.departure_time
      ? new Date(b.departure_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "";
    return {
      airline: b.flight_code.split("-")[0] || "",
      code: b.flight_code,
      depart: departStr,
      arrive: "",
      duration: "",
      transit: "",
    };
  }, [ordersHistory]);

  return (
    <div className="min-h-screen bg-gray-100">
      <NavPesanTiket />

      <div className="pt-24 max-w-5xl mx-auto px-6 space-y-10">

        {/* ================= PEMBELIAN TERTUNDA ================= */}
        <section>
          <h2 className="text-lg font-semibold mb-4">
            Pembelian Tertunda
          </h2>
          {pendingOrder ? (
            <div className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="text-3xl">🦁</div>
                <div>
                  <p className="font-medium">
                    {pendingOrder.bookings[0]?.origin} → {pendingOrder.bookings[0]?.destination}
                  </p>
                  <p className="text-sm text-gray-500">Order ID: {pendingOrder.order_id}</p>
                  <p className="text-xs text-gray-400">Dalam pemilihan metode pembayaran</p>
                </div>
              </div>

              <button
                onClick={() => navigate("/payment")}
                className="text-red-600 text-sm font-medium"
              >
                Lihat Detail
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow p-5 text-sm text-gray-600">Tidak ada pembelian tertunda.</div>
          )}
        </section>

        {/* ================= E-TICKET AKTIF ================= */}
        <section>
          <h2 className="text-lg font-semibold mb-4">
            E-Ticket Aktif
          </h2>
          {activeTicket ? (
            <div className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="text-3xl">🦁</div>
                <div>
                  <p className="font-medium">
                    {activeTicket.airline} | {activeTicket.code}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activeTicket.depart} → {activeTicket.arrive}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/pesan-tiket/${activeTicket.code}`)}
                className="text-red-600 text-sm font-medium"
              >
                Lihat Detail
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow p-5 text-sm text-gray-600">Tidak ada e-ticket aktif.</div>
          )}
        </section>

        {/* ================= RIWAYAT PEMESANAN ================= */}
        <section>
          <h2 className="text-lg font-semibold mb-2">
            Riwayat Pemesanan
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Riwayat pemesanan yang dapat dilihat hanya periode waktu 90 hari
          </p>
          <div className="space-y-4">
            {ordersHistory.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-5 text-sm text-gray-600">Belum ada riwayat pemesanan.</div>
            ) : (
              ordersHistory.map((order, i) => {
                const b = order.bookings[0];
                const depart = b?.departure_time
                  ? new Date(b.departure_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : "";
                return (
                  <div key={i} className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">✈️</div>
                      <div>
                        <p className="font-medium">
                          {b?.flight_code} | {order.order_id}
                        </p>
                        <p className="text-sm text-gray-500">
                          {depart}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm capitalize">{order.status}</p>
                      <p className="font-semibold text-red-600">IDR {Math.round(order.total_amount).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
