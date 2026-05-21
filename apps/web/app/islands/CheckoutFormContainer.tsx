import { CheckoutForm, type CheckoutFormValues } from "@rwts/ui/form/CheckoutForm";

interface CheckoutFormContainerProps {
  disabled: boolean;
}

const handleConfirm = async (_values: CheckoutFormValues): Promise<void> => {
  await fetch("/api/checkout", { method: "POST" });
  globalThis.location.href = "/";
};

export default function CheckoutFormContainer({ disabled }: CheckoutFormContainerProps): JSX.Element {
  return <CheckoutForm disabled={disabled} onConfirm={handleConfirm} />;
}
