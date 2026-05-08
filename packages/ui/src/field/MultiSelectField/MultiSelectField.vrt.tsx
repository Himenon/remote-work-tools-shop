import { composeStories } from "@storybook/react";
import { describe, expect, it } from "vitest";
import * as Stories from "./MultiSelectField.stories";

const { Default, WithDefaultValues, Disabled, ShowsAllOptions } = composeStories(Stories);

describe("MultiSelectField のビジュアルスナップショット", () => {
  it("複数選択フィールドが何も選択されていない初期状態", async () => {
    await Default.run();
    await expect.element(document.body).toMatchScreenshot("default");
  });

  it("デフォルト値が選択済みの状態", async () => {
    await WithDefaultValues.run();
    await expect.element(document.body).toMatchScreenshot("with-default-values");
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
