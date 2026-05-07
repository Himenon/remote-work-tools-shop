"use client";

import type { SpecCategory } from "../../../_types/product";

export interface SpecCategoryFieldProps {
  categoryKey: string;
  category: SpecCategory;
  selectedValues: string[];
  onChange: (categoryKey: string, values: string[]) => void;
}

const FREE_COST = 0;
const FIRST_SELECTED_VALUE_INDEX = 0;

const CostBadge = ({ cost }: { cost: number }) => {
  if (cost <= FREE_COST) {
    return null;
  }
  return <span className="text-xs text-indigo-600">+¥{cost.toLocaleString("ja-JP")}</span>;
};

const IndicatorView = ({ category }: { category: SpecCategory }) => (
  <fieldset className="flex flex-col gap-2">
    <legend className="text-sm font-semibold text-gray-700 dark:text-gray-300">{category.name}</legend>
    <ul className="flex flex-wrap gap-2">
      {category.specs.map((spec) => (
        <li
          key={spec.name}
          className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
        >
          {spec.name}
        </li>
      ))}
    </ul>
  </fieldset>
);

interface SelectableViewProps {
  categoryKey: string;
  category: SpecCategory;
  selectedValues: string[];
  onChange: (categoryKey: string, values: string[]) => void;
}

const MultiSelectView = ({ categoryKey, category, selectedValues, onChange }: SelectableViewProps) => (
  <fieldset className="flex flex-col gap-2">
    <legend className="text-sm font-semibold text-gray-700 dark:text-gray-300">{category.name}</legend>
    <div className="flex flex-col gap-1">
      {category.specs.map((spec) => {
        const checked = selectedValues.includes(spec.name);
        const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
          type: "checkbox",
          id: `${categoryKey}-${spec.name}`,
          name: categoryKey,
          value: spec.name,
          checked,
          onChange: () => {
            const next = checked ? selectedValues.filter((v) => v !== spec.name) : [...selectedValues, spec.name];
            onChange(categoryKey, next);
          },
          className: "accent-indigo-600",
        };
        return (
          <label
            key={spec.name}
            htmlFor={`${categoryKey}-${spec.name}`}
            className="flex cursor-pointer items-center gap-2 text-sm text-gray-800 dark:text-gray-200"
          >
            <input {...inputProps} />
            <span>{spec.name}</span>
            <CostBadge cost={spec.cost} />
          </label>
        );
      })}
    </div>
  </fieldset>
);

const SingleSelectView = ({ categoryKey, category, selectedValues, onChange }: SelectableViewProps) => {
  const selectProps: React.SelectHTMLAttributes<HTMLSelectElement> = {
    id: categoryKey,
    name: categoryKey,
    value: selectedValues[FIRST_SELECTED_VALUE_INDEX] ?? "",
    onChange: (e) => onChange(categoryKey, [e.target.value]),
    className:
      "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200",
  };
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={categoryKey} className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {category.name}
      </label>
      <select {...selectProps}>
        {category.specs.map((spec) => (
          <option key={spec.name} value={spec.name}>
            {spec.name}
            {spec.cost > FREE_COST ? ` (+¥${spec.cost.toLocaleString("ja-JP")})` : ""}
          </option>
        ))}
      </select>
    </div>
  );
};

const RadioView = ({ categoryKey, category, selectedValues, onChange }: SelectableViewProps) => (
  <fieldset className="flex flex-col gap-2">
    <legend className="text-sm font-semibold text-gray-700 dark:text-gray-300">{category.name}</legend>
    <div className="flex flex-col gap-1">
      {category.specs.map((spec) => {
        const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
          type: "radio",
          id: `${categoryKey}-${spec.name}`,
          name: categoryKey,
          value: spec.name,
          checked: selectedValues[FIRST_SELECTED_VALUE_INDEX] === spec.name,
          onChange: () => onChange(categoryKey, [spec.name]),
          className: "accent-indigo-600",
        };
        return (
          <label
            key={spec.name}
            htmlFor={`${categoryKey}-${spec.name}`}
            className="flex cursor-pointer items-center gap-2 text-sm text-gray-800 dark:text-gray-200"
          >
            <input {...inputProps} />
            <span>{spec.name}</span>
            <CostBadge cost={spec.cost} />
          </label>
        );
      })}
    </div>
  </fieldset>
);

export const SpecCategoryField: React.FC<SpecCategoryFieldProps> = ({ categoryKey, category, selectedValues, onChange }) => {
  if (category.view === "indicator") {
    return <IndicatorView category={category} />;
  }
  if (category.view === "multi-select") {
    return <MultiSelectView categoryKey={categoryKey} category={category} selectedValues={selectedValues} onChange={onChange} />;
  }
  if (category.view === "single-select") {
    return <SingleSelectView categoryKey={categoryKey} category={category} selectedValues={selectedValues} onChange={onChange} />;
  }
  return <RadioView categoryKey={categoryKey} category={category} selectedValues={selectedValues} onChange={onChange} />;
};

SpecCategoryField.displayName = "SpecCategoryField";
