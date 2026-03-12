param(
  [string]$EnvFile = ".env",
  [string]$BackupDir = "backups",
  [string]$ContainerName = "weblab-mysql"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Read-EnvMap([string]$Path) {
  $map = @{}
  if (-not (Test-Path $Path)) { return $map }
  Get-Content $Path | ForEach-Object {
    $line = $_.Trim()
    if (-not $line) { return }
    if ($line.StartsWith("#")) { return }
    $idx = $line.IndexOf("=")
    if ($idx -lt 1) { return }
    $key = $line.Substring(0, $idx).Trim()
    $val = $line.Substring($idx + 1).Trim()
    $map[$key] = $val
  }
  return $map
}

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $root

$envMap = Read-EnvMap $EnvFile
$dbUser = if ($envMap.ContainsKey("DB_USER")) { $envMap["DB_USER"] } else { "weblab" }
$dbPass = if ($envMap.ContainsKey("DB_PASS")) { $envMap["DB_PASS"] } else { "weblab_pass" }
$dbName = if ($envMap.ContainsKey("DB_NAME")) { $envMap["DB_NAME"] } else { "weblab_f11" }

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  throw "Docker is not installed or not in PATH."
}

New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$outFile = Join-Path $BackupDir "mysql_${dbName}_$stamp.sql"

Write-Host "Creating DB backup to $outFile ..."
$cmd = "docker exec $ContainerName sh -lc `"mysqldump -u$dbUser -p$dbPass --single-transaction --quick $dbName`""
cmd /c "$cmd > `"$outFile`""

if (-not (Test-Path $outFile)) {
  throw "Backup file was not created."
}

Write-Host "Backup complete: $outFile"
