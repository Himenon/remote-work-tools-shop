import { Combobox } from "@base-ui/react/combobox";
import * as React from "react";
import type { FieldLayoutProps } from "@rwts/ui/field/FieldRoot";

export interface AssignOption {
  valueId: string;
  label: string;
  /** チップに表示するテキスト。省略時は label を使用 @default label */
  chipLabel?: string;
  /** アバターアイコンの種類 @default "person" */
  iconType?: "person" | "group";
  /** アバター写真の URL。指定時は iconType より優先される */
  photoUrl?: string;
  /** true のとき選択解除・削除ができない @default false */
  locked?: boolean;
}

export interface AssignFieldProps {
  name: string;
  label: string;
  options: AssignOption[];
  placeholder?: string;
  /** @default false */
  multiple?: boolean;
  /** @default false */
  disabled?: boolean;
  loading?: boolean;
  layout?: FieldLayoutProps;
}

export const PersonIcon: React.FC = () => (
  <svg viewBox="0 0 16 16" className="size-3" fill="currentColor" aria-hidden>
    <path d="M8 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
    <path d="M3 13c0-1.5 2.2-4 5-4s5 2.5 5 4H3Z" />
  </svg>
);

export const GroupIcon: React.FC = () => (
  <svg viewBox="0 0 16 16" className="size-3" fill="currentColor" aria-hidden>
    <path d="M6 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" />
    <path d="M1.5 12c0-1.2 1.6-3 4.5-3s4.5 1.8 4.5 3h-9Z" />
    <path d="M10.5 3.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
    <path d="M10 9.4c.4-.3.9-.4 1.5-.4 2 0 3.5 1.4 3.5 2.5H13c-.2-1-1.2-1.8-3-2.1Z" />
  </svg>
);

export const CheckIcon: React.FC = () => (
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
);

export const ChevronIcon: React.FC = () => (
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
);

export const CloseIcon: React.FC<{ className?: string }> = ({ className = "size-3.5" }) => (
  <svg
    viewBox="0 0 16 16"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M3 3l10 10M13 3L3 13" />
  </svg>
);

export const AssignAvatar: React.FC<{ option: AssignOption }> = ({ option }) => {
  if (option.photoUrl) {
    return <img src={option.photoUrl} alt="" className="size-5 shrink-0 rounded-full object-cover" />;
  }
  return (
    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
      {option.iconType === "group" ? <GroupIcon /> : <PersonIcon />}
    </span>
  );
};

export const ITEM_CLASS =
  "flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-gray-900 outline-none transition-colors data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[highlighted]:bg-indigo-50 data-[highlighted]:text-indigo-900 dark:text-white dark:data-[highlighted]:bg-indigo-900/40 dark:data-[highlighted]:text-indigo-100";

export const WRAPPER_CLASS =
  "w-full rounded-md border border-gray-300 bg-white shadow-xs transition-colors focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 data-[invalid]:border-red-500 data-[disabled]:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:border-indigo-400 dark:focus-within:ring-indigo-400/20 dark:data-[invalid]:border-red-400";

export const AssignDropdown: React.FC = () => (
  <Combobox.Portal>
    <Combobox.Positioner className="z-50">
      <Combobox.Popup className="min-w-[var(--anchor-width)] overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg outline-none dark:border-gray-700 dark:bg-gray-800">
        <Combobox.Empty className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">候補なし</Combobox.Empty>
        <Combobox.List className="p-1">
          {(option: AssignOption): React.ReactElement => (
            <Combobox.Item key={option.valueId} value={option} className={ITEM_CLASS}>
              <AssignAvatar option={option} />
              <span>{option.label}</span>
              <Combobox.ItemIndicator className="ml-auto text-indigo-600 dark:text-indigo-400">
                <CheckIcon />
              </Combobox.ItemIndicator>
            </Combobox.Item>
          )}
        </Combobox.List>
      </Combobox.Popup>
    </Combobox.Positioner>
  </Combobox.Portal>
);

export const isAssignItemEqualToValue = (a: AssignOption, b: AssignOption): boolean => a.valueId === b.valueId;

export const assignItemToStringLabel = (o: AssignOption): string => o.label;
