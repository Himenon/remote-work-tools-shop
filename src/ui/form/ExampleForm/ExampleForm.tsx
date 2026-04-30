import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { ExampleFormSchema, INSTANCES_MIN, INSTANCES_MAX, type ExampleFormInput, type ExampleFormValues } from "#schema/form/ExampleFormSchema";
import { MultiSelectField, type MultiSelectOption } from "#ui/field/MultiSelectField";
import { NumberSlideField } from "#ui/field/NumberSlideField";
import { QuantityStepperField } from "#ui/field/QuantityStepperField";
import { RadioGroupField, type RadioOption } from "#ui/field/RadioGroupField";
import { ComboboxField, type ComboboxOption } from "#ui/field/ComboboxField";
import { SingleSelectField, type SelectOption } from "#ui/field/SingleSelectField";
import { SwitchField } from "#ui/field/SwitchField";
import { OnelineTextField } from "#ui/field/OnelineTextField";

export type { ExampleFormValues };

const REGION_OPTIONS: ComboboxOption[] = [
  { label: "US East (N. Virginia)", value: "us-east-1" },
  { label: "US West (Oregon)", value: "us-west-2" },
  { label: "EU (Ireland)", value: "eu-west-1" },
  { label: "Asia Pacific (Tokyo)", value: "ap-northeast-1" },
];

const SERVER_TYPE_OPTIONS: SelectOption[] = [
  { label: "t2.micro (1 vCPU, 1 GB)", value: "t2.micro" },
  { label: "t2.small (1 vCPU, 2 GB)", value: "t2.small" },
  { label: "t2.medium (2 vCPU, 4 GB)", value: "t2.medium" },
  { label: "c5.large (2 vCPU, 4 GB)", value: "c5.large" },
];

const STORAGE_TYPE_OPTIONS: RadioOption[] = [
  { label: "SSD", value: "ssd" },
  { label: "HDD", value: "hdd" },
  { label: "NVMe", value: "nvme" },
];

const NETWORK_PROTOCOL_OPTIONS: MultiSelectOption[] = [
  { label: "TCP", value: "tcp" },
  { label: "UDP", value: "udp" },
  { label: "HTTP", value: "http" },
  { label: "HTTPS", value: "https" },
];

const SCALING_THRESHOLD_MIN_DEFAULT = 0.2;
const SCALING_THRESHOLD_MAX_DEFAULT = 0.8;
const SCALING_THRESHOLD_FORMAT: Intl.NumberFormatOptions = { style: "percent" };

export interface ExampleFormProps {
  onSubmit?: (values: ExampleFormValues) => void;
}

export const ExampleForm: React.FC<ExampleFormProps> = (props) => {
  const methods = useForm<ExampleFormInput, unknown, ExampleFormValues>({
    resolver: zodResolver(ExampleFormSchema),
    defaultValues: {
      serverName: "",
      region: null,
      containerImage: "",
      serverType: null,
      numOfInstances: null,
      scalingThreshold: [SCALING_THRESHOLD_MIN_DEFAULT, SCALING_THRESHOLD_MAX_DEFAULT],
      storageType: "ssd",
      restartOnFailure: true,
      allowedNetworkProtocols: [],
    },
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
      <form onSubmit={handleSubmit} noValidate className="flex max-w-xl flex-col gap-6 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">サーバー設定</h2>

        <OnelineTextField name="serverName" label="サーバー名" placeholder="例: web-server-01" required />

        <ComboboxField name="region" label="リージョン" options={REGION_OPTIONS} placeholder="リージョンを選択または入力" required />

        <OnelineTextField name="containerImage" label="コンテナイメージ" placeholder="例: nginx:latest" required />

        <SingleSelectField name="serverType" label="サーバータイプ" options={SERVER_TYPE_OPTIONS} placeholder="サーバータイプを選択" required />

        <QuantityStepperField name="numOfInstances" label="インスタンス数" min={INSTANCES_MIN} max={INSTANCES_MAX} required />

        <NumberSlideField name="scalingThreshold" label="スケーリング閾値" format={SCALING_THRESHOLD_FORMAT} />

        <RadioGroupField name="storageType" label="ストレージタイプ" options={STORAGE_TYPE_OPTIONS} orientation="horizontal" />

        <SwitchField name="restartOnFailure" label="障害時に自動再起動する" />

        <MultiSelectField
          name="allowedNetworkProtocols"
          label="許可するネットワークプロトコル"
          options={NETWORK_PROTOCOL_OPTIONS}
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
