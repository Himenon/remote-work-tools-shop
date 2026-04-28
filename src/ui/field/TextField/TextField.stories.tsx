import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import type { ComponentPropsWithoutRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { SetFormErrorOnMount } from "#test-helper/storybook";
import { TextField } from "./TextField";

type T = typeof TextField;
type Story = StoryObj<T>;

const args: ComponentPropsWithoutRef<T> = {
  name: "text",
  label: "テキストフィールド",
  placeholder: "入力してください",
};

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithValue: Story = {
  decorators: [
    (Story) => {
      const methods = useForm({ defaultValues: { text: "初期値テキスト" } });
      return (
        <FormProvider {...methods}>
          <Story />
        </FormProvider>
      );
    },
  ],
};

export const ShowsErrorMessage: Story = {
  render: (props) => {
    const methods = useForm({ defaultValues: { text: "" } });
    return (
      <FormProvider {...methods}>
        <SetFormErrorOnMount name="text" message="テキストを入力してください">
          <TextField {...props} />
        </SetFormErrorOnMount>
      </FormProvider>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText("テキストを入力してください")).toBeInTheDocument();
  },
};

export default {
  component: (props) => {
    const methods = useForm({ defaultValues: { [args.name]: "" } });
    return (
      <FormProvider {...methods}>
        <TextField {...props} />
      </FormProvider>
    );
  },
  args,
} satisfies Meta<T>;
