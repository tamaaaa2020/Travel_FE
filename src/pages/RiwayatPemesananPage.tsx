import React from "react";
import { NavPesanTiket } from "../components/layout/NavPesanTiket";
import { useNavigate } from "react-router-dom";

const pending = {
  route: "Jakarta → Singapore",
  bookingId: "12345678",
};

const activeTicket = {
  airline: "Lion Air",
  code: "JT-763",
  depart: "09:40",
  arrive: "12:35",
  duration: "1j 55m",
  transit: "Langsung",
};

const history = [
  {
    airline: "Lion Air",
    code: "JT-763",
    price: "IDR 969.686",
  },
  {
    airline: "AirAsia Indonesia",
    code: "QZ-504",
    price: "IDR 969.686",
  },
  {
    airline: "Citilink",
    code: "QG-937",
    price: "IDR 969.686",
  },
];

export default function RiwayatPemesananPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <NavPesanTiket />

      <div className="pt-24 max-w-5xl mx-auto px-6 space-y-10">

        {/* ================= PEMBELIAN TERTUNDA ================= */}
        <section>
          <h2 className="text-lg font-semibold mb-4">
            Pembelian Tertunda
          </h2>

          <div className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="text-3xl">🦁</div>
              <div>
                <p className="font-medium">{pending.route}</p>
                <p className="text-sm text-gray-500">
                  Booking ID: {pending.bookingId}
                </p>
                <p className="text-xs text-gray-400">
                  Dalam pemilihan metode pembayaran
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/payment")}
              className="text-red-600 text-sm font-medium"
            >
              Lihat Detail
            </button>
          </div>
        </section>

        {/* ================= E-TICKET AKTIF ================= */}
        <section>
          <h2 className="text-lg font-semibold mb-4">
            E-Ticket Aktif
          </h2>

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
                <p className="text-xs text-gray-400">
                  {activeTicket.duration} • {activeTicket.transit}
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
            {history.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow p-5 flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">✈️</div>
                  <div>
                    <p className="font-medium">
                      {item.airline} | {item.code}
                    </p>
                    <p className="text-sm text-gray-500">
                      09:40 → 12:35
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm">ECONOMY | 1.9</p>
                  <p className="font-semibold text-red-600">
                    {item.price} / pax
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
