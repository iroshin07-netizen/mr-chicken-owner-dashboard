# Mr. Chicken — Owner Dashboard

A custom restaurant-owner dashboard built with React + Vite, Tailwind CSS, Supabase, Recharts, lucide-react, and React Router.

## What is included

- Supabase email/password owner login
- Live orders dashboard using Supabase Realtime — no polling
- Live order/status counters and revenue view
- 7-day Recharts revenue trend
- Best-selling items view
- Cancellation insight
- Menu Studio with image upload to Supabase Storage
- Instant menu availability toggle
- Flash Deals with multi-item selection, discount type, banner upload and live countdown
- Active/Past offer tabs based on timestamp comparison
- Responsive desktop sidebar + mobile bottom navigation
- Warm Mr. Chicken visual system using #D62828, #FFB703, #FFF8F0, #2B2118, #60B246 and #E23744
- RLS examples in `schema.sql`

## 1. Install

```bash
npm install
```

## 2. Create your Supabase project

Create a free Supabase project. In the Supabase dashboard:

1. Open SQL Editor.
2. Run `schema.sql`.
3. Create an Auth user for the restaurant owner.
4. Give that user `app_metadata.role = "owner"` using a trusted server-side/admin workflow.
5. Confirm Realtime is enabled for `orders`, `menu_items`, and `offers`.
6. The schema creates `menu-images` and `offer-banners` Storage buckets.

### Important security note

Do NOT put a Supabase `service_role` key in this Vite frontend. The browser should only receive the project URL and anon/publishable key. Owner authorization should be enforced with Auth + RLS.

## 3. Environment variables

Copy:

```bash
cp .env.example .env
```

Then set:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_OR_PUBLISHABLE_KEY
VITE_SUPABASE_MENU_BUCKET=menu-images
VITE_SUPABASE_OFFER_BUCKET=offer-banners
```

Restart Vite after changing `.env`.

## 4. Run

```bash
npm run dev
```

Open the local URL printed by Vite.

For production:

```bash
npm run build
npm run preview
```

## Realtime approach

The dashboard subscribes to `postgres_changes` on the `orders` and `menu_items` tables. The Menu Studio and Flash Deals screens subscribe to their respective tables too. Inserts, updates and deletes update React state immediately, so there is no polling loop.

Every live stat card has a small pulse animation when its value changes.

## Flash Deal expiry approach

The Active/Past classification is intentionally client-side:

```js
new Date(offer.end_time) > Date.now()
```

The countdown updates once per second locally, while the offer itself remains stored with its authoritative `end_time`. This means no paid cron/scheduler is required just to move an offer between tabs. On every render/load the timestamp comparison determines the correct tab. For production reporting or automated customer-side cleanup, keep the timestamp as the source of truth rather than deleting expired rows.

## Sample mode

If `.env` is missing, the app opens with realistic Mr. Chicken sample data so the UI can be inspected. Database mutations are disabled until Supabase is configured.

## Suggested next production hardening

- Add a proper owner profile table tied to `auth.users`.
- Add server-side order creation from the Customer/Order system.
- Add image file-size/type validation.
- Add audit logs for price, offer and menu changes.
- Add database constraints for percentage discounts (0–100).
- Add indexes and pagination if the order table becomes large.
- Add server-side validation for offer overlap/business rules.
