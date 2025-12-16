export default function BookingSummary() {
  return (
    <div className="bg-white rounded-xl shadow p-6 sticky top-28">
      <h3 className="font-semibold mb-4">
        Jakarta → Denpasar-Bali
      </h3>

      <div className="text-sm space-y-2">
        <p>🛫 09:40 – CGK</p>
        <p>🛬 12:35 – DPS</p>
        <p>✈️ Lion Air • 1j 55m</p>
      </div>

      <hr className="my-4" />

      <div className="flex justify-between text-sm">
        <span>Total Pembayaran</span>
        <span className="font-semibold">IDR 1.044.400</span>
      </div>
    </div>
  );
}
