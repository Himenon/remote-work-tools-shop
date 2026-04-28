import { Field } from "@base-ui/react/field";
import { Input } from "@base-ui/react/input";
import * as React from "react";
import { useController, useFormContext } from "react-hook-form";

export interface TextFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  /** @default false */
  disabled?: boolean;
  /** @default false */
  required?: boolean;
}

export const TextField: React.FC<TextFieldProps> = (props) => {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name: props.name, control });

  const inputProps: React.ComponentProps<typeof Input> = {
    ...field,
    placeholder: props.placeholder,
    required: props.required,
  };

  return (
    <Field.Root disabled={props.disabled} invalid={Boolean(fieldState.error)}>
      <Field.Label>{props.label}</Field.Label>
      <Input {...inputProps} />
      {fieldState.error?.message && <Field.Error match={true}>{fieldState.error.message}</Field.Error>}
    </Field.Root>
  );
};

TextField.displayName = "TextField";
