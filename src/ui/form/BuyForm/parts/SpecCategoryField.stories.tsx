import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn, expect, within, userEvent } from "storybook/test";
import type { ComponentPropsWithoutRef } from "react";
import { SpecCategoryField, type SpecCategory } from "./SpecCategoryField";

type T = typeof SpecCategoryField;
type Story = StoryObj<T>;

const radioCategory: SpecCategory = {
  name: "CPU",
  view: "radio",
  specs: [
    { name: "Apple M4 Pro（12コア）", cost: 0 },
    { name: "Apple M4 Max（16コア）", cost: 60_000 },
  ],
};

const singleSelectCategory: SpecCategory = {
  name: "天板サイズ",
  view: "single-select",
  specs: [
    { name: "120cm × 60cm", cost: 0 },
    { name: "140cm × 70cm", cost: 20_000 },
    { name: "160cm × 80cm", cost: 40_000 },
  ],
};

const multiSelectCategory: SpecCategory = {
  name: "許可するプロトコル",
  view: "multi-select",
  specs: [
    { name: "TCP", cost: 0 },
    { name: "UDP", cost: 0 },
    { name: "HTTP", cost: 0 },
  ],
};

const indicatorCategory: SpecCategory = {
  name: "指向性パターン",
  view: "indicator",
  specs: [
    { name: "単一指向性", cost: 0 },
    { name: "全指向性", cost: 0 },
    { name: "双指向性", cost: 0 },
    { name: "ステレオ", cost: 0 },
  ],
};

const args: ComponentPropsWithoutRef<T> = {
  categoryKey: "cpu",
  category: radioCategory,
  selectedValues: ["Apple M4 Pro（12コア）"],
  onChange: fn(),
};

export const Radio: Story = {
  name: "ラジオボタン形式（追加費用あり）",
};

export const SingleSelect: Story = {
  name: "プルダウン形式",
  args: {
    categoryKey: "size",
    category: singleSelectCategory,
    selectedValues: ["120cm × 60cm"],
  },
};

export const MultiSelect: Story = {
  name: "複数選択形式（未選択）",
  args: {
    categoryKey: "protocol",
    category: multiSelectCategory,
    selectedValues: [],
  },
};

export const MultiSelectWithSelection: Story = {
  name: "複数選択形式（一部選択済み）",
  args: {
    categoryKey: "protocol",
    category: multiSelectCategory,
    selectedValues: ["TCP", "HTTP"],
  },
};

export const Indicator: Story = {
  name: "参考情報のみ（選択操作なし）",
  args: {
    categoryKey: "polarPattern",
    category: indicatorCategory,
    selectedValues: [],
  },
};

/** ラジオボタンを別の選択肢に切り替えると onChange が呼ばれる */
export const RadioChangeTriggered: Story = {
  name: "選択肢を変更すると onChange が呼ばれる",
  play: async ({ canvasElement, args: storyArgs }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("radio", { name: /Apple M4 Max（16コア）/ }));
    await expect(storyArgs.onChange).toHaveBeenCalledWith("cpu", ["Apple M4 Max（16コア）"]);
  },
};

export default {
  component: SpecCategoryField,
  args,
} satisfies Meta<T>;
