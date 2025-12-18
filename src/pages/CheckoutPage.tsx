import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/axios";

import { NavPesanTiket } from "../components/layout/NavPesanTiket";
import ContactForm from "../components/sections/ContatcForm";
import PassengerForm from "../components/sections/PassengerForm";
import PassportForm from "../components/sections/PassportForm";
import BookingSummary from "../components/sections/BookingSummary";
import PaymentSummary from "../components/sections/PaymentSummary";

interface Flight {
  id: number;
  flight_code: string;
  airline: {
    id: number;
    iata: string;
    name: string;
    logo_url: string;
  };
  origin: {
    id: number;
    code: string;
    city_name: string;
    airport_name: string;
  };
  destination: {
    id: number;
    code: string;
    city_name: string;
    airport_name: string;
  };
  departure_time: string;
  arrival_time: string;
  total_duration_minutes: number;
  duration_formatted: string;
  transit_count: number;
  transit_info: string;
  flight_legs: any[];
  flight_classes: FlightClass[];
}

interface FlightClass {
  id: number;
  seat_class: string;
  price: string;
  total_seats: number;
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  const flight = state?.flight as Flight;
  const passengerCount = state?.passengers || 1;
  const selectedSeatClass = state?.seat_class || "economy"; // Get selected seat class

  // Redirect if no flight
  useEffect(() => {
    if (!flight) {
      navigate("/pesan-tiket");
    }
  }, [flight, navigate]);

  if (!flight) return null;

  // State for contact
  const [contactData, setContactData] = useState({
    title: "Tuan",
    fullName: "",
    phone: "",
    email: "",
  });

  // State for passengers: array of {passenger, passport}
  const [passengers, setPassengers] = useState(
    Array.from({ length: passengerCount }, () => ({
      passenger: {
        title: "tuan",
        firstName: "",
        lastName: "",
        dobDay: "",
        dobMonth: "",
        dobYear: "",
        nationality: "",
      },
      passport: {
        number: "",
        issuingCountry: "",
        validDay: "",
        validMonth: "",
        validYear: "",
      },
    }))
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill contact and first passenger from user
  useEffect(() => {
    if (user) {
      const [firstName, ...lastNameArr] = (user.full_name || "").split(" ");
      const lastName = lastNameArr.join(" ");

      setContactData({
        title: "Tuan",
        fullName: user.full_name || "",
        phone: user.phone || "",
        email: user.email || "",
      });

      // Prefill first passenger
      setPassengers(prev => {
        const newPass = [...prev];
        newPass[0] = {
          ...newPass[0],
          passenger: {
            ...newPass[0].passenger,
            title: "tuan",
            firstName,
            lastName,
          },
        };
        return newPass;
      });
    }
  }, [user]);

  // Handle changes
  const handleContactChange = (field: string, value: string) => {
    setContactData(prev => ({ ...prev, [field]: value }));
  };

  const handlePassengerChange = (index: number, field: string, value: string) => {
    setPassengers(prev => {
      const newPass = [...prev];
      newPass[index] = {
        ...newPass[index],
        passenger: {
          ...newPass[index].passenger,
          [field]: value
        }
      };
      return newPass;
    });
  };

  const handlePassportChange = (index: number, field: string, value: string) => {
    setPassengers(prev => {
      const newPass = [...prev];
      newPass[index] = {
        ...newPass[index],
        passport: {
          ...newPass[index].passport,
          [field]: value
        }
      };
      return newPass;
    });
  };

  // Format date to YYYY-MM-DD
  const formatDate = (day: string, month: string, year: string) => {
    if (!day || !month || !year) return "";
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  // Get proper title format for backend
  const getTitleForBackend = (title: string): string => {
    switch (title.toLowerCase()) {
      case 'tuan':
      case 'mr':
        return 'tuan';
      case 'nyonya':
      case 'mrs':
        return 'nyonya';
      case 'nona':
      case 'ms':
        return 'nona';
      default:
        return 'tuan';
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // Validate contact
    if (!contactData.fullName || !contactData.phone || !contactData.email) {
      setError("Lengkapi detail pemesan");
      setLoading(false);
      return;
    }

    // Validate each passenger
    for (let i = 0; i < passengerCount; i++) {
      const p = passengers[i].passenger;
      const ps = passengers[i].passport;

      if (!p.firstName || !p.lastName || !p.dobDay || !p.dobMonth || !p.dobYear || !p.nationality) {
        setError(`Lengkapi detail penumpang ${i + 1}`);
        setLoading(false);
        return;
      }

      if (!ps.number || !ps.issuingCountry || !ps.validDay || !ps.validMonth || !ps.validYear) {
        setError(`Lengkapi informasi paspor penumpang ${i + 1}`);
        setLoading(false);
        return;
      }
    }

    // Prepare passengers request
    const passengersReq = passengers.map(({ passenger: p, passport: ps }) => ({
      title: getTitleForBackend(p.title),
      full_name: `${p.firstName} ${p.lastName}`,
      dob: formatDate(p.dobDay, p.dobMonth, p.dobYear),
      nationality: p.nationality,
      passport_number: ps.number,
      issuing_country: ps.issuingCountry,
      valid_until: formatDate(ps.validDay, ps.validMonth, ps.validYear),
    }));

    // Prepare booking item
    const bookingItem = {
      flight_id: flight.id,
      seat_class: selectedSeatClass,
      passengers: passengersReq,
    };

    // Prepare create order request
    const request = {
      items: [bookingItem],
    };

    try {
      const response = await api.post("/bookings", request);
      const data = response.data.data;

      // Simpan riwayat pesanan di localStorage (sederhana, sumber dari API)
      try {
        const prev = JSON.parse(localStorage.getItem("orders_history") || "[]");
        const next = Array.isArray(prev) ? prev : [];
        next.unshift(data);
        localStorage.setItem("orders_history", JSON.stringify(next.slice(0, 50)));
        localStorage.setItem("pending_order", JSON.stringify(data));
      } catch {}

      // Redirect ke payment URL jika tersedia
      // if (data.payment_url) {
      //   window.location.href = data.payment_url;
      // } else {
        // Fallback ke halaman payment internal
        navigate("/payment", {
          state: { paymentMethod: "qris", order: data },
        });
      // }
    } catch (err: any) {
      setError(err.response?.data?.error || "Gagal membuat pesanan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavPesanTiket />

      <div className="pt-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <ContactForm data={contactData} onChange={handleContactChange} />

          {passengers.map((_, index) => (
            <React.Fragment key={index}>
              <PassengerForm
                index={index}
                data={passengers[index].passenger}
                onChange={(field, value) => handlePassengerChange(index, field, value)}
              />
              <PassportForm
                index={index}
                data={passengers[index].passport}
                onChange={(field, value) => handlePassportChange(index, field, value)}
              />
            </React.Fragment>
          ))}

          <PaymentSummary
            paymentMethod="qris"
            setPaymentMethod={() => {}} // Fixed payment method for now
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>

        {/* RIGHT */}
        <BookingSummary
          flight={flight}
          passengerCount={passengerCount}
          seatClass={selectedSeatClass}
        />
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded">
          {error}
        </div>
      )}
    </div>
  );
}