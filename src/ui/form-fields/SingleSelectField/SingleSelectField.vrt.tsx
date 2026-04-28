import { composeStories } from "@storybook/react";
import { describe, expect, it } from "vitest";
import * as Stories from "./SingleSelectField.stories";

const { Default, WithDefaultValue, Disabled, OpensDropdown } = composeStories(Stories);

describe("SingleSelectField のビジュアルスナップショット", () => {
  it("単一選択フィールドが何も選択されていない初期状態", async () => {
    await Default.run();
    await expect.element(document.body).toMatchScreenshot("default");
  });

  it("デフォルト値が選択済みの状態", async () => {
    await WithDefaultValue.run();
    await expect.element(document.body).toMatchScreenshot("with-default-value");
  });

  it("トリガーボタンが操作できない状態", async () => {
    await Disabled.run();
    await expect.element(document.body).toMatchScreenshot("disabled");
  });

  it("ドロップダウンが開いた状態", async () => {
    await OpensDropdown.run();
    await expect.element(document.body).toMatchScreenshot("opens-dropdown");
  });
});
