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

// Audit action types
export type AuditAction =
  | "login.success"
  | "login.failed"
  | "logout"
  | "password.reset"
  | "email.verified"
  | "role.changed"
  | "team.invited"
  | "team.joined"
  | "team.removed"
  | "settings.changed"
  | "onboarding.completed"
  | "tenant.created"
  | "tenant.deleted"
  | "driver.created"
  | "driver.updated"
  | "driver.deactivated"
  | "driver.availability_changed"
  | "delivery.created"
  | "delivery.status_changed"
  | "delivery.driver_assigned";

// Entity types that can be audited
export type EntityType =
  | "user"
  | "tenant"
  | "invitation"
  | "menu_item"
  | "order"
  | "settings"
  | "driver"
  | "delivery";

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull(),
    userId: uuid("user_id"),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: uuid("entity_id"),
    oldValues: jsonb("old_values"),
    newValues: jsonb("new_values"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    // Index for efficient querying by tenant with time ordering
    index("audit_logs_tenant_created_idx").on(table.tenantId, table.createdAt),
    // Index for filtering by action type
    index("audit_logs_action_idx").on(table.action),
    // Index for filtering by user
    index("audit_logs_user_idx").on(table.userId),
    // RLS Policy: Audit logs can only be seen by users in the same tenant
    pgPolicy("audit_log_tenant_isolation", {
      for: "select",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    // Insert policy - allow inserting with the current tenant context
    pgPolicy("audit_log_insert", {
      for: "insert",
      withCheck: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
  ]
);

// Type export for use in application code
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;