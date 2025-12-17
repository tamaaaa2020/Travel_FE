import React, { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";

interface Payment {
  id: string;
  user: string;
  method: string;
  amount: string;
  status: "paid" | "pending" | "failed";
  date: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "PAY-001",
      user: "User 101010",
      method: "QRIS",
      amount: "IDR 1.044.400",
      status: "paid",
      date: "08 Okt 2025",
    },
    {
      id: "PAY-002",
      user: "User Test",
      method: "OVO",
      amount: "IDR 969.686",
      status: "pending",
      date: "09 Okt 2025",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Payment | null>(null);
  const [form, setForm] = useState<Payment>({
    id: "",
    user: "",
    method: "",
    amount: "",
    status: "pending",
    date: "",
  });

  const openAdd = () => {
    setEditing(null);
    setForm({
      id: `PAY-${Date.now()}`,
      user: "",
      method: "",
      amount: "",
      status: "pending",
      date: "",
    });
    setShowModal(true);
  };

  const openEdit = (payment: Payment) => {
    setEditing(payment);
    setForm(payment);
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (editing) {
      setPayments((prev) =>
        prev.map((p) => (p.id === editing.id ? form : p))
      );
    } else {
      setPayments((prev) => [...prev, form]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus payment ini?")) {
      setPayments((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />

      <main className="ml-64 p-8 w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Payments Management</h1>
            <p className="text-gray-600 text-sm">
              Kelola pembayaran & status transaksi
            </p>
          </div>

          <button
            onClick={openAdd}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            + Add Payment
          </button>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3">Payment ID</th>
                <th>User</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{p.id}</td>
                  <td>{p.user}</td>
                  <td>{p.method}</td>
                  <td>{p.amount}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        p.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : p.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td>{p.date}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded-xl p-6 space-y-3">
            <h2 className="text-lg font-bold">
              {editing ? "Edit Payment" : "Add Payment"}
            </h2>

            {["user", "method", "amount", "date"].map((key) => (
              <input
                key={key}
                placeholder={key.toUpperCase()}
                value={(form as any)[key]}
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
            ))}

            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as any })
              }
              className="w-full border px-3 py-2 rounded"
            >
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
