"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { QuantityStepperField } from "@rwts/ui/field/QuantityStepperField";
import {
  BuyFormSchema,
  COUNT_MIN,
  COUNT_MAX,
  DEFAULT_COUNT,
  DEFAULT_WRAPPING,
  type BuyFormInput,
  type BuyFormValues,
} from "@rwts/contract/form/BuyFormSchema";
import type { SpecCategory } from "./parts/SpecCategoryField";
import { GiftOptionSection } from "./parts/GiftOptionSection";
import { PriceSummarySection } from "./parts/PriceSummarySection";
import { SpecsSection } from "./parts/SpecsSection";

export type { BuyFormValues };

export interface BuyFormProduct {
  name: string;
  price: number;
  specSortKeys: string[];
  categories: Record<string, SpecCategory>;
}

export interface BuyFormProps {
  product: BuyFormProduct;
  /** 指定時は編集フォーム、未指定時は商品スペックの先頭値を初期選択した新規フォームとして動作する */
  defaultValues?: BuyFormInput;
  onSubmit: (values: BuyFormValues) => Promise<void>;
}

export const BuyForm: React.FC<BuyFormProps> = ({ product, defaultValues, onSubmit }) => {
  const methods = useForm<BuyFormInput, unknown, BuyFormValues>({
    resolver: zodResolver(BuyFormSchema),
    defaultValues: defaultValues ?? {
      specs: {},
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
        <h1 className="mb-6 text-2xl font-bold">{product.name}</h1>
        <form
          onSubmit={(e): void => {
            void handleSubmit(e);
          }}
          noValidate
          className="flex flex-col gap-6"
        >
          <SpecsSection specSortKeys={product.specSortKeys} categories={product.categories} />
          <GiftOptionSection />
          <section className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">数量</h2>
            <QuantityStepperField name="count" label="個数" min={COUNT_MIN} max={COUNT_MAX} required />
          </section>
          <PriceSummarySection price={product.price} categories={product.categories} />
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
