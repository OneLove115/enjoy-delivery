import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  index,
  pgPolicy,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { tenants } from "./tenants";
import { orders } from "./orders";

/**
 * Notification logs for audit trail and troubleshooting.
 * Records all notification attempts with status and error details.
 */
export const notificationLogs = pgTable(
  "notification_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
    type: text("type").notNull(), // 'sms' | 'email'
    to: text("to").notNull(), // phone number or email address
    template: text("template").notNull(), // 'order_confirmed', 'order_preparing', etc.
    status: text("status").notNull(), // 'pending', 'sent', 'failed'
    error: text("error"),
    metadata: jsonb("metadata").$type<{
      messageId?: string;
      attempts?: number;
      [key: string]: unknown;
    }>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    // Index for querying by order
    index("notification_logs_order_idx").on(table.orderId),
    // Index for log retention queries
    index("notification_logs_created_idx").on(table.createdAt),
    // Index for tenant + status queries
    index("notification_logs_tenant_status_idx").on(
      table.tenantId,
      table.status
    ),
    // RLS Policy: Logs are tenant-isolated
    pgPolicy("notification_logs_tenant_isolation_select", {
      for: "select",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("notification_logs_tenant_isolation_insert", {
      for: "insert",
      withCheck: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("notification_logs_tenant_isolation_update", {
      for: "update",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("notification_logs_tenant_isolation_delete", {
      for: "delete",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
  ]
);

// Type export for use in application code
export type NotificationLog = typeof notificationLogs.$inferSelect;
export type NewNotificationLog = typeof notificationLogs.$inferInsert;