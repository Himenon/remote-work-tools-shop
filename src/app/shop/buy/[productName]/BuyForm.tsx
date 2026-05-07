"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductSpec } from "../../../_types/product";
import { GiftOptionField } from "./GiftOptionField";
import { SpecCategoryField, type SpecCategoryFieldProps } from "./SpecCategoryField";
import { CountSection } from "./CountSection";
import { PriceSummary } from "./PriceSummary";

export interface BuyFormProps {
  spec: ProductSpec;
}

const TAX_RATE = 1.1;
const DEFAULT_COUNT = 1;
const MIN_COUNT = 1;
const MAX_COUNT = 99;
const FIRST_SPEC_INDEX = 0;
const EMPTY_MESSAGE_LENGTH = 0;

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

const calcTotalCost = (basePrice: number, selectedSpecs: Record<string, string[]>, spec: ProductSpec): number => {
  let extra = 0;
  for (const [key, values] of Object.entries(selectedSpecs)) {
    const category = spec.spec.categories[key];
    if (!category) {
      continue;
    }
    for (const value of values) {
      const found = category.specs.find((s) => s.name === value);
      if (found) {
        extra += found.cost;
      }
    }
  }
  return Math.floor((basePrice + extra) * TAX_RATE);
};

const buildFlatSpecs = (
  selectedSpecs: Record<string, string[]>,
  giftEnabled: boolean,
  wrapping: string,
  message: string,
): Record<string, string> => {
  const flatSpecs: Record<string, string> = {};
  for (const [key, values] of Object.entries(selectedSpecs)) {
    flatSpecs[key] = values.join(", ");
  }
  if (giftEnabled) {
    flatSpecs["gift_wrapping"] = wrapping;
    if (message.length > EMPTY_MESSAGE_LENGTH) {
      flatSpecs["gift_message"] = message;
    }
  }
  return flatSpecs;
};

interface SpecSectionProps {
  spec: ProductSpec;
  selectedSpecs: Record<string, string[]>;
  onSpecChange: (categoryKey: string, values: string[]) => void;
}

const SpecSection: React.FC<SpecSectionProps> = ({ spec, selectedSpecs, onSpecChange }) => (
  <section className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">スペックを選択</h2>
    {spec.spec.meta.specSortKey.map((key) => {
      const category = spec.spec.categories[key];
      if (!category) {
        return null;
      }
      const props: SpecCategoryFieldProps = {
        categoryKey: key,
        category,
        selectedValues: selectedSpecs[key] ?? [],
        onChange: onSpecChange,
      };
      return <SpecCategoryField key={key} {...props} />;
    })}
  </section>
);

export const BuyForm: React.FC<BuyFormProps> = ({ spec }) => {
  const router = useRouter();
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string[]>>(() => buildInitialSpecs(spec));
  const [giftEnabled, setGiftEnabled] = useState(false);
  const [wrapping, setWrapping] = useState("通常包装");
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(DEFAULT_COUNT);
  const [submitting, setSubmitting] = useState(false);

  const handleSpecChange = (categoryKey: string, values: string[]): void => {
    setSelectedSpecs((prev) => ({ ...prev, [categoryKey]: values }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSubmitting(true);
    const flatSpecs = buildFlatSpecs(selectedSpecs, giftEnabled, wrapping, message);
    await fetch("/api/add/bag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product: { productId: spec.productId, specs: flatSpecs }, count }),
    });
    setSubmitting(false);
    router.push("/shop/bag");
  };

  const totalPrice = calcTotalCost(spec.price, selectedSpecs, spec);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">{spec.name}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <SpecSection spec={spec} selectedSpecs={selectedSpecs} onSpecChange={handleSpecChange} />
        <GiftOptionField
          enabled={giftEnabled}
          wrapping={wrapping}
          message={message}
          onEnabledChange={setGiftEnabled}
          onWrappingChange={setWrapping}
          onMessageChange={setMessage}
        />
        <CountSection count={count} min={MIN_COUNT} max={MAX_COUNT} onChange={setCount} />
        <PriceSummary totalPrice={totalPrice} count={count} />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-indigo-600 px-6 py-3 text-center font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "追加中..." : "バッグへ追加"}
        </button>
      </form>
    </div>
  );
};

BuyForm.displayName = "BuyForm";
