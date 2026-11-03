import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  isActive: boolean("is_active").default(true).notNull(),
  unsubscribeToken: uuid("unsubscribe_token").defaultRandom().notNull().unique(),
  source: text("source").default("home").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
});
