"use client";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    // TODAY: We just simulate success
    console.log("Form submitted. Tomorrow, we connect to the backend API here.");
    setTimeout(() => {
      alert("UI Working! Backend integration needed next.");
      setLoading(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-bold mb-4">Payment Details</h2>

      {/* This renders the actual Card Number, Expiry, and CVC fields automatically */}
      <PaymentElement />

      <button
        disabled={!stripe || loading}
        className="mt-6 w-full bg-black text-white font-medium py-3 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay $10.99"}
      </button>
    </form>
  );
}