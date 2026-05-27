import { composeStories } from "@storybook/react";
import { describe, it } from "vitest";
import { expect, within } from "storybook/test";
import * as Stories from "./OnelineTextField.stories";

const { Default, Disabled } = composeStories(Stories);

describe("OnelineTextField の表示確認", () => {
  it("ラベルが画面に表示される", async () => {
    await Default.run();
    const canvas = within(document.body);
    await expect(canvas.getByText("テキストフィールド")).toBeInTheDocument();
  });

  it("テキスト入力欄が表示される", async () => {
    await Default.run();
    const canvas = within(document.body);
    await expect(canvas.getByRole("textbox")).toBeInTheDocument();
  });

  it("disabled が指定されているとき、入力欄が操作できない状態で表示される", async () => {
    await Disabled.run();
    const canvas = within(document.body);
    await expect(canvas.getByRole("textbox")).toBeDisabled();
  });
});
