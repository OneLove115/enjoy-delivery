import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  index,
  pgPolicy,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { tenants } from "./tenants";

/**
 * Customer notification preferences for opt-in/opt-out management.
 * Allows customers to control which notification channels they receive.
 */
export const notificationPreferences = pgTable(
  "notification_preferences",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    customerEmail: text("customer_email"),
    customerPhone: text("customer_phone"),
    smsOptIn: boolean("sms_opt_in").default(true).notNull(),
    emailOptIn: boolean("email_opt_in").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    // Index for tenant + email lookups
    index("notification_preferences_tenant_email_idx").on(
      table.tenantId,
      table.customerEmail
    ),
    // Index for tenant + phone lookups
    index("notification_preferences_tenant_phone_idx").on(
      table.tenantId,
      table.customerPhone
    ),
    // RLS Policy: Preferences are tenant-isolated
    pgPolicy("notification_preferences_tenant_isolation_select", {
      for: "select",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("notification_preferences_tenant_isolation_insert", {
      for: "insert",
      withCheck: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("notification_preferences_tenant_isolation_update", {
      for: "update",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("notification_preferences_tenant_isolation_delete", {
      for: "delete",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
  ]
);

// Type export for use in application code
export type NotificationPreference = typeof notificationPreferences.$inferSelect;
export type NewNotificationPreference = typeof notificationPreferences.$inferInsert;