import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  index,
  pgPolicy,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { tenants } from "./tenants";

/**
 * Stakeholder type for notification settings.
 * Determines which notification channels are available by default.
 */
export const notificationStakeholderEnum = pgEnum("notification_stakeholder", [
  "customer",
  "driver",
  "staff",
]);

/**
 * Channel preferences structure.
 * Each boolean indicates whether that channel is enabled for the stakeholder.
 */
export interface NotificationChannels {
  push: boolean;
  sms: boolean;
  whatsapp: boolean;
  email: boolean;
  emailForStaff: boolean;
}

/**
 * Event-specific overrides (optional).
 * Allows overriding default channel preferences for specific events.
 */
export interface NotificationEvents {
  order_new?: Partial<NotificationChannels>;
  order_confirmed?: Partial<NotificationChannels>;
  order_preparing?: Partial<NotificationChannels>;
  order_ready?: Partial<NotificationChannels>;
  order_out_for_delivery?: Partial<NotificationChannels>;
  order_delivered?: Partial<NotificationChannels>;
  order_cancelled?: Partial<NotificationChannels>;
  driver_assigned?: Partial<NotificationChannels>;
  driver_pickup_ready?: Partial<NotificationChannels>;
}

/**
 * Default channel preferences per stakeholder.
 */
export const DEFAULT_CHANNEL_SETTINGS: Record<
  "customer" | "driver" | "staff",
  NotificationChannels
> = {
  customer: {
    push: false,
    sms: true,
    whatsapp: true,
    email: false,
    emailForStaff: false,
  },
  driver: {
    push: true,
    sms: true,
    whatsapp: false,
    email: false,
    emailForStaff: false,
  },
  staff: {
    push: false,
    sms: false,
    email: true,
    emailForStaff: true,
    whatsapp: false,
  },
};

/**
 * Notification settings for per-stakeholder channel preferences.
 * Restaurant owners can configure which channels each stakeholder type uses.
 */
export const notificationSettings = pgTable(
  "notification_settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    stakeholder: notificationStakeholderEnum("stakeholder").notNull(),
    channels: jsonb("channels")
      .$type<NotificationChannels>()
      .notNull()
      .default(sql`'{"push": false, "sms": true, "whatsapp": false, "email": false, "emailForStaff": false}'::jsonb`),
    events: jsonb("events").$type<NotificationEvents>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    // Index for fast tenant + stakeholder lookups
    index("notification_settings_tenant_stakeholder_idx").on(
      table.tenantId,
      table.stakeholder
    ),
    // RLS Policy: Settings are tenant-isolated
    pgPolicy("notification_settings_tenant_isolation_select", {
      for: "select",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("notification_settings_tenant_isolation_insert", {
      for: "insert",
      withCheck: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("notification_settings_tenant_isolation_update", {
      for: "update",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("notification_settings_tenant_isolation_delete", {
      for: "delete",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
  ]
);

// Type exports for use in application code
export type NotificationSetting = typeof notificationSettings.$inferSelect;
export type NewNotificationSetting = typeof notificationSettings.$inferInsert;