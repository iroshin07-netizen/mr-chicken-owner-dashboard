Ye spck me jo schema.sql code ko supabase me kaha upload Karna hai?-- Mr. Chicken Owner Dashboard — Supabase schema
-- Run this in Supabase SQL Editor.
-- Realtime: after running, enable Realtime for orders/menu_items/offers in
-- Database > Publications > supabase_realtime (or use the SQL publication ALTER below).
-- RLS: the policies below assume the owner uses Supabase Auth and is identified
-- by app_metadata.role = 'owner'. Set this server-side when creating owner users.

create extension if not exists pgcrypto;

create table if not exists public.orders (
  id text primary key default ('MC-' || floor(random() * 900000 + 100000)::text),
  customer_name text not null,
  items jsonb not null default '[]'::jsonb,
  total_amount numeric(12,2) not null default 0 check (total_amount >= 0),
  status text not null default 'preparing'
    check (status in ('preparing','picked_up','delivered','cancelled')),
  created_at timestamptz not null default now(),
  cancelled_reason text
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text,
  price numeric(10,2) not null default 0 check (price >= 0),
  category text not null,
  description text,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  item_ids uuid[] not null default '{}'::uuid[],
  discount_type text not null check (discount_type in ('flat','percent')),
  discount_value numeric(10,2) not null check (discount_value > 0),
  start_time timestamptz not null,
  end_time timestamptz not null,
  banner_url text,
  created_at timestamptz not null default now(),
  constraint valid_offer_window check (end_time > start_time)
);

create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists menu_items_category_idx on public.menu_items(category);
create index if not exists offers_end_time_idx on public.offers(end_time);

alter table public.orders enable row level security;
alter table public.menu_items enable row level security;
alter table public.offers enable row level security;

-- Owner-only policies. Adjust the role claim if your auth design differs.
drop policy if exists "owner can read orders" on public.orders;
create policy "owner can read orders" on public.orders for select to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');

drop policy if exists "owner can manage orders" on public.orders;
create policy "owner can manage orders" on public.orders for all to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');

drop policy if exists "owner can read menu" on public.menu_items;
create policy "owner can read menu" on public.menu_items for select to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');

drop policy if exists "owner can manage menu" on public.menu_items;
create policy "owner can manage menu" on public.menu_items for all to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');

drop policy if exists "owner can read offers" on public.offers;
create policy "owner can read offers" on public.offers for select to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');

drop policy if exists "owner can manage offers" on public.offers;
create policy "owner can manage offers" on public.offers for all to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');

-- Storage buckets for menu images and offer banners.
insert into storage.buckets (id, name, public)
values ('menu-images','menu-images',true), ('offer-banners','offer-banners',true)
on conflict (id) do nothing;

-- Owner-only storage object policies.
drop policy if exists "owner upload dashboard images" on storage.objects;
create policy "owner upload dashboard images" on storage.objects
for insert to authenticated
with check (
  bucket_id in ('menu-images','offer-banners')
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner'
);

drop policy if exists "owner update dashboard images" on storage.objects;
create policy "owner update dashboard images" on storage.objects
for update to authenticated
using (
  bucket_id in ('menu-images','offer-banners')
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner'
);

drop policy if exists "owner delete dashboard images" on storage.objects;
create policy "owner delete dashboard images" on storage.objects
for delete to authenticated
using (
  bucket_id in ('menu-images','offer-banners')
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner'
);

-- Public read is intentional because menu/offer image URLs are customer-facing.
drop policy if exists "public read dashboard images" on storage.objects;
create policy "public read dashboard images" on storage.objects
for select to public
using (bucket_id in ('menu-images','offer-banners'));

-- Enable realtime for live dashboard updates.
do $$
begin
  alter publication supabase_realtime add table public.orders;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.menu_items;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.offers;
exception when duplicate_object then null;
end $$;

-- Suggested owner setup:
-- 1) Create the owner in Supabase Authentication > Users.
-- 2) Set app_metadata.role = "owner" using a trusted server/admin workflow.
-- Never expose the Supabase service_role key in this frontend.
