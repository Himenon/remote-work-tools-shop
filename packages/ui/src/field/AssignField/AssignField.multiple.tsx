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
  CloseIcon,
  WRAPPER_CLASS,
  isAssignItemEqualToValue,
  assignItemToStringLabel,
} from "./AssignField.shared";

const EMPTY_CHIPS_COUNT = 0;

// ─── 個別チップ ───────────────────────────────────────────────────────────────

const AssignChip: React.FC<{ option: AssignOption }> = ({ option }) => (
  <Combobox.Chip
    aria-label={option.chipLabel ?? option.label}
    className="inline-flex items-center gap-1 rounded bg-indigo-50 px-1.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
  >
    <AssignAvatar option={option} />
    <span>{option.chipLabel ?? option.label}</span>
    {!option.locked && (
      <Combobox.ChipRemove
        aria-label={`${option.label}を削除`}
        className="ml-0.5 flex size-3.5 cursor-pointer items-center justify-center rounded outline-none hover:bg-indigo-100 dark:hover:bg-indigo-800"
      >
        <CloseIcon className="size-2.5" />
      </Combobox.ChipRemove>
    )}
  </Combobox.Chip>
);

// ─── チップ + 入力ラッパー ────────────────────────────────────────────────────

interface MultiChipsInputProps {
  fieldProps: AssignFieldProps;
  field: ReturnType<typeof useCtrl>["field"];
  hasError: boolean;
}

const MultiChipsInput: React.FC<MultiChipsInputProps> = ({ fieldProps, field, hasError }) => (
  <div data-invalid={hasError ? "" : undefined} data-disabled={fieldProps.disabled ? "" : undefined} className={WRAPPER_CLASS}>
    <Combobox.InputGroup className="flex flex-wrap items-center gap-1 p-1.5">
      <Combobox.Chips className="contents">
        <Combobox.Value>
          {(opts: AssignOption[]): React.ReactElement => (
            <React.Fragment>
              {opts.map(
                (opt): React.ReactElement => (
                  <AssignChip key={opt.valueId} option={opt} />
                ),
              )}
              <Combobox.Input
                ref={field.ref}
                onBlur={field.onBlur}
                placeholder={opts.length > EMPTY_CHIPS_COUNT ? "" : fieldProps.placeholder}
                className="h-6 min-w-24 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none dark:text-white dark:placeholder:text-gray-500"
              />
            </React.Fragment>
          )}
        </Combobox.Value>
      </Combobox.Chips>
    </Combobox.InputGroup>
  </div>
);

// ─── フック ───────────────────────────────────────────────────────────────────

interface UseMultipleAssignFieldReturn {
  field: ReturnType<typeof useCtrl>["field"];
  fieldState: ReturnType<typeof useCtrl>["fieldState"];
  selectedOptions: AssignOption[];
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  filteredItems: AssignOption[];
  handleValueChange: (newOptions: unknown) => void;
}

function useMultipleAssignField(fieldProps: AssignFieldProps): UseMultipleAssignFieldReturn {
  const { field, fieldState } = useCtrl({ name: fieldProps.name });
  const selectedValueIds: string[] = field.value ?? [];

  const optionsMap = React.useMemo(
    () => Object.fromEntries(fieldProps.options.map((o): [string, AssignOption] => [o.valueId, o])),
    [fieldProps.options],
  );

  const selectedOptions: AssignOption[] = React.useMemo(
    () => selectedValueIds.map((id): AssignOption | undefined => optionsMap[id]).filter((o): o is AssignOption => o !== undefined),
    [selectedValueIds, optionsMap],
  );

  const [inputValue, setInputValue] = React.useState("");

  const filteredItems: AssignOption[] = React.useMemo(
    () =>
      fieldProps.options.filter(
        (o): boolean => !selectedValueIds.includes(o.valueId) && o.label.toLowerCase().includes(inputValue.toLowerCase()),
      ),
    [fieldProps.options, selectedValueIds, inputValue],
  );

  const handleValueChange = (newOptions: unknown): void => {
    const opts = Array.isArray(newOptions) ? (newOptions as AssignOption[]) : [];
    const lockedIds = selectedOptions.filter((o): boolean => Boolean(o.locked)).map((o): string => o.valueId);
    const newIds = opts.filter((o): boolean => !o.locked).map((o): string => o.valueId);
    field.onChange([...lockedIds, ...newIds]);
  };

  return { field, fieldState, selectedOptions, inputValue, setInputValue, filteredItems, handleValueChange };
}

// ─── 複数選択フィールド ───────────────────────────────────────────────────────

export interface MultipleAssignFieldProps {
  fieldProps: AssignFieldProps;
}

export const MultipleAssignField: React.FC<MultipleAssignFieldProps> = ({ fieldProps }) => {
  const { field, fieldState, selectedOptions, inputValue, setInputValue, filteredItems, handleValueChange } =
    useMultipleAssignField(fieldProps);

  return (
    <FieldRoot {...fieldProps.layout} invalid={Boolean(fieldState.error)} error={<FieldTextError message={fieldState.error?.message} />}>
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
        <MultiChipsInput fieldProps={fieldProps} field={field} hasError={Boolean(fieldState.error)} />
        <AssignDropdown />
      </Combobox.Root>
    </FieldRoot>
  );
};
