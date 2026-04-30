import { Checkbox } from "@base-ui/react/checkbox";
import * as React from "react";
import { useController } from "react-hook-form";
import { FieldLabel } from "#ui/field/FieldLabel";
import { FieldRoot } from "#ui/field/FieldRoot";
import type { FieldRootProps } from "#ui/field/FieldRoot";
import { FieldTextError } from "#ui/field/FieldTextError";

export interface CheckboxFieldProps extends Pick<FieldRootProps, "direction" | "disabled"> {
  name: string;
  label: string;
  /** @default false */
  required?: boolean;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = (props) => {
  const { field, fieldState } = useController({ name: props.name });

  const checkboxRootProps: React.ComponentProps<typeof Checkbox.Root> = {
    checked: field.value ?? false,
    onCheckedChange: field.onChange,
    name: field.name,
    inputRef: field.ref,
    disabled: props.disabled,
    required: props.required,
  };

  return (
    <FieldRoot
      disabled={props.disabled}
      invalid={Boolean(fieldState.error)}
      direction={props.direction}
      error={<FieldTextError message={fieldState.error?.message} />}
    >
      <div className="flex items-start gap-2">
        <Checkbox.Root
          {...checkboxRootProps}
          className="mt-0.5 flex size-4 shrink-0 cursor-pointer items-center justify-center rounded border border-gray-300 bg-white shadow-xs outline-none transition-colors data-[checked]:border-indigo-600 data-[checked]:bg-indigo-600 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[focus-visible]:ring-2 data-[focus-visible]:ring-indigo-500/30 data-[invalid]:border-red-500 data-[checked]:data-[invalid]:bg-red-500 dark:border-gray-600 dark:bg-gray-900 dark:data-[checked]:border-indigo-500 dark:data-[checked]:bg-indigo-500 dark:data-[focus-visible]:ring-indigo-400/30 dark:data-[invalid]:border-red-400 dark:data-[checked]:data-[invalid]:bg-red-400"
        >
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
        </Checkbox.Root>
        <FieldLabel clickable>{props.label}</FieldLabel>
      </div>
    </FieldRoot>
  );
};

CheckboxField.displayName = "CheckboxField";
