import { prisma } from "../src/client.ts";

const products = [
  {
    productId: "macbook-pro-16",
    name: "MacBook Pro 16インチ",
    price: 398000,
    catchCopy: "M4 Proチップ搭載。最大22時間バッテリーで、どこでもプロの作業環境を実現するラップトップ。",
    category: "Laptop",
    spec: {
      meta: { specSortKey: ["cpu", "memory", "storage"] },
      categories: {
        cpu: {
          name: "CPU",
          view: "radio",
          specs: [
            { category: "cpu", name: "Apple M4 Pro（12コア）", cost: 0 },
            { category: "cpu", name: "Apple M4 Max（16コア）", cost: 60000 },
          ],
        },
        memory: {
          name: "メモリ",
          view: "radio",
          specs: [
            { category: "memory", name: "24GB ユニファイドメモリ", cost: 0 },
            { category: "memory", name: "48GB ユニファイドメモリ", cost: 40000 },
          ],
        },
        storage: {
          name: "ストレージ",
          view: "radio",
          specs: [
            { category: "storage", name: "512GB SSD", cost: 0 },
            { category: "storage", name: "1TB SSD", cost: 30000 },
            { category: "storage", name: "2TB SSD", cost: 70000 },
          ],
        },
      },
    },
  },
  {
    productId: "iphone-15-pro",
    name: "iPhone 15 Pro",
    price: 159800,
    catchCopy: "チタニウムボディとA17 Proチップ搭載。48MPカメラシステムでリモートワークの記録を高画質に残す。",
    category: "SmartPhone",
    spec: {
      meta: { specSortKey: ["storage", "color"] },
      categories: {
        storage: {
          name: "容量",
          view: "radio",
          specs: [
            { category: "storage", name: "128GB", cost: 0 },
            { category: "storage", name: "256GB", cost: 20000 },
            { category: "storage", name: "512GB", cost: 40000 },
            { category: "storage", name: "1TB", cost: 60000 },
          ],
        },
        color: {
          name: "カラー",
          view: "radio",
          specs: [
            { category: "color", name: "ブラックチタニウム", cost: 0 },
            { category: "color", name: "ホワイトチタニウム", cost: 0 },
            { category: "color", name: "ナチュラルチタニウム", cost: 0 },
            { category: "color", name: "ブルーチタニウム", cost: 0 },
          ],
        },
      },
    },
  },
  {
    productId: "standing-desk-pro",
    name: "Standing Desk Pro",
    price: 89000,
    catchCopy: "電動昇降機能で座り・立ちを自在に切り替え。腰への負担を軽減しながら集中力を持続させるデスク。",
    category: "Desk",
    spec: {
      meta: { specSortKey: ["size", "topMaterial", "frameColor"] },
      categories: {
        size: {
          name: "天板サイズ",
          view: "single-select",
          specs: [
            { category: "size", name: "120cm × 60cm", cost: 0 },
            { category: "size", name: "140cm × 70cm", cost: 20000 },
            { category: "size", name: "160cm × 80cm", cost: 40000 },
          ],
        },
        topMaterial: {
          name: "天板素材",
          view: "single-select",
          specs: [
            { category: "topMaterial", name: "メラミン化粧板（ホワイト）", cost: 0 },
            { category: "topMaterial", name: "バーチ天板", cost: 10000 },
            { category: "topMaterial", name: "ウォールナット天板", cost: 30000 },
          ],
        },
        frameColor: {
          name: "フレームカラー",
          view: "radio",
          specs: [
            { category: "frameColor", name: "ホワイト", cost: 0 },
            { category: "frameColor", name: "ブラック", cost: 0 },
          ],
        },
      },
    },
  },
  {
    productId: "blue-yeti-pro",
    name: "Blue Yeti Pro",
    price: 38000,
    catchCopy: "スタジオ品質のサウンドをリモート会議・ポッドキャストで実現する高品質コンデンサーマイク。",
    category: "Microphone",
    spec: {
      meta: { specSortKey: ["connectionType", "polarPattern"] },
      categories: {
        connectionType: {
          name: "接続方式",
          view: "radio",
          specs: [
            { category: "connectionType", name: "USB-C", cost: 0 },
            { category: "connectionType", name: "XLR", cost: 8000 },
          ],
        },
        polarPattern: {
          name: "指向性パターン",
          view: "indicator",
          specs: [
            { category: "polarPattern", name: "単一指向性", cost: 0 },
            { category: "polarPattern", name: "全指向性", cost: 0 },
            { category: "polarPattern", name: "双指向性", cost: 0 },
            { category: "polarPattern", name: "ステレオ", cost: 0 },
          ],
        },
      },
    },
  },
];

const seed = async (): Promise<void> => {
  console.log("シードデータを投入中...");

  for (const product of products) {
    await prisma.product.upsert({
      where: { productId: product.productId },
      update: product,
      create: product,
    });
  }

  console.log(`${products.length} 件の商品を投入しました。`);

  await prisma.$disconnect();
};

seed().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
