param(
    [ValidateRange(1, 65535)]
    [int]$Port = 8082,

    [switch]$NonInteractive
)

$ErrorActionPreference = "Continue"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   CARSTORE - KHOI DONG NGROK TUNNEL (PORT $Port)   " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Tim ngrok.exe o cac vi tri kha thi
$ngrokPath = $null

$cmd = Get-Command ngrok -ErrorAction SilentlyContinue
if ($null -ne $cmd) {
    $ngrokPath = $cmd.Source
}

if (-not $ngrokPath -or -not (Test-Path $ngrokPath)) {
    $possiblePaths = @(
        "$PSScriptRoot\ngrok.exe",
        "$PSScriptRoot\scripts\ngrok.exe",
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
    Write-Host "[LOI] Khong tim thay file ngrok.exe tren he thong!" -ForegroundColor Red
    Write-Host "Vui long copy file ngrok.exe dan vao thu muc goc du an ($PSScriptRoot) hoac tai lai tu https://ngrok.com" -ForegroundColor Yellow
    if (-not $NonInteractive) {
        Read-Host "Nhan Enter de thoat..."
    }
    exit 1
}

Write-Host "[OK] Da tim thay ngrok tai: $ngrokPath" -ForegroundColor Green

# 2. Ham lay tunnel HTTPS dang chay tu API 127.0.0.1:4040
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

# 3. Kiem tra xem Ngrok da mo tunnel cho cong 8082 chua
$existingTunnel = Get-NgrokTunnel
if ($null -ne $existingTunnel) {
    $publicUrl = $existingTunnel.public_url
    Write-Host "`n[THONG BAO] Ngrok da dang chay san cho cong $Port!" -ForegroundColor Yellow
    Write-Host "--------------------------------------------------" -ForegroundColor DarkGray
    Write-Host "Forwarding URL  : $publicUrl" -ForegroundColor Green
    Write-Host "SePay Webhook URL: $publicUrl/api/payment/sepay/webhook" -ForegroundColor Cyan
    Write-Host "--------------------------------------------------" -ForegroundColor DarkGray
    Write-Host "Hay copy URL SePay Webhook o tren dan vao trang quan tri my.sepay.vn" -ForegroundColor Yellow
    
    if (-not $NonInteractive) {
        Write-Host "`nNhan Ctrl+C hoac Enter de dong..." -ForegroundColor Gray
        Read-Host
    }
    exit 0
}

# 4. Khoi chay tien trinh Ngrok
Write-Host "`nDang mo tunnel Ngrok toi http://localhost:$Port ..." -ForegroundColor Yellow

$ngrokProcess = Start-Process -FilePath $ngrokPath `
    -ArgumentList @("http", "$Port") `
    -WindowStyle Normal `
    -PassThru

# 5. Doai Ngrok lay URL cong khai (toi da 15 giay)
$tunnel = $null
for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Milliseconds 500
    if ($ngrokProcess.HasExited) {
        Write-Host "[LOI] Ngrok bi tat ngay sau khi bat." -ForegroundColor Red
        Write-Host "Nguyen nhan co the do chua them Authtoken. Hay mo Terminal go:" -ForegroundColor Yellow
        Write-Host "   & '$ngrokPath' config add-authtoken <YOUR_TOKEN>" -ForegroundColor White
        if (-not $NonInteractive) {
            Read-Host "Nhan Enter de thoat..."
        }
        exit 1
    }
    $tunnel = Get-NgrokTunnel
    if ($null -ne $tunnel) {
        break
    }
}

if ($null -ne $tunnel) {
    $publicUrl = $tunnel.public_url
    Write-Host "`n==================================================" -ForegroundColor Green
    Write-Host "   NGROK TUNNEL DA KHOI TAO THANH CONG!          " -ForegroundColor Green
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host "Forwarding URL  : $publicUrl" -ForegroundColor Green
    Write-Host "SePay Webhook URL: $publicUrl/api/payment/sepay/webhook" -ForegroundColor Cyan
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host "Dan URL SePay Webhook o tren vao Cau hinh Webhook tren my.sepay.vn" -ForegroundColor Yellow
    Write-Host "Mo http://127.0.0.1:4040 tren trinh duyiet de soi chi tiet tung request." -ForegroundColor Gray

    if (-not $NonInteractive) {
        Write-Host "`n[DANG GIU TUNNEL HOAT DONG] Nhan Enter hoac Ctrl+C de dung..." -ForegroundColor Gray
        try {
            Read-Host
        } finally {
            if ($ngrokProcess -and -not $ngrokProcess.HasExited) {
                Stop-Process -Id $ngrokProcess.Id -Force -ErrorAction SilentlyContinue
                Write-Host "Da dung tien trinh Ngrok." -ForegroundColor Yellow
            }
        }
    }
} else {
    Write-Host "[LOI] Khong ket noi duoc API Ngrok sau 15s. Kiem tra ket noi mang." -ForegroundColor Red
    if ($ngrokProcess -and -not $ngrokProcess.HasExited) {
        Stop-Process -Id $ngrokProcess.Id -Force -ErrorAction SilentlyContinue
    }
    if (-not $NonInteractive) {
        Read-Host "Nhan Enter de thoat..."
    }
    exit 1
}
