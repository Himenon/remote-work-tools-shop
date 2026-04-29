import { Field } from "@base-ui/react/field";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import * as React from "react";
import { useController } from "react-hook-form";
import { FieldLabel } from "#ui/field/FieldLabel";
import { FieldTextError } from "#ui/field/FieldTextError";

export interface RadioOption {
  label: string;
  value: string;
  /** @default false */
  disabled?: boolean;
}

export interface RadioGroupFieldProps {
  name: string;
  label: string;
  options: RadioOption[];
  /** @default false */
  disabled?: boolean;
  /** @default false */
  required?: boolean;
}

export const RadioGroupField: React.FC<RadioGroupFieldProps> = (props) => {
  const { field, fieldState } = useController({ name: props.name });

  const radioGroupProps: React.ComponentProps<typeof RadioGroup> = {
    value: field.value,
    onValueChange: field.onChange,
    name: field.name,
    disabled: props.disabled,
    required: props.required,
  };

  return (
    <Field.Root disabled={props.disabled} invalid={Boolean(fieldState.error)} className="flex flex-col gap-1.5">
      <FieldLabel>{props.label}</FieldLabel>
      <RadioGroup {...radioGroupProps} className="flex flex-col gap-2">
        {props.options.map((option) => {
          const radioRootProps: React.ComponentProps<typeof Radio.Root> = {
            value: option.value,
            disabled: option.disabled,
          };
          return (
            <Radio.Root
              key={option.value}
              {...radioRootProps}
              className="group flex cursor-pointer items-center gap-2 outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
            >
              <span className="flex size-4 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white shadow-xs transition-colors group-data-[checked]:border-indigo-600 group-data-[focus-visible]:ring-2 group-data-[focus-visible]:ring-indigo-500/30 group-data-[invalid]:border-red-500 dark:border-gray-600 dark:bg-gray-900 dark:group-data-[checked]:border-indigo-500 dark:group-data-[focus-visible]:ring-indigo-400/30 dark:group-data-[invalid]:border-red-400">
                <Radio.Indicator className="size-2 rounded-full bg-indigo-600 group-data-[invalid]:bg-red-500 dark:bg-indigo-500 dark:group-data-[invalid]:bg-red-400" />
              </span>
              <span className="text-sm text-gray-900 dark:text-white">{option.label}</span>
            </Radio.Root>
          );
        })}
      </RadioGroup>
      <FieldTextError message={fieldState.error?.message} />
    </Field.Root>
  );
};

RadioGroupField.displayName = "RadioGroupField";
