import { Field } from "@base-ui/react/field";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ComponentPropsWithoutRef } from "react";

import { FieldLabel } from "./FieldLabel";

type T = typeof FieldLabel;
type Story = StoryObj<T>;

const args: ComponentPropsWithoutRef<T> = {
  children: "ラベルテキスト",
};

export const Default: Story = {
  decorators: [
    (Story) => (
      <Field.Root>
        <Story />
      </Field.Root>
    ),
  ],
};

export const Clickable: Story = {
  args: {
    clickable: true,
  },
  decorators: [
    (Story) => (
      <Field.Root>
        <Story />
      </Field.Root>
    ),
  ],
};

export const Disabled: Story = {
  decorators: [
    (Story) => (
      <Field.Root disabled>
        <Story />
      </Field.Root>
    ),
  ],
  // WCAG 2.1 は disabled UI コンポーネントをコントラスト要件から除外するが、
  // axe は data-disabled を native disabled と同視しないため color-contrast が誤検知する。
  // 実際の使用時は常に disabled な入力要素と組み合わせるため問題ない。
  parameters: {
    a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } },
  },
};

export const ClickableDisabled: Story = {
  name: "クリック可能・操作できない状態",
  args: {
    clickable: true,
  },
  decorators: [
    (Story) => (
      <Field.Root disabled>
        <Story />
      </Field.Root>
    ),
  ],
  parameters: {
    a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } },
  },
};

export default {
  component: FieldLabel,
  args,
} satisfies Meta<T>;
