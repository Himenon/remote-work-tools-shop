import { composeStories } from "@storybook/react";
import { expect } from "storybook/test";
import * as Stories from "./SwitchField.stories";

const { Default, Disabled } = composeStories(Stories);

describe("SwitchField の表示確認", () => {
  it("ラベルが画面に表示される", async () => {
    const canvas = await Default.run();
    await expect(canvas.getByText("通知を有効にする")).toBeInTheDocument();
  });

  it("スイッチが表示される", async () => {
    const canvas = await Default.run();
    await expect(canvas.getByRole("switch")).toBeInTheDocument();
  });

  it("disabled が指定されているとき、スイッチが操作できない状態で表示される", async () => {
    const canvas = await Disabled.run();
    await expect(canvas.getByRole("switch")).toBeDisabled();
  });
});
