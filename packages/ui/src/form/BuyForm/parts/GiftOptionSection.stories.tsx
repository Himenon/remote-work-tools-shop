import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within, userEvent } from "storybook/test";
import { FormProvider, useForm } from "react-hook-form";
import { DEFAULT_WRAPPING, DEFAULT_COUNT, type BuyFormInput } from "@rwts/contract/form/BuyFormSchema";
import { GiftOptionSection } from "./GiftOptionSection";

type T = typeof GiftOptionSection;
type Story = StoryObj<T>;

const defaultFormValues: BuyFormInput = {
  specs: {},
  giftEnabled: false,
  wrapping: DEFAULT_WRAPPING,
  message: "",
  count: DEFAULT_COUNT,
};

const enabledFormValues: BuyFormInput = {
  ...defaultFormValues,
  giftEnabled: true,
};

const GiftOptionSectionDefault: React.FC = () => {
  const methods = useForm<BuyFormInput>({ defaultValues: defaultFormValues });
  return (
    <FormProvider {...methods}>
      <GiftOptionSection />
    </FormProvider>
  );
};

const GiftOptionSectionEnabled: React.FC = () => {
  const methods = useForm<BuyFormInput>({ defaultValues: enabledFormValues });
  return (
    <FormProvider {...methods}>
      <GiftOptionSection />
    </FormProvider>
  );
};

export const Default: Story = {
  name: "初期状態（ギフト設定なし）",
  render: () => <GiftOptionSectionDefault />,
};

export const GiftEnabled: Story = {
  name: "ギフト設定を有効にした状態（ラッピング・メッセージ欄表示）",
  render: () => <GiftOptionSectionEnabled />,
};

/** チェックボックスをクリックするとギフト関連フィールドが表示される */
export const ToggleGiftOption: Story = {
  name: "チェックボックスをオンにするとギフト設定欄が展開される",
  render: () => <GiftOptionSectionDefault />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("checkbox", { name: "ギフト包装を利用する" }));
    await expect(canvas.getByText("ラッピングの種類")).toBeInTheDocument();
    await expect(canvas.getByText("ギフトメッセージ")).toBeInTheDocument();
  },
};

/** チェックボックスをオフに戻すとギフト関連フィールドが非表示になる */
export const DisableGiftOption: Story = {
  name: "チェックボックスをオフにするとギフト設定欄が閉じる",
  render: () => <GiftOptionSectionEnabled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("checkbox", { name: "ギフト包装を利用する" }));
    await expect(canvas.queryByText("ラッピングの種類")).not.toBeInTheDocument();
  },
};

export default {
  component: GiftOptionSection,
} satisfies Meta<T>;
