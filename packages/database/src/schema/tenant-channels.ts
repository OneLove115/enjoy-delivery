// src/lib/db/schema/tenant-channels.ts
import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgPolicy,
  unique,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { tenants } from "./tenants";

/**
 * Tenant Channels Table
 *
 * Maps a restaurant's existing phone/WhatsApp number (owner_number)
 * to a hidden Twilio relay number (relay_number) used for AI routing.
 * Voice routing reads from phone_numbers; this table is the UI source of truth.
 */
export const tenantChannels = pgTable(
  "tenant_channels",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    channelType: text("channel_type").notNull(), // 'phone' | 'whatsapp' | 'sms'
    ownerNumber: text("owner_number").notNull(),       // restaurant's real number (E.164)
    relayNumber: text("relay_number"),                 // hidden Twilio relay (voice routing)
    relaySid: text("relay_sid"),                       // Twilio SID for relay
    status: text("status").notNull().default("pending"), // pending|verifying|active|inactive
    verificationCode: text("verification_code"),       // 6-digit code (cleared after verify)
    codeExpiresAt: timestamp("code_expires_at"),       // code expiry (10 min)
    verifiedAt: timestamp("verified_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique().on(table.tenantId, table.channelType),
    pgPolicy("tenant_channels_service_all", {
      for: "all",
      using: sql`true`,
      withCheck: sql`true`,
    }),
  ]
);

export type TenantChannel = typeof tenantChannels.$inferSelect;
export type NewTenantChannel = typeof tenantChannels.$inferInsert;
