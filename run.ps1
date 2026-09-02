$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$ngrokSession = $null

try {
    Write-Host "[1/3] Building Vue frontend..." -ForegroundColor Cyan
    Set-Location "$Root\frontend"
    & npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Frontend build that bai (exit code $LASTEXITCODE)."
    }

    Write-Host "[2/3] Starting Ngrok tunnel for port 8082..." -ForegroundColor Cyan
    Set-Location $Root
    & "$Root\scripts\prepare-backend-env.ps1" -Port 8082
    $ngrokSession = & "$Root\scripts\start-ngrok.ps1" -Port 8082

    Write-Host "[3/3] Starting Spring Boot with SQL Server configuration..." -ForegroundColor Cyan
    & mvn spring-boot:run
    if ($LASTEXITCODE -ne 0) {
        throw "Spring Boot ket thuc voi exit code $LASTEXITCODE."
    }
} finally {
    Set-Location $Root
    if ($null -ne $ngrokSession -and $ngrokSession.Started -and $ngrokSession.ProcessId) {
        Stop-Process -Id $ngrokSession.ProcessId -Force -ErrorAction SilentlyContinue
        Write-Host "Da dung phien Ngrok do run.ps1 khoi tao." -ForegroundColor Yellow
    }
}
