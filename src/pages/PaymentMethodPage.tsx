import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavPesanTiket } from "../components/layout/NavPesanTiket";
import { FiClock } from "react-icons/fi";
import FlightSummaryCard from "../components/ui/FlightSummaryCard";

export default function PaymentMethodPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { order, flight, passengers, seat_class } = location.state || {};
  const bookingId = order?.order_id;
  const amount = order?.total_amount || 0;
  const firstPassenger = order?.items?.[0]?.passengers?.[0] || null;
  const passengerName = firstPassenger?.full_name || undefined;
  const passportNumber = firstPassenger?.passport_number || undefined;

  useEffect(() => {
    try {
      if (flight) {
        localStorage.setItem("payment_flight", JSON.stringify(flight));
      }
      localStorage.setItem("payment_meta", JSON.stringify({ passengers, seat_class }));
    } catch {}
  }, [flight, passengers, seat_class]);

  const handlePay = () => {
    navigate("/payment", { state: { order, paymentMethod: "QRIS", flight, passengers, seat_class } });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavPesanTiket />
      <div className="pt-24 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between mb-4">
              <div>
                <h2 className="font-semibold text-lg">Rincian Pesanan</h2>
                <p className="text-sm text-gray-500">ID Pemesanan: {bookingId || "-"}</p>
              </div>
              <div className="flex items-center gap-2 text-red-600 font-semibold">
                <FiClock />
                14:59
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white border rounded-xl">
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* <img src="https://upload.wikimedia.org/wikipedia/commons/2/2b/QRIS_logo.png" className="w-16 h-10 object-contain" /> */}
                    <div>
                      <p className="font-semibold">QRIS</p>
                      <p className="text-xs text-gray-500">Pembayaran QR nasional</p>
                    </div>
                  </div>
                  <input type="radio" checked readOnly />
                </div>
              </div>
              <div className="text-xs text-gray-500 px-1">
                Metode lain dinonaktifkan. Silakan gunakan QRIS.
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
            <div className="text-sm">Total Pembayaran</div>
            <div className="font-bold text-red-600">IDR {Number(amount).toLocaleString("id-ID")}</div>
          </div>

          <button
            onClick={handlePay}
            className="w-full bg-red-600 text-white rounded-xl py-3 font-semibold hover:bg-red-700 transition-colors"
          >
            Bayar
          </button>
        </div>

        <div>
          {flight ? (
            <FlightSummaryCard
              flight={flight}
              bookingId={bookingId}
              passengers={passengers || 1}
              seatClass={seat_class || "economy"}
              passengerName={passengerName}
              passportNumber={passportNumber}
            />
          ) : (
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-sm text-gray-500">Ringkasan penerbangan tidak tersedia</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
