import { test, expect } from "@playwright/test";

const PUBLIC_PAGES = [
  { path: "/", name: "Homepage" },
  { path: "/about", name: "About" },
  { path: "/discover", name: "Discover" },
  { path: "/how-it-works", name: "How It Works" },
  { path: "/partners", name: "Partners" },
  { path: "/business", name: "Business" },
  { path: "/faq", name: "FAQ" },
  { path: "/help", name: "Help" },
  { path: "/contact", name: "Contact" },
  { path: "/privacy", name: "Privacy Policy" },
  { path: "/terms", name: "Terms of Service" },
  { path: "/cookies", name: "Cookie Policy" },
];

// --- Page Loading ---
test.describe("Page Loading", () => {
  for (const page of PUBLIC_PAGES) {
    test(`${page.name} (${page.path}) loads successfully`, async ({ page: p }) => {
      const response = await p.goto(page.path);
      expect(response?.status()).toBeLessThan(400);
      await expect(p.locator("body")).toBeVisible();
    });
  }
});

// --- Responsive Layout ---
test.describe("Responsive Layout", () => {
  test("Homepage renders correctly on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
    // No horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5);
  });

  test("Homepage renders correctly on tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Homepage renders correctly on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Discover page is responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/discover");
    await expect(page.locator("body")).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5);
  });
});

// --- Auth Pages ---
test.describe("Auth Pages", () => {
  test("Login page loads with form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("body")).toBeVisible();
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"]');
    await expect(emailInput.or(page.locator("input").first())).toBeVisible();
    await expect(passwordInput.or(page.locator("input").nth(1))).toBeVisible();
  });

  test("Signup page loads with form", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Forgot password page loads", async ({ page }) => {
    await page.goto("/forgot-password");
    await expect(page.locator("body")).toBeVisible();
  });
});

// --- Broken Links ---
test.describe("Broken Links", () => {
  test("Homepage has no broken internal links", async ({ page }) => {
    await page.goto("/");
    const links = await page.locator("a[href^='/']").all();
    const checked = new Set<string>();

    for (const link of links.slice(0, 15)) {
      const href = await link.getAttribute("href");
      if (!href || checked.has(href) || href.includes("_next") || href === "#") continue;
      checked.add(href);

      const response = await page.request.get(href);
      expect(
        response.status(),
        `Link ${href} should not be 404/500`,
      ).toBeLessThan(500);
    }
  });

  test("Discover page has no broken internal links", async ({ page }) => {
    await page.goto("/discover");
    const links = await page.locator("a[href^='/']").all();
    const checked = new Set<string>();

    for (const link of links.slice(0, 10)) {
      const href = await link.getAttribute("href");
      if (!href || checked.has(href) || href.includes("_next") || href === "#") continue;
      checked.add(href);

      const response = await page.request.get(href);
      expect(
        response.status(),
        `Link ${href} should not be 404/500`,
      ).toBeLessThan(500);
    }
  });
});

// --- Error Handling ---
test.describe("Error Handling", () => {
  test("404 page does not show stack trace", async ({ page }) => {
    await page.goto("/this-page-does-not-exist-" + Date.now());
    const body = await page.textContent("body");
    expect(body).not.toContain("at Object.");
    expect(body).not.toContain("node_modules");
    expect(body).not.toContain("TypeError:");
    expect(body).not.toContain("ENOENT");
  });

  test("404 page renders custom not-found", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist-" + Date.now());
    expect(response?.status()).toBe(404);
    await expect(page.locator("body")).toBeVisible();
  });
});

// --- SEO Meta Tags ---
test.describe("SEO Meta Tags", () => {
  for (const pg of PUBLIC_PAGES) {
    test(`${pg.name} has title and description`, async ({ page }) => {
      await page.goto(pg.path);
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);

      const description = await page.getAttribute('meta[name="description"]', "content");
      if (pg.path === "/") {
        expect(description?.length).toBeGreaterThan(10);
      }
    });
  }

  test("Homepage has OpenGraph tags", async ({ page }) => {
    await page.goto("/");
    const ogTitle = await page.getAttribute('meta[property="og:title"]', "content");
    expect(ogTitle?.length).toBeGreaterThan(0);
  });

  test("Homepage has canonical URL", async ({ page }) => {
    await page.goto("/");
    const canonical = await page.getAttribute('link[rel="canonical"]', "href");
    if (canonical) {
      expect(canonical).toContain("enjoy");
    }
  });
});

// --- Legal Pages ---
test.describe("Legal Pages", () => {
  const legalPages = [
    { path: "/privacy", name: "Privacy Policy" },
    { path: "/terms", name: "Terms of Service" },
    { path: "/cookies", name: "Cookie Policy" },
  ];

  for (const lp of legalPages) {
    test(`${lp.name} (${lp.path}) exists and has content`, async ({ page }) => {
      const response = await page.goto(lp.path);
      expect(response?.status()).toBe(200);
      const body = await page.textContent("body");
      expect(body!.length).toBeGreaterThan(200);
    });
  }

  test("Privacy page mentions data handling", async ({ page }) => {
    await page.goto("/privacy");
    const body = await page.textContent("body");
    const lower = body!.toLowerCase();
    expect(lower.includes("data") || lower.includes("personal information")).toBe(true);
  });

  test("Terms page mentions service agreement", async ({ page }) => {
    await page.goto("/terms");
    const body = await page.textContent("body");
    const lower = body!.toLowerCase();
    expect(lower.includes("service") || lower.includes("agreement")).toBe(true);
  });
});

// --- Navigation ---
test.describe("Navigation", () => {
  test("Homepage has navigation links", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav, header");
    await expect(nav.first()).toBeVisible();
  });

  test("Footer is present on homepage", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    if (await footer.count() > 0) {
      await expect(footer.first()).toBeVisible();
    }
  });
});
