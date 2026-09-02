param(
    [ValidateRange(1, 65535)]
    [int]$Port = 8082
)

$ErrorActionPreference = "Stop"

function Get-CarStoreNgrokTunnel {
    try {
        $response = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels" -TimeoutSec 1 -ErrorAction SilentlyContinue
        return @($response.tunnels) | Where-Object {
            $address = [string]$_.config.addr
            $_.proto -eq "https" -and $address -match "(^|:)$Port$"
        } | Select-Object -First 1
    } catch {
        return $null
    }
}

$tunnel = Get-CarStoreNgrokTunnel
if ($null -ne $tunnel) {
    Write-Host "Ngrok dang chay, tai su dung tunnel cong $Port." -ForegroundColor Yellow
    Write-Host "Forwarding URL: $($tunnel.public_url)" -ForegroundColor Green
    Write-Host "SePay Webhook : $($tunnel.public_url)/api/payment/sepay/webhook" -ForegroundColor Cyan
    return [pscustomobject]@{
        PublicUrl = [string]$tunnel.public_url
        ProcessId = $null
        Started   = $false
    }
}

$ngrokPath = $null
$cmd = Get-Command ngrok -ErrorAction SilentlyContinue
if ($null -ne $cmd) {
    $ngrokPath = $cmd.Source
}

if (-not $ngrokPath -or -not (Test-Path $ngrokPath)) {
    $possiblePaths = @(
        "$PSScriptRoot\..\ngrok.exe",
        "$PSScriptRoot\ngrok.exe",
        "$env:LOCALAPPDATA\Programs\ngrok-latest\ngrok.exe",
        "$env:LOCALAPPDATA\ngrok\ngrok.exe",
        "$env:USERPROFILE\Downloads\ngrok.exe",
        "C:\ngrok\ngrok.exe",
        "D:\ngrok.exe"
    )

    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            $ngrokPath = (Resolve-Path $path).Path
            break
        }
    }
}

if (-not $ngrokPath) {
    Write-Host "[WARNING] Khong tim thay ngrok trong PATH hay thu muc du an. Bo qua Ngrok va chay local..." -ForegroundColor Yellow
    return $null
}

if (Get-Process ngrok -ErrorAction SilentlyContinue) {
    Write-Host "[WARNING] Ngrok dang chay nhung khong co tunnel HTTPS cho cong $Port. Bo qua Ngrok va chay local..." -ForegroundColor Yellow
    return $null
}

$ngrokProcess = Start-Process -FilePath $ngrokPath `
    -ArgumentList @("http", "$Port") `
    -WindowStyle Normal `
    -PassThru
    
for ($attempt = 0; $attempt -lt 40; $attempt++) {
    Start-Sleep -Milliseconds 500
    if ($ngrokProcess.HasExited) {
        Write-Host "[WARNING] Ngrok ket thuc som (chua dang nhap authtoken hoac loi mang). Bo qua Ngrok va chay local..." -ForegroundColor Yellow
        return $null
    }
    $tunnel = Get-CarStoreNgrokTunnel
    if ($null -ne $tunnel) {
        break
    }
}

if ($null -eq $tunnel) {
    Stop-Process -Id $ngrokProcess.Id -Force -ErrorAction SilentlyContinue
    Write-Host "[WARNING] Khong lay duoc Forwarding URL tu Ngrok sau 20 giay. Bo qua Ngrok va chay local..." -ForegroundColor Yellow
    return $null
}

Write-Host "Forwarding URL: $($tunnel.public_url)" -ForegroundColor Green
Write-Host "SePay Webhook : $($tunnel.public_url)/api/payment/sepay/webhook" -ForegroundColor Cyan

return [pscustomobject]@{
    PublicUrl = [string]$tunnel.public_url
    ProcessId = $ngrokProcess.Id
    Started   = $true
}
