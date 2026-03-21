import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
  pgPolicy,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { tenants } from "./tenants";
import { drivers } from "./drivers";

/**
 * Driver Push Subscriptions
 *
 * Stores Web Push API subscriptions for driver devices.
 * Enables sending push notifications to driver PWA on mobile/desktop.
 */
export const driverPushSubscriptions = pgTable(
  "driver_push_subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    driverId: uuid("driver_id")
      .notNull()
      .references(() => drivers.id, { onDelete: "cascade" }),
    // Push subscription details
    endpoint: text("endpoint").notNull().unique(), // Push endpoint URL
    p256dhKey: text("p256dh_key").notNull(), // ECDH public key
    authKey: text("auth_key").notNull(), // Authentication secret
    // Metadata
    userAgent: text("user_agent"), // Browser/device info
    deviceId: text("device_id"), // Optional device identifier
    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    // Indexes for common queries
    index("push_sub_driver_idx").on(table.driverId),
    index("push_sub_tenant_idx").on(table.tenantId),
    index("push_sub_endpoint_idx").on(table.endpoint),
    // RLS Policies for tenant isolation
    pgPolicy("push_sub_tenant_isolation_select", {
      for: "select",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("push_sub_tenant_isolation_insert", {
      for: "insert",
      withCheck: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("push_sub_tenant_isolation_update", {
      for: "update",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("push_sub_tenant_isolation_delete", {
      for: "delete",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
  ]
);

// Type exports
export type DriverPushSubscription = typeof driverPushSubscriptions.$inferSelect;
export type NewDriverPushSubscription = typeof driverPushSubscriptions.$inferInsert;