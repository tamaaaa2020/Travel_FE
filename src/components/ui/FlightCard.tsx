import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlightDetailDropdown } from "./FlightDetailDropdown";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface FlightCardProps {
  flight: any; // Using any to match Flight interface
  seatClass: string;
  passenger: string;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight, seatClass, passenger }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const selectedFlightClass = flight.flight_classes?.find((fc: any) => fc.seat_class === seatClass) || flight.flight_classes?.[0];
  const price = parseFloat(selectedFlightClass?.price || "0");

  const handleSelect = () => {
    navigate("/checkout", {
      state: { 
        flight, 
        passengers: parseInt(passenger),
        seat_class: selectedFlightClass?.seat_class || "economy"
      },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "2-digit"
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    }).replace(".", ":");
  };

  return (
    <div 
        onClick={handleSelect}
        className="bg-white rounded-[9px] shadow-[0px_2px_3px_0px_#00000040] cursor-pointer transition-all hover:shadow-lg relative overflow-hidden flex flex-col"
        style={{ width: "1170px", minHeight: "188px" }}
    >
        {/* UPPER PART: FLIGHT INFO */}
        <div className="flex items-start pl-[22px] pr-0 py-[8px]">
            {/* 1. LOGO SECTION (autoWrapper) */}
            <div className="flex flex-col items-start mt-[7px]">
                <div className="w-[108px] h-[108px] rounded-[68px] border border-[#061c3d1f] flex items-center justify-center bg-[url('../image/mjbs8srr-xdm7pg8.png')] bg-center bg-cover bg-no-repeat overflow-hidden">
                    <img 
                        src={flight.airline.logo_url} 
                        alt={flight.airline.name}
                        className="w-[80%] h-[80%] object-contain"
                        onError={(e) => {
                            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7'/%3E%3C/svg%3E";
                        }}
                    />
                </div>
            </div>

            {/* 2. ORIGIN SECTION (autoWrapper3) */}
            <div className="flex flex-col items-start mt-[23px] ml-[20px]"> 
                {/* Airline Info */}
                <div className="flex items-center w-[300px] h-[19px] mb-[27px]">
                    <span className="text-[20px] font-medium text-black leading-[24px]">{flight.airline.name}&nbsp;</span>
                    <span className="text-[20px] font-light text-black leading-[24px]">|&nbsp;</span>
                    <span className="text-[20px] font-medium text-black leading-[24px]">{flight.flight_code}</span>
                </div>

                {/* Time/Date Info (autoWrapper2) */}
                <div className="relative w-[50px] h-[25px]">
                    <p className="absolute -top-[17px] left-0 text-[15px] font-medium text-black leading-[24px]">
                        {formatTime(flight.departure_time)}
                    </p>
                    <p className="absolute bottom-[-17px] left-0 text-[12px] font-medium text-[#0000008a] leading-[24px]">
                        {flight.origin.code}
                    </p>
                    <p className="absolute top-0 left-0 text-[12px] font-medium text-[#0000008a] leading-[24px] whitespace-nowrap">
                        {formatDate(flight.departure_time)}
                    </p>
                </div>
            </div>

            {/* 3. DURATION SECTION (autoWrapper4) */}
            <div className="relative mt-[42px] ml-[150px] w-[115px] h-[47px]"> 
                <p className="absolute top-0 left-0 w-full text-center text-[15px] font-medium text-black leading-[24px]">
                    {flight.duration_formatted}
                </p>
                <p className="absolute -bottom-[2px] -right-[1px] w-[116px] text-center text-[15px] font-medium text-[#0000008a] leading-[24px]">
                    {flight.transit_count === 0 ? "Langsung" : `${flight.transit_count} Transit`}
                </p>
            </div>

            {/* 4. ARRIVAL SECTION (autoWrapper5) */}
            <div className="relative mt-[64px] ml-[120px] w-[113px] h-[25px]"> 
                <p className="absolute -top-[17px] right-0 text-[15px] font-medium text-black leading-[24px] text-right w-[76px]">
                    {formatTime(flight.arrival_time)}
                </p>
                <p className="absolute bottom-[-17px] right-0 text-[12px] font-medium text-[#0000008a] leading-[24px] text-right w-[76px]">
                    {flight.destination.code}
                </p>
                <p className="absolute top-0 left-0 text-[12px] font-medium text-[#0000008a] leading-[24px] text-right w-full whitespace-nowrap">
                    {formatDate(flight.arrival_time)}
                </p>
            </div>

            {/* 5. PRICE SECTION (autoWrapper6) */}
            <div className="flex flex-col items-start ml-auto">
                <div className="flex flex-col items-center border-l border-[#061c3d1f] bg-white pt-[46px] px-[23px] pb-[35px] rounded-r-[9px]">
                    <p className="text-[16px] font-medium text-black uppercase tracking-wide">
                        {(selectedFlightClass?.seat_class || "economy")} | I.9
                    </p>
                    <div className="mt-[11px] flex items-baseline flex-wrap justify-center w-[152px]">
                        <span className="text-[16px] font-medium text-[#f70101] tracking-[2.4px]">
                            IDR {price.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[13px] font-medium text-[#000000a3]">/</span>
                        <span className="text-[12px] font-medium text-[#000000a3]">pax</span>
                    </div>
                </div>
            </div>
        </div>

        {/* LOWER PART: FOOTER WITH SEPARATOR */}
        <div className="w-full px-[22px] pb-[15px]">
            {/* SEPARATOR LINE */}
            <div className="w-full h-px bg-gray-200 mb-[15px]"></div>
            
            <div className="flex items-center justify-between">
                {/* INFO TRANSIT */}
                <p className="text-[16px] font-medium text-black leading-[24px]">Info transit disini</p>
                
                {/* TAMPILKAN DETAIL */}
                <div 
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                    }}
                    className="flex items-center gap-2 cursor-pointer text-[16px] font-medium text-black hover:text-red-600 transition-colors"
                >
                    <span>Tampilkan Detail</span>
                    <FiChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </div>
            </div>
        </div>

        {/* DROPDOWN CONTENT (Absolute/Overlay or Expand) */}
        {isOpen && (
            <div className="w-full bg-white border-t shadow-inner" onClick={(e) => e.stopPropagation()}>
                <FlightDetailDropdown flight={flight} seatClass={seatClass} />
            </div>
        )}
    </div>
  );
};
