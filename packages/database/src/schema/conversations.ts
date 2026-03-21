/**
 * Messaging Conversation Tables
 *
 * Stores conversation history for SMS and WhatsApp sessions.
 * Used for quality review, debugging, and session restoration.
 * Conversations are separate from the voice AI conversation logs (ai-conversations.ts).
 */

import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  pgPolicy,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { tenants } from "./tenants";
import { SessionContext } from "@/lib/sessions/types";

/**
 * Messaging conversation summary record.
 * Created when a session starts and updated as it progresses.
 * Persists after session expires (for history).
 */
export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),

    // Customer identification
    customerPhone: text("customer_phone").notNull(),
    channel: text("channel").notNull(), // 'sms' | 'whatsapp'

    // Conversation status
    status: text("status").notNull().default("browsing"), // browsing, ordering, confirming, completed, abandoned

    // Session context snapshot (cart, delivery address, customer info)
    context: jsonb("context").$type<SessionContext>().default({}),

    // Session timing
    startedAt: timestamp("started_at").defaultNow().notNull(),
    endedAt: timestamp("ended_at"), // null if still active
    lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
  },
  (table) => [
    // Indexes for common queries
    index("conversations_tenant_idx").on(table.tenantId),
    index("conversations_phone_idx").on(table.customerPhone),
    index("conversations_tenant_phone_channel_idx").on(
      table.tenantId,
      table.customerPhone,
      table.channel
    ),
    index("conversations_last_message_idx").on(table.lastMessageAt),
    index("conversations_status_idx").on(table.status),

    // RLS policies for tenant isolation
    pgPolicy("conversations_tenant_isolation_select", {
      for: "select",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("conversations_tenant_isolation_insert", {
      for: "insert",
      withCheck: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("conversations_tenant_isolation_update", {
      for: "update",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("conversations_tenant_isolation_delete", {
      for: "delete",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
  ]
);

/**
 * Individual message records for each turn in a conversation.
 * Appended in real time as messages are exchanged.
 */
export const conversationMessages = pgTable(
  "conversation_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),

    // Message content
    role: text("role").notNull(), // 'user' | 'assistant' | 'system'
    content: text("content").notNull(),

    // Tool interaction data (nullable)
    toolCalls: jsonb("tool_calls").$type<
      Array<{
        id: string;
        name: string;
        input: Record<string, unknown>;
        result?: Record<string, unknown>;
      }>
    >(),

    // Timestamp
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    // Index for conversation message lookup (ordered by time)
    index("conversation_messages_conversation_idx").on(table.conversationId),
    index("conversation_messages_created_idx").on(table.createdAt),
  ]
);

// Type exports
export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type ConversationMessage = typeof conversationMessages.$inferSelect;
export type NewConversationMessage = typeof conversationMessages.$inferInsert;
