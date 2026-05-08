import { composeStories } from "@storybook/react";
import { describe, it } from "vitest";
import { expect, within } from "storybook/test";
import * as Stories from "./Stepper.stories";

const { 水平レイアウト最初のステップがアクティブ, 水平レイアウト中間ステップがアクティブ, 水平レイアウト全ステップ完了, 任意ステップあり } =
  composeStories(Stories);

describe("Stepper のラベル表示確認", () => {
  it("全ステップのラベルが画面に表示される", async () => {
    await 水平レイアウト最初のステップがアクティブ.run();
    const canvas = within(document.body);
    await expect(canvas.getByText("会計情報の入力")).toBeInTheDocument();
    await expect(canvas.getByText("配送先の確認")).toBeInTheDocument();
    await expect(canvas.getByText("注文の確定")).toBeInTheDocument();
  });

  it("任意ステップのサブラベルが表示される", async () => {
    await 任意ステップあり.run();
    const canvas = within(document.body);
    await expect(canvas.getByText("任意")).toBeInTheDocument();
  });
});

describe("Stepper のアクティブステップ表示確認", () => {
  it("最初のステップがアクティブのとき、1番目のステップに現在地マーカーが付く", async () => {
    await 水平レイアウト最初のステップがアクティブ.run();
    const canvas = within(document.body);
    const activeItem = canvas.getByText("会計情報の入力").closest("[aria-current='step']");
    await expect(activeItem).toBeInTheDocument();
  });

  it("中間ステップがアクティブのとき、2番目のステップに現在地マーカーが付く", async () => {
    await 水平レイアウト中間ステップがアクティブ.run();
    const canvas = within(document.body);
    const activeItem = canvas.getByText("配送先の確認").closest("[aria-current='step']");
    await expect(activeItem).toBeInTheDocument();
  });

  it("中間ステップがアクティブのとき、1番目のステップには現在地マーカーが付かない", async () => {
    await 水平レイアウト中間ステップがアクティブ.run();
    const canvas = within(document.body);
    const inactiveItem = canvas.getByText("会計情報の入力").closest("[aria-current='step']");
    await expect(inactiveItem).not.toBeInTheDocument();
  });

  it("全ステップが完了しているとき、どのステップにも現在地マーカーが付かない", async () => {
    await 水平レイアウト全ステップ完了.run();
    const activeStepItems = document.body.querySelectorAll("[aria-current='step']");
    expect(activeStepItems).toHaveLength(0);
  });
});

describe("Stepper のアクセシビリティ確認", () => {
  it("ステップリストにリスト用のARIA属性が付与されている", async () => {
    await 水平レイアウト最初のステップがアクティブ.run();
    const canvas = within(document.body);
    const list = canvas.getByRole("list", { name: "ステップ" });
    await expect(list).toBeInTheDocument();
  });

  it("各ステップがリストアイテムとして表示される", async () => {
    await 水平レイアウト最初のステップがアクティブ.run();
    const canvas = within(document.body);
    const items = canvas.getAllByRole("listitem");
    await expect(items).toHaveLength(3);
  });
});
