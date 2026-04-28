import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import type { ComponentPropsWithoutRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { SetFormErrorOnMount } from "#test-helper/storybook";
import { RadioGroupField } from "./RadioGroupField";

type T = typeof RadioGroupField;
type Story = StoryObj<T>;

const options: ComponentPropsWithoutRef<T>["options"] = [
  { value: "light", label: "ライト" },
  { value: "standard", label: "スタンダード" },
  { value: "pro", label: "プロ" },
];

const args: ComponentPropsWithoutRef<T> = {
  name: "plan",
  label: "プランを選択してください",
  options,
};

export const Default: Story = {};

export const WithDefaultValue: Story = {
  decorators: [
    (Story) => {
      const methods = useForm({ defaultValues: { plan: "standard" } });
      return (
        <FormProvider {...methods}>
          <Story />
        </FormProvider>
      );
    },
  ],
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const ShowsErrorMessage: Story = {
  render: (props) => {
    const methods = useForm({ defaultValues: { plan: "" } });
    return (
      <FormProvider {...methods}>
        <SetFormErrorOnMount name="plan" message="プランの選択は必須です">
          <RadioGroupField {...props} />
        </SetFormErrorOnMount>
      </FormProvider>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText("プランの選択は必須です")).toBeInTheDocument();
  },
};

export const ShowsAllOptions: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("ライト")).toBeInTheDocument();
    await expect(canvas.getByText("スタンダード")).toBeInTheDocument();
    await expect(canvas.getByText("プロ")).toBeInTheDocument();
  },
};

export default {
  component: (props) => {
    const methods = useForm({ defaultValues: { [args.name]: "" } });
    return (
      <FormProvider {...methods}>
        <RadioGroupField {...props} />
      </FormProvider>
    );
  },
  args,
} satisfies Meta<T>;
