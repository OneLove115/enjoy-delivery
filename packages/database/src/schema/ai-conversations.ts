/**
 * AI Conversation Logging Tables
 *
 * Stores conversation history for quality assurance and analysis.
 * Includes summary and detailed turn-by-turn logs with privacy protections.
 */

import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgPolicy,
  integer,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { tenants } from "./tenants";
import { orders } from "./orders";

// AI conversation outcome constants
export const AI_OUTCOME = {
  ORDER_PLACED: "order_placed",
  ESCALATED: "escalated",
  ABANDONED: "abandoned",
  HUMAN_CORRECTED: "human_corrected",
} as const;

export type AIConversationOutcome = (typeof AI_OUTCOME)[keyof typeof AI_OUTCOME];

/**
 * Summary of a complete conversation
 */
export const aiConversations = pgTable(
  "ai_conversations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),

    // Call identification
    callSid: text("call_sid").notNull().unique(), // Twilio call SID
    channel: text("channel").default("phone"), // phone, sms, whatsapp

    // Customer info (PII protection)
    phoneNumber: text("phone_number"), // Last 4 digits only
    fullPhoneNumber: text("full_phone_number"), // Encrypted

    // Order linkage
    orderId: uuid("order_id").references(() => orders.id, {
      onDelete: "set null",
    }),

    // Conversation metadata
    status: text("status").default("completed"), // completed, transferred, abandoned, error
    outcome: text("outcome"), // order_placed, escalated, abandoned, human_corrected
    escalationReason: text("escalation_reason"), // Why was it transferred

    // Metrics
    durationSeconds: integer("duration_seconds"),
    itemCount: integer("item_count").default(0), // Items ordered
    toolCallCount: integer("tool_call_count").default(0), // Tool calls made

    // Satisfaction
    customerSatisfied: boolean("customer_satisfied"), // From follow-up survey

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    // Indexes for common queries
    index("ai_conversations_tenant_idx").on(table.tenantId),
    index("ai_conversations_order_idx").on(table.orderId),
    index("ai_conversations_created_idx").on(table.createdAt),
    index("ai_conversations_status_idx").on(table.status),
    index("ai_conversations_outcome_idx").on(table.outcome),
    index("ai_conversations_channel_idx").on(table.channel),

    // RLS policies
    pgPolicy("ai_conversations_tenant_isolation_select", {
      for: "select",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("ai_conversations_tenant_isolation_insert", {
      for: "insert",
      withCheck: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("ai_conversations_tenant_isolation_update", {
      for: "update",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("ai_conversations_tenant_isolation_delete", {
      for: "delete",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
  ]
);

/**
 * Turn-by-turn conversation details
 */
export const aiConversationTurns = pgTable(
  "ai_conversation_turns",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => aiConversations.id, { onDelete: "cascade" }),

    // Turn metadata
    turnIndex: integer("turn_index").notNull(), // 0-based index
    role: text("role").notNull(), // user, assistant, tool

    // Content
    content: text("content"), // The message text

    // Timestamps
    timestamp: timestamp("timestamp").defaultNow().notNull(),
  },
  (table) => [
    // Index for conversation lookup
    index("ai_conversation_turns_conversation_idx").on(table.conversationId),
  ]
);

// Type exports
export type AIConversation = typeof aiConversations.$inferSelect;
export type NewAIConversation = typeof aiConversations.$inferInsert;
export type AIConversationTurn = typeof aiConversationTurns.$inferSelect;
export type NewAIConversationTurn = typeof aiConversationTurns.$inferInsert;
