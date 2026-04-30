import { Field } from "@base-ui/react/field";
import * as React from "react";

export interface FieldRootProps {
  disabled?: boolean;
  invalid: boolean;
  /** @default "vertical" */
  direction?: "horizontal" | "vertical";
  children: React.ReactNode;
  error?: React.ReactNode;
}

export const FieldRoot: React.FC<FieldRootProps> = ({ disabled, invalid, direction = "vertical", children, error }) => {
  return (
    <Field.Root disabled={disabled} invalid={invalid} className="flex flex-col gap-1.5">
      {direction === "horizontal" ? <div className="flex items-center justify-between gap-4">{children}</div> : children}
      {error}
    </Field.Root>
  );
};

FieldRoot.displayName = "FieldRoot";
