$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "[1/2] Building Vue frontend..."
Set-Location "$Root\frontend"
npm run build

Write-Host "[2/2] Starting Spring Boot (H2 profile)..."
Set-Location $Root
mvn spring-boot:run "-Dspring-boot.run.profiles=h2"
