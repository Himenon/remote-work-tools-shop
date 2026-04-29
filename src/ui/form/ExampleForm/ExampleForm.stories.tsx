import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { action } from "storybook/actions";

import { ExampleForm, type ExampleFormValues } from "./ExampleForm";

const meta = {
  component: ExampleForm,
  args: {
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
  scalingThreshold: [0.2, 0.8],
  storageType: "ssd",
  restartOnFailure: true,
  allowedNetworkProtocols: ["tcp", "https"],
};

export const Default: Story = {
  name: "初期状態（全フィールドが空）",
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
