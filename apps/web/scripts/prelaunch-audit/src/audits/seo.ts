import { AuditConfig, AuditModule, AuditResult } from "../types";
import { httpRequest } from "../http";

export const seoAudit: AuditModule = {
  name: "seo",
  category: "SEO & Analytics",
  description: "Meta tags, sitemap, robots.txt, and OpenGraph validation",

  async run(config: AuditConfig): Promise<AuditResult[]> {
    const results: AuditResult[] = [];

    if (config.mode === "static") {
      // Static: check layout.tsx for metadata export
      const fs = await import("fs");
      const path = await import("path");
      const layoutPath = path.join(config.srcDir, "app", "layout.tsx");
      if (fs.existsSync(layoutPath)) {
        const content = fs.readFileSync(layoutPath, "utf-8");
        results.push({
          category: "SEO & Analytics",
          test_name: "metadata_export",
          status: content.includes("export const metadata") ? "pass" : "warn",
          details: content.includes("export const metadata")
            ? "Metadata export found in root layout"
            : "No metadata export in root layout",
          severity: "high",
          fix_recommendation: "Export metadata from src/app/layout.tsx",
          duration_ms: 0,
        });

        results.push({
          category: "SEO & Analytics",
          test_name: "opengraph_config",
          status: content.includes("openGraph") ? "pass" : "warn",
          details: content.includes("openGraph")
            ? "OpenGraph metadata configured"
            : "No OpenGraph metadata in root layout",
          severity: "medium",
          fix_recommendation: "Add openGraph to metadata export",
          duration_ms: 0,
        });

        results.push({
          category: "SEO & Analytics",
          test_name: "json_ld_structured_data",
          status: content.includes("application/ld+json") ? "pass" : "warn",
          details: content.includes("application/ld+json")
            ? "JSON-LD structured data found"
            : "No JSON-LD structured data",
          severity: "medium",
          fix_recommendation: "Add JSON-LD schema.org structured data",
          duration_ms: 0,
        });
      }
      return results;
    }

    // --- Live SEO checks ---

    // Check robots.txt
    const robotsRes = await httpRequest(
      `${config.baseUrl}${config.seo.robotsPath}`,
      { timeout: config.timeout },
    );
    results.push({
      category: "SEO & Analytics",
      test_name: "robots_txt",
      status: robotsRes.ok ? "pass" : "warn",
      details: robotsRes.ok ? "robots.txt found and accessible" : `robots.txt returned ${robotsRes.status}`,
      severity: "medium",
      fix_recommendation: "Create public/robots.txt with crawl directives",
      duration_ms: robotsRes.duration_ms,
    });

    if (robotsRes.ok) {
      const hasSitemap = robotsRes.body.toLowerCase().includes("sitemap:");
      results.push({
        category: "SEO & Analytics",
        test_name: "robots_sitemap_ref",
        status: hasSitemap ? "pass" : "warn",
        details: hasSitemap ? "robots.txt references sitemap" : "robots.txt missing Sitemap: directive",
        severity: "low",
        fix_recommendation: "Add Sitemap: URL to robots.txt",
        duration_ms: 0,
      });
    }

    // Check sitemap
    const sitemapRes = await httpRequest(
      `${config.baseUrl}${config.seo.sitemapPath}`,
      { timeout: config.timeout },
    );
    results.push({
      category: "SEO & Analytics",
      test_name: "sitemap_xml",
      status: sitemapRes.ok ? "pass" : "warn",
      details: sitemapRes.ok ? "sitemap.xml found and accessible" : `sitemap.xml returned ${sitemapRes.status}`,
      severity: "medium",
      fix_recommendation: "Generate sitemap.xml (use next-sitemap or manual)",
      duration_ms: sitemapRes.duration_ms,
    });

    // Check meta tags on all public pages
    for (const page of config.publicPages) {
      const pageRes = await httpRequest(`${config.baseUrl}${page}`, { timeout: config.timeout });
      if (!pageRes.ok) continue;

      const html = pageRes.body;

      // Title tag
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const hasTitle = !!titleMatch && titleMatch[1].trim().length > 0;
      results.push({
        category: "SEO & Analytics",
        test_name: `meta_title:${page}`,
        status: hasTitle ? "pass" : "fail",
        details: hasTitle ? `Title: "${titleMatch![1].trim().slice(0, 60)}"` : `${page} missing <title>`,
        severity: "high",
        fix_recommendation: "Add unique, descriptive title to every page",
        duration_ms: 0,
      });

      // Description meta
      const hasDesc = /meta[^>]+name=["']description["'][^>]+content=["'][^"']+["']/i.test(html);
      results.push({
        category: "SEO & Analytics",
        test_name: `meta_description:${page}`,
        status: hasDesc ? "pass" : "warn",
        details: hasDesc ? "Meta description found" : `${page} missing meta description`,
        severity: "medium",
        fix_recommendation: "Add meta description to every page",
        duration_ms: 0,
      });

      // OG tags
      const hasOg = /property=["']og:title["']/i.test(html);
      results.push({
        category: "SEO & Analytics",
        test_name: `og_tags:${page}`,
        status: hasOg ? "pass" : "warn",
        details: hasOg ? "OpenGraph tags found" : `${page} missing og:title`,
        severity: "low",
        fix_recommendation: "Add OpenGraph meta tags for social sharing",
        duration_ms: 0,
      });

      // Canonical URL
      const hasCanonical = /rel=["']canonical["']/i.test(html);
      results.push({
        category: "SEO & Analytics",
        test_name: `canonical:${page}`,
        status: hasCanonical ? "pass" : "warn",
        details: hasCanonical ? "Canonical URL set" : `${page} missing canonical link`,
        severity: "low",
        fix_recommendation: "Add canonical URL to prevent duplicate content",
        duration_ms: 0,
      });
    }

    return results;
  },
};
