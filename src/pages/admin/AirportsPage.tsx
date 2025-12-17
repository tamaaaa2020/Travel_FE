import React, { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";

interface Airport {
  code: string;
  name: string;
  city: string;
}

export default function AirportsPage() {
  const [airports, setAirports] = useState<Airport[]>([
    { code: "CGK", name: "Soekarno Hatta", city: "Jakarta" },
    { code: "DPS", name: "Ngurah Rai", city: "Bali" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Airport | null>(null);
  const [form, setForm] = useState<Airport>({
    code: "",
    name: "",
    city: "",
  });

  const openAdd = () => {
    setEditing(null);
    setForm({ code: "", name: "", city: "" });
    setShowModal(true);
  };

  const openEdit = (airport: Airport) => {
    setEditing(airport);
    setForm(airport);
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (editing) {
      setAirports((prev) =>
        prev.map((a) => (a.code === editing.code ? form : a))
      );
    } else {
      setAirports((prev) => [...prev, form]);
    }
    setShowModal(false);
  };

  const handleDelete = (code: string) => {
    if (confirm("Hapus airport ini?")) {
      setAirports((prev) => prev.filter((a) => a.code !== code));
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />

      <main className="ml-64 p-8 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Airports</h1>
          <button
            onClick={openAdd}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            + Add Airport
          </button>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Code</th>
                <th>Name</th>
                <th>City</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {airports.map((a) => (
                <tr key={a.code} className="border-t">
                  <td className="p-4 font-semibold">{a.code}</td>
                  <td>{a.name}</td>
                  <td>{a.city}</td>
                  <td className="p-4 space-x-3">
                    <button
                      onClick={() => openEdit(a)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(a.code)}
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
          <div className="bg-white w-[400px] rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold">
              {editing ? "Edit Airport" : "Add Airport"}
            </h2>

            <input
              placeholder="Code"
              value={form.code}
              disabled={!!editing}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />

            <input
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-red-500 text-white rounded"
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
