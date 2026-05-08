import { z } from "zod";

const SpecSelectViewSchema = z.enum(["radio", "single-select", "multi-select", "indicator"], {
  message: "表示形式は radio / single-select / multi-select / indicator のいずれかである必要があります",
});

const SpecSchema = z.object({
  category: z.string({ message: "スペックのカテゴリキーは文字列である必要があります" }),
  name: z.string({ message: "スペック名は文字列である必要があります" }),
  cost: z.number({ message: "スペックの追加費用は数値である必要があります" }),
});

const SpecCategorySchema = z.object({
  name: z.string({ message: "カテゴリ名は文字列である必要があります" }),
  specs: z.array(SpecSchema, { message: "スペック一覧は配列である必要があります" }),
  view: SpecSelectViewSchema,
});

const CustomizableSpecSchema = z.object({
  meta: z.object({
    specSortKey: z.array(z.string({ message: "スペック並び順のキーは文字列である必要があります" }), {
      message: "スペック並び順は配列である必要があります",
    }),
  }),
  categories: z.record(z.string(), SpecCategorySchema),
});

const ProductBaseSchema = z.object({
  productId: z.string({ message: "商品IDは文字列である必要があります" }),
  price: z.number({ message: "価格は数値である必要があります" }),
  name: z.string({ message: "商品名は文字列である必要があります" }),
  spec: CustomizableSpecSchema,
});

const LaptopSchema = ProductBaseSchema.extend({ category: z.literal("Laptop") });
const SmartPhoneSchema = ProductBaseSchema.extend({ category: z.literal("SmartPhone") });
const DeskSchema = ProductBaseSchema.extend({ category: z.literal("Desk") });
const MicrophoneSchema = ProductBaseSchema.extend({ category: z.literal("Microphone") });

export const ProductSpecSchema = z.discriminatedUnion("category", [LaptopSchema, SmartPhoneSchema, DeskSchema, MicrophoneSchema]);

const CATCH_COPY_MAX_LENGTH = 72;

export const ProductListItemSchema = z.object({
  productId: z.string({ message: "商品IDは文字列である必要があります" }),
  name: z.string({ message: "商品名は文字列である必要があります" }),
  price: z.number({ message: "価格は数値である必要があります" }),
  catchCopy: z
    .string({ message: "販促文章は文字列である必要があります" })
    .max(CATCH_COPY_MAX_LENGTH, "販促文章は72文字以内である必要があります"),
});

const CustomizedProductSchema = z.object({
  productId: z.string({ message: "商品IDは文字列である必要があります" }),
  specs: z.record(z.string(), z.string({ message: "スペックの値は文字列である必要があります" })),
});

const MIN_COUNT = 1;

export const BagItemSchema = z.object({
  product: CustomizedProductSchema,
  count: z
    .number({ message: "個数は数値である必要があります" })
    .int("個数は整数である必要があります")
    .min(MIN_COUNT, "個数は1以上である必要があります"),
});

export const ProductsInBagSchema = z.object({
  items: z.array(BagItemSchema, { message: "バッグの内容は配列である必要があります" }),
});

export type ProductSpec = z.infer<typeof ProductSpecSchema>;
export type ProductListItem = z.infer<typeof ProductListItemSchema>;
export type BagItem = z.infer<typeof BagItemSchema>;
export type ProductsInBag = z.infer<typeof ProductsInBagSchema>;
