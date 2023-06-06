# go 配置



GO下载         `https://golang.org/dl/`



### 环境变量设置

| 变量           | 值                                    |
| -------------- | ------------------------------------- |
| GOROOT         | C:\Program Files\Go\                  |
| GOPATH         | c:\gopath                             |
| GO111MODULE    | on                                    |
| GOPROXY        | https://mirrors.aliyun.com/goproxy/   |
| GOSUMDB        | off                                   |
| path（中添加） | C:\Program Files\Go\bin;%GOPATH%/bin; |





go mod 有以下命令：

| 命令     | 说明                                                         |
| -------- | ------------------------------------------------------------ |
| download | download modules to local cache(下载依赖包)                  |
| edit     | edit go.mod from tools or scripts（编辑go.mod)               |
| graph    | print module requirement graph (打印模块依赖图)              |
| verify   | initialize new module in current directory（在当前目录初始化mod） |
| tidy     | add missing and remove unused modules(拉取缺少的模块，移除不用的模块) |
| vendor   | make vendored copy of dependencies(将依赖复制到vendor下)     |
| verify   | verify dependencies have expected content (验证依赖是否正确） |
| why      | explain why packages or modules are needed(解释为什么需要依赖) |

比较常用的是 `init`,`tidy`, `edit`

### 



项目中运行`go mod tidy`来下载魔族包











## golang的goproxy配置

```shell
go env -w GO111MODULE=on     // Windows  
export GO111MODULE=on        // macOS 或 Linux
```

2.配置goproxy:

阿里配置：

```shell
go env -w GOPROXY=https://mirrors.aliyun.com/goproxy/       // Windows  
export GOPROXY=https://mirrors.aliyun.com/goproxy/          // macOS 或 Linux
```

七牛云配置：

```shell
go env -w GOPROXY=https://goproxy.cn      // Windows  
export GOPROXY=https://goproxy.cn         // macOS 或 Linux
```

注意：

Go 1.13设置了默认的GOSUMDB=[sum.golang.org](https://links.jianshu.com/go?to=http%3A%2F%2Fsum.golang.org)，是用来验证包的有效性。这个网址由于墙的原因可能无法访问，所以可以使用下面命令来关闭：

```shell
go env -w GOSUMDB=off // Windows  
export GOSUMDB=off // macOS 或 Linux
```





