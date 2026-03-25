import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

type ParsedDatabaseConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  useSsl: boolean;
};

function parseDatabaseUrl(urlString: string): ParsedDatabaseConfig {
  const parsed = new URL(urlString);

  const host = parsed.hostname;
  const port = parsed.port ? Number(parsed.port) : 5432;
  const user = decodeURIComponent(parsed.username);
  const password = decodeURIComponent(parsed.password);
  const database = parsed.pathname.replace(/^\//, "") || "postgres";
  const sslMode = parsed.searchParams.get("sslmode");
  const useSsl = sslMode === "require";

  if (!host || !user || !database) {
    throw new Error("DATABASE_URL is invalid. Missing host, user, or database.");
  }

  return {
    host,
    port,
    user,
    password,
    database,
    useSsl,
  };
}

const dbConfig = parseDatabaseUrl(connectionString);

type QueryClient = ReturnType<typeof postgres>;
type DrizzleDatabase = ReturnType<typeof drizzle<typeof schema>>;

declare global {
  var __crecerQueryClient__: QueryClient | undefined;
  var __crecerDb__: DrizzleDatabase | undefined;
}

const globalForDb = globalThis as typeof globalThis & {
  __crecerQueryClient__?: QueryClient;
  __crecerDb__?: DrizzleDatabase;
};

const queryClient =
  globalForDb.__crecerQueryClient__ ??
  postgres({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    pass: dbConfig.password,
    database: dbConfig.database,
    ssl: dbConfig.useSsl ? "require" : undefined,
    prepare: false,
    max: process.env.NODE_ENV === "production" ? 5 : 1,
  });

const db = globalForDb.__crecerDb__ ?? drizzle(queryClient, { schema });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__crecerQueryClient__ = queryClient;
  globalForDb.__crecerDb__ = db;
}

export { db };
