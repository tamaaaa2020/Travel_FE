import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NavPesanTiket } from "../components/layout/NavPesanTiket";
import { api } from "../lib/axios";
import {
  FiSearch,
  FiFilter,
  FiClock,
  FiAirplay,
  FiShuffle,
} from "react-icons/fi";

export default function PesanTiketPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // ===== DATA STATE =====
  const [flights, setFlights] = useState<any[]>([]);
  const [airports, setAirports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ===== SEARCH STATE =====
  const [originId, setOriginId] = useState(searchParams.get("origin_airport_id") || "");
  const [destId, setDestId] = useState(searchParams.get("destination_airport_id") || "");
  const [departDate, setDepartDate] = useState(searchParams.get("departure_date") || "");
  const [passenger, setPassenger] = useState(searchParams.get("passenger") || "1");

  // ===== FILTER STATE =====
  const [sort, setSort] = useState("Termurah");
  const [transit, setTransit] = useState("Semua");
  const [airline, setAirline] = useState("Semua");
  const [time, setTime] = useState("Semua");

  // 1. Fetch Airports & Initial Flights
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Airports
        const airportRes = await api.get("/airports");
        if (airportRes.data && airportRes.data.data) {
          setAirports(airportRes.data.data);
        }

        // Fetch Flights (Search or All)
        fetchFlights();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // 2. Fetch Flights Function
  const fetchFlights = async () => {
    // Check if we have minimum search criteria (Origin & Destination)
    if (!originId || !destId) {
      setFlights([]);
      return;
    }

    setLoading(true);
    try {
      const params: any = {};
      if (originId) params.origin_airport_id = originId;
      if (destId) params.destination_airport_id = destId;
      if (departDate) params.departure_date = departDate;

      console.log("Fetching flights with params:", params);
      const res = await api.get("/flights", { params });
      console.log("API Response:", res.data);
      
      if (res.data && res.data.data) {
        // Ensure flights match origin and destination exactly
        const filtered = res.data.data.filter((f: any) => {
          console.log("Checking flight:", f);
          const originMatch = String(f.origin_airport_id) === String(originId);
          const destMatch = String(f.destination_airport_id) === String(destId);
          console.log(`Origin match: ${originMatch} (${f.origin_airport_id} vs ${originId})`);
          console.log(`Dest match: ${destMatch} (${f.destination_airport_id} vs ${destId})`);
          return originMatch && destMatch;
        });
        console.log("Filtered flights:", filtered);
        setFlights(filtered);
      } else {
        setFlights([]);
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Update URL params
    setSearchParams({
      origin_airport_id: originId,
      destination_airport_id: destId,
      departure_date: departDate,
      passenger,
    });
    fetchFlights();
  };

  // 3. Filter Logic
  const filteredFlights = useMemo(() => {
    let result = [...flights];

    // Filter by Transit
    if (transit !== "Semua") {
      if (transit === "Langsung") {
        result = result.filter((f) => f.transit_count === 0);
      } else if (transit === "1 Transit") {
        result = result.filter((f) => f.transit_count === 1);
      }
    }

    // Filter by Airline
    if (airline !== "Semua") {
      result = result.filter((f) =>
        f.airline_name?.toLowerCase().includes(airline.toLowerCase())
      );
    }

    // Filter by Time
    if (time !== "Semua") {
      result = result.filter((f) => {
        const hour = new Date(f.departure_time).getHours();
        if (time === "Pagi") return hour >= 0 && hour < 12;
        if (time === "Siang") return hour >= 12 && hour < 18;
        if (time === "Malam") return hour >= 18 && hour < 24;
        return true;
      });
    }

    // Sort
    if (sort === "Termurah") {
      result.sort(
        (a, b) =>
          (a.flight_classes?.[0]?.price || 0) -
          (b.flight_classes?.[0]?.price || 0)
      );
    } else if (sort === "Tercepat") {
      result.sort((a, b) => {
        const durA =
          new Date(a.arrival_time).getTime() -
          new Date(a.departure_time).getTime();
        const durB =
          new Date(b.arrival_time).getTime() -
          new Date(b.departure_time).getTime();
        return durA - durB;
      });
    } else if (sort === "Paling Awal") {
      result.sort(
        (a, b) =>
          new Date(a.departure_time).getTime() -
          new Date(b.departure_time).getTime()
      );
    }

    return result;
  }, [flights, sort, transit, airline, time]);

  return (
    <div className="min-h-screen bg-gray-100">
      <NavPesanTiket />

      <div className="pt-20">
        {/* SEARCH */}
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm">
              <FiSearch />
              {/* FROM */}
              <select
                value={originId}
                onChange={(e) => setOriginId(e.target.value)}
                className="bg-transparent outline-none w-36 appearance-none"
              >
                <option value="">Dari</option>
                {airports.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.city_name} ({a.code})
                  </option>
                ))}
              </select>
              →
              {/* TO */}
              <select
                value={destId}
                onChange={(e) => setDestId(e.target.value)}
                className="bg-transparent outline-none w-36 appearance-none"
              >
                <option value="">Ke</option>
                {airports.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.city_name} ({a.code})
                  </option>
                ))}
              </select>
            </div>

            <input
              type="date"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              className="px-4 py-2 bg-gray-100 rounded-full text-sm outline-none"
            />

            <select
              value={passenger}
              onChange={(e) => setPassenger(e.target.value)}
              className="px-4 py-2 bg-gray-100 rounded-full text-sm outline-none"
            >
              <option value="1">1 Penumpang</option>
              <option value="2">2 Penumpang</option>
              <option value="3">3 Penumpang</option>
            </select>

            <button
              onClick={handleSearch}
              className="ml-auto px-6 py-2 bg-red-500 text-white rounded-lg"
            >
              Cari
            </button>
          </div>
        </section>

        {/* FILTER */}
        <section className="max-w-7xl mx-auto px-6 py-4 flex gap-3 flex-wrap">
          <FilterSelect
            icon={<FiShuffle />}
            value={sort}
            onChange={setSort}
            options={["Termurah", "Tercepat", "Paling Awal"]}
          />
          <FilterSelect
            icon={<FiFilter />}
            value={transit}
            onChange={setTransit}
            options={["Semua", "Langsung", "1 Transit"]}
          />
          <FilterSelect
            icon={<FiAirplay />}
            value={airline}
            onChange={setAirline}
            options={["Semua", "Garuda", "Lion Air", "AirAsia"]}
          />
          <FilterSelect
            icon={<FiClock />}
            value={time}
            onChange={setTime}
            options={["Semua", "Pagi", "Siang", "Malam"]}
          />
        </section>

        {/* LIST */}
        <section className="max-w-7xl mx-auto px-6 pb-12 space-y-4">
          {loading ? (
            <div className="text-center py-10">Loading flights...</div>
          ) : !originId || !destId ? (
            <div className="text-center py-10">Silakan cari penerbangan terlebih dahulu.</div>
          ) : filteredFlights.length === 0 ? (
            <div className="text-center py-10">
              Tidak ada penerbangan ditemukan.
            </div>
          ) : (
            filteredFlights.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow flex items-center justify-between p-5"
              >
                <div className="flex items-center gap-4 w-1/3">
                  <div className="text-3xl">✈️</div>
                  <div>
                    <p className="font-semibold">
                      {f.airline_name} | {f.flight_code}
                    </p>
                    <p className="text-sm text-gray-500">
                      {f.departure_time
                        ? new Date(f.departure_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}{" "}
                      →{" "}
                      {f.arrival_time
                        ? new Date(f.arrival_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-600 w-1/3 text-center">
                  <p>{f.total_duration}</p>
                  <p>
                    {f.transit_count === 0
                      ? "Langsung"
                      : `${f.transit_count} Transit`}
                  </p>
                </div>

                <div className="w-1/3 text-right">
                  <p className="text-sm">ECONOMY</p>
                  <p className="font-bold text-red-600">
                    IDR {f.flight_classes?.[0]?.price?.toLocaleString()}
                  </p>
                  <button
                    onClick={() =>
                      navigate("/checkout", {
                        state: { flight: f, passengers: parseInt(passenger) },
                      })
                    }
                    className="mt-2 px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Pilih
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

function FilterSelect({ icon, value, onChange, options }: any) {
  return (
    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow text-sm">
      {icon}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="outline-none bg-transparent cursor-pointer"
      >
        {options.map((opt: string) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
