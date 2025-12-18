import React, { useState, useRef, useEffect } from "react";
import { FiMinus, FiPlus, FiUsers } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface PassengerClassSelectorProps {
  initialPassenger?: number;
  initialSeatClass?: string;
  onSave: (passenger: number, seatClass: string) => void;
  className?: string;
  triggerClassName?: string;
}

export const PassengerClassSelector: React.FC<PassengerClassSelectorProps> = ({
  initialPassenger = 1,
  initialSeatClass = "economy",
  onSave,
  className = "",
  triggerClassName = "bg-gray-100 px-4 py-2 rounded-full",
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
    // Tapi jika backend hanya terima total seat, maka Adult + Children.
    const total = adults + children;
    onSave(total > 0 ? total : 1, seatClass); // Minimal 1
    setIsOpen(false);
  };

  const increment = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
    setter(value + 1);
  };

  const decrement = (setter: React.Dispatch<React.SetStateAction<number>>, value: number, min: number = 0) => {
    if (value > min) {
      setter(value - 1);
    }
  };

  // Helper untuk menampilkan teks ringkasan
  const getSummaryText = () => {
    const total = adults + children + infants;
    const classLabel = getClassLabel(seatClass);
    return `${total} Passenger${total > 1 ? "s" : ""}, ${classLabel}`;
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
        className={`flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-colors ${triggerClassName}`}
      >
        <FiUsers className="text-red-500 text-lg" />
        <span className="text-sm text-gray-700 font-medium truncate select-none">
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
            className="absolute top-full left-0 mt-2 w-[320px] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 p-5"
          >
            <h3 className="font-bold text-lg mb-4 text-gray-800">Set Passenger & Class</h3>

            {/* PASSENGER COUNTERS */}
            <div className="space-y-4 mb-6">
              {/* ADULT */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Adult</p>
                  <p className="text-xs text-gray-400">(above 12 years old)</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => decrement(setAdults, adults, 1)}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${adults <= 1 ? "border-gray-200 text-gray-300" : "border-gray-400 text-red-500 hover:border-red-500"}`}
                    disabled={adults <= 1}
                  >
                    <FiMinus />
                  </button>
                  <span className="w-4 text-center font-medium">{adults}</span>
                  <button
                    onClick={() => increment(setAdults, adults)}
                    className="w-8 h-8 rounded-full border border-red-500 text-red-500 flex items-center justify-center hover:bg-red-50"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              {/* CHILDREN */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Children</p>
                  <p className="text-xs text-gray-400">(2 - 11 years old)</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => decrement(setChildren, children, 0)}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${children <= 0 ? "border-gray-200 text-gray-300" : "border-gray-400 text-red-500 hover:border-red-500"}`}
                    disabled={children <= 0}
                  >
                    <FiMinus />
                  </button>
                  <span className="w-4 text-center font-medium">{children}</span>
                  <button
                    onClick={() => increment(setChildren, children)}
                    className="w-8 h-8 rounded-full border border-red-500 text-red-500 flex items-center justify-center hover:bg-red-50"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              {/* INFANT */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Infant</p>
                  <p className="text-xs text-gray-400">(below 2 years old)</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => decrement(setInfants, infants, 0)}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${infants <= 0 ? "border-gray-200 text-gray-300" : "border-gray-400 text-red-500 hover:border-red-500"}`}
                    disabled={infants <= 0}
                  >
                    <FiMinus />
                  </button>
                  <span className="w-4 text-center font-medium">{infants}</span>
                  <button
                    onClick={() => increment(setInfants, infants)}
                    className="w-8 h-8 rounded-full border border-red-500 text-red-500 flex items-center justify-center hover:bg-red-50"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>
            </div>

            {/* CLASS SELECTION */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { id: "economy", label: "Economy" },
                { id: "business", label: "Business" },
                { id: "premium_economy", label: "Premium Eco" },
                { id: "first_class", label: "First" },
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
              className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200"
            >
              Save
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
