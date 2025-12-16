export default function PassengerForm() {
  return (
    <div className="bg-white rounded-xl shadow">
      <div className="bg-red-500 text-white px-6 py-3 rounded-t-xl text-sm font-semibold">
        Penumpang 1 (Dewasa)
      </div>

      <div className="p-6 space-y-4">
        <div className="flex gap-6 text-sm">
          {["Tuan", "Nyonya", "Nona"].map((t) => (
            <label key={t} className="flex items-center gap-2">
              <input type="radio" name="passengerTitle" />
              {t}
            </label>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input className="input" placeholder="Nama Depan" />
          <input className="input" placeholder="Nama Belakang" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <input className="input" placeholder="Tanggal" />
          <input className="input" placeholder="Bulan" />
          <input className="input" placeholder="Tahun" />
        </div>

        <input className="input" placeholder="Kewarganegaraan" />
      </div>
    </div>
  );
}
