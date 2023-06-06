# [IDEA自动部署WEB工程至远程服务器（学习笔记）](https://www.cnblogs.com/rmxd/p/11418812.html)



**目录**

- 一、部署Web工程的几种方式
  - [①本地打war，上传至远程服务器tomcat容器即可](https://www.cnblogs.com/rmxd/p/11418812.html#_label0_0)
  - [②IDEA自动部署至远程服务器](https://www.cnblogs.com/rmxd/p/11418812.html#_label0_1)
- 二、IDEA自动部署至远程服务器
  - [①搭建服务器的tomcat环境](https://www.cnblogs.com/rmxd/p/11418812.html#_label1_0)
  - [②本地IDEA关联远程服务器](https://www.cnblogs.com/rmxd/p/11418812.html#_label1_1)
  - [③tomcat配置文件：server.xml](https://www.cnblogs.com/rmxd/p/11418812.html#_label1_2)

 

------

[回到顶部](https://www.cnblogs.com/rmxd/p/11418812.html#_labelTop)

## 一、部署Web工程的几种方式



### ①本地打war，上传至远程服务器tomcat容器即可

　　优点：简单粗暴

　　缺点：浪费时间



### ②IDEA自动部署至远程服务器

　　优点：节省大量时间

　　缺点：配置稍多（第一次）

[回到顶部](https://www.cnblogs.com/rmxd/p/11418812.html#_labelTop)

## 二、IDEA自动部署至远程服务器



### ①搭建服务器的tomcat环境



### ②本地IDEA关联远程服务器

#### 　　打开IDEA，按如下图配置：

　　![img](https://img2018.cnblogs.com/blog/1733080/201908/1733080-20190827154341957-102207508.png)

#### 　　进入配置界面

　　![img](https://img2018.cnblogs.com/blog/1733080/201908/1733080-20190827154624002-420957465.png)

#### 　　继续配置

　　![img](https://img2018.cnblogs.com/blog/1733080/201908/1733080-20190827154838952-1500441985.png)

　　上传本地工程包：**这样，我们在本地修改某个java文件，直接提交该class即可，无需打war上传等繁琐的过程。**

　　![img](https://img2018.cnblogs.com/blog/1733080/201908/1733080-20190827155216301-728389791.png)



### ③tomcat配置文件：server.xml

 [Tomcat部署Web项目的3种方式](https://www.cnblogs.com/rmxd/p/11419193.html)