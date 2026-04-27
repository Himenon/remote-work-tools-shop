import { Field } from "@base-ui/react/field";
import { Switch } from "@base-ui/react/switch";
import * as React from "react";
import { useController, useFormContext } from "react-hook-form";

export interface SwitchFieldProps {
  name: string;
  label: string;
  /** @default false */
  disabled?: boolean;
  /** @default false */
  required?: boolean;
}

export const SwitchField: React.FC<SwitchFieldProps> = (props) => {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name: props.name, control });

  const switchRootProps: React.ComponentProps<typeof Switch.Root> = {
    checked: field.value ?? false,
    onCheckedChange: field.onChange,
    name: field.name,
    inputRef: field.ref,
    disabled: props.disabled,
    required: props.required,
  };

  return (
    <Field.Root disabled={props.disabled} invalid={Boolean(fieldState.error)}>
      <Field.Label>{props.label}</Field.Label>
      <Switch.Root {...switchRootProps}>
        <Switch.Thumb />
      </Switch.Root>
      {fieldState.error?.message && <Field.Error>{fieldState.error.message}</Field.Error>}
    </Field.Root>
  );
};

SwitchField.displayName = "SwitchField";
