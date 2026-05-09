import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import type { ComponentPropsWithoutRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { SetFormErrorOnMount } from "@rwts/test-helper/storybook";
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

// decorators ではなく render を使う理由:
// decorators で FormProvider を巻くと、default export の component も FormProvider を生成するため
// 二重ネストになり、内側（component 側）の defaultValues: null が useController に渡って上書きされる。
export const WithDefaultValue: Story = {
  render: (props) => {
    const methods = useForm({ defaultValues: { region: "eu-west-1" } });
    return (
      <FormProvider {...methods}>
        <ComboboxField {...props} />
      </FormProvider>
    );
  },
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
    // Combobox.Trigger の aria-label は Field.Root の labelId で上書きされるため getByRole({ name: "開く" }) は使えない。
    const trigger = canvas.getByTestId("combobox-trigger");
    await userEvent.click(trigger);
    // ドロップダウンは portal 経由で document.body 直下に描画されるため within(document.body) で検索する。
    // click 後の DOM 反映を待つため findByText（非同期）を使う。
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
