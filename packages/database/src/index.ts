import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sql } from "drizzle-orm";
import * as schema from "./schema";
import { ContextGuardian } from "../security/ContextGuardian";

if (process.env.DATABASE_URL) {
  // Better masking: hide password but keep username/host
  const maskedUrl = process.env.DATABASE_URL.replace(/(:\/\/)([^:]+):([^@]+)(@)/, "$1$2:****$4");
  console.log(`[DB] Using connection: ${maskedUrl}`);
} else {
  console.error("[DB] No DATABASE_URL found in environment or .env files");
}

// Create the connection pool using standard pg driver
// Works with both Neon (via standard connection string) and Railway Postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("sslmode=disable")
    ? false
    : { rejectUnauthorized: false },
});

// Create the Drizzle client with all schema relations
export const db = drizzle(pool, { schema });

/**
 * Execute a function within a tenant context for Row-Level Security.
 * This uses Drizzle's transaction to ensure all queries within the block 
 * share the same connection and session variables.
 *
 * @param tenantId - The tenant UUID to set as context
 * @param fn - The function to execute within the tenant context, receives the transaction object
 * @returns The result of the function
 */
export async function withTenantContext<T>(
  tenantId: string,
  fn: (tx: any) => Promise<T>
): Promise<T> {
  return await ContextGuardian.run(tenantId, async () => {
    return await db.transaction(async (tx) => {
      // Set the session variable for Postgres RLS
      await tx.execute(sql`SET LOCAL app.current_tenant = ${tenantId}`);
      return await fn(tx);
    });
  });
}

/**
 * Execute a function within a transaction.
 * Useful for operations that need atomicity but don't require tenant context.
 *
 * @param fn - The function to execute within the transaction
 * @returns The result of the function
 */
export async function transaction<T>(fn: () => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn();
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// Export types for convenience
export type { Tenant, NewTenant, BrandingConfig, BusinessHours } from "./schema/tenants";
export type { User, NewUser, UserRole } from "./schema/users";
export type { Invitation, NewInvitation, InvitationRole } from "./schema/invitations";
export type { AuditLog, NewAuditLog, AuditAction, EntityType } from "./schema/audit-logs";
export type { Payment, NewPayment, PaymentStatus, ProcessedWebhookEvent, NewProcessedWebhookEvent } from "./schema/payments";
export type { NotificationPreference, NewNotificationPreference } from "./schema/notification-preferences";
export type { NotificationLog, NewNotificationLog } from "./schema/notification-logs";
// Order types are exported from @/types/order for consistency