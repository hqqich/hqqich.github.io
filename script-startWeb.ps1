param(
    [int]$Port = 8888
)

Set-Location -LiteralPath $PSScriptRoot

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "[错误] Python 无法使用。请安装 Python 3 并确保在命令提示符中 python 能正常运行。"
    exit 1
}

Write-Host "Starting web server at http://127.0.0.1:$Port/"
python -m http.server $Port
