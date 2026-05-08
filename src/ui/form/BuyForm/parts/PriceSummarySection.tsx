"use client";

import { useWatch } from "react-hook-form";
import type { BuyFormInput } from "#schema/form/BuyFormSchema";
import type { SpecCategory } from "./SpecCategoryField";

interface PriceSummarySectionProps {
  price: number;
  categories: Record<string, SpecCategory>;
}

const PERCENT_BASE = 100;
const TAX_RATE_PERCENT = 10;
const TAX_MULTIPLIER = (PERCENT_BASE + TAX_RATE_PERCENT) / PERCENT_BASE;
const FALLBACK_COUNT = 0;

const calcExtraCost = (selectedSpecs: Record<string, string[]>, categories: Record<string, SpecCategory>): number => {
  let extra = 0;
  for (const [key, values] of Object.entries(selectedSpecs)) {
    const category = categories[key];
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
  return extra;
};

export const PriceSummarySection: React.FC<PriceSummarySectionProps> = ({ price, categories }) => {
  const specs = useWatch<BuyFormInput, "specs">({ name: "specs" });
  const count = useWatch<BuyFormInput, "count">({ name: "count" });
  const unitPrice = Math.floor((price + calcExtraCost(specs, categories)) * TAX_MULTIPLIER);
  const itemCount = count ?? FALLBACK_COUNT;

  return (
    <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 px-6 py-4 dark:border-indigo-900 dark:bg-indigo-950">
      <span className="text-sm text-gray-700 dark:text-gray-300">合計金額（税込）</span>
      <span className="text-2xl font-bold text-indigo-600">¥{(unitPrice * itemCount).toLocaleString("ja-JP")}</span>
    </div>
  );
};

PriceSummarySection.displayName = "PriceSummarySection";
