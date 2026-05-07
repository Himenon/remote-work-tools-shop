"use client";

export interface PriceSummaryProps {
  totalPrice: number;
  count: number;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({ totalPrice, count }) => (
  <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 px-6 py-4 dark:border-indigo-900 dark:bg-indigo-950">
    <span className="text-sm text-gray-700 dark:text-gray-300">合計金額（税込）</span>
    <span className="text-2xl font-bold text-indigo-600">¥{(totalPrice * count).toLocaleString("ja-JP")}</span>
  </div>
);

PriceSummary.displayName = "PriceSummary";
