import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn, expect, within, userEvent } from "storybook/test";
import { CheckoutForm } from "./CheckoutForm";

type T = typeof CheckoutForm;
type Story = StoryObj<T>;

export const Default: Story = {
  name: "決済確定ボタン（購入商品あり）",
};

/** バッグが空のときに決済ボタンが押せない */
export const DisabledWhenBagEmpty: Story = {
  name: "バッグが空のとき決済ボタンが操作できない",
  args: { disabled: true },
};

/** 決済ボタンをクリックすると onConfirm が呼ばれる */
export const ConfirmCalled: Story = {
  name: "決済ボタンをクリックすると onConfirm が呼ばれる",
  play: async ({ canvasElement, args: storyArgs }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "決済を確定する" }));
    await expect(storyArgs.onConfirm).toHaveBeenCalled();
  },
};

export default {
  component: CheckoutForm,
  args: {
    onConfirm: fn(),
    disabled: false,
  },
} satisfies Meta<T>;
