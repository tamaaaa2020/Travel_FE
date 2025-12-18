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
  FiRepeat // Icon untuk swap
} from "react-icons/fi";
import { PassengerClassSelector } from "../components/ui/PassengerClassSelector";
import { AirportSelector } from "../components/ui/AirportSelector";
import { FlightCard } from "../components/ui/FlightCard";
import { CalendarDatePicker } from "../components/ui/CalendarDatePicker";

// Type definitions matching new BE structure
interface Airport {
  id: number;
  code: string;
  city_name: string;
  airport_name: string;
}

interface Airline {
  id: number;
  iata: string;
  name: string;
  logo_url: string;
}

interface FlightClass {
  id: number;
  seat_class: string;
  price: string; // decimal as string from BE
  total_seats: number;
}

interface FlightLeg {
  id: number;
  leg_order: number;
  airline: Airline;
  origin: Airport;
  destination: Airport;
  departure_time: string;
  arrival_time: string;
  duration_minutes: number;
  duration_formatted: string;
  flight_number: string;
  layover_duration_minutes?: number;
  layover_duration_formatted?: string;
}

interface Flight {
  id: number;
  flight_code: string;
  airline: Airline;
  origin: Airport;
  destination: Airport;
  departure_time: string;
  arrival_time: string;
  total_duration_minutes: number;
  duration_formatted: string;
  transit_count: number;
  transit_info: string;
  flight_legs: FlightLeg[];
  flight_classes: FlightClass[];
}

