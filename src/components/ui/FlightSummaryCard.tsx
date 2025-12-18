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

export default function FlightSummaryCard({ flight, bookingId, passengers = 1, seatClass , passengerName, passportNumber }: { flight: Flight; bookingId?: string; passengers?: number; seatClass?: string; passengerName?: string; passportNumber?: string }) {
  const dep = new Date(flight.departure_time);
  const arr = new Date(flight.arrival_time);
  const depTime = dep.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  const arrTime = arr.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  const depDate = dep.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const arrDate = arr.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const transitLabel = flight.transit_count === 0 ? "Langsung" : `${flight.transit_count} Transit`;
  
  // Format date for display: "Rabu, 8 Oktober 2025" -> split to lines if needed or keep inline
  const formatDateDisplay = (dateStr: string) => {
      // id-ID usually gives "Rabu, 8 Oktober 2025"
      // We want to wrap it if needed or just display
      return dateStr;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full max-w-[405px]">
      {/* Header with Red Curve Background */}
      <div className="relative h-[68px] bg-[#fca5a5] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-red-100">
             {/* Custom SVG Background to mimic the curve/pattern from Figma frame 105 */}
             <svg width="100%" height="100%" viewBox="0 0 405 68" preserveAspectRatio="none">
                <path d="M0 0H405V68H0V0Z" fill="#FCA5A5" fillOpacity="0.3"/> 
                {/* Simplified background color for now, usually it's an image in Figma */}
                <rect width="100%" height="100%" fill="#fee2e2" />
             </svg>
             <div className="absolute top-0 left-0 w-[80px] h-full bg-red-600 rounded-r-[40px] flex items-center justify-center">
                 <svg width="30" height="30" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                 </svg>
             </div>
          </div>
          
          <div className="relative z-10 pl-[90px] pt-[10px]">
              <h3 className="text-[20px] font-semibold text-black leading-tight">Flight Summary</h3>
              <p className="text-[15px] text-[#00000094] font-medium">Booking ID :{bookingId || "112233445566"}</p>
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
                <span className="text-[16px] font-medium text-[#00000073] capitalize">{seatClass}</span>
            </div>
        </div>

        {/* Time Grid */}
        <div className="flex justify-between items-start mb-6">
            {/* Departure */}
            <div className="flex flex-col items-center border border-[#061c3d1f] rounded-lg p-3 min-w-[110px]">
                <span className="text-[15px] font-medium text-black">{depTime}</span>
                <span className="text-[14px] font-medium text-[#000000a8] text-center mt-1">
                    {formatDateDisplay(depDate).split(',')[0]}<br/>
                    {formatDateDisplay(depDate).split(',')[1]}
                </span>
            </div>

            {/* Duration */}
            <div className="flex flex-col items-center mt-3">
                <span className="text-[12px] font-medium text-black">{flight.duration_formatted}</span>
                <span className="text-[13px] font-medium text-[#000000a8] mt-1">{transitLabel}</span>
            </div>

            {/* Arrival */}
            <div className="flex flex-col items-center border border-[#061c3d1f] rounded-lg p-3 min-w-[110px]">
                <span className="text-[15px] font-medium text-black">{arrTime}</span>
                <span className="text-[14px] font-medium text-[#000000a8] text-center mt-1">
                    {formatDateDisplay(arrDate).split(',')[0]}<br/>
                    {formatDateDisplay(arrDate).split(',')[1]}
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
  );
}

