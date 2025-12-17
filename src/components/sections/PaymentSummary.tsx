import React from "react";

export default function PaymentSummary({ paymentMethod, setPaymentMethod, onSubmit, loading, total }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow space-y-4">
      <h3 className="font-semibold text-lg">Metode Pembayaran</h3>

      {/* QRIS */}
      <label className="flex items-center justify-between border rounded-lg p-4 cursor-pointer">
        <div className="flex items-center gap-3">
          <input
            type="radio"
            checked={paymentMethod === "qris"}
            onChange={() => setPaymentMethod("qris")}
          />
          <span className="font-medium">QRIS</span>
        </div>
      </label>

      {/* TOTAL */}
      <div className="flex justify-between font-semibold pt-4 border-t">
        <span>Total Pembayaran</span>
        <span className="text-red-600">IDR {total ? total.toLocaleString() : 0}</span>
      </div>

      {/* BUTTON */}
      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full mt-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400"
      >
        {loading ? "Memproses..." : "Lanjut Bayar"}
      </button>
    </div>
  );
}
