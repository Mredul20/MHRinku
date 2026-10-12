-- CMS Flexibility Upgrade Migration
-- Run this in Supabase SQL Editor. Additive only; preserves existing data.

alter table projects add column if not exists status text not null default 'published';
alter table projects alter column status set default 'draft';
alter table projects add column if not exists content_blocks jsonb not null default '[]'::jsonb;
alter table projects add column if not exists sort_order integer not null default 0;
alter table projects add column if not exists tags text[] not null default '{}';
alter table projects add column if not exists image_refs jsonb not null default '[]'::jsonb;
alter table projects add column if not exists thumbnail_alt_text text;
alter table projects add column if not exists meta_title text;
alter table projects add column if not exists meta_description text;
alter table projects add column if not exists og_image text;
alter table projects add column if not exists slug text;

-- Existing projects are backfilled as published by the temporary default above.
-- New projects default to draft after the ALTER COLUMN line.

-- Backfill slugs for existing projects. Uses title slug + short id suffix on collisions.
do $$
declare
  project_row record;
  base_slug text;
  candidate_slug text;
  suffix text;
begin
  for project_row in
    select id, title from projects where slug is null or btrim(slug) = '' order by created_at, id
  loop
    base_slug := lower(regexp_replace(coalesce(project_row.title, 'project'), '[^a-zA-Z0-9]+', '-', 'g'));
    base_slug := regexp_replace(base_slug, '(^-+|-+$)', '', 'g');
    if base_slug = '' then
      base_slug := 'project';
    end if;

    suffix := left(replace(project_row.id::text, '-', ''), 8);
    candidate_slug := base_slug;

    if exists (select 1 from projects where slug = candidate_slug and id <> project_row.id) then
      candidate_slug := base_slug || '-' || suffix;
    end if;

    while exists (select 1 from projects where slug = candidate_slug and id <> project_row.id) loop
      candidate_slug := base_slug || '-' || suffix || '-' || floor(random() * 1000)::int::text;
    end loop;

    update projects set slug = candidate_slug where id = project_row.id;
  end loop;
end $$;

alter table reviews add column if not exists sort_order integer not null default 0;
alter table reviews add column if not exists project_id uuid references projects(id) on delete set null;
alter table reviews add column if not exists rating numeric(2,1) not null default 4.9;
update reviews set rating = 4.9 where rating is null;
alter table reviews alter column rating set default 4.9;
alter table reviews alter column rating set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'projects_status_check'
  ) then
    alter table projects add constraint projects_status_check check (status in ('draft', 'published'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'reviews_rating_check'
      and conrelid = 'reviews'::regclass
  ) then
    alter table reviews add constraint reviews_rating_check check (rating >= 1 and rating <= 5);
  end if;
end $$;

create unique index if not exists projects_slug_unique_idx on projects(slug) where slug is not null and slug <> '';
create index if not exists projects_status_sort_idx on projects(status, sort_order, created_at);
create index if not exists projects_tags_idx on projects using gin(tags);
create index if not exists reviews_project_id_idx on reviews(project_id);
create index if not exists reviews_sort_idx on reviews(sort_order, created_at);

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

create index if not exists services_sort_idx on services(published, sort_order, created_at);
create index if not exists site_stats_sort_idx on site_stats(published, sort_order, created_at);
create index if not exists skills_sort_idx on skills(published, sort_order, created_at);

insert into services (icon, title, short_description, bullet_points, slug, sort_order, published) values
  ('brush', 'Graphic Design', 'Creative branding and visual identity solutions that make your brand stand out.', array['Logo & Identity', 'Marketing Collateral', 'Social Media Assets'], 'graphic-design', 0, true),
  ('terminal', 'Web Design', 'Custom, high-performance website design focused on speed, security, and conversion.', array['WordPress / Shopify Dev', 'E-commerce Solutions', 'Speed Optimization'], 'wordpress-dev', 1, true),
  ('ads_click', 'Ads Management', 'Data-driven ad campaigns designed to maximize ROI through precise targeting and optimization.', array['Campaign Strategy', 'Retargeting Funnels', 'Performance Analytics'], 'meta-ads', 2, true),
  ('layers', 'UI/UX Design', 'Intuitive interfaces that enhance user engagement and support business goals.', array['User Research', 'Wireframes', 'High-Fidelity UI'], 'ui-design', 3, true)
on conflict (slug) do nothing;

insert into site_stats (value, label, sort_order, published)
select v.value, v.label, v.sort_order, v.published
from (values
  ('2+', 'Years Experience', 0, true),
  ('150+', 'Projects Delivered', 1, true),
  ('98%', 'Client Satisfaction', 2, true),
  ('12M+', 'Reach Managed', 3, true)
) as v(value, label, sort_order, published)
where not exists (select 1 from site_stats s where s.label = v.label);

insert into skills (label, percentage, icon, sort_order, published)
select v.label, v.percentage, v.icon, v.sort_order, v.published
from (values
  ('Graphic Design', 95, 'palette', 0, true),
  ('Ads Strategy', 90, 'ads_click', 1, true),
  ('UI/UX Design', 87, 'layers', 2, true),
  ('Web Design', 88, 'code', 3, true),
  ('Brand Strategy', 85, 'analytics', 4, true),
  ('Shopify / E-commerce', 82, 'shopping_cart', 5, true)
) as v(label, percentage, icon, sort_order, published)
where not exists (select 1 from skills s where s.label = v.label);

insert into page_meta (slug, meta_title, meta_description) values
  ('index', 'Mobarak Hossain Rinku | Portfolio', 'Results-driven design and marketing that scales your business.'),
  ('graphic-design', 'Graphic Design Services | Mobarak Hossain Rinku', 'Brand identity, marketing collateral, and digital design services by Mobarak Hossain Rinku.'),
  ('ui-design', 'UI/UX Design Services | Mobarak Hossain Rinku', 'UI/UX design for websites, landing pages, dashboards, and digital products.'),
  ('meta-ads', 'Ads Expert | Mobarak Hossain Rinku', 'Paid advertising strategy and campaign management across Meta, Google Ads, and TikTok Ads.'),
  ('wordpress-dev', 'Web Design | Mobarak Hossain Rinku', 'Editable, responsive WordPress, Shopify, and web design for business growth.'),
  ('seo', 'SEO Service | Mobarak Hossain Rinku', 'Technical SEO, on-page optimization, and practical SEO planning by Mobarak Hossain Rinku.')
on conflict (slug) do nothing;
