"use client";

import { useRouter } from "next/navigation";
import { CheckoutForm, type CheckoutFormValues } from "#ui/form/CheckoutForm";

interface CheckoutFormConnectorProps {
  disabled: boolean;
}

export const CheckoutFormConnector: React.FC<CheckoutFormConnectorProps> = ({ disabled }) => {
  const router = useRouter();

  const handleConfirm = async (_values: CheckoutFormValues): Promise<void> => {
    await fetch("/api/checkout", { method: "POST" });
    router.push("/");
  };

  return <CheckoutForm disabled={disabled} onConfirm={handleConfirm} />;
};

CheckoutFormConnector.displayName = "CheckoutFormConnector";
