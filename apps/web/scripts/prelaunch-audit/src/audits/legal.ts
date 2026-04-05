import { AuditConfig, AuditModule, AuditResult } from "../types";
import { httpRequest } from "../http";

export const legalAudit: AuditModule = {
  name: "legal",
  category: "Legal",
  description: "Privacy policy, terms of service, and cookie consent",

  async run(config: AuditConfig): Promise<AuditResult[]> {
    const results: AuditResult[] = [];

    if (config.mode === "static") {
      // Static: check page files exist
      const fs = await import("fs");
      const path = await import("path");

      for (const page of config.legal.requiredPages) {
        const pageName = page.replace(/^\//, "");
        const pagePath = path.join(config.srcDir, "app", pageName, "page.tsx");
        const exists = fs.existsSync(pagePath);
        results.push({
          category: "Legal",
          test_name: `page_file:${page}`,
          status: exists ? "pass" : "fail",
          details: exists ? `${page} page file found` : `No page file for ${page}`,
          severity: "high",
          fix_recommendation: `Create src/app/${pageName}/page.tsx`,
          duration_ms: 0,
        });
      }
      return results;
    }

    // --- Live: check each required legal page ---
    for (const page of config.legal.requiredPages) {
      const res = await httpRequest(`${config.baseUrl}${page}`, { timeout: config.timeout });

      results.push({
        category: "Legal",
        test_name: `accessible:${page}`,
        status: res.ok ? "pass" : "fail",
        details: res.ok ? `${page} is accessible (${res.status})` : `${page} returned ${res.status}`,
        severity: "high",
        fix_recommendation: `Ensure ${page} is publicly accessible`,
        duration_ms: res.duration_ms,
      });

      if (res.ok) {
        // Check page has meaningful content (not empty or just a header)
        const textLength = res.body.replace(/<[^>]+>/g, "").trim().length;
        results.push({
          category: "Legal",
          test_name: `content:${page}`,
          status: textLength > 500 ? "pass" : textLength > 100 ? "warn" : "fail",
          details: `${page} has ~${textLength} characters of text content`,
          severity: "high",
          fix_recommendation: `${page} needs substantive legal content (recommended > 500 chars)`,
          duration_ms: 0,
        });

        // Check for key legal terms
        const bodyLower = res.body.toLowerCase();
        if (page.includes("privacy")) {
          const hasDataTerms = bodyLower.includes("data") || bodyLower.includes("personal information");
          results.push({
            category: "Legal",
            test_name: `privacy_data_terms`,
            status: hasDataTerms ? "pass" : "warn",
            details: hasDataTerms
              ? "Privacy page mentions data/personal information"
              : "Privacy page may be missing data handling terms",
            severity: "medium",
            fix_recommendation: "Ensure privacy policy covers data collection and processing",
            duration_ms: 0,
          });
        }

        if (page.includes("terms")) {
          const hasServiceTerms = bodyLower.includes("service") || bodyLower.includes("agreement");
          results.push({
            category: "Legal",
            test_name: `terms_service_terms`,
            status: hasServiceTerms ? "pass" : "warn",
            details: hasServiceTerms
              ? "Terms page mentions service/agreement"
              : "Terms page may be missing service terms",
            severity: "medium",
            fix_recommendation: "Ensure terms page covers service agreement",
            duration_ms: 0,
          });
        }
      }
    }

    // Check for cookie consent if cookies page exists
    const cookiePage = config.legal.requiredPages.find((p) => p.includes("cookie"));
    if (cookiePage) {
      const cookieRes = await httpRequest(`${config.baseUrl}${cookiePage}`, { timeout: config.timeout });
      results.push({
        category: "Legal",
        test_name: "cookie_page_accessible",
        status: cookieRes.ok ? "pass" : "warn",
        details: cookieRes.ok
          ? "Cookie policy page accessible"
          : `Cookie page returned ${cookieRes.status}`,
        severity: "medium",
        fix_recommendation: "Ensure cookie policy page is accessible",
        duration_ms: cookieRes.duration_ms,
      });
    }

    return results;
  },
};
