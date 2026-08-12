create extension if not exists pg_cron with schema pg_catalog;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

-- Apply the rule immediately for reservations that ended before this migration.
update public.bookings
set status = 'completed'
where status = 'confirmed'
  and end_at <= now();

-- Keep the migration safe to run repeatedly by replacing the named job.
do $$
declare
  existing_job_id bigint;
begin
  select jobid
  into existing_job_id
  from cron.job
  where jobname = 'complete-finished-bookings';

  if existing_job_id is not null then
    perform cron.unschedule(existing_job_id);
  end if;
end;
$$;

select cron.schedule(
  'complete-finished-bookings',
  '* * * * *',
  $cron$
    update public.bookings
    set status = 'completed'
    where status = 'confirmed'
      and end_at <= now();
  $cron$
);
