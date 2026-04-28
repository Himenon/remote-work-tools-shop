import { Field } from "@base-ui/react/field";
import { Switch } from "@base-ui/react/switch";
import * as React from "react";
import { useController, useFormContext } from "react-hook-form";
import { FieldTextError } from "../FieldTextError/FieldTextError";

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
    <Field.Root disabled={props.disabled} invalid={Boolean(fieldState.error)} className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-4">
        <Field.Label className="text-sm font-medium text-gray-700 dark:text-gray-300 data-[disabled]:opacity-50">{props.label}</Field.Label>
        <Switch.Root
          {...switchRootProps}
          className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-gray-200 outline-none transition-colors data-[checked]:bg-indigo-600 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[focus-visible]:ring-2 data-[focus-visible]:ring-indigo-500 data-[focus-visible]:ring-offset-2 data-[invalid]:bg-red-200 data-[checked]:data-[invalid]:bg-red-500 dark:bg-gray-700 dark:data-[checked]:bg-indigo-500 dark:data-[focus-visible]:ring-indigo-400 dark:data-[focus-visible]:ring-offset-gray-900 dark:data-[invalid]:bg-red-900 dark:data-[checked]:data-[invalid]:bg-red-400"
        >
          <Switch.Thumb className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white shadow-lg transition-transform group-data-[checked]:translate-x-5" />
        </Switch.Root>
      </div>
      <FieldTextError message={fieldState.error?.message} />
    </Field.Root>
  );
};

SwitchField.displayName = "SwitchField";
