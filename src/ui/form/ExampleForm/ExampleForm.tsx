import * as React from "react";
import { FormProvider, useForm } from "react-hook-form";

import { MultiSelectField, type MultiSelectOption } from "#ui/field/MultiSelectField";
import { RadioGroupField, type RadioOption } from "#ui/field/RadioGroupField";
import { SingleSelectField, type SelectOption } from "#ui/field/SingleSelectField";
import { SwitchField } from "#ui/field/SwitchField";
import { TextField } from "#ui/field/TextField";

export interface ExampleFormValues {
  serverName: string;
  region: string | null;
  containerImage: string;
  serverType: string | null;
  numOfInstances: string;
  storageType: string;
  restartOnFailure: boolean;
  allowedNetworkProtocols: string[];
}

const REGION_OPTIONS: SelectOption[] = [
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

export interface ExampleFormProps {
  onSubmit?: (values: ExampleFormValues) => void;
}

export const ExampleForm: React.FC<ExampleFormProps> = (props) => {
  const methods = useForm<ExampleFormValues>({
    defaultValues: {
      serverName: "",
      region: null,
      containerImage: "",
      serverType: null,
      numOfInstances: "",
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
      <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-6 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">サーバー設定</h2>

        <TextField name="serverName" label="サーバー名" placeholder="例: web-server-01" required />

        <SingleSelectField name="region" label="リージョン" options={REGION_OPTIONS} placeholder="リージョンを選択" required />

        <TextField name="containerImage" label="コンテナイメージ" placeholder="例: nginx:latest" required />

        <SingleSelectField name="serverType" label="サーバータイプ" options={SERVER_TYPE_OPTIONS} placeholder="サーバータイプを選択" required />

        <TextField name="numOfInstances" label="インスタンス数" placeholder="1〜64" required />

        <RadioGroupField name="storageType" label="ストレージタイプ" options={STORAGE_TYPE_OPTIONS} />

        <SwitchField name="restartOnFailure" label="障害時に自動再起動する" />

        <MultiSelectField name="allowedNetworkProtocols" label="許可するネットワークプロトコル" options={NETWORK_PROTOCOL_OPTIONS} />

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
