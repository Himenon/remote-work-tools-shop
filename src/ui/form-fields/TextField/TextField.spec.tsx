import { composeStories } from "@storybook/react";
import { expect } from "storybook/test";
import * as Stories from "./TextField.stories";

const { Default, Disabled } = composeStories(Stories);

describe("TextField の表示確認", () => {
  it("ラベルが画面に表示される", async () => {
    const canvas = await Default.run();
    await expect(canvas.getByText("テキストフィールド")).toBeInTheDocument();
  });

  it("テキスト入力欄が表示される", async () => {
    const canvas = await Default.run();
    await expect(canvas.getByRole("textbox")).toBeInTheDocument();
  });

  it("disabled が指定されているとき、入力欄が操作できない状態で表示される", async () => {
    const canvas = await Disabled.run();
    await expect(canvas.getByRole("textbox")).toBeDisabled();
  });
});
