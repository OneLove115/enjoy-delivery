import { db } from "./index";
import { sql } from "drizzle-orm";

const TENANT_TABLES = [
  "tenants",
  "users",
  "invitations",
  "audit_logs",
  "menu_categories",
  "menu_items",
  "modifier_groups",
  "modifiers",
  "tenant_settings",
  "notification_preferences",
  "notification_logs",
  "orders",
  "payments",
  "conversations",
  "conversation_messages",
  "phone_numbers",
  "ai_configurations",
  "ai_conversations",
  "ai_conversation_turns",
  "drivers",
  "deliveries",
  "driver_push_subscriptions",
  "subscriptions",
  "notification_settings",
];

async function enableRLS() {
  console.log("🔒 Enabling Row-Level Security on all tables...");
  
  for (const table of TENANT_TABLES) {
    try {
      console.log(`Processing ${table}...`);
      await db.execute(sql.raw(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY`));
      await db.execute(sql.raw(`ALTER TABLE "${table}" FORCE ROW LEVEL SECURITY`));
      console.log(`✅ RLS enabled and forced for ${table}`);
    } catch (error: any) {
      console.error(`❌ Failed to enable RLS for ${table}:`);
      console.error(error);
    }
  }
  
  process.exit(0);
}

enableRLS().catch(console.error);
