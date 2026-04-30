import { Switch } from "@base-ui/react/switch";
import * as React from "react";
import { useController } from "react-hook-form";
import { FieldLabel } from "#ui/field/FieldLabel";
import { FieldRoot, type FieldLayoutProps } from "#ui/field/FieldRoot";
import { FieldTextError } from "#ui/field/FieldTextError";

export interface SwitchFieldProps {
  name: string;
  label: string;
  /** @default false */
  required?: boolean;
  /** @default false */
  disabled?: boolean;
  layout?: FieldLayoutProps;
}

export const SwitchField: React.FC<SwitchFieldProps> = (props) => {
  const { field, fieldState } = useController({ name: props.name });

  // SwitchField はラベルとスイッチを横並びにするため direction のデフォルトを "horizontal" にする
  const layout: FieldLayoutProps = { direction: "horizontal", ...props.layout };

  const switchRootProps: React.ComponentProps<typeof Switch.Root> = {
    checked: field.value ?? false,
    onCheckedChange: field.onChange,
    name: field.name,
    inputRef: field.ref,
    disabled: props.disabled,
    required: props.required,
  };

  return (
    <FieldRoot {...layout} invalid={Boolean(fieldState.error)} error={<FieldTextError message={fieldState.error?.message} />}>
      <FieldLabel>{props.label}</FieldLabel>
      <Switch.Root
        {...switchRootProps}
        className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-gray-200 outline-none transition-colors data-[checked]:bg-indigo-600 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[focus-visible]:ring-2 data-[focus-visible]:ring-indigo-500 data-[focus-visible]:ring-offset-2 data-[invalid]:bg-red-200 data-[checked]:data-[invalid]:bg-red-500 dark:bg-gray-700 dark:data-[checked]:bg-indigo-500 dark:data-[focus-visible]:ring-indigo-400 dark:data-[focus-visible]:ring-offset-gray-900 dark:data-[invalid]:bg-red-900 dark:data-[checked]:data-[invalid]:bg-red-400"
      >
        <Switch.Thumb className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white shadow-lg transition-transform group-data-[checked]:translate-x-5" />
      </Switch.Root>
    </FieldRoot>
  );
};

SwitchField.displayName = "SwitchField";
