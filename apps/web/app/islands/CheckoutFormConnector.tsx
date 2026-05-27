import { CheckoutForm, type CheckoutFormValues } from "@rwts/ui/form/CheckoutForm";

interface CheckoutFormConnectorProps {
  disabled: boolean;
}

const handleConfirm = async (_values: CheckoutFormValues): Promise<void> => {
  await fetch("/api/checkout", { method: "POST" });
  globalThis.location.href = "/";
};

export default function CheckoutFormConnector({ disabled }: CheckoutFormConnectorProps): JSX.Element {
  return <CheckoutForm disabled={disabled} onConfirm={handleConfirm} />;
}
