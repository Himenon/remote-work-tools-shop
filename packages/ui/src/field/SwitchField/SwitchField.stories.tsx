import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import type { ComponentPropsWithoutRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { SetFormErrorOnMount } from "@rwts/test-helper/storybook";
import { SwitchField } from "./SwitchField";

type T = typeof SwitchField;
type Story = StoryObj<T>;

const args: ComponentPropsWithoutRef<T> = {
  name: "notifications",
  label: "通知を有効にする",
};

export const Default: Story = {};

export const On: Story = {
  decorators: [
    (Story) => {
      const methods = useForm({ defaultValues: { notifications: true } });
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
    const methods = useForm({ defaultValues: { notifications: false } });
    return (
      <FormProvider {...methods}>
        <SetFormErrorOnMount name="notifications" message="通知設定を有効にしてください">
          <SwitchField {...props} />
        </SetFormErrorOnMount>
      </FormProvider>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText("通知設定を有効にしてください")).toBeInTheDocument();
  },
};

export const ShowsLabel: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("通知を有効にする")).toBeInTheDocument();
  },
};

export default {
  component: (props) => {
    const methods = useForm({ defaultValues: { [args.name]: false } });
    return (
      <FormProvider {...methods}>
        <SwitchField {...props} />
      </FormProvider>
    );
  },
  args,
} satisfies Meta<T>;
