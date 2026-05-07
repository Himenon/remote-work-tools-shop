import * as React from "react";

export interface StepItemProps {
  label: string;
  /** ステップが省略可能であることを示すサブラベル */
  subLabel?: string;
  status: "active" | "completed" | "inactive";
  stepNumber: number;
}

const ICON_CLASS_BY_STATUS: Record<StepItemProps["status"], string> = {
  completed: "flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white",
  active: "flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-indigo-600 bg-white text-indigo-600",
  inactive: "flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-gray-400",
};

const LABEL_CLASS_BY_STATUS: Record<StepItemProps["status"], string> = {
  completed: "text-sm font-medium text-gray-900 dark:text-gray-100",
  active: "text-sm font-semibold text-indigo-600 dark:text-indigo-400",
  inactive: "text-sm font-medium text-gray-500 dark:text-gray-400",
};

const CheckIcon = () => (
  <svg
    viewBox="0 0 12 12"
    className="size-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M2 6l2.5 2.5 5.5-5" />
  </svg>
);

export const StepItem: React.FC<StepItemProps> = ({ label, subLabel, status, stepNumber }) => {
  const iconClassName = ICON_CLASS_BY_STATUS[status];
  const labelClassName = LABEL_CLASS_BY_STATUS[status];

  return (
    <div className="flex items-center gap-3" aria-current={status === "active" ? "step" : undefined}>
      <div className={iconClassName}>{status === "completed" ? <CheckIcon /> : <span className="text-sm font-medium">{stepNumber}</span>}</div>
      <div className="flex flex-col">
        <span className={labelClassName}>{label}</span>
        {subLabel && <span className="text-xs text-gray-500 dark:text-gray-400">{subLabel}</span>}
      </div>
    </div>
  );
};

StepItem.displayName = "StepItem";
