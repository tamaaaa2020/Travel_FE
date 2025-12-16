import React from "react";
import { useNavigate } from "react-router-dom";
import { NavPesanTiket } from "../components/layout/NavPesanTiket";
import {
  FiBriefcase,
  FiCoffee,
  FiWifi,
  FiUsb,
  FiMonitor,
  FiGrid,
} from "react-icons/fi";

export default function FlightDetailPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <NavPesanTiket />

      <div className="pt-24 max-w-6xl mx-auto px-6">
        {/* ===== CARD HEADER ===== */}
        <div className="bg-white rounded-xl shadow mb-6">
          <div className="p-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🦁</div>
              <div>
                <p className="font-semibold text-lg">
                  Lion Air | JT-763
                </p>
                <p className="text-sm text-gray-500">
                  Economy • 1 Transit
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm">ECONOMY | 1.9</p>
              <p className="font-bold text-red-600 text-lg">
                IDR 969.686 / pax
              </p>

              <button
                onClick={() => navigate("/checkout")}
                className="mt-2 px-6 py-2 bg-red-600 text-white rounded-lg"
              >
                Pilih
              </button>
            </div>
          </div>
        </div>

        {/* ===== DETAIL TIMELINE ===== */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="grid grid-cols-[80px_1fr] gap-6">
            {/* TIME */}
            <div className="text-sm text-gray-600 space-y-20">
              <div>
                <p className="font-medium">09:40</p>
                <p>8 Okt</p>
              </div>

              <div>
                <p className="text-xs">1j 55m</p>
              </div>

              <div>
                <p className="font-medium">12:35</p>
                <p>8 Okt</p>
              </div>
            </div>

            {/* DETAIL */}
            <div className="space-y-10 relative">
              {/* LINE */}
              <div className="absolute left-[-38px] top-3 bottom-3 w-px bg-gray-300" />

              {/* DEPART */}
              <div>
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-1" />
                  <div>
                    <p className="font-semibold">
                      Jakarta (CGK)
                    </p>
                    <p className="text-sm text-gray-500">
                      Soekarno Hatta International Airport
                    </p>
                    <p className="text-xs text-gray-400">
                      Terminal 1A
                    </p>
                  </div>
                </div>
              </div>

              {/* FLIGHT INFO */}
              <div className="pl-7">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🦁</span>
                  <p className="font-medium">
                    Lion Air JT-763 • Economy
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FiBriefcase /> Baggage 15 kg
                  </div>
                  <div className="flex items-center gap-2">
                    <FiBriefcase /> Cabin baggage 7 kg
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCoffee /> In-flight meal
                  </div>
                  <div className="flex items-center gap-2">
                    <FiWifi /> Wifi not available
                  </div>
                  <div className="flex items-center gap-2">
                    <FiUsb /> Power/USB not available
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMonitor /> Boeing 737
                  </div>
                  <div className="flex items-center gap-2">
                    <FiGrid /> 3-3 seat layout
                  </div>
                </div>
              </div>

              {/* ARRIVE */}
              <div>
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-1" />
                  <div>
                    <p className="font-semibold">
                      Bali / Denpasar (DPS)
                    </p>
                    <p className="text-sm text-gray-500">
                      Ngurah Rai International Airport
                    </p>
                    <p className="text-xs text-gray-400">
                      Terminal Domestic
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="border-t mt-6 pt-4 flex justify-between text-sm">
            <span className="text-gray-500">
              Info transit di sini
            </span>
            <button className="text-red-600 font-medium">
              Tampilkan Detail ▼
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
