import { Combobox } from "@base-ui/react/combobox";
import * as React from "react";
import { useController as useCtrl } from "react-hook-form";
import { FieldLabel } from "@rwts/ui/field/FieldLabel";
import { FieldRoot, type FieldRootProps } from "@rwts/ui/field/FieldRoot";
import { FieldTextError } from "@rwts/ui/field/FieldTextError";
import {
  type AssignOption,
  type AssignFieldProps,
  AssignDropdown,
  isAssignItemEqualToValue,
  assignItemToStringLabel,
} from "./AssignField.shared";
import { MultiChipsInput, type MultiChipsInputProps } from "./AssignField.multiple.input";

interface UseMultipleAssignFieldArgs {
  name: string;
  options: AssignOption[];
}

interface UseMultipleAssignFieldReturn {
  field: ReturnType<typeof useCtrl>["field"];
  fieldState: ReturnType<typeof useCtrl>["fieldState"];
  selectedOptions: AssignOption[];
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  filteredItems: AssignOption[];
  handleValueChange: (newOptions: unknown) => void;
}

function useMultipleAssignField({ name, options }: UseMultipleAssignFieldArgs): UseMultipleAssignFieldReturn {
  const { field, fieldState } = useCtrl({ name });
  const selectedValueIds: string[] = field.value ?? [];

  const optionsMap = React.useMemo(() => Object.fromEntries(options.map((o): [string, AssignOption] => [o.valueId, o])), [options]);

  const selectedOptions: AssignOption[] = React.useMemo(
    () => selectedValueIds.map((id): AssignOption | undefined => optionsMap[id]).filter((o): o is AssignOption => o !== undefined),
    [selectedValueIds, optionsMap],
  );

  const [inputValue, setInputValue] = React.useState("");

  const filteredItems: AssignOption[] = React.useMemo(
    () => options.filter((o): boolean => !selectedValueIds.includes(o.valueId) && o.label.toLowerCase().includes(inputValue.toLowerCase())),
    [options, selectedValueIds, inputValue],
  );

  const handleValueChange = (newOptions: unknown): void => {
    const opts = Array.isArray(newOptions) ? (newOptions as AssignOption[]) : [];
    const lockedIds = selectedOptions.filter((o): boolean => Boolean(o.locked)).map((o): string => o.valueId);
    const newIds = opts.filter((o): boolean => !o.locked).map((o): string => o.valueId);
    field.onChange([...lockedIds, ...newIds]);
  };

  return { field, fieldState, selectedOptions, inputValue, setInputValue, filteredItems, handleValueChange };
}

export interface MultipleAssignFieldProps {
  fieldProps: AssignFieldProps;
}

export const MultipleAssignField: React.FC<MultipleAssignFieldProps> = ({ fieldProps }) => {
  const { field, fieldState, selectedOptions, inputValue, setInputValue, filteredItems, handleValueChange } = useMultipleAssignField({
    name: fieldProps.name,
    options: fieldProps.options,
  });

  const fieldRootProps: Omit<FieldRootProps, "children"> = {
    ...fieldProps.layout,
    invalid: Boolean(fieldState.error),
    error: <FieldTextError message={fieldState.error?.message} />,
  };

  const multiChipsInputProps: MultiChipsInputProps = {
    disabled: fieldProps.disabled,
    placeholder: fieldProps.placeholder,
    field,
    hasError: Boolean(fieldState.error),
  };

  return (
    <FieldRoot {...fieldRootProps}>
      <FieldLabel>{fieldProps.label}</FieldLabel>
      <Combobox.Root
        items={fieldProps.options}
        filteredItems={filteredItems}
        filter={null}
        value={selectedOptions}
        onValueChange={handleValueChange}
        inputValue={inputValue}
        onInputValueChange={setInputValue}
        multiple
        disabled={fieldProps.disabled}
        isItemEqualToValue={isAssignItemEqualToValue}
        itemToStringLabel={assignItemToStringLabel}
      >
        <MultiChipsInput {...multiChipsInputProps} />
        <AssignDropdown />
      </Combobox.Root>
    </FieldRoot>
  );
};
