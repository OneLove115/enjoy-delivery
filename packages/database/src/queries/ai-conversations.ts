/**
 * AI Conversation Queries
 *
 * Database operations for logging AI conversations.
 */

import { db } from "../index";
import { aiConversations, aiConversationTurns } from "../schema/ai-conversations";
import { eq, and, gte, lte } from "drizzle-orm";

export type ConversationChannel = "phone" | "sms" | "whatsapp" | "webchat" | "inappchat";
export type ConversationOutcome = "order_placed" | "abandoned" | "escalated";

export interface LogAIConversationParams {
  tenantId: string;
  callSid?: string;
  channel: ConversationChannel;
  phoneNumber: string;
  orderId?: string;
  outcome: ConversationOutcome;
  durationSeconds?: number;
  toolCallCount: number;
}

/**
 * Log an AI conversation to the database.
 * Called when a conversation ends (phone call, chat session, etc.)
 *
 * @param params - Conversation parameters
 * @returns The created conversation ID
 */
export async function logAIConversation(params: LogAIConversationParams): Promise<string> {
  // For voice calls, callSid is required. Generate a placeholder for other channels.
  const callSid = params.callSid || `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const insertData: typeof aiConversations.$inferInsert = {
    tenantId: params.tenantId,
    callSid: callSid,
    channel: params.channel,
    phoneNumber: params.phoneNumber.slice(-4), // Store only last 4 digits for privacy
    fullPhoneNumber: params.phoneNumber, // Full number stored (should be encrypted in production)
    orderId: params.orderId ?? null,
    status: params.outcome === "escalated" ? "transferred" : "completed",
    outcome: params.outcome,
    durationSeconds: params.durationSeconds ?? null,
    toolCallCount: params.toolCallCount,
  };

  const [conversation] = await db
    .insert(aiConversations)
    .values(insertData)
    .returning({ id: aiConversations.id });

  console.log(`[AIConversations] Logged conversation ${conversation.id} with outcome: ${params.outcome}`);

  return conversation.id;
}

/**
 * Get conversation by call SID.
 *
 * @param callSid - Twilio call SID
 * @returns Conversation or null if not found
 */
export async function getConversationByCallSid(callSid: string): Promise<
  | (typeof aiConversations.$inferSelect & {
      turns: (typeof aiConversationTurns.$inferSelect)[];
    })
  | null
> {
  const [conversation] = await db
    .select()
    .from(aiConversations)
    .where(eq(aiConversations.callSid, callSid))
    .limit(1);

  if (!conversation) {
    return null;
  }

  // Fetch turns
  const turns = await db
    .select()
    .from(aiConversationTurns)
    .where(eq(aiConversationTurns.conversationId, conversation.id))
    .orderBy(aiConversationTurns.turnIndex);

  return {
    ...conversation,
    turns,
  };
}

/**
 * Get conversations for a tenant within a date range.
 *
 * @param tenantId - Restaurant tenant ID
 * @param startDate - Start of date range
 * @param endDate - End of date range
 * @returns Array of conversations
 */
export async function getConversationsByTenant(
  tenantId: string,
  startDate?: Date,
  endDate?: Date
): Promise<(typeof aiConversations.$inferSelect)[]> {
  const conditions = [eq(aiConversations.tenantId, tenantId)];

  if (startDate) {
    conditions.push(gte(aiConversations.createdAt, startDate));
  }

  if (endDate) {
    conditions.push(lte(aiConversations.createdAt, endDate));
  }

  return db
    .select()
    .from(aiConversations)
    .where(and(...conditions))
    .orderBy(aiConversations.createdAt);
}