-- =====================================================================
--  جمعية الأمل والإحسان — قاعدة البيانات الكاملة (ملف واحد شامل)
--  Idempotent: safe to run on a fresh project OR on your already-deployed DB.
--  Run once in Supabase → SQL Editor. Order inside the file is correct.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- 1) Enums
-- ---------------------------------------------------------------------
do $$ begin create type app_role as enum ('super_admin','coordinator','volunteer');
exception when duplicate_object then null; end $$;
do $$ begin create type volunteer_status as enum ('pending','approved','rejected');
exception when duplicate_object then null; end $$;
do $$ begin create type task_status as enum ('todo','in_progress','done');
exception when duplicate_object then null; end $$;
do $$ begin create type beneficiary_status as enum ('pending','assessed','aided');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- 2) Core tables
-- ---------------------------------------------------------------------
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  phone      text,
  role       app_role not null default 'volunteer',
  created_at timestamptz not null default now()
);

create table if not exists volunteers (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null references profiles(id) on delete cascade,
  skills       text[] not null default '{}',
  availability text,
  city         text,
  cv_url       text,
  status       volunteer_status not null default 'pending',
  reviewed_by  uuid references profiles(id),
  created_at   timestamptz not null default now(),
  unique (profile_id)
);

create table if not exists impact_metrics (
  id        bigint generated always as identity primary key,
  key       text unique not null,
  label_ar  text not null,
  value     numeric not null,
  suffix    text default '',
  icon      text,
  sort      int not null default 0,
  is_public boolean not null default true
);

create table if not exists achievements (
  id          bigint generated always as identity primary key,
  title_ar    text not null,
  summary_ar  text,
  body_ar     text,
  cover_url   text,
  category    text,
  happened_on date,
  published   boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists training_materials (
  id         bigint generated always as identity primary key,
  title_ar   text not null,
  kind       text not null default 'pdf',
  url        text not null,
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id          bigint generated always as identity primary key,
  title_ar    text not null,
  details_ar  text,
  assignee_id uuid references profiles(id) on delete set null,
  status      task_status not null default 'todo',
  due_on      date,
  created_by  uuid references profiles(id),
  created_at  timestamptz not null default now()
);

-- Private CRM ---------------------------------------------------------
create table if not exists beneficiaries (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  national_id text,
  phone       text,
  governorate text,
  case_type   text,
  needs       text,
  status      beneficiary_status not null default 'pending',
  notes       text,
  created_by  uuid references profiles(id),
  created_at  timestamptz not null default now()
);
-- ensure columns exist if the table predates this script
alter table beneficiaries add column if not exists needs  text;
alter table beneficiaries add column if not exists status beneficiary_status not null default 'pending';

create table if not exists donors (
  id         uuid primary key default gen_random_uuid(),
  donor_name text not null,
  phone      text,
  email      text,
  notes      text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists donations (
  id          uuid primary key default gen_random_uuid(),
  donor_id    uuid not null references donors(id) on delete cascade,
  amount      numeric not null check (amount > 0),
  currency    text not null default 'SYP',
  channel     text,
  occurred_on date not null default current_date,
  logged_by   uuid references profiles(id),
  created_at  timestamptz not null default now()
);

-- Indexes
create index if not exists idx_volunteers_status   on volunteers (status);
create index if not exists idx_tasks_assignee      on tasks (assignee_id);
create index if not exists idx_ach_pub             on achievements (published, happened_on desc);
create index if not exists idx_beneficiaries_status on beneficiaries (status);
create index if not exists idx_donations_donor     on donations (donor_id);

-- ---------------------------------------------------------------------
-- 3) Functions & trigger
-- ---------------------------------------------------------------------
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Role helpers (SECURITY DEFINER avoids RLS recursion on profiles)
create or replace function auth_role()
returns app_role language sql stable security definer set search_path = '' as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function is_staff()
returns boolean language sql stable as $$
  select auth_role() in ('super_admin','coordinator');
$$;

-- ---------------------------------------------------------------------
-- 4) Enable RLS
-- ---------------------------------------------------------------------
alter table profiles          enable row level security;
alter table volunteers        enable row level security;
alter table impact_metrics     enable row level security;
alter table achievements       enable row level security;
alter table training_materials enable row level security;
alter table tasks              enable row level security;
alter table beneficiaries      enable row level security;
alter table donors             enable row level security;
alter table donations          enable row level security;

