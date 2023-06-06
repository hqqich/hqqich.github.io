# java 使用idea将工程打成jar并创建成exe文件类型执行

![img](https://csdnimg.cn/release/blogv2/dist/pc/img/original.png)

[尘渭](https://blog.csdn.net/weixin_38310965) 2018-05-21 16:29:39 ![img](https://csdnimg.cn/release/blogv2/dist/pc/img/articleReadEyes.png) 23071 ![img](https://csdnimg.cn/release/blogv2/dist/pc/img/tobarCollect.png) 收藏 57

分类专栏： [exe](https://blog.csdn.net/weixin_38310965/category_7679760.html) [java](https://blog.csdn.net/weixin_38310965/category_7679761.html) 文章标签： [java](https://www.csdn.net/tags/NtTaIg5sMzYyLWJsb2cO0O0O.html) [exe](https://so.csdn.net/so/search/s.do?q=exe&t=blog&o=vip&s=&l=&f=&viparticle=)

版权

第一部分： 使用idea 打包工程jar

  1.准备好一份 开发好的 可执行的 含有main方法的 工程。

  例如：我随便写的main方法

```java
public static void main(String[] args) throws IOException {



        Properties properties = System.getProperties();



        String osName = properties.getProperty("os.name");



        System.out.println (osName);



        if (osName.indexOf("Linux") != -1) {



            Runtime.getRuntime().exec("step:htmlview");



        } else if (osName.indexOf("Windows") != -1){



            Runtime.getRuntime().exec("explorer http://www.baidu.com");



        } else {



            throw new RuntimeException("Unknown OS.");



        }



    }
```

  2.点击 idea：File->Project Struce...(快捷键 ctrl + shift +alt +s)。如图：

  ![img](https://img-blog.csdn.net/20180521153358926?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODMxMDk2NQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

3.添加jar。 配置完main class 后一路ok操作如虎。。。。如图：

![img](https://img-blog.csdn.net/20180521153528536?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODMxMDk2NQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

![img](https://img-blog.csdn.net/20180521153619911?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODMxMDk2NQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

4.点击：idea：Build->Build Artifact...->选择刚才创建的jar->build。如图：

![img](https://img-blog.csdn.net/2018052115392693?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODMxMDk2NQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

5.在工程目录out文件夹下就可以找到刚才打好的jar包啦。如图：

![img](https://img-blog.csdn.net/20180521154115992?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODMxMDk2NQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

至此，打jar包打完收工。

第二部分：将jar包转成exe文件运行。

1.自行下载exe4j工具。本小编身为臭D丝，买不起正版的，使用的破解版。各位观众老爷根据身价自行配置。。。安装完毕长这样![img](https://img-blog.csdn.net/20180521154435407?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODMxMDk2NQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)



2.打开它。

3.欢迎界面 直接next 。

![img](https://img-blog.csdn.net/20180521154554797?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODMxMDk2NQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

4.选择“JAR in EXE” mode 单选按钮；next。

![img](https://img-blog.csdn.net/20180521155024106?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODMxMDk2NQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

5.输入简短的描述和生成的exe文件地址。下图是小编的生成路径。next

![img](https://img-blog.csdn.net/20180521155254479?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODMxMDk2NQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

\6. 图片上1为exe的名称，2为ico后缀的图片，不要自行修改后缀名，这样不起作用，去网上下载个。3全选，4选择service options，里面有项配置操作位数的，各位老爷根据自己情况选择，其他的一路next。next

![img](https://img-blog.csdn.net/20180521155755342?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODMxMDk2NQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

![img](https://img-blog.csdn.net/20180521155910528?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODMxMDk2NQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

7.下图页面 直接next；

![img](https://img-blog.csdn.net/20180521155952870?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODMxMDk2NQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

8.配置VM 根据图上内容 照抄，聪明的看管老爷们都知道笨小编抄的哪里的。空白框里如果有内容的直接清空然后点击绿色+号，弹出框里面 选择第三个单选按钮，然后把第一部分里生成的jar放进去。ok

![img](https://img-blog.csdn.net/20180521160315411?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODMxMDk2NQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

9.操作8完成后，选择 main class 。next 如图：

![img](https://img-blog.csdn.net/20180521160407225?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODMxMDk2NQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

10.配置jre。next 如图

![img](https://img-blog.csdn.net/20180521160713583?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODMxMDk2NQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

11.在 search sequence 弹出的页面里 点击 绿色+ 号 ，配置jre运行环境。小编偷懒直接用的是jdk里带的。别骂我。。。next

![img](https://img-blog.csdn.net/20180521160934795?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODMxMDk2NQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

12.还是看图 ，没啥说的。next

![img](https://img-blog.csdn.net/20180521161040521?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODMxMDk2NQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

13.如图 不需操作直接 next

![img](https://img-blog.csdn.net/20180521162450972?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODMxMDk2NQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

14.如图不需操作，直接next，成功后，至此jar 转 exe 到此结束，在之前添加的目录即可找到。

![img](https://img-blog.csdn.net/20180521162522407?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODMxMDk2NQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

15.如图.方框内的按钮点击即可执行启动生成的exe文件。

![img](https://img-blog.csdn.net/20180521162602853?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODMxMDk2NQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

16.打完收工。下图是我的成果展示。

![img](https://img-blog.csdn.net/20180521162843476?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODMxMDk2NQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)