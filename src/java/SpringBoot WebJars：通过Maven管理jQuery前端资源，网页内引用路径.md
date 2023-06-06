SpringBoot WebJars：通过Maven管理jQuery前端资源，网页内引用路径
__扇子 2018-05-07 111533 6354 收藏 3
分类专栏： Java前端 Java后端
版权

范培忠 2018-05-07

　　我们在项目中通过Maven来管理后端包依赖，既省空间又省时间。

　　前端包依赖Maven管理也可以借助WebJars来实现。就不需要下载Bootstrap和jQuery等资源就可直接引用，更不需要在Git库上传了。

　　WebJars支持的前端资源很多，具体可参考：All Deployed WebJars

　　使用WebJars示例如下（本示例以Spring boot为基础，其它Spring项目其实也是类似的）。

　　后面会示范如何对引入的WebJars包内的静态内容进行引用。

　　一、Maven依赖：

    dependency
        groupIdorg.webjarsgroupId
        artifactIdbootstrapartifactId
        version3.3.7version
    dependency
    dependency
        groupIdorg.webjarsgroupId
        artifactIdjqueryartifactId
        version3.3.1version
    dependency

　　二、直接引用：

    html xmlnsth=httpwww.thymeleaf.org
    head
        titleWebJars Demotitle
        !--如果未引入webjars-locator，相关静态资源需要版本号，此处不便于升级--
        script thsrc=@{webjarsjquery3.3.1jquery.min.js}script
        script thsrc=@{webjarsbootstrap3.3.7jsbootstrap.min.js}script
        link rel=stylesheet thhref=@{webjarsbootstrap3.3.7cssbootstrap.min.css}
    head
    body
    div class=containerbr
        div class=alert alert-success
            a href=# class=close data-dismiss=alert aria-label=close×a
            Hello, strongWebJars!strong
        div
    div
    body
    html

　　这样，看见的页面就能使用bootstrap等了，如下：


　　三、省略页面引用时的版本号：

　　写死版本号不利于项目资源升级，可额外使用webjars-locator来省略引用时的版本号：

　　添加之后的pom文件如下：

    dependency
        groupIdorg.webjarsgroupId
        artifactIdwebjars-locatorartifactId
        version0.34version
    dependency
    dependency
        groupIdorg.webjarsgroupId
        artifactIdbootstrapartifactId
        version3.3.7version
    dependency
    dependency
        groupIdorg.webjarsgroupId
        artifactIdjqueryartifactId
        version3.3.1version
    dependency

　　然后就可以不带版本号访问了：

    html xmlnsth=httpwww.thymeleaf.org
    head
        titleWebJars locator Demotitle
        !--因为额外引入了webjars-locator，所以相关静态资源的引入可省略版本号便于升级--
        script thsrc=@{webjarsjqueryjquery.min.js}script
        script thsrc=@{webjarsbootstrapjsbootstrap.min.js}script
        link rel=stylesheet thhref=@{webjarsbootstrapcssbootstrap.min.css}
    head

　　效果如下：


　　PS：在网页内的引用


　　ExtalExternal Libraries下找到需要引用的静态资源，按Ctrl+Shift+Alt+c，即可复制路径。如下：

Fmaven_3.3.9repositoryorgwebjarsecharts3.2.3echarts-3.2.3.jar!META-INFresourceswebjarsecharts3.2.3echarts.min.js

　　删除WebJars前面的部分即可。


参考资料：

1. httpsblog.csdn.netqq_36688143articledetails79448537

2. httpswww.cnblogs.comliaojie970p7852576.html

3. httpswww.jianshu.comp792b05271099
————————————————
版权声明：本文为CSDN博主「__扇子」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：httpsblog.csdn.netfanpeizhongarticledetails80222481