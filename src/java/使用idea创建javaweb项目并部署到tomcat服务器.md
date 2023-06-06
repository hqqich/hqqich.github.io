# 使用idea创建javaweb项目并部署到tomcat服务器

之前一直使用eclipse和myeclipse编辑器，对于idea不太熟悉，听闻周围的前辈说idea用起更方便些，故开始尝试使用idea编辑器，现把我在idea中配置及创建javaweb的一个demo中遇到的问题及解决方案记录下来，供大家参考。

1.在idea创建javaweb 项目时，常用到tomcat服务器，但在idea配置tomcat服务器中，很尴尬的是居然没有tomcat相关这一项，在网上查了些资料，解决方案如下：



**1.intellij IDEA配置tomcat**

***\*方法来源于这位大佬的博客：http://blog.csdn.net/dream_an/article/details/49020211\**
**

**如果网上流传的方法（即方法2）不能配置成功，点击加号什么都没有的话，请看方法一配置方法。**

**解决问题：intlellij IDEA配置tomcat点击加号没东西。**

**方法一：手动添加tomcat插件然后再导入tomcat路径。**

步骤1：进入项目之前或者close project可以看到如下界面，选择Plugins

![img](https://img-blog.csdn.net/20151010105246454?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

步骤2.在搜索框输入tomcat，并选中，点击OK。

![img](https://img-blog.csdn.net/20151010105404238?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

步骤3：返回后选择settings。

![img](https://img-blog.csdn.net/20151010105506649?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

步骤4：如下图，此时点击加号便有了tomcat选项。

![img](https://img-blog.csdn.net/20151010105722342?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

步骤5：选择tomcat home为你的tomcat下载（安装即解压就行）路径如：E:\IDE\tomcat-8.0.26

![img](https://img-blog.csdn.net/20151010105903923?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

步骤6：点击OK，tomcat配置成功！

![img](https://img-blog.csdn.net/20151010105932822?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

**方法2：不再赘述，其实就是方法1从步骤4开始即可。**

**
**

***\*按以上方法，即可在idea中配置成功tomcat.亲测有效\**\**。\****

**
**

**
**

**2.接下来介绍用idea创建一个javaweb的demo的步骤：**

***\*方法来源于这位大佬的博客：http://blog.csdn.net/wangyang1354/article/details/50452806\****

# 概念需要明确一下

  IDEA中的项目（project）与eclipse中的项目（project）是不同的概念，IDEA的project 相当于之前eclipse的workspace,IDEA的Module是相当于eclipse的项目（project）.这个地方刚开始用的时候会很晕理不清之间的关系。

# 创建Web项目图文展示

## 1. 创建工作空间（project）

选择文件中new project 出现如下的界面：

![img](https://img-blog.csdn.net/20160103222422056?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

![img](https://img-blog.csdn.net/20160103222524011?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

\2. 创建工程

![img](https://img-blog.csdn.net/20160103222707715?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)





选择File中的New Module创建项目，选择图中标记的项点next继续下一步

![img](https://img-blog.csdn.net/20160103223209065?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

点击Finish之后会自动创建一个项目名为WebTest，目录结构如图所示：

![img](https://img-blog.csdn.net/20160103223430108?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

双击打开index.jsp文件，作适当的修改。

![img](https://img-blog.csdn.net/20160103223806719?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)



**接下来的任务就是将项目部署到Tomcat服务器**

**在界面的右侧上方有个下拉框，这个地方下拉会发现有一个Edit Configuration选项**

**![img](https://img-blog.csdn.net/20160103231714702?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)
**

**
**

**打开出现下面的界面**

**![img](https://img-blog.csdn.net/20160103231757525?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)
**



**在Default下面有一个TomcatServer进行Tomcat的基本配置**

**![img](https://img-blog.csdn.net/20160103231907511?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)
**



**然后回到这个弹出框的上面，部署项目**



![img](https://img-blog.csdn.net/20160103232003165?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)



![img](https://img-blog.csdn.net/20160103232120596?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

![img](https://img-blog.csdn.net/20160103232212415?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

**服务器部分配置完成**

![img](https://img-blog.csdn.net/20160103232257003?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

![img](https://img-blog.csdn.net/20160103232402762?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)





**这样就已经成功了。**



***\*到了这里再补充一个问题\****

***\*
\****

***\*这里我的是成功了的，但是在之前用的时候总是遇到一个问题，自动弹出这个访问页面之后一直都是404 Not Found ，我遇到这个问题是因为我多个项目同时部署到一个Tomcat上，导致8080端口被占用，控制台报了异常信息\****

## TOMCAT异常 Socket bind failed: [730048]

但是我只看到了最后的部署完成的信息，没看到上面的异常提示，所以一度卡在这里。



**
**

***\*这个问题怎么解决呢？\****

**![img](https://img-blog.csdn.net/20160103232452862?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)
**

**
**

**输入netstat -ano | findstr 8080;查看占用端口8080
**

**![img](https://img-blog.csdn.net/20160103232607578?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)
**

**
**

***\*输入taskkill /f /pid 占用进程；关闭占用进程\**
**

![img](https://img-blog.csdn.net/20160103232621825?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)***\*
\****

**然后重新运行就可以了。**

**
**

**补充一点：**

**多个项目可以通过如下的方式进行部署。**

**![img](https://img-blog.csdn.net/20160103232824712?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)
**

按以上大佬的做法，我成功创建一个javaweb的demo，但过程中还遇到其他一些问题。现进行进一步补充说明：
1.点击file创建new module时，同样需要和创建project一样需要勾选j2ee下的web Application选项。

2.在配置tomcat过程中，在浏览器部分记得选择常用的浏览器，虽然就算不选，使用默认的也没啥问题，但作为强迫症，还是觉得使用例如firefox浏览器这种前端常用的浏览器，页面的显示效果更好。在如下页面中的After launch部分。![img](https://blog.csdn.net/double_sweet1/article/details/79258635?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-1.not_use_machine_learn_pai&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-1.not_use_machine_learn_pai)![img](https://blog.csdn.net/double_sweet1/article/details/79258635?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-1.not_use_machine_learn_pai&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-1.not_use_machine_learn_pai)

![img](https://img-blog.csdn.net/20160103232120596?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

3.如上图部分，在before launch部分，并没有如大佬图片所示的第二行Build...，只有一行Build(可能就我遇到了这个问题），我的做法是：点击+号，选择Build Artifacts,然后在出现的warning的右边的fix里选择对应项目，这样即可(图片上传不了，只好文字说明，抱歉抱歉抱歉）。

其余按照大佬的方法来可以走的通。

写这篇博客的目的是为了记录我创建过程中遇到的一系列问题及解决方法。主要部分参考了上述两位博客大佬的博客，我只是进一步解释说明，没有任何商业用途。