export default function BookingSummary({ flight, originAirport, destAirport, passengerCount }) {
  const originCity = originAirport?.city_name || "Unknown";
  const destCity = destAirport?.city_name || "Unknown";
  const originCode = originAirport?.code || "???";
  const destCode = destAirport?.code || "???";
  const depTime = flight.departure_time ? new Date(flight.departure_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "";
  const arrTime = flight.arrival_time ? new Date(flight.arrival_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "";
  const airline = flight.airline_name || "Unknown";
  const duration = flight.total_duration || "Unknown";

  const economyClass = flight.flight_classes?.find(c => c.seat_class === "economy");
  const price = economyClass?.price || 0;
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
      </div>

      <hr className="my-4" />

      <div className="flex justify-between text-sm">
        <span>Total Pembayaran</span>
        <span className="font-semibold">IDR {total.toLocaleString()}</span>
      </div>
    </div>
  );
}