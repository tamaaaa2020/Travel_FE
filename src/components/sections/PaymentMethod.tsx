import React, { useState } from "react";

const methods = [
  {
    id: "qris",
    label: "QRIS",
    logo: "/images/payment/qris.png",
  },
  {
    id: "ovo",
    label: "OVO",
    logo: "/images/payment/ovo.png",
  },
  {
    id: "shopeepay",
    label: "ShopeePay",
    logo: "/images/payment/shopeepay.png",
  },
  {
    id: "alfamart",
    label: "Alfamart",
    logo: "/images/payment/alfamart.png",
  },
  {
    id: "va",
    label: "Virtual Account",
    logo: "/images/payment/va.png",
  },
  {
    id: "card",
    label: "Kartu Kredit / Debit",
    logo: "/images/payment/card.png",
  },
];

export default function PaymentMethod() {
  const [selected, setSelected] = useState("qris");

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      {/* HEADER */}
      <div>
        <h3 className="font-semibold text-gray-900">
          Metode Pembayaran
        </h3>
        <p className="text-sm text-gray-500">
          Silakan pilih metode pembayaran yang tersedia
        </p>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {methods.map((m) => {
          const active = selected === m.id;

          return (
            <label
              key={m.id}
              className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition
                ${
                  active
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
            >
              {/* LEFT */}
              <div className="flex items-center gap-4">
                <img
                  src={m.logo}
                  alt={m.label}
                  className="h-6 object-contain"
                />
                <span className="font-medium text-gray-800">
                  {m.label}
                </span>
              </div>

              {/* RADIO */}
              <input
                type="radio"
                checked={active}
                onChange={() => setSelected(m.id)}
                className="accent-red-500 w-4 h-4"
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}
