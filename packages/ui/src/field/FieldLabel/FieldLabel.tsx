import { Field } from "@base-ui/react/field";
import * as React from "react";

export interface FieldLabelProps {
  children: React.ReactNode;
  /** チェックボックスなどクリック操作を伴うラベルに使う @default false */
  clickable?: boolean;
}

const BASE_CLASS = "text-sm font-medium text-gray-700 dark:text-gray-300 data-[disabled]:opacity-50";
const CLICKABLE_EXTRA = "cursor-pointer select-none data-[disabled]:cursor-not-allowed";

export const FieldLabel: React.FC<FieldLabelProps> = ({ children, clickable = false }) => {
  const className = clickable ? `${CLICKABLE_EXTRA} ${BASE_CLASS}` : BASE_CLASS;
  return <Field.Label className={className}>{children}</Field.Label>;
};

FieldLabel.displayName = "FieldLabel";
