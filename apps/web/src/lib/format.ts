/**
 * Locale-aware formatting utilities for the EnJoy consumer app.
 * Currency and date formats adapt to the restaurant's locale.
 */

/** Format a price with the correct currency symbol using the browser's Intl API. */
export function formatPrice(
  amount: number | string,
  currency?: string,
): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  const cur = currency || "EUR";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: cur,
    }).format(num);
  } catch {
    return `${cur} ${num.toFixed(2)}`;
  }
}

const LOCALE_MAP: Record<string, string> = {
  nl: "nl-NL",
  de: "de-DE",
  fr: "fr-FR",
  es: "es-ES",
  tr: "tr-TR",
  ar: "ar-SA",
  en: "en-US",
};

/** Format a date in a human-readable, locale-aware long format. */
export function formatDate(date: Date | string, locale?: string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const loc = locale || "en";
  const locStr = LOCALE_MAP[loc] || "en-US";
  return d.toLocaleDateString(locStr, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Format a time string in a locale-aware way. */
export function formatTime(date: Date | string, locale?: string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const loc = locale || "en";
  const locStr = LOCALE_MAP[loc] || "en-US";
  return d.toLocaleTimeString(locStr, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Read a cookie value from document.cookie (client-side only).
 * Returns the fallback if called during SSR or the cookie is missing.
 */
export function getCookie(name: string, fallback: string = ""): string {
  if (typeof document === "undefined") return fallback;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${name}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : fallback;
}

/** Read the locale cookie set by VelociPizza middleware. */
export function getLocale(): string {
  return getCookie("locale", "en");
}

/** Read the currency cookie set by VelociPizza middleware. */
export function getCurrency(): string {
  return getCookie("currency", "EUR");
}
