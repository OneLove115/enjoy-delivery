/**
 * GA4 Analytics for enjoy.veloci.online
 *
 * Usage:
 *   import { trackEvent } from '@/lib/analytics';
 *   trackEvent('order_started', { restaurant: 'Royal Kitchen' });
 *
 * Set NEXT_PUBLIC_GA_ID in .env.local to enable.
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-DQCX271YXF';

/** Push a custom event to GA4 via gtag */
export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>,
) {
  if (typeof window === 'undefined' || !GA_ID) return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.('event', name, params);
}

/** Push to dataLayer (for GTM if added later) */
export function pushDataLayer(data: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(data);
}

// ─── Standard Events ───

/**
 * GA4 e-commerce item shape. Also compatible with Meta Pixel content_ids mapping.
 */
export interface EcomItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
  item_category?: string;
  affiliation?: string; // restaurant name
}

/** Fire both GA4 event and Meta Pixel standard event for e-commerce actions */
function trackEcom(
  gaEvent: string,
  metaEvent: string,
  params: { value: number; currency: string; items: EcomItem[]; transaction_id?: string },
) {
  const w = typeof window !== 'undefined'
    ? (window as unknown as { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void })
    : null;
  if (!w) return;

  // GA4
  w.gtag?.('event', gaEvent, params);

  // Meta Pixel
  const metaParams = {
    currency: params.currency,
    value: params.value,
    content_type: 'product',
    content_ids: params.items.map(i => i.item_id),
    contents: params.items.map(i => ({ id: i.item_id, quantity: i.quantity ?? 1 })),
    num_items: params.items.reduce((s, i) => s + (i.quantity ?? 1), 0),
  };
  w.fbq?.('track', metaEvent, metaParams);
}

export const analytics = {
  // Auth
  signupStarted: (method: string) => trackEvent('signup_started', { method }),
  signupCompleted: (method: string, userId?: string) =>
    trackEvent('sign_up', { method, ...(userId ? { user_id: userId } : {}) }),

  // Discovery
  restaurantViewed: (slug: string, name: string) =>
    trackEvent('restaurant_viewed', { restaurant_slug: slug, restaurant_name: name }),
  menuViewed: (slug: string) => trackEvent('menu_viewed', { restaurant_slug: slug }),
  cityViewed: (citySlug: string, country: string) =>
    trackEvent('city_viewed', { city_slug: citySlug, country }),
  cuisineFiltered: (cuisine: string) => trackEvent('cuisine_filtered', { cuisine }),

  // Standard GA4 e-commerce funnel — fires GA4 + Meta standard events
  viewItem: (item: EcomItem, currency = 'EUR') =>
    trackEcom('view_item', 'ViewContent', { value: item.price, currency, items: [item] }),

  addToCart: (item: EcomItem, currency = 'EUR') =>
    trackEcom('add_to_cart', 'AddToCart', {
      value: item.price * (item.quantity ?? 1),
      currency,
      items: [item],
    }),

  beginCheckout: (items: EcomItem[], value: number, currency = 'EUR') =>
    trackEcom('begin_checkout', 'InitiateCheckout', { value, currency, items }),

  purchase: (transactionId: string, items: EcomItem[], value: number, currency = 'EUR') =>
    trackEcom('purchase', 'Purchase', { transaction_id: transactionId, value, currency, items }),

  // Engagement
  joyaChatOpened: () => trackEvent('joya_chat_opened'),
  contactFormSubmitted: (topic: string) =>
    trackEvent('form_submitted', { form_name: 'contact', form_topic: topic }),
  partnerFormSubmitted: () => trackEvent('form_submitted', { form_name: 'partner' }),
  riderFormSubmitted: (city: string) =>
    trackEvent('form_submitted', { form_name: 'rider', city }),
  ctaClicked: (ctaName: string, location: string) =>
    trackEvent('cta_clicked', { cta_name: ctaName, page_location: location }),
};

// ─── Meta Pixel Events ───

export function trackMetaEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { fbq?: (...args: unknown[]) => void };
  w.fbq?.('track', name, params);
}

export function trackMetaCustomEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { fbq?: (...args: unknown[]) => void };
  w.fbq?.('trackCustom', name, params);
}

export function grantMetaConsent() {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { fbq?: (...args: unknown[]) => void };
  w.fbq?.('consent', 'grant');
}

// ─── Google Ads Conversion ───

export function trackGoogleAdsConversion(conversionId: string, conversionLabel: string, value?: number) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.('event', 'conversion', {
    send_to: `${conversionId}/${conversionLabel}`,
    ...(value ? { value, currency: 'EUR' } : {}),
  });
}
