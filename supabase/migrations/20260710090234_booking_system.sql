create extension if not exists pgcrypto with schema extensions;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table public.business_hours (
  day_of_week smallint primary key check (day_of_week between 1 and 7),
  opens_at time without time zone,
  closes_at time without time zone,
  is_closed boolean not null default false,
  check (
    (is_closed and opens_at is null and closes_at is null)
    or
    (not is_closed and opens_at is not null and closes_at is not null and opens_at < closes_at)
  )
);

insert into public.business_hours (day_of_week, opens_at, closes_at, is_closed)
values
  (1, '09:00', '16:30', false),
  (2, '09:00', '16:30', false),
  (3, '09:00', '16:30', false),
  (4, '09:00', '16:30', false),
  (5, '09:00', '16:30', false),
  (6, null, null, true),
  (7, null, null, true)
on conflict (day_of_week) do update
set opens_at = excluded.opens_at,
    closes_at = excluded.closes_at,
    is_closed = excluded.is_closed;

create table public.bookings (
  id uuid primary key default extensions.gen_random_uuid(),
  service_id text not null check (char_length(service_id) between 1 and 100),
  service_name text not null check (char_length(service_name) between 1 and 200),
  duration_minutes integer not null check (duration_minutes between 15 and 300),
  start_at timestamptz not null,
  end_at timestamptz not null,
  customer_name text not null check (char_length(customer_name) between 2 and 120),
  customer_email text not null check (char_length(customer_email) between 3 and 254),
  customer_phone text not null check (char_length(customer_phone) between 7 and 30),
  customer_note text check (customer_note is null or char_length(customer_note) <= 1000),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (start_at < end_at)
);

alter table public.bookings
  add constraint bookings_no_active_overlap
  exclude using gist (
    tstzrange(start_at, end_at, '[)') with &&
  )
  where (status in ('pending', 'confirmed'));

create index bookings_start_at_idx on public.bookings (start_at);
create index bookings_status_start_at_idx on public.bookings (status, start_at);
create index bookings_customer_email_idx on public.bookings (lower(customer_email));

create table public.blocked_periods (
  id uuid primary key default extensions.gen_random_uuid(),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text check (reason is null or char_length(reason) <= 300),
  created_at timestamptz not null default now(),
  check (starts_at < ends_at)
);

create index blocked_periods_range_idx
  on public.blocked_periods using gist (tstzrange(starts_at, ends_at, '[)'));

