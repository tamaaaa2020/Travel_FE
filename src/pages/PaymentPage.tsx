import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavPesanTiket } from "../components/layout/NavPesanTiket";
import { FiClock } from "react-icons/fi";
import { MdFlight } from "react-icons/md";
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
  // Use same logic as PaymentMethodPage
  const firstPassengerData = passengers?.[0]?.passenger;
  const firstPassportData = passengers?.[0]?.passport;

  const passengerName = firstPassengerData 
    ? `${firstPassengerData.title} ${firstPassengerData.firstName} ${firstPassengerData.lastName}`
    : (order?.items?.[0]?.passengers?.[0]?.full_name || "Mr (Adult) Abdul Hasyim");

  const passportNumber = firstPassportData?.number 
    || order?.items?.[0]?.passengers?.[0]?.passport_number 
    || "H1234567";

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
        <div style={{marginBottom:"3rem"}}>
          <h3 className="font-semibold mb-3" style={{textAlign:"center"}}>Bagaimana Cara Membayar</h3>
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full max-w-[405px]">
              {/* Header with Red Curve Background (Vector 7 Style) */}
              <div className="relative h-[75px] bg-[#fca5a5] overflow-hidden">
                  <div className="absolute top-0 left-0 h-[75px] w-[74px]">
                     {/* Vector 7 Red Shape */}
                     <svg width="100%" height="100%" viewBox="0 0 74 75" preserveAspectRatio="none">
                        <path d="M0 0H37C57.4345 0 74 16.5655 74 37V75H0V0Z" fill="#D90D19"/>
                     </svg>
                     <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                         <MdFlight className="text-white text-2xl -rotate-90" style={{rotate:"140deg", fontSize: "3rem"}}/>
                     </div>
                  </div>
                  
                  {/* Background Fill for the rest */}
                  <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[#FFE4E4]"></div>

                  <div className="relative z-10 pl-[90px] flex flex-col justify-center h-full">
                      <h3 className="text-[20px] font-semibold text-black leading-tight">Flight Summary</h3>
                      <p className="text-[15px] text-[#00000094] font-medium">Booking ID : {bookingId || "-"}</p>
                  </div>
              </div>

              <div className="p-4 pl-[14px] pr-[17px]">
                {/* Route */}
                <div className="flex items-center gap-2 mb-2 mt-2">
                  <span className="text-[20px] font-medium text-black truncate">{effectiveFlight.origin.city_name} ({effectiveFlight.origin.code})</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-1">
                     <path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4v3z" fill="black"/>
                  </svg>
                  <span className="text-[20px] font-medium text-black truncate">{effectiveFlight.destination.city_name} ({effectiveFlight.destination.code})</span>
                </div>

                {/* Airline & Class */}
                <div className="flex items-center gap-3 mb-5 pl-2">
                    {effectiveFlight.airline.logo_url && (
                        <div className="w-[43px] h-[46px] rounded-full border border-gray-100 flex items-center justify-center overflow-hidden">
                            <img src={effectiveFlight.airline.logo_url} className="w-8 h-8 object-contain" />
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <span className="text-[16px] font-medium text-[#00000073]">{effectiveFlight.airline.name}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                        <span className="text-[16px] font-medium text-[#00000073] capitalize">{seatClassResolved}</span>
                    </div>
                </div>

                {/* Time Grid */}
                <div className="flex justify-between items-start mb-6">
                    {/* Departure */}
                    <div className="flex flex-col items-center border border-[#061c3d1f] rounded-lg p-3 min-w-[110px]">
                        <span className="text-[15px] font-medium text-black">{new Date(effectiveFlight.departure_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}</span>
                        <span className="text-[14px] font-medium text-[#000000a8] text-center mt-1">
                            {new Date(effectiveFlight.departure_time).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).split(',')[0]}<br/>
                            {new Date(effectiveFlight.departure_time).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).split(',')[1]}
                        </span>
                    </div>

                    {/* Duration */}
                    <div className="flex flex-col items-center mt-3">
                        <span className="text-[12px] font-medium text-black">{effectiveFlight.duration_formatted}</span>
                        <span className="text-[13px] font-medium text-[#000000a8] mt-1">{effectiveFlight.transit_count === 0 ? "Langsung" : `${effectiveFlight.transit_count} Transit`}</span>
                    </div>

                    {/* Arrival */}
                    <div className="flex flex-col items-center border border-[#061c3d1f] rounded-lg p-3 min-w-[110px]">
                        <span className="text-[15px] font-medium text-black">{new Date(effectiveFlight.arrival_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}</span>
                        <span className="text-[14px] font-medium text-[#000000a8] text-center mt-1">
                            {new Date(effectiveFlight.arrival_time).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).split(',')[0]}<br/>
                            {new Date(effectiveFlight.arrival_time).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).split(',')[1]}
                        </span>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-[#061c3d4a] mb-6 mx-auto" style={{width: "90%"}}></div>

                {/* Passenger Details */}
                <div className="pl-2">
                    <h4 className="text-[16px] font-medium text-[#000000ab] mb-4">Passanger(s) Details</h4>
                    <div className="flex items-center gap-4">
                        <div className="w-[35px] h-[35px]">
                             {/* Use SVG from design or similar icon */}
                             <svg width="35" height="35" viewBox="0 0 24 24" fill="#555" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                             </svg>
                        </div>
                        <div>
                            <p className="text-[11px] font-medium text-[#000000a8]">{passengerName}</p>
                            <p className="text-[11px] font-medium text-[#000000a8]">Passport : {passportNumber}</p>
                        </div>
                    </div>
                </div>
              </div>
            </div>
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
