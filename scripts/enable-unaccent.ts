import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  const { sql } = await import("drizzle-orm");
  const { db } = await import("../src/integrations/drizzle/client");
  
  try {
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS unaccent;`);
    console.log("unaccent extension enabled successfully.");
  } catch (err) {
    console.error("Error enabling unaccent:", err);
  } finally {
    process.exit(0);
  }
}

main();
