import * as React from "react";
import { SingleAssignField } from "./AssignField.single";
import { MultipleAssignField } from "./AssignField.multiple";
import type { AssignFieldProps } from "./AssignField.shared";

export type { AssignOption, AssignFieldProps } from "./AssignField.shared";

export const AssignField: React.FC<AssignFieldProps> = (props) => {
  if (props.multiple) {
    return <MultipleAssignField fieldProps={props} />;
  }
  return <SingleAssignField fieldProps={props} />;
};

AssignField.displayName = "AssignField";
