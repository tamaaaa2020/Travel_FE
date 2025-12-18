import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavPesanTiket } from "../components/layout/NavPesanTiket";
import {
  FiBriefcase,
  FiCoffee,
  FiWifi,
  FiUsb,
  FiMonitor,
  FiGrid,
} from "react-icons/fi";

interface Flight {
  id: number;
  flight_code: string;
  airline: {
    id: number;
    iata: string;
    name: string;
    logo_url: string;
  };
  origin: {
    id: number;
    code: string;
    city_name: string;
    airport_name: string;
  };
  destination: {
    id: number;
    code: string;
    city_name: string;
    airport_name: string;
  };
  departure_time: string;
  arrival_time: string;
  total_duration_minutes: number;
  duration_formatted: string;
  transit_count: number;
  transit_info: string;
  flight_legs: FlightLeg[];
  flight_classes: FlightClass[];
}

interface FlightLeg {
  id: number;
  leg_order: number;
  airline: {
    id: number;
    iata: string;
    name: string;
    logo_url: string;
  };
  origin: {
    id: number;
    code: string;
    city_name: string;
    airport_name: string;
  };
  destination: {
    id: number;
    code: string;
    city_name: string;
    airport_name: string;
  };
  departure_time: string;
  arrival_time: string;
  duration_minutes: number;
  duration_formatted: string;
  flight_number: string;
  layover_duration_minutes?: number;
  layover_duration_formatted?: string;
}

interface FlightClass {
  id: number;
  seat_class: string;
  price: string;
  total_seats: number;
}

export default function FlightDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { flight, passengers, seat_class = "economy" } = location.state || {};

  if (!flight) {
    navigate("/pesan-tiket");
    return null;
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavPesanTiket />

      <div className="pt-24 max-w-6xl mx-auto px-6">
        {/* ===== CARD HEADER ===== */}
        <div className="bg-white rounded-xl shadow mb-6">
          <div className="p-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img 
                src={flight.airline.logo_url} 
                alt={flight.airline.name}
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7'/%3E%3C/svg%3E";
                }}
              />
              <div>
                <p className="font-semibold text-lg">
                  {flight.airline.name} | {flight.flight_code}
                </p>
                <p className="text-sm text-gray-500">
                  {seat_class} • {flight.transit_count === 0 ? "Langsung" : `${flight.transit_count} Transit`}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm">{seat_class.toUpperCase()} | {passengers} Penumpang</p>
              <p className="font-bold text-red-600 text-lg">
                IDR {parseFloat(flight.flight_classes?.find(fc => fc.seat_class === seat_class)?.price || flight.flight_classes?.[0]?.price || "0").toLocaleString()} / pax
              </p>

              <button
                onClick={() => navigate("/checkout", { 
                  state: { 
                    flight, 
                    passengers,
                    seat_class: seat_class
                  } 
                })}
                className="mt-2 px-6 py-2 bg-red-600 text-white rounded-lg"
              >
                Pilih
              </button>
            </div>
          </div>
        </div>

        {/* ===== DETAIL TIMELINE ===== */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="grid grid-cols-[80px_1fr] gap-6">
            {/* TIME */}
            <div className="text-sm text-gray-600 space-y-20">
              {flight.flight_legs.map((leg, index) => (
                <React.Fragment key={leg.id}>
                  <div>
                    <p className="font-medium">{formatTime(leg.departure_time)}</p>
                    <p>{formatDate(leg.departure_time)}</p>
                  </div>

                  <div>
                    <p className="text-xs">{leg.duration_formatted}</p>
                  </div>

                  <div>
                    <p className="font-medium">{formatTime(leg.arrival_time)}</p>
                    <p>{formatDate(leg.arrival_time)}</p>
                  </div>

                  {leg.layover_duration_formatted && (
                    <div>
                      <p className="text-xs text-orange-600">Transit: {leg.layover_duration_formatted}</p>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* DETAIL */}
            <div className="space-y-10 relative">
              {/* LINE */}
              <div className="absolute left-[-38px] top-3 bottom-3 w-px bg-gray-300" />

              {flight.flight_legs.map((leg, index) => (
                <React.Fragment key={leg.id}>
                  {/* DEPART */}
                  <div>
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full mt-1" />
                      <div>
                        <p className="font-semibold">
                          {leg.origin.city_name} ({leg.origin.code})
                        </p>
                        <p className="text-sm text-gray-500">
                          {leg.origin.airport_name}
                        </p>
                        <p className="text-xs text-gray-400">
                          Terminal {leg.origin.code === 'CGK' ? '1A' : 'Domestic'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* FLIGHT INFO */}
                  <div className="pl-7">
                    <div className="flex items-center gap-2 mb-2">
                      <img 
                        src={leg.airline.logo_url} 
                        alt={leg.airline.name}
                        className="w-6 h-6 object-contain"
                      />
                      <p className="font-medium">
                        {leg.airline.name} {leg.flight_number} • {leg.airline.iata}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FiBriefcase /> Baggage 15 kg
                      </div>
                      <div className="flex items-center gap-2">
                        <FiBriefcase /> Cabin baggage 7 kg
                      </div>
                      <div className="flex items-center gap-2">
                        <FiCoffee /> In-flight meal
                      </div>
                      <div className="flex items-center gap-2">
                        <FiWifi /> Wifi not available
                      </div>
                      <div className="flex items-center gap-2">
                        <FiUsb /> Power/USB not available
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMonitor /> Boeing 737
                      </div>
                      <div className="flex items-center gap-2">
                        <FiGrid /> 3-3 seat layout
                      </div>
                    </div>
                  </div>

                  {/* ARRIVE */}
                  <div>
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full mt-1" />
                      <div>
                        <p className="font-semibold">
                          {leg.destination.city_name} ({leg.destination.code})
                        </p>
                        <p className="text-sm text-gray-500">
                          {leg.destination.airport_name}
                        </p>
                        <p className="text-xs text-gray-400">
                          Terminal {leg.destination.code === 'DPS' ? 'Domestic' : 'International'}
                        </p>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* FOOTER */}
          <div className="border-t mt-6 pt-4 flex justify-between text-sm">
            <span className="text-gray-500">
              {flight.transit_info}
            </span>
            <button className="text-red-600 font-medium">
              Tampilkan Detail ▼
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}