import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { api } from "../../lib/axios";

interface Airport {
  id: number;
  code: string;
  airport_name: string;
  city_name: string;
  country: string;
}

export default function AirportsPage() {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);

  // FETCH DATA
  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    setLoading(true);
    try {
      const res = await api.get("/airports");
      if (res.data && res.data.data) {
        setAirports(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch airports", err);
    } finally {
      setLoading(false);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Airport | null>(null);
  const [form, setForm] = useState<Partial<Airport>>({
    code: "",
    airport_name: "",
    city_name: "",
    country: "Indonesia"
  });

  const openAdd = () => {
    setEditing(null);
    setForm({ code: "", airport_name: "", city_name: "", country: "Indonesia" });
    setShowModal(true);
  };

  const openEdit = (airport: Airport) => {
    setEditing(airport);
    setForm(airport);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        // EDIT (PUT /admin/airports/:id)
        await api.put(`/admin/airports/${editing.id}`, form);
      } else {
        // ADD (POST /admin/airports)
        await api.post("/admin/airports", form);
      }
      fetchAirports();
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save airport", err);
      alert("Gagal menyimpan data. Pastikan Anda login sebagai Admin.");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Hapus airport ini?")) {
      try {
        await api.delete(`/admin/airports/${id}`);
        fetchAirports();
      } catch (err) {
        console.error("Failed to delete airport", err);
        alert("Gagal menghapus data.");
      }
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
                <tr key={a.id} className="border-t">
                  <td className="p-4 font-semibold">{a.code}</td>
                  <td>{a.airport_name}</td>
                  <td>{a.city_name}</td>
                  <td className="p-4 space-x-3">
                    <button
                      onClick={() => openEdit(a)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
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
              value={form.airport_name}
              onChange={(e) => setForm({ ...form, airport_name: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />

            <input
              placeholder="City"
              value={form.city_name}
              onChange={(e) => setForm({ ...form, city_name: e.target.value })}
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
