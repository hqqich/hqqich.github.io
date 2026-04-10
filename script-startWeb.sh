#!/usr/bin/env bash

set -euo pipefail

cd -- "$(dirname -- "${BASH_SOURCE[0]}")"

port="${1:-8888}"

if command -v python3 >/dev/null 2>&1; then
  python_cmd=(python3)
elif command -v python >/dev/null 2>&1; then
  python_cmd=(python)
else
  echo "[错误] Python 无法使用。请安装 Python 3 并确保在命令行中 python3 或 python 能正常运行。" >&2
  exit 1
fi

echo "Starting web server at http://127.0.0.1:${port}/"
"${python_cmd[@]}" -m http.server "${port}"
