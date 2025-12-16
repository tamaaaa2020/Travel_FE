import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavPesanTiket } from "../components/layout/NavPesanTiket";
import {
  FiSearch,
  FiFilter,
  FiClock,
  FiAirplay,
  FiShuffle,
} from "react-icons/fi";

const flights = [
  {
    airline: "Lion Air",
    code: "JT-763",
    logo: "🦁",
    depart: "09:40",
    arrive: "12:35",
    duration: "1j 55m",
    transit: "1 Transit",
    price: "IDR 969.686",
  },
  {
    airline: "Garuda Indonesia",
    code: "GA-187",
    logo: "🦅",
    depart: "09:40",
    arrive: "12:35",
    duration: "1j 55m",
    transit: "Langsung",
    price: "IDR 969.686",
  },
];

export default function PesanTiketPage() {
  const navigate = useNavigate(); // ✅ FIX

  // ===== SEARCH STATE =====
  const [from, setFrom] = useState("Jakarta, JKTC");
  const [to, setTo] = useState("Denpasar-Bali, DPS");
  const [date, setDate] = useState("Rabu, 8 Okt 25");
  const [passenger, setPassenger] = useState("1 Penumpang, Ekonomi");

  // ===== FILTER STATE =====
  const [sort, setSort] = useState("Termurah");
  const [transit, setTransit] = useState("Semua");
  const [airline, setAirline] = useState("Semua");
  const [time, setTime] = useState("Semua");

  return (
    <div className="min-h-screen bg-gray-100">
      <NavPesanTiket />

      <div className="pt-20">
        {/* SEARCH */}
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm">
              <FiSearch />
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="bg-transparent outline-none w-36"
              />
              →
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="bg-transparent outline-none w-40"
              />
            </div>

            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-4 py-2 bg-gray-100 rounded-full text-sm outline-none"
            />

            <input
              value={passenger}
              onChange={(e) => setPassenger(e.target.value)}
              className="px-4 py-2 bg-gray-100 rounded-full text-sm outline-none"
            />

            <button className="ml-auto px-6 py-2 bg-red-500 text-white rounded-lg">
              Cari
            </button>
          </div>
        </section>

        {/* FILTER */}
        <section className="max-w-7xl mx-auto px-6 py-4 flex gap-3 flex-wrap">
          <FilterSelect icon={<FiShuffle />} value={sort} onChange={setSort} options={["Termurah", "Tercepat", "Paling Awal"]} />
          <FilterSelect icon={<FiFilter />} value={transit} onChange={setTransit} options={["Semua", "Langsung", "1 Transit"]} />
          <FilterSelect icon={<FiAirplay />} value={airline} onChange={setAirline} options={["Semua", "Garuda", "Lion Air", "AirAsia"]} />
          <FilterSelect icon={<FiClock />} value={time} onChange={setTime} options={["Semua", "Pagi", "Siang", "Malam"]} />
        </section>

        {/* LIST */}
        <section className="max-w-7xl mx-auto px-6 pb-12 space-y-4">
          {flights.map((f, i) => (
            <div key={i} className="bg-white rounded-xl shadow flex items-center justify-between p-5">
              <div className="flex items-center gap-4 w-1/3">
                <div className="text-3xl">{f.logo}</div>
                <div>
                  <p className="font-semibold">{f.airline} | {f.code}</p>
                  <p className="text-sm text-gray-500">{f.depart} → {f.arrive}</p>
                </div>
              </div>

              <div className="text-sm text-gray-600 w-1/3 text-center">
                <p>{f.duration}</p>
                <p>{f.transit}</p>
              </div>

              <div className="w-1/3 text-right">
                <p className="text-sm">ECONOMY | 1.9</p>
                <p className="font-bold text-red-600">{f.price}</p>
                <button
                  onClick={() => navigate("/checkout")}
                  className="mt-2 px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Pilih
                </button>
              </div>
            </div>
          ))}
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
