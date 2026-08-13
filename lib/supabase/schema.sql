-- ============================================================================
-- GSTGenius — Supabase schema + Row-Level Security
-- Paste this whole file into: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================================

-- ── Tables ──────────────────────────────────────────────────────────────────

-- A CA firm (the tenant). One row per firm.
create table if not exists firms (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  icai_number text,
  phone       text,
  plan        text default 'starter',
  gstin_limit integer default 25,
  created_at  timestamptz default now()
);

-- Maps a Supabase auth user to their firm. Supports multiple users per firm later.
create table if not exists firm_members (
  user_id    uuid references auth.users(id) on delete cascade,
  firm_id    uuid references firms(id) on delete cascade,
  role       text default 'owner',      -- owner | staff
  created_at timestamptz default now(),
  primary key (user_id, firm_id)
);

-- GST clients belonging to a firm.
create table if not exists clients (
  id            uuid primary key default gen_random_uuid(),
  firm_id       uuid references firms(id) on delete cascade not null,
  name          text not null,
  gstin         text not null,
  pan           text,
  business_type text default 'Regular',
  turnover      text,
  email         text,
  phone         text,
  is_active     boolean default true,
  created_at    timestamptz default now()
);

-- Returns prepared via the platform.
create table if not exists returns (
  id             uuid primary key default gen_random_uuid(),
  firm_id        uuid references firms(id) on delete cascade not null,
  client_id      uuid references clients(id) on delete cascade not null,
  form_type      text not null,          -- GSTR-1 | GSTR-3B | GSTR-9
  period         text not null,          -- e.g. "March 2026"
  status         text default 'draft',   -- draft | review | filed
  ai_filled_data jsonb,
  raw_input      text,
  filed_at       timestamptz,
  created_at     timestamptz default now()
);

-- Vault documents (files live in Supabase Storage; this is the metadata).
create table if not exists documents (
  id           uuid primary key default gen_random_uuid(),
  firm_id      uuid references firms(id) on delete cascade not null,
  client_id    uuid references clients(id) on delete cascade not null,
  name         text not null,
  doc_type     text not null,            -- PAN | GSTIN | Aadhaar | DSC | Photo | Bank | Other
  storage_path text not null,
  size_bytes   integer,
  uploaded_at  timestamptz default now()
);

-- GST notices and their AI analysis.
create table if not exists notices (
  id               uuid primary key default gen_random_uuid(),
  firm_id          uuid references firms(id) on delete cascade not null,
  client_id        uuid references clients(id) on delete cascade,
  notice_type      text,
  reference_number text,
  demand_amount    text,
  issue_date       text,
  due_date         text,
  urgency          text,
  raw_notice_text  text,
  ai_analysis      jsonb,
  status           text default 'open',  -- open | replied | resolved
  created_at       timestamptz default now()
);

-- Helpful indexes for tenant-scoped queries.
create index if not exists idx_clients_firm    on clients(firm_id);
create index if not exists idx_returns_firm     on returns(firm_id);
create index if not exists idx_documents_firm   on documents(firm_id);
create index if not exists idx_notices_firm     on notices(firm_id);

-- ── Tenant helper ─────────────────────────────────────────────────────────--
-- Returns the firm_id of the currently authenticated user. SECURITY DEFINER so
-- it can read firm_members regardless of that table's own RLS.
create or replace function auth_firm_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select firm_id from firm_members where user_id = auth.uid() limit 1;
$$;

-- ── Enable Row-Level Security ───────────────────────────────────────────────
alter table firms        enable row level security;
alter table firm_members enable row level security;
alter table clients      enable row level security;
alter table returns      enable row level security;
alter table documents    enable row level security;
alter table notices      enable row level security;

-- ── Policies ────────────────────────────────────────────────────────────────
-- A user only ever touches rows belonging to their own firm.

-- firm_members: a user can read their own membership row.
drop policy if exists fm_select on firm_members;
create policy fm_select on firm_members
  for select using (user_id = auth.uid());

-- firms: read/update your own firm.
drop policy if exists firms_select on firms;
create policy firms_select on firms
  for select using (id = auth_firm_id());
drop policy if exists firms_update on firms;
create policy firms_update on firms
  for update using (id = auth_firm_id());

-- clients
drop policy if exists clients_all on clients;
create policy clients_all on clients
  for all using (firm_id = auth_firm_id())
  with check (firm_id = auth_firm_id());

-- returns
drop policy if exists returns_all on returns;
create policy returns_all on returns
  for all using (firm_id = auth_firm_id())
  with check (firm_id = auth_firm_id());

