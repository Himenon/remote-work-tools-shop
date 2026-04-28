import { Field } from "@base-ui/react/field";
import { Select } from "@base-ui/react/select";
import * as React from "react";
import { useController, useFormContext } from "react-hook-form";

export interface SelectOption {
  label: string;
  value: string;
  /** @default false */
  disabled?: boolean;
}

export interface SingleSelectFieldProps {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  /** @default false */
  disabled?: boolean;
  /** @default false */
  required?: boolean;
}

export const SingleSelectField: React.FC<SingleSelectFieldProps> = (props) => {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name: props.name, control });

  const selectRootProps: React.ComponentProps<typeof Select.Root> = {
    value: field.value ?? null,
    onValueChange: field.onChange,
    name: field.name,
    disabled: props.disabled,
    required: props.required,
  };

  return (
    <Field.Root disabled={props.disabled} invalid={Boolean(fieldState.error)}>
      <Field.Label>{props.label}</Field.Label>
      <Select.Root {...selectRootProps}>
        <Select.Trigger>
          <Select.Value placeholder={props.placeholder} />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner>
            <Select.Popup>
              <Select.List>
                {props.options.map((option) => {
                  const itemProps: React.ComponentProps<typeof Select.Item> = {
                    value: option.value,
                    disabled: option.disabled,
                  };
                  return (
                    <Select.Item key={option.value} {...itemProps}>
                      <Select.ItemText>{option.label}</Select.ItemText>
                      <Select.ItemIndicator />
                    </Select.Item>
                  );
                })}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
      {fieldState.error?.message && <Field.Error match={true}>{fieldState.error.message}</Field.Error>}
    </Field.Root>
  );
};

SingleSelectField.displayName = "SingleSelectField";
