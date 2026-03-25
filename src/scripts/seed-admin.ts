import { config as loadEnv } from "dotenv";
import { and, eq } from "drizzle-orm";

loadEnv({ path: ".env.local" });

const DEFAULT_EMAIL = process.env.ADMIN_SEED_EMAIL ?? "admin@crecerlibreria.cl";
const DEFAULT_PASSWORD = process.env.ADMIN_SEED_PASSWORD ?? "AdminTemporal123!";
const DEFAULT_NAME = process.env.ADMIN_SEED_NAME ?? "Administrador";

async function run() {
  const [{ hashPassword }, { db }, { adminUsers }] = await Promise.all([
    import("../features/admin/services/auth-service"),
    import("../integrations/drizzle"),
    import("../integrations/drizzle/schema"),
  ]);

  const email = DEFAULT_EMAIL.trim().toLowerCase();
  const name = DEFAULT_NAME.trim();

  if (!email || !DEFAULT_PASSWORD || !name) {
    throw new Error("Missing default seed values for admin user.");
  }

  const [existingAdmin] = await db
    .select({
      id: adminUsers.id,
    })
    .from(adminUsers)
    .where(and(eq(adminUsers.email, email), eq(adminUsers.isActive, true)))
    .limit(1);

  if (existingAdmin) {
    console.warn(`Admin already exists for email: ${email}`);
    return;
  }

  const passwordHash = await hashPassword(DEFAULT_PASSWORD);

  const [createdAdmin] = await db
    .insert(adminUsers)
    .values({
      email,
      passwordHash,
      name,
      isActive: true,
    })
    .returning({
      id: adminUsers.id,
      email: adminUsers.email,
      name: adminUsers.name,
    });

  console.warn("Admin user created:");
  console.warn(`- id: ${createdAdmin.id}`);
  console.warn(`- email: ${createdAdmin.email}`);
  console.warn(`- name: ${createdAdmin.name}`);
  console.warn("- temporary password: (hidden, use ADMIN_SEED_PASSWORD to control it)");
}

run()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to seed admin user:", error);
    process.exit(1);
  });
