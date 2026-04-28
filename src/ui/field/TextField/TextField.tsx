import { Field } from "@base-ui/react/field";
import { Input } from "@base-ui/react/input";
import * as React from "react";
import { useController, useFormContext } from "react-hook-form";
import { FieldTextError } from "../FieldTextError/FieldTextError";

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
    <Field.Root disabled={props.disabled} invalid={Boolean(fieldState.error)} className="flex flex-col gap-1.5">
      <Field.Label className="text-sm font-medium text-gray-700 dark:text-gray-300 data-[disabled]:opacity-50">{props.label}</Field.Label>
      <Input
        {...inputProps}
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs outline-none transition-colors placeholder:text-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20 dark:aria-[invalid=true]:border-red-400"
      />
      <FieldTextError message={fieldState.error?.message} />
    </Field.Root>
  );
};

TextField.displayName = "TextField";
