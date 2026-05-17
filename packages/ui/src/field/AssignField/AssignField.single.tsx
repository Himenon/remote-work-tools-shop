import { Combobox } from "@base-ui/react/combobox";
import * as React from "react";
import { useController as useCtrl } from "react-hook-form";
import { FieldLabel } from "@rwts/ui/field/FieldLabel";
import { FieldRoot } from "@rwts/ui/field/FieldRoot";
import { FieldTextError } from "@rwts/ui/field/FieldTextError";
import {
  type AssignOption,
  type AssignFieldProps,
  AssignAvatar,
  AssignDropdown,
  ChevronIcon,
  CloseIcon,
  WRAPPER_CLASS,
  isAssignItemEqualToValue,
  assignItemToStringLabel,
} from "./AssignField.shared";

// ─── ロック済みチップ ─────────────────────────────────────────────────────────

const LockedAssignChip: React.FC<{ option: AssignOption }> = ({ option }) => (
  <div className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 dark:border-gray-700 dark:bg-gray-800">
    <AssignAvatar option={option} />
    <span className="text-sm text-gray-700 dark:text-gray-300">{option.chipLabel ?? option.label}</span>
  </div>
);

// ─── クリアボタン・トリガーボタン ─────────────────────────────────────────────

const SingleComboboxActions: React.FC = () => (
  <div className="flex shrink-0 items-center gap-0.5 pr-2">
    <Combobox.Clear
      aria-label="クリア"
      className="flex size-5 cursor-pointer items-center justify-center rounded text-gray-400 outline-none hover:text-gray-600 data-[disabled]:hidden dark:text-gray-500 dark:hover:text-gray-300"
    >
      <CloseIcon />
    </Combobox.Clear>
    <Combobox.Trigger
      aria-label="開く"
      data-testid="assign-single-trigger"
      className="flex size-5 cursor-pointer items-center justify-center text-gray-400 outline-none data-[disabled]:cursor-not-allowed dark:text-gray-500"
    >
      <ChevronIcon />
    </Combobox.Trigger>
  </div>
);

// ─── 入力ラッパー ─────────────────────────────────────────────────────────────

interface SingleComboboxInputProps {
  option: AssignOption | null;
  fieldProps: AssignFieldProps;
  field: ReturnType<typeof useCtrl>["field"];
  hasError: boolean;
}

const SingleComboboxInput: React.FC<SingleComboboxInputProps> = ({ option, fieldProps, field, hasError }) => (
  <div
    data-invalid={hasError ? "" : undefined}
    data-disabled={fieldProps.disabled ? "" : undefined}
    className={`relative flex h-9 items-center ${WRAPPER_CLASS}`}
  >
    {option && (
      <span className="pl-2.5">
        <AssignAvatar option={option} />
      </span>
    )}
    <Combobox.Input
      placeholder={fieldProps.placeholder}
      onBlur={field.onBlur}
      ref={field.ref}
      className="h-full w-full bg-transparent px-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none data-[disabled]:cursor-not-allowed dark:text-white dark:placeholder:text-gray-500"
    />
    <SingleComboboxActions />
  </div>
);

// ─── 単一選択フィールド ───────────────────────────────────────────────────────

export interface SingleAssignFieldProps {
  fieldProps: AssignFieldProps;
}

export const SingleAssignField: React.FC<SingleAssignFieldProps> = ({ fieldProps }) => {
  const { field, fieldState } = useCtrl({ name: fieldProps.name });
  const selectedOption = fieldProps.options.find((o): boolean => o.valueId === (field.value as string | null)) ?? null;

  // Base UI の Combobox は controlled value を入力欄の表示テキストに自動反映しないため別途管理
  const [inputValue, setInputValue] = React.useState(selectedOption?.label ?? "");

  const handleValueChange = (option: AssignOption | null): void => {
    field.onChange(option?.valueId ?? null);
    setInputValue(option?.label ?? "");
  };

  const fieldRootProps = {
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
        <SingleComboboxInput option={selectedOption} fieldProps={fieldProps} field={field} hasError={Boolean(fieldState.error)} />
        <AssignDropdown />
      </Combobox.Root>
    </FieldRoot>
  );
};
