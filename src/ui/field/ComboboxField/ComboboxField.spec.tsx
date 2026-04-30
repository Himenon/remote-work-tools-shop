import { composeStories } from "@storybook/react";
import { describe, it } from "vitest";
import { expect, within } from "storybook/test";
import * as Stories from "./ComboboxField.stories";

const { Default, Disabled, WithDefaultValue } = composeStories(Stories);

describe("ComboboxField の表示確認", () => {
  it("ラベルが画面に表示される", async () => {
    await Default.run();
    const canvas = within(document.body);
    await expect(canvas.getByText("リージョン")).toBeInTheDocument();
  });

  it("プレースホルダーが入力欄に表示される", async () => {
    await Default.run();
    const canvas = within(document.body);
    await expect(canvas.getByPlaceholderText("リージョンを選択または入力")).toBeInTheDocument();
  });

  it("デフォルト値のラベルが入力欄に表示される", async () => {
    await WithDefaultValue.run();
    const canvas = within(document.body);
    const input = canvas.getByRole("combobox") as HTMLInputElement;
    await expect(input.value).toBe("EU (Ireland)");
  });

  it("disabled が指定されているとき、入力欄が操作できない状態で表示される", async () => {
    await Disabled.run();
    const canvas = within(document.body);
    await expect(canvas.getByRole("combobox")).toBeDisabled();
  });
});
