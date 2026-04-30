import { Checkbox } from "@base-ui/react/checkbox";
import { CheckboxGroup } from "@base-ui/react/checkbox-group";
import * as React from "react";
import { useController } from "react-hook-form";
import { FieldLabel } from "#ui/field/FieldLabel";
import { FieldRoot } from "#ui/field/FieldRoot";
import type { FieldRootProps } from "#ui/field/FieldRoot";
import { FieldTextError } from "#ui/field/FieldTextError";

export interface MultiSelectOption {
  label: string;
  value: string;
  /** @default false */
  disabled?: boolean;
}

export interface MultiSelectFieldProps extends Pick<FieldRootProps, "direction" | "disabled"> {
  name: string;
  label: string;
  options: MultiSelectOption[];
}

export const MultiSelectField: React.FC<MultiSelectFieldProps> = (props) => {
  const { field, fieldState } = useController({ name: props.name });

  const checkboxGroupProps: React.ComponentProps<typeof CheckboxGroup> = {
    value: field.value ?? [],
    onValueChange: field.onChange,
    disabled: props.disabled,
  };

  return (
    <FieldRoot
      disabled={props.disabled}
      invalid={Boolean(fieldState.error)}
      direction={props.direction}
      error={<FieldTextError message={fieldState.error?.message} />}
    >
      <FieldLabel>{props.label}</FieldLabel>
      <CheckboxGroup {...checkboxGroupProps} className="flex flex-col gap-2">
        {props.options.map((option) => {
          const checkboxRootProps: React.ComponentProps<typeof Checkbox.Root> = {
            value: option.value,
            name: option.value,
            disabled: option.disabled,
          };
          return (
            <Checkbox.Root
              key={option.value}
              {...checkboxRootProps}
              className="group flex cursor-pointer items-center gap-2 outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
            >
              <span className="flex size-4 shrink-0 items-center justify-center rounded border border-gray-300 bg-white shadow-xs transition-colors group-data-[checked]:border-indigo-600 group-data-[checked]:bg-indigo-600 group-data-[focus-visible]:ring-2 group-data-[focus-visible]:ring-indigo-500/30 group-data-[invalid]:border-red-500 group-data-[checked]:group-data-[invalid]:bg-red-500 dark:border-gray-600 dark:bg-gray-900 dark:group-data-[checked]:border-indigo-500 dark:group-data-[checked]:bg-indigo-500 dark:group-data-[focus-visible]:ring-indigo-400/30 dark:group-data-[invalid]:border-red-400 dark:group-data-[checked]:group-data-[invalid]:bg-red-400">
                <Checkbox.Indicator className="text-white">
                  <svg
                    viewBox="0 0 12 12"
                    className="size-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M2.5 6l2.5 2.5 4.5-4.5" />
                  </svg>
                </Checkbox.Indicator>
              </span>
              <span className="text-sm text-gray-900 dark:text-white">{option.label}</span>
            </Checkbox.Root>
          );
        })}
      </CheckboxGroup>
    </FieldRoot>
  );
};

MultiSelectField.displayName = "MultiSelectField";
