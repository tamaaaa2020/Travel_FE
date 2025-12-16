export default function ContactForm() {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="font-semibold mb-1">Detail Pemesan</h2>
      <p className="text-sm text-gray-500 mb-4">
        Detail kontak ini akan digunakan untuk pengiriman e-tiket
      </p>

      {/* TITLE */}
      <div className="flex gap-6 mb-4 text-sm">
        {["Tuan", "Nyonya", "Nona"].map((t) => (
          <label key={t} className="flex items-center gap-2">
            <input type="radio" name="title" />
            {t}
          </label>
        ))}
      </div>

      <div className="space-y-4">
        <input className="input" placeholder="Nama Lengkap" />
        <input className="input" placeholder="Nomor Telepon" />
        <input className="input" placeholder="Alamat Email" />
      </div>
    </div>
  );
}
