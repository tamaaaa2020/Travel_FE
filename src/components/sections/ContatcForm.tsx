// Updated ContactForm to accept props for controlled inputs
export default function ContactForm({ data, onChange }) {
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
            <input
              type="radio"
              name="title"
              checked={data.title === t}
              onChange={() => onChange("title", t)}
            />
            {t}
          </label>
        ))}
      </div>

      <div className="space-y-4">
        <input
          className="input"
          placeholder="Nama Lengkap"
          value={data.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
        />
        <input
          className="input"
          placeholder="Nomor Telepon"
          value={data.phone}
          onChange={(e) => onChange("phone", e.target.value)}
        />
        <input
          className="input"
          placeholder="Alamat Email"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
      </div>
    </div>
  );
}