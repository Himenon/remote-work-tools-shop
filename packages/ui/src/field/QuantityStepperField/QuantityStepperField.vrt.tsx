import { composeStories } from "@storybook/react";
import { describe, expect, it } from "vitest";

import * as Stories from "./QuantityStepperField.stories";

const { Default, WithValue, Disabled, ShowsErrorMessage } = composeStories(Stories);

describe("QuantityStepperField のビジュアルスナップショット", () => {
  it("入力欄が空の初期状態", async () => {
    await Default.run();
    await expect.element(document.body).toMatchScreenshot("default");
  });

  it("数値が入力されている状態", async () => {
    await WithValue.run();
    await expect.element(document.body).toMatchScreenshot("with-value");
  });

  it("操作できない状態", async () => {
    await Disabled.run();
    await expect.element(document.body).toMatchScreenshot("disabled");
  });

  it("エラーメッセージが表示されている状態", async () => {
    await ShowsErrorMessage.run();
    await expect.element(document.body).toMatchScreenshot("shows-error-message");
  });
});
