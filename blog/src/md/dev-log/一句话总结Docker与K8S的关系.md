---
title: 一句话总结Docker与K8S的关系
index: false
icon: laptop-code
category:
    Docker
---

> 一句话总结：Docker只是容器的一种，它面向的是单体，K8S可以管理多种容器，它面向的是集群，Docker可以作为一种容器方案被K8S管理。下文继续具体介绍。

### 1、容器的核心概念

介绍这几个核心概念：OCI、CR、Runc、Containerd、CRI。

#### 1.1、容器运行规范

容器运行规范OCI（Open Container Initiative）即开放的容器运行时规范，定义了镜像和容器运行时的规范。

容器镜像规范：该规范的目标是创建可互操作的工具，用于构建、传输和准备运行的容器镜像。

容器运行时规范：该规范用于定义容器的配置、执行环境和生命周期。

#### 1.2、容器运行时

容器运行时（Container Runtime）负责以下工作：拉取镜像、提取镜像到文件系统、为容器准备挂载点、从容器镜像中设置元数据以确保容器按预期运行、提醒内核为该容器分配某种隔离、提醒内核为该容器分配资源限制、调用系统指令启动容器等。

容器运行时的有如下方案：Containerd、CRI-O 、Kata、Virtlet等等。

#### 1.3、RunC

RunC （Run Container）是从 Docker 的 libcontainer 中迁移而来的，实现了容器启停、资源隔离等功能。Docker将RunC捐赠给 OCI 作为OCI 容器运行时标准的参考实现。

RunC是一个基于OCI标准实现的一个轻量级容器运行工具，用来创建和运行容器。纯从系统角度，Runc才是底层的容器运行时 。

#### 1.4、Containerd

Containerd是用来维持通过RunC创建的容器的运行状态。即RunC用来创建和运行容器，containerd作为常驻进程用来管理容器。`containerd（container daemon）`是一个daemon进程用来管理和运行容器，可以用来拉取/推送镜像和管理容器的存储和网络。其中可以调用runc来创建和运行容器。

很早之前的 Docker Engine 中就有了 Containerd，只不过现在是将 Containerd 从 Docker Engine 里分离出来，作为一个独立的开源项目，目标是提供一个更加开放、稳定的容器运行基础设施。分离出来的Containerd 将具有更多的功能，涵盖整个容器运行时管理的所有需求，提供更强大的支持。

Containerd 是一个工业级标准的容器运行时，它强调**简单性**、**健壮性**和**可移植性**，Containerd 可以负责干下面这些事情：

*   管理容器的生命周期（从创建容器到销毁容器）
*   拉取/推送容器镜像
*   存储管理（管理镜像及容器数据的存储）
*   调用 runc 运行容器（与 runc 等容器运行时交互）
*   管理容器网络接口及网络

**K8S自v1.24 起，已经删除了Dockershim** ，使用Containerd作为容器运行时。选择 Containerd原因是，它的调用链更短，组件更少，更稳定，占用节点资源更少。

#### 1.5、Docker、Containerd、RunC的关系

三者关系，见下图：

