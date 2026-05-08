import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { FormProvider, useForm } from "react-hook-form";
import type { ComponentPropsWithoutRef } from "react";
import { DEFAULT_WRAPPING, DEFAULT_COUNT, type BuyFormInput } from "#schema/form/BuyFormSchema";
import type { ProductSpec } from "./types";
import { MOCK_PRODUCT_SPECS } from "#test-helper/mock/products";
import { PriceSummarySection } from "./PriceSummarySection";

type T = typeof PriceSummarySection;
type Story = StoryObj<T>;

const laptopSpec: ProductSpec = MOCK_PRODUCT_SPECS[0];

const defaultArgs: ComponentPropsWithoutRef<T> = {
  spec: laptopSpec,
};

const baseSpecs: BuyFormInput["specs"] = {
  cpu: ["Apple M4 Pro（12コア）"],
  memory: ["24GB ユニファイドメモリ"],
  storage: ["512GB SSD"],
};

const upgradedSpecs: BuyFormInput["specs"] = {
  cpu: ["Apple M4 Max（16コア）"],
  memory: ["48GB ユニファイドメモリ"],
  storage: ["2TB SSD"],
};

export const BasePrice: Story = {
  name: "基本価格の合計金額（追加オプションなし・1個）",
};

/** M4 Max + 48GB + 2TB を選んだときに追加費用 +¥170,000 が反映される */
export const WithUpgradedSpecs: Story = {
  name: "全オプションをアップグレードした合計金額",
  render: (props: ComponentPropsWithoutRef<T>) => {
    const methods = useForm<BuyFormInput>({
      defaultValues: { specs: upgradedSpecs, giftEnabled: false, wrapping: DEFAULT_WRAPPING, message: "", count: DEFAULT_COUNT },
    });
    return (
      <FormProvider {...methods}>
        <PriceSummarySection {...props} />
      </FormProvider>
    );
  },
};

/** 3個購入時に単価 × 3 が表示される */
export const MultipleItems: Story = {
  name: "3個購入したときの合計金額（単価 × 3）",
  render: (props: ComponentPropsWithoutRef<T>) => {
    const methods = useForm<BuyFormInput>({
      defaultValues: { specs: baseSpecs, giftEnabled: false, wrapping: DEFAULT_WRAPPING, message: "", count: 3 },
    });
    return (
      <FormProvider {...methods}>
        <PriceSummarySection {...props} />
      </FormProvider>
    );
  },
};

export const ShowsPriceLabel: Story = {
  name: "「合計金額（税込）」ラベルが表示される",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("合計金額（税込）")).toBeInTheDocument();
  },
};

export default {
  component: (props: ComponentPropsWithoutRef<T>) => {
    const methods = useForm<BuyFormInput>({
      defaultValues: { specs: baseSpecs, giftEnabled: false, wrapping: DEFAULT_WRAPPING, message: "", count: DEFAULT_COUNT },
    });
    return (
      <FormProvider {...methods}>
        <PriceSummarySection {...props} />
      </FormProvider>
    );
  },
  args: defaultArgs,
} satisfies Meta<T>;
