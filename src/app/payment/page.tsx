import StripeProvider from "@/components/StripeProvider";
import CheckoutForm from "@/components/CheckoutForm";

export default function PaymentPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <StripeProvider>
          <CheckoutForm />
        </StripeProvider>
      </div>
    </main>
  );
}