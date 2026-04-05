import { AuditConfig, AuditModule, AuditResult } from "../types";
import { httpRequest } from "../http";

export const frontendAudit: AuditModule = {
  name: "frontend",
  category: "Frontend",
  description: "Page accessibility, broken links, and asset loading",

  async run(config: AuditConfig): Promise<AuditResult[]> {
    const results: AuditResult[] = [];

    if (config.mode === "static") {
      results.push({
        category: "Frontend",
        test_name: "requires_live_mode",
        status: "skip",
        details: "Frontend checks require live mode (--mode live or --mode full)",
        severity: "low",
        fix_recommendation: "Run with --mode live for frontend tests",
        duration_ms: 0,
      });
      return results;
    }

    // Check all public pages load
    for (const page of config.publicPages) {
      const start = Date.now();
      const res = await httpRequest(`${config.baseUrl}${page}`, { timeout: config.timeout });

      results.push({
        category: "Frontend",
        test_name: `page_loads:${page}`,
        status: res.ok ? "pass" : "fail",
        details: res.ok
          ? `${page} loaded in ${res.duration_ms}ms`
          : `${page} returned ${res.status}`,
        severity: page === "/" ? "critical" : "high",
        fix_recommendation: `Fix ${page} to return 200`,
        duration_ms: Date.now() - start,
      });

      if (res.ok) {
        // Check for basic HTML structure
        const hasDoctype = res.body.toLowerCase().includes("<!doctype html");
        const hasTitle = /<title[^>]*>.+<\/title>/i.test(res.body);
        const hasViewport = res.body.includes("viewport");

        if (!hasDoctype) {
          results.push({
            category: "Frontend",
            test_name: `html_doctype:${page}`,
            status: "warn",
            details: `${page} missing <!DOCTYPE html>`,
            severity: "low",
            fix_recommendation: "Ensure proper HTML5 doctype",
            duration_ms: 0,
          });
        }

        if (!hasTitle) {
          results.push({
            category: "Frontend",
            test_name: `html_title:${page}`,
            status: "warn",
            details: `${page} missing or empty <title> tag`,
            severity: "medium",
            fix_recommendation: "Add a meaningful <title> to every page",
            duration_ms: 0,
          });
        }

        if (!hasViewport) {
          results.push({
            category: "Frontend",
            test_name: `viewport_meta:${page}`,
            status: "warn",
            details: `${page} missing viewport meta tag`,
            severity: "medium",
            fix_recommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">',
            duration_ms: 0,
          });
        }

        // Check for broken internal links
        const linkMatches = res.body.match(/href=["']([^"']+)["']/g) || [];
        const internalLinks: string[] = [];
        for (const match of linkMatches) {
          const href = match.match(/href=["']([^"']+)["']/)?.[1];
          if (href && href.startsWith("/") && !href.startsWith("//") && !href.includes("_next")) {
            internalLinks.push(href);
          }
        }

        // Sample check a few internal links per page
        const uniqueLinks = [...new Set(internalLinks)].slice(0, 5);
        for (const link of uniqueLinks) {
          const linkRes = await httpRequest(`${config.baseUrl}${link}`, { timeout: config.timeout });
          if (!linkRes.ok && linkRes.status !== 308 && linkRes.status !== 307) {
            results.push({
              category: "Frontend",
              test_name: `broken_link:${page}->${link}`,
              status: "fail",
              details: `Broken link on ${page}: ${link} returned ${linkRes.status}`,
              severity: "medium",
              fix_recommendation: `Fix or remove broken link to ${link}`,
              duration_ms: linkRes.duration_ms,
            });
          }
        }
      }
    }

    // Check static assets
    const assetsToCheck = ["/favicon.ico"];
    for (const asset of assetsToCheck) {
      const assetRes = await httpRequest(`${config.baseUrl}${asset}`, { timeout: config.timeout });
      results.push({
        category: "Frontend",
        test_name: `asset:${asset}`,
        status: assetRes.ok ? "pass" : "warn",
        details: assetRes.ok ? `${asset} exists` : `${asset} returned ${assetRes.status}`,
        severity: "low",
        fix_recommendation: `Add ${asset} to public directory`,
        duration_ms: assetRes.duration_ms,
      });
    }

    // Performance: check homepage load time
    const homepageRes = await httpRequest(`${config.baseUrl}/`, { timeout: config.timeout });
    if (homepageRes.ok) {
      const loadTime = homepageRes.duration_ms;
      results.push({
        category: "Frontend",
        test_name: "homepage_load_time",
        status: loadTime < 3000 ? "pass" : loadTime < 5000 ? "warn" : "fail",
        details: `Homepage loaded in ${loadTime}ms`,
        severity: loadTime > 5000 ? "high" : "medium",
        fix_recommendation: "Optimize homepage loading speed (target <3s)",
        duration_ms: loadTime,
      });

      // Check HTML size is reasonable
      const htmlSize = homepageRes.body.length;
      results.push({
        category: "Frontend",
        test_name: "homepage_html_size",
        status: htmlSize < 500000 ? "pass" : htmlSize < 1000000 ? "warn" : "fail",
        details: `Homepage HTML is ${(htmlSize / 1024).toFixed(0)}KB`,
        severity: "medium",
        fix_recommendation: "Reduce HTML size for better initial load performance",
        duration_ms: 0,
      });
    }

    return results;
  },
};
