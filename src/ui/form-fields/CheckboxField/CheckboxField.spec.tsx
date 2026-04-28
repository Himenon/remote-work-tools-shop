import { composeStories } from "@storybook/react";
import { describe, it } from "vitest";
import { expect, within } from "storybook/test";
import * as Stories from "./CheckboxField.stories";

const { Default, Disabled } = composeStories(Stories);

describe("CheckboxField の表示確認", () => {
  it("ラベルが画面に表示される", async () => {
    await Default.run();
    const canvas = within(document.body);
    await expect(canvas.getByText("利用規約に同意する")).toBeInTheDocument();
  });

  it("チェックボックスが表示される", async () => {
    await Default.run();
    const canvas = within(document.body);
    await expect(canvas.getByRole("checkbox")).toBeInTheDocument();
  });

  it("disabled が指定されているとき、チェックボックスが操作できない状態で表示される", async () => {
    await Disabled.run();
    const canvas = within(document.body);
    await expect(canvas.getByRole("checkbox")).toHaveAttribute("aria-disabled", "true");
  });
});
