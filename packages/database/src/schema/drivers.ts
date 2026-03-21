import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  numeric,
  integer,
  index,
  pgPolicy,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { tenants } from "./tenants";
import { users } from "./users";

// Driver status constants
export const DRIVER_STATUS = {
  AVAILABLE: "available",
  BUSY: "busy",
  OFFLINE: "offline",
} as const;

export type DriverStatus = (typeof DRIVER_STATUS)[keyof typeof DRIVER_STATUS];

// Vehicle type constants
export const VEHICLE_TYPE = {
  CAR: "car",
  MOTORCYCLE: "motorcycle",
  BICYCLE: "bicycle",
  SCOOTER: "scooter",
} as const;

export type VehicleType = (typeof VEHICLE_TYPE)[keyof typeof VEHICLE_TYPE];

// Driver location stored as JSONB for flexibility
export interface DriverLocation {
  lat: number;
  lng: number;
  accuracy?: number; // in meters
  updatedAt: string; // ISO timestamp
}

/**
 * Driver profiles extend users with role='driver' with vehicle and location info.
 * Linked to users table via userId FK.
 */
export const drivers = pgTable(
  "drivers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // Vehicle information
    vehicleType: text("vehicle_type").notNull().default("car"),
    vehicleColor: text("vehicle_color"),
    vehiclePlate: text("vehicle_plate"),
    licenseNumber: text("license_number"),
    // Current status
    currentStatus: text("current_status").notNull().default(DRIVER_STATUS.OFFLINE),
    // Current location (stored as JSONB for flexibility, also tracked in Redis GEO)
    currentLocation: numeric("current_location", { precision: 9, scale: 6 }).array(),
    lastLocationUpdate: timestamp("last_location_update"),
    // Performance metrics
    avgDeliveryTime: integer("avg_delivery_time"), // in seconds
    totalDeliveries: integer("total_deliveries").notNull().default(0),
    rating: numeric("rating", { precision: 3, scale: 2 }), // 0.00 to 5.00
    // Active status
    isActive: boolean("is_active").notNull().default(true),
    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    // Indexes for common queries
    index("drivers_tenant_idx").on(table.tenantId),
    index("drivers_user_idx").on(table.userId),
    index("drivers_status_idx").on(table.tenantId, table.currentStatus),
    index("drivers_active_idx").on(table.tenantId, table.isActive),
    // RLS Policies for tenant isolation
    pgPolicy("drivers_tenant_isolation_select", {
      for: "select",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("drivers_tenant_isolation_insert", {
      for: "insert",
      withCheck: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("drivers_tenant_isolation_update", {
      for: "update",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("drivers_tenant_isolation_delete", {
      for: "delete",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
  ]
);

// Type exports
export type Driver = typeof drivers.$inferSelect;
export type NewDriver = typeof drivers.$inferInsert;