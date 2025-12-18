// Updated PassengerForm to accept index for title
export default function PassengerForm({ index, data, onChange }) {
  return (
    <div className="bg-white">
      <div className="bg-red-600 text-white px-6 py-3 text-base font-semibold">
        Penumpang {index + 1} (Dewasa)
      </div>

      <div className="p-6 space-y-6">
        {/* Title Selection */}
        <div className="flex gap-8">
          {["Tuan", "Nyonya", "Nona"].map((t) => (
            <label key={t} className="flex items-center gap-3 cursor-pointer">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${data.title.toLowerCase() === t.toLowerCase() ? 'border-red-600' : 'border-gray-300'}`}>
                {data.title.toLowerCase() === t.toLowerCase() && <div className="w-2.5 h-2.5 rounded-full bg-red-600" />}
              </div>
              <input
                type="radio"
                name={`passengerTitle-${index}`}
                checked={data.title.toLowerCase() === t.toLowerCase()}
                onChange={() => onChange("title", t.toLowerCase())}
                className="hidden"
              />
              <span className="text-gray-700 text-base">{t}</span>
            </label>
          ))}
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Nama Depan / tengah (jika ada)</label>
            <input
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              value={data.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Nama Keluarga / Nama Belakang</label>
            <input
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              value={data.lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
            />
          </div>
        </div>

        <p className="text-xs text-gray-400 -mt-2">Isi sesuai KTP/Paspor (tanpa tanda baca dan gelar)</p>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${data.singleName ? 'border-red-600' : 'border-gray-300'}`}>
             {data.singleName && <div className="w-2.5 h-2.5 rounded-full bg-red-600" />}
          </div>
          <input
            type="checkbox"
            checked={!!data.singleName}
            onChange={(e) => onChange("singleName", e.target.checked)}
            className="hidden"
          />
          <span className="text-sm text-gray-700">Nama Penumpang ini hanya memiliki 1 kata</span>
        </label>

        {/* DOB & Nationality */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm text-gray-500">Tanggal Lahir</label>
                <div className="grid grid-cols-3 gap-4">
                    <input
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-center focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        value={data.dobDay}
                        onChange={(e) => onChange("dobDay", e.target.value)}
                    />
                    <input
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-center focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        value={data.dobMonth}
                        onChange={(e) => onChange("dobMonth", e.target.value)}
                    />
                    <input
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-center focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        value={data.dobYear}
                        onChange={(e) => onChange("dobYear", e.target.value)}
                    />
                </div>
            </div>
            
            <div className="space-y-2">
                <label className="text-sm text-gray-500">Kewarganegaraan</label>
                <input
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    value={data.nationality}
                    onChange={(e) => onChange("nationality", e.target.value)}
                />
            </div>
        </div>
      </div>
    </div>
  );
}
