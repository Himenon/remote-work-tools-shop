import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/client/client.ts";

const databaseUrl = process.env.DATABASE_URL ?? `file:${path.resolve(import.meta.dirname, "../prisma/dev.db")}`;

const adapter = new PrismaBetterSqlite3({ url: databaseUrl });

export const prisma = new PrismaClient({ adapter });
