// Updated ContactForm to accept props for controlled inputs
export default function ContactForm({ data, onChange }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="font-semibold mb-1">Detail Pemesan</h2>
      <p className="text-sm text-gray-500 mb-4">
        Detail kontak ini akan digunakan untuk pengiriman e-tiket dan keperluan refund/reschedule.
      </p>

      <div className="space-y-4">
        <input
          className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3"
          placeholder="Nama Lengkap"
          value={data.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
        />
        <input
          className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3"
          placeholder="Nomor Telepon"
          value={data.phone}
          onChange={(e) => onChange("phone", e.target.value)}
        />
        <input
          className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3"
          placeholder="Alamat Email"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
      </div>
    </div>
  );
}
