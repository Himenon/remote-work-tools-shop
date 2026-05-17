import { Combobox } from "@base-ui/react/combobox";
import * as React from "react";
import type { useController as useCtrl } from "react-hook-form";
import { AssignAvatar, ChevronIcon, CloseIcon, WRAPPER_CLASS, type AssignOption } from "./AssignField.shared";

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

export interface SingleComboboxInputProps {
  option: AssignOption | null;
  placeholder?: string;
  disabled?: boolean;
  field: ReturnType<typeof useCtrl>["field"];
  hasError: boolean;
}

export const SingleComboboxInput: React.FC<SingleComboboxInputProps> = ({ option, placeholder, disabled, field, hasError }) => (
  <div
    data-invalid={hasError ? "" : undefined}
    data-disabled={disabled ? "" : undefined}
    className={`relative flex h-9 items-center ${WRAPPER_CLASS}`}
  >
    {option && (
      <span className="pl-2.5">
        <AssignAvatar option={option} />
      </span>
    )}
    <Combobox.Input
      placeholder={placeholder}
      onBlur={field.onBlur}
      ref={field.ref}
      className="h-full w-full bg-transparent px-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none data-[disabled]:cursor-not-allowed dark:text-white dark:placeholder:text-gray-500"
    />
    <SingleComboboxActions />
  </div>
);
