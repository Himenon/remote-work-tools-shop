import { z } from "zod";

export const COUNT_MIN = 1;
export const COUNT_MAX = 99;
export const DEFAULT_COUNT = 1;
const DEFAULT_WRAPPING_INDEX = 0;

export const WRAPPING_OPTIONS = ["通常包装", "リボン包装", "高級包装"] as const;
export const DEFAULT_WRAPPING: string = WRAPPING_OPTIONS[DEFAULT_WRAPPING_INDEX];

const SpecsSchema = z.record(z.string(), z.array(z.string()));

export const BuyFormSchema = z.object({
  specs: SpecsSchema,
  giftEnabled: z.boolean(),
  wrapping: z.string(),
  message: z.string(),
  count: z
    .number()
    .int("個数は整数で入力してください")
    .min(COUNT_MIN, `個数は${COUNT_MIN}個以上で入力してください`)
    .max(COUNT_MAX, `個数は${COUNT_MAX}個以下で入力してください`)
    .nullable()
    .transform((val, ctx) => {
      if (val === null) {
        ctx.addIssue({ code: "custom", message: "個数を入力してください" });
        return z.NEVER;
      }
      return val;
    }),
});

/** フォームの入力値型。count は未入力状態として null を含む */
export type BuyFormInput = z.input<typeof BuyFormSchema>;
/** バリデーション通過後の値型。count は null が除かれ number になる */
export type BuyFormValues = z.infer<typeof BuyFormSchema>;
