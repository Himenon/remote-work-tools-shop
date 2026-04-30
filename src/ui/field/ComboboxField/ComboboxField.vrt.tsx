import { composeStories } from "@storybook/react";
import { describe, expect, it } from "vitest";
import * as Stories from "./ComboboxField.stories";

const { Default, WithDefaultValue, Disabled, ShowsErrorMessage, OpensDropdown, FiltersByInput } = composeStories(Stories);

describe("ComboboxField のビジュアルスナップショット", () => {
  it("入力欄が空の初期状態", async () => {
    await Default.run();
    await expect.element(document.body).toMatchScreenshot("default");
  });

  it("デフォルト値が選択済みの状態", async () => {
    await WithDefaultValue.run();
    await expect.element(document.body).toMatchScreenshot("with-default-value");
  });

  it("入力欄が操作できない状態", async () => {
    await Disabled.run();
    await expect.element(document.body).toMatchScreenshot("disabled");
  });

  it("バリデーションエラーが表示された状態", async () => {
    await ShowsErrorMessage.run();
    await expect.element(document.body).toMatchScreenshot("shows-error-message");
  });

  it("ドロップダウンが開いた状態", async () => {
    await OpensDropdown.run();
    await expect.element(document.body).toMatchScreenshot("opens-dropdown");
  });

  it("入力テキストで絞り込みされた状態", async () => {
    await FiltersByInput.run();
    await expect.element(document.body).toMatchScreenshot("filters-by-input");
  });
});
