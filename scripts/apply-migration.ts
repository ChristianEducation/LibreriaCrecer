import fs from "fs";
import path from "path";
import { config as loadEnv } from "dotenv";
import postgres from "postgres";

loadEnv({ path: ".env.local" });

const sqlPath = path.join(process.cwd(), "drizzle", "0007_encounters.sql");
const sqlStr = fs.readFileSync(sqlPath, "utf-8");

async function apply() {
  const connUrl = new URL(process.env.DATABASE_URL!);
  // Parse manually as done in the project
  const sql = postgres({
    host: connUrl.hostname,
    port: parseInt(connUrl.port || "5432"),
    database: connUrl.pathname.slice(1),
    username: decodeURIComponent(connUrl.username),
    password: decodeURIComponent(connUrl.password),
    ssl: "require",
    max: 1,
    connect_timeout: 10,
  });
  
  try {
    await sql.unsafe(sqlStr);
    console.log("Migration 0007 applied successfully via raw SQL.");
  } catch (err) {
    console.error("Error applying migration:", err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

apply();
