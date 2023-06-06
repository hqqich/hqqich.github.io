# Druid数据库连接池
1. maven添加druid以及mysql连接
```XML
  <dependency>
       <groupId>com.alibaba</groupId>
       <artifactId>druid-spring-boot-starter</artifactId>
       <version>1.1.9</version>
   </dependency>
   <dependency>
       <groupId>mysql</groupId>
       <artifactId>mysql-connector-java</artifactId>
   </dependency>
   <dependency>
       <groupId>org.mybatis.spring.boot</groupId>
       <artifactId>mybatis-spring-boot-starter</artifactId>
       <version>1.3.2</version>
   </dependency>
```


2. 配置项
```yml

logging.level.com.dobi.order.deal.dao=debug

#spring.profiles.include=druid
mybatis.mapper-locations=classpath:mapper/*.xml

spring.datasource.druid.url=jdbc:mysql://172.16.8.218:3306/dobi_ry?useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&serverTimezone=Asia/Shanghai&useSSL=false
spring.datasource.druid.username=dobi
spring.datasource.druid.password=dobi@123
spring.datasource.druid.driver-class-name=com.mysql.jdbc.Driver
#com.mysql.cj.jdbc.Driver

#\u8FDE\u63A5\u6C60\u914D\u7F6E
spring.datasource.druid.initial-size=5
spring.datasource.druid.max-active=100
spring.datasource.druid.min-idle=5
spring.datasource.druid.max-wait=60000
spring.datasource.druid.pool-prepared-statements=true
spring.datasource.druid.max-pool-prepared-statement-per-connection-size=20
spring.datasource.druid.validation-query=SELECT 1 FROM DUAL
spring.datasource.druid.validation-query-timeout=60000
spring.datasource.druid.test-on-borrow=false
spring.datasource.druid.test-on-return=false
spring.datasource.druid.test-while-idle=true
spring.datasource.druid.time-between-eviction-runs-millis=60000
spring.datasource.druid.min-evictable-idle-time-millis=100000

###\u76D1\u63A7\u914D\u7F6E begin###
# WebStatFilter\u914D\u7F6E\uFF0C\u8BF4\u660E\u8BF7\u53C2\u8003Druid Wiki\uFF0C\u914D\u7F6E_\u914D\u7F6EWebStatFilter
spring.datasource.druid.web-stat-filter.enabled=true
spring.datasource.druid.web-stat-filter.url-pattern=/*
spring.datasource.druid.web-stat-filter.exclusions=*.js,*.gif,*.jpg,*.png,*.css,*.ico,/druid/*
# StatViewServlet\u914D\u7F6E\uFF0C\u8BF4\u660E\u8BF7\u53C2\u8003Druid Wiki\uFF0C\u914D\u7F6E_StatViewServlet\u914D\u7F6E
spring.datasource.druid.stat-view-servlet.enabled= true
spring.datasource.druid.stat-view-servlet.url-pattern= /druid/*
spring.datasource.druid.stat-view-servlet.reset-enable= false
spring.datasource.druid.stat-view-servlet.login-username= admin
spring.datasource.druid.stat-view-servlet.login-password= admin
spring.datasource.druid.stat-view-servlet.allow= 127.0.0.1
###\u76D1\u63A7\u914D\u7F6E end###

# \u914D\u7F6EStatFilter
spring.datasource.druid.filter.stat.db-type=mysql
spring.datasource.druid.filter.stat.log-slow-sql=true
spring.datasource.druid.filter.stat.slow-sql-millis=5000

# \u914D\u7F6EWallFilter
spring.datasource.druid.filter.wall.enabled=true
spring.datasource.druid.filter.wall.db-type=mysql
spring.datasource.druid.filter.wall.config.delete-allow=false
spring.datasource.druid.filter.wall.config.drop-table-allow=false
```


3. 在启动类Application当中注解扫描dao层包

```java
@SpringBootApplication
@MapperScan(basePackages = "com.dobi.order.deal.dao")
@EnableTransactionManagement
```

4. 监控
http://localhost:5353/druid/login.html

`spring.datasource.druid.stat-view-servlet.allow= 127.0.0.1上配置的ip以及对应项目的端口`
查看数据库连接状况
