import React from "react";
import { FiUser } from "react-icons/fi";
interface Airport { code: string; city_name: string }
interface Airline { name: string; logo_url: string }
interface FlightClass { seat_class: string; price: string }
interface Flight {
  origin: Airport;
  destination: Airport;
  airline: Airline;
  departure_time: string;
  arrival_time: string;
  duration_formatted: string;
  transit_count: number;
  flight_classes: FlightClass[];
}
export default function FlightSummaryCard({ flight, bookingId, passengers = 1, seatClass = "economy", passengerName = "Mr (Adult) Abdul Hasyim", passportNumber = "H1234567" }: { flight: Flight; bookingId?: string; passengers?: number; seatClass?: string; passengerName?: string; passportNumber?: string }) {
  const dep = new Date(flight.departure_time);
  const arr = new Date(flight.arrival_time);
  const depTime = dep.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const arrTime = arr.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const depDate = dep.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const arrDate = arr.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const transitLabel = flight.transit_count === 0 ? "Langsung" : `${flight.transit_count} Transit`;
  const selected = flight.flight_classes?.find(c => c.seat_class === seatClass) || flight.flight_classes?.[0];
  const total = ((parseFloat(selected?.price || "0")) * passengers).toLocaleString("id-ID");
  return (
    <div className="bg-white rounded-xl shadow p-0 overflow-hidden">
      <div className="bg-red-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white">✈</span>
          <span className="font-semibold">Flight Summary</span>
        </div>
        <span className="text-xs text-gray-700">Booking ID :{bookingId || "-"}</span>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm font-semibold mb-2">
          <span>{flight.origin.city_name} ({flight.origin.code})</span>
          <span>→</span>
          <span>{flight.destination.city_name} ({flight.destination.code})</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-700 mb-3">
          {flight.airline.logo_url && (
            <img src={flight.airline.logo_url} className="w-6 h-6 object-contain" />
          )}
          <span>{flight.airline.name} • {seatClass}</span>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-sm">
            <div className="font-semibold text-gray-900">{depTime}</div>
            <div className="text-xs text-gray-600">{depDate}</div>
          </div>
          <div className="text-center text-sm">
            <div className="font-medium text-gray-900">{flight.duration_formatted}</div>
            <div className="text-xs text-gray-600">{transitLabel}</div>
          </div>
          <div className="text-right text-sm">
            <div className="font-semibold text-gray-900">{arrTime}</div>
            <div className="text-xs text-gray-600">{arrDate}</div>
          </div>
        </div>
        <div className="text-sm font-semibold mb-2">Passanger(s) Details</div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center">
            <FiUser className="text-gray-600" />
          </div>
          <div className="text-xs">
            <div className="text-gray-800">{passengerName}</div>
            <div className="text-gray-500">Passport : {passportNumber}</div>
          </div>
        </div>
        <div className="border-t my-2" />
        <div className="flex items-center justify-between text-sm">
          <span>Total Pembayaran</span>
          <span className="font-bold">IDR {total}</span>
        </div>
      </div>
    </div>
  );
}