create table public.booking_events (
  id bigint generated always as identity primary key,
  booking_id uuid not null,
  event_type text not null check (event_type in ('created', 'status_changed', 'updated', 'deleted')),
  old_status text,
  new_status text,
  event_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index booking_events_booking_id_created_at_idx
  on public.booking_events (booking_id, created_at desc);

create table private.booking_requests (
  id bigint generated always as identity primary key,
  requester_hash text not null,
  requested_at timestamptz not null default now()
);

create index booking_requests_hash_requested_at_idx
  on private.booking_requests (requester_hash, requested_at desc);

create table private.admin_emails (
  email text primary key check (email = lower(email))
);

insert into private.admin_emails (email)
values ('slavik-petr@seznam.cz')
on conflict (email) do nothing;

revoke all on table private.admin_emails from public, anon, authenticated;

create or replace function private.assign_admin_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if exists (
    select 1 from private.admin_emails where email = lower(new.email)
  ) then
    new.raw_app_meta_data := coalesce(new.raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb;
  end if;
  return new;
end;
$$;

revoke all on function private.assign_admin_role() from public, anon, authenticated;

drop trigger if exists sg_assign_admin_role on auth.users;
create trigger sg_assign_admin_role
before insert or update of email on auth.users
for each row execute function private.assign_admin_role();

create or replace function private.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

revoke all on function private.is_admin() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger bookings_set_updated_at
before update on public.bookings
for each row execute function private.set_updated_at();

create or replace function private.log_booking_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event_type text;
begin
  if tg_op = 'INSERT' then
    v_event_type := 'created';
    insert into public.booking_events (booking_id, event_type, new_status, event_data)
    values (new.id, v_event_type, new.status, jsonb_build_object('service_id', new.service_id, 'start_at', new.start_at));
    return new;
  elsif tg_op = 'UPDATE' then
    v_event_type := case when old.status is distinct from new.status then 'status_changed' else 'updated' end;
    insert into public.booking_events (booking_id, event_type, old_status, new_status, event_data)
    values (new.id, v_event_type, old.status, new.status, jsonb_build_object('updated_at', new.updated_at));
    return new;
  else
    insert into public.booking_events (booking_id, event_type, old_status, event_data)
    values (old.id, 'deleted', old.status, jsonb_build_object('service_id', old.service_id, 'start_at', old.start_at));
    return old;
  end if;
end;
$$;

create trigger bookings_log_event
after insert or update or delete on public.bookings
for each row execute function private.log_booking_event();

create or replace function public.get_available_slots(
  p_booking_date date,
  p_service_id text,
  p_duration_minutes integer
)
returns table (slot text)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_hours public.business_hours%rowtype;
  v_day_start timestamptz;
  v_day_end timestamptz;
begin
  if p_service_id is null or char_length(p_service_id) > 100 then
    raise exception 'Neplatná služba.';
  end if;
  if p_duration_minutes < 15 or p_duration_minutes > 300 then
    raise exception 'Neplatná délka služby.';
  end if;
  if p_booking_date < (now() at time zone 'Europe/Prague')::date
     or p_booking_date > (now() at time zone 'Europe/Prague')::date + 60 then
    return;
  end if;

  select * into v_hours
  from public.business_hours
  where day_of_week = extract(isodow from p_booking_date)::smallint;

  if not found or v_hours.is_closed then
    return;
  end if;

  v_day_start := (p_booking_date + v_hours.opens_at) at time zone 'Europe/Prague';
  v_day_end := (p_booking_date + v_hours.closes_at) at time zone 'Europe/Prague';

  return query
  select to_char(candidate.slot_start at time zone 'Europe/Prague', 'HH24:MI')
  from generate_series(
    v_day_start,
    v_day_end - make_interval(mins => p_duration_minutes),
    interval '15 minutes'
  ) as candidate(slot_start)
  where candidate.slot_start > now()
    and not exists (
      select 1 from public.bookings b
      where b.status in ('pending', 'confirmed')
        and tstzrange(b.start_at, b.end_at, '[)') &&
            tstzrange(candidate.slot_start, candidate.slot_start + make_interval(mins => p_duration_minutes), '[)')
    )
    and not exists (
      select 1 from public.blocked_periods bp
      where tstzrange(bp.starts_at, bp.ends_at, '[)') &&
            tstzrange(candidate.slot_start, candidate.slot_start + make_interval(mins => p_duration_minutes), '[)')
    )
  order by candidate.slot_start;
end;
$$;

create or replace function public.create_booking(
  p_service_id text,
  p_service_name text,
  p_duration_minutes integer,
  p_booking_date date,
  p_start_time time without time zone,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_customer_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_hours public.business_hours%rowtype;
  v_start_at timestamptz;
  v_end_at timestamptz;
  v_booking_id uuid;
  v_headers jsonb := coalesce(nullif(current_setting('request.headers', true), ''), '{}')::jsonb;
  v_requester_hash text;
  v_recent_requests integer;
begin
  if p_booking_date < (now() at time zone 'Europe/Prague')::date
     or p_booking_date > (now() at time zone 'Europe/Prague')::date + 60 then
    raise exception 'Termín je mimo povolené rezervační období.';
  end if;
  if p_duration_minutes < 15 or p_duration_minutes > 300 then
    raise exception 'Neplatná délka služby.';
  end if;
  if p_service_id is null or char_length(trim(p_service_id)) not between 1 and 100
     or p_service_name is null or char_length(trim(p_service_name)) not between 1 and 200 then
    raise exception 'Neplatná služba.';
  end if;
  if p_customer_name is null or p_customer_email is null or p_customer_phone is null
     or char_length(trim(p_customer_name)) not between 2 and 120
     or char_length(trim(p_customer_email)) not between 3 and 254
     or p_customer_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
     or char_length(trim(p_customer_phone)) not between 7 and 30
     or coalesce(char_length(p_customer_note), 0) > 1000 then
    raise exception 'Zkontrolujte prosím kontaktní údaje.';
  end if;
  if extract(minute from p_start_time)::integer % 15 <> 0 then
    raise exception 'Začátek termínu musí být po 15 minutách.';
  end if;

  select * into v_hours
  from public.business_hours
  where day_of_week = extract(isodow from p_booking_date)::smallint;

  if not found or v_hours.is_closed then
    raise exception 'V tento den je salon zavřený.';
  end if;

  v_start_at := (p_booking_date + p_start_time) at time zone 'Europe/Prague';
  v_end_at := v_start_at + make_interval(mins => p_duration_minutes);

  if v_start_at <= now() or p_start_time < v_hours.opens_at
     or (p_start_time + make_interval(mins => p_duration_minutes)) > v_hours.closes_at then
    raise exception 'Termín je mimo otevírací dobu.';
  end if;

  if exists (
    select 1 from public.blocked_periods bp
    where tstzrange(bp.starts_at, bp.ends_at, '[)') && tstzrange(v_start_at, v_end_at, '[)')
  ) then
    raise exception 'Vybraný termín není dostupný.';
  end if;

  v_requester_hash := encode(
    extensions.digest(coalesce(split_part(v_headers ->> 'x-forwarded-for', ',', 1), 'unknown'), 'sha256'),
    'hex'
  );
  select count(*) into v_recent_requests
  from private.booking_requests
  where requester_hash = v_requester_hash
    and requested_at > now() - interval '15 minutes';

  if v_recent_requests >= 5 then
    raise exception 'Příliš mnoho pokusů. Zkuste to prosím později.';
  end if;

  insert into private.booking_requests (requester_hash) values (v_requester_hash);

  begin
    insert into public.bookings (
      service_id, service_name, duration_minutes, start_at, end_at,
      customer_name, customer_email, customer_phone, customer_note
    ) values (
      trim(p_service_id), trim(p_service_name), p_duration_minutes, v_start_at, v_end_at,
      trim(p_customer_name), lower(trim(p_customer_email)), trim(p_customer_phone), nullif(trim(p_customer_note), '')
    ) returning id into v_booking_id;
  exception when exclusion_violation then
    raise exception 'Tento termín právě obsadil jiný zákazník. Vyberte prosím jiný.';
  end;

  return jsonb_build_object('id', v_booking_id, 'status', 'pending', 'start_at', v_start_at);
end;
$$;

alter table public.business_hours enable row level security;
alter table public.bookings enable row level security;
alter table public.blocked_periods enable row level security;
alter table public.booking_events enable row level security;

revoke all on table public.business_hours, public.bookings, public.blocked_periods, public.booking_events from anon, authenticated;
grant select, update, delete on table public.bookings to authenticated;
grant select, insert, update, delete on table public.blocked_periods to authenticated;
grant select on table public.business_hours, public.booking_events to authenticated;

create policy "Admins manage bookings"
on public.bookings for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Admins read business hours"
on public.business_hours for select to authenticated
using ((select private.is_admin()));

create policy "Admins manage blocked periods"
on public.blocked_periods for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Admins read booking events"
on public.booking_events for select to authenticated
using ((select private.is_admin()));

revoke execute on function public.get_available_slots(date, text, integer) from public, anon, authenticated;
revoke execute on function public.create_booking(text, text, integer, date, time without time zone, text, text, text, text) from public, anon, authenticated;
grant execute on function public.get_available_slots(date, text, integer) to anon, authenticated;
grant execute on function public.create_booking(text, text, integer, date, time without time zone, text, text, text, text) to anon, authenticated;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'bookings'
  ) then
    alter publication supabase_realtime add table public.bookings;
  end if;
end;
$$;

comment on table public.bookings is 'Customer bookings. Direct anonymous access is blocked; public creation uses create_booking RPC.';
comment on table public.booking_events is 'Immutable audit trail generated by booking triggers.';
comment on function public.create_booking is 'Validates and creates a booking atomically while preventing overlaps.';
