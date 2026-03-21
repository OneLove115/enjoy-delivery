/**
 * Row-Level Security Verification Script
 *
 * Verifies that RLS policies are active on all tenant-scoped tables.
 * Run with: npx tsx src/lib/db/rls-verify.ts
 */

import { db } from "./index";
import { sql } from "drizzle-orm";

// Tables that should have RLS policies
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

interface PolicyInfo {
  [key: string]: unknown;
  schemaname: string;
  tablename: string;
  policyname: string;
  permissive: string;
  roles: string;
  cmd: string;
  qual: string | null;
  with_check: string | null;
}

interface TableRLSInfo {
  [key: string]: unknown;
  tablename: string;
  rowsecurity: boolean;
}

/**
 * Check if RLS is enabled on a table
 */
async function isRLSEnabled(tablename: string): Promise<boolean> {
  try {
    const result = await db.execute<TableRLSInfo>(sql`
      SELECT relname as tablename, relrowsecurity as rowsecurity
      FROM pg_class
      WHERE relname = ${tablename}
      AND relkind = 'r'
    `);

    if (result.rows.length === 0) {
      return false;
    }

    return result.rows[0].rowsecurity;
  } catch {
    return false;
  }
}

/**
 * Get RLS policies for a table
 */
async function getPolicies(tablename: string): Promise<PolicyInfo[]> {
  try {
    const result = await db.execute<PolicyInfo>(sql`
      SELECT
        schemaname,
        tablename,
        policyname,
        permissive,
        roles,
        cmd,
        qual,
        with_check
      FROM pg_policies
      WHERE tablename = ${tablename}
    `);

    return result.rows;
  } catch {
    return [];
  }
}

/**
 * Verify RLS policies reference the tenant context variable
 */
function verifyTenantIsolation(policies: PolicyInfo[]): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  for (const policy of policies) {
    const qualOrCheck = policy.qual || policy.with_check || "";
    if (!qualOrCheck.includes("app.current_tenant")) {
      issues.push(
        `Policy '${policy.policyname}' (${policy.cmd}) does not reference app.current_tenant`
      );
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Main verification function
 */
export async function verifyRLSPolicies(): Promise<{
  passed: boolean;
  results: Array<{
    table: string;
    rlsEnabled: boolean;
    policyCount: number;
    tenantIsolated: boolean;
    issues: string[];
  }>;
  errors: string[];
}> {
  const results: Array<{
    table: string;
    rlsEnabled: boolean;
    policyCount: number;
    tenantIsolated: boolean;
    issues: string[];
  }> = [];

  const errors: string[] = [];
  let passed = true;

  console.log("🔍 Verifying Row-Level Security policies...\n");

  for (const table of TENANT_TABLES) {
    try {
      const rlsEnabled = await isRLSEnabled(table);
      const policies = await getPolicies(table);
      const isolation = verifyTenantIsolation(policies);

      const tableResult = {
        table,
        rlsEnabled,
        policyCount: policies.length,
        tenantIsolated: isolation.valid,
        issues: isolation.issues,
      };

      results.push(tableResult);

      // Output status
      const rlsIcon = rlsEnabled ? "✅" : "❌";
      const policyIcon = policies.length > 0 ? "✅" : "❌";
      const isolationIcon = isolation.valid ? "✅" : "⚠️ ";

      console.log(`${rlsIcon} RLS: ${table}`);
      console.log(`   ${policyIcon} Policies: ${policies.length}`);
      console.log(`   ${isolationIcon} Tenant isolation: ${isolation.valid ? "Valid" : "Issues found"}`);

      if (!rlsEnabled || policies.length === 0) {
        passed = false;
      }

      if (!isolation.valid) {
        isolation.issues.forEach((issue) => {
          console.log(`      ⚠️  ${issue}`);
        });
      }

      console.log("");
    } catch (error) {
      errors.push(`Error checking table ${table}: ${error}`);
      console.log(`❌ Error checking table ${table}\n`);
      passed = false;
    }
  }

  return { passed, results, errors };
}

/**
 * Verify database connection uses restricted role
 */
export async function verifyConnectionRole(): Promise<{
  isRestricted: boolean;
  currentRole: string;
  isSuperuser: boolean;
}> {
  try {
    const result = await db.execute<{
      current_user: string;
      is_superuser: boolean;
    }>(sql`
      SELECT current_user, (SELECT rol.superuser FROM pg_roles rol WHERE rol.rolname = current_user) as is_superuser
    `);

    const currentRole = result.rows[0].current_user;
    const isSuperuser = result.rows[0].is_superuser;

    return {
      isRestricted: !isSuperuser,
      currentRole,
      isSuperuser,
    };
  } catch {
    return {
      isRestricted: false,
      currentRole: "unknown",
      isSuperuser: true,
    };
  }
}

/**
 * Check SSL is required for database connections
 */
export function checkSSLConfiguration(): {
  sslEnforced: boolean;
  message: string;
} {
  const dbUrl = process.env.DATABASE_URL || "";

  if (dbUrl.includes("sslmode=require") || dbUrl.includes("ssl=true")) {
    return {
      sslEnforced: true,
      message: "SSL is enforced in database connection",
    };
  }

  // Neon and other managed databases often enforce SSL by default
  if (dbUrl.includes("neon.tech") || dbUrl.includes("supabase.co")) {
    return {
      sslEnforced: true,
      message: "SSL likely enforced by managed database provider",
    };
  }

  return {
    sslEnforced: false,
    message: "SSL mode not explicitly configured in DATABASE_URL",
  };
}

// CLI execution
async function main() {
  console.log("🔒 Row-Level Security Verification\n");
  console.log("=".repeat(50) + "\n");

  // Check SSL configuration
  const sslCheck = checkSSLConfiguration();
  const sslIcon = sslCheck.sslEnforced ? "✅" : "⚠️ ";
  console.log(`${sslIcon} SSL: ${sslCheck.message}\n`);

  // Check connection role
  console.log("🔍 Checking database connection role...\n");
  const roleCheck = await verifyConnectionRole();
  const roleIcon = roleCheck.isRestricted ? "✅" : "⚠️ ";
  console.log(`${roleIcon} Current role: ${roleCheck.currentRole}`);
  console.log(`   Superuser: ${roleCheck.isSuperuser ? "Yes (warning)" : "No (good)"}`);
  console.log("");

  // Check RLS policies
  const rlsCheck = await verifyRLSPolicies();

  console.log("=".repeat(50));
  console.log("\n📊 Summary\n");

  const rlsEnabled = rlsCheck.results.filter((r) => r.rlsEnabled).length;
  const policiesOk = rlsCheck.results.filter((r) => r.policyCount > 0).length;
  const isolated = rlsCheck.results.filter((r) => r.tenantIsolated).length;

  console.log(`RLS enabled: ${rlsEnabled}/${TENANT_TABLES.length} tables`);
  console.log(`Policies exist: ${policiesOk}/${TENANT_TABLES.length} tables`);
  console.log(`Properly isolated: ${isolated}/${TENANT_TABLES.length} tables`);

  if (rlsCheck.errors.length > 0) {
    console.log("\n❌ Errors:");
    rlsCheck.errors.forEach((err) => console.log(`   - ${err}`));
  }

  if (rlsCheck.passed && roleCheck.isRestricted && sslCheck.sslEnforced) {
    console.log("\n✅ All RLS checks passed!");
    process.exit(0);
  } else {
    console.log("\n❌ RLS verification failed. Review the issues above.");
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module || process.argv[1]?.includes("rls-verify")) {
  main().catch(console.error);
}

export default verifyRLSPolicies;