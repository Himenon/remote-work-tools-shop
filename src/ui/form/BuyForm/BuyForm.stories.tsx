import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn, expect, within, userEvent } from "storybook/test";
import type { BuyFormProduct } from "#ui/form/BuyForm";
import { MOCK_BUY_FORM_PRODUCTS } from "#test-helper/mock/products";
import { BuyForm } from "./BuyForm";

type T = typeof BuyForm;
type Story = StoryObj<T>;

const laptopProduct: BuyFormProduct = MOCK_BUY_FORM_PRODUCTS[0];
const phoneProduct: BuyFormProduct = MOCK_BUY_FORM_PRODUCTS[1];
const deskProduct: BuyFormProduct = MOCK_BUY_FORM_PRODUCTS[2];
const micProduct: BuyFormProduct = MOCK_BUY_FORM_PRODUCTS[3];

export const Laptop: Story = {
  name: "ノートPC（MacBook Pro 16インチ）の購入フォーム",
};

export const Smartphone: Story = {
  name: "スマートフォン（iPhone 15 Pro）の購入フォーム",
  args: { product: phoneProduct },
};

export const Desk: Story = {
  name: "デスク（Standing Desk Pro）の購入フォーム",
  args: { product: deskProduct },
};

export const Microphone: Story = {
  name: "マイク（Blue Yeti Pro）の購入フォーム",
  args: { product: micProduct },
};

/** 個数フィールドを空にして送信ボタンを押したときのバリデーションエラー */
export const ValidationErrorCountEmpty: Story = {
  name: "バリデーションエラー（個数フィールドを空にして送信）",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const countInput = canvas.getByRole("textbox", { name: "個数" });
    await userEvent.tripleClick(countInput);
    await userEvent.keyboard("{Backspace}");
    await userEvent.tab();
    await userEvent.click(canvas.getByRole("button", { name: "バッグへ追加" }));
    await expect(await canvas.findByText("個数を入力してください")).toBeInTheDocument();
  },
};

/** ギフト設定のチェックボックスをオンにするとラッピング・メッセージ欄が表示される */
export const GiftOptionEnabled: Story = {
  name: "ギフト設定を有効にするとラッピング・メッセージ欄が表示される",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("checkbox", { name: "ギフト包装を利用する" }));
    await expect(canvas.getByText("ラッピングの種類")).toBeInTheDocument();
    await expect(canvas.getByText("ギフトメッセージ")).toBeInTheDocument();
  },
};

/** 必須項目がすべて入力済みの状態で送信すると onSubmit が呼ばれる */
export const SubmitCallsOnSubmit: Story = {
  name: "送信ボタンを押すと onSubmit が呼ばれる",
  play: async ({ canvasElement, args: storyArgs }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "バッグへ追加" }));
    await expect(storyArgs.onSubmit).toHaveBeenCalled();
  },
};

export default {
  component: BuyForm,
  args: {
    onSubmit: fn(),
    product: laptopProduct,
  },
} satisfies Meta<T>;
