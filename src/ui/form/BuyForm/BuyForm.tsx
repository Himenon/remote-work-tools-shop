"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { QuantityStepperField } from "#ui/field/QuantityStepperField";
import {
  BuyFormSchema,
  COUNT_MIN,
  COUNT_MAX,
  DEFAULT_COUNT,
  DEFAULT_WRAPPING,
  type BuyFormInput,
  type BuyFormValues,
} from "#schema/form/BuyFormSchema";
import type { ProductSpec } from "./parts/types";
import { GiftOptionSection } from "./parts/GiftOptionSection";
import { PriceSummarySection } from "./parts/PriceSummarySection";
import { SpecsSection } from "./parts/SpecsSection";

export type { BuyFormValues };

export interface BuyFormProps {
  spec: ProductSpec;
  onSubmit: (values: BuyFormValues) => Promise<void>;
}

const FIRST_SPEC_INDEX = 0;

const buildInitialSpecs = (spec: ProductSpec): Record<string, string[]> => {
  const initial: Record<string, string[]> = {};
  for (const key of spec.spec.meta.specSortKey) {
    const category = spec.spec.categories[key];
    if (!category) {
      continue;
    }
    if (category.view === "indicator") {
      continue;
    }
    const first = category.specs[FIRST_SPEC_INDEX];
    initial[key] = first ? [first.name] : [];
  }
  return initial;
};

export const BuyForm: React.FC<BuyFormProps> = ({ spec, onSubmit }) => {
  const methods = useForm<BuyFormInput, unknown, BuyFormValues>({
    resolver: zodResolver(BuyFormSchema),
    defaultValues: {
      specs: buildInitialSpecs(spec),
      giftEnabled: false,
      wrapping: DEFAULT_WRAPPING,
      message: "",
      count: DEFAULT_COUNT,
    },
  });

  const handleSubmit = methods.handleSubmit(onSubmit);

  return (
    <FormProvider {...methods}>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold">{spec.name}</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <SpecsSection spec={spec} />
          <GiftOptionSection />
          <section className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">数量</h2>
            <QuantityStepperField name="count" label="個数" min={COUNT_MIN} max={COUNT_MAX} required />
          </section>
          <PriceSummarySection spec={spec} />
          <button
            type="submit"
            disabled={methods.formState.isSubmitting}
            className="rounded-lg bg-indigo-600 px-6 py-3 text-center font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {methods.formState.isSubmitting ? "追加中..." : "バッグへ追加"}
          </button>
        </form>
      </div>
    </FormProvider>
  );
};

BuyForm.displayName = "BuyForm";
