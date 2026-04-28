import { Field } from "@base-ui/react/field";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import * as React from "react";
import { useController, useFormContext } from "react-hook-form";

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
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name: props.name, control });

  const radioGroupProps: React.ComponentProps<typeof RadioGroup> = {
    value: field.value,
    onValueChange: field.onChange,
    name: field.name,
    disabled: props.disabled,
    required: props.required,
  };

  return (
    <Field.Root disabled={props.disabled} invalid={Boolean(fieldState.error)}>
      <Field.Label>{props.label}</Field.Label>
      <RadioGroup {...radioGroupProps}>
        {props.options.map((option) => {
          const radioRootProps: React.ComponentProps<typeof Radio.Root> = {
            value: option.value,
            disabled: option.disabled,
          };
          return (
            <Radio.Root key={option.value} {...radioRootProps}>
              <Radio.Indicator />
              {option.label}
            </Radio.Root>
          );
        })}
      </RadioGroup>
      {fieldState.error?.message && <Field.Error match={true}>{fieldState.error.message}</Field.Error>}
    </Field.Root>
  );
};

RadioGroupField.displayName = "RadioGroupField";
