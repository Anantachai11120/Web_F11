param(
  [Parameter(Mandatory = $true)]
  [string]$File,
  [string]$EnvFile = ".env",
  [string]$ContainerName = "weblab-mysql",
  [string]$UploadsArchive = "",
  [string]$UploadsDir = "data/uploads"
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

if (-not (Test-Path $File)) {
  throw "Backup file not found: $File"
}
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  throw "Docker is not installed or not in PATH."
}

$envMap = Read-EnvMap $EnvFile
$dbUser = if ($envMap.ContainsKey("DB_USER")) { $envMap["DB_USER"] } else { "weblab" }
$dbPass = if ($envMap.ContainsKey("DB_PASS")) { $envMap["DB_PASS"] } else { "weblab_pass" }
$dbName = if ($envMap.ContainsKey("DB_NAME")) { $envMap["DB_NAME"] } else { "weblab_f11" }

Write-Host "Restoring DB from $File ..."
$cmd = "docker exec -i $ContainerName sh -lc `"mysql -u$dbUser -p$dbPass $dbName`" < `"$File`""
cmd /c $cmd
if (-not $UploadsArchive) {
  $name = [System.IO.Path]::GetFileName($File)
  if ($name -match '^mysql_[^_]+_(\d{8}_\d{6})\.sql(\.gz)?$') {
    $stamp = $Matches[1]
    $guess = Join-Path ([System.IO.Path]::GetDirectoryName((Resolve-Path $File))) "uploads_$stamp.zip"
    if (Test-Path $guess) { $UploadsArchive = $guess }
  }
}
if ($UploadsArchive -and (Test-Path $UploadsArchive)) {
  Write-Host "Restoring uploads from $UploadsArchive ..."
  if (Test-Path $UploadsDir) { Remove-Item $UploadsDir -Recurse -Force }
  New-Item -ItemType Directory -Path $UploadsDir -Force | Out-Null
  Expand-Archive -Path $UploadsArchive -DestinationPath $UploadsDir -Force
}
Write-Host "Restore complete."
