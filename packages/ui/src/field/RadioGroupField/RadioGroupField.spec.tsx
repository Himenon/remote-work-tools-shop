import { composeStories } from "@storybook/react";
import { describe, it } from "vitest";
import { expect, within } from "storybook/test";
import * as Stories from "./RadioGroupField.stories";

const { Default, Disabled } = composeStories(Stories);

describe("RadioGroupField の表示確認", () => {
  it("ラベルが画面に表示される", async () => {
    await Default.run();
    const canvas = within(document.body);
    await expect(canvas.getByText("プランを選択してください")).toBeInTheDocument();
  });

  it("全ての選択肢が表示される", async () => {
    await Default.run();
    const canvas = within(document.body);
    await expect(canvas.getByText("ライト")).toBeInTheDocument();
    await expect(canvas.getByText("スタンダード")).toBeInTheDocument();
    await expect(canvas.getByText("プロ")).toBeInTheDocument();
  });

  it("disabled が指定されているとき、全ての選択肢が操作できない状態で表示される", async () => {
    await Disabled.run();
    const canvas = within(document.body);
    const radios: HTMLElement[] = canvas.getAllByRole("radio");
    await Promise.all(radios.map((radio: HTMLElement) => expect(radio).toHaveAttribute("aria-disabled", "true")));
  });
});
