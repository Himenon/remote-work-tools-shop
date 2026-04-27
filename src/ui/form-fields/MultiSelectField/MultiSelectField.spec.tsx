import { composeStories } from "@storybook/react";
import { expect } from "storybook/test";
import * as Stories from "./MultiSelectField.stories";

const { Default, Disabled } = composeStories(Stories);

describe("MultiSelectField の表示確認", () => {
  it("ラベルが画面に表示される", async () => {
    const canvas = await Default.run();
    await expect(canvas.getByText("搭載機能を選択してください")).toBeInTheDocument();
  });

  it("全ての選択肢が表示される", async () => {
    const canvas = await Default.run();
    await expect(canvas.getByText("Wi-Fi")).toBeInTheDocument();
    await expect(canvas.getByText("Bluetooth")).toBeInTheDocument();
    await expect(canvas.getByText("NFC")).toBeInTheDocument();
  });

  it("disabled が指定されているとき、全ての選択肢が操作できない状態で表示される", async () => {
    const canvas = await Disabled.run();
    const checkboxes = canvas.getAllByRole("checkbox");
    await Promise.all(checkboxes.map((checkbox: HTMLElement) => expect(checkbox).toBeDisabled()));
  });
});
