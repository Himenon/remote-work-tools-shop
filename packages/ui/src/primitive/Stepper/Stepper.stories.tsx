import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Stepper, type StepperProps } from "./Stepper";

type T = typeof Stepper;
type Story = StoryObj<T>;

const threeSteps: StepperProps["steps"] = [{ label: "会計情報の入力" }, { label: "配送先の確認" }, { label: "注文の確定" }];

const fiveSteps: StepperProps["steps"] = [
  { label: "アカウント作成" },
  { label: "プロフィール設定" },
  { label: "プランの選択" },
  { label: "お支払い情報" },
  { label: "完了" },
];

const stepsWithOptional: StepperProps["steps"] = [
  { label: "会計情報の入力" },
  { label: "配送先の確認", subLabel: "任意" },
  { label: "注文の確定" },
];

const longLabelSteps: StepperProps["steps"] = [
  { label: "アカウント情報を入力してください" },
  { label: "お届け先の住所を確認してください" },
  { label: "ご注文内容を最終確認して確定してください" },
];

export const 水平レイアウト最初のステップがアクティブ: Story = {
  name: "水平レイアウト：最初のステップがアクティブ",
  args: {
    steps: threeSteps,
    activeStep: 0,
    orientation: "horizontal",
  },
};

export const 水平レイアウト中間ステップがアクティブ: Story = {
  name: "水平レイアウト：中間ステップがアクティブ",
  args: {
    steps: threeSteps,
    activeStep: 1,
    orientation: "horizontal",
  },
};

export const 水平レイアウト全ステップ完了: Story = {
  name: "水平レイアウト：全ステップ完了",
  args: {
    steps: threeSteps,
    activeStep: 3,
    orientation: "horizontal",
  },
};

export const 垂直レイアウト最初のステップがアクティブ: Story = {
  name: "垂直レイアウト：最初のステップがアクティブ",
  args: {
    steps: threeSteps,
    activeStep: 0,
    orientation: "vertical",
  },
};

export const 垂直レイアウト中間ステップがアクティブ: Story = {
  name: "垂直レイアウト：中間ステップがアクティブ",
  args: {
    steps: threeSteps,
    activeStep: 1,
    orientation: "vertical",
  },
};

export const 垂直レイアウト全ステップ完了: Story = {
  name: "垂直レイアウト：全ステップ完了",
  args: {
    steps: threeSteps,
    activeStep: 3,
    orientation: "vertical",
  },
};

export const 任意ステップあり: Story = {
  name: "任意のステップが含まれる場合",
  args: {
    steps: stepsWithOptional,
    activeStep: 1,
    orientation: "horizontal",
  },
};

export const ステップ数が多い場合: Story = {
  name: "ステップ数が多い場合（5ステップ）",
  args: {
    steps: fiveSteps,
    activeStep: 2,
    orientation: "horizontal",
  },
};

export const ラベルが長い場合: Story = {
  name: "ラベルのテキストが長い場合",
  args: {
    steps: longLabelSteps,
    activeStep: 1,
    orientation: "horizontal",
  },
};

export default {
  component: Stepper,
  args: {
    steps: threeSteps,
    activeStep: 0,
  },
} satisfies Meta<T>;
