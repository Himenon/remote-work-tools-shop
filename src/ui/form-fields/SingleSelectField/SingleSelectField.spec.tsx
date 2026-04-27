import { composeStories } from "@storybook/react";
import { expect } from "storybook/test";
import * as Stories from "./SingleSelectField.stories";

const { Default, Disabled } = composeStories(Stories);

describe("SingleSelectField の表示確認", () => {
  it("ラベルが画面に表示される", async () => {
    const canvas = await Default.run();
    await expect(canvas.getByText("メモリ容量")).toBeInTheDocument();
  });

  it("プレースホルダーが表示される", async () => {
    const canvas = await Default.run();
    await expect(canvas.getByText("選択してください")).toBeInTheDocument();
  });

  it("disabled が指定されているとき、トリガーボタンが操作できない状態で表示される", async () => {
    const canvas = await Disabled.run();
    await expect(canvas.getByRole("combobox")).toBeDisabled();
  });
});
