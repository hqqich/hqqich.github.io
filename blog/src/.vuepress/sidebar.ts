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
            ],
        },
    ],
});
