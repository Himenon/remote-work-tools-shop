import { composeStories } from "@storybook/react";
import { describe, expect, it } from "vitest";
import * as Stories from "./TextField.stories";

const { Default, Disabled, WithValue, ShowsErrorMessage } = composeStories(Stories);

describe("TextField のビジュアルスナップショット", () => {
  it("テキスト入力欄が空の初期状態", async () => {
    await Default.run();
    await expect.element(document.body).toMatchScreenshot("default");
  });

  it("テキスト入力欄が操作できない状態", async () => {
    await Disabled.run();
    await expect.element(document.body).toMatchScreenshot("disabled");
  });

  it("テキストが入力済みの状態", async () => {
    await WithValue.run();
    await expect.element(document.body).toMatchScreenshot("with-value");
  });

  it("バリデーションエラーメッセージが表示されている状態", async () => {
    await ShowsErrorMessage.run();
    await expect.element(document.body).toMatchScreenshot("shows-error-message");
  });
});
