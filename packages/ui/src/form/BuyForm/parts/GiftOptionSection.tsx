"use client";

import { useWatch } from "react-hook-form";
import { CheckboxField } from "@rwts/ui/field/CheckboxField";
import { OnelineTextField } from "@rwts/ui/field/OnelineTextField";
import { RadioGroupField, type RadioOption } from "@rwts/ui/field/RadioGroupField";
import { WRAPPING_OPTIONS, type BuyFormInput } from "@rwts/contract/form/BuyFormSchema";

const WRAPPING_RADIO_OPTIONS: RadioOption[] = WRAPPING_OPTIONS.map((option): RadioOption => ({ label: option, value: option }));

const GiftDetailFields: React.FC = () => (
  <div className="flex flex-col gap-4 pl-5">
    <RadioGroupField name="wrapping" label="ラッピングの種類" options={WRAPPING_RADIO_OPTIONS} />
    <OnelineTextField name="message" label="ギフトメッセージ" placeholder="メッセージを入力してください" />
  </div>
);

export const GiftOptionSection: React.FC = () => {
  const giftEnabled = useWatch<BuyFormInput, "giftEnabled">({ name: "giftEnabled" });

  return (
    <fieldset className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <legend className="px-1 text-sm font-semibold text-gray-700 dark:text-gray-300">ギフト設定</legend>
      <CheckboxField name="giftEnabled" label="ギフト包装を利用する" />
      {giftEnabled && <GiftDetailFields />}
    </fieldset>
  );
};

GiftOptionSection.displayName = "GiftOptionSection";
