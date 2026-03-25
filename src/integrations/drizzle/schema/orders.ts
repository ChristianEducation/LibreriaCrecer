import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { coupons } from "./coupons";
import { products } from "./products";

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").notNull().default("pending"),
  subtotal: integer("subtotal").notNull(),
  shippingCost: integer("shipping_cost").default(0).notNull(),
  total: integer("total").notNull(),
  deliveryMethod: text("delivery_method").notNull(),
  paymentMethod: text("payment_method"),
  paymentReference: text("payment_reference"),
  couponId: uuid("coupon_id").references(() => coupons.id, { onDelete: "set null" }),
  discountAmount: integer("discount_amount").default(0).notNull(),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
  sku: text("sku"),
  productTitle: text("product_title").notNull(),
  unitPrice: integer("unit_price").notNull(),
  quantity: integer("quantity").notNull(),
  subtotal: integer("subtotal").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orderCustomers = pgTable("order_customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .unique()
    .references(() => orders.id, { onDelete: "cascade" }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orderAddresses = pgTable("order_addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .unique()
    .references(() => orders.id, { onDelete: "cascade" }),
  street: text("street").notNull(),
  number: text("number").notNull(),
  apartment: text("apartment"),
  commune: text("commune").notNull(),
  city: text("city").notNull(),
  region: text("region").notNull(),
  zipCode: text("zip_code"),
  deliveryInstructions: text("delivery_instructions"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const ordersRelations = relations(orders, ({ many, one }) => ({
  items: many(orderItems),
  customer: one(orderCustomers),
  address: one(orderAddresses),
  coupon: one(coupons, {
    fields: [orders.couponId],
    references: [coupons.id],
  }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const orderCustomersRelations = relations(orderCustomers, ({ one }) => ({
  order: one(orders, {
    fields: [orderCustomers.orderId],
    references: [orders.id],
  }),
}));

export const orderAddressesRelations = relations(orderAddresses, ({ one }) => ({
  order: one(orders, {
    fields: [orderAddresses.orderId],
    references: [orders.id],
  }),
}));
