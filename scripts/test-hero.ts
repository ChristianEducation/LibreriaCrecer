import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "../src/integrations/drizzle/client";
import { heroSlides } from "../src/integrations/drizzle/schema/landing";

async function run() {
  const slides = await db.select().from(heroSlides);
  console.log(JSON.stringify(slides, null, 2));
  process.exit(0);
}

run();
