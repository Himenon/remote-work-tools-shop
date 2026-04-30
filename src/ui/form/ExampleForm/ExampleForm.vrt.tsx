import { composeStories } from "@storybook/react";
import { describe, expect, it } from "vitest";
import * as Stories from "./ExampleForm.stories";

const { Default, AllRequiredFieldsEmpty, ServerNameTooShort, ServerNameWithInvalidCharacters } = composeStories(Stories);

describe("ExampleForm のビジュアルスナップショット", () => {
  it("全フィールドが未入力の初期状態", async () => {
    await Default.run();
    await expect.element(document.body).toMatchScreenshot("default");
  });

  it("全必須項目が未入力のまま送信したときのバリデーションエラー表示", async () => {
    await AllRequiredFieldsEmpty.run();
    await expect.element(document.body).toMatchScreenshot("all-required-fields-empty");
  });

  it("サーバー名が3文字未満のバリデーションエラー表示", async () => {
    await ServerNameTooShort.run();
    await expect.element(document.body).toMatchScreenshot("server-name-too-short");
  });

  it("サーバー名に使用できない文字が含まれるバリデーションエラー表示", async () => {
    await ServerNameWithInvalidCharacters.run();
    await expect.element(document.body).toMatchScreenshot("server-name-with-invalid-characters");
  });
});
