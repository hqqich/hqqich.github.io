+++
author = "hqqich"
title = "在 github-workflows   steps 中，使用curl调用接口"
date = "2025-05-25"
description = "Guide to emoji usage in Hugo"
tags = [
    "sql",
]
+++



在 GitHub Actions 的 workflow 文件中，你可以在 `steps` 中使用 `curl` 命令调用 API 接口。以下是一个完整的示例，展示如何在 GitHub Actions 的 workflow 中使用 `curl`：

### 示例：使用 `curl` 调用 API

```yaml
name: Call API with curl

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  call-api:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Call API using curl
        run: |
          # 示例：调用一个公开的API（如JSONPlaceholder）
          response=$(curl -s -X GET "https://jsonplaceholder.typicode.com/posts/1")
          echo "API Response: $response"

          # 如果需要传递请求头（如Content-Type或Authorization）
          # response_with_header=$(curl -s -X GET \
          #   -H "Content-Type: application/json" \
          #   -H "Authorization: Bearer ${{ secrets.API_TOKEN }}" \
          #   "https://api.example.com/data")
          # echo "Response with headers: $response_with_header"

          # 如果需要发送POST请求
          # post_response=$(curl -s -X POST \
          #   -H "Content-Type: application/json" \
          #   -d '{"key": "value"}' \
          #   "https://api.example.com/create")
          # echo "POST Response: $post_response"
```

### 关键点说明：
1. **`run` 指令**：在 `steps` 中使用 `run` 执行 shell 命令（如 `curl`）。
2. **请求方法**：
    - `-X GET`：GET 请求（默认可以省略）。
    - `-X POST`：POST 请求。
3. **请求头**：
    - `-H "Content-Type: application/json"`：设置请求头。
    - `-H "Authorization: Bearer ${{ secrets.API_TOKEN }}"`：使用 GitHub Secrets 传递敏感信息（如 API Token）。
4. **请求体**：
    - `-d '{"key": "value"}'`：发送 JSON 格式的请求体。
5. **静默模式**：
    - `-s`：禁止 `curl` 输出进度或错误信息（适合日志干净的场景）。
6. **输出响应**：
    - 将响应保存到变量（如 `response=$(curl ...)`）或直接打印。

### 高级用法：
- **处理响应状态码**：
  ```yaml
  - name: Check API status
    run: |
      status_code=$(curl -s -o /dev/null -w "%{http_code}" "https://api.example.com/health")
      echo "Status Code: $status_code"
      if [ "$status_code" -ne 200 ]; then
        echo "API call failed!"
        exit 1
      fi
  ```

- **使用 `jq` 解析 JSON 响应**（需先安装）：
  ```yaml
  - name: Parse JSON response
    run: |
      sudo apt-get install -y jq  # 安装jq
      response=$(curl -s "https://jsonplaceholder.typicode.com/posts/1")
      title=$(echo "$response" | jq -r '.title')
      echo "Title: $title"
  ```

### 注意事项：
1. **网络权限**：GitHub Actions 默认允许出站流量，但某些 API 可能需要配置 IP 白名单。
2. **超时处理**：默认情况下，GitHub Actions 的 `run` 命令超时为 6 小时，但建议显式设置 `curl` 超时：
   ```bash
   curl --max-time 10 ...  # 10秒超时
   ```
3. **错误处理**：如果 `curl` 失败（非 2xx 状态码），默认会返回非零退出码，导致步骤失败。

### 完整示例（带错误处理）：
```yaml
- name: Call API with error handling
  run: |
    if ! response=$(curl -s -f -X GET "https://api.example.com/data"); then
      echo "API call failed with status: $?"
      exit 1
    fi
    echo "Success: $response"
```

通过以上方式，你可以在 GitHub Actions 中灵活调用 API 并处理响应。

