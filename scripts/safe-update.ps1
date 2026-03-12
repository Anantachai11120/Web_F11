param(
  [string]$Branch = "main"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $root

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  throw "Docker is not installed or not in PATH."
}
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw "Git is not installed or not in PATH."
}

Write-Host "Step 1/5: Backup database"
powershell -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot "backup-db.ps1")

Write-Host "Step 2/5: Pull latest code"
git pull origin $Branch

Write-Host "Step 3/5: Stop containers (keep DB volume)"
docker compose down --remove-orphans

Write-Host "Step 4/5: Start updated stack"
docker compose up -d --build

Write-Host "Step 5/5: Health check"
Start-Sleep -Seconds 3
docker compose ps
try {
  $health = Invoke-WebRequest -UseBasicParsing "http://localhost:3000/health" -TimeoutSec 10
  Write-Host "Health: $($health.Content)"
} catch {
  Write-Warning "Health check failed. Run: docker compose logs -f --tail=100"
}
