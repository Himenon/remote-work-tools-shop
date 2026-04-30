import { Input } from "@base-ui/react/input";
import * as React from "react";
import { useController } from "react-hook-form";
import { FieldLabel } from "#ui/field/FieldLabel";
import { FieldRoot, type FieldLayoutProps } from "#ui/field/FieldRoot";
import { FieldTextError } from "#ui/field/FieldTextError";

export interface OnelineTextFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  /** @default false */
  required?: boolean;
  /** @default false */
  disabled?: boolean;
  layout?: FieldLayoutProps;
}

export const OnelineTextField: React.FC<OnelineTextFieldProps> = (props) => {
  const { field, fieldState } = useController({ name: props.name });

  const inputProps: React.ComponentProps<typeof Input> = {
    ...field,
    placeholder: props.placeholder,
    required: props.required,
    disabled: props.disabled,
  };

  return (
    <FieldRoot {...props.layout} invalid={Boolean(fieldState.error)} error={<FieldTextError message={fieldState.error?.message} />}>
      <FieldLabel>{props.label}</FieldLabel>
      <Input
        {...inputProps}
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs outline-none transition-colors placeholder:text-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20 dark:aria-[invalid=true]:border-red-400"
      />
    </FieldRoot>
  );
};

OnelineTextField.displayName = "OnelineTextField";
