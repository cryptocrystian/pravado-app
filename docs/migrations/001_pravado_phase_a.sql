-- Pravado Phase A schema changes
-- Safe to run multiple times (IF NOT EXISTS used where possible)

-- Ensure UUID generation is available (Supabase usually has this)
create extension if not exists pgcrypto;

-- =========================
-- New Tables
-- =========================

create table if not exists pr_credits (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  period text not null check (period in ('monthly','quarterly')),
  credits_basic int not null default 0,
  credits_premium int not null default 0,
  valid_from timestamptz not null,
  valid_to timestamptz not null,
  rollover_window_days int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists ai_answers_index (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  engine text not null, -- e.g. 'SGE' | 'Perplexity' | 'Gemini'
  query text not null,
  position int,
  snippet text,
  last_seen_at timestamptz not null default now()
);

create table if not exists visibility_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  score numeric not null,
  pr_weight numeric not null,
  seo_weight numeric not null,
  content_weight numeric not null,
  social_weight numeric not null,
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid references public.user_profiles(id),
  level text not null check (level in ('info','recommend','action')),
  title text not null,
  body text,
  action_json jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- =========================
-- Row Level Security (RLS)
-- =========================
alter table pr_credits enable row level security;
alter table ai_answers_index enable row level security;
alter table visibility_snapshots enable row level security;
alter table notifications enable row level security;

-- Helper: extract tenant_id from JWT claims (Supabase sets request.jwt.claims)
-- We compare as text to avoid type cast issues
-- NOTE: adjust the claim key if your JWT encodes it differently.
drop policy if exists pr_credits_tenant on pr_credits;
create policy pr_credits_tenant on pr_credits
  using (
    tenant_id::text = coalesce(current_setting('request.jwt.claims', true)::jsonb->>'tenant_id','')
  )
  with check (
    tenant_id::text = coalesce(current_setting('request.jwt.claims', true)::jsonb->>'tenant_id','')
  );

drop policy if exists ai_answers_index_tenant on ai_answers_index;
create policy ai_answers_index_tenant on ai_answers_index
  using (
    tenant_id::text = coalesce(current_setting('request.jwt.claims', true)::jsonb->>'tenant_id','')
  )
  with check (
    tenant_id::text = coalesce(current_setting('request.jwt.claims', true)::jsonb->>'tenant_id','')
  );

drop policy if exists visibility_snapshots_tenant on visibility_snapshots;
create policy visibility_snapshots_tenant on visibility_snapshots
  using (
    tenant_id::text = coalesce(current_setting('request.jwt.claims', true)::jsonb->>'tenant_id','')
  )
  with check (
    tenant_id::text = coalesce(current_setting('request.jwt.claims', true)::jsonb->>'tenant_id','')
  );

drop policy if exists notifications_tenant on notifications;
create policy notifications_tenant on notifications
  using (
    tenant_id::text = coalesce(current_setting('request.jwt.claims', true)::jsonb->>'tenant_id','')
  )
  with check (
    tenant_id::text = coalesce(current_setting('request.jwt.claims', true)::jsonb->>'tenant_id','')
  );

-- =========================
-- Optional Materialized View (visibility rollup)
-- =========================
create materialized view if not exists visibility_rollup as
select
  t.id as tenant_id,
  coalesce(avg(v.score),0)::numeric as score,
  now() as computed_at
from public.tenants t
left join public.visibility_snapshots v on v.tenant_id = t.id
where v.created_at > now() - interval '30 days'
group by t.id;

-- Indexes for common filters
create index if not exists idx_ai_answers_tenant_engine on ai_answers_index (tenant_id, engine);
create index if not exists idx_visibility_snapshots_tenant_time on visibility_snapshots (tenant_id, created_at desc);
create index if not exists idx_notifications_tenant_time on notifications (tenant_id, created_at desc);
create index if not exists idx_pr_credits_tenant_valid on pr_credits (tenant_id, valid_to desc);
