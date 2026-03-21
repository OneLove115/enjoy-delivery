import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
  pgPolicy,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { tenants } from "./tenants";

// Invitation roles (owner is only via ownership transfer)
export type InvitationRole = "manager" | "staff" | "driver";

export const invitations = pgTable(
  "invitations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: text("role").notNull(), // manager, staff, driver
    token: text("token").unique().notNull(), // nanoid 21 chars for invite URL
    invitedBy: uuid("invited_by"), // User who sent the invitation
    expiresAt: timestamp("expires_at").notNull(),
    acceptedAt: timestamp("accepted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    // Index for fast token lookup
    index("invitations_token_idx").on(table.token),
    // Index for listing invitations by tenant
    index("invitations_tenant_idx").on(table.tenantId),
    // RLS Policy: Invitations can only be seen by users in the same tenant
    pgPolicy("invitation_tenant_isolation_select", {
      for: "select",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("invitation_tenant_isolation_insert", {
      for: "insert",
      withCheck: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("invitation_tenant_isolation_delete", {
      for: "delete",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
  ]
);

// Type export for use in application code
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;