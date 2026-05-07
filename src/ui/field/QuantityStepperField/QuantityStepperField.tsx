import { NumberField } from "@base-ui/react/number-field";
import * as React from "react";
import { useController } from "react-hook-form";

import { FieldLabel } from "#ui/field/FieldLabel";
import { FieldRoot, type FieldLayoutProps } from "#ui/field/FieldRoot";
import { FieldTextError } from "#ui/field/FieldTextError";

export const parseNumberOrNull = (value: unknown): number | null => {
  if (value === null || typeof value === "number") {
    return value;
  }
  throw new Error(`QuantityStepperField: field.value が number | null 形式ではありません。実際の値: ${JSON.stringify(value)}`);
};

export interface QuantityStepperFieldProps {
  name: string;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  /** @default false */
  required?: boolean;
  /** @default false */
  disabled?: boolean;
  layout?: FieldLayoutProps;
}

const stepperButtonClassName =
  "flex size-9 shrink-0 items-center justify-center text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800";

export const QuantityStepperField: React.FC<QuantityStepperFieldProps> = (props) => {
  const { field, fieldState } = useController({ name: props.name });

  const numberFieldRootProps: React.ComponentProps<typeof NumberField.Root> = {
    value: parseNumberOrNull(field.value),
    onValueChange: (value: number | null): void => {
      field.onChange(value);
    },
    name: field.name,
    inputRef: field.ref,
    min: props.min,
    max: props.max,
    step: props.step,
    disabled: props.disabled,
    required: props.required,
  };

  return (
    <FieldRoot {...props.layout} invalid={Boolean(fieldState.error)} error={<FieldTextError message={fieldState.error?.message} />}>
      <FieldLabel>{props.label}</FieldLabel>
      <NumberField.Root {...numberFieldRootProps}>
        <NumberField.Group className="inline-flex items-center overflow-hidden rounded-md border border-gray-300 bg-white shadow-xs transition-colors focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 data-[invalid]:border-red-500 data-[invalid]:focus-within:ring-red-500/20 dark:border-gray-700 dark:bg-gray-900">
          <NumberField.Decrement aria-label="数量を減らす" className={stepperButtonClassName}>
            −
          </NumberField.Decrement>
          <NumberField.Input className="w-16 bg-transparent py-2 text-center text-sm text-gray-900 outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-white" />
          <NumberField.Increment aria-label="数量を増やす" className={stepperButtonClassName}>
            +
          </NumberField.Increment>
        </NumberField.Group>
      </NumberField.Root>
    </FieldRoot>
  );
};

QuantityStepperField.displayName = "QuantityStepperField";
