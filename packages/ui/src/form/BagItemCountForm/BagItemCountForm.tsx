import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, type DefaultValues } from "react-hook-form";
import { QuantityStepperField } from "@rwts/ui/field/QuantityStepperField";
import {
  BagItemCountFormSchema,
  COUNT_MIN,
  COUNT_MAX,
  type BagItemCountFormInput,
  type BagItemCountFormValues,
} from "@rwts/contract/form/BagItemCountFormSchema";

export type { BagItemCountFormValues };

export interface BagItemCountFormProps {
  defaultValues?: DefaultValues<BagItemCountFormInput>;
  onSubmit: (values: BagItemCountFormValues) => Promise<void>;
}

export const BagItemCountForm: React.FC<BagItemCountFormProps> = ({ defaultValues, onSubmit }) => {
  const methods = useForm<BagItemCountFormInput, unknown, BagItemCountFormValues>({
    resolver: zodResolver(BagItemCountFormSchema),
    defaultValues,
  });

  const handleSubmit = methods.handleSubmit(onSubmit);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} noValidate className="flex items-end gap-3">
        <QuantityStepperField name="count" label="個数" min={COUNT_MIN} max={COUNT_MAX} required />
        <button
          type="submit"
          disabled={methods.formState.isSubmitting}
          className="self-end rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {methods.formState.isSubmitting ? "更新中..." : "更新"}
        </button>
      </form>
    </FormProvider>
  );
};

BagItemCountForm.displayName = "BagItemCountForm";
