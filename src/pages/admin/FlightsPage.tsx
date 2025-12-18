import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { api } from "../../lib/axios";

interface Flight {
  id: number;
  flight_code: string;
  airline_id: number;
  origin_airport_id: number;
  destination_airport_id: number;
  airline: {
    id: number;
    name: string;
  };
  origin: {
    id: number;
    code: string;
    city_name: string;
  };
  destination: {
    id: number;
    code: string;
    city_name: string;
  };
  departure_time: string;
  arrival_time: string;
  duration_formatted: string;
  flight_classes: {
    seat_class: string;
    price: number;
    total_seats: number;
  }[];
}

interface Airline {
  id: number;
  name: string;
}

interface Airport {
  id: number;
  code: string;
  city_name: string;
}

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);

  // FETCH DATA
  useEffect(() => {
    fetchFlights();
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    try {
      const [resAirlines, resAirports] = await Promise.all([
        api.get("/airlines"),
        api.get("/airports")
      ]);
      if (resAirlines.data?.data) setAirlines(resAirlines.data.data);
      if (resAirports.data?.data) setAirports(resAirports.data.data);
    } catch (err) {
      console.error("Failed to fetch dropdowns", err);
    }
  };

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

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Flight | null>(null);
  const [form, setForm] = useState({
    flight_code: "",
    airline_id: "",
    origin_airport_id: "",
    destination_airport_id: "",
    departure_time: "",
    arrival_time: "",
    price_economy: "0",
    price_business: "0",
    seats_economy: "100",
    seats_business: "20",
  });

  const openAdd = () => {
    setEditing(null);
    setForm({
      flight_code: "",
      airline_id: "",
      origin_airport_id: "",
      destination_airport_id: "",
      departure_time: "",
      arrival_time: "",
      price_economy: "1000000",
      price_business: "2000000",
      seats_economy: "100",
      seats_business: "20",
    });
    setShowModal(true);
  };

  const openEdit = (f: Flight) => {
    console.log("Opening edit for:", f);
    setEditing(f);
    const economy = f.flight_classes?.find(c => c.seat_class === 'economy');
    const business = f.flight_classes?.find(c => c.seat_class === 'business');
    
    setForm({
      flight_code: f.flight_code || "",
      airline_id: f.airline_id?.toString() || "",
      origin_airport_id: f.origin_airport_id?.toString() || "",
      destination_airport_id: f.destination_airport_id?.toString() || "",
      departure_time: f.departure_time ? f.departure_time.slice(0, 16) : "",
      arrival_time: f.arrival_time ? f.arrival_time.slice(0, 16) : "",
      price_economy: economy?.price?.toString() || "0",
      price_business: business?.price?.toString() || "0",
      seats_economy: economy?.total_seats?.toString() || "0",
      seats_business: business?.total_seats?.toString() || "0",
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const payload = {
      flight_code: form.flight_code,
      airline_id: parseInt(form.airline_id),
      origin_airport_id: parseInt(form.origin_airport_id),
      destination_airport_id: parseInt(form.destination_airport_id),
      departure_time: new Date(form.departure_time).toISOString(),
      arrival_time: new Date(form.arrival_time).toISOString(),
      flight_classes: [
        {
          seat_class: "economy",
          price: parseFloat(form.price_economy),
          total_seats: parseInt(form.seats_economy)
        },
        {
          seat_class: "business",
          price: parseFloat(form.price_business),
          total_seats: parseInt(form.seats_business)
        }
      ]
    };

    try {
      if (editing) {
        await api.put(`/admin/flights/${editing.id}`, payload);
      } else {
        await api.post("/admin/flights", payload);
      }
      fetchFlights();
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save flight", err);
      alert("Gagal menyimpan data.");
    }
  };

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
                <th>Price (Eco)</th>
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
                  <td>{f.origin?.city_name} → {f.destination?.city_name}</td>
                  <td>{f.duration_formatted}</td>
                  <td className="font-semibold text-red-600">
                    IDR {f.flight_classes?.find(c => c.seat_class === 'economy')?.price?.toLocaleString() || "0"}
                  </td>
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto py-10">
          <div className="bg-white w-[600px] rounded-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold">
              {editing ? "Edit Flight" : "Add Flight"}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Flight Code</label>
                <input
                  value={form.flight_code}
                  onChange={(e) => setForm({ ...form, flight_code: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="e.g. GA-123"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Airline</label>
                <select
                  value={form.airline_id}
                  onChange={(e) => setForm({ ...form, airline_id: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select Airline</option>
                  {airlines.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Origin</label>
                <select
                  value={form.origin_airport_id}
                  onChange={(e) => setForm({ ...form, origin_airport_id: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select Origin</option>
                  {airports.map(a => <option key={a.id} value={a.id}>{a.city_name} ({a.code})</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Destination</label>
                <select
                  value={form.destination_airport_id}
                  onChange={(e) => setForm({ ...form, destination_airport_id: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select Destination</option>
                  {airports.map(a => <option key={a.id} value={a.id}>{a.city_name} ({a.code})</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Departure Time</label>
                <input
                  type="datetime-local"
                  value={form.departure_time}
                  onChange={(e) => setForm({ ...form, departure_time: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Arrival Time</label>
                <input
                  type="datetime-local"
                  value={form.arrival_time}
                  onChange={(e) => setForm({ ...form, arrival_time: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            </div>

            <hr />
            <h3 className="font-semibold text-sm">Classes & Pricing</h3>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded">
              <div className="col-span-2 font-medium text-xs">Economy Class</div>
              <div>
                <label className="text-xs text-gray-500">Price</label>
                <input
                  type="number"
                  value={form.price_economy}
                  onChange={(e) => setForm({ ...form, price_economy: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Total Seats</label>
                <input
                  type="number"
                  value={form.seats_economy}
                  onChange={(e) => setForm({ ...form, seats_economy: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded">
              <div className="col-span-2 font-medium text-xs">Business Class</div>
              <div>
                <label className="text-xs text-gray-500">Price</label>
                <input
                  type="number"
                  value={form.price_business}
                  onChange={(e) => setForm({ ...form, price_business: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Total Seats</label>
                <input
                  type="number"
                  value={form.seats_business}
                  onChange={(e) => setForm({ ...form, seats_business: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            </div>

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
