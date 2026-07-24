create or replace function asset_control_private.clear_login_history(p_token text)
returns jsonb
language plpgsql
security definer
set search_path to 'public', 'asset_control_private', 'pg_temp'
as $$
begin
  perform asset_control_private.assert_token(p_token);

  delete from public.login_history;
  perform setval(pg_get_serial_sequence('public.login_history', 'id'), 1, false);
  update public.asset_control_metadata
    set value = now()::text
    where key = 'generatedAt';

  return asset_control_private.get_database(p_token);
end;
$$;

create or replace function public.asset_control_clear_login_history(p_token text)
returns jsonb
language sql
set search_path to 'public', 'pg_temp'
as $$
  select asset_control_private.clear_login_history(p_token);
$$;
