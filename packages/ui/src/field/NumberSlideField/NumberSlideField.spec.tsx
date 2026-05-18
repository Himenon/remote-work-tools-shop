import { composeStories } from "@storybook/react";
import { render } from "@testing-library/react";
import * as React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { afterEach, beforeEach, describe, it, vi } from "vitest";
import { expect, within } from "storybook/test";

import * as Stories from "./NumberSlideField.stories";
import { NumberSlideField } from "./NumberSlideField";

const { Default, Disabled } = composeStories(Stories);

describe("NumberSlideField の入力値検証", () => {
  // console.error を抑制: React が描画エラーをコンソールに出力するが、テスト結果には影響しない
  beforeEach((): void => {
    vi.spyOn(console, "error").mockImplementation((): void => {
      // suppress
    });
  });
  afterEach((): void => {
    vi.restoreAllMocks();
  });

  const renderWithValue = (value: unknown): void => {
    const Wrapper: React.FC = () => {
      const methods = useForm({ defaultValues: { scalingThreshold: value } });
      return (
        <FormProvider {...methods}>
          <NumberSlideField name="scalingThreshold" label="スケーリング閾値" />
        </FormProvider>
      );
    };
    render(<Wrapper />);
  };

  it("null を渡したとき、オブジェクトではないためオブジェクト型要求エラーが発生する", async () => {
    await expect(() => {
      renderWithValue(null);
    }).toThrow("NumberSlideField: field.value はオブジェクトである必要がありますが");
  });

  it("文字列を渡したとき、オブジェクトではないためオブジェクト型要求エラーが発生する", async () => {
    await expect(() => {
      renderWithValue("0.5");
    }).toThrow("NumberSlideField: field.value はオブジェクトである必要がありますが");
  });

  it("配列を渡したとき、min キーが存在しないため min キー欠落エラーが発生する", async () => {
    await expect(() => {
      renderWithValue([0.2, 0.8]);
    }).toThrow("NumberSlideField: field.value に min キーがありません");
  });

  it("max キーを持たないオブジェクトを渡したとき、max キーが存在しないため max キー欠落エラーが発生する", async () => {
    await expect(() => {
      renderWithValue({ min: 0.2 });
    }).toThrow("NumberSlideField: field.value に max キーがありません");
  });

  it("min が文字列のオブジェクトを渡したとき、min が number ではないため型不一致エラーが発生する", async () => {
    await expect(() => {
      renderWithValue({ min: "0.2", max: 0.8 });
    }).toThrow("NumberSlideField: field.value.min は number である必要がありますが");
  });

  it("max が文字列のオブジェクトを渡したとき、max が number ではないため型不一致エラーが発生する", async () => {
    await expect(() => {
      renderWithValue({ min: 0.2, max: "0.8" });
    }).toThrow("NumberSlideField: field.value.max は number である必要がありますが");
  });
});

describe("NumberSlideField の表示確認", () => {
  it("ラベルが画面に表示される", async () => {
    await Default.run();
    const canvas = within(document.body);
    await expect(canvas.getByText("スケーリング閾値")).toBeInTheDocument();
  });

  it("スライダーが2つ画面に表示される", async () => {
    await Default.run();
    const canvas = within(document.body);
    const sliders: HTMLElement[] = canvas.getAllByRole("slider");
    await expect(sliders).toHaveLength(2);
  });

  it("disabled が指定されているとき、スライダーが操作できない状態で表示される", async () => {
    await Disabled.run();
    const canvas = within(document.body);
    const sliders: HTMLElement[] = canvas.getAllByRole("slider");
    await Promise.all(sliders.map((slider: HTMLElement) => expect(slider).toBeDisabled()));
  });
});
