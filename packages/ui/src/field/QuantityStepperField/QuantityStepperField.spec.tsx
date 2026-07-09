import { composeStories } from "@storybook/react";
import { render } from "@testing-library/react";
import * as React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { afterEach, beforeEach, describe, it, vi } from "vitest";
import { expect, within } from "storybook/test";

import * as Stories from "./QuantityStepperField.stories";
import { QuantityStepperField } from "./QuantityStepperField";

const { Default, Disabled } = composeStories(Stories);

const renderWithValue = (value: unknown): void => {
  const Wrapper: React.FC = () => {
    const methods = useForm({ defaultValues: { numOfInstances: value } });
    return (
      <FormProvider {...methods}>
        <QuantityStepperField name="numOfInstances" label="インスタンス数" />
      </FormProvider>
    );
  };
  render(<Wrapper />);
};

describe("QuantityStepperField の入力値検証", () => {
  // console.error を抑制: React が描画エラーをコンソールに出力するが、テスト結果には影響しない
  beforeEach((): void => {
    vi.spyOn(console, "error").mockImplementation((): void => {
      // suppress
    });
  });
  afterEach((): void => {
    vi.restoreAllMocks();
  });

  it("文字列を渡したとき、number | null ではないため型不一致エラーが発生する", async () => {
    await expect(() => {
      renderWithValue("3");
    }).toThrow("QuantityStepperField: field.value が number | null 形式ではありません");
  });

  it("オブジェクトを渡したとき、number | null ではないため型不一致エラーが発生する", async () => {
    await expect(() => {
      renderWithValue({ value: 3 });
    }).toThrow("QuantityStepperField: field.value が number | null 形式ではありません");
  });

  it("配列を渡したとき、number | null ではないため型不一致エラーが発生する", async () => {
    await expect(() => {
      renderWithValue([3]);
    }).toThrow("QuantityStepperField: field.value が number | null 形式ではありません");
  });
});

describe("QuantityStepperField の表示確認", () => {
  it("ラベルが画面に表示される", async () => {
    await Default.run();
    const canvas = within(document.body);
    await expect(canvas.getByText("インスタンス数")).toBeInTheDocument();
  });

  it("数量を増やすボタンが画面に表示される", async () => {
    await Default.run();
    const canvas = within(document.body);
    await expect(canvas.getByRole("button", { name: "数量を増やす" })).toBeInTheDocument();
  });

  it("数量を減らすボタンが画面に表示される", async () => {
    await Default.run();
    const canvas = within(document.body);
    await expect(canvas.getByRole("button", { name: "数量を減らす" })).toBeInTheDocument();
  });

  it("disabled が指定されているとき、ボタンが操作できない状態で表示される", async () => {
    await Disabled.run();
    const canvas = within(document.body);
    const buttons: HTMLElement[] = canvas.getAllByRole("button");
    await Promise.all(buttons.map((button: HTMLElement) => expect(button).toBeDisabled()));
  });
});
