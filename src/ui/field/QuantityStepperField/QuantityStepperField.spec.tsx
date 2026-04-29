import { composeStories } from "@storybook/react";
import { describe, it } from "vitest";
import { expect, within } from "storybook/test";

import * as Stories from "./QuantityStepperField.stories";

const { Default, Disabled } = composeStories(Stories);

describe("QuantityStepperField の表示確認", () => {
  it("ラベルが画面に表示される", async () => {
    await Default.run();
    const canvas = within(document.body);
    await expect(canvas.getByText("インスタンス数")).toBeInTheDocument();
  });

  it("数量を増やすボタンが画面に表示される", async () => {
    await Default.run();
    const canvas = within(document.body);
    await expect(canvas.getByRole("button", { name: "数量を増やす" })).toBeInTheDocument();
  });

  it("数量を減らすボタンが画面に表示される", async () => {
    await Default.run();
    const canvas = within(document.body);
    await expect(canvas.getByRole("button", { name: "数量を減らす" })).toBeInTheDocument();
  });

  it("disabled が指定されているとき、ボタンが操作できない状態で表示される", async () => {
    await Disabled.run();
    const canvas = within(document.body);
    const buttons: HTMLElement[] = canvas.getAllByRole("button");
    await Promise.all(buttons.map((button: HTMLElement) => expect(button).toBeDisabled()));
  });
});
