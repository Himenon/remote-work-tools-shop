import { Field } from "@base-ui/react/field";
import * as React from "react";

export interface FieldTextErrorProps {
  message: string | undefined;
}

export const FieldTextError: React.FC<FieldTextErrorProps> = ({ message }) => {
  if (!message) {
    return null;
  }
  return (
    <Field.Error match={true} className="text-xs text-red-600 dark:text-red-400">
      {message}
    </Field.Error>
  );
};

FieldTextError.displayName = "FieldTextError";
