import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  pgPolicy,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { tenants } from "./tenants";

/**
 * Tenant Phone Numbers Table
 *
 * Stores phone numbers provisioned via Twilio for each restaurant.
 * Each number maps to a Twilio subaccount for tenant isolation.
 * Supports incoming calls for AI ordering.
 */
export const phoneNumbers = pgTable(
  "phone_numbers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    phoneNumber: text("phone_number").notNull(), // E.164 format: +1234567890
    phoneNumberSid: text("phone_number_sid").notNull().unique(), // Twilio SID
    accountSid: text("account_sid").notNull(), // Twilio subaccount SID
    friendlyName: text("friendly_name"), // Display name for the number
    voiceUrl: text("voice_url"), // Webhook URL for incoming calls
    statusCallback: text("status_callback"), // Webhook URL for call status updates
    isActive: boolean("is_active").default(true).notNull(), // Can be disabled without releasing
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    // RLS Policy: Tenants can only see their own phone numbers
    pgPolicy("phone_numbers_tenant_isolation_select", {
      for: "select",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("phone_numbers_tenant_isolation_update", {
      for: "update",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("phone_numbers_tenant_isolation_delete", {
      for: "delete",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
  ]
);

// Type exports
export type PhoneNumber = typeof phoneNumbers.$inferSelect;
export type NewPhoneNumber = typeof phoneNumbers.$inferInsert;
