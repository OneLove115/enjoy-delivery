import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  index,
  pgPolicy,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { tenants } from "./tenants";

// User roles in the system
export type UserRole = "owner" | "manager" | "staff" | "driver";

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash"),
    name: text("name"),
    role: text("role").notNull().default("staff"), // owner, manager, staff, driver
    emailVerified: timestamp("email_verified"),
    image: text("image"), // Profile image URL
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    // Index for email lookup
    index("users_email_idx").on(table.email),
    // Index for tenant lookup
    index("users_tenant_idx").on(table.tenantId),
    // RLS Policy: Users can only see users in their tenant
    pgPolicy("user_tenant_isolation_select", {
      for: "select",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("user_tenant_isolation_insert", {
      for: "insert",
      withCheck: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("user_tenant_isolation_update", {
      for: "update",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("user_tenant_isolation_delete", {
      for: "delete",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
  ]
);

// Auth.js requires these tables for OAuth
export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // oauth, email, credentials
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => [
    index("accounts_user_idx").on(table.userId),
  ]
);

// Auth.js sessions table (not used with JWT strategy, but required by adapter)
export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionToken: text("session_token").notNull().unique(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires").notNull(),
  },
  (table) => [
    index("sessions_session_token_idx").on(table.sessionToken),
    index("sessions_user_idx").on(table.userId),
  ]
);

// Auth.js verification tokens table
export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires").notNull(),
  },
  (table) => [
    index("verification_tokens_token_idx").on(table.token),
  ]
);

// Type export for use in application code
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Account = typeof accounts.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type VerificationToken = typeof verificationTokens.$inferSelect;