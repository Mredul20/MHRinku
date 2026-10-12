create table if not exists service_certifications (
  id uuid primary key default gen_random_uuid(),
  service text not null,
  title text not null,
  image text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists service_certifications_service_sort_idx
  on service_certifications (service, sort_order, created_at);
