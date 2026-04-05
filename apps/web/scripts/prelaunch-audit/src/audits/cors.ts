import { AuditConfig, AuditModule, AuditResult } from "../types";
import { httpRequest } from "../http";

export const corsAudit: AuditModule = {
  name: "cors",
  category: "CORS",
  description: "Cross-origin resource sharing and security headers validation",

  async run(config: AuditConfig): Promise<AuditResult[]> {
    const results: AuditResult[] = [];

    if (config.mode === "static") {
      // Static: check next.config or middleware for security headers
      const fs = await import("fs");
      const path = await import("path");

      const middlewarePath = path.join(config.srcDir, "middleware.ts");
      const nextConfigPaths = [
        path.join(config.srcDir, "..", "next.config.js"),
        path.join(config.srcDir, "..", "next.config.mjs"),
        path.join(config.srcDir, "..", "next.config.ts"),
      ];

      let foundSecurityConfig = false;
      let hasCSP = false;

      // Check middleware for headers
      if (fs.existsSync(middlewarePath)) {
        const content = fs.readFileSync(middlewarePath, "utf-8");
        if (content.includes("headers") || content.includes("Content-Security-Policy")) {
          foundSecurityConfig = true;
          hasCSP = content.includes("Content-Security-Policy");
        }
      }

      // Check next.config for headers
      for (const configPath of nextConfigPaths) {
        if (fs.existsSync(configPath)) {
          const content = fs.readFileSync(configPath, "utf-8");
          if (content.includes("headers") || content.includes("Content-Security-Policy")) {
            foundSecurityConfig = true;
            if (content.includes("Content-Security-Policy")) hasCSP = true;
          }
        }
      }

      results.push({
        category: "CORS",
        test_name: "security_headers_configured",
        status: foundSecurityConfig ? "pass" : "warn",
        details: foundSecurityConfig
          ? "Security headers configuration found"
          : "No security headers in middleware or next.config",
        severity: "medium",
        fix_recommendation: "Add security headers in middleware.ts or next.config headers()",
        duration_ms: 0,
      });

      results.push({
        category: "CORS",
        test_name: "csp_configured",
        status: hasCSP ? "pass" : "warn",
        details: hasCSP ? "CSP header configured" : "No Content-Security-Policy found",
        severity: "high",
        fix_recommendation: "Add Content-Security-Policy header in middleware or next.config",
        duration_ms: 0,
      });

      return results;
    }

    // --- Live CORS checks ---
    const url = `${config.baseUrl}/`;

    // Allowed origins should get CORS headers
    for (const origin of config.cors.allowedOrigins) {
      const start = Date.now();
      const res = await httpRequest(url, {
        method: "OPTIONS",
        headers: {
          Origin: origin,
          "Access-Control-Request-Method": "GET",
        },
        timeout: config.timeout,
      });

      const acao = res.headers["access-control-allow-origin"] || "";
      const allowed = acao === origin || acao === "*";

      results.push({
        category: "CORS",
        test_name: `cors_allowed:${origin}`,
        status: allowed ? "pass" : "warn",
        details: allowed
          ? `Origin ${origin} allowed (ACAO: ${acao})`
          : `Origin ${origin} not explicitly allowed (ACAO: ${acao || "none"})`,
        severity: "medium",
        fix_recommendation: `Ensure ${origin} is in CORS allowed origins`,
        duration_ms: Date.now() - start,
      });
    }

    // Disallowed origins should be rejected
    for (const origin of config.cors.disallowedOrigins) {
      const start = Date.now();
      const res = await httpRequest(url, {
        method: "OPTIONS",
        headers: {
          Origin: origin,
          "Access-Control-Request-Method": "GET",
        },
        timeout: config.timeout,
      });

      const acao = res.headers["access-control-allow-origin"] || "";
      const blocked = !acao || (acao !== origin && acao !== "*");

      results.push({
        category: "CORS",
        test_name: `cors_blocked:${origin}`,
        status: blocked ? "pass" : "fail",
        details: blocked
          ? `Disallowed origin ${origin} correctly blocked`
          : `Disallowed origin ${origin} was allowed (ACAO: ${acao})`,
        severity: "high",
        fix_recommendation: "Restrict CORS to only allowed origins",
        duration_ms: Date.now() - start,
      });
    }

    // Check security headers on a normal GET
    const getRes = await httpRequest(url, { timeout: config.timeout });
    const requiredHeaders = [
      "x-frame-options",
      "x-content-type-options",
      "strict-transport-security",
      "referrer-policy",
    ];

    for (const header of requiredHeaders) {
      const present = !!getRes.headers[header];
      results.push({
        category: "CORS",
        test_name: `header:${header}`,
        status: present ? "pass" : "warn",
        details: present ? `${header}: ${getRes.headers[header]}` : `Missing ${header} header`,
        severity: header === "strict-transport-security" ? "high" : "medium",
        fix_recommendation: `Add ${header} to security headers configuration`,
        duration_ms: 0,
      });
    }

    return results;
  },
};
