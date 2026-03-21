import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  numeric,
  pgPolicy,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { tenants } from "./tenants";
import { users } from "./users";

// Order source constants
export const ORDER_SOURCE = {
  WEB: "web",
  SMS: "sms",
  WHATSAPP: "whatsapp",
  PHONE: "phone",
  WEBCHAT: "webchat",
} as const;

export type OrderSource = (typeof ORDER_SOURCE)[keyof typeof ORDER_SOURCE];

// Order status constants
export const ORDER_STATUS = {
  PENDING_PAYMENT: "pending_payment",
  PENDING_ACCEPTANCE: "pending_acceptance",
  PREPARING: "preparing",
  READY_FOR_PICKUP: "ready_for_pickup",
  OUT_FOR_DELIVERY: "out_for_delivery",
  COMPLETED: "completed",
  PAYMENT_FAILED: "payment_failed",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

// Order item stored as JSONB
export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  basePrice: number;
  modifiers: {
    groupId: string;
    groupName: string;
    modifierId: string;
    name: string;
    priceAdjustment: number;
  }[];
  specialInstructions?: string;
}

// Delivery address stored as JSONB
export interface DeliveryAddress {
  street: string;
  apt?: string;
  city: string;
  state: string;
  zip: string;
  lat?: number;
  lng?: number;
}

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }), // nullable for guest
    orderNumber: text("order_number").notNull().unique(),
    status: text("status").notNull().default(ORDER_STATUS.PENDING_PAYMENT),
    items: jsonb("items").notNull().$type<OrderItem[]>(),
    subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
    tax: numeric("tax", { precision: 10, scale: 2 }).notNull().default("0"),
    deliveryFee: numeric("delivery_fee", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    tip: numeric("tip", { precision: 10, scale: 2 }).notNull().default("0"),
    total: numeric("total", { precision: 10, scale: 2 }).notNull(),
    orderType: text("order_type").notNull(), // 'delivery' or 'pickup'
    deliveryAddress: jsonb("delivery_address").$type<DeliveryAddress | null>(),
    specialInstructions: text("special_instructions"),
    customerEmail: text("customer_email").notNull(),
    customerPhone: text("customer_phone").notNull(),
    customerName: text("customer_name").notNull(),
    estimatedReadyAt: timestamp("estimated_ready_at"),
    acceptedAt: timestamp("accepted_at"),
    completedAt: timestamp("completed_at"),
    cancelledAt: timestamp("cancelled_at"),
    cancellationReason: text("cancellation_reason"),
    source: text("source").notNull().default("web"), // 'web' | 'sms' | 'whatsapp' | 'phone'
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    // Indexes for common queries
    index("orders_tenant_status_idx").on(table.tenantId, table.status),
    index("orders_tenant_created_idx").on(table.tenantId, table.createdAt),
    index("orders_user_idx").on(table.userId),
    index("orders_number_idx").on(table.orderNumber),
    index("orders_source_idx").on(table.tenantId, table.source),
    // RLS Policies for tenant isolation
    pgPolicy("orders_tenant_isolation_select", {
      for: "select",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("orders_tenant_isolation_insert", {
      for: "insert",
      withCheck: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("orders_tenant_isolation_update", {
      for: "update",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("orders_tenant_isolation_delete", {
      for: "delete",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
  ]
);

// Type exports
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;