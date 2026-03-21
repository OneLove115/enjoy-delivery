/**
 * AI Configuration Table
 *
 * Stores tenant-specific AI settings for voice ordering customization.
 * Includes greeting, tone, upsell behavior, and escalation settings.
 */

import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  jsonb,
  pgPolicy,
  integer,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { tenants } from "./tenants";

export const aiConfigurations = pgTable(
  "ai_configurations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),

    // Voice greeting and personality
    greeting: text("greeting").default(
      "Thank you for calling! How can I help you today?"
    ),
    tone: text("tone").default("friendly"), // friendly, professional, casual

    // Upselling configuration
    upsellEnabled: boolean("upsell_enabled").default(true),
    upsellItems: jsonb("upsell_items").default([]), // Array of item names to suggest

    // Order confirmation style
    confirmationStyle: text("confirmation_style").default("detailed"), // detailed, brief

    // Escalation settings
    escalationNumber: text("escalation_number"), // Phone number to transfer to
    escalationMessage: text("escalation_message").default(
      "Let me transfer you to someone who can help."
    ),

    // Business hours (as JSONB for flexibility)
    businessHours: jsonb("business_hours"), // { "0": { "open": "11:00", "close": "22:00" }, ...}
    timezone: text("timezone").default("America/Los_Angeles"),

    // Voice synthesis settings
    voiceId: text("voice_id"), // ElevenLabs voice ID
    voiceSpeed: text("voice_speed").default("normal"), // slow, normal, fast

    // Call settings
    maxCallDuration: integer("max_call_duration").default(600), // seconds (10 minutes)
    silenceTimeout: integer("silence_timeout").default(30), // seconds

    // Call recording
    recordCalls: boolean("record_calls").default(false),
    callRetentionDays: integer("call_retention_days").default(90),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    // Unique constraint: one config per tenant
    pgPolicy("ai_configurations_tenant_isolation_select", {
      for: "select",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("ai_configurations_tenant_isolation_update", {
      for: "update",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("ai_configurations_tenant_isolation_delete", {
      for: "delete",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
  ]
);

// Type exports
export type AIConfiguration = typeof aiConfigurations.$inferSelect;
export type NewAIConfiguration = typeof aiConfigurations.$inferInsert;
