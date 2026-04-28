import { Checkbox } from "@base-ui/react/checkbox";
import { Field } from "@base-ui/react/field";
import * as React from "react";
import { useController, useFormContext } from "react-hook-form";

export interface CheckboxFieldProps {
  name: string;
  label: string;
  /** @default false */
  disabled?: boolean;
  /** @default false */
  required?: boolean;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = (props) => {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name: props.name, control });

  const checkboxRootProps: React.ComponentProps<typeof Checkbox.Root> = {
    checked: field.value ?? false,
    onCheckedChange: field.onChange,
    name: field.name,
    inputRef: field.ref,
    disabled: props.disabled,
    required: props.required,
  };

  return (
    <Field.Root disabled={props.disabled} invalid={Boolean(fieldState.error)}>
      <Checkbox.Root {...checkboxRootProps}>
        <Checkbox.Indicator />
      </Checkbox.Root>
      <Field.Label>{props.label}</Field.Label>
      {fieldState.error?.message && <Field.Error match={true}>{fieldState.error.message}</Field.Error>}
    </Field.Root>
  );
};

CheckboxField.displayName = "CheckboxField";
