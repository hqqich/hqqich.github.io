# SpringBoot配置https并实现http访问自动跳转https（自定义证书）

## 一、准备

elasticsearch-7.3.2（下载解压即可用）

SpringBoot2.1.2

## 二、生成证书

使用elasticsearch-certutil生成springboot.p12证书

elasticsearch-certutil官方文档

### 1.创建ca认真中心

cmd进入bin目录：

```shell
c:\elasticsearch-7.14.0\bin>elasticsearch-certutil ca
```

会提示输入文件路径和密码

![image-20210824231613708](https://i.loli.net/2021/08/24/bwC6YN5nOpeLvGh.png)

![img](https://img-blog.csdnimg.cn/20200709101601407.png)

 

ouput file ：C:\test\ca.p12

密码：ca

文件在第2步中使用

### 2.使用ca创建证书

```shell
c:\elasticsearch-7.14.0\bin>elasticsearch-certutil cert --ca  CUsersadminDesktopcaca.p12 --name springboot
```



记住刚才输入的密码，并输入导出路径

![image-20210824232000846](https://i.loli.net/2021/08/24/UGE7laRxShAyKV3.png)

![img](https://img-blog.csdnimg.cn/20200709101219816.png)

得到文件

![image-20210824232209506](https://i.loli.net/2021/08/24/rYRNU8eLgjhuE5y.png)



## 三、SpringBoot配置

将springboot.p12拷贝到resources目录

application.properties

```properties
#端口号
#https端口
server.port=8080
#http端口
server.httpPort=8081
#日志配置
logging.config=classpathlogback-spring.xml
#服务器名称
serverName=test_server
#配置ssl
server.ssl.enabled=true
server.ssl.key-store=classpathspringboot.p12
server.ssl.key-store-password=123456
server.ssl.key-store-type=PKCS12
#证书别名
server.ssl.key-alias=springboot
```

http重定向到https，配置类

```java
package com.asyf.demo.config;

import org.apache.catalina.Context;
import org.apache.catalina.connector.Connector;
import org.apache.tomcat.util.descriptor.web.SecurityCollection;
import org.apache.tomcat.util.descriptor.web.SecurityConstraint;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SSLConfig {

@Value(${server.httpPort})
int httpPort;
@Value(${server.port})
int httpsPort;

@Bean(name = connector)
public Connector connector() {
    Connector connector = new Connector(org.apache.coyote.http11.Http11NioProtocol);
    connector.setScheme(http);
    connector.setPort(httpPort);
    connector.setSecure(false);
    connector.setRedirectPort(httpsPort);
    return connector;
}

@Bean
public TomcatServletWebServerFactory tomcatServletWebServerFactory(Connector connector) {
    TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory() {
        @Override
        protected void postProcessContext(Context context) {
            SecurityConstraint securityConstraint = new SecurityConstraint();
            securityConstraint.setUserConstraint(CONFIDENTIAL);
            SecurityCollection collection = new SecurityCollection();
            collection.addPattern();
            securityConstraint.addCollection(collection);
            context.addConstraint(securityConstraint);
        }
    };
    tomcat.addAdditionalTomcatConnectors(connector);
    return tomcat;
	}
}
```



##  四、启动测试

1.重定向测试：访问http127.0.0.18081testnum=1hi跳转到https127.0.0.18080testnum=1

2.https测试：直接访问https127.0.0.18080testnum=1



## 五、POST请求报错解决

1.http重定向到https，POST请求变为GET请求



2.解决办法：更改SSLConfig

```java
 @Bean
    public TomcatServletWebServerFactory tomcatServletWebServerFactory(Connector connector) {
        TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory() {
            @Override
            protected void postProcessContext(Context context) {
                SecurityConstraint securityConstraint = new SecurityConstraint();
                securityConstraint.setUserConstraint(CONFIDENTIAL);
                SecurityCollection collection = new SecurityCollection();
                collection.addMethod(DEFAULT_PROTOCOL); //http重定向到https，POST请求变为GET请求，增加这个之后get请求不会跳转到https
                collection.addPattern();
                securityConstraint.addCollection(collection);
                context.addConstraint(securityConstraint);
            }
        };
        tomcat.addAdditionalTomcatConnectors(connector);
        return tomcat;
    }
```

注意：增加这个之后get请求不会跳转到https

3.有没有完美的办法？
————————————
<a>httpsblog.csdn.netcs373616511articledetails105413188</a>





