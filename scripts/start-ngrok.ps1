param(
    [ValidateRange(1, 65535)]
    [int]$Port = 8082
)

$ErrorActionPreference = "Stop"

function Get-CarStoreNgrokTunnel {
    try {
        $response = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels" -TimeoutSec 1
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
    Write-Host "Ngrok dang chay, tai su dung tunnel cong 8082." -ForegroundColor Yellow
    Write-Host "Forwarding URL: $($tunnel.public_url)" -ForegroundColor Green
    Write-Host "SePay Webhook: $($tunnel.public_url)/api/payment/sepay/webhook" -ForegroundColor Cyan
    return [pscustomobject]@{
        PublicUrl = [string]$tunnel.public_url
        ProcessId = $null
        Started   = $false
    }
}

$ngrokCommand = Get-Command ngrok -ErrorAction SilentlyContinue
if ($null -eq $ngrokCommand) {
    throw "Khong tim thay ngrok trong PATH. Hay cai Ngrok va dang nhap bang 'ngrok config add-authtoken ...'."
}

if (Get-Process ngrok -ErrorAction SilentlyContinue) {
    throw "Ngrok dang chay nhung khong co tunnel HTTPS cho cong $Port. Hay dong phien Ngrok cu roi chay lai."
}

$ngrokProcess = Start-Process -FilePath $ngrokCommand.Source `
    -ArgumentList @("http", "$Port") `
    -WindowStyle Normal `
    -PassThru
    
for ($attempt = 0; $attempt -lt 40; $attempt++) {
    Start-Sleep -Milliseconds 500
    if ($ngrokProcess.HasExited) {
        throw "Ngrok ket thuc som. Hay kiem tra authtoken va ket noi Internet."
    }
    $tunnel = Get-CarStoreNgrokTunnel
    if ($null -ne $tunnel) {
        break
    }
}

if ($null -eq $tunnel) {
    Stop-Process -Id $ngrokProcess.Id -Force -ErrorAction SilentlyContinue
    throw "Khong lay duoc Forwarding URL tu Ngrok sau 20 giay."
}

Write-Host "Forwarding URL: $($tunnel.public_url)" -ForegroundColor Green
Write-Host "SePay Webhook: $($tunnel.public_url)/api/payment/sepay/webhook" -ForegroundColor Cyan

return [pscustomobject]@{
    PublicUrl = [string]$tunnel.public_url
    ProcessId = $ngrokProcess.Id
    Started   = $true
}
