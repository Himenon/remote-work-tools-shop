import { CheckoutForm, type CheckoutFormValues } from "@rwts/ui/form/CheckoutForm";

interface CheckoutFormConnectorProps {
  disabled: boolean;
}

export default function CheckoutFormConnector({ disabled }: CheckoutFormConnectorProps): JSX.Element {
  const handleConfirm = async (_values: CheckoutFormValues): Promise<void> => {
    await fetch("/api/checkout", { method: "POST" });
    window.location.href = "/";
  };

  return <CheckoutForm disabled={disabled} onConfirm={handleConfirm} />;
}
