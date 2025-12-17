// Updated PassportForm to accept index for title if needed, but since separate, no title change
export default function PassportForm({ index, data, onChange }) {
  return (
    <div className="bg-white rounded-xl shadow">
      <div className="bg-red-500 text-white px-6 py-3 rounded-t-xl text-sm font-semibold">
        Informasi Paspor Penumpang {index + 1}
      </div>

      <div className="p-6 space-y-4">
        {/* ... existing fields with value and onChange ... */}
        <input
          className="input"
          placeholder="Nomor Paspor"
          value={data.number}
          onChange={(e) => onChange("number", e.target.value)}
        />
        <input
          className="input"
          placeholder="Negara Penerbit"
          value={data.issuingCountry}
          onChange={(e) => onChange("issuingCountry", e.target.value)}
        />

        <div className="grid grid-cols-3 gap-4">
          <input
            className="input"
            placeholder="Tanggal"
            value={data.validDay}
            onChange={(e) => onChange("validDay", e.target.value)}
          />
          <input
            className="input"
            placeholder="Bulan"
            value={data.validMonth}
            onChange={(e) => onChange("validMonth", e.target.value)}
          />
          <input
            className="input"
            placeholder="Tahun"
            value={data.validYear}
            onChange={(e) => onChange("validYear", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}