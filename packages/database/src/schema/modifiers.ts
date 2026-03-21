import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  boolean,
  numeric,
  index,
  pgPolicy,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { tenants } from "./tenants";
import { modifierGroups } from "./modifier-groups";
import { menuItems } from "./menu-items";

export const modifiers = pgTable(
  "modifiers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    groupId: uuid("group_id")
      .notNull()
      .references(() => modifierGroups.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    priceAdjustment: numeric("price_adjustment", { precision: 10, scale: 2 }).default("0"),
    isAvailable: boolean("is_available").default(true).notNull(),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    // Index for group queries
    index("modifiers_group_idx").on(table.groupId),
    // Index for tenant queries
    index("modifiers_tenant_idx").on(table.tenantId),
    // RLS Policy: Modifiers are tenant-isolated
    pgPolicy("modifiers_tenant_isolation_select", {
      for: "select",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("modifiers_tenant_isolation_insert", {
      for: "insert",
      withCheck: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("modifiers_tenant_isolation_update", {
      for: "update",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
    pgPolicy("modifiers_tenant_isolation_delete", {
      for: "delete",
      using: sql`${table.tenantId} = current_setting('app.current_tenant', true)::uuid`,
    }),
  ]
);

// Junction table for many-to-many relationship between menu items and modifier groups
export const menuItemModifierGroups = pgTable(
  "menu_item_modifier_groups",
  {
    menuItemId: uuid("menu_item_id")
      .notNull()
      .references(() => menuItems.id, { onDelete: "cascade" }),
    modifierGroupId: uuid("modifier_group_id")
      .notNull()
      .references(() => modifierGroups.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").default(0),
  },
  (table) => [
    // Composite primary key
    index("menu_item_modifier_groups_pk").on(table.menuItemId, table.modifierGroupId),
  ]
);

// Type export for use in application code
export type Modifier = typeof modifiers.$inferSelect;
export type NewModifier = typeof modifiers.$inferInsert;
export type MenuItemModifierGroup = typeof menuItemModifierGroups.$inferSelect;
export type NewMenuItemModifierGroup = typeof menuItemModifierGroups.$inferInsert;