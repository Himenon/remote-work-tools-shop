import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import type { ComponentPropsWithoutRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { SetFormErrorOnMount } from "#test-helper/storybook";
import { CheckboxField } from "./CheckboxField";

type T = typeof CheckboxField;
type Story = StoryObj<T>;

const args: ComponentPropsWithoutRef<T> = {
  name: "agree",
  label: "利用規約に同意する",
};

export const Default: Story = {};

export const Checked: Story = {
  decorators: [
    (Story) => {
      const methods = useForm({ defaultValues: { agree: true } });
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
    const methods = useForm({ defaultValues: { agree: false } });
    return (
      <FormProvider {...methods}>
        <SetFormErrorOnMount name="agree" message="利用規約への同意は必須です">
          <CheckboxField {...props} />
        </SetFormErrorOnMount>
      </FormProvider>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText("利用規約への同意は必須です")).toBeInTheDocument();
  },
};

export const ShowsLabel: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("利用規約に同意する")).toBeInTheDocument();
  },
};

export default {
  component: (props) => {
    const methods = useForm({ defaultValues: { [args.name]: false } });
    return (
      <FormProvider {...methods}>
        <CheckboxField {...props} />
      </FormProvider>
    );
  },
  args,
} satisfies Meta<T>;
