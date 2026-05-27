import { composeStories } from "@storybook/react";
import { describe, expect, it } from "vitest";
import * as Stories from "./CheckboxField.stories";

const { Default, Checked, Disabled, ShowsLabel } = composeStories(Stories);

describe("CheckboxField のビジュアルスナップショット", () => {
  it("チェックボックスが未チェックの初期状態", async () => {
    await Default.run();
    await expect.element(document.body).toMatchScreenshot("default");
  });

  it("チェックボックスがチェック済みの状態", async () => {
    await Checked.run();
    await expect.element(document.body).toMatchScreenshot("checked");
  });

  it("チェックボックスが操作できない状態", async () => {
    await Disabled.run();
    await expect.element(document.body).toMatchScreenshot("disabled");
  });

  it("ラベルテキストが表示されている状態", async () => {
    await ShowsLabel.run();
    await expect.element(document.body).toMatchScreenshot("shows-label");
  });
});
