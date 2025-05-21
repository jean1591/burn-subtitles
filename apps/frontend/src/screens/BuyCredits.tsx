import { PricingSection } from "@/components/Pricing";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/contexts/authContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function BuyCredits() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePurchaseCredits = async (
    plan: "starter" | "professional" | "enterprise"
  ) => {
    try {
      setIsProcessingPayment(true);
      setError(null);

      const data = await fetchApi("/payments/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({ plan }),
      });

      window.location.href = data.url;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="bg-[#FDF8F3]">
      <div className="container mx-auto px-4">
        {error && (
          <div className="my-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      <PricingSection
        onSelectPlan={handlePurchaseCredits}
        isProcessing={isProcessingPayment}
      />
    </div>
  );
}
