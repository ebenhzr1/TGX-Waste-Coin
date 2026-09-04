# TGX Waste Coin - Database Backup Script (PowerShell)
# Usage: .\database\backup.ps1
# Requires: pg_dump in PATH (PostgreSQL client tools installed)

param(
    [string]$DatabaseUrl = $env:DATABASE_URL,
    [string]$BackupDir   = "$PSScriptRoot\backups"
)

if (-not $DatabaseUrl -or $DatabaseUrl -like "*ISI_CONNECTION*") {
    Write-Error "DATABASE_URL not set. Configure it in .env before running backup."
    exit 1
}

# Ensure backup directory exists
New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null

$timestamp  = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFile = "$BackupDir\tgx_backup_$timestamp.sql"

Write-Host "Starting backup -> $backupFile"

pg_dump $DatabaseUrl --no-owner --no-acl --clean --if-exists -f $backupFile

if ($LASTEXITCODE -eq 0) {
    $sizeMB = [math]::Round((Get-Item $backupFile).Length / 1MB, 2)
    Write-Host "Backup SUCCESS: $backupFile ($sizeMB MB)"

    # Cleanup: keep only last 30 backups
    Get-ChildItem "$BackupDir\tgx_backup_*.sql" |
        Sort-Object CreationTime -Descending |
        Select-Object -Skip 30 |
        Remove-Item -Force
    Write-Host "Retention: kept last 30 backups."
} else {
    Write-Error "pg_dump FAILED (exit code $LASTEXITCODE)"
    exit 1
}
