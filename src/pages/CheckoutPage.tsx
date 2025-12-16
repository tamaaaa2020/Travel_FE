import React from "react";
import { Navbar } from "../components/layout/Navbar";
import ContactForm from "../components/checkout/ContactForm";
import PassengerForm from "../components/checkout/PassengerForm";
import PassportForm from "../components/checkout/PassportForm";
import BookingSummary from "../components/checkout/BookingSummary";
import PaymentSummary from "../components/checkout/PaymentSummary";

export default function CheckoutPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="pt-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <ContactForm />
          <PassengerForm />
          <PassportForm />
          <PaymentSummary />
        </div>

        {/* RIGHT */}
        <BookingSummary />
      </div>
    </div>
  );
}
