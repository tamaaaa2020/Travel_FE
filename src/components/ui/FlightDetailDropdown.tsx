import React from "react";
import { 
  FiWifi, 
  FiBriefcase, 
  FiLayout, 
  FiZap, 
  FiTv, 
  FiCoffee, 
  FiPackage,
  FiXCircle
} from "react-icons/fi";

interface FlightDetailProps {
  flight: any; // Using any for now to match the Flight interface from parent
  seatClass: string;
}

export const FlightDetailDropdown: React.FC<FlightDetailProps> = ({ flight, seatClass }) => {
  const originCity = flight.origin?.city_name || "Unknown";
  const destCity = flight.destination?.city_name || "Unknown";
  const originCode = flight.origin?.code || "";
  const destCode = flight.destination?.code || "";
  const originAirport = flight.origin?.airport_name || "Airport";
  const destAirport = flight.destination?.airport_name || "Airport";
  
  const depTime = new Date(flight.departure_time);
  const arrTime = new Date(flight.arrival_time);
  
  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (date: Date) => date.toLocaleDateString([], { day: 'numeric', month: 'short' });

  // Mock data for facilities based on seat class or random
  const facilities = [
    { icon: <FiPackage />, label: "Baggage 20 kg", available: true },
    { icon: <FiBriefcase />, label: "Cabin baggage 7 kg", available: true },
    { icon: <FiCoffee />, label: "In-flight meal", available: seatClass !== "economy" },
    { icon: <FiTv />, label: "In-flight entertainment", available: seatClass !== "economy" },
    { icon: <FiWifi />, label: "Wifi", available: false },
    { icon: <FiZap />, label: "Power/USB port", available: seatClass !== "economy" },
  ];

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex gap-4">
        {/* TIMELINE */}
        <div className="flex flex-col items-center mr-2">
           <div className="text-sm font-semibold">{formatTime(depTime)}</div>
           <div className="text-xs text-gray-500">{formatDate(depTime)}</div>
           
           {/* Line */}
           <div className="w-0.5 h-full bg-gray-300 my-2 relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-red-500 bg-white"></div>
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-red-500 bg-red-500"></div>
           </div>

           <div className="text-sm font-semibold">{formatTime(arrTime)}</div>
           <div className="text-xs text-gray-500">{formatDate(arrTime)}</div>
        </div>

        {/* DETAILS */}
        <div className="flex-1 space-y-8">
          {/* DEPARTURE */}
          <div>
            <div className="font-semibold text-lg">{originCity} ({originCode})</div>
            <div className="text-sm text-gray-500">{originAirport}</div>
            <div className="text-sm text-gray-500">Terminal 1A</div>
          </div>

          {/* FLIGHT INFO CARD */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={flight.airline?.logo_url} 
                alt={flight.airline?.name}
                className="w-8 h-8 object-contain"
              />
              <div>
                <div className="font-semibold text-sm">{flight.airline?.name}</div>
                <div className="text-xs text-gray-500">{flight.flight_code} • {seatClass}</div>
              </div>
            </div>

            {/* FACILITIES GRID */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-gray-600">
              {facilities.map((fac, idx) => (
                <div key={idx} className={`flex items-center gap-2 ${!fac.available ? 'text-gray-400' : ''}`}>
                  {fac.available ? fac.icon : <FiXCircle />}
                  <span>{fac.label} {fac.available ? '' : 'not available'}</span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <FiLayout />
                <span>Boeing 737 • 3-3 Seat Layout</span>
              </div>
            </div>
          </div>

          {/* ARRIVAL */}
          <div>
            <div className="font-semibold text-lg">{destCity} ({destCode})</div>
            <div className="text-sm text-gray-500">{destAirport}</div>
            <div className="text-sm text-gray-500">Terminal Domestic</div>
          </div>
        </div>
      </div>
      
      {/* TRANSIT INFO (If any) */}
      {flight.transit_count > 0 && (
         <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 text-sm rounded border border-yellow-200">
           <span className="font-semibold">Info Transit:</span> {flight.transit_count} Transit. 
           {flight.transit_info || " Silakan cek detail maskapai untuk info lebih lanjut."}
         </div>
      )}
    </div>
  );
};
