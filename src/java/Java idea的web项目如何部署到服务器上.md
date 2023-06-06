# Java idea的web项目如何部署到服务器上

以往都是大佬部署了直接填代码，或者代码写完了再部署；今天有个需求更换，尝试自己部署。
打开web 项目，选中你要部署的模块；

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190724085506731.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1pvZV9ZdVp1,size_16,color_FFFFFF,t_70)
屏幕右侧Maven——所选模块——LIfecycle——Package工具

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190724085801604.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1pvZV9ZdVp1,size_16,color_FFFFFF,t_70)
右击 运行；

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190724085952371.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1pvZV9ZdVp1,size_16,color_FFFFFF,t_70)
运行成功；

![在这里插入图片描述](https://img-blog.csdnimg.cn/2019072409004096.png)
可以看到生成的jar包；
复制第一个文件到服务器所在位置；

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190724090347137.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1pvZV9ZdVp1,size_16,color_FFFFFF,t_70)
进入 cmd 进入服务器所在位置 ，输入 java -jar XXX.jar
成功后，重新启动服务器。