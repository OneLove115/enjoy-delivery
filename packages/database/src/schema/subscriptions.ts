import { pgTable, uuid, text, timestamp, numeric, jsonb, index } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";

export const SUBSCRIPTION_TIER = {
  STARTER: "starter",
  GROWTH: "growth",
  PRO: "pro",
  ENTERPRISE: "enterprise",
} as const;

export type SubscriptionTier = (typeof SUBSCRIPTION_TIER)[keyof typeof SUBSCRIPTION_TIER];

export const SUBSCRIPTION_STATUS = {
  ACTIVE: "active",
  PAST_DUE: "past_due",
  CANCELLED: "cancelled",
  TRIALING: "trialing",
  INCOMPLETE: "incomplete",
} as const;

export const TIER_FEATURES: Record<SubscriptionTier, string[]> = {
  starter: [
    "web_ordering",
    "menu_management",
    "order_dashboard",
    "basic_analytics",
  ],
  growth: [
    "web_ordering",
    "menu_management",
    "order_dashboard",
    "basic_analytics",
    "sms_ordering",
    "whatsapp_ordering",
    "kitchen_display",
    "thermal_printer",
    "auto_website",
    "advanced_analytics",
  ],
  pro: [
    "web_ordering",
    "menu_management",
    "order_dashboard",
    "basic_analytics",
    "sms_ordering",
    "whatsapp_ordering",
    "kitchen_display",
    "thermal_printer",
    "auto_website",
    "advanced_analytics",
    "delivery_management",
    "live_map",
    "driver_management",
    "geofencing",
    "custom_domain",
  ],
  enterprise: [
    "web_ordering",
    "menu_management",
    "order_dashboard",
    "basic_analytics",
    "sms_ordering",
    "whatsapp_ordering",
    "kitchen_display",
    "thermal_printer",
    "auto_website",
    "advanced_analytics",
    "delivery_management",
    "live_map",
    "driver_management",
    "geofencing",
    "custom_domain",
    "ai_phone_ordering",
    "ai_metrics",
    "api_access",
    "video_marketing",
    "unlimited_team",
    "unlimited_drivers",
  ],
};

export const TIER_LIMITS: Record<SubscriptionTier, { orders: number; team: number; drivers: number }> = {
  starter: { orders: 100, team: 1, drivers: 0 },
  growth: { orders: 500, team: 3, drivers: 0 },
  pro: { orders: -1, team: 10, drivers: 10 }, // -1 = unlimited
  enterprise: { orders: -1, team: -1, drivers: -1 },
};

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" })
      .unique(),
    stripeCustomerId: text("stripe_customer_id").notNull(),
    stripeSubscriptionId: text("stripe_subscription_id").unique(),
    stripePriceId: text("stripe_price_id"),
    tier: text("tier").notNull().default(SUBSCRIPTION_TIER.STARTER),
    status: text("status").notNull().default(SUBSCRIPTION_STATUS.ACTIVE),
    currentPeriodStart: timestamp("current_period_start"),
    currentPeriodEnd: timestamp("current_period_end"),
    cancelAtPeriodEnd: text("cancel_at_period_end").default("false"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("subscriptions_tenant_idx").on(table.tenantId),
    index("subscriptions_stripe_customer_idx").on(table.stripeCustomerId),
  ]
);
