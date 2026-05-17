import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import type { ComponentPropsWithoutRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { SetFormErrorOnMount } from "@rwts/test-helper/storybook";
import { AssignField, type AssignOption } from "./AssignField";

type T = typeof AssignField;
type Story = StoryObj<T>;

const personOptions: AssignOption[] = [
  { valueId: "user-1", label: "田中 太郎", iconType: "person" },
  { valueId: "user-2", label: "鈴木 花子", iconType: "person" },
  { valueId: "user-3", label: "佐藤 次郎", iconType: "person" },
];

const groupOptions: AssignOption[] = [
  { valueId: "group-1", label: "営業部", iconType: "group" },
  { valueId: "group-2", label: "開発部", iconType: "group" },
];

const allOptions: AssignOption[] = [...personOptions, ...groupOptions];

const args: ComponentPropsWithoutRef<T> = {
  name: "assignee",
  label: "担当者",
  options: allOptions,
  placeholder: "担当者を検索",
};

export const Default: Story = {};

export const MultipleMode: Story = {
  args: {
    multiple: true,
  },
};

export const WithDefaultValueSingle: Story = {
  render: (props) => {
    const methods = useForm({ defaultValues: { assignee: "user-1" } });
    return (
      <FormProvider {...methods}>
        <AssignField {...props} />
      </FormProvider>
    );
  },
};

export const WithDefaultValueMultiple: Story = {
  args: {
    multiple: true,
  },
  render: (props) => {
    const methods = useForm({
      defaultValues: { assignee: ["user-1", "group-1"] },
    });
    return (
      <FormProvider {...methods}>
        <AssignField {...props} />
      </FormProvider>
    );
  },
};

export const WithLockedSingle: Story = {
  args: {
    options: allOptions.map((o): AssignOption => Object.assign({}, o, { locked: o.valueId === "user-1" } as Pick<AssignOption, "locked">)),
  },
  render: (props) => {
    const methods = useForm({ defaultValues: { assignee: "user-1" } });
    return (
      <FormProvider {...methods}>
        <AssignField {...props} />
      </FormProvider>
    );
  },
};

export const WithLockedMultiple: Story = {
  args: {
    multiple: true,
    options: allOptions.map((o): AssignOption => Object.assign({}, o, { locked: o.valueId === "user-1" } as Pick<AssignOption, "locked">)),
  },
  render: (props) => {
    const methods = useForm({
      defaultValues: { assignee: ["user-1", "user-2"] },
    });
    return (
      <FormProvider {...methods}>
        <AssignField {...props} />
      </FormProvider>
    );
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledMultiple: Story = {
  args: {
    multiple: true,
    disabled: true,
  },
};

export const ShowsErrorMessage: Story = {
  render: (props) => {
    const methods = useForm({ defaultValues: { assignee: null } });
    return (
      <FormProvider {...methods}>
        <SetFormErrorOnMount name="assignee" message="担当者を選択してください">
          <AssignField {...props} />
        </SetFormErrorOnMount>
      </FormProvider>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText("担当者を選択してください")).toBeInTheDocument();
  },
};

export const OpensDropdownSingle: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByTestId("assign-single-trigger");
    await userEvent.click(trigger);
    const body = within(document.body);
    await expect(await body.findByText("田中 太郎")).toBeInTheDocument();
    await expect(await body.findByText("鈴木 花子")).toBeInTheDocument();
    await expect(await body.findByText("営業部")).toBeInTheDocument();
  },
};

export const FiltersByInputSingle: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox");
    await userEvent.type(input, "田中");
    const body = within(document.body);
    await expect(body.getByText("田中 太郎")).toBeInTheDocument();
    await expect(body.queryByText("鈴木 花子")).not.toBeInTheDocument();
  },
};

export const FiltersByInputMultiple: Story = {
  args: {
    multiple: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox");
    await userEvent.type(input, "開発");
    const body = within(document.body);
    await expect(body.getByText("開発部")).toBeInTheDocument();
    await expect(body.queryByText("営業部")).not.toBeInTheDocument();
  },
};

export default {
  component: (props) => {
    const methods = useForm({ defaultValues: { assignee: null } });
    return (
      <FormProvider {...methods}>
        <AssignField {...props} />
      </FormProvider>
    );
  },
  args,
} satisfies Meta<T>;
