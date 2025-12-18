// Updated PassportForm to accept index for title if needed, but since separate, no title change
export default function PassportForm({ index, data, onChange }) {
  return (
    <div className="bg-white">
      <div className="bg-red-600 text-white px-6 py-3 text-base font-semibold">
        Informasi Paspor
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-2">
            <label className="text-sm text-gray-500">Nomor Paspor</label>
            <input
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                value={data.number}
                onChange={(e) => onChange("number", e.target.value)}
            />
        </div>
        
        <div className="space-y-2">
            <label className="text-sm text-gray-500">Negara Yang Mengeluarkan</label>
            <input
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                value={data.issuingCountry}
                onChange={(e) => onChange("issuingCountry", e.target.value)}
            />
        </div>

        <div className="space-y-2">
            <label className="text-sm text-gray-500">Tanggal Kadaluarsa</label>
            <div className="grid grid-cols-3 gap-4 w-full md:w-1/2">
                <input
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-center focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    value={data.validDay}
                    onChange={(e) => onChange("validDay", e.target.value)}
                />
                <input
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-center focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    value={data.validMonth}
                    onChange={(e) => onChange("validMonth", e.target.value)}
                />
                <input
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-center focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    value={data.validYear}
                    onChange={(e) => onChange("validYear", e.target.value)}
                />
            </div>
        </div>
      </div>
    </div>
  );
}
