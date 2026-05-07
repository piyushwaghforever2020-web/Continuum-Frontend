"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Use the public sample key I gave you
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

export default function StripeProvider({ children }: { children: React.ReactNode }) {
  const appearance = {
    theme: 'stripe' as const, // You can change to 'night', 'flat', or 'none'
    variables: { colorPrimary: '#0570de' },
  };

  const options = {
    mode: 'payment' as const,
    amount: 1099,
    currency: 'usd',
    fields: {
      billingDetails: {
        email: 'auto',
      },
    },
    appearance: {
      theme: 'stripe' as const,
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}