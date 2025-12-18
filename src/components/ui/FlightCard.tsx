import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlightDetailDropdown } from "./FlightDetailDropdown";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface FlightCardProps {
  flight: any; // Using any to match Flight interface
  seatClass: string;
  passenger: string;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight, seatClass, passenger }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const selectedFlightClass = flight.flight_classes?.find((fc: any) => fc.seat_class === seatClass) || flight.flight_classes?.[0];
  const price = parseFloat(selectedFlightClass?.price || "0");

  const handleSelect = () => {
    navigate("/checkout", {
      state: { 
        flight, 
        passengers: parseInt(passenger),
        seat_class: selectedFlightClass?.seat_class || "economy"
      },
    });
  };

  return (
    <div className="bg-white rounded-xl shadow p-5 transition-all hover:shadow-md">
      {/* MAIN CARD CONTENT */}
      <div className="flex items-center justify-between">
        {/* LEFT: Airline & Time */}
        <div className="flex items-center gap-4 w-1/3">
          <img 
            src={flight.airline.logo_url} 
            alt={flight.airline.name}
            className="w-12 h-12 object-contain"
            onError={(e) => {
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7'/%3E%3C/svg%3E";
            }}
          />
          <div>
            <p className="font-semibold">
              {flight.airline.name} | {flight.flight_code}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(flight.departure_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              →{" "}
              {new Date(flight.arrival_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-xs text-gray-400">
              {flight.duration_formatted}
            </p>
          </div>
        </div>

        {/* MIDDLE: Route & Transit */}
        <div className="text-sm text-gray-600 w-1/3 text-center">
          <p>{flight.origin.city_name} ({flight.origin.code}) → {flight.destination.city_name} ({flight.destination.code})</p>
          <p>{flight.transit_count === 0 ? "Langsung" : `${flight.transit_count} Transit`}</p>
        </div>

        {/* RIGHT: Price & Button */}
        <div className="w-1/3 text-right">
          <p className="text-sm">{(selectedFlightClass?.seat_class || "economy").toUpperCase()}</p>
          <p className="font-bold text-red-600 text-lg">
            IDR {price.toLocaleString()}
            <span className="text-xs text-gray-400 font-normal">/pax</span>
          </p>
          <button
            onClick={handleSelect}
            className="mt-2 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
          >
            Pilih
          </button>
        </div>
      </div>

      {/* DROPDOWN TOGGLE */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="mt-4 border-t pt-2 flex items-center justify-center gap-1 cursor-pointer text-sm text-red-500 font-medium hover:text-red-600 select-none"
      >
        {isOpen ? "Sembunyikan Detail" : "Tampilkan Detail"}
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
      </div>

      {/* DROPDOWN CONTENT */}
      {isOpen && (
        <FlightDetailDropdown flight={flight} seatClass={seatClass} />
      )}
    </div>
  );
};
