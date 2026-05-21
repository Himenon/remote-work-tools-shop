import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, type DefaultValues } from "react-hook-form";
import { CheckoutFormSchema, type CheckoutFormInput, type CheckoutFormValues } from "@rwts/contract/form/CheckoutFormSchema";

export type { CheckoutFormValues };

export interface CheckoutFormProps {
  disabled?: boolean;
  defaultValues?: DefaultValues<CheckoutFormInput>;
  onConfirm: (values: CheckoutFormValues) => Promise<void>;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ disabled, defaultValues, onConfirm }) => {
  const methods = useForm<CheckoutFormInput, unknown, CheckoutFormValues>({
    resolver: zodResolver(CheckoutFormSchema),
    defaultValues: defaultValues ?? {},
  });

  const handleSubmit = methods.handleSubmit(onConfirm);
  const isDisabled = disabled === true || methods.formState.isSubmitting;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit}>
        <button
          type="submit"
          disabled={isDisabled}
          className="w-full rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {methods.formState.isSubmitting ? "決済処理中..." : "決済を確定する"}
        </button>
      </form>
    </FormProvider>
  );
};

CheckoutForm.displayName = "CheckoutForm";
