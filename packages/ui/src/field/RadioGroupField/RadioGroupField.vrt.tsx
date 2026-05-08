import { composeStories } from "@storybook/react";
import { describe, expect, it } from "vitest";
import * as Stories from "./RadioGroupField.stories";

const { Default, WithDefaultValue, Disabled, ShowsAllOptions } = composeStories(Stories);

describe("RadioGroupField のビジュアルスナップショット", () => {
  it("ラジオグループが何も選択されていない初期状態", async () => {
    await Default.run();
    await expect.element(document.body).toMatchScreenshot("default");
  });

  it("デフォルト値が選択済みの状態", async () => {
    await WithDefaultValue.run();
    await expect.element(document.body).toMatchScreenshot("with-default-value");
  });

  it("全ての選択肢が操作できない状態", async () => {
    await Disabled.run();
    await expect.element(document.body).toMatchScreenshot("disabled");
  });

  it("全ての選択肢が表示されている状態", async () => {
    await ShowsAllOptions.run();
    await expect.element(document.body).toMatchScreenshot("shows-all-options");
  });
});
