import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  integer,
  index,
  pgPolicy,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { tenants } from "./tenants";
import { orders } from "./orders";
import { drivers } from "./drivers";

// Delivery status constants - matches delivery state machine
export const DELIVERY_STATUS = {
  PENDING: "pending",
  ASSIGNED: "assigned",
  PICKED_UP: "picked_up",
  OUT_FOR_DELIVERY: "out_for_delivery",
  ARRIVING: "arriving",
  DELIVERED: "delivered",
  FAILED: "failed",
} as const;

export type DeliveryStatus = (typeof DELIVERY_STATUS)[keyof typeof DELIVERY_STATUS];

// Location stored as JSONB
export interface DeliveryLocation {
  lat: number;
  lng: number;
  address: string;
  placeId?: string; // Google Place ID for reference
}

// Delivery notes stored as JSONB
export interface DeliveryNotes {
  pickup?: string;
  dropoff?: string;
  driver?: string;
}

/**
 * Deliveries link orders to drivers and track delivery progress.
 * Each delivery has pickup and dropoff locations with status tracking.
 */
export const deliveries = pgTable(
  "deliveries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    driverId: uuid("driver_id")
      .references(() => drivers.id, { onDelete: "set null" }), // Nullable for unassigned
    // Status tracking
    status: text("status").notNull().default(DELIVERY_STATUS.PENDING),
    // Locations
    pickupLocation: jsonb("pickup_location").notNull().$type<DeliveryLocation>(),
    dropoffLocation: jsonb("dropoff_location").notNull().$type<DeliveryLocation>(),
    // Timing
    eta: integer("eta"), // Estimated time of arrival in minutes
    actualDeliveryTime: timestamp("actual_delivery_time"),
    // Pickup/delivery timestamps
    assignedAt: timestamp("assigned_at"),
    pickedUpAt: timestamp("picked_up_at"),
    outForDeliveryAt: timestamp("out_for_delivery_at"),
    // Notes
    notes: jsonb("notes").$type<DeliveryNotes>(),
    // Failure tracking
    failureReason: text("failure_reason"),
    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    // Indexes for common queries
    index("deliveries_tenant_idx").on(table.tenantId),
    index("deliveries_order_idx").on(table.orderId),
    index("deliveries_driver_idx").on(table.driverId),
    index("deliveries_status_idx").on(table.tenantId, table.status),
    index("deliveries_created_idx").on(table.tenantId, table.createdAt),
    // RLS Policies for tenant isolation
    pgPolicy("deliveries_tenant_isolation_select", {
      for: "select",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("deliveries_tenant_isolation_insert", {
      for: "insert",
      withCheck: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("deliveries_tenant_isolation_update", {
      for: "update",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("deliveries_tenant_isolation_delete", {
      for: "delete",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
  ]
);

// Type exports
export type Delivery = typeof deliveries.$inferSelect;
export type NewDelivery = typeof deliveries.$inferInsert;