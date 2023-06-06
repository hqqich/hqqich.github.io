# 环境

- CentOS 7.5
- Docker 1.13.1
- MySQL 8.0.16

# 安装

## 拉取镜像

默认拉取最新版本的镜像



```
$ docker pull mysql
```

如果要指定版本，使用下面的命令



```
$ docker pull mysql:8.0.16
```

## 创建数据目录和配置文件

在宿主机创建放置mysql的配置文件的目录和数据目录，并且进行授权



```
$ mkdir -p /usr/mysql/conf /usr/mysql/data

$ chmod -R 755 /usr/mysql/
```

## 创建配置文件

在上面创建的配置文件目录/usr/mysql/conf下创建MySQL的配置文件my.cnf



```
$ vim /usr/mysql/conf/my.cnf
```

添加以下内容到上述创建的配置文件中



```
[client]

#socket = /usr/mysql/mysqld.sock

default-character-set = utf8mb4

[mysqld]

#pid-file        = /var/run/mysqld/mysqld.pid

#socket          = /var/run/mysqld/mysqld.sock

#datadir         = /var/lib/mysql

#socket = /usr/mysql/mysqld.sock

#pid-file = /usr/mysql/mysqld.pid

datadir = /usr/mysql/data

character_set_server = utf8mb4

collation_server = utf8mb4_bin

secure-file-priv= NULL

# Disabling symbolic-links is recommended to prevent assorted security risks

symbolic-links=0

# Custom config should go here

!includedir /etc/mysql/conf.d/
```

## 启动创建容器



```
$ docker run --restart=unless-stopped -d --name mysql -v /usr/mysql/conf/my.cnf:/etc/mysql/my.cnf -v 
/usr/mysql/data:/var/lib/mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql
```

> 参数解释：
> -v : 挂载宿主机目录和 docker容器中的目录，前面是宿主机目录，后面是容器内部目录
>
> -d : 后台运行容器
>
> -p 映射容器端口号和宿主机端口号
>
> -e 环境参数，MYSQL_ROOT_PASSWORD设置root用户的密码

执行上述命令后，执行查询容器的命令就可以看到创建的mysql容器



```
$ docker ps -a
```

结果如下所示：

[![img](https://img2020.cnblogs.com/blog/2159277/202009/2159277-20200919224834994-1347028431.png)](https://img2020.cnblogs.com/blog/2159277/202009/2159277-20200919224834994-1347028431.png)

## 问题

上述虽然安装好了mysql，但是使用远程的Navicat连接时提示错误，不能正确连接mysql，此时需要修改按照下面说的步骤修改一下mysql的密码模式以及主机等内容才可以。

## 修改mysql密码以及可访问主机

- 进入容器内部



```
$ docker exec -it mysql /bin/bash
```

- 连接mysql



```
$ mysql -uroot -p
```

- 使用mysql库



```
$ mysql> use mysql
```

- 修改访问主机以及密码等，设置为所有主机可访问



```
$ mysql> ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '新密码';
```

> 注意：
>
> mysql_native_password，mysql8.x版本必须使用这种模式，否则navicate无法正确连接

- 刷新



```
$ mysql> flush privileges
```

经过以上步骤，再次远程使用Navicat连接数据库时就可以正常连接了。