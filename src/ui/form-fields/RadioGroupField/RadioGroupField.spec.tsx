import { composeStories } from "@storybook/react";
import { expect } from "storybook/test";
import * as Stories from "./RadioGroupField.stories";

const { Default, Disabled } = composeStories(Stories);

describe("RadioGroupField の表示確認", () => {
  it("ラベルが画面に表示される", async () => {
    const canvas = await Default.run();
    await expect(canvas.getByText("プランを選択してください")).toBeInTheDocument();
  });

  it("全ての選択肢が表示される", async () => {
    const canvas = await Default.run();
    await expect(canvas.getByText("ライト")).toBeInTheDocument();
    await expect(canvas.getByText("スタンダード")).toBeInTheDocument();
    await expect(canvas.getByText("プロ")).toBeInTheDocument();
  });

  it("disabled が指定されているとき、全ての選択肢が操作できない状態で表示される", async () => {
    const canvas = await Disabled.run();
    const radios = canvas.getAllByRole("radio");
    for (const radio of radios) {
      await expect(radio).toBeDisabled();
    }
  });
});
