import { Checkbox } from "@base-ui/react/checkbox";
import { CheckboxGroup } from "@base-ui/react/checkbox-group";
import { Field } from "@base-ui/react/field";
import * as React from "react";
import { useController, useFormContext } from "react-hook-form";

export interface MultiSelectOption {
  label: string;
  value: string;
  /** @default false */
  disabled?: boolean;
}

export interface MultiSelectFieldProps {
  name: string;
  label: string;
  options: MultiSelectOption[];
  /** @default false */
  disabled?: boolean;
}

export const MultiSelectField: React.FC<MultiSelectFieldProps> = (props) => {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name: props.name, control });

  const checkboxGroupProps: React.ComponentProps<typeof CheckboxGroup> = {
    value: field.value ?? [],
    onValueChange: field.onChange,
    disabled: props.disabled,
  };

  return (
    <Field.Root disabled={props.disabled} invalid={Boolean(fieldState.error)}>
      <Field.Label>{props.label}</Field.Label>
      <CheckboxGroup {...checkboxGroupProps}>
        {props.options.map((option) => {
          const checkboxRootProps: React.ComponentProps<typeof Checkbox.Root> = {
            value: option.value,
            name: option.value,
            disabled: option.disabled,
          };
          return (
            <Checkbox.Root key={option.value} {...checkboxRootProps}>
              <Checkbox.Indicator />
              {option.label}
            </Checkbox.Root>
          );
        })}
      </CheckboxGroup>
      {fieldState.error?.message && <Field.Error>{fieldState.error.message}</Field.Error>}
    </Field.Root>
  );
};

MultiSelectField.displayName = "MultiSelectField";
