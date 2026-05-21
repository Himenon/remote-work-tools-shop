import { z } from "zod";

export const COUNT_MIN = 1;
export const COUNT_MAX = 99;

export const BagItemCountFormSchema = z.object({
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
export type BagItemCountFormInput = z.input<typeof BagItemCountFormSchema>;
/** バリデーション通過後の値型。count は null が除かれ number になる */
export type BagItemCountFormValues = z.infer<typeof BagItemCountFormSchema>;
