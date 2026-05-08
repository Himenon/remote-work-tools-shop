"use client";

import { useFormContext } from "react-hook-form";
import type { BuyFormInput } from "#schema/form/BuyFormSchema";
import { SpecCategoryField, type SpecCategoryFieldProps, type SpecCategory } from "./SpecCategoryField";

interface SpecsSectionProps {
  specSortKeys: string[];
  categories: Record<string, SpecCategory>;
}

export const SpecsSection: React.FC<SpecsSectionProps> = ({ specSortKeys, categories }) => {
  const { watch, setValue } = useFormContext<BuyFormInput>();
  const selectedSpecs = watch("specs");

  const handleSpecChange = (categoryKey: string, values: string[]): void => {
    setValue("specs", { ...selectedSpecs, [categoryKey]: values });
  };

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">スペックを選択</h2>
      {specSortKeys.map((key) => {
        const category = categories[key];
        if (!category) {
          return null;
        }
        const fieldProps: SpecCategoryFieldProps = {
          categoryKey: key,
          category,
          selectedValues: selectedSpecs[key] ?? [],
          onChange: handleSpecChange,
        };
        return <SpecCategoryField key={key} {...fieldProps} />;
      })}
    </section>
  );
};

SpecsSection.displayName = "SpecsSection";
