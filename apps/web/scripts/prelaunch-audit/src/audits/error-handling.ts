import { AuditConfig, AuditModule, AuditResult } from "../types";
import { httpRequest } from "../http";

const STACK_TRACE_PATTERNS = [
  "at Object.",
  "at Module.",
  "at Function.",
  "node_modules/",
  "Error: ",
  "TypeError:",
  "ReferenceError:",
  "SyntaxError:",
  "ENOENT",
  "ECONNREFUSED",
  "stack\":",
  "stacktrace",
  "__dirname",
  "process.cwd",
];

export const errorHandlingAudit: AuditModule = {
  name: "error-handling",
  category: "Error Handling",
  description: "Error responses, stack trace leakage, and graceful degradation",

  async run(config: AuditConfig): Promise<AuditResult[]> {
    const results: AuditResult[] = [];

    if (config.mode === "static") {
      // Static: check for global error boundary and not-found page
      const fs = await import("fs");
      const path = await import("path");

      const errorPagePath = path.join(config.srcDir, "app", "error.tsx");
      results.push({
        category: "Error Handling",
        test_name: "global_error_boundary",
        status: fs.existsSync(errorPagePath) ? "pass" : "warn",
        details: fs.existsSync(errorPagePath)
          ? "Global error.tsx boundary found"
          : "No global error.tsx - unhandled errors may show raw errors",
        severity: "medium",
        fix_recommendation: "Create src/app/error.tsx as a client error boundary",
        duration_ms: 0,
      });

      const notFoundPath = path.join(config.srcDir, "app", "not-found.tsx");
      results.push({
        category: "Error Handling",
        test_name: "custom_404_page",
        status: fs.existsSync(notFoundPath) ? "pass" : "warn",
        details: fs.existsSync(notFoundPath)
          ? "Custom not-found.tsx page found"
          : "No custom 404 page",
        severity: "low",
        fix_recommendation: "Create src/app/not-found.tsx for better UX",
        duration_ms: 0,
      });

      return results;
    }

    // --- Live: trigger errors and check responses ---

    // 404 - nonexistent page route (no API routes in this app)
    const notFoundRes = await httpRequest(
      `${config.baseUrl}/nonexistent-page-${Date.now()}`,
      { timeout: config.timeout },
    );
    results.push({
      category: "Error Handling",
      test_name: "404_clean_response",
      status: notFoundRes.status === 404 ? "pass" : "warn",
      details: `Nonexistent route returned ${notFoundRes.status}`,
      severity: "low",
      fix_recommendation: "Return proper 404 for unknown routes",
      duration_ms: notFoundRes.duration_ms,
    });

    // Check 404 doesn't leak stack traces
    const leaksStack = STACK_TRACE_PATTERNS.some((p) =>
      notFoundRes.body.includes(p),
    );
    results.push({
      category: "Error Handling",
      test_name: "404_no_stack_trace",
      status: leaksStack ? "fail" : "pass",
      details: leaksStack
        ? "404 response contains stack trace or internal details"
        : "404 response is clean of internal details",
      severity: "high",
      fix_recommendation: "Ensure error responses never include stack traces or file paths",
      duration_ms: 0,
    });

    // Check public pages don't expose errors or stack traces
    for (const page of config.publicPages.slice(0, 5)) {
      const pageRes = await httpRequest(`${config.baseUrl}${page}`, {
        timeout: config.timeout,
      });
      const pageLeaks = STACK_TRACE_PATTERNS.some((p) =>
        pageRes.body.includes(p),
      );
      results.push({
        category: "Error Handling",
        test_name: `page_no_leak:${page}`,
        status: pageLeaks ? "fail" : "pass",
        details: pageLeaks
          ? `Page ${page} contains potential stack trace or internal details`
          : `Page ${page} is clean (${pageRes.status})`,
        severity: "high",
        fix_recommendation: "Ensure server-side errors are caught and user sees clean error page",
        duration_ms: pageRes.duration_ms,
      });
    }

    // Check that error page returns HTML, not raw JSON error
    if (notFoundRes.body) {
      const isHtml = notFoundRes.body.toLowerCase().includes("<!doctype html") ||
        notFoundRes.body.toLowerCase().includes("<html");
      results.push({
        category: "Error Handling",
        test_name: "404_returns_html",
        status: isHtml ? "pass" : "warn",
        details: isHtml
          ? "404 returns proper HTML error page"
          : "404 does not return HTML (may show raw text or JSON)",
        severity: "medium",
        fix_recommendation: "Ensure not-found.tsx renders a proper HTML page",
        duration_ms: 0,
      });
    }

    return results;
  },
};
