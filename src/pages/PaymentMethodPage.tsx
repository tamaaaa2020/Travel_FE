import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavPesanTiket } from "../components/layout/NavPesanTiket";
import FlightSummaryCard from "../components/ui/FlightSummaryCard";
import { MdFlight } from "react-icons/md";

import { useAuth } from "../context/AuthContext";

// Mock Data untuk Contact Form Display (Read Only)
// Dalam aplikasi nyata, data ini bisa diambil dari state atau API detail order
const ContactDisplay = ({ user }: { user: any }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">

        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm text-gray-500">Nama Lengkap</label>
                <div className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-700">
                    {user?.full_name || "User 10101"}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm text-gray-500">Nomor Telepon</label>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r pr-3">
                        <img src="https://flagcdn.com/w20/id.png" alt="ID" className="w-5" />
                        <span className="text-gray-700 text-sm">▼</span>
                    </div>
                    <div className="w-full bg-white border border-gray-200 rounded-lg pl-24 pr-4 py-3 text-gray-700">
                        {user?.phone || "+62 827676509999"}
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm text-gray-500">Alamat Email</label>
                <div className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-700">
                    {user?.email || "user10101@gmail.com"}
                </div>
            </div>
        </div>
    </div>
  );
};

export default function PaymentMethodPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { order, flight, passengers, passengerCount, seat_class } = location.state || {};
  const bookingId = order?.order_id;
  const amount = order?.total_amount || 0;

  // Get passenger info from state (preferred) or order
  const firstPassengerData = passengers?.[0]?.passenger;
  const firstPassportData = passengers?.[0]?.passport;

  const passengerName = firstPassengerData 
    ? `${firstPassengerData.title} ${firstPassengerData.firstName} ${firstPassengerData.lastName}`
    : (order?.items?.[0]?.passengers?.[0]?.full_name || "Mr (Adult) Abdul Hasyim");

  const passportNumber = firstPassportData?.number 
    || order?.items?.[0]?.passengers?.[0]?.passport_number 
    || "H1234567";

  const [selectedMethod, setSelectedMethod] = useState("QRIS");

  useEffect(() => {
    try {
      if (flight) {
        localStorage.setItem("payment_flight", JSON.stringify(flight));
      }
      localStorage.setItem("payment_meta", JSON.stringify({ passengers, passengerCount, seat_class }));
    } catch {}
  }, [flight, passengers, passengerCount, seat_class]);

  const handlePay = () => {
    navigate("/payment", { state: { order, paymentMethod: selectedMethod, flight, passengers, passengerCount, seat_class } });
  };

  const paymentMethods = [
      { id: "QRIS", name: "QRIS", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_QRIS.svg/1200px-Logo_QRIS.svg.png", height: "h-6" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <NavPesanTiket />
      <div className="pt-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
            {/* RINCIAN PESANAN SECTION */}
            <div>
                <h2 className="text-2xl font-bold text-black mb-2">Rincian Pesanan</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Detail kontak ini akan digunakan untuk pengiriman e-tiket dan keperluan refund/reschedule.
                </p>
                <ContactDisplay user={user} />
            </div>

            {/* METODE PEMBAYARAN SECTION */}
            <div>
                <h2 className="text-2xl font-bold text-black mb-2">Metode Pembayaran</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Silakan pilih metode pembayaran yang tersedia untuk menyelesaikan transaksi pemesanan anda
                </p>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                    {paymentMethods.map((method) => (
                        <div 
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            className={`flex items-center justify-between px-6 py-4 rounded-xl border cursor-pointer transition-all ${
                                selectedMethod === method.id 
                                ? "border-red-600 ring-1 ring-red-600 bg-red-50" 
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                        >
                            <div className="flex items-center h-8">
                                {method.logo ? (
                                    <img src={method.logo} alt={method.name} className={`${method.height} object-contain`} />
                                ) : (
                                    <span className="font-medium text-black">{method.text}</span>
                                )}
                            </div>
                            
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                selectedMethod === method.id ? "border-red-600" : "border-gray-300"
                            }`}>
                                {selectedMethod === method.id && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* TOTAL PAYMENT & BUTTON SECTION */}
            <div className="bg-white rounded-xl shadow p-6 mt-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="text-lg font-bold">Total Pembayaran</div>
                    <div className="text-lg font-bold text-black">
                        IDR {Number(amount).toLocaleString("id-ID")}
                    </div>
                </div>
                <button
                    onClick={handlePay}
                    className="w-full bg-red-600 text-white rounded-xl py-3 font-bold text-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                >
                    Bayar
                </button>
            </div>
        </div>

        {/* RIGHT COLUMN - FLIGHT SUMMARY */}
        <div style={{position: "relative", top: "5rem"}}>
          {flight ? (
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
                  <span className="text-[20px] font-medium text-black truncate">{flight.origin.city_name} ({flight.origin.code})</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-1">
                     <path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4v3z" fill="black"/>
                  </svg>
                  <span className="text-[20px] font-medium text-black truncate">{flight.destination.city_name} ({flight.destination.code})</span>
                </div>

                {/* Airline & Class */}
                <div className="flex items-center gap-3 mb-5 pl-2">
                    {flight.airline.logo_url && (
                        <div className="w-[43px] h-[46px] rounded-full border border-gray-100 flex items-center justify-center overflow-hidden">
                            <img src={flight.airline.logo_url} className="w-8 h-8 object-contain" />
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <span className="text-[16px] font-medium text-[#00000073]">{flight.airline.name}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                        <span className="text-[16px] font-medium text-[#00000073] capitalize">{seat_class}</span>
                    </div>
                </div>

                {/* Time Grid */}
                <div className="flex justify-between items-start mb-6">
                    {/* Departure */}
                    <div className="flex flex-col items-center border border-[#061c3d1f] rounded-lg p-3 min-w-[110px]">
                        <span className="text-[15px] font-medium text-black">{new Date(flight.departure_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}</span>
                        <span className="text-[14px] font-medium text-[#000000a8] text-center mt-1">
                            {new Date(flight.departure_time).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).split(',')[0]}<br/>
                            {new Date(flight.departure_time).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).split(',')[1]}
                        </span>
                    </div>

                    {/* Duration */}
                    <div className="flex flex-col items-center mt-3">
                        <span className="text-[12px] font-medium text-black">{flight.duration_formatted}</span>
                        <span className="text-[13px] font-medium text-[#000000a8] mt-1">{flight.transit_count === 0 ? "Langsung" : `${flight.transit_count} Transit`}</span>
                    </div>

                    {/* Arrival */}
                    <div className="flex flex-col items-center border border-[#061c3d1f] rounded-lg p-3 min-w-[110px]">
                        <span className="text-[15px] font-medium text-black">{new Date(flight.arrival_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}</span>
                        <span className="text-[14px] font-medium text-[#000000a8] text-center mt-1">
                            {new Date(flight.arrival_time).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).split(',')[0]}<br/>
                            {new Date(flight.arrival_time).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).split(',')[1]}
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
              <p className="text-sm text-gray-500">Ringkasan penerbangan tidak tersedia</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
