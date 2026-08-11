param(
    [ValidateRange(1, 65535)]
    [int]$Port = 8082
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot

$listeners = @(Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
foreach ($processId in @($listeners | Select-Object -ExpandProperty OwningProcess -Unique)) {
    $processInfo = Get-CimInstance Win32_Process -Filter "ProcessId=$processId" -ErrorAction SilentlyContinue
    $commandLine = [string]$processInfo.CommandLine
    $isCarStoreJava = $null -ne $processInfo `
        -and $processInfo.Name -match '^java(w)?\.exe$' `
        -and $commandLine -match 'com\.example\.carstore\.CarStoreApplication|carstore[^\\/]*\.jar'

    if (-not $isCarStoreJava) {
        throw "Cong $Port dang duoc PID $processId su dung nhung khong phai CarStore Java. Tu choi dung nham tien trinh."
    }

    Write-Host "Dang dung CarStore Java cu (PID $processId) tren cong $Port..." -ForegroundColor Yellow
    Stop-Process -Id $processId -Force -ErrorAction Stop
}

if ($listeners) {
    # Cho Tomcat/Windows đóng socket cũ trước khi Java Debugger tạo tiến trình mới.
    Start-Sleep -Seconds 2
}

$deadline = (Get-Date).AddSeconds(3)
do {
    $remaining = @(Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
    if (-not $remaining) {
        break
    }
    Start-Sleep -Milliseconds 200
} while ((Get-Date) -lt $deadline)

if ($remaining) {
    $remainingIds = ($remaining | Select-Object -ExpandProperty OwningProcess -Unique) -join ", "
    throw "Khong the giai phong cong $Port. PID con lai: $remainingIds."
}

Write-Host "Cong $Port da san sang cho CarStore Backend." -ForegroundColor Green
& "$ProjectRoot\scripts\start-ngrok.ps1" -Port $Port
