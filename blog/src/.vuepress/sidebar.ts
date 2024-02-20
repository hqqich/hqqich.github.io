// 这个是学习日志里的页面导航，新加的页面要写在children里面；
import {sidebar} from "vuepress-theme-hope";

export default sidebar({
    "/": [
        "",
        {
            text: "学习日志",
            icon: "laptop-code",
            prefix: "md/dev-log/",
            children: ["day01.md",
                "MySQL实战45讲笔记.md",
                "SpringBoot第十三篇：同时集成华为RC6.5.1安全版kafka和原生kafka，通过配置文件动态控制.md",
                "【SpringBoot】 SpringBoot核心-CSDN博客.md",
                "一句话总结Docker与K8S的关系.md",
                "JVM（Java虚拟机） 整理（一）.md",
                "【SpringBoot】38 个常用注解.md",
                "HTML中的常用的特殊字符以及所有特殊字符.md",
                "java中C3P0、Druid、HikariCP 、DBCP连接池的jar包下载与IDEA配置.md",
            ],
        },

        {
            text: "kotlin",
            icon: "laptop-code",
            prefix: "md/kotlin/",
            children: [
                "Gson 和 Kotlin Data Class 的避坑指南.md",
                "Java & Android 集合框架须知须会（1）.md",
                "Java & Android 集合框架须知须会（2）.md",
                "Java & Android 集合框架须知须会（3）.md",
                "Java 多线程开发（1）什么是多线程.md",
                "Java 多线程开发（2）怎么实现多线程同步.md",
                "Java 多线程开发（3）线程活性故障有哪些.md",
                "Java 多线程开发（4）锁的分类有这么多.md",
                "Java 多线程开发（5）超详细的 ThreadPoolExecutor 源码解析.md",
                "Kotlin 协程官方文档（1）协程基础.md",
                "Kotlin 协程官方文档（2）取消和超时.md",
                "Kotlin 协程官方文档（3）组合挂起函数.md",
                "Kotlin 协程官方文档（4）协程上下文和调度器.md",
                "Kotlin 协程官方文档（5）异步流.md",
                "Kotlin 协程官方文档（6）通道.md",
                "Kotlin 协程官方文档（7）异常处理.md",
                "Kotlin 协程官方文档（8）共享可变状态和并发性.md",
                "Kotlin 协程官方文档（9）选择表达式.md",
                "一文快速入门 ConstraintLayout.md",
                "一文快速入门 Gson.md",
                "一文快速入门 Kotlin 协程.md",
                "一文快速入门 RxJava 2.md",
                "一文读懂 Handler 机制.md",
                "一文读懂 Java 和 Kotlin 的泛型难点.md",
                "两万六千字带你 Kotlin 入门.md",
                "主流开源库源码分析（11）OkHttp 源码详解.md",
                "主流开源库源码分析（12）OkHttp & Retrofit 开发调试利器.md",
                "探究 Bitmap 的优化手段.md",
                "探究 Kotlin 的隐藏性能开销与避坑指南.md",
            ],

        }
    ],
});
