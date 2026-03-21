import {
  pgTable,
  uuid,
  jsonb,
  boolean,
  timestamp,
  pgPolicy,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { tenants } from "./tenants";

// Day hours structure
export interface DayHours {
  open: string; // Format: "HH:MM" (24-hour)
  close: string; // Format: "HH:MM" (24-hour)
  closed: boolean;
}

// Delivery settings configuration
export interface DeliverySettings {
  enabled: boolean;
  type: "flat" | "distance" | "free_over_threshold";
  flatFee: number; // in dollars
  perMileRate: number; // in dollars per mile
  freeOverThreshold: number; // in dollars
  maxDeliveryDistance: number; // in miles
  deliveryZones?: DeliveryZone[];
}

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  // For Phase 5: add geographic boundaries
}

// Order settings configuration
export interface OrderSettings {
  acceptOrders: boolean; // Pause ordering
  autoAccept: boolean; // Skip pending_acceptance
  estimatedPrepTime: number; // Default minutes
  minOrderAmount: number; // Minimum order in dollars
  specialInstructionsEnabled: boolean;
}

// Payment provider settings
export interface PaymentSettings {
  provider: "stripe" | "square";
  // Stripe settings (for future Stripe Connect)
  stripeAccountId?: string;
  stripePublicKey?: string;
  // Square settings
  squareApplicationId?: string;
  squareLocationId?: string;
  // Encrypted tokens stored separately for security
  // These are stored in the database but encrypted at rest
  squareAccessTokenEncrypted?: string;
  // Test mode toggle
  testMode: boolean;
}

// Default business hours (9am-10pm weekdays, 10am-11pm weekends)
const defaultBusinessHours = {
  monday: { open: "09:00", close: "22:00", closed: false },
  tuesday: { open: "09:00", close: "22:00", closed: false },
  wednesday: { open: "09:00", close: "22:00", closed: false },
  thursday: { open: "09:00", close: "22:00", closed: false },
  friday: { open: "09:00", close: "23:00", closed: false },
  saturday: { open: "10:00", close: "23:00", closed: false },
  sunday: { open: "10:00", close: "22:00", closed: false },
};

// Default delivery settings
const defaultDeliverySettings: DeliverySettings = {
  enabled: true,
  type: "flat",
  flatFee: 5.0,
  perMileRate: 0,
  freeOverThreshold: 25,
  maxDeliveryDistance: 10,
};

// Default order settings
const defaultOrderSettings: OrderSettings = {
  acceptOrders: true,
  autoAccept: false,
  estimatedPrepTime: 20,
  minOrderAmount: 0,
  specialInstructionsEnabled: true,
};

// Default payment settings
const defaultPaymentSettings: PaymentSettings = {
  provider: "stripe",
  testMode: true,
};

// Printer settings configuration
export interface PrinterSettings {
  enabled: boolean; // auto-print on accept toggle (KDS-06)
  printerType: "epson" | "star";
  ipAddress: string; // e.g. "192.168.1.100"
  port: number; // default 9100
  name: string; // display label e.g. "Kitchen Printer"
}

export const tenantSettings = pgTable(
  "tenant_settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id)
      .unique(),
    businessHours: jsonb("business_hours")
      .notNull()
      .$type<Record<string, DayHours>>()
      .default(defaultBusinessHours),
    deliverySettings: jsonb("delivery_settings")
      .notNull()
      .$type<DeliverySettings>()
      .default(defaultDeliverySettings),
    orderSettings: jsonb("order_settings")
      .notNull()
      .$type<OrderSettings>()
      .default(defaultOrderSettings),
    paymentSettings: jsonb("payment_settings")
      .notNull()
      .$type<PaymentSettings>()
      .default(defaultPaymentSettings),
    printerSettings: jsonb("printer_settings")
      .$type<PrinterSettings | null>()
      .default(null),
    widgetEnabled: boolean("widget_enabled").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    // RLS Policy: Tenant can only see their own settings
    pgPolicy("tenant_settings_isolation", {
      for: "all",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
  ]
);

// Type exports for use in application code
export type TenantSettings = typeof tenantSettings.$inferSelect;
export type NewTenantSettings = typeof tenantSettings.$inferInsert;