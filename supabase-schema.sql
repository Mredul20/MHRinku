-- Run these queries in your Supabase SQL Editor

-- 1. Create Users Table
create table if not exists users (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text unique not null,
  password text not null,
  role text default 'admin',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Blogs Table
create table if not exists blogs (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  content text not null,
  "featuredImage" text,
  "metaTitle" text,
  "metaDescription" text,
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Projects Table
create table if not exists projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  category text not null,
  service text[] default '{}',
  images text[],
  thumbnail text,
  "externalLink" text,
  "additionalFields" jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- NOTE: If the table already exists, run this migration:
alter table projects add column if not exists service text[] default '{}';


-- 4. Create Reviews Table
create table if not exists reviews (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  role text,
  message text not null,
  avatar_url text,
  rating numeric(2,1) not null default 4.9,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint reviews_rating_check check (rating >= 1 and rating <= 5)
);

-- 5. Create Contacts Table
create table if not exists contacts (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  service text,
  message text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Create Products Table
create table if not exists products (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  category text not null,
  cover_url text,
  action_url text not null,
  action_type text default 'visit',
  badge text,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Create Social Links Table
create table if not exists social_links (
  id uuid default uuid_generate_v4() primary key,
  platform text unique not null,
  url text default '',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Create Team Members Table
create table if not exists team_members (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  role text not null,
  photo_url text,
  bio text not null,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Create Site Settings Table (key-value store for CMS-editable settings)
create table if not exists site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default hero image settings
insert into site_settings (key, value) values
  ('hero_image', 'img/profile.jpg'),
  ('about_hero_image', 'img/profile.jpg'),
  ('graphic_design_image', ''),
  ('meta_ads_image', ''),
  ('gtm_container_id', ''),
  ('google_site_verification', ''),
  ('robots_txt_override', ''),
  ('sitemap_xml_override', '')
on conflict (key) do nothing;

-- 10. CMS Upgrade Additive Migration
-- Full runnable migration lives in cms-upgrade-migration.sql.
alter table projects add column if not exists status text not null default 'draft';
alter table projects add column if not exists content_blocks jsonb not null default '[]'::jsonb;
alter table projects add column if not exists sort_order integer not null default 0;
alter table projects add column if not exists tags text[] not null default '{}';
alter table projects add column if not exists image_refs jsonb not null default '[]'::jsonb;
alter table projects add column if not exists thumbnail_alt_text text;
alter table projects add column if not exists meta_title text;
alter table projects add column if not exists meta_description text;
alter table projects add column if not exists og_image text;
alter table projects add column if not exists slug text;

alter table reviews add column if not exists sort_order integer not null default 0;
alter table reviews add column if not exists project_id uuid references projects(id) on delete set null;
alter table reviews add column if not exists rating numeric(2,1) not null default 4.9;
update reviews set rating = 4.9 where rating is null;
alter table reviews alter column rating set default 4.9;
alter table reviews alter column rating set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'reviews_rating_check'
      and conrelid = 'reviews'::regclass
  ) then
    alter table reviews add constraint reviews_rating_check check (rating >= 1 and rating <= 5);
  end if;
end $$;

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  icon text not null default '',
  title text not null,
  short_description text not null default '',
  bullet_points text[] not null default '{}',
  slug text unique not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  meta_title text,
  meta_description text,
  og_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists site_stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  percentage integer not null default 0 check (percentage >= 0 and percentage <= 100),
  icon text not null default '',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists page_meta (
  slug text primary key,
  meta_title text,
  meta_description text,
  og_image text,
  updated_at timestamptz not null default now()
);
