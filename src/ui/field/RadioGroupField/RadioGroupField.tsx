import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import * as React from "react";
import { useController } from "react-hook-form";
import { FieldLabel } from "#ui/field/FieldLabel";
import { FieldRoot, type FieldLayoutProps } from "#ui/field/FieldRoot";
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
  required?: boolean;
  /** @default false */
  disabled?: boolean;
  /** 選択肢の並び方向。"vertical": 縦並び（デフォルト）、"horizontal": 横並び @default "vertical" */
  orientation?: "vertical" | "horizontal";
  layout?: FieldLayoutProps;
}

const optionsOrientationClassNames: Record<"vertical" | "horizontal", string> = {
  vertical: "flex flex-col gap-2",
  horizontal: "flex flex-row flex-wrap gap-4",
};

export const RadioGroupField: React.FC<RadioGroupFieldProps> = (props) => {
  const { field, fieldState } = useController({ name: props.name });

  const radioGroupProps: RadioGroup.Props = {
    value: field.value,
    onValueChange: field.onChange,
    name: field.name,
    disabled: props.disabled,
    required: props.required,
  };

  const optionsClassName = optionsOrientationClassNames[props.orientation ?? "vertical"];

  return (
    <FieldRoot {...props.layout} invalid={Boolean(fieldState.error)} error={<FieldTextError message={fieldState.error?.message} />}>
      <FieldLabel>{props.label}</FieldLabel>
      <RadioGroup {...radioGroupProps} className={optionsClassName}>
        {props.options.map((option) => {
          const radioRootProps: Radio.Root.Props = {
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
    </FieldRoot>
  );
};

RadioGroupField.displayName = "RadioGroupField";
