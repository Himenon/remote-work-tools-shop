import { composeStories } from "@storybook/react";
import { describe, it } from "vitest";
import { expect, within } from "storybook/test";

import * as Stories from "./FieldLabel.stories";

const { Default, Clickable, Disabled } = composeStories(Stories);

describe("FieldLabel の表示確認", () => {
  it("ラベルテキストが画面に表示される", async () => {
    await Default.run();
    const canvas = within(document.body);
    await expect(canvas.getByText("ラベルテキスト")).toBeInTheDocument();
  });

  it("clickable が指定されているとき、ラベルテキストが画面に表示される", async () => {
    await Clickable.run();
    const canvas = within(document.body);
    await expect(canvas.getByText("ラベルテキスト")).toBeInTheDocument();
  });

  it("Field.Root に disabled が指定されているとき、ラベル要素に data-disabled 属性が付与される", async () => {
    await Disabled.run();
    const canvas = within(document.body);
    const label = canvas.getByText("ラベルテキスト");
    await expect(label).toHaveAttribute("data-disabled", "true");
  });
});
