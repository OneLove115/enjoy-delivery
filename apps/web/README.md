EnJoy is the consumer companion app to Veloci. It is a pure B2C ordering experience — consumers browse restaurants, build a cart, check out, and track orders. It calls Veloci's consumer API surface and owns no backend state of its own; all persistence (users, restaurants, menus, orders, addresses) lives in Veloci.

### Veloci endpoints consumed

- `POST /api/v1/auth/signup` — register consumer account
- `POST /api/v1/auth/login` — email/password sign-in
- `GET  /api/v1/auth/me` — session validation
- `GET  /api/v1/restaurants` — paginated restaurant feed (with city/category filters)
- `GET  /api/v1/restaurants/:slug/menu` — full menu for a restaurant
- `POST /api/v1/orders` — submit a new order
- `GET  /api/v1/orders/:id` — order status polling
- `GET  /api/v1/account/orders` — consumer order history
- `GET  /api/v1/account/addresses` — saved delivery addresses
- `POST /api/v1/consumer/checkout` — validate cart and create payment intent
- `POST /api/v1/consumer/group-orders` — create a shared group order

### Future native distribution

The `apps/mobile/` Expo skeleton has been removed. When we ship to Apple/Google stores, the plan is to use **Capacitor** to wrap the PWA (`apps/web`) rather than maintain a parallel React Native codebase. See https://capacitorjs.com/. Expected work: 1–2 days (cap init, cap add ios/android, replace icon placeholders, submit via Xcode/Android Studio).