-- ---------------------------------------------------------------------
-- 5) Policies (drop-then-create => re-runnable)
-- ---------------------------------------------------------------------
-- profiles
drop policy if exists profiles_own_read    on profiles;
drop policy if exists profiles_staff_read   on profiles;
drop policy if exists profiles_own_update   on profiles;
drop policy if exists profiles_admin_update on profiles;
create policy profiles_own_read    on profiles for select using (id = auth.uid());
create policy profiles_staff_read   on profiles for select using (is_staff());
create policy profiles_own_update   on profiles for update using (id = auth.uid());
create policy profiles_admin_update on profiles for update using (auth_role() = 'super_admin');

-- impact_metrics: public reads published; super_admin writes
drop policy if exists metrics_public_read on impact_metrics;
drop policy if exists metrics_staff_write on impact_metrics;
drop policy if exists metrics_admin_all   on impact_metrics;
create policy metrics_public_read on impact_metrics for select using (is_public = true);
create policy metrics_admin_all   on impact_metrics for all
  using (auth_role() = 'super_admin') with check (auth_role() = 'super_admin');

-- achievements: public reads published; staff manage
drop policy if exists ach_public_read on achievements;
drop policy if exists ach_staff_all   on achievements;
create policy ach_public_read on achievements for select using (published = true);
create policy ach_staff_all   on achievements for all using (is_staff()) with check (is_staff());

-- volunteers
drop policy if exists vol_own_read   on volunteers;
drop policy if exists vol_own_insert on volunteers;
drop policy if exists vol_own_update on volunteers;
drop policy if exists vol_staff_all  on volunteers;
create policy vol_own_read   on volunteers for select using (profile_id = auth.uid());
create policy vol_own_insert on volunteers for insert with check (profile_id = auth.uid());
create policy vol_own_update on volunteers for update using (profile_id = auth.uid() and status = 'pending');
create policy vol_staff_all  on volunteers for all using (is_staff()) with check (is_staff());

-- training_materials: approved volunteers + staff
drop policy if exists tm_read        on training_materials;
drop policy if exists tm_staff_write on training_materials;
create policy tm_read on training_materials for select using (
  is_staff() or exists (
    select 1 from volunteers v where v.profile_id = auth.uid() and v.status = 'approved'
  )
);
create policy tm_staff_write on training_materials for all using (is_staff()) with check (is_staff());

-- tasks
drop policy if exists tasks_assignee_read   on tasks;
drop policy if exists tasks_assignee_update on tasks;
drop policy if exists tasks_staff_all       on tasks;
create policy tasks_assignee_read   on tasks for select using (assignee_id = auth.uid());
create policy tasks_assignee_update on tasks for update using (assignee_id = auth.uid());
create policy tasks_staff_all       on tasks for all using (is_staff()) with check (is_staff());

-- Private CRM: staff only (no public/volunteer policy => denied)
drop policy if exists ben_staff_all       on beneficiaries;
drop policy if exists donors_staff_all     on donors;
drop policy if exists donations_staff_all  on donations;
create policy ben_staff_all      on beneficiaries for all using (is_staff()) with check (is_staff());
create policy donors_staff_all    on donors        for all using (is_staff()) with check (is_staff());
create policy donations_staff_all on donations     for all using (is_staff()) with check (is_staff());

-- ---------------------------------------------------------------------
-- 6) Storage buckets + policies
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public) values
  ('cvs','cvs',false), ('media','media',true)
on conflict (id) do nothing;

drop policy if exists cv_owner_upload   on storage.objects;
drop policy if exists cv_owner_read     on storage.objects;
drop policy if exists media_public_read on storage.objects;
drop policy if exists media_staff_write on storage.objects;
create policy cv_owner_upload   on storage.objects for insert to authenticated
  with check (bucket_id = 'cvs' and owner = auth.uid());
