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

  // Base UI は controlled value（選択アイテム）を入力欄の表示テキストに自動反映しないため、
  // コンポーネント側で inputValue を別途管理している。このテストでその初期表示を保証する。
  it("デフォルト値のラベルが入力欄に表示される", async () => {
    await WithDefaultValue.run();
    const canvas = within(document.body);
    const input = canvas.getByRole<HTMLInputElement>("combobox");
    await expect(input.value).toBe("EU (Ireland)");
  });

  it("disabled が指定されているとき、入力欄が操作できない状態で表示される", async () => {
    await Disabled.run();
    const canvas = within(document.body);
    await expect(canvas.getByRole("combobox")).toBeDisabled();
  });
});
