import { composeStories } from "@storybook/react";
import { describe, expect, it } from "vitest";
import * as Stories from "./Stepper.stories";

const {
  水平レイアウト最初のステップがアクティブ,
  水平レイアウト中間ステップがアクティブ,
  水平レイアウト全ステップ完了,
  垂直レイアウト最初のステップがアクティブ,
  垂直レイアウト中間ステップがアクティブ,
  垂直レイアウト全ステップ完了,
  任意ステップあり,
} = composeStories(Stories);

describe("Stepper のビジュアルスナップショット", () => {
  it("水平レイアウト：最初のステップがアクティブな状態", async () => {
    await 水平レイアウト最初のステップがアクティブ.run();
    await expect.element(document.body).toMatchScreenshot("horizontal-first-active");
  });

  it("水平レイアウト：中間ステップがアクティブな状態", async () => {
    await 水平レイアウト中間ステップがアクティブ.run();
    await expect.element(document.body).toMatchScreenshot("horizontal-middle-active");
  });

  it("水平レイアウト：全ステップが完了した状態", async () => {
    await 水平レイアウト全ステップ完了.run();
    await expect.element(document.body).toMatchScreenshot("horizontal-all-completed");
  });

  it("垂直レイアウト：最初のステップがアクティブな状態", async () => {
    await 垂直レイアウト最初のステップがアクティブ.run();
    await expect.element(document.body).toMatchScreenshot("vertical-first-active");
  });

  it("垂直レイアウト：中間ステップがアクティブな状態", async () => {
    await 垂直レイアウト中間ステップがアクティブ.run();
    await expect.element(document.body).toMatchScreenshot("vertical-middle-active");
  });

  it("垂直レイアウト：全ステップが完了した状態", async () => {
    await 垂直レイアウト全ステップ完了.run();
    await expect.element(document.body).toMatchScreenshot("vertical-all-completed");
  });

  it("任意のステップが含まれる状態", async () => {
    await 任意ステップあり.run();
    await expect.element(document.body).toMatchScreenshot("with-optional-step");
  });
});
