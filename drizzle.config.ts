import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local", override: true });

const rawUrl = process.env.DATABASE_URL;

if (!rawUrl) {
  throw new Error("DATABASE_URL is not set");
}

const databaseUrl = rawUrl.includes("sslmode")
  ? rawUrl
  : `${rawUrl}?sslmode=require&connect_timeout=10`;

export default defineConfig({
  out: "./src/integrations/drizzle/migrations",
  schema: "./src/integrations/drizzle/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
