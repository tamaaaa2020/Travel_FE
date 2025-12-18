// Updated PassengerForm to accept index for title
export default function PassengerForm({ index, data, onChange }) {
  return (
    <div className="bg-white rounded-xl shadow">
      <div className="bg-red-500 text-white px-6 py-3 rounded-t-xl text-sm font-semibold">
        Penumpang {index + 1} (Dewasa)
      </div>

      <div className="p-6 space-y-4">
        {/* ... existing fields with value and onChange using onChange(field, value) ... */}
        <div className="flex gap-6 text-sm">
          {["Tuan", "Nyonya", "Nona"].map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`passengerTitle-${index}`}
                checked={data.title.toLowerCase() === t.toLowerCase()}
                onChange={() => onChange("title", t.toLowerCase())}
                className="cursor-pointer"
              />
              {t}
            </label>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3"
            placeholder="Nama Depan / tengah (jika ada)"
            value={data.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
          />
          <input
            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3"
            placeholder="Nama Keluarga / Nama Belakang"
            value={data.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
          />
        </div>
        <p className="text-xs text-gray-500">Isi sesuai KTP/Paspor (tanpa tanda baca dan gelar)</p>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!data.singleName}
            onChange={(e) => onChange("singleName", e.target.checked)}
          />
          Nama Penumpang ini hanya memiliki 1 kata
        </label>

        <div className="grid grid-cols-3 gap-4">
          <input
            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3"
            placeholder="Tanggal"
            value={data.dobDay}
            onChange={(e) => onChange("dobDay", e.target.value)}
          />
          <input
            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3"
            placeholder="Bulan"
            value={data.dobMonth}
            onChange={(e) => onChange("dobMonth", e.target.value)}
          />
          <input
            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3"
            placeholder="Tahun"
            value={data.dobYear}
            onChange={(e) => onChange("dobYear", e.target.value)}
          />
        </div>

        <input
          className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3"
          placeholder="Kewarganegaraan"
          value={data.nationality}
          onChange={(e) => onChange("nationality", e.target.value)}
        />
      </div>
    </div>
  );
}
