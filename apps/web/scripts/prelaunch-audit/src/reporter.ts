import * as fs from "fs";
import * as path from "path";
import { AuditReport, AuditResult, Status } from "./types";

const STATUS_LABEL: Record<Status, string> = {
  pass: "PASS",
  fail: "FAIL",
  warn: "WARN",
  skip: "SKIP",
};

const SEVERITY_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export function printCliReport(report: AuditReport): void {
  console.log("\n" + "=".repeat(72));
  console.log("  PRE-LAUNCH AUDIT REPORT");
  console.log(`  Project:     ${report.project}`);
  console.log(`  Environment: ${report.environment}`);
  console.log(`  Mode:        ${report.mode}`);
  console.log(`  Timestamp:   ${report.timestamp}`);
  console.log(`  Duration:    ${(report.duration_ms / 1000).toFixed(1)}s`);
  console.log("=".repeat(72));

  const categories = new Map<string, AuditResult[]>();
  for (const result of report.results) {
    const list = categories.get(result.category) || [];
    list.push(result);
    categories.set(result.category, list);
  }

  for (const [category, results] of categories) {
    const catPassed = results.filter((r) => r.status === "pass").length;
    const catFailed = results.filter((r) => r.status === "fail").length;
    console.log(
      `\n  [${category}] (${catPassed}/${results.length} passed, ${catFailed} failed)`,
    );

    const sorted = [...results].sort((a, b) => {
      if (a.status === "fail" && b.status !== "fail") return -1;
      if (a.status !== "fail" && b.status === "fail") return 1;
      return (SEVERITY_ORDER[a.severity] ?? 3) - (SEVERITY_ORDER[b.severity] ?? 3);
    });

    for (const r of sorted) {
      const label = STATUS_LABEL[r.status];
      const sev = r.severity.toUpperCase().padEnd(8);
      console.log(`    [${label}] [${sev}] ${r.test_name}`);
      if (r.status === "fail" || r.status === "warn") {
        console.log(`             ${r.details}`);
        if (r.fix_recommendation) {
          console.log(`             Fix: ${r.fix_recommendation}`);
        }
      }
    }
  }

  console.log("\n" + "=".repeat(72));
  console.log("  SUMMARY");
  console.log("=".repeat(72));
  console.log(`  Total tests:       ${report.summary.total}`);
  console.log(`  Passed:            ${report.summary.passed}`);
  console.log(`  Failed:            ${report.summary.failed}`);
  console.log(`  Warnings:          ${report.summary.warnings}`);
  console.log(`  Skipped:           ${report.summary.skipped}`);
  console.log(`  Critical failures: ${report.summary.critical_failures}`);
  console.log("=".repeat(72));

  if (report.summary.critical_failures > 0) {
    console.log("\n  RESULT: CRITICAL FAILURES DETECTED - DO NOT DEPLOY\n");
  } else if (report.summary.failed > 0) {
    console.log("\n  RESULT: FAILURES DETECTED - REVIEW BEFORE DEPLOYING\n");
  } else if (report.summary.warnings > 0) {
    console.log("\n  RESULT: PASSED WITH WARNINGS\n");
  } else {
    console.log("\n  RESULT: ALL CHECKS PASSED\n");
  }
}

export function saveJsonReport(
  report: AuditReport,
  outputDir: string,
): string {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filename = `audit-${report.project}-${report.environment}-${Date.now()}.json`;
  const filepath = path.join(outputDir, filename);

  fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
  console.log(`  Report saved to: ${filepath}\n`);
  return filepath;
}
