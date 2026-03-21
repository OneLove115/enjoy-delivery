import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  pgPolicy,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Branding configuration stored as JSONB
export type BrandingConfig = {
  logoSquare?: string;
  logoHorizontal?: string;
  primaryColor?: string;
  accentColor?: string;
  buttonColor?: string;
  tagline?: string;
  contactEmail?: string;
  socialLinks?: Array<{
    platform: string;
    url: string;
  }>;
};

// Business hours stored as JSONB
export type BusinessHours = {
  [day: string]: {
    open: string;
    close: string;
    closed: boolean;
  };
};

// Onboarding progress data stored as JSONB
export type OnboardingData = {
  address?: string;
  phone?: string;
  timezone?: string;
  firstMenuItem?: {
    name: string;
    description: string;
    price: string;
    categoryId: string;
  };
  selectedTier?: string;
};

export const tenants = pgTable(
  "tenants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    subdomain: text("subdomain").unique().notNull(),
    customDomain: text("custom_domain").unique(),
    status: text("status").notNull().default("pending"), // pending, active, deleted
    branding: jsonb("branding").$type<BrandingConfig>(),
    businessHours: jsonb("business_hours").$type<BusinessHours>(),
    timezone: text("timezone").default("America/New_York"),
    locale: text("locale").notNull().default("en-US"),
    currency: text("currency").notNull().default("USD"),
    country: text("country").notNull().default("US"),
    subscriptionTier: text("subscription_tier").notNull().default("starter"),
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    address: text("address"),
    phone: text("phone"),
    onboardingCompleted: text("onboarding_completed").default("false"), // 'true' or 'false'
    onboardingStep: text("onboarding_step"), // Current step ID
    onboardingData: jsonb("onboarding_data").$type<OnboardingData>(),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    // RLS Policy: Tenants can only see their own row
    pgPolicy("tenant_isolation_select", {
      for: "select",
      using: sql`${table.id} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("tenant_isolation_update", {
      for: "update",
      using: sql`${table.id} = current_setting('app.current_tenant', true)::uuid`,
    }),
  ]
);

// Type export for use in application code
export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;