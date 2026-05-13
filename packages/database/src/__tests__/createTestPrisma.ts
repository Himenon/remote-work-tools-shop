import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { Prisma, PrismaClient } from "../../generated/client/client";

const __dirname = dirname(fileURLToPath(import.meta.url));

const migrationSql = readFileSync(join(__dirname, "../../prisma/migrations/20260513123727_init/migration.sql"), "utf-8");

export type QueryRecord = { query: string; params: string };

export const createTestPrisma = async () => {
  const dbPath = join(tmpdir(), `rwts-test-${randomUUID()}.db`);
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
  const prisma = new PrismaClient({ adapter, log: [{ emit: "event", level: "query" }] });

  const capturedQueries: QueryRecord[] = [];
  prisma.$on("query", (e: Prisma.QueryEvent) => {
    capturedQueries.push({ query: e.query, params: e.params });
  });

  const statements = migrationSql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of statements) {
    await prisma.$executeRawUnsafe(stmt);
  }

  const clearCapturedQueries = (): void => {
    capturedQueries.length = 0;
  };

  return { prisma, capturedQueries, clearCapturedQueries, dbPath };
};
