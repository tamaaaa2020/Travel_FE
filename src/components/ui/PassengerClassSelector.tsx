import React, { useState, useRef, useEffect } from "react";
import { FiMinus, FiPlus, FiUsers } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface PassengerClassSelectorProps {
  initialPassenger?: number;
  initialSeatClass?: string;
  onSave: (passenger: number, seatClass: string) => void;
  className?: string;
  triggerClassName?: string;
  variant?: "default" | "compact";
}

export const PassengerClassSelector: React.FC<PassengerClassSelectorProps> = ({
  initialPassenger = 1,
  initialSeatClass = "economy",
  onSave,
  className = "",
  triggerClassName = "bg-gray-100 px-4 py-2 rounded-full",
  variant = "default",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // State untuk detail penumpang
  // Asumsi: initialPassenger adalah total adult + child.
  // Kita set default Adult = initialPassenger, sisanya 0.
  const [adults, setAdults] = useState(initialPassenger);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  
  // State untuk seat class
  const [seatClass, setSeatClass] = useState(initialSeatClass);

  // Close popover when clicking outside
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

  // Sync state if props change (optional, but good for consistency)
  useEffect(() => {
    setAdults(initialPassenger);
    setSeatClass(initialSeatClass);
  }, [initialPassenger, initialSeatClass]);

  const handleSave = () => {
    // Total passenger = Adult + Children (Infant usually sits on lap or handled differently)
    const total = adults + children;
    onSave(total > 0 ? total : 1, seatClass); // Minimal 1
    setIsOpen(false);
  };

  // VALIDATION RULES
  // 1. Max 7 passengers (Adult + Child)
  // 2. Max 4 infants
  // 3. Infant must be <= Adult

  const incrementAdult = () => {
    if (adults + children < 7) {
      setAdults(adults + 1);
    }
  };

  const decrementAdult = () => {
    // Adult cannot be less than 1
    // Adult cannot be less than Infant
    if (adults > 1 && adults > infants) {
      setAdults(adults - 1);
    }
  };

  const incrementChild = () => {
    if (adults + children < 7) {
      setChildren(children + 1);
    }
  };

  const decrementChild = () => {
    if (children > 0) {
      setChildren(children - 1);
    }
  };

  const incrementInfant = () => {
    // Max 4 infants
    // Infant <= Adult
    if (infants < 4 && infants < adults) {
      setInfants(infants + 1);
    }
  };

  const decrementInfant = () => {
    if (infants > 0) {
      setInfants(infants - 1);
    }
  };

  // Helper untuk menampilkan teks ringkasan
  const getSummaryText = () => {
    const totalPassengers = adults + children;
    const classLabel = getClassLabel(seatClass);
    if (variant === "compact") {
        return `${totalPassengers} Penumpang, ${classLabel}`;
    }
    return `${totalPassengers}, ${classLabel}`;
  };

  const getClassLabel = (cls: string) => {
    switch (cls) {
      case "economy": return "Economy";
      case "business": return "Business";
      case "first_class": return "First";
      case "premium_economy": return "Prem. Economy";
      default: return "Economy";
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* TRIGGER BUTTON */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={
          variant === "compact"
            ? `cursor-pointer transition-colors hover:text-red-600 whitespace-nowrap ${triggerClassName}`
            : `flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-colors ${triggerClassName}`
        }
      >
        {variant === "default" && <FiUsers className="text-red-500 text-lg" />}
        <span className={variant === "compact" ? "font-medium text-gray-900" : "text-sm text-gray-700 font-medium truncate select-none"}>
          {getSummaryText()}
        </span>
      </div>

      {/* POPOVER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-[350px] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 p-5"
          >
            <h3 className="font-bold text-lg mb-4 text-gray-800">Pilih Penumpang & Kelas</h3>

            {/* PASSENGER COUNTERS */}
            <div className="space-y-4 mb-6">
              {/* ADULT */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Dewasa</p>
                  <p className="text-xs text-gray-400">(12 tahun ke atas)</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decrementAdult}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${adults <= 1 || adults <= infants ? "border-gray-200 text-gray-300" : "border-gray-400 text-red-500 hover:border-red-500"}`}
                    disabled={adults <= 1 || adults <= infants}
                  >
                    <FiMinus />
                  </button>
                  <span className="w-4 text-center font-medium">{adults}</span>
                  <button
                    onClick={incrementAdult}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${adults + children >= 7 ? "border-gray-200 text-gray-300" : "border-gray-400 text-red-500 hover:border-red-500"}`}
                    disabled={adults + children >= 7}
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              {/* CHILDREN */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Anak</p>
                  <p className="text-xs text-gray-400">(2 - 11 tahun)</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decrementChild}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${children <= 0 ? "border-gray-200 text-gray-300" : "border-gray-400 text-red-500 hover:border-red-500"}`}
                    disabled={children <= 0}
                  >
                    <FiMinus />
                  </button>
                  <span className="w-4 text-center font-medium">{children}</span>
                  <button
                    onClick={incrementChild}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${adults + children >= 7 ? "border-gray-200 text-gray-300" : "border-gray-400 text-red-500 hover:border-red-500"}`}
                    disabled={adults + children >= 7}
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              {/* INFANT */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Bayi</p>
                  <p className="text-xs text-gray-400">(di bawah 2 tahun)</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decrementInfant}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${infants <= 0 ? "border-gray-200 text-gray-300" : "border-gray-400 text-red-500 hover:border-red-500"}`}
                    disabled={infants <= 0}
                  >
                    <FiMinus />
                  </button>
                  <span className="w-4 text-center font-medium">{infants}</span>
                  <button
                    onClick={incrementInfant}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${infants >= 4 || infants >= adults ? "border-gray-200 text-gray-300" : "border-gray-400 text-red-500 hover:border-red-500"}`}
                    disabled={infants >= 4 || infants >= adults}
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>
            </div>

            {/* CLASS SELECTION */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { id: "economy", label: "Ekonomi" },
                { id: "business", label: "Bisnis" },
                { id: "premium_economy", label: "Prem. Ekonomi" },
                { id: "first_class", label: "First Class" },
              ].map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => setSeatClass(cls.id)}
                  className={`py-2 px-1 rounded-full text-sm font-medium border transition-all ${
                    seatClass === cls.id
                      ? "border-red-500 bg-red-50 text-red-600"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {cls.label}
                </button>
              ))}
            </div>

            {/* SAVE BUTTON */}
            <button
              onClick={handleSave}
              className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
            >
              Simpan
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
