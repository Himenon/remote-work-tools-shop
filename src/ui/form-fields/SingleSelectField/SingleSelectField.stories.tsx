import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import type { ComponentPropsWithoutRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { SetFormErrorOnMount } from "../_test-helpers";
import { SingleSelectField } from "./SingleSelectField";

type T = typeof SingleSelectField;
type Story = StoryObj<T>;

const options: ComponentPropsWithoutRef<T>["options"] = [
  { value: "8gb", label: "メモリ 8GB" },
  { value: "16gb", label: "メモリ 16GB" },
  { value: "32gb", label: "メモリ 32GB" },
];

const args: ComponentPropsWithoutRef<T> = {
  name: "memory",
  label: "メモリ容量",
  options,
  placeholder: "選択してください",
};

export const Default: Story = {};

export const WithDefaultValue: Story = {
  decorators: [
    (Story) => {
      const methods = useForm({ defaultValues: { memory: "16gb" } });
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
    const methods = useForm({ defaultValues: { memory: null } });
    return (
      <FormProvider {...methods}>
        <SetFormErrorOnMount name="memory" message="メモリ容量を選択してください">
          <SingleSelectField {...props} />
        </SetFormErrorOnMount>
      </FormProvider>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText("メモリ容量を選択してください")).toBeInTheDocument();
  },
};

export const OpensDropdown: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("combobox");
    await userEvent.click(trigger);
    // Base UI の Select はドロップダウンを portal でレンダリングするため document.body で検索する
    const body = within(document.body);
    await expect(body.getByText("メモリ 8GB")).toBeInTheDocument();
    await expect(body.getByText("メモリ 16GB")).toBeInTheDocument();
    await expect(body.getByText("メモリ 32GB")).toBeInTheDocument();
  },
};

export default {
  component: (props) => {
    const methods = useForm({ defaultValues: { [args.name]: null } });
    return (
      <FormProvider {...methods}>
        <SingleSelectField {...props} />
      </FormProvider>
    );
  },
  args,
} satisfies Meta<T>;
