import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavPesanTiket } from "../components/layout/NavPesanTiket";
import { FiClock } from "react-icons/fi";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, amount, method } = location.state || {};

  useEffect(() => {
    if (!bookingId) {
      // If no booking ID, redirect back or show empty state
      // navigate("/");
    }
  }, [bookingId, navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <NavPesanTiket />

      <div className="pt-24 max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* QR PAYMENT */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between mb-4">
              <div>
                <h2 className="font-semibold text-lg">Rincian Pesanan</h2>
                <p className="text-sm text-gray-500">
                  ID Pemesanan: {bookingId || "-"}
                </p>
                <p className="text-sm text-gray-500">
                  Selesaikan pembayaran sebelum waktu habis
                </p>
              </div>

              <div className="flex items-center gap-2 text-red-600 font-semibold">
                <FiClock />
                14:59
              </div>
            </div>

            <div className="border rounded-lg p-6 text-center">
              <p className="font-semibold mb-3 uppercase">{method || "QRIS"}</p>

              <div className="w-48 h-48 bg-gray-200 mx-auto mb-3 flex items-center justify-center text-sm">
                QR CODE
              </div>

              <p className="text-xs text-gray-500">
                QR akan kedaluwarsa otomatis
              </p>
            </div>
          </div>

          {/* HOW TO PAY */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-2">Bagaimana Cara Membayar</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              1. Buka aplikasi e-wallet atau mobile banking<br />
              2. Pilih menu scan QR<br />
              3. Scan QR di atas<br />
              4. Selesaikan pembayaran
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-xl shadow p-6 h-fit">
          <h3 className="font-semibold mb-4">Ringkasan Pembayaran</h3>

          <div className="flex justify-between text-sm mb-2">
            <span>Total Pembayaran</span>
            <span className="font-bold text-red-600">
              IDR {amount ? amount.toLocaleString() : 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
