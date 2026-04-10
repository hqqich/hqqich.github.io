@echo off
setlocal

cd /d "%~dp0"

set "PORT=%~1"
if "%PORT%"=="" set "PORT=8888"

python -V >nul 2>nul
if errorlevel 1 (
    echo [错误] Python 无法使用。请安装 Python 3 并确保在命令提示符中 python 能正常运行。
    exit /b 1
)

echo Starting web server at http://127.0.0.1:%PORT%/
python -m http.server %PORT%
