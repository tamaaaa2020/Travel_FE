import React, { useState, useEffect } from "react";
import { FiSearch, FiRepeat, FiCalendar, FiAirplay } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/axios";
import { PassengerClassSelector } from "../ui/PassengerClassSelector";
import { CalendarDatePicker } from "../ui/CalendarDatePicker";
import { AirportSelector } from "../ui/AirportSelector";

/* =======================
   ANIMATION VARIANTS
======================= */
const containerVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

/* =======================
   COMPONENT
======================= */
export const SearchBox: React.FC = () => {
  const navigate = useNavigate();
  const [airports, setAirports] = useState<any[]>([]);

  // Form State
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");
  const [originId, setOriginId] = useState("");
  const [destId, setDestId] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passenger, setPassenger] = useState("1");
  const [seatClass, setSeatClass] = useState("economy");

  // Helper: Get Today Date YYYY-MM-DD
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const res = await api.get("/airports");
        if (res.data && res.data.data) {
          setAirports(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch airports", err);
      }
    };
    fetchAirports();
  }, []);

  // Auto-load Defaults (Origin = 1, Date = Today) if empty
  useEffect(() => {
    if (!originId) setOriginId("1");
    if (!departDate) setDepartDate(getTodayDate());
  }, [originId, departDate]);

  const handleSwapAirports = () => {
    const temp = originId;
    setOriginId(destId);
    setDestId(temp);
  };

  const handleSearch = () => {
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

    const params = new URLSearchParams();
    if (originId) params.append("origin_airport_id", originId);
    if (destId) params.append("destination_airport_id", destId);
    if (departDate) params.append("departure_date", departDate);
    if (passenger) params.append("passenger", passenger);
    if (seatClass) params.append("seat_class", seatClass);

    navigate({
      pathname: "/pesan-tiket",
      search: params.toString(),
    });
  };

  return (
    <motion.div
      className="w-full max-w-7xl mx-auto bg-white shadow-xl rounded-3xl p-6 mt-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      {/* =======================
          TRAVEL MODE
      ======================= */}
      <motion.div
        className="flex gap-6 mb-6 text-sm"
        variants={itemVariants}
      >
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
      </motion.div>

      {/* =======================
          FORM GRID
      ======================= */}
      <motion.div
        className="grid grid-cols-12 gap-4 items-end"
        variants={containerVariants}
      >
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
            <label className="block text-xs text-gray-500 mb-1 ml-1 font-medium">Penumpang & Kelas</label>
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
      </motion.div>
    </motion.div>
  );
};
