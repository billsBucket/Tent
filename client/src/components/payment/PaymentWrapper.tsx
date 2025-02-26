import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import PaymentForm from "./PaymentForm";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface PaymentWrapperProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function PaymentWrapper({ amount, onSuccess, onError }: PaymentWrapperProps) {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const initializePayment = async () => {
      try {
        const response = await apiRequest("POST", "/api/create-payment-intent", {
          amount: Math.round(amount * 100), // Convert to cents
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Failed to initialize payment:", error);
        onError("Failed to initialize payment");
      }
    };

    initializePayment();
  }, [amount]);

  if (!clientSecret) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="p-6">
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: 'stripe',
          },
        }}
      >
        <PaymentForm
          amount={amount}
          onSuccess={onSuccess}
          onError={onError}
        />
      </Elements>
    </Card>
  );
}
