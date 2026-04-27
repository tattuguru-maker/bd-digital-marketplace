-- =============================================================================
-- Digibazar — initial auth + KYC schema
-- =============================================================================
-- Apply via Supabase Dashboard → SQL Editor, or via:
--   supabase db push   (if you have the CLI linked to the project)

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.profile_role        as enum ('buyer', 'seller', 'admin');
create type public.seller_status       as enum ('pending_review', 'verified', 'rejected', 'suspended');
create type public.kyc_doc_kind        as enum ('nid_front', 'nid_back', 'selfie', 'trade_license', 'tin');
create type public.kyc_review_decision as enum ('approved', 'rejected', 'needs_more_info');

-- ---------------------------------------------------------------------------
-- profiles  (one row per auth.users row)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  email             text not null unique,
  full_name         text,
  phone             text,
  role              public.profile_role not null default 'buyer',
  email_verified_at timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index profiles_role_idx on public.profiles(role);

-- Auto-create a profile row whenever a new auth.users row is inserted.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, email_verified_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    case when new.email_confirmed_at is not null then new.email_confirmed_at else null end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Bump updated_at on every profile update.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute procedure public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- sellers  (one row per seller storefront)
-- ---------------------------------------------------------------------------
create table public.sellers (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null unique references public.profiles(id) on delete cascade,
  display_name     text not null,
  handle           text not null unique,
  bio              text,
  location         text,
  nid_number       text,
  status           public.seller_status not null default 'pending_review',
  submitted_at     timestamptz not null default now(),
  reviewed_at      timestamptz,
  reviewer_id      uuid references public.profiles(id),
  rejection_reason text
);

create index sellers_status_idx on public.sellers(status);

-- ---------------------------------------------------------------------------
-- kyc_documents
-- ---------------------------------------------------------------------------
create table public.kyc_documents (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  seller_id    uuid references public.sellers(id) on delete cascade,
  kind         public.kyc_doc_kind not null,
  storage_path text not null,
  mime         text not null,
  size_bytes   bigint not null,
  uploaded_at  timestamptz not null default now()
);

create index kyc_documents_user_idx   on public.kyc_documents(user_id);
create index kyc_documents_seller_idx on public.kyc_documents(seller_id);

-- ---------------------------------------------------------------------------
-- kyc_reviews
-- ---------------------------------------------------------------------------
create table public.kyc_reviews (
  id          uuid primary key default gen_random_uuid(),
  seller_id   uuid not null references public.sellers(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id),
  decision    public.kyc_review_decision not null,
  notes       text,
  created_at  timestamptz not null default now()
);

create index kyc_reviews_seller_idx on public.kyc_reviews(seller_id);

-- ---------------------------------------------------------------------------
-- auth_audit_log  (lightweight tamper-evident log for fraud forensics)
-- ---------------------------------------------------------------------------
create table public.auth_audit_log (
  id          bigserial primary key,
  user_id     uuid references public.profiles(id) on delete set null,
  event       text not null,
  ip          inet,
  user_agent  text,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index auth_audit_user_idx  on public.auth_audit_log(user_id);
create index auth_audit_event_idx on public.auth_audit_log(event);

-- ---------------------------------------------------------------------------
-- Storage bucket for KYC docs (private, signed-URL only)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'kyc-documents',
  'kyc-documents',
  false,
  10 * 1024 * 1024,                       -- 10 MB
  array['image/jpeg','image/png','image/webp','application/pdf']
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles       enable row level security;
alter table public.sellers        enable row level security;
alter table public.kyc_documents  enable row level security;
alter table public.kyc_reviews    enable row level security;
alter table public.auth_audit_log enable row level security;

-- Helper: is the caller an admin?
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- profiles: a user can read & update their own profile; admins can read all.
create policy profiles_self_read on public.profiles
  for select using (auth.uid() = id or public.is_admin());

create policy profiles_self_update on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy profiles_admin_update on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

-- sellers: public can read 'verified' sellers; the seller can read their own
-- record; admins can read & write all.
create policy sellers_public_read on public.sellers
  for select using (status = 'verified' or auth.uid() = user_id or public.is_admin());

create policy sellers_self_insert on public.sellers
  for insert with check (auth.uid() = user_id);

create policy sellers_self_update on public.sellers
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy sellers_admin_all on public.sellers
  for all using (public.is_admin()) with check (public.is_admin());

-- kyc_documents: only the owner and admins can read.
create policy kyc_docs_self_read on public.kyc_documents
  for select using (auth.uid() = user_id or public.is_admin());

create policy kyc_docs_self_insert on public.kyc_documents
  for insert with check (auth.uid() = user_id);

create policy kyc_docs_admin_all on public.kyc_documents
  for all using (public.is_admin()) with check (public.is_admin());

-- kyc_reviews: only admins can read or write.
create policy kyc_reviews_admin_only on public.kyc_reviews
  for all using (public.is_admin()) with check (public.is_admin());

-- audit log: nobody can read directly except admins. Inserts only via the
-- service-role server action, so no policy needed for that.
create policy auth_audit_admin_read on public.auth_audit_log
  for select using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage policies for the kyc-documents bucket
-- ---------------------------------------------------------------------------
-- Files live at: kyc-documents/{user_id}/{kind}-{uuid}.{ext}
-- Owner can upload / read their own files; admins can read all.
create policy "kyc storage: users upload own"
  on storage.objects for insert
  with check (
    bucket_id = 'kyc-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "kyc storage: users read own"
  on storage.objects for select
  using (
    bucket_id = 'kyc-documents'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );
