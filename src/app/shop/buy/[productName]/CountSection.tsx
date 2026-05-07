"use client";

export interface CountSectionProps {
  count: number;
  min: number;
  max: number;
  onChange: (count: number) => void;
}

export const CountSection: React.FC<CountSectionProps> = ({ count, min, max, onChange }) => {
  const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    id: "count",
    type: "number",
    min,
    max,
    value: count,
    onChange: (e) => onChange(Number(e.target.value)),
    className:
      "w-20 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200",
  };

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">数量</h2>
      <div className="flex items-center gap-3">
        <label htmlFor="count" className="text-sm text-gray-700 dark:text-gray-300">
          個数
        </label>
        <input {...inputProps} />
      </div>
    </section>
  );
};

CountSection.displayName = "CountSection";
