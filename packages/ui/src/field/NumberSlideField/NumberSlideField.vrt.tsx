import { composeStories } from "@storybook/react";
import { describe, expect, it } from "vitest";

import * as Stories from "./NumberSlideField.stories";

const { Default, Disabled, ShowsErrorMessage, ShowsLabel } = composeStories(Stories);

describe("NumberSlideField のビジュアルスナップショット", () => {
  it("スライダーの初期状態", async () => {
    await Default.run();
    await expect.element(document.body).toMatchScreenshot("default");
  });

  it("スライダーが操作できない状態", async () => {
    await Disabled.run();
    await expect.element(document.body).toMatchScreenshot("disabled");
  });

  it("ラベルが表示されている状態", async () => {
    await ShowsLabel.run();
    await expect.element(document.body).toMatchScreenshot("shows-label");
  });

  it("エラーメッセージが表示されている状態", async () => {
    await ShowsErrorMessage.run();
    await expect.element(document.body).toMatchScreenshot("shows-error-message");
  });
});