![](https://img.mangod.top/blog/202308191006949.png)

![](https://img.mangod.top/blog/202308190953039.png)

#### 1.6、CRI

容器运行时是 Kubernetes（K8S） 最重要的组件之一，负责管理镜像和容器的生命周期。Kubelet 通过 `Container Runtime Interface (CRI)` 与容器运行时交互，以管理镜像和容器。

**CRI即容器运行时接口，主要用来定义K8S与容器运行时的API调用**，kubelet通过CRI来调用容器运行时，只要实现了CRI接口的容器运行时就可以对接到K8S的kubelet组件。

![](https://img.mangod.top/blog/202308191024448.png)

### 2、Docker和K8S的关系

Docker和K8S本质上都是创建容器的工具，Docker作用与单机，K8S作用与集群。

在单机的容器解决方案，首选Docker。随着时代的发展，对系统的性能有了更高的要求，高可用、高并发都是基本要求。随着要求变高的的同时，单机显然性能就跟不上了，服务器集群管理就是发展趋势，所以 Kubernetes 为代表的云原生技术强势发展。

#### 2.1、容器创建调用链路

Docker、Kubernetes、OCI、CRI-O、containerd、runc，他们是如何一起协作的呢，见下图。

![](https://img.mangod.top/blog/202308191135670.png)

上图所示为容器的调用链路。如图我们看到的，只要是实现了CRI的容器运行时就能够被K8S采用。Containerd是通过CRI Plugin 来适配CRI的，而CRI-O则是为CRI量生打造。

我们还可以看到包括了Docker和K8S两条主线，其中Docker主要是在面向单体应用，K8S是用于集群。

#### 2.2、关系

从上面的容器调用链路可以看到，对于Containerd 和 CRI-O我们非常清楚他们是干嘛的，但是对于Docker和K8S间的联系我们还需要再来理一下。

![](https://img.mangod.top/blog/202308191031983.png)

如图为K8S与Docker之间的联系（包含K8S1.23版本在内以及之前的版本），从K8S-1.24版本开始将移除docker-shim模块。下面继续看看他们之间的小故事。

### 3、Dockershim的小故事

#### 3.1、dockershim的由来

自 K8S - v1.24 起，Dockershim 已被删除，这对K8S项目来说是一个积极的举措。

在 K8S 的早期，只支持一个容器运行时，那个容器运行时就是 Docker Engine。 那时并没有其他的选择。

随着时间推移，我们开始添加更多的容器运行时，比如 rkt 和 hypernetes，很明显 K8S 用户希望选择最适合他们的运行时。因此，K8S 需要一种方法来允许K8S集群灵活地使用任何容器运行时。

于是有了容器运行时接口 (CRI) 的发布，CRI 的引入对K8S项目和K8S用户来说都很棒，但它引入了一个问题：Docker Engine 作为容器运行时的使用早于 CRI，所以Docker Engine 不兼容 CRI。

为了解决这个问题，在 kubelet 组件中引入了一个小型软件 shim (dockershim)，专门用于填补 Docker Engine 和 CRI 之间的空白， 允许集群继续使用 Docker Engine 作为容器运行时。

#### 3.2、dockershim的宿命

然而，这个小软件 shim 从来没有打算成为一个永久的解决方案。 多年来，它的存在给 kubelet 本身带来了许多不必要的复杂性。由于这个 shim，Docker 的一些集成实现不一致，导致维护人员的负担增加。

总之，这样的方式不但带来了更高的复杂度，而且由于部件的增加也增加了不稳定的因素，同时还增加了维护负担，所以弃用dockershim是迟早的事。

**总结**：**dockershim** 一直都是 K8S 社区为了能让 Docker 成为其支持的容器运行时，所维护的一个兼容程序。 现在\*\*所谓的废弃，\*\*也仅仅是 K8S 要放弃对现在代码仓库中的 dockershim 的维护支持。以便K8S可以像刚开始时计划的那样，仅负责维护其 CRI ，任何兼容 CRI 的容器运行时，都可以作为 K8S 的 runtime。

**3.3、流转图：**

![](https://img.mangod.top/blog/202308191031628.png)

**总结**：本文讲了**容器的核心概念、Docker和K8S的关系、Dockershim的小故事**，希望对你有帮助！

**本篇完结！感谢你的阅读，欢迎点赞 关注 收藏 私信！！！**

**原文链接：**[https://mp.weixin.qq.com/s/jmoxfDJxYKK7sLQLylaS8w](https://mp.weixin.qq.com/s/jmoxfDJxYKK7sLQLylaS8w)

![](https://img.mangod.top/blog/202305191058876.jpg)

本文转自 <https://www.cnblogs.com/mangod/p/18007490>，如有侵权，请联系删除。
