import { z } from "zod";

const NON_EMPTY_MIN_LENGTH = 1;
const SERVER_NAME_MIN_LENGTH = 3;
export const INSTANCES_MIN = 1;
export const INSTANCES_MAX = 64;

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
    .min(NON_EMPTY_MIN_LENGTH, "サーバー名を入力してください")
    .min(SERVER_NAME_MIN_LENGTH, `サーバー名は${SERVER_NAME_MIN_LENGTH}文字以上で入力してください`)
    .regex(/^[\w-]+$/, "サーバー名は英数字・アンダースコア・ハイフンのみ使用できます"),
  region: nullableRequiredString("リージョンを選択してください"),
  containerImage: z.string().min(NON_EMPTY_MIN_LENGTH, "コンテナイメージを入力してください"),
  serverType: nullableRequiredString("サーバータイプを選択してください"),
  numOfInstances: z
    .number()
    .int("インスタンス数は整数で入力してください")
    .min(INSTANCES_MIN, `インスタンス数は${INSTANCES_MIN}以上で入力してください`)
    .max(INSTANCES_MAX, `インスタンス数は${INSTANCES_MAX}以下で入力してください`)
    .nullable()
    .transform((val, ctx) => {
      if (val === null) {
        ctx.addIssue({ code: "custom", message: "インスタンス数を入力してください" });
        return z.NEVER;
      }
      return val;
    }),
  scalingThreshold: z.array(z.number()),
  storageType: z.string(),
  restartOnFailure: z.boolean(),
  allowedNetworkProtocols: z.array(z.string()),
});

/** フォームの入力値型。region/serverType は未選択状態として null を含む */
export type ExampleFormInput = z.input<typeof ExampleFormSchema>;
/** バリデーション通過後の値型。region/serverType は null が除かれ string になる */
export type ExampleFormValues = z.infer<typeof ExampleFormSchema>;
