import { Combobox } from "@base-ui/react/combobox";
import * as React from "react";
import type { useController as useCtrl } from "react-hook-form";
import { AssignAvatar, CloseIcon, WRAPPER_CLASS, type AssignOption } from "./AssignField.shared";

const EMPTY_CHIPS_COUNT = 0;

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

export interface MultiChipsInputProps {
  disabled?: boolean;
  placeholder?: string;
  field: ReturnType<typeof useCtrl>["field"];
  hasError: boolean;
}

export const MultiChipsInput: React.FC<MultiChipsInputProps> = ({ disabled, placeholder, field, hasError }) => (
  <div data-invalid={hasError ? "" : undefined} data-disabled={disabled ? "" : undefined} className={WRAPPER_CLASS}>
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
                placeholder={opts.length > EMPTY_CHIPS_COUNT ? "" : placeholder}
                className="h-6 min-w-24 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none dark:text-white dark:placeholder:text-gray-500"
              />
            </React.Fragment>
          )}
        </Combobox.Value>
      </Combobox.Chips>
    </Combobox.InputGroup>
  </div>
);
