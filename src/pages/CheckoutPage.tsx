import React from "react";
import { NavPesanTiket } from "../components/layout/NavPesanTiket";

import ContactForm from "../components/sections/ContatcForm";
import PassengerForm from "../components/sections/PassengerForm";
import PassportForm from "../components/sections/PassportForm";
import BookingSummary from "../components/sections/BookingSummary";
import PaymentSummary from "../components/sections/PaymentSummary";

export default function CheckoutPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <NavPesanTiket />

      <div className="pt-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <ContactForm />
          <PassengerForm />
          <PassportForm />
          <PaymentSummary /> {/* ✅ INI YANG KURANG */}
        </div>

        {/* RIGHT */}
        <BookingSummary />
      </div>
    </div>
  );
}
