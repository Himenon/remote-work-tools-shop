import { Field } from "@base-ui/react/field";
import { Select } from "@base-ui/react/select";
import * as React from "react";
import { useController } from "react-hook-form";
import { FieldLabel } from "#ui/field/FieldLabel";
import { FieldTextError } from "#ui/field/FieldTextError";

export interface SelectOption {
  label: string;
  value: string;
  /** @default false */
  disabled?: boolean;
}

export interface SingleSelectFieldProps {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  /** @default false */
  disabled?: boolean;
  /** @default false */
  required?: boolean;
}

const SelectOptionItem: React.FC<SelectOption> = (option) => (
  <Select.Item
    value={option.value}
    disabled={option.disabled}
    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-gray-900 outline-none transition-colors data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[highlighted]:bg-indigo-50 data-[highlighted]:text-indigo-900 data-[selected]:font-medium dark:text-white dark:data-[highlighted]:bg-indigo-900/40 dark:data-[highlighted]:text-indigo-100"
  >
    <Select.ItemText>{option.label}</Select.ItemText>
    <Select.ItemIndicator className="ml-auto text-indigo-600 dark:text-indigo-400">
      <svg
        viewBox="0 0 16 16"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M3.5 8l3 3 5.5-5.5" />
      </svg>
    </Select.ItemIndicator>
  </Select.Item>
);

export const SingleSelectField: React.FC<SingleSelectFieldProps> = (props) => {
  const { field, fieldState } = useController({ name: props.name });

  const selectRootProps: React.ComponentProps<typeof Select.Root> = {
    value: field.value ?? null,
    onValueChange: field.onChange,
    name: field.name,
    disabled: props.disabled,
    required: props.required,
  };

  return (
    <Field.Root disabled={props.disabled} invalid={Boolean(fieldState.error)} className="flex flex-col gap-1.5">
      <FieldLabel>{props.label}</FieldLabel>
      <Select.Root {...selectRootProps}>
        <Select.Trigger className="group flex h-9 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 text-sm shadow-xs outline-none transition-colors data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[focus-visible]:border-indigo-500 data-[focus-visible]:ring-2 data-[focus-visible]:ring-indigo-500/20 data-[invalid]:border-red-500 data-[popup-open]:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:data-[focus-visible]:border-indigo-400 dark:data-[focus-visible]:ring-indigo-400/20 dark:data-[invalid]:border-red-400 dark:data-[popup-open]:border-indigo-400">
          <Select.Value
            placeholder={props.placeholder}
            className="text-gray-600 dark:text-gray-400 data-[value]:text-gray-900 dark:data-[value]:text-white"
          />
          <svg
            viewBox="0 0 16 16"
            className="size-4 shrink-0 text-gray-400 transition-transform group-data-[popup-open]:rotate-180 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M4 6l4 4 4-4" />
          </svg>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner className="z-50">
            <Select.Popup className="min-w-[var(--anchor-width)] overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg outline-none dark:border-gray-700 dark:bg-gray-800">
              <Select.List className="p-1">
                {props.options.map(
                  (option): React.ReactElement => (
                    <SelectOptionItem key={option.value} {...option} />
                  ),
                )}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
      <FieldTextError message={fieldState.error?.message} />
    </Field.Root>
  );
};

SingleSelectField.displayName = "SingleSelectField";
