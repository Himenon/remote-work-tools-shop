import { z } from "zod";

const nullableRequiredString = (message: string) =>
  z
    .string()
    .nullable()
    .transform((val, ctx) => {
      if (val === null) {
        ctx.addIssue({ code: "custom", message });
        return z.NEVER;
      }
      return val;
    });

export const ExampleFormSchema = z.object({
  serverName: z
    .string()
    .min(1, "サーバー名を入力してください")
    .min(3, "サーバー名は3文字以上で入力してください")
    .regex(/^[\w-]+$/, "サーバー名は英数字・アンダースコア・ハイフンのみ使用できます"),
  region: nullableRequiredString("リージョンを選択してください"),
  containerImage: z.string().min(1, "コンテナイメージを入力してください"),
  serverType: nullableRequiredString("サーバータイプを選択してください"),
  numOfInstances: z
    .string()
    .min(1, "インスタンス数を入力してください")
    .refine(
      (v) => {
        const n = Number(v);
        return Number.isInteger(n) && n >= 1 && n <= 64;
      },
      { message: "インスタンス数は1〜64の整数で入力してください" },
    ),
  storageType: z.string(),
  restartOnFailure: z.boolean(),
  allowedNetworkProtocols: z.array(z.string()),
});

/** フォームの入力値型。region/serverType は未選択状態として null を含む */
export type ExampleFormInput = z.input<typeof ExampleFormSchema>;
/** バリデーション通過後の値型。region/serverType は null が除かれ string になる */
export type ExampleFormValues = z.infer<typeof ExampleFormSchema>;
