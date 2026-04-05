import { AuditConfig, AuditModule, AuditReport, AuditResult } from "./types";
import { allAudits } from "./audits";

export async function runAudit(config: AuditConfig): Promise<AuditReport> {
  const startTime = Date.now();
  const results: AuditResult[] = [];

  let auditsToRun: AuditModule[] = allAudits;
  if (config.categories && config.categories.length > 0) {
    const cats = config.categories.map((c) => c.toLowerCase());
    auditsToRun = allAudits.filter(
      (a) =>
        cats.includes(a.category.toLowerCase()) ||
        cats.includes(a.name.toLowerCase()),
    );
  }

  // Filter by mode: skip live-only audits in static mode
  if (config.mode === "static") {
    auditsToRun = auditsToRun.filter(
      (a) => !["frontend"].includes(a.name),
    );
  }

  console.log(
    `\n  Running ${auditsToRun.length} audit modules in ${config.mode} mode...\n`,
  );

  for (const audit of auditsToRun) {
    console.log(`  [${audit.category}] ${audit.description}...`);

    try {
      const moduleResults = await audit.run(config);
      results.push(...moduleResults);

      const passed = moduleResults.filter((r) => r.status === "pass").length;
      const failed = moduleResults.filter((r) => r.status === "fail").length;
      const warns = moduleResults.filter((r) => r.status === "warn").length;
      console.log(`    ${passed} passed, ${failed} failed, ${warns} warnings\n`);

      if (
        config.failFast &&
        moduleResults.some(
          (r) => r.status === "fail" && r.severity === "critical",
        )
      ) {
        console.log(
          "  FAIL FAST: Critical failure detected, stopping audit.\n",
        );
        break;
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      results.push({
        category: audit.category,
        test_name: `${audit.name}_crash`,
        status: "fail",
        details: `Audit module crashed: ${msg}`,
        severity: "high",
        fix_recommendation: `Fix the ${audit.name} audit module or check connectivity`,
        duration_ms: 0,
      });
    }
  }

  return {
    project: config.project,
    environment: config.environment,
    mode: config.mode,
    timestamp: new Date().toISOString(),
    duration_ms: Date.now() - startTime,
    results,
    summary: {
      total: results.length,
      passed: results.filter((r) => r.status === "pass").length,
      failed: results.filter((r) => r.status === "fail").length,
      warnings: results.filter((r) => r.status === "warn").length,
      skipped: results.filter((r) => r.status === "skip").length,
      critical_failures: results.filter(
        (r) => r.status === "fail" && r.severity === "critical",
      ).length,
    },
  };
}
