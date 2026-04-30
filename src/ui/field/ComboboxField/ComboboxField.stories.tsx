import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import type { ComponentPropsWithoutRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { SetFormErrorOnMount } from "#test-helper/storybook";
import { ComboboxField } from "./ComboboxField";

type T = typeof ComboboxField;
type Story = StoryObj<T>;

const options: ComponentPropsWithoutRef<T>["options"] = [
  { value: "us-east-1", label: "US East (N. Virginia)" },
  { value: "us-west-2", label: "US West (Oregon)" },
  { value: "eu-west-1", label: "EU (Ireland)" },
  { value: "ap-northeast-1", label: "Asia Pacific (Tokyo)" },
];

const args: ComponentPropsWithoutRef<T> = {
  name: "region",
  label: "リージョン",
  options,
  placeholder: "リージョンを選択または入力",
};

export const Default: Story = {};

export const WithDefaultValue: Story = {
  decorators: [
    (Story) => {
      const methods = useForm({ defaultValues: { region: "eu-west-1" } });
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
    const methods = useForm({ defaultValues: { region: null } });
    return (
      <FormProvider {...methods}>
        <SetFormErrorOnMount name="region" message="リージョンを選択してください">
          <ComboboxField {...props} />
        </SetFormErrorOnMount>
      </FormProvider>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText("リージョンを選択してください")).toBeInTheDocument();
  },
};

export const OpensDropdown: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByTestId("combobox-trigger");
    await userEvent.click(trigger);
    const body = within(document.body);
    await expect(await body.findByText("US East (N. Virginia)")).toBeInTheDocument();
    await expect(await body.findByText("US West (Oregon)")).toBeInTheDocument();
    await expect(await body.findByText("EU (Ireland)")).toBeInTheDocument();
    await expect(await body.findByText("Asia Pacific (Tokyo)")).toBeInTheDocument();
  },
};

export const FiltersByInput: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox");
    await userEvent.type(input, "EU");
    const body = within(document.body);
    await expect(body.getByText("EU (Ireland)")).toBeInTheDocument();
    await expect(body.queryByText("US East (N. Virginia)")).not.toBeInTheDocument();
  },
};

export default {
  component: (props) => {
    const methods = useForm({ defaultValues: { [args.name]: null } });
    return (
      <FormProvider {...methods}>
        <ComboboxField {...props} />
      </FormProvider>
    );
  },
  args,
} satisfies Meta<T>;
