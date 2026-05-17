import { composeStories } from "@storybook/react";
import { describe, it } from "vitest";
import { expect, within } from "storybook/test";
import * as Stories from "./AssignField.stories";

const { Default, MultipleMode, WithDefaultValueSingle, WithDefaultValueMultiple, WithLockedSingle, WithLockedMultiple, Disabled } =
  composeStories(Stories);

describe("AssignField (単一選択) の表示確認", () => {
  it("ラベルが画面に表示される", async () => {
    await Default.run();
    const canvas = within(document.body);
    await expect(canvas.getByText("担当者")).toBeInTheDocument();
  });

  it("プレースホルダーが入力欄に表示される", async () => {
    await Default.run();
    const canvas = within(document.body);
    await expect(canvas.getByPlaceholderText("担当者を検索")).toBeInTheDocument();
  });

  it("デフォルト値が選択済み状態で入力欄に表示される", async () => {
    await WithDefaultValueSingle.run();
    const canvas = within(document.body);
    const input = canvas.getByRole("combobox") as HTMLInputElement;
    await expect(input.value).toBe("田中 太郎");
  });

  it("disabled が指定されているとき、入力欄が操作できない状態で表示される", async () => {
    await Disabled.run();
    const canvas = within(document.body);
    await expect(canvas.getByRole("combobox")).toBeDisabled();
  });

  it("locked の担当者が選択済みのとき、入力欄ではなくチップとして表示される", async () => {
    await WithLockedSingle.run();
    const canvas = within(document.body);
    await expect(canvas.queryByRole("combobox")).not.toBeInTheDocument();
    await expect(canvas.getByText("田中 太郎")).toBeInTheDocument();
  });
});

describe("AssignField (複数選択) の表示確認", () => {
  it("ラベルが画面に表示される", async () => {
    await MultipleMode.run();
    const canvas = within(document.body);
    await expect(canvas.getByText("担当者")).toBeInTheDocument();
  });

  it("プレースホルダーが入力欄に表示される", async () => {
    await MultipleMode.run();
    const canvas = within(document.body);
    await expect(canvas.getByPlaceholderText("担当者を検索")).toBeInTheDocument();
  });

  it("デフォルト値のチップが複数表示される", async () => {
    await WithDefaultValueMultiple.run();
    const canvas = within(document.body);
    await expect(canvas.getByText("田中 太郎")).toBeInTheDocument();
    await expect(canvas.getByText("営業部")).toBeInTheDocument();
  });

  it("locked の担当者チップに削除ボタンが表示されない", async () => {
    await WithLockedMultiple.run();
    const canvas = within(document.body);
    // locked の「田中 太郎」は削除ボタンが存在しない
    await expect(canvas.queryByRole("button", { name: "田中 太郎を削除" })).not.toBeInTheDocument();
  });

  it("locked でない担当者チップに削除ボタンが表示される", async () => {
    await WithLockedMultiple.run();
    const canvas = within(document.body);
    await expect(canvas.getByRole("button", { name: "鈴木 花子を削除" })).toBeInTheDocument();
  });
});
