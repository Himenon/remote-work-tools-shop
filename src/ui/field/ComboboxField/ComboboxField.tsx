import { Combobox } from "@base-ui/react/combobox";
import * as React from "react";
import { useController } from "react-hook-form";
import { FieldLabel } from "#ui/field/FieldLabel";
import { FieldRoot, type FieldLayoutProps } from "#ui/field/FieldRoot";
import { FieldTextError } from "#ui/field/FieldTextError";

export interface ComboboxOption {
  label: string;
  value: string;
  /** @default false */
  disabled?: boolean;
}

export interface ComboboxFieldProps {
  name: string;
  label: string;
  options: ComboboxOption[];
  placeholder?: string;
  /** @default false */
  required?: boolean;
  /** @default false */
  disabled?: boolean;
  layout?: FieldLayoutProps;
}

const ComboboxOptionItem: React.FC<ComboboxOption> = (option) => (
  <Combobox.Item
    value={option}
    disabled={option.disabled}
    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-gray-900 outline-none transition-colors data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[highlighted]:bg-indigo-50 data-[highlighted]:text-indigo-900 data-[selected]:font-medium dark:text-white dark:data-[highlighted]:bg-indigo-900/40 dark:data-[highlighted]:text-indigo-100"
  >
    <span>{option.label}</span>
    <Combobox.ItemIndicator className="ml-auto text-indigo-600 dark:text-indigo-400">
      <svg
        viewBox="0 0 16 16"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M3.5 8l3 3 5.5-5.5" />
      </svg>
    </Combobox.ItemIndicator>
  </Combobox.Item>
);

const ComboboxActions: React.FC = () => (
  <div className="flex shrink-0 items-center gap-0.5 pr-2">
    <Combobox.Clear
      aria-label="クリア"
      className="flex size-5 cursor-pointer items-center justify-center rounded text-gray-400 outline-none hover:text-gray-600 data-[disabled]:hidden dark:text-gray-500 dark:hover:text-gray-300"
    >
      <svg
        viewBox="0 0 16 16"
        className="size-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M3 3l10 10M13 3L3 13" />
      </svg>
    </Combobox.Clear>
    <Combobox.Trigger
      aria-label="開く"
      data-testid="combobox-trigger"
      className="flex size-5 cursor-pointer items-center justify-center text-gray-400 outline-none data-[disabled]:cursor-not-allowed dark:text-gray-500"
    >
      <svg
        viewBox="0 0 16 16"
        className="size-4 transition-transform data-[popup-open]:rotate-180"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M4 6l4 4 4-4" />
      </svg>
    </Combobox.Trigger>
  </div>
);

const ComboboxPopup: React.FC = () => (
  <Combobox.Portal>
    <Combobox.Positioner className="z-50">
      <Combobox.Popup className="min-w-[var(--anchor-width)] overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg outline-none dark:border-gray-700 dark:bg-gray-800">
        <Combobox.Empty className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">候補なし</Combobox.Empty>
        <Combobox.List className="p-1">
          {(option: ComboboxOption): React.ReactElement => <ComboboxOptionItem key={option.value} {...option} />}
        </Combobox.List>
      </Combobox.Popup>
    </Combobox.Positioner>
  </Combobox.Portal>
);

export const ComboboxField: React.FC<ComboboxFieldProps> = (props) => {
  const { field, fieldState } = useController({ name: props.name });

  const selectedOption = props.options.find((o): boolean => o.value === field.value) ?? null;
  const [inputValue, setInputValue] = React.useState(selectedOption?.label ?? "");

  const handleValueChange = (option: ComboboxOption | null): void => {
    field.onChange(option?.value ?? null);
    setInputValue(option?.label ?? "");
  };

  return (
    <FieldRoot {...props.layout} invalid={Boolean(fieldState.error)} error={<FieldTextError message={fieldState.error?.message} />}>
      <FieldLabel>{props.label}</FieldLabel>
      <Combobox.Root
        items={props.options}
        value={selectedOption}
        onValueChange={handleValueChange}
        inputValue={inputValue}
        onInputValueChange={setInputValue}
        name={field.name}
        disabled={props.disabled}
        required={props.required}
      >
        <div
          data-invalid={fieldState.error ? "" : undefined}
          data-disabled={props.disabled ? "" : undefined}
          className="relative flex h-9 w-full items-center rounded-md border border-gray-300 bg-white shadow-xs transition-colors focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 data-[invalid]:border-red-500 data-[disabled]:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:border-indigo-400 dark:focus-within:ring-indigo-400/20 dark:data-[invalid]:border-red-400"
        >
          <Combobox.Input
            placeholder={props.placeholder}
            onBlur={field.onBlur}
            ref={field.ref}
            className="h-full w-full bg-transparent px-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none data-[disabled]:cursor-not-allowed dark:text-white dark:placeholder:text-gray-500"
          />
          <ComboboxActions />
        </div>
        <ComboboxPopup />
      </Combobox.Root>
    </FieldRoot>
  );
};

ComboboxField.displayName = "ComboboxField";
