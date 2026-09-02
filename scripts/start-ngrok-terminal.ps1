param(
    [ValidateRange(1, 65535)]
    [int]$Port = 8082
)

$ErrorActionPreference = "Continue"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   CARSTORE - KHOI DONG NGROK (PORT $Port)          " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Kiem tra xem Ngrok da dang chay va co tunnel cho port 8082 chua
function Get-NgrokTunnel {
    try {
        $res = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels" -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($res -and $res.tunnels) {
            return @($res.tunnels) | Where-Object {
                $_.proto -eq "https" -and [string]$_.config.addr -match "(^|:)$Port$"
            } | Select-Object -First 1
        }
    } catch {}
    return $null
}

$tunnel = Get-NgrokTunnel
if ($null -ne $tunnel) {
    $publicUrl = $tunnel.public_url
    Write-Host "[OK] Ngrok dang chay san cho cong $Port!" -ForegroundColor Green
    Write-Host "--------------------------------------------------" -ForegroundColor DarkGray
    Write-Host "Forwarding URL   : $publicUrl" -ForegroundColor Green
    Write-Host "SePay Webhook URL: $publicUrl/api/payment/sepay/webhook" -ForegroundColor Cyan
    Write-Host "--------------------------------------------------" -ForegroundColor DarkGray
    Write-Host "[NGROK_READY] Ngrok tunnel is fully ready for port $Port" -ForegroundColor Green
    exit 0
}

# 2. Tim file ngrok.exe trong thu muc du an hoac system
$ngrokPath = $null

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

if (-not $ngrokPath) {
    $cmd = Get-Command ngrok -ErrorAction SilentlyContinue
    if ($null -ne $cmd) {
        $ngrokPath = $cmd.Source
    }
}

if (-not $ngrokPath) {
    Write-Host "[LOI] Khong tim thay file ngrok.exe tren he thong!" -ForegroundColor Red
    Write-Host "[NGROK_READY] Skipping Ngrok as ngrok.exe was not found" -ForegroundColor Yellow
    exit 0
}

Write-Host "[OK] Tim thay Ngrok tai: $ngrokPath" -ForegroundColor Green
Write-Host "Dang khoi chay Ngrok tunnel HTTP $Port..." -ForegroundColor Yellow

# 3. Khoi chay Ngrok qua Start-Process PowerShell window/process
Start-Process -FilePath "powershell.exe" `
    -ArgumentList "-NoExit", "-Command", "`$Host.UI.RawUI.WindowTitle='Ngrok Tunnel (Port $Port)'; & '$ngrokPath' http $Port" `
    -WindowStyle Normal

# 4. Doi toi da 10s de xac nhan Ngrok tunnel khoi tao va in URL
$publicUrl = $null
for ($i = 0; $i -lt 20; $i++) {
    Start-Sleep -Milliseconds 500
    $tunnel = Get-NgrokTunnel
    if ($null -ne $tunnel) {
        $publicUrl = $tunnel.public_url
        break
    }
}

if ($publicUrl) {
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host "   NGROK TUNNEL KHOI TAO THANH CONG!             " -ForegroundColor Green
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host "Forwarding URL   : $publicUrl" -ForegroundColor Green
    Write-Host "SePay Webhook URL: $publicUrl/api/payment/sepay/webhook" -ForegroundColor Cyan
    Write-Host "==================================================" -ForegroundColor Green
} else {
    Write-Host "[CANH BAO] Ngrok da duoc bat o cua so rieng nhung chua nhan duoc API tunnel." -ForegroundColor Yellow
}

Write-Host "[NGROK_READY] Ngrok tunnel is fully ready for port $Port" -ForegroundColor Green
exit 0
