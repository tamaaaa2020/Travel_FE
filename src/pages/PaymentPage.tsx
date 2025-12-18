import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavPesanTiket } from "../components/layout/NavPesanTiket";
import { FiClock } from "react-icons/fi";
import FlightSummaryCard from "../components/ui/FlightSummaryCard";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { order, paymentMethod, flight, passengers, seat_class } = location.state || {};

  const bookingId = order?.order_id || location.state?.bookingId;
  const amount = order?.total_amount || location.state?.amount;
  const method = paymentMethod || location.state?.method || "QRIS";
  const paymentUrl = order?.payment_url;

  useEffect(() => {
    if (!bookingId) {
      // If no booking ID, redirect back or show empty state
      // navigate("/");
    }
  }, [bookingId, navigate]);

  // Resolve flight data robustly
  const effectiveFlight = flight || order?.flight || order?.items?.[0]?.flight || (() => {
    try {
      const pending = JSON.parse(localStorage.getItem("pending_order") || "null");
      const storedFlight = JSON.parse(localStorage.getItem("payment_flight") || "null");
      if (storedFlight) return storedFlight;
      return pending?.items?.[0]?.flight || null;
    } catch { return null; }
  })();
  // Resolve passenger info
  const firstPassenger = order?.items?.[0]?.passengers?.[0] || null;
  const passengerName = firstPassenger?.full_name || undefined;
  const passportNumber = firstPassenger?.passport_number || undefined;
  const meta = (() => { try { return JSON.parse(localStorage.getItem("payment_meta") || "null"); } catch { return null; } })();
  const passengersResolved = passengers || meta?.passengers || 1;
  const seatClassResolved = seat_class || meta?.seat_class || "economy";
  return (
    <div className="min-h-screen bg-gray-100">
      <NavPesanTiket />

      <div className="pt-24 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* QR PAYMENT */}
            <h2 className="font-semibold text-xl mb-1">Rincian Pesanan</h2>
            <p className="text-sm text-gray-500 mb-4">
              Detail kontak ini akan digunakan untuk pengiriman e-tiket dan keperluan refund/reschedule.
            </p>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
                <div>
                  <div className="text-gray-700">Order saya :</div>
                  <div className="font-semibold">{bookingId || "-"}</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-700">Status</div>
                  <div className="font-semibold">Belum Dibayar</div>
                </div>
                <div>
                  <div className="text-gray-700">Tanggal Pemesanan</div>
                  <div className="font-semibold">{new Date().toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "2-digit" })}</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-700">Total Pembayaran</div>
                  <div className="font-semibold">IDR {Number(amount || 0).toLocaleString("id-ID")}</div>
                </div>
                <div className="col-span-2 text-right">
                  <div className="inline-flex items-center gap-2 text-red-600 font-semibold">
                    <FiClock />
                    14m 59s
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                {/* <img src="https://upload.wikimedia.org/wikipedia/commons/2/2b/QRIS_logo.png" className="w-16 h-10 object-contain mb-2" /> */}
                {paymentUrl ? (
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(paymentUrl)}`} 
                    alt="Scan QR to Pay"
                    className="w-60 h-60 object-contain mb-3"
                  />
                ) : (
                  <div className="w-60 h-60 bg-gray-200 mb-3 flex items-center justify-center text-sm">
                    QR CODE
                  </div>
                )}
                <div className="text-center text-xs text-gray-700">
                  QR AKAN HANGUS DALAM WAKTU<br />12 Menit 59 Detik
                </div>
              </div>
            </div>
          </div>

        {/* HOW TO PAY */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-3">Bagaimana Cara Membayar</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
            <br /><br />
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor
          </p>
        </div>
        </div>

        {/* RIGHT */}
        <div className="h-fit" style={{top:'6rem',position:'relative'}}>
          {effectiveFlight ? (
            <FlightSummaryCard
              flight={effectiveFlight}
              bookingId={bookingId}
              passengers={passengersResolved}
              seatClass={seatClassResolved}
              passengerName={passengerName}
              passportNumber={passportNumber}
            />
          ) : (
            <div className="bg-white rounded-xl shadow p-6">
              <div className="font-semibold mb-2">Flight Summary</div>
              <div className="text-sm text-gray-500">Data penerbangan tidak tersedia</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
