Start-Sleep -Seconds 3
$tests = @(
    @{url='http://localhost:8082/'; method='GET'},
    @{url='http://localhost:8082/car/list'; method='GET'},
    @{url='http://localhost:8082/api/cars'; method='GET'},
    @{url='http://localhost:8082/api/cart/add/1'; method='POST'},
    @{url='http://localhost:8082/admin/dashboard'; method='GET'}
)

foreach ($t in $tests) {
    try {
        $r = Invoke-WebRequest -UseBasicParsing -Uri $t.url -Method $t.method -ErrorAction Stop
        $status = $null
        if ($r -and $r.StatusCode) { $status = [int]$r.StatusCode } else { $status = 'OK' }
        Write-Output "$($t.url) -> $status"
    } catch {
        if ($_.Exception.Response) {
            $code = $_.Exception.Response.StatusCode.value__
            Write-Output "$($t.url) -> $code"
        } else {
            Write-Output "$($t.url) -> ERROR: $($_.Exception.Message)"
        }
    }
}
