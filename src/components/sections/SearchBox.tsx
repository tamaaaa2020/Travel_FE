import React from "react";
import { FiSearch, FiMapPin, FiUsers } from "react-icons/fi";
import { motion } from "framer-motion";

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
          <input
            type="text"
            placeholder="Jakarta, JKTC"
            className="bg-transparent w-full outline-none text-sm"
          />
        </motion.div>

        {/* KE */}
        <motion.div
          className="flex items-center gap-2 bg-gray-100 px-3 py-3 rounded-xl"
          variants={itemVariants}
        >
          <FiMapPin className="text-red-500 text-xl" />
          <input
            type="text"
            placeholder="Denpasar-Bali, DPS"
            className="bg-transparent w-full outline-none text-sm"
          />
        </motion.div>

        {/* PERGI */}
        <motion.input
          type="date"
          className="bg-gray-100 px-3 py-3 rounded-xl text-sm outline-none"
          variants={itemVariants}
        />

        {/* PULANG */}
        <motion.input
          type="date"
          className="bg-gray-100 px-3 py-3 rounded-xl text-sm outline-none"
          variants={itemVariants}
        />

        {/* PENUMPANG */}
        <motion.div
          className="flex items-center gap-2 bg-gray-100 px-3 py-3 rounded-xl"
          variants={itemVariants}
        >
          <FiUsers className="text-red-500 text-xl" />
          <select className="bg-transparent w-full text-sm outline-none">
            <option>1 Penumpang, Ekonomi</option>
            <option>2 Penumpang, Ekonomi</option>
            <option>1 Penumpang, Bisnis</option>
          </select>
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
