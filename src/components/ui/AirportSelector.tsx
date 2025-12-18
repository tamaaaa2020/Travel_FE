import React, { useState, useRef, useEffect } from "react";
import { FiMapPin, FiSearch, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface Airport {
  id: number;
  code: string;
  city_name: string;
  airport_name: string;
}

interface AirportSelectorProps {
  label?: string;
  placeholder: string;
  airports: Airport[];
  value: string; // airport ID
  onChange: (id: string) => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  variant?: "default" | "compact";
  triggerClassName?: string;
}

export const AirportSelector: React.FC<AirportSelectorProps> = ({
  label,
  placeholder,
  airports,
  value,
  onChange,
  icon,
  disabled = false,
  variant = "default",
  triggerClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Cari airport yang sedang dipilih
  const selectedAirport = airports.find((a) => String(a.id) === String(value));

  // Filter airport berdasarkan search
  const filteredAirports = airports.filter(
    (a) =>
      a.city_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.airport_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      {variant === "default" && label && (
        <label className="block text-xs text-gray-500 mb-1 ml-1 font-medium" style={{textAlign: "left"}}>
          {label}
        </label>
      )}
      
      {/* TRIGGER BUTTON */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={
          variant === "compact"
            ? `cursor-pointer transition-colors hover:text-red-600 ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
              } ${triggerClassName}`
            : `flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-[15px] cursor-pointer transition-all hover:bg-white hover:border-gray-300 ${
                isOpen ? "ring-2 ring-red-100 border-red-400 bg-white" : ""
              } ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""} ${triggerClassName}`
        }
      >
        {variant === "default" && (
          <div className="text-gray-400 mr-3 text-lg">
              {icon || <FiMapPin />}
          </div>
        )}
        
        <div className={variant === "compact" ? "" : "flex-1 overflow-hidden"}>
          {selectedAirport ? (
            variant === "compact" ? (
              <span className="font-medium text-gray-900 whitespace-nowrap">
                {selectedAirport.city_name}, {selectedAirport.code}
              </span>
            ) : (
              <div className="flex flex-col items-start leading-tight">
                <span className="font-semibold text-gray-800 truncate w-full text-left">
                  {selectedAirport.city_name}, {selectedAirport.code}
                </span>
              </div>
            )
          ) : (
            <span className="text-gray-400 font-medium">{placeholder}</span>
          )}
        </div>
      </div>

      {/* DROPDOWN MENU */}
      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-[350px] md:w-[400px] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
          >
            {/* SEARCH HEADER */}
            <div className="p-3 border-b bg-gray-50">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        autoFocus
                        type="text"
                        placeholder="Masukkan nama kota atau bandara"
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* LIST */}
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 bg-white sticky top-0">
                    Kota atau Bandara Populer
                </div>
                
                {filteredAirports.length > 0 ? (
                    filteredAirports.map((airport) => (
                        <div
                            key={airport.id}
                            onClick={() => {
                                onChange(String(airport.id));
                                setIsOpen(false);
                                setSearchTerm("");
                            }}
                            className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors border-b border-gray-50 last:border-0 ${
                                String(value) === String(airport.id) 
                                    ? "bg-red-50" 
                                    : "hover:bg-gray-50"
                            }`}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                                    <FiMapPin />
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="font-semibold text-gray-800 text-sm truncate">
                                        {airport.city_name}, Indonesia
                                    </span>
                                    <span className="text-xs text-gray-500 truncate">
                                        {airport.airport_name}
                                    </span>
                                </div>
                            </div>
                            <div className="font-bold text-gray-400 text-sm pl-2 shrink-0">
                                {airport.code}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-400 text-sm">
                        Tidak ditemukan bandara "{searchTerm}"
                    </div>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
