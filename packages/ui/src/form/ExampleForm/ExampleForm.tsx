import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import {
  ExampleFormSchema,
  INSTANCES_MIN,
  INSTANCES_MAX,
  type ExampleFormInput,
  type ExampleFormValues,
} from "@rwts/contract/form/ExampleFormSchema";
import { MultiSelectField, type MultiSelectOption } from "@rwts/ui/field/MultiSelectField";
import { NumberSlideField } from "@rwts/ui/field/NumberSlideField";
import { QuantityStepperField } from "@rwts/ui/field/QuantityStepperField";
import { RadioGroupField, type RadioOption } from "@rwts/ui/field/RadioGroupField";
import { ComboboxField, type ComboboxOption } from "@rwts/ui/field/ComboboxField";
import { SingleSelectField, type SelectOption } from "@rwts/ui/field/SingleSelectField";
import { SwitchField } from "@rwts/ui/field/SwitchField";
import { OnelineTextField } from "@rwts/ui/field/OnelineTextField";

export type { ExampleFormValues };

const SCALING_THRESHOLD_FORMAT: Intl.NumberFormatOptions = { style: "percent" };

export interface ExampleFormSources {
  region: ComboboxOption[];
  serverType: SelectOption[];
  storageType: RadioOption[];
  allowedNetworkProtocols: MultiSelectOption[];
}

export interface ExampleFormProps {
  sources: ExampleFormSources;
  /** 指定時は編集フォーム、未指定時は新規入力フォームとして動作する */
  defaultValues?: ExampleFormInput;
  onSubmit?: (values: ExampleFormValues) => void;
}

const defaultValues: ExampleFormInput = {
  serverName: "",
  region: null,
  containerImage: "",
  serverType: null,
  numOfInstances: null,
  scalingThreshold: {
    min: 0,
    max: 1,
  },
  storageType: "",
  restartOnFailure: true,
  allowedNetworkProtocols: [],
};

export const ExampleForm: React.FC<ExampleFormProps> = (props) => {
  const methods = useForm<ExampleFormInput, unknown, ExampleFormValues>({
    resolver: zodResolver(ExampleFormSchema),
    defaultValues: props.defaultValues ?? defaultValues,
  });

  const handleSubmit = methods.handleSubmit((values: ExampleFormValues): void => {
    if (props.onSubmit) {
      props.onSubmit(values);
    } else {
      // oxlint-disable-next-line no-magic-numbers
      alert(JSON.stringify(values, null, 2));
    }
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e): void => {
          void handleSubmit(e);
        }}
        noValidate
        className="flex max-w-xl flex-col gap-6 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">サーバー設定</h2>

        <OnelineTextField name="serverName" label="サーバー名" placeholder="例: web-server-01" required />

        <ComboboxField name="region" label="リージョン" options={props.sources.region} placeholder="リージョンを選択または入力" required />

        <OnelineTextField name="containerImage" label="コンテナイメージ" placeholder="例: nginx:latest" required />

        <SingleSelectField
          name="serverType"
          label="サーバータイプ"
          options={props.sources.serverType}
          placeholder="サーバータイプを選択"
          required
        />

        <QuantityStepperField name="numOfInstances" label="インスタンス数" min={INSTANCES_MIN} max={INSTANCES_MAX} required />

        <NumberSlideField name="scalingThreshold" label="スケーリング閾値" format={SCALING_THRESHOLD_FORMAT} />

        <RadioGroupField name="storageType" label="ストレージタイプ" options={props.sources.storageType} orientation="horizontal" />

        <SwitchField name="restartOnFailure" label="障害時に自動再起動する" />

        <MultiSelectField
          name="allowedNetworkProtocols"
          label="許可するネットワークプロトコル"
          options={props.sources.allowedNetworkProtocols}
          orientation="horizontal"
        />

        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          送信
        </button>
      </form>
    </FormProvider>
  );
};

ExampleForm.displayName = "ExampleForm";
