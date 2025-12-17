import React, { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";

interface Flight {
  id: number;
  airline: string;
  code: string;
  from: string;
  to: string;
  duration: string;
  price: string;
}

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([
    {
      id: 1,
      airline: "Lion Air",
      code: "JT-763",
      from: "CGK",
      to: "DPS",
      duration: "1j 55m",
      price: "IDR 969.686",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Flight | null>(null);
  const [form, setForm] = useState<Flight>({
    id: 0,
    airline: "",
    code: "",
    from: "",
    to: "",
    duration: "",
    price: "",
  });

  const openAdd = () => {
    setEditing(null);
    setForm({ id: Date.now(), airline: "", code: "", from: "", to: "", duration: "", price: "" });
    setShowModal(true);
  };

  const openEdit = (flight: Flight) => {
    setEditing(flight);
    setForm(flight);
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (editing) {
      setFlights((prev) =>
        prev.map((f) => (f.id === editing.id ? form : f))
      );
    } else {
      setFlights((prev) => [...prev, form]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Hapus flight ini?")) {
      setFlights((prev) => prev.filter((f) => f.id !== id));
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />

      <main className="ml-64 p-8 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Flights</h1>
          <button
            onClick={openAdd}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            + Add Flight
          </button>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Airline</th>
                <th>Code</th>
                <th>Route</th>
                <th>Duration</th>
                <th>Price</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((f) => (
                <tr key={f.id} className="border-t">
                  <td className="p-4 font-medium">{f.airline}</td>
                  <td>{f.code}</td>
                  <td>{f.from} → {f.to}</td>
                  <td>{f.duration}</td>
                  <td className="font-semibold text-red-600">{f.price}</td>
                  <td className="p-4 space-x-3">
                    <button onClick={() => openEdit(f)} className="text-blue-600">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(f.id)} className="text-red-600">
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
          <div className="bg-white w-[450px] rounded-xl p-6 space-y-3">
            <h2 className="text-lg font-bold">
              {editing ? "Edit Flight" : "Add Flight"}
            </h2>

            {["airline", "code", "from", "to", "duration", "price"].map((key) => (
              <input
                key={key}
                placeholder={key.toUpperCase()}
                value={(form as any)[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
            ))}

            <div className="flex justify-end gap-2 pt-4">
              <button onClick={() => setShowModal(false)} className="border px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={handleSubmit} className="bg-red-500 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
