import type { Meta, StoryObj } from "@storybook/react";
import { fn, userEvent, within } from "storybook/test";
import { action } from "storybook/actions";

import { ExampleForm, type ExampleFormSources, type ExampleFormValues } from "./ExampleForm";

const SOURCES: ExampleFormSources = {
  region: [
    { label: "US East (N. Virginia)", value: "us-east-1" },
    { label: "US West (Oregon)", value: "us-west-2" },
    { label: "EU (Ireland)", value: "eu-west-1" },
    { label: "Asia Pacific (Tokyo)", value: "ap-northeast-1" },
  ],
  serverType: [
    { label: "t2.micro (1 vCPU, 1 GB)", value: "t2.micro" },
    { label: "t2.small (1 vCPU, 2 GB)", value: "t2.small" },
    { label: "t2.medium (2 vCPU, 4 GB)", value: "t2.medium" },
    { label: "c5.large (2 vCPU, 4 GB)", value: "c5.large" },
  ],
  storageType: [
    { label: "SSD", value: "ssd" },
    { label: "HDD", value: "hdd" },
    { label: "NVMe", value: "nvme" },
  ],
  allowedNetworkProtocols: [
    { label: "TCP", value: "tcp" },
    { label: "UDP", value: "udp" },
    { label: "HTTP", value: "http" },
    { label: "HTTPS", value: "https" },
  ],
  scalingThreshold: { min: 0.2, max: 0.8 },
};

const meta = {
  component: ExampleForm,
  args: {
    sources: SOURCES,
    onSubmit: fn(),
  },
} satisfies Meta<typeof ExampleForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 送信時に Actions パネルで受け取った値を確認するためのテスト用データ */
const submittedValues: ExampleFormValues = {
  serverName: "web-server-01",
  region: "ap-northeast-1",
  containerImage: "nginx:latest",
  serverType: "t2.small",
  numOfInstances: 3,
  scalingThreshold: { min: 0.2, max: 0.8 },
  storageType: "ssd",
  restartOnFailure: true,
  allowedNetworkProtocols: ["tcp", "https"],
};

export const Default: Story = {
  name: "初期状態（全フィールドが空）",
};

/** 全必須フィールドが未入力の状態で送信したときに表示されるエラーパターン */
export const AllRequiredFieldsEmpty: Story = {
  name: "バリデーションエラー（全必須項目が未入力）",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "送信" }));
  },
};

/** サーバー名が3文字未満のときに表示される文字数エラーパターン */
export const ServerNameTooShort: Story = {
  name: "バリデーションエラー（サーバー名が3文字未満）",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("サーバー名"), "ab");
    await userEvent.click(canvas.getByRole("button", { name: "送信" }));
  },
};

/** サーバー名に英数字・アンダースコア・ハイフン以外の文字が含まれるときのエラーパターン */
export const ServerNameWithInvalidCharacters: Story = {
  name: "バリデーションエラー（サーバー名に使用できない文字）",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("サーバー名"), "web server@01!");
    await userEvent.click(canvas.getByRole("button", { name: "送信" }));
  },
};

export const WithPrefilledValues: Story = {
  name: "送信時の値を Actions で確認できる状態",
  args: {
    onSubmit: fn().mockImplementation((values: ExampleFormValues): void => {
      action("フォーム送信値")(values);
    }),
  },
  parameters: {
    docs: {
      description: {
        // oxlint-disable-next-line no-magic-numbers
        story: `フォームを送信すると Actions パネルに入力値が記録されます。確認用の入力値例: ${JSON.stringify(submittedValues, null, 2)}`,
      },
    },
  },
};