create policy cv_owner_read     on storage.objects for select to authenticated
  using (bucket_id = 'cvs' and (owner = auth.uid() or is_staff()));
create policy media_public_read on storage.objects for select
  using (bucket_id = 'media');
create policy media_staff_write on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and is_staff());

-- ---------------------------------------------------------------------
-- 7) Donor totals view (respects RLS via security_invoker)
-- ---------------------------------------------------------------------
create or replace view donor_totals with (security_invoker = on) as
select
  d.id, d.donor_name, d.phone, d.email, d.notes, d.created_at,
  coalesce(sum(dn.amount), 0)                            as total_amount,
  count(dn.id)                                           as donation_count,
  coalesce(array_agg(distinct dn.currency)
           filter (where dn.currency is not null), '{}') as currencies,
  max(dn.occurred_on)                                    as last_donation_on
from donors d
left join donations dn on dn.donor_id = d.id
group by d.id;

-- ---------------------------------------------------------------------
-- 8) Seed — REAL cumulative figures from the association's report
-- ---------------------------------------------------------------------
insert into impact_metrics (key, label_ar, value, suffix, icon, sort) values
  ('surgeries',      'عملية جراحية بكامل التكاليف',  256,  '',    'stethoscope',     1),
  ('food_baskets',   'سلة غذائية موزّعة',            1475, '+',   'shopping-basket', 2),
  ('cancer_support', 'مريض سرطان مدعوم',             55,   '+',   'heart-pulse',     3),
  ('women_empower',  'امرأة في التمكين وسبل العيش',  135,  '+',   'users',           4),
  ('governorates',   'محافظات سورية مشمولة',         8,    '',    'map',             5),
  ('field_kitchen',  'عائلة سنويًا عبر المطبخ الميداني', 2500, '~', 'utensils',       6),
  ('orphan_families','عائلة أيتام بكفالة شهرية',     50,   'حتى', 'home',            7),
  ('water_wells',    'آبار مياه في الحسكة',          3,    '',    'droplets',        8),
  ('years_field',    'سنوات عمل ميداني',             4,    '+',   'calendar',        9)
on conflict (key) do update set
  value = excluded.value, label_ar = excluded.label_ar,
  suffix = excluded.suffix, icon = excluded.icon, sort = excluded.sort;

insert into achievements (title_ar, summary_ar, category, happened_on, published) values
  ('الاستجابة لكارثة الزلزال',
   'تدخّل فوري منذ اللحظات الأولى: مأوى وطعام ومياه ورعاية طبية في مراكز الإيواء بجبلة، و95 عملية جراحية بكامل التكاليف.',
   'إغاثة', '2023-02-06', true),
  ('أنشطة شهر رمضان 2024',
   'توزيع 500 سلة غذائية في خمس محافظات، ونحو 4000 بيجاما، وقرطاسية لـ650 طالبًا، ودعم جرعات علاج السرطان.',
   'إغاثة', '2024-03-15', true),
  ('حصاد عام 2025',
   '52 عملية جراحية، 600 سلة غذائية، رواتب شهرية لـ50 عائلة، ودورات تمكين لـ50 امرأة.',
   'تنمية', '2025-12-31', true),
  ('الاستجابة لفيضانات إدلب 2026',
   '150 سلة غذائية و50 سلة صحية و200 بطانية ونحو 500 قطعة لباس للعائلات المنكوبة.',
   'إغاثة', '2026-03-01', true),
  ('المطبخ الميداني المستمر',
   'برنامج قابل للتوسّع يخدم نحو 2500 عائلة سنويًا بوجبات مطبوخة وجافة في جبلة وريفها.',
   'تنمية', '2025-06-01', true)
on conflict do nothing;

-- =====================================================================
--  After deploy: create your account via /volunteer/register, then run:
--    update profiles set role = 'super_admin'
--    where id = (select id from auth.users where email = 'YOUR_EMAIL');
-- =====================================================================
