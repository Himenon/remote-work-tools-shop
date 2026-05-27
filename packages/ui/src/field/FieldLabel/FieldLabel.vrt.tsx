import { composeStories } from "@storybook/react";
import { describe, expect, it } from "vitest";

import * as Stories from "./FieldLabel.stories";

const { Default, Clickable, Disabled, ClickableDisabled } = composeStories(Stories);

describe("FieldLabel のビジュアルスナップショット", () => {
  it("通常ラベルの初期状態", async () => {
    await Default.run();
    await expect.element(document.body).toMatchScreenshot("default");
  });

  it("クリック可能なラベルの初期状態", async () => {
    await Clickable.run();
    await expect.element(document.body).toMatchScreenshot("clickable");
  });

  it("通常ラベルが操作できない状態", async () => {
    await Disabled.run();
    await expect.element(document.body).toMatchScreenshot("disabled");
  });

  it("クリック可能なラベルが操作できない状態", async () => {
    await ClickableDisabled.run();
    await expect.element(document.body).toMatchScreenshot("clickable-disabled");
  });
});
