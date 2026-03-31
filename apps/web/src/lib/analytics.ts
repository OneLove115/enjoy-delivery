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

export const analytics = {
  // Funnel
  signupStarted: (method: string) =>
    trackEvent('signup_started', { method }),
  signupCompleted: (method: string, userId?: string) =>
    trackEvent('signup_completed', { method, ...(userId ? { user_id: userId } : {}) }),

  // Ordering
  restaurantViewed: (slug: string, name: string) =>
    trackEvent('restaurant_viewed', { restaurant_slug: slug, restaurant_name: name }),
  menuViewed: (slug: string) =>
    trackEvent('menu_viewed', { restaurant_slug: slug }),
  cartItemAdded: (itemName: string, price: number) =>
    trackEvent('cart_item_added', { item_name: itemName, value: price, currency: 'EUR' }),
  orderStarted: (restaurantSlug: string, value: number) =>
    trackEvent('order_started', { restaurant_slug: restaurantSlug, value, currency: 'EUR' }),
  orderCompleted: (orderId: string, value: number) =>
    trackEvent('order_completed', { order_id: orderId, value, currency: 'EUR' }),

  // Engagement
  cityViewed: (citySlug: string, country: string) =>
    trackEvent('city_viewed', { city_slug: citySlug, country }),
  cuisineFiltered: (cuisine: string) =>
    trackEvent('cuisine_filtered', { cuisine }),
  joyaChatOpened: () =>
    trackEvent('joya_chat_opened'),
  contactFormSubmitted: (topic: string) =>
    trackEvent('form_submitted', { form_name: 'contact', form_topic: topic }),
  partnerFormSubmitted: () =>
    trackEvent('form_submitted', { form_name: 'partner' }),
  riderFormSubmitted: (city: string) =>
    trackEvent('form_submitted', { form_name: 'rider', city }),
  ctaClicked: (ctaName: string, location: string) =>
    trackEvent('cta_clicked', { cta_name: ctaName, page_location: location }),
};