-- documents
drop policy if exists documents_all on documents;
create policy documents_all on documents
  for all using (firm_id = auth_firm_id())
  with check (firm_id = auth_firm_id());

-- notices
drop policy if exists notices_all on notices;
create policy notices_all on notices
  for all using (firm_id = auth_firm_id())
  with check (firm_id = auth_firm_id());

-- ============================================================================
-- STORAGE: run after creating a PRIVATE bucket named "vault"
--   Dashboard → Storage → New bucket → name "vault", Public = OFF
-- Files are stored under  {firm_id}/{client_id}/{doc_type}/{filename}
-- so the first path segment is the firm_id we authorize against.
-- ============================================================================
drop policy if exists vault_read on storage.objects;
create policy vault_read on storage.objects
  for select using (
    bucket_id = 'vault'
    and (storage.foldername(name))[1] = auth_firm_id()::text
  );

drop policy if exists vault_write on storage.objects;
create policy vault_write on storage.objects
  for insert with check (
    bucket_id = 'vault'
    and (storage.foldername(name))[1] = auth_firm_id()::text
  );

drop policy if exists vault_delete on storage.objects;
create policy vault_delete on storage.objects
  for delete using (
    bucket_id = 'vault'
    and (storage.foldername(name))[1] = auth_firm_id()::text
  );

-- Audit logs for Maker-Checker approvals & firm compliance actions
create table if not exists audit_logs (
  id          uuid primary key default gen_random_uuid(),
  firm_id     uuid references firms(id) on delete cascade not null,
  actor_name  text not null,
  actor_role  text not null, -- partner | manager | article_clerk | client
  action      text not null, -- return_filed | notice_replied | task_approved | fee_paid | document_uploaded
  entity_type text not null, -- task | return | notice | invoice | client
  entity_id   text,
  details     jsonb,
  created_at  timestamptz default now()
);

-- Compliance tasks (Kanban task board)
create table if not exists tasks (
  id             uuid primary key default gen_random_uuid(),
  firm_id        uuid references firms(id) on delete cascade not null,
  client_name    text not null,
  gstin          text,
  task_type      text not null,
  period         text not null,
  due_date       text,
  assigned_staff text,
  maker_checker  text,
  status         text default 'pending_data',
  urgent         boolean default false,
  created_at     timestamptz default now()
);

-- SAC 9982 Professional Fee Invoices
create table if not exists invoices (
  id             uuid primary key default gen_random_uuid(),
  firm_id        uuid references firms(id) on delete cascade not null,
  invoice_number text not null,
  client_name    text not null,
  client_gstin   text,
  client_phone   text,
  date           text,
  due_date       text,
  items          jsonb,
  subtotal       numeric,
  cgst           numeric,
  sgst           numeric,
  igst           numeric,
  total_amount   numeric,
  status         text default 'draft',
  payment_link   text,
  upi_qr_url     text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- Client Engagements Master
create table if not exists client_engagements (
  id               uuid primary key default gen_random_uuid(),
  firm_id          uuid references firms(id) on delete cascade not null,
  client_name      text not null,
  gstin            text not null,
  gst_frequency    text default 'Monthly',
  tds_opted        boolean default true,
  itr_form         text default 'ITR-3',
  roc_opted        boolean default false,
  monthly_retainer numeric default 5000,
  assigned_maker   text default 'Article Clerk',
  assigned_checker text default 'CA Partner',
  created_at       timestamptz default now()
);

-- Helpful indexes for new tables
create index if not exists idx_tasks_firm       on tasks(firm_id);
create index if not exists idx_invoices_firm    on invoices(firm_id);
create index if not exists idx_engagements_firm on client_engagements(firm_id);

alter table audit_logs         enable row level security;
alter table tasks              enable row level security;
alter table invoices           enable row level security;
alter table client_engagements enable row level security;

drop policy if exists audit_logs_all on audit_logs;
create policy audit_logs_all on audit_logs
  for all using (firm_id = auth_firm_id())
  with check (firm_id = auth_firm_id());

drop policy if exists tasks_all on tasks;
create policy tasks_all on tasks
  for all using (firm_id = auth_firm_id())
  with check (firm_id = auth_firm_id());

drop policy if exists invoices_all on invoices;
create policy invoices_all on invoices
  for all using (firm_id = auth_firm_id())
  with check (firm_id = auth_firm_id());

drop policy if exists client_engagements_all on client_engagements;
create policy client_engagements_all on client_engagements
  for all using (firm_id = auth_firm_id())
  with check (firm_id = auth_firm_id());

