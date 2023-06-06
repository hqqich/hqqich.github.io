# intellij idea如何将web项目打成war包并部署到阿里云服务器

上一篇搭建了自己的第一个阿里云服务器，下面先用一个小型项目试一下服务器。
首先用idea创建一个简单的web项目
![在这里插入描述](https://img-blog.csdnimg.cn/20190217124322539.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3Bwb3J5eQ==,size_16,color_FFFFFF,t_70)
因为只是测试一下服务器，所以就写了一句话
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190217124452338.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3Bwb3J5eQ==,size_16,color_FFFFFF,t_70)
下面将该项目打包成war项目
打开Project Structure窗口，可以点击工具栏中间那个按钮，也可以直接快捷键Shift+Ctrl+Alt+S![在这里插入图片描述](https://img-blog.csdnimg.cn/20190217124610396.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3Bwb3J5eQ==,size_16,color_FFFFFF,t_70)
然后依次点击图中的选项
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190217124814658.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3Bwb3J5eQ==,size_16,color_FFFFFF,t_70)
点击下边的+号，选择Directory Content
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190217124905633.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3Bwb3J5eQ==,size_16,color_FFFFFF,t_70)
然后选择默认路径即可
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190217125045276.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3Bwb3J5eQ==,size_16,color_FFFFFF,t_70)
然后点击apply 和OK
然后退出来选择build，build artifacts
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190217125330666.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3Bwb3J5eQ==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190217125307154.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3Bwb3J5eQ==,size_16,color_FFFFFF,t_70)

生成之后，就可以在out目录下的artifacts下的war目录下看到自己的war文件了
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190217125426713.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3Bwb3J5eQ==,size_16,color_FFFFFF,t_70)

然后在将这个war包用XFtp放到tomcat的webapp目录下，
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190217125659810.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3Bwb3J5eQ==,size_16,color_FFFFFF,t_70)
然后在XShell中启动tomcat，
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190217125755954.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3Bwb3J5eQ==,size_16,color_FFFFFF,t_70)
在去看XFtp目录，
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190217125823573.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3Bwb3J5eQ==,size_16,color_FFFFFF,t_70)
可以看到我的webPro已经解压成功，这时候就可以去浏览器访问了
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190217125933572.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3Bwb3J5eQ==,size_16,color_FFFFFF,t_70)

是不是很简单呢。。。。