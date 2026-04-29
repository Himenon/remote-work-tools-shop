import { Field } from "@base-ui/react/field";
import { Fieldset } from "@base-ui/react/fieldset";
import { Slider } from "@base-ui/react/slider";
import * as React from "react";
import { useController } from "react-hook-form";

import { FieldTextError } from "#ui/field/FieldTextError";

export interface NumberSlideFieldProps {
  name: string;
  label: string;
  /** @default 0 */
  min?: number;
  /** @default 1 */
  max?: number;
  /** @default 0.01 */
  step?: number;
  format?: Intl.NumberFormatOptions;
  minThumbLabel?: string;
  maxThumbLabel?: string;
  /** @default false */
  disabled?: boolean;
}

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 1;
const DEFAULT_STEP = 0.01;

const thumbClassName =
  "size-4 rounded-full bg-white shadow-sm outline-none ring-1 ring-gray-300 transition-shadow data-[dragging]:ring-2 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[focus-visible]:ring-2 data-[focus-visible]:ring-indigo-500 dark:bg-gray-200 dark:ring-gray-600";

export const NumberSlideField: React.FC<NumberSlideFieldProps> = (props) => {
  const { field, fieldState } = useController({ name: props.name });

  return (
    <Field.Root disabled={props.disabled} invalid={Boolean(fieldState.error)} className="flex flex-col gap-1.5">
      <Fieldset.Root
        render={
          <Slider.Root
            value={field.value as readonly number[]}
            onValueChange={field.onChange}
            name={field.name}
            min={props.min ?? DEFAULT_MIN}
            max={props.max ?? DEFAULT_MAX}
            step={props.step ?? DEFAULT_STEP}
            format={props.format}
            thumbAlignment="edge"
            disabled={props.disabled}
            className="grid w-full grid-cols-2 items-center gap-y-2"
          />
        }
      >
        <Fieldset.Legend className="text-sm font-medium text-gray-700 data-[disabled]:opacity-50 dark:text-gray-300">
          {props.label}
        </Fieldset.Legend>
        <Slider.Value className="col-start-2 text-end text-sm text-gray-700 dark:text-gray-300" />
        <Slider.Control className="col-span-2">
          <Slider.Track className="relative flex h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <Slider.Indicator className="rounded-full bg-indigo-600 dark:bg-indigo-500" />
            <Slider.Thumb index={0} aria-label={props.minThumbLabel ?? "最小値"} className={thumbClassName} />
            <Slider.Thumb index={1} aria-label={props.maxThumbLabel ?? "最大値"} className={thumbClassName} />
          </Slider.Track>
        </Slider.Control>
      </Fieldset.Root>
      <FieldTextError message={fieldState.error?.message} />
    </Field.Root>
  );
};

NumberSlideField.displayName = "NumberSlideField";
