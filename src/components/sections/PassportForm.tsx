export default function PassportForm() {
  return (
    <div className="bg-white rounded-xl shadow">
      <div className="bg-red-500 text-white px-6 py-3 rounded-t-xl text-sm font-semibold">
        Informasi Paspor
      </div>

      <div className="p-6 space-y-4">
        <input className="input" placeholder="Nomor Paspor" />
        <input className="input" placeholder="Negara Penerbit" />

        <div className="grid grid-cols-3 gap-4">
          <input className="input" placeholder="Tanggal" />
          <input className="input" placeholder="Bulan" />
          <input className="input" placeholder="Tahun" />
        </div>
      </div>
    </div>
  );
}
