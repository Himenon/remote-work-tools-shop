import { composeStories } from "@storybook/react";
import { describe, expect, it } from "vitest";
import * as Stories from "./SwitchField.stories";

const { Default, On, Disabled, ShowsLabel } = composeStories(Stories);

describe("SwitchField のビジュアルスナップショット", () => {
  it("スイッチがオフの初期状態", async () => {
    await Default.run();
    await expect.element(document.body).toMatchScreenshot("default");
  });

  it("スイッチがオンの状態", async () => {
    await On.run();
    await expect.element(document.body).toMatchScreenshot("on");
  });

  it("スイッチが操作できない状態", async () => {
    await Disabled.run();
    await expect.element(document.body).toMatchScreenshot("disabled");
  });

  it("ラベルテキストが表示されている状態", async () => {
    await ShowsLabel.run();
    await expect.element(document.body).toMatchScreenshot("shows-label");
  });
});
