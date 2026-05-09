import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { FormProvider, useForm } from "react-hook-form";
import type { ComponentPropsWithoutRef } from "react";
import { DEFAULT_WRAPPING, DEFAULT_COUNT, type BuyFormInput } from "@rwts/contract/form/BuyFormSchema";
import { MOCK_BUY_FORM_PRODUCTS } from "@rwts/test-helper/mock/products";
import { SpecsSection } from "./SpecsSection";

type T = typeof SpecsSection;
type Story = StoryObj<T>;

const laptopProduct = MOCK_BUY_FORM_PRODUCTS[0];
const micProduct = MOCK_BUY_FORM_PRODUCTS[3];

const defaultArgs: ComponentPropsWithoutRef<T> = {
  specSortKeys: laptopProduct.specSortKeys,
  categories: laptopProduct.categories,
};

export const Laptop: Story = {
  name: "ノートPC（MacBook Pro）のスペック選択",
};

/** Blue Yeti Pro は「指向性パターン」が選択不可の表示のみ */
export const Microphone: Story = {
  name: "マイク（指向性パターンは参考表示のみ）",
  args: { specSortKeys: micProduct.specSortKeys, categories: micProduct.categories },
};

export const ShowsSpecHeading: Story = {
  name: "「スペックを選択」見出しが表示される",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("スペックを選択")).toBeInTheDocument();
  },
};

export const ShowsAllCategories: Story = {
  name: "全スペックカテゴリが表示される",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("CPU")).toBeInTheDocument();
    await expect(canvas.getByText("メモリ")).toBeInTheDocument();
    await expect(canvas.getByText("ストレージ")).toBeInTheDocument();
  },
};

export default {
  component: (props: ComponentPropsWithoutRef<T>) => {
    const methods = useForm<BuyFormInput>({
      defaultValues: {
        specs: {},
        giftEnabled: false,
        wrapping: DEFAULT_WRAPPING,
        message: "",
        count: DEFAULT_COUNT,
      },
    });
    return (
      <FormProvider {...methods}>
        <SpecsSection {...props} />
      </FormProvider>
    );
  },
  args: defaultArgs,
} satisfies Meta<T>;
