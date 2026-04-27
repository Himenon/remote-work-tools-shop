import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import type { ComponentPropsWithoutRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    await userEvent.click(input);
    await userEvent.clear(input);
    await userEvent.tab();
    await expect(input).toBeInTheDocument();
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
