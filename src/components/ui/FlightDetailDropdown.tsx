import React from "react";
 

interface FlightDetailProps {
  flight: any; // Using any for now to match the Flight interface from parent
  seatClass: string;
}

export const FlightDetailDropdown: React.FC<FlightDetailProps> = ({ flight, seatClass }) => {
  // If flight_legs exists and has items, use it. Otherwise, wrap the main flight as a single leg.
  const legs = flight.flight_legs && flight.flight_legs.length > 0 
    ? flight.flight_legs 
    : [{
        id: flight.id,
        origin: flight.origin,
        destination: flight.destination,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        airline: flight.airline,
        flight_number: flight.flight_code,
        duration_formatted: flight.duration_formatted,
        layover_duration_formatted: null // Single leg has no layover
      }];

  return (
    <div className="mt-4 border-t pt-6">
      {legs.map((leg: any, index: number) => (
        <React.Fragment key={leg.id || index}>
          <LegDetail leg={leg} seatClass={seatClass} />
          
          {/* Show Transit Info if there is a layover defined and it's not the last leg */}
          {leg.layover_duration_formatted && index < legs.length - 1 && (
             <TransitDetail 
               duration={leg.layover_duration_formatted} 
               city={leg.destination?.city_name} 
             />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// --- SUB COMPONENTS ---

const LegDetail = ({ leg, seatClass }: { leg: any, seatClass: string }) => {
  const originCity = leg.origin?.city_name || "Unknown";
  const destCity = leg.destination?.city_name || "Unknown";
  const originCode = leg.origin?.code || "";
  const destCode = leg.destination?.code || "";
  const originAirport = leg.origin?.airport_name || "Airport";
  const destAirport = leg.destination?.airport_name || "Airport";
  
  const depTime = new Date(leg.departure_time);
  const arrTime = new Date(leg.arrival_time);
  
  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (date: Date) => date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

  return (
    <div className="flex gap-4 relative min-h-[180px] mb-8" style={{marginLeft: '50px'}}>
      {/* 1. TIME COLUMN */}
      <div className="flex flex-col text-right min-w-[50px] pt-1">
         {/* Departure Time */}
         <div className="mb-[60px]">
            <div className="text-[14px] font-semibold text-black">{formatTime(depTime)}</div>
            <div className="text-[12px] font-medium text-[#0000008a]">{formatDate(depTime)}</div>
         </div>
         
         {/* Duration (Absolute centered if possible, or just spaced) */}
         
         {/* Arrival Time */}
         <div className="mt-auto pb-1">
            <div className="text-[14px] font-semibold text-black">{formatTime(arrTime)}</div>
            <div className="text-[12px] font-medium text-[#0000008a]">{formatDate(arrTime)}</div>
         </div>
      </div>

      {/* 2. LINE COLUMN */}
      <div className="flex flex-col items-center w-[20px] relative pt-2">
         {/* Top Circle (Hollow) */}
         <div className="w-[12px] h-[12px] rounded-full border border-[#f70101] bg-white z-10"></div>
         
         {/* Vertical Line */}
         <div className="w-[1px] bg-[#d9d9d9] absolute top-[12px] bottom-[12px] left-1/2 -translate-x-1/2"></div>

         {/* Duration Text floating left of line center - handled in time col or here? 
             Design has duration 1j 55m aligned with center of line. 
         */}
         <div className="absolute top-1/2 -translate-y-1/2 -left-[80px] w-[70px] text-right">
             <span className="text-[12px] font-medium text-[#0000008a]">{leg.duration_formatted}</span>
         </div>

         {/* Bottom Circle (Filled) */}
         <div className="w-[12px] h-[12px] rounded-full bg-[#f70101] z-10 mt-auto"></div>
      </div>

      {/* 3. DETAILS COLUMN */}
      <div className="flex-1 flex flex-col pt-1">
        {/* DEPARTURE INFO */}
        <div className="mb-[30px]">
          <div className="text-[14px] font-semibold text-black mb-1">{originCity} ({originCode})</div>
          <div className="text-[12px] font-medium text-[#0000008a]">{originAirport}</div>
          <div className="text-[12px] font-medium text-[#0000008a]">Terminal 1A</div>
        </div>

        {/* AIRLINE INFO */}
        <div className="mb-[30px] flex items-center gap-3">
             <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[14px] font-semibold text-black">{leg.airline?.name}</span>
                    <img 
                    src={leg.airline?.logo_url} 
                    alt={leg.airline?.name}
                    className="w-[20px] h-[20px] object-contain"
                    onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7'/%3E%3C/svg%3E";
                    }}
                    />
                </div>
                <div className="text-[12px] font-medium text-black">
                    {leg.flight_number} • {seatClass}
                </div>
             </div>
        </div>
 
        {/* ARRIVAL INFO */}
        <div className="mt-auto">
          <div className="text-[14px] font-semibold text-black mb-1">{destCity} ({destCode})</div>
          <div className="text-[12px] font-medium text-[#0000008a]">{destAirport}</div>
          <div className="text-[12px] font-medium text-[#0000008a]">Terminal Domestic</div>
        </div>
      </div>
    </div>
  );
};

const TransitDetail = ({ duration, city }: { duration: string, city: string }) => {
  return (
    <div className="flex gap-4 mb-8">
       {/* Time Column Placeholder */}
       <div className="min-w-[80px]"></div>

       {/* Line Column (Dashed for transit) */}
       <div className="flex flex-col items-center w-8">
          <div className="w-0.5 h-full bg-transparent border-l-2 border-dashed border-gray-300"></div>
       </div>

       {/* Details Column */}
       <div className="flex-1 py-4">
          <div className="flex justify-between items-start bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div>
              <div className="font-bold text-gray-900 text-sm">Stop in {city}</div>
              <div className="text-xs text-gray-600 mt-1 font-medium">
                 Bring your passport and transit visa (if required)
              </div>
              <div className="text-[10px] text-gray-400 mt-1">
                 Check the local regulation and if needed. and prepare visa before depature
              </div>
            </div>
            <div className="text-sm font-bold text-gray-700">{duration}</div>
          </div>
       </div>
    </div>
  );
};
