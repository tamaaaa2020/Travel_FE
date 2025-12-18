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
  const airline = flight.airline?.name || "Unknown";
  const duration = flight.duration_formatted || "Unknown";

  const selectedClass = flight.flight_classes?.find(c => c.seat_class === seatClass) || flight.flight_classes?.[0];
  const price = parseFloat(selectedClass?.price || "0");
  const total = price * passengerCount;

  return (
    <div className="bg-white rounded-xl shadow p-6 sticky top-28">
      <h3 className="font-semibold mb-4">
        {originCity} → {destCity}
      </h3>

      <div className="text-sm space-y-2">
        <p>🛫 {depTime} – {originCode}</p>
        <p>🛬 {arrTime} – {destCode}</p>
        <p>✈️ {airline} • {duration}</p>
        <p className="capitalize">💺 {seatClass.replace('_', ' ')}</p>
      </div>

      <hr className="my-4" />

      <div className="flex justify-between text-sm">
        <span>{passengerCount} Penumpang</span>
        <span>x IDR {price.toLocaleString()}</span>
      </div>

      <div className="flex justify-between text-sm mt-2 font-semibold">
        <span>Total Pembayaran</span>
        <span className="text-red-600">IDR {total.toLocaleString()}</span>
      </div>
    </div>
  );
}