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

export default function BookingSummary({ flight, passengerCount, seatClass }: { flight: Flight; passengerCount: number; seatClass: string }) {
  const originCity = flight.origin?.city_name || "Unknown";
  const destCity = flight.destination?.city_name || "Unknown";
  const originCode = flight.origin?.code || "???";
  const destCode = flight.destination?.code || "???";
  const depTime = flight.departure_time ? new Date(flight.departure_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "";
  const arrTime = flight.arrival_time ? new Date(flight.arrival_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "";
  const airlineLogo = flight.airline?.logo_url || "";
  const duration = flight.duration_formatted || "";
  const dateLabel = flight.departure_time ? new Date(flight.departure_time).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: '2-digit' }) : "";
  const transitLabel = flight.transit_count === 0 ? "Langsung" : `${flight.transit_count} Transit`;

  const selectedClass = flight.flight_classes?.find(c => c.seat_class === seatClass) || flight.flight_classes?.[0];
  const price = parseFloat(selectedClass?.price || "0");
  const total = price * passengerCount;

  return (
    <div className="bg-white rounded-xl shadow top-28 overflow-hidden" style={{height: '18rem'}}>
      <div className="px-6 pt-5 pb-4">
        <div className="text-lg font-semibold">{originCity} → {destCity}</div>
      </div>
      <div className="border-t">
        <div className="px-6 py-3 flex items-center gap-2 text-sm">
          <span className="px-2 py-1 rounded-md border text-gray-700">Pergi</span>
          <span className="text-gray-600">{dateLabel}</span>
        </div>
        <div className="px-6 pb-4">
          <div className="rounded-xl border p-4 flex items-center gap-4">
            <img
              src={airlineLogo}
              alt={flight.airline?.name}
              className="w-8 h-8 object-contain"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3C/svg%3E"; }}
            />
            <div className="flex-1 grid grid-cols-3 text-sm">
              <div className="text-gray-900">
                <div className="font-semibold">{depTime}</div>
                <div className="text-xs text-gray-500">{originCode}</div>
              </div>
              <div className="text-center text-gray-700">
                <div className="font-medium">{duration}</div>
                <div className="text-xs text-gray-500">{transitLabel}</div>
              </div>
              <div className="text-right text-gray-900">
                <div className="font-semibold">{arrTime}</div>
                <div className="text-xs text-gray-500">{destCode}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t flex items-center justify-between text-sm">
          <span className="text-gray-600">Total Pembayaran</span>
          <span className="font-bold text-red-600">IDR {total.toLocaleString("id-ID")}</span>
        </div>
      </div>
    </div>
  );
}
