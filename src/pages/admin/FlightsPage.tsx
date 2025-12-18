import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { api } from "../../lib/axios";

interface Flight {
  id: number;
  flight_code: string;
  airline: {
    name: string;
  };
  origin: {
    code: string;
    city_name: string;
  };
  destination: {
    code: string;
    city_name: string;
  };
  duration_formatted: string;
  flight_classes: {
    seat_class: string;
    price: string;
  }[];
}

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);

  // FETCH DATA
  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const res = await api.get("/flights");
      if (res.data && res.data.data) {
        setFlights(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch flights", err);
    } finally {
      setLoading(false);
    }
  };

  // ... (Sisa kode modal dsb biarkan atau sesuaikan, tapi fokus ke listing)
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null); // Use any for now as form structure is complex
  
  // ...
  
  const handleDelete = async (id: number) => {
    if (confirm("Hapus flight ini?")) {
        try {
            await api.delete(`/admin/flights/${id}`);
            fetchFlights();
        } catch (err) {
            console.error("Failed to delete flight", err);
            alert("Gagal menghapus data.");
        }
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />

      <main className="ml-64 p-8 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Flights</h1>
          <button
            onClick={() => alert("Fitur Tambah Flight memerlukan form kompleks. Silakan gunakan API/Postman untuk saat ini.")}
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
                <th>Price (Start From)</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                  <tr><td colSpan={6} className="p-4 text-center">Loading...</td></tr>
              ) : flights.map((f) => (
                <tr key={f.id} className="border-t">
                  <td className="p-4 font-medium">{f.airline?.name}</td>
                  <td>{f.flight_code}</td>
                  <td>{f.origin?.city_name} ({f.origin?.code}) → {f.destination?.city_name} ({f.destination?.code})</td>
                  <td>{f.duration_formatted}</td>
                  <td className="font-semibold text-red-600">
                    IDR {parseFloat(f.flight_classes?.[0]?.price || "0").toLocaleString()}
                  </td>
                  <td className="p-4 space-x-3">
                    <button onClick={() => alert("Edit via API")} className="text-blue-600">
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
      
      {/* Modal removed for now as structure is too different */}
    </div>
  );
}
