import { composeStories } from "@storybook/react";
import { describe, it } from "vitest";
import { expect, within } from "storybook/test";

import * as Stories from "./NumberSlideField.stories";

const { Default, Disabled } = composeStories(Stories);

describe("NumberSlideField の表示確認", () => {
  it("ラベルが画面に表示される", async () => {
    await Default.run();
    const canvas = within(document.body);
    await expect(canvas.getByText("スケーリング閾値")).toBeInTheDocument();
  });

  it("スライダーが2つ画面に表示される", async () => {
    await Default.run();
    const canvas = within(document.body);
    const sliders: HTMLElement[] = canvas.getAllByRole("slider");
    expect(sliders).toHaveLength(2);
  });

  it("disabled が指定されているとき、スライダーが操作できない状態で表示される", async () => {
    await Disabled.run();
    const canvas = within(document.body);
    const sliders: HTMLElement[] = canvas.getAllByRole("slider");
    await Promise.all(sliders.map((slider: HTMLElement) => expect(slider).toBeDisabled()));
  });
});
