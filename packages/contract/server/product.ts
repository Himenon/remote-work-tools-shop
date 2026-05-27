import { z } from "zod";

const MIN_PRODUCT_ID_LENGTH = 1;
const MIN_COUNT = 1;

const CustomizedProductSchema = z.object({
  productId: z.string({ message: "商品IDは文字列を指定してください" }).min(MIN_PRODUCT_ID_LENGTH, "商品IDは1文字以上を指定してください"),
  specs: z.record(z.string(), z.string({ message: "スペックの値は文字列を指定してください" })),
});

export const ProductSpecParamSchema = z.object({
  productName: z.string().min(MIN_PRODUCT_ID_LENGTH, "商品名は1文字以上を指定してください"),
});

export type ProductSpecParam = z.infer<typeof ProductSpecParamSchema>;

export const AddBagPayloadSchema = z.object({
  product: CustomizedProductSchema,
  count: z
    .number({ message: "個数は数値を指定してください" })
    .int("個数は整数を指定してください")
    .min(MIN_COUNT, "個数は1以上を指定してください"),
});

export type AddBagPayload = z.infer<typeof AddBagPayloadSchema>;
