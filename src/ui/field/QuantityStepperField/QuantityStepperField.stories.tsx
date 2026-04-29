import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import type { ComponentPropsWithoutRef } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { SetFormErrorOnMount } from "#test-helper/storybook";
import { QuantityStepperField } from "./QuantityStepperField";

type T = typeof QuantityStepperField;
type Story = StoryObj<T>;

const args: ComponentPropsWithoutRef<T> = {
  name: "numOfInstances",
  label: "インスタンス数",
  min: 1,
  max: 64,
};

export const Default: Story = {};

export const WithValue: Story = {
  decorators: [
    (Story) => {
      const methods = useForm({ defaultValues: { numOfInstances: 5 } });
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
    const methods = useForm({ defaultValues: { numOfInstances: null } });
    return (
      <FormProvider {...methods}>
        <SetFormErrorOnMount name="numOfInstances" message="インスタンス数を入力してください">
          <QuantityStepperField {...props} />
        </SetFormErrorOnMount>
      </FormProvider>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText("インスタンス数を入力してください")).toBeInTheDocument();
  },
};

export default {
  component: (props) => {
    const methods = useForm({ defaultValues: { [args.name]: null } });
    return (
      <FormProvider {...methods}>
        <QuantityStepperField {...props} />
      </FormProvider>
    );
  },
  args,
} satisfies Meta<T>;
