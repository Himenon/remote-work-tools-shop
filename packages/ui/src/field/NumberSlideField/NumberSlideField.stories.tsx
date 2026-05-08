import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import type { ComponentPropsWithoutRef } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { SetFormErrorOnMount } from "@rwts/test-helper/storybook";
import { NumberSlideField } from "./NumberSlideField";

type T = typeof NumberSlideField;
type Story = StoryObj<T>;

const args: ComponentPropsWithoutRef<T> = {
  name: "scalingThreshold",
  label: "スケーリング閾値",
  format: { style: "percent", minimumFractionDigits: 0, maximumFractionDigits: 0 },
};

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const ShowsErrorMessage: Story = {
  render: (props) => {
    const methods = useForm({ defaultValues: { scalingThreshold: { min: 0.2, max: 0.8 } } });
    return (
      <FormProvider {...methods}>
        <SetFormErrorOnMount name="scalingThreshold" message="スケーリング閾値を設定してください">
          <NumberSlideField {...props} />
        </SetFormErrorOnMount>
      </FormProvider>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText("スケーリング閾値を設定してください")).toBeInTheDocument();
  },
};

export const ShowsLabel: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("スケーリング閾値")).toBeInTheDocument();
  },
};

export default {
  component: (props) => {
    const methods = useForm({ defaultValues: { [args.name]: { min: 0.2, max: 0.8 } } });
    return (
      <FormProvider {...methods}>
        <NumberSlideField {...props} />
      </FormProvider>
    );
  },
  args,
} satisfies Meta<T>;