export default function PesanTiketPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // ===== DATA STATE =====
  const [flights, setFlights] = useState<Flight[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);

  // ===== SEARCH STATE =====
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");
  const [originId, setOriginId] = useState(searchParams.get("origin_airport_id") || "");
  const [destId, setDestId] = useState(searchParams.get("destination_airport_id") || "");
  const [departDate, setDepartDate] = useState(searchParams.get("departure_date") || "");
  const [returnDate, setReturnDate] = useState("");
  const [passenger, setPassenger] = useState(searchParams.get("passenger") || "1");
  const [seatClass, setSeatClass] = useState(searchParams.get("seat_class") || "economy");

  // ===== FILTER STATE =====
  const [sort, setSort] = useState("Termurah");
  const [transit, setTransit] = useState("Semua");
  const [airline, setAirline] = useState("Semua");
  const [time, setTime] = useState("Semua");

  // Helper: Get Today Date YYYY-MM-DD
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  // 1. Fetch Airports & Initial Defaults
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Airports
        const airportRes = await api.get("/airports");
        if (airportRes.data && airportRes.data.data) {
          setAirports(airportRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // 2. Auto-load Defaults (Origin = 1, Date = Today) if empty
  useEffect(() => {
    if (!originId) setOriginId("1");
    if (!departDate) setDepartDate(getTodayDate());
  }, [originId, departDate]);

  // 3. Initial Flight Fetch if params exist
  useEffect(() => {
    if (searchParams.get("origin_airport_id") && searchParams.get("destination_airport_id")) {
      fetchFlights();
    }
  }, []); // Run once on mount if params exist (handled by Auto-load logic too)

  // 4. Fetch Flights Function
  const fetchFlights = async () => {
    // Validation
    if (!originId) {
      alert("Bandara asal tidak boleh kosong");
      return;
    }
    if (!destId) {
      alert("Bandara tujuan tidak boleh kosong");
      return;
    }
    if (!departDate) {
      alert("Tanggal pergi tidak boleh kosong");
      return;
    }
    if (originId === destId) {
      alert("Bandara asal dan tujuan tidak boleh sama");
      return;
    }

    setLoading(true);
    try {
      const params: any = {};
      if (originId) params.origin_airport_id = originId;
      if (destId) params.destination_airport_id = destId;
      if (departDate) params.departure_date = departDate;
      if (seatClass) params.seat_class = seatClass;

      const res = await api.get("/flights", { params });
      
      if (res.data && res.data.data) {
        // Ensure flights match origin and destination exactly
        const filtered = res.data.data.filter((f: Flight) => {
          const originMatch = String(f.origin.id) === String(originId);
          const destMatch = String(f.destination.id) === String(destId);
          return originMatch && destMatch;
        });
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
      seat_class: seatClass,
    });
    fetchFlights();
  };

  const handleSwapAirports = () => {
    const temp = originId;
    setOriginId(destId);
    setDestId(temp);
  };

  // 5. Filter Logic
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
        f.airline.name?.toLowerCase().includes(airline.toLowerCase())
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
      result.sort((a, b) => {
        const priceA = parseFloat(a.flight_classes?.[0]?.price || "0");
        const priceB = parseFloat(b.flight_classes?.[0]?.price || "0");
        return priceA - priceB;
      });
    } else if (sort === "Tercepat") {
      result.sort((a, b) => a.total_duration_minutes - b.total_duration_minutes);
    } else if (sort === "Paling Awal") {
      result.sort((a, b) =>
        new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime()
      );
    }

    return result;
  }, [flights, sort, transit, airline, time]);

  return (
    <div className="min-h-screen bg-gray-100">
      <NavPesanTiket />

      <div className="pt-24 pb-10">
        {/* SEARCH SECTION */}
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* TRIP TYPE TOGGLE */}
            <div className="flex gap-6 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="tripType" 
                  checked={tripType === "one-way"} 
                  onChange={() => setTripType("one-way")}
                  className="w-4 h-4 text-red-500 focus:ring-red-500"
                />
                <span className="font-medium text-gray-700">Sekali Jalan</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="tripType" 
                  checked={tripType === "round-trip"} 
                  onChange={() => setTripType("round-trip")}
                  className="w-4 h-4 text-red-500 focus:ring-red-500"
                />
                <span className="font-medium text-gray-700">Pulang Pergi</span>
              </label>
            </div>

            {/* SEARCH INPUTS GRID */}
            <div className="grid grid-cols-12 gap-4 items-end">
              {/* FROM & TO (Col 1-5) */}
              <div className="col-span-12 md:col-span-5 grid grid-cols-[1fr,auto,1fr] gap-2 items-center relative">
                {/* FROM */}
                <AirportSelector
                  label="Dari"
                  placeholder="Jakarta, JKTC"
                  airports={airports}
                  value={originId}
                  onChange={setOriginId}
                  icon={<FiAirplay className="rotate-[-90deg]" />}
                />

                {/* SWAP BUTTON */}
                <button 
                  onClick={handleSwapAirports}
                  className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md mt-6 mx-1 z-10"
                >
                  <FiRepeat className="text-sm" />
                </button>

                {/* TO */}
                <AirportSelector
                  label="Ke"
                  placeholder="Denpasar-Bali, DPS"
                  airports={airports}
                  value={destId}
                  onChange={setDestId}
                  icon={<FiAirplay className="rotate-[90deg]" />}
                />
              </div>

              {/* DATES (Col 6-9) */}
              <div className="col-span-12 md:col-span-4 grid grid-cols-2 gap-4">
                <CalendarDatePicker
                  value={departDate}
                  min={getTodayDate()}
                  onChange={setDepartDate}
                  className="relative"
                  triggerClassName="group-focus-within:ring-2 group-focus-within:ring-red-100 group-focus-within:border-red-400"
                  label="Pergi"
                />
                <div className={tripType === "one-way" ? "opacity-50 pointer-events-none" : ""}>
                  <CalendarDatePicker
                    value={returnDate}
                    min={departDate || getTodayDate()}
                    onChange={setReturnDate}
                    disabled={tripType === "one-way"}
                    className="relative"
                    triggerClassName={tripType === "round-trip" ? "group-focus-within:ring-2 group-focus-within:ring-red-100 group-focus-within:border-red-400" : ""}
                    label="Pulang"
                  />
                </div>
              </div>

              {/* PASSENGERS & SEARCH (Col 10-12) */}
              <div className="col-span-12 md:col-span-3 flex gap-4">
                {/* PASSENGER SELECTOR */}
                <div className="relative w-full">
                  <label className="block text-xs text-gray-500 mb-1 ml-1">Penumpang & Kelas</label>
                  <PassengerClassSelector
                    initialPassenger={parseInt(passenger)}
                    initialSeatClass={seatClass}
                    onSave={(p, s) => {
                      setPassenger(p.toString());
                      setSeatClass(s);
                    }}
                    className="w-full"
                    triggerClassName="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full justify-between hover:border-red-400 hover:bg-white"
                  />
                </div>

                {/* SEARCH BUTTON */}
                <button
                  onClick={handleSearch}
                  className="h-[50px] w-[50px] bg-red-600 text-white rounded-xl flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg shadow-red-200 mt-auto mb-[1px]"
                >
                  <FiSearch className="text-2xl" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FILTER & LIST (Existing Content) */}
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

        <section className="max-w-7xl mx-auto px-6 space-y-4">
          {loading ? (
            <div className="text-center py-10">Loading flights...</div>
          ) : !originId || !destId ? (
            <div className="text-center py-10 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500">Silakan pilih bandara asal dan tujuan untuk mencari penerbangan.</p>
            </div>
          ) : filteredFlights.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500">Tidak ada penerbangan ditemukan untuk rute ini.</p>
            </div>
          ) : (
            filteredFlights.map((f) => (
              <FlightCard
                key={f.id}
                flight={f}
                seatClass={seatClass}
                passenger={passenger}
              />
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
