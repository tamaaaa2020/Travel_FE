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
    if(!destId) setDestId("2");
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
      className="w-full max-w-[1378px] mx-auto bg-white shadow-xl rounded-[12px] pt-[34px] px-[36px] pb-[44px] mt-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      {/* =======================
          TRAVEL MODE (Custom Radio)
      ======================= */}
      <motion.div
        className="flex gap-10 mb-8 items-center"
        variants={itemVariants}
      >
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${tripType === "one-way" ? "border-[#ed1c24]" : "border-gray-300"}`}>
            {tripType === "one-way" && <div className="w-[10px] h-[10px] rounded-full bg-[#ed1c24]" />}
          </div>
          <input 
            type="radio" 
            name="tripType" 
            checked={tripType === "one-way"} 
            onChange={() => setTripType("one-way")}
            className="hidden"
          />
          <span className="font-medium text-[20px] text-black">Sekali Jalan</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${tripType === "round-trip" ? "border-[#ed1c24]" : "border-gray-300"}`}>
             {tripType === "round-trip" && <div className="w-[10px] h-[10px] rounded-full bg-[#ed1c24]" />}
          </div>
          <input 
            type="radio" 
            name="tripType" 
            checked={tripType === "round-trip"} 
            onChange={() => setTripType("round-trip")}
            className="hidden"
          />
          <span className="font-medium text-[20px] text-black">Pulang Pergi</span>
        </label>
      </motion.div>

      {/* =======================
          FORM GRID
      ======================= */}
      <motion.div
        className="flex flex-wrap lg:flex-nowrap gap-4 items-end"
        variants={containerVariants}
      >
        {/* FROM & TO SECTION */}
        <div className="flex-1 flex items-end gap-2 relative min-w-[300px] lg:min-w-[420px]">
          <div className="flex-1">
             <AirportSelector
                label="Dari"
                placeholder="Jakarta, JKTC"
                airports={airports}
                value={originId}
                onChange={setOriginId}
                icon={<FiAirplay className="rotate-[-90deg] text-black" />}
                className="w-full"
                triggerClassName="bg-[#f8f8f8] border-none rounded-[12px] h-[48px] px-4 text-[16px] font-medium text-black placeholder:text-black"
                labelClassName="text-[16px] text-[#00000099] mb-2 block font-normal"
              />
          </div>

          {/* SWAP BUTTON */}
          <button 
            onClick={handleSwapAirports}
            className="w-[48px] h-[48px] bg-[#f70101] text-white rounded-[12px] flex items-center justify-center hover:bg-red-700 transition-colors shrink-0 mb-[0px]"
          >
            <FiRepeat className="text-xl" />
          </button>

          <div className="flex-1">
             <AirportSelector
                label="Ke"
                placeholder="Denpasar-Bali, DPS"
                airports={airports}
                value={destId}
                onChange={setDestId}
                icon={<FiAirplay className="rotate-[90deg] text-black" />}
                className="w-full"
                triggerClassName="bg-[#f8f8f8] border-none rounded-[12px] h-[48px] px-4 text-[16px] font-medium text-black placeholder:text-black"
                labelClassName="text-[16px] text-[#00000099] mb-2 block font-normal"
              />
          </div>
        </div>

        {/* DATES SECTION */}
        <div className="flex gap-4 min-w-[300px] lg:min-w-[350px] flex-1">
           <div className="flex-1">
              <CalendarDatePicker
                value={departDate}
                min={getTodayDate()}
                onChange={setDepartDate}
                label="Pergi"
                className="w-[15rem]"
                triggerClassName="bg-[#f8f8f8] border-none rounded-[12px] h-[48px] px-4 text-[16px] font-medium text-black w-[15rem] justify-start gap-3"
                labelClassName="text-[16px] text-[#00000099] mb-2 block font-normal"
                icon={<FiCalendar className="text-black text-lg" />}
              />
           </div>
           
           <div className={`flex-1 ${tripType === "one-way" ? "" : ""}`}>
              <CalendarDatePicker
                value={returnDate}
                min={departDate || getTodayDate()}
                onChange={setReturnDate}
                disabled={tripType === "one-way"}
                label="Pulang"
                placeholder={tripType === "one-way" ? "Pesan Pulang-Pergi" : "Pilih Tanggal"}
                className="w-[15rem]"
                triggerClassName={`bg-[#f8f8f8] border-none rounded-[12px] h-[48px] px-4 text-[16px] font-medium w-[15rem] justify-start gap-3 ${tripType === "one-way" ? "text-[#00000033]" : "text-black"}`}
                labelClassName="text-[16px] text-[#00000099] mb-2 block font-normal"
                icon={<FiCalendar className={`text-lg ${tripType === "one-way" ? "text-[#00000033]" : "text-black"}`} />}
              />
           </div>
        </div>

        {/* PASSENGERS & SEARCH */}
        <div className="flex gap-4 flex-grow min-w-[280px] lg:min-w-[300px] flex-1">
          <div className="flex-grow" style={{position: 'relative',left: '9rem'}}>
            <label className="block text-xs text-gray-500 mb-1 ml-1 font-medium" style={{textAlign:"left"}}>Penumpang, Kelas</label>
            <PassengerClassSelector
              initialPassenger={parseInt(passenger)}
              initialSeatClass={seatClass}
              onSave={(p, s) => {
                setPassenger(p.toString());
                setSeatClass(s);
              }}
              className="w-full"
              triggerClassName="bg-[#f8f8f8] border-none rounded-[12px] h-[48px] px-4 text-[16px] font-medium text-black w-[10rem] "
            />
          </div>

          <button
            onClick={handleSearch}
            className="w-[48px] h-[48px] bg-[#f70101] text-white rounded-[12px] flex items-center justify-center hover:bg-red-700 transition-colors shrink-0 mb-[0px]"
            style={{position: 'relative',top: '1rem', left: '1rem'}}
          >
            <FiSearch className="text-2xl" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
