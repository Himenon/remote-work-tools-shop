import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import type { ComponentPropsWithoutRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { MultiSelectField } from "./MultiSelectField";

type T = typeof MultiSelectField;
type Story = StoryObj<T>;

const options: ComponentPropsWithoutRef<T>["options"] = [
  { value: "wifi", label: "Wi-Fi" },
  { value: "bluetooth", label: "Bluetooth" },
  { value: "nfc", label: "NFC" },
];

const args: ComponentPropsWithoutRef<T> = {
  name: "features",
  label: "搭載機能を選択してください",
  options,
};

export const Default: Story = {};

export const WithDefaultValues: Story = {
  decorators: [
    (Story) => {
      const methods = useForm({ defaultValues: { features: ["wifi", "bluetooth"] } });
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

export const ShowsAllOptions: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Wi-Fi")).toBeInTheDocument();
    await expect(canvas.getByText("Bluetooth")).toBeInTheDocument();
    await expect(canvas.getByText("NFC")).toBeInTheDocument();
  },
};

export default {
  component: (props) => {
    const methods = useForm({ defaultValues: { [args.name]: [] } });
    return (
      <FormProvider {...methods}>
        <MultiSelectField {...props} />
      </FormProvider>
    );
  },
  args,
} satisfies Meta<T>;
