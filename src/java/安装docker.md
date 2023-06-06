## 安装docker

安装docker

```shell
apt-get install docker.io
```

启动docker

```shell
systemctl start docker
```

查看状态

```shell
systemctl status docker
```

关闭

```shell
systemctl stop docker
```

卸载docker

```shell
apt-get remove docker docker-engine
docker-ce docker.io
```



### 配置镜像加速

```shell
vim /etc/docker/daemon.json
```

添加文本

```json
{
        "registry-mirrors":[
                "https://reg-mirror.qiniu.com/",
                "https://nbban6us.mirror.aliyuncs.com"
        ]
}
```

加载配置，重启docker

```shell
systemctl daemon-reload
systemctl restart docker
```



## 安装MySQL

```shell
# 用 8.0.26 版本举例
docker pull mysql:8.0.26
# 运行 mysql
docker run -itd --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql:8.0.26
# 进入容器
docker exec -it mysql8.0.17 bash
# 登录 mysql
mysql -u root -p
```

mysql 远程主机可访问

```mysql
 mysql> GRANT ALL PRIVILEGES ON *.* TO 'root'@'%'WITH GRANT OPTION; //任何远程主机都可以访问数据库
```

