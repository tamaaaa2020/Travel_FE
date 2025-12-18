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
            className="input"
            placeholder="Nama Depan"
            value={data.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
          />
          <input
            className="input"
            placeholder="Nama Belakang"
            value={data.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <input
            className="input"
            placeholder="Tanggal"
            value={data.dobDay}
            onChange={(e) => onChange("dobDay", e.target.value)}
          />
          <input
            className="input"
            placeholder="Bulan"
            value={data.dobMonth}
            onChange={(e) => onChange("dobMonth", e.target.value)}
          />
          <input
            className="input"
            placeholder="Tahun"
            value={data.dobYear}
            onChange={(e) => onChange("dobYear", e.target.value)}
          />
        </div>

        <input
          className="input"
          placeholder="Kewarganegaraan"
          value={data.nationality}
          onChange={(e) => onChange("nationality", e.target.value)}
        />
      </div>
    </div>
  );
}