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

  const toggleTripType = () => {
    setTripType((prev) => (prev === "one-way" ? "round-trip" : "one-way"));
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

      <div className="pt-24 pb-5 flex justify-center" style={{marginBottom:"0"}}>
        {/* COMPACT SEARCH SECTION - FRAME 77 */}
        <div 
          className="bg-white rounded-xl shadow flex items-center gap-0 relative"
          style={{
            width: "1170px",
            height: "57px",
            padding: "9px 11px 8px 20px",
            borderRadius: "12px",
            boxShadow: "0px 2px 3px 0px rgba(0,0,0,0.1)", 
          }}
        >
          {/* SEARCH ICON - elements */}
          <div className="flex-shrink-0" style={{width: "21px", height: "21px"}}>
            <FiSearch className="w-full h-full text-black transform" /> 
          </div>

          {/* ORIGIN - jakartaJktc */}
          <div className="flex-shrink-0" style={{marginLeft: "18px", width: "100px"}}> 
             {/* Adjusted width to fit content better than 109px if needed, or stick to SCSS 109px */}
            <AirportSelector
              placeholder="Jakarta, JKTC"
              airports={airports}
              value={originId}
              onChange={setOriginId}
              variant="compact"
              triggerClassName="font-medium text-[15px] text-black leading-6 truncate w-full p-0"
            />
          </div>

          {/* SWAP - frame12 */}
          <button 
            onClick={handleSwapAirports}
            className="flex items-center justify-center bg-white"
            style={{
              marginLeft: "19px",
              width: "32px", // 17px icon + padding approx
              height: "32px",
              borderRadius: "12px",
              boxShadow: "0px 2px 3px 0px #00000040",
              padding: "7px", // from SCSS 7px 8px 8px 7px
            }}
          >
            <FiRepeat className="text-black w-[17px] h-[17px]" />
          </button>

          {/* DESTINATION - denpasarBaliDps */}
          <div className="flex-shrink-0" style={{marginLeft: "19px", width: "110px"}}>
             {/* SCSS says 150px */}
            <AirportSelector
              placeholder="Denpasar-Bali, DPS"
              airports={airports}
              value={destId}
              onChange={setDestId}
              variant="compact"
              triggerClassName="font-medium text-[16px] text-black leading-6 truncate w-full p-0"
            />
          </div>

          {/* DIVIDER - a */}
          <div className="flex items-center justify-center text-gray-300 font-thin text-[16px]" style={{marginLeft: "21px", width: "5px"}}>
            |
          </div>

          {/* DATE & TRIP - rabu8Okt25SekaliJala */}
          <div className="flex items-center flex-shrink-0 relative" style={{marginLeft: "21px", width: "350px"}}>
             {/* SCSS says 220px, increased for round trip date */}
            <CalendarDatePicker
              value={departDate}
              min={getTodayDate()}
              onChange={setDepartDate}
              variant="compact"
              triggerClassName="font-medium text-[16px] text-black leading-6 p-0 gap-1"
            />
            
            {tripType === "round-trip" && (
                <>
                <span className="mx-1 text-gray-400">-</span>
                <CalendarDatePicker
                    value={returnDate}
                    min={departDate || getTodayDate()}
                    onChange={setReturnDate}
                    variant="compact"
                    label="Pulang"
                    triggerClassName="font-medium text-[16px] text-black leading-6 p-0 gap-1"
                />
                </>
            )}

            <button 
                onClick={toggleTripType}
                className="font-medium text-[16px] text-black leading-6 whitespace-nowrap ml-1 hover:text-red-600 transition-colors"
            >
              ({tripType === "one-way" ? "Sekali Jalan" : "Pulang Pergi"})
            </button>
          </div>

          {/* DIVIDER - a */}
          <div className="flex items-center justify-center text-gray-300 font-thin text-[16px]" style={{marginLeft: "21px", width: "5px"}}>
            |
          </div>

          {/* PASSENGER - a1PenumpangEkonomi */}
          <div className="flex-shrink-0" style={{marginLeft: "21px", width: "200px"}}>
             {/* SCSS says 185px */}
            <PassengerClassSelector
              initialPassenger={parseInt(passenger)}
              initialSeatClass={seatClass}
              onSave={(p, s) => {
                setPassenger(p.toString());
                setSeatClass(s);
              }}
              variant="compact"
              triggerClassName="font-medium text-[16px] text-black leading-6 truncate w-full p-0 bg-transparent"
            />
          </div>

          {/* SEARCH BUTTON - frame78 */}
          <button
            onClick={handleSearch}
            className="flex items-center justify-center bg-red-100 hover:bg-red-200 transition-colors ml-auto"
            style={{
              marginLeft: "auto", // SCSS says 142px from prev element, but flex usually auto
              borderRadius: "8px",
              padding: "8px 50px",
              height: "40px", // derived from padding + line-height? SCSS doesn't specify height explicitly for button frame, only padding.
            }}
          >
            <span className="font-medium text-[16px] text-[#f70101] leading-6 text-center">
              Cari
            </span>
          </button>
        </div>
      </div>

      {/* FILTER & LIST (Existing Content) */}
        <section className="max-w-7xl mx-auto px-6 flex gap-3 flex-wrap" style={{marginLeft:"2rem", marginRight:"2rem", paddingBottom:"1rem"}}>
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

        <section className="max-w-7xl mx-auto px-6 space-y-4" style={{marginLeft:"2rem", marginRight:"2rem", paddingBottom:"2rem", width:"50rem"}}>
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
  );
}

function FilterSelect({ icon, value, onChange, options }: any) {
  return (
    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-[15px] shadow text-sm">
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
