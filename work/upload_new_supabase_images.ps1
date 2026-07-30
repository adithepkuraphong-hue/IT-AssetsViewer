param(
  [string]$ProjectUrl = "https://tzmiavpdslpmpzowabxa.supabase.co",
  [string]$AnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6bWlhdnBkc2xwbXB6b3dhYnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4ODE3MTAsImV4cCI6MjEwMDQ1NzcxMH0.oYobcUzpQRO2OdBvsKmW0aBNaCYDE1f6N1vF5gXkzIk",
  [string]$ApiToken = "ae30e5720054020b4a2525fbf70819e48065e4dcb6d900f5"
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$uploadDir = Join-Path $projectRoot "outputs\uploads"
$headers = @{ apikey = $AnonKey; Authorization = "Bearer $AnonKey"; "x-upsert" = "true" }
$mimeTypes = @{ ".jpg" = "image/jpeg"; ".jpeg" = "image/jpeg"; ".png" = "image/png"; ".webp" = "image/webp"; ".gif" = "image/gif" }

$uploaded = 0
foreach ($file in Get-ChildItem -LiteralPath $uploadDir -File) {
  $mime = $mimeTypes[$file.Extension.ToLowerInvariant()]
  if (-not $mime) { continue }
  $name = [Uri]::EscapeDataString($file.Name)
  Invoke-RestMethod -Method Post `
    -Uri "$($ProjectUrl.TrimEnd('/'))/storage/v1/object/asset-images/$name" `
    -Headers $headers `
    -ContentType $mime `
    -InFile $file.FullName | Out-Null
  $uploaded++
}

$database = Invoke-RestMethod -Method Post `
  -Uri "$($ProjectUrl.TrimEnd('/'))/rest/v1/rpc/asset_control_get_database" `
  -Headers @{ apikey = $AnonKey; Authorization = "Bearer $AnonKey" } `
  -ContentType "application/json" `
  -Body (@{ p_token = $ApiToken } | ConvertTo-Json)

[pscustomobject]@{
  UploadedImages = $uploaded
  ComputerAssets = @($database.computerAssets).Count
  OtherAssets = @($database.otherAssets).Count
  Users = @($database.users).Count
  AuditLogs = @($database.auditLogs).Count
}
