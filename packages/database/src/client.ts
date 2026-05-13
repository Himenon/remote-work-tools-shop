import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/client/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const databaseUrl = process.env.DATABASE_URL ?? `file:${path.resolve(__dirname, "../prisma/dev.db")}`;

const adapter = new PrismaBetterSqlite3({ url: databaseUrl });

export const prisma = new PrismaClient({ adapter });
