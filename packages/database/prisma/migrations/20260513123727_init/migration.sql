-- CreateTable
CREATE TABLE "Product" (
    "productId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "catchCopy" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "spec" JSONB NOT NULL
);

-- CreateTable
CREATE TABLE "BagItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" TEXT NOT NULL,
    "specs" JSONB NOT NULL,
    "count" INTEGER NOT NULL,
    CONSTRAINT "BagItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("productId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "BagItem_productId_key" ON "BagItem"("productId");
