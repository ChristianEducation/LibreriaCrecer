import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local", override: true });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

export default defineConfig({
  out: "./src/integrations/drizzle/migrations",
  schema: "./src/integrations/drizzle/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
