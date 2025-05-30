+++
author = "hqqich"
title = "windows多网络操作"
date = "2025-05-27"
description = "windows多网卡，多网络，路由转发"
tags = [
    "网络",
]
+++


在 Windows 系统中，你可以通过配置路由表来实现将特定子网的流量转发到指定的网关。以下是具体步骤：


## 查看当前路由表

在配置之前，你可以先查看当前的路由表，确保没有冲突的路由规则。

```shell
route print
```

添加特定子网的路由规则

你需要添加两条路由规则：

将 172.22.168.x 的流量转发到 172.12.169.124

其他流量转发到 192.168.1.1

### 添加 172.22.168.x 的路由规则

假设 172.22.168.x 是 172.12.168.0/24 子网，你可以使用以下命令：

```shell
route add 172.12.168.0 mask 255.255.255.0 172.12.169.1 metric 1
```

### 添加默认路由规则

默认情况下，所有其他流量都会通过默认网关转发。你可以将默认网关设置为 192.168.1.1：

```shell
route add 0.0.0.0 mask 0.0.0.0 192.168.1.1 metric 1
```

注意：如果默认网关已经设置为 172.22.169.124 或其他地址，你需要先删除现有的默认路由，然后再添加新的默认路由。

#### 删除默认路由的命令：

```shell
route delete 0.0.0.0
```

#### 然后再添加新的默认路由：

```shell
route add 0.0.0.0 mask 0.0.0.0 192.168.1.1 metric 1
```

### 验证路由表

再次查看路由表，确保新添加的路由规则已经生效：

```shell
route print
```

## 持久化路由规则（可选）

上述命令添加的路由规则在系统重启后会丢失。如果你希望这些规则在重启后仍然有效，可以使用 -p 参数来持久化路由规则。

例如：

```shell
route -p add 172.22.168.0 mask 255.255.255.0 172.12.169.124 metric 1
route -p add 0.0.0.0 mask 0.0.0.0 192.168.1.1 metric 1
```

## 测试网络连接

最后，测试你的网络连接，确保 172.22.168.x 的流量通过 172.12.169.124 转发，而其他流量通过 192.168.1.1 转发。

你可以使用 tracert 命令来跟踪路由路径：

```shell
tracert 172.12.168.1
tracert 8.8.8.8
```

## 注意事项

确保 172.22.169.124 和 192.168.1.1 是可达的，并且它们分别能够正确处理相应的流量。

如果你有多个网卡，确保路由规则中的网关与正确的网卡关联。

通过以上步骤，你应该能够成功配置 Windows 的路由表，实现特定子网的流量转发。

