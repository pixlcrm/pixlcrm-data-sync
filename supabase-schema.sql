-- PixlCRM CORE - Database Schema
-- Run this in your Supabase SQL editor to create all required tables

-- Subaccounts table
create table subaccounts (
  id uuid primary key default gen_random_uuid(),
  ghl_location_id text not null,
  agency_name text,
  created_at timestamp default now()
);

-- Orders table
create table orders (
  id uuid primary key default gen_random_uuid(),
  subaccount_id uuid references subaccounts(id),
  platform text,
  external_order_id text,
  order_date date,
  delivery_date date,
  total_price numeric,
  address text,
  product_summary text,
  client_email text,
  client_name text,
  delivery_status text check (delivery_status in ('placed', 'delivered')),
  property_site_url text,
  zillow_status text,
  parser_version text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Contacts table
create table contacts (
  id uuid primary key default gen_random_uuid(),
  subaccount_id uuid references subaccounts(id),
  ghl_contact_id text,
  email text,
  name text,
  -- Optional metrics fields
  lifetime_orders int,
  lifetime_revenue numeric,
  ytd_orders int,
  ytd_revenue numeric,
  mtd_orders int,
  mtd_revenue numeric,
  wtd_orders int,
  wtd_revenue numeric,
  lifetime_aov numeric,
  first_order_date date,
  last_order_date date,
  updated_at timestamp default now()
);

-- Webhook Logs table
create table webhook_logs (
  id uuid primary key default gen_random_uuid(),
  subaccount_id uuid,
  platform text,
  event_type text,
  raw_payload jsonb,
  parser_version text,
  received_at timestamp default now()
);

-- Webhook Errors table
create table webhook_errors (
  id uuid primary key default gen_random_uuid(),
  subaccount_id uuid,
  platform text,
  reason text,
  error_message text,
  raw_payload jsonb,
  created_at timestamp default now()
);

-- Create indexes for better performance
create index idx_orders_subaccount_id on orders(subaccount_id);
create index idx_orders_platform on orders(platform);
create index idx_orders_external_order_id on orders(external_order_id);
create index idx_orders_order_date on orders(order_date);

create index idx_contacts_subaccount_id on contacts(subaccount_id);
create index idx_contacts_email on contacts(email);

create index idx_webhook_logs_subaccount_id on webhook_logs(subaccount_id);
create index idx_webhook_logs_platform on webhook_logs(platform);
create index idx_webhook_logs_received_at on webhook_logs(received_at);

create index idx_webhook_errors_subaccount_id on webhook_errors(subaccount_id);
create index idx_webhook_errors_platform on webhook_errors(platform);
create index idx_webhook_errors_created_at on webhook_errors(created_at);

-- Create a function to update the updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers to automatically update updated_at
create trigger update_orders_updated_at before update on orders
  for each row execute function update_updated_at_column();

create trigger update_contacts_updated_at before update on contacts
  for each row execute function update_updated_at_column();
