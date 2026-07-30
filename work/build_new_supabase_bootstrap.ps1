param(
  [string]$ProjectUrl = "https://tzmiavpdslpmpzowabxa.supabase.co",
  [string]$ApiToken = "ae30e5720054020b4a2525fbf70819e48065e4dcb6d900f5"
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$supabaseDir = Join-Path $projectRoot "outputs\supabase"
$databasePath = Join-Path $projectRoot "outputs\database\asset-control-database.json"
$outputPath = Join-Path $supabaseDir "new-supabase-bootstrap.sql"
$oldProjectUrl = "https://wuaguygiahaiptlamqvt.supabase.co"

$utf8 = [Text.UTF8Encoding]::new($false)
$schema = [IO.File]::ReadAllText((Join-Path $supabaseDir "asset-control-schema.sql"), $utf8)
$customFields = [IO.File]::ReadAllText((Join-Path $supabaseDir "add-custom-fields-migration.sql"), $utf8)
$positions = [IO.File]::ReadAllText((Join-Path $supabaseDir "add-master-positions-migration.sql"), $utf8)
$auditLogs = [IO.File]::ReadAllText((Join-Path $supabaseDir "add-audit-logs-migration.sql"), $utf8)
$clearLoginHistory = [IO.File]::ReadAllText((Join-Path $supabaseDir "asset-control-clear-login-history.sql"), $utf8)
$database = [IO.File]::ReadAllText($databasePath, $utf8) | ConvertFrom-Json

function Remove-DuplicateRecords($records, [string]$key, [bool]$allowBlank = $false) {
  $seen = @{}
  @($records | Where-Object {
    $value = [string]($_.$key)
    if ([string]::IsNullOrWhiteSpace($value)) {
      if ($allowBlank) { return $true }
      throw "Missing required key '$key'"
    }
    if ($seen.ContainsKey($value)) { return $false }
    $seen[$value] = $true
    return $true
  })
}

$database.master.companies = Remove-DuplicateRecords $database.master.companies "code"
$database.master.departments = Remove-DuplicateRecords $database.master.departments "code"
$database.master.locations = Remove-DuplicateRecords $database.master.locations "code"
$database.master.types = Remove-DuplicateRecords $database.master.types "code"
$database.master.typeGroups = Remove-DuplicateRecords $database.master.typeGroups "code"
$database.master.statuses = Remove-DuplicateRecords $database.master.statuses "code"
$database.master.positions = Remove-DuplicateRecords $database.master.positions "code"
$database.computerAssets = Remove-DuplicateRecords $database.computerAssets "assetCode"
$database.otherAssets = Remove-DuplicateRecords $database.otherAssets "assetCode"
$database.users = Remove-DuplicateRecords $database.users "username"
$seenEmails = @{}
$database.users = @($database.users | Where-Object {
  $email = [string]$_.email
  if ([string]::IsNullOrWhiteSpace($email)) { return $true }
  if ($seenEmails.ContainsKey($email)) { return $false }
  $seenEmails[$email] = $true
  return $true
})
$database.notifications = Remove-DuplicateRecords $database.notifications "key" $true

$databaseJson = ($database | ConvertTo-Json -Depth 100).Replace($oldProjectUrl, $ProjectUrl.TrimEnd("/"))
$escapedToken = $ApiToken.Replace("'", "''")

$resetAssetControl = @'
-- Clean rebuild: removes only Asset Control database objects from this dedicated project.
drop function if exists public.asset_control_clear_login_history(text) cascade;
drop function if exists public.asset_control_replace_database(text, jsonb) cascade;
drop function if exists public.asset_control_get_database(text) cascade;
drop schema if exists asset_control_private cascade;

drop table if exists
  public.audit_logs,
  public.login_history,
  public.notifications,
  public.checkout_records,
  public.maintenance_requests,
  public.maintenance_history,
  public.other_assets,
  public.computer_assets,
  public.master_positions,
  public.master_statuses,
  public.master_type_groups,
  public.master_types,
  public.master_locations,
  public.master_departments,
  public.master_companies,
  public.asset_control_metadata,
  public.app_users
cascade;
'@

$privateApi = @'
-- Private API-token gate used by the public PostgREST RPC wrappers.
create schema if not exists asset_control_private;
revoke all on schema asset_control_private from public;

create table if not exists asset_control_private.settings (
  key text primary key,
  value text not null
);
revoke all on table asset_control_private.settings from public, anon, authenticated;

insert into asset_control_private.settings (key, value)
values ('api_token', '__API_TOKEN__')
on conflict (key) do update set value = excluded.value;

create or replace function asset_control_private.assert_token(p_token text)
returns void
language plpgsql
security definer
set search_path = 'asset_control_private', 'pg_temp'
as $fn$
begin
  if p_token is null or p_token is distinct from (
    select value from asset_control_private.settings where key = 'api_token'
  ) then
    raise exception 'Invalid API token' using errcode = '28000';
  end if;
end;
$fn$;

revoke all on function asset_control_private.assert_token(text) from public, anon, authenticated;
'@.Replace("__API_TOKEN__", $escapedToken)

$publicApi = @'
-- Public RPC entry points used by asset-control-server.cjs.
create or replace function public.asset_control_get_database(p_token text)
returns jsonb
language sql
security definer
set search_path = 'public', 'asset_control_private', 'pg_temp'
as $fn$
  select asset_control_private.get_database(p_token);
$fn$;

create or replace function public.asset_control_replace_database(p_token text, p_database jsonb)
returns jsonb
language sql
security definer
set search_path = 'public', 'asset_control_private', 'pg_temp'
as $fn$
  select asset_control_private.replace_database(p_token, p_database);
$fn$;

create or replace function public.asset_control_clear_login_history(p_token text)
returns jsonb
language sql
security definer
set search_path = 'public', 'asset_control_private', 'pg_temp'
as $fn$
  select asset_control_private.clear_login_history(p_token);
$fn$;

revoke all on function public.asset_control_get_database(text) from public;
revoke all on function public.asset_control_replace_database(text, jsonb) from public;
revoke all on function public.asset_control_clear_login_history(text) from public;
grant execute on function public.asset_control_get_database(text) to anon, authenticated;
grant execute on function public.asset_control_replace_database(text, jsonb) to anon, authenticated;
grant execute on function public.asset_control_clear_login_history(text) to anon, authenticated;
'@

$secureMasterTables = @'
-- These two tables were added after the original policy generator.
alter table public.master_type_groups enable row level security;
alter table public.master_statuses enable row level security;

drop policy if exists "master_type_groups_authenticated_all" on public.master_type_groups;
drop policy if exists "master_statuses_authenticated_all" on public.master_statuses;
create policy "master_type_groups_authenticated_all" on public.master_type_groups
for all to authenticated using (true) with check (true);
create policy "master_statuses_authenticated_all" on public.master_statuses
for all to authenticated using (true) with check (true);
'@

$storage = @'
-- Public image bucket. Write/delete access remains limited to the project API key roles.
insert into storage.buckets (id, name, public)
values ('asset-images', 'asset-images', true)
on conflict (id) do update set public = true;

drop policy if exists "asset_images_select" on storage.objects;
drop policy if exists "asset_images_insert" on storage.objects;
drop policy if exists "asset_images_update" on storage.objects;
drop policy if exists "asset_images_delete" on storage.objects;

create policy "asset_images_select" on storage.objects
for select to anon, authenticated using (bucket_id = 'asset-images');
create policy "asset_images_insert" on storage.objects
for insert to anon, authenticated with check (bucket_id = 'asset-images');
create policy "asset_images_update" on storage.objects
for update to anon, authenticated using (bucket_id = 'asset-images') with check (bucket_id = 'asset-images');
create policy "asset_images_delete" on storage.objects
for delete to anon, authenticated using (bucket_id = 'asset-images');
'@

$importData = @"
-- Import the current local database snapshot.
select asset_control_private.replace_database(
  '$escapedToken',
  `$asset_control_data`$
$databaseJson
`$asset_control_data`$::jsonb
);
"@

$sql = @(
  "-- Complete bootstrap for $ProjectUrl`r`n-- Generated from the current local database snapshot.`r`n",
  $resetAssetControl,
  $schema,
  $privateApi,
  $customFields,
  $positions,
  $auditLogs,
  $clearLoginHistory,
  $publicApi,
  $secureMasterTables,
  $storage,
  $importData
) -join "`r`n`r`n"

[IO.File]::WriteAllText($outputPath, $sql, $utf8)
Write-Output $outputPath
