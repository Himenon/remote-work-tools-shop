import * as React from "react";
import { SingleAssignField, type SingleAssignFieldProps } from "./AssignField.single";
import { MultipleAssignField, type MultipleAssignFieldProps } from "./AssignField.multiple";
import type { AssignFieldProps } from "./AssignField.shared";

export type { AssignOption, AssignFieldProps } from "./AssignField.shared";

export const AssignField: React.FC<AssignFieldProps> = (props) => {
  if (props.multiple) {
    const multipleAssignFieldProps: MultipleAssignFieldProps = { fieldProps: props };
    return <MultipleAssignField {...multipleAssignFieldProps} />;
  }
  const singleAssignFieldProps: SingleAssignFieldProps = { fieldProps: props };
  return <SingleAssignField {...singleAssignFieldProps} />;
};

AssignField.displayName = "AssignField";
