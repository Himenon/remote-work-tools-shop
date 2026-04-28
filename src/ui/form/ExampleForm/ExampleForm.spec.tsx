import { composeStories } from "@storybook/react";
import { describe, it } from "vitest";
import { expect, within } from "storybook/test";

import * as Stories from "./ExampleForm.stories";

const { Default } = composeStories(Stories);

describe("ExampleForm の表示確認", () => {
  it("フォームの見出し「サーバー設定」が画面に表示される", async () => {
    await Default.run();
    const canvas = within(document.body);
    await expect(canvas.getByText("サーバー設定")).toBeInTheDocument();
  });

  it("全フィールドのラベルが画面に表示される", async () => {
    await Default.run();
    const canvas = within(document.body);
    await expect(canvas.getByText("サーバー名")).toBeInTheDocument();
    await expect(canvas.getByText("リージョン")).toBeInTheDocument();
    await expect(canvas.getByText("コンテナイメージ")).toBeInTheDocument();
    await expect(canvas.getByText("サーバータイプ")).toBeInTheDocument();
    await expect(canvas.getByText("インスタンス数")).toBeInTheDocument();
    await expect(canvas.getByText("ストレージタイプ")).toBeInTheDocument();
    await expect(canvas.getByText("障害時に自動再起動する")).toBeInTheDocument();
    await expect(canvas.getByText("許可するネットワークプロトコル")).toBeInTheDocument();
  });

  it("送信ボタンが画面に表示される", async () => {
    await Default.run();
    const canvas = within(document.body);
    await expect(canvas.getByRole("button", { name: "送信" })).toBeInTheDocument();
  });

  it("スイッチ「障害時に自動再起動する」が初期状態でオンになっている", async () => {
    await Default.run();
    const canvas = within(document.body);
    await expect(canvas.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });
});
