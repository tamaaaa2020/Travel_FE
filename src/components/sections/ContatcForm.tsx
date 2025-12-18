// Updated ContactForm to accept props for controlled inputs
export default function ContactForm({ data, onChange }) {
  return (
    <div className="bg-white rounded-[1rem]">

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">

        {/* Inputs */}
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm text-gray-500">Nama Lengkap</label>
                <input
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                value={data.fullName}
                onChange={(e) => onChange("fullName", e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm text-gray-500">Nomor Telepon</label>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r pr-3">
                        <img src="https://flagcdn.com/w20/id.png" alt="ID" className="w-5" />
                        <span className="text-gray-700 text-sm">▼</span>
                    </div>
                    <input
                    className="w-full bg-white border border-gray-200 rounded-lg pl-24 pr-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    value={data.phone}
                    onChange={(e) => onChange("phone", e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm text-gray-500">Alamat Email</label>
                <input
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                value={data.email}
                onChange={(e) => onChange("email", e.target.value)}
                />
            </div>
        </div>
      </div>
    </div>
  );
}
