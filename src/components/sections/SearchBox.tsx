import React, { useState, useEffect } from "react";
import { FiSearch, FiMapPin } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/axios";
import { PassengerClassSelector } from "../ui/PassengerClassSelector";

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
  const [originId, setOriginId] = useState("");
  const [destId, setDestId] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passenger, setPassenger] = useState("1");
  const [seatClass, setSeatClass] = useState("economy");

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

  const handleSearch = () => {
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
      className="w-full max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-6 mt-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      {/* =======================
          TRAVEL MODE
      ======================= */}
      <motion.div
        className="flex gap-6 mb-4 text-sm"
        variants={itemVariants}
      >
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="mode" defaultChecked />
          Sekali Jalan
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="mode" />
          Pulang Pergi
        </label>
      </motion.div>

      {/* =======================
          FORM GRID
      ======================= */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-5 gap-4"
        variants={containerVariants}
      >
        {/* DARI */}
        <motion.div
          className="flex items-center gap-2 bg-gray-100 px-3 py-3 rounded-xl"
          variants={itemVariants}
        >
          <FiMapPin className="text-red-500 text-xl" />
          <select
            value={originId}
            onChange={(e) => setOriginId(e.target.value)}
            className="bg-transparent w-full outline-none text-sm appearance-none"
          >
            <option value="">Dari (Kota/Bandara)</option>
            {airports.map((a) => (
              <option key={a.id} value={a.id}>
                {a.city_name} ({a.code})
              </option>
            ))}
          </select>
        </motion.div>

        {/* KE */}
        <motion.div
          className="flex items-center gap-2 bg-gray-100 px-3 py-3 rounded-xl"
          variants={itemVariants}
        >
          <FiMapPin className="text-red-500 text-xl" />
          <select
            value={destId}
            onChange={(e) => setDestId(e.target.value)}
            className="bg-transparent w-full outline-none text-sm appearance-none"
          >
            <option value="">Ke (Kota/Bandara)</option>
            {airports.map((a) => (
              <option key={a.id} value={a.id}>
                {a.city_name} ({a.code})
              </option>
            ))}
          </select>
        </motion.div>

        {/* PERGI */}
        <motion.input
          type="date"
          value={departDate}
          onChange={(e) => setDepartDate(e.target.value)}
          className="bg-gray-100 px-3 py-3 rounded-xl text-sm outline-none"
          variants={itemVariants}
        />

        {/* PULANG */}
        <motion.input
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          className="bg-gray-100 px-3 py-3 rounded-xl text-sm outline-none"
          variants={itemVariants}
        />

        {/* PENUMPANG */}
        <motion.div
          variants={itemVariants}
        >
          <PassengerClassSelector
            initialPassenger={parseInt(passenger)}
            initialSeatClass={seatClass}
            onSave={(p, s) => {
              setPassenger(p.toString());
              setSeatClass(s);
            }}
            className="w-full"
            triggerClassName="bg-gray-100 px-3 py-3 rounded-xl w-full"
          />
        </motion.div>
      </motion.div>

      {/* =======================
          SEARCH BUTTON
      ======================= */}
      <motion.div
        className="flex justify-end mt-4"
        variants={itemVariants}
      >
        <motion.button
          onClick={handleSearch}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-red-500 rounded-xl text-white
                     flex items-center gap-2 hover:bg-red-600"
        >
          <FiSearch />
          Cari Tiket
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
