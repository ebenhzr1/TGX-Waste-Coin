# TGX Waste Coin - Database Restore Script (PowerShell)
# Usage: .\database\restore.ps1 -BackupFile .\database\backups\tgx_backup_YYYYMMDD_HHMMSS.sql
# Requires: psql in PATH

param(
    [Parameter(Mandatory=$true)]
    [string]$BackupFile,
    [string]$DatabaseUrl = $env:DATABASE_URL
)

if (-not $DatabaseUrl -or $DatabaseUrl -like "*ISI_CONNECTION*") {
    Write-Error "DATABASE_URL not set."
    exit 1
}

if (-not (Test-Path $BackupFile)) {
    Write-Error "Backup file not found: $BackupFile"
    exit 1
}

Write-Warning "This will OVERWRITE the database. Proceed? (y/N)"
$confirm = Read-Host
if ($confirm -ne 'y' -and $confirm -ne 'Y') {
    Write-Host "Restore cancelled."
    exit 0
}

Write-Host "Restoring from $BackupFile ..."
psql $DatabaseUrl -f $BackupFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "Restore SUCCESS."
} else {
    Write-Error "psql restore FAILED (exit code $LASTEXITCODE)"
    exit 1
}
