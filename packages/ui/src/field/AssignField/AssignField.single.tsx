import { Combobox } from "@base-ui/react/combobox";
import * as React from "react";
import { useController as useCtrl } from "react-hook-form";
import { FieldLabel } from "@rwts/ui/field/FieldLabel";
import { FieldRoot, type FieldRootProps } from "@rwts/ui/field/FieldRoot";
import { FieldTextError } from "@rwts/ui/field/FieldTextError";
import {
  type AssignOption,
  type AssignFieldProps,
  AssignAvatar,
  AssignDropdown,
  isAssignItemEqualToValue,
  assignItemToStringLabel,
} from "./AssignField.shared";
import { SingleComboboxInput, type SingleComboboxInputProps } from "./AssignField.single.input";

const LockedAssignChip: React.FC<{ option: AssignOption }> = ({ option }) => (
  <div className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 dark:border-gray-700 dark:bg-gray-800">
    <AssignAvatar option={option} />
    <span className="text-sm text-gray-700 dark:text-gray-300">{option.chipLabel ?? option.label}</span>
  </div>
);

export interface SingleAssignFieldProps {
  fieldProps: AssignFieldProps;
}

export const SingleAssignField: React.FC<SingleAssignFieldProps> = ({ fieldProps }) => {
  const { field, fieldState } = useCtrl({ name: fieldProps.name });
  const rawValue: unknown = field.value;
  const fieldValue: string | null = typeof rawValue === "string" ? rawValue : null;
  const selectedOption = fieldProps.options.find((o): boolean => o.valueId === fieldValue) ?? null;

  // Base UI の Combobox は controlled value を入力欄の表示テキストに自動反映しないため別途管理
  const [inputValue, setInputValue] = React.useState(selectedOption?.label ?? "");

  const handleValueChange = (option: AssignOption | null): void => {
    field.onChange(option?.valueId ?? null);
    setInputValue(option?.label ?? "");
  };

  const fieldRootProps: Omit<FieldRootProps, "children"> = {
    ...fieldProps.layout,
    invalid: Boolean(fieldState.error),
    error: <FieldTextError message={fieldState.error?.message} />,
  };

  if (selectedOption?.locked) {
    return (
      <FieldRoot {...fieldRootProps}>
        <FieldLabel>{fieldProps.label}</FieldLabel>
        <LockedAssignChip option={selectedOption} />
      </FieldRoot>
    );
  }

  const singleComboboxInputProps: SingleComboboxInputProps = {
    option: selectedOption,
    placeholder: fieldProps.placeholder,
    disabled: fieldProps.disabled,
    field,
    hasError: Boolean(fieldState.error),
  };

  return (
    <FieldRoot {...fieldRootProps}>
      <FieldLabel>{fieldProps.label}</FieldLabel>
      <Combobox.Root
        items={fieldProps.options}
        value={selectedOption}
        onValueChange={handleValueChange}
        inputValue={inputValue}
        onInputValueChange={setInputValue}
        name={field.name}
        disabled={fieldProps.disabled}
        isItemEqualToValue={isAssignItemEqualToValue}
        itemToStringLabel={assignItemToStringLabel}
      >
        <SingleComboboxInput {...singleComboboxInputProps} />
        <AssignDropdown />
      </Combobox.Root>
    </FieldRoot>
  );
};
