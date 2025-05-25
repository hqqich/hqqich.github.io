---
title: java中C3P0、Druid、HikariCP 、DBCP连接池的jar包下载与IDEA配置
index: false
icon: laptop-code
category:
    html
---



## 一、什么是连接池
连接池是应用程序与数据库之间的一个缓冲区，它存储了一定数量的空闲数据库连接，当应用程序需要连接数据库时，可以从连接池中获取一个可用连接，使用完毕后再将连接归还给连接池，从而避免了每次连接都需要创建和销毁连接的开销，提高了应用程序的性能和可伸缩性。连接池也可以控制数据库连接的数量和复用，从而减少了数据库的负担。

简单理解的话就是将连接放到自己家抽屉里，需要用的时候就去拿，不用了就放回去，减少了连接的时间，不用去远处去拿。
## 二、连接池的好处

连接池的好处可以总结为以下几点：
### 1. 提高性能
数据库连接是资源密集型操作，每次建立连接都需要进行TCP握手，验证用户身份等操作。连接池缓存了一定数量的已经建立的连接，可以更快速地获取和释放连接，减少了连接建立和关闭的时间，提高了应用程序的性能。
### 2. 稳定性
当并发量较高时，如果每个请求都建立一个新的数据库连接，可能会导致数据库服务器过载。使用连接池可以控制连接的数量，避免过多的连接导致数据库服务器崩溃。
### 3. 节省资源
使用连接池可以重复利用已有的数据库连接，避免了频繁创建和关闭连接的开销，从而节省了资源。
### 4. 提高可靠性
连接池可以监控数据库连接的状态，并在连接出现问题时自动重置连接。这对于保持应用程序的可靠性和稳定性非常重要。

有四种连接池c3p0、driuid、HikariCP、DBCP
## 三、导入jar包
**因为所有导入jar包步骤都是一致的，所以单拎出来写**

因为需要测试连接池连接数据库是否成功，我们这里使用的是MySql

MySql.jar包：[https://dev.mysql.com/downloads/connector/j/](https://dev.mysql.com/downloads/connector/j/)
### 下载MySqljar包
![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/97e8ce7ab76b446183d93a26d44ee538.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/b63fb95b25f848acb6f809510e0fb2f9.png)
### 导入jar包
将下载好的jar包复制到项目中，建议大家建一个文件专门用来放置jar包。
![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/344bf81226c14992aeafce67177df33c.png)
复制进去就是这样，接下来添加为库
### 添加为库
右击jar包添加为库
![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/f75e873734824b34a919e349a1ccbc8a.png)

根据需求选择级别之后直接确定
![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/3ce890f4b56f4e7a936fc93b3054c92e.png)
所有jar包都是这样导入。
## 四、c3p0连接池
### 下载jar包
C3P0jar包：
[https://sourceforge.net/projects/c3p0/](https://sourceforge.net/projects/c3p0/)
![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/e2afbb316dcd4aca9f96d819e78b44c4.png)
### 创建配置文件
创建c3p0-config.xml
```
<?xml version="1.0" encoding="UTF-8"?>
<c3p0-config>
<!--默认配置-->
<default-config>
<!--数据库驱动-->
<property name="driverClass">com.mysql.cj.jdbc.Driver</property>
<!--数据库的url-->
<property name="jdbcUrl">jdbc:mysql://localhost:3306/vehicleUpkeepDB</property>
<!--用户名写自己的-->
<property name="user">root</property>
<!--密码写自己的-->
<property name="password">sasa</property>
<!--初始连接数-->
<property name="initialPoolSize">10</property>
<!--最大连接数-->
<property name="maxPoolSize">100</property>
<!--最小连接数-->
<property name="minPoolSize">10</property>
</default-config>
</c3p0-config>
```
### 测试连接
```java
// 创建 ComboPooledDataSource 对象，该对象间接实现了 java 官方提供的 DataSource 接口
ComboPooledDataSource dataSource = new ComboPooledDataSource();
//获取连接，这里会有个异常可能连接不成功，你可以抛出或者处理
Connection connection = dataSource.getConnection();
//执行sql语句，这里会有个异常sql语句可能出错，你可以抛出或者处理
ResultSet resultSet = connection.prepareStatement("select count(0) from user ").executeQuery();
//处理结果
if(resultSet.next()){
System.out.println(resultSet.getInt(1));
}
//释放资源
resultSet.close();
connection.close();
```
结果
会有很多事务的东西，需要手动去关闭
![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/2d834c9615e04944bf110dbff2221938.png)
这样就是连接成功了！
## 五、driuid连接池
### 下载jar包
driuid.jar包:[https://repo1.maven.org/maven2/com/alibaba/druid/1.2.0/](https://repo1.maven.org/maven2/com/alibaba/druid/1.2.0/)
![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/a90c4989ac6549b7b6c92e887ae4460e.png)
导入项目，所有步骤都是一样的，不会就看上面c3p0
### 创建配置文件
创建driuid.properties
```
# 驱动名称(连接Mysql)
driverClassName = com.mysql.cj.jdbc.Driver
# 参数?rewriteBatchedStatements=True表示支持批处理机制
url = jdbc:mysql://localhost:3306/cinemaDB?useServerPrepStmts=true
# 用户名,注意这里是按"userName"来读取的
userName = root
# 用户密码(自己改)
password = sasa
# 初始化连接数量
initialSize = 10
# 最小连接数量
minIdle = 10
# 最大连接数量
maxActive = 50
# 超时时间5000ms (在等待队列中的最长等待时间,若超时,)
maxWait = 5000
```
### 测试连接
```java
//加载配置文件,会报错，可能找不到文件，可以选择抛出或者处理
Properties properties = new Properties();
properties.load(Files.newInputStream(Paths.get("src\\driuid.properties")));
//在工厂中创建一个数据源,数据源的连接信息来源于properties配置文件中
DataSource dataSource = DruidDataSourceFactory.createDataSource(properties);
//从连接池,获取连接对象
Connection connection = dataSource.getConnection();
//对sql语句进行预处理
PreparedStatement preparedStatement = connection.prepareStatement("select count(0) from user ");
//执行命令
ResultSet resultSet = preparedStatement.executeQuery();
//处理结果
if(resultSet.next()){
System.out.println(resultSet.getInt(1));
}
//释放资源
resultSet.close();
connection.close();
```
结果
![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/ffa75c5e2aa945ff9655731b0ffa6aa8.png)

这样就是连接成功了！
## 六、HikariCP连接池
HikariCP需要下载三个jar包

HiariCP.jar包：[https://repo1.maven.org/maven2/com/zaxxer/HikariCP/4.0.3/](https://repo1.maven.org/maven2/com/zaxxer/HikariCP/4.0.3/)
slf4j.jar包：[https://repo1.maven.org/maven2/org/slf4j/slf4j-api/1.7.25/](https://repo1.maven.org/maven2/org/slf4j/slf4j-api/1.7.25/)
log4j12.jar包：[https://repo1.maven.org/maven2/org/slf4j/slf4j-log4j12/1.7.25/](https://repo1.maven.org/maven2/org/slf4j/slf4j-log4j12/1.7.25/)
### 下载jar包
三个jar包都是找到**.jar**的后缀
![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/81f704e9557d4ed9a437477758178030.png)
### 创建配置文件
创建HikariCP.properties
```
# 驱动参数
jdbcUrl=jdbc:mysql://localhost:3306/vehicleUpkeepDB?characterEncoding=utf8&serverTimezone=GMT%2B8
#驱动名称(连接MySql)
DriverClassName = com.mysql.cj.jdbc.Driver
#账号
username=root
#密码
password=sasa
上面的都是必须要的，下面都有默认参数一般不用配置

#常用的参数
# 从池中借出的连接是否默认自动提交事务
# 默认 true
autoCommit=true

# 当我从池中借出连接时，愿意等待多长时间。如果超时，将抛出 SQLException
# 默认 30000 ms，最小值 250 ms。支持 JMX 动态修改
connectionTimeout=30000

# 一个连接在池里闲置多久时会被抛弃
# 当 minimumIdle < maximumPoolSize 才生效
# 默认值 600000 ms，最小值为 10000 ms，0表示禁用该功能。支持 JMX 动态修改
idleTimeout=600000

# 多久检查一次连接的活性
# 检查时会先把连接从池中拿出来（空闲的话），然后调用isValid()或执行connectionTestQuery来校验活性，如果通过校验，则放回池里。
# 默认 0 （不启用），最小值为 30000 ms，必须小于 maxLifetime。支持 JMX 动态修改
keepaliveTime=0

# 当一个连接存活了足够久，HikariCP 将会在它空闲时把它抛弃
# 默认 1800000 ms，最小值为 30000 ms，0 表示禁用该功能。支持 JMX 动态修改
maxLifetime=1800000

# 用来检查连接活性的 sql，要求是一个查询语句，常用select 'x'
# 如果驱动支持 JDBC4.0，建议不设置，这时默认会调用 Connection.isValid() 来检查，该方式会更高效一些
# 默认为空
# connectionTestQuery=

# 池中至少要有多少空闲连接。
# 当空闲连接 < minimumIdle，总连接 < maximumPoolSize 时，将新增连接
# 默认等于 maximumPoolSize。支持 JMX 动态修改
minimumIdle=5

# 池中最多容纳多少连接（包括空闲的和在用的）
# 默认为 10。支持 JMX 动态修改
maximumPoolSize=10

# 用于记录连接池各项指标的 MetricRegistry 实现类
# 默认为空，只能通过代码设置
# metricRegistry=

# 用于报告连接池健康状态的 HealthCheckRegistry 实现类
# 默认为空，只能通过代码设置
# healthCheckRegistry=

# 连接池名称。
# 默认自动生成
poolName=zzsCP

#少用的参数
# 如果启动连接池时不能成功初始化连接，是否快速失败 TODO
# >0 时，会尝试获取连接。如果获取时间超过指定时长，不会开启连接池，并抛出异常
# =0 时，会尝试获取并验证连接。如果获取成功但验证失败则不开启池，但是如果获取失败还是会开启池
# <0 时，不管是否获取或校验成功都会开启池。
# 默认为 1
initializationFailTimeout=1

# 是否在事务中隔离 HikariCP 自己的查询。
# autoCommit 为 false 时才生效
# 默认 false
isolateInternalQueries=false

# 是否允许通过 JMX 挂起和恢复连接池
# 默认为 false
allowPoolSuspension=false

# 当连接从池中取出时是否设置为只读
# 默认值 false
readOnly=false

# 是否开启 JMX
# 默认 false
registerMbeans=true

# 数据库 catalog
# 默认由驱动决定
# catalog=

# 在每个连接创建后、放入池前，需要执行的初始化语句
# 如果执行失败，该连接会被丢弃
# 默认为空
# connectionInitSql=

# JDBC 驱动使用的 Driver 实现类
# 一般根据 jdbcUrl 判断就行，报错说找不到驱动时才需要加
# 默认为空
# driverClassName=

# 连接的默认事务隔离级别
# 默认值为空，由驱动决定
# transactionIsolation=

# 校验连接活性允许的超时时间
# 默认 5000 ms，最小值为 250 ms，要求小于 connectionTimeout。支持 JMX 动态修改
validationTimeout=5000

# 连接对象可以被借出多久
# 默认 0（不开启），最小允许值为 2000 ms。支持 JMX 动态修改
leakDetectionThreshold=0

# 直接指定 DataSource 实例，而不是通过 dataSourceClassName 来反射构造
# 默认为空，只能通过代码设置
# dataSource=

# 数据库 schema
# 默认由驱动决定
# schema=

# 指定连接池获取线程的 ThreadFactory 实例
# 默认为空，只能通过代码设置
# threadFactory=

# 指定连接池开启定时任务的 ScheduledExecutorService 实例（建议设置setRemoveOnCancelPolicy(true)）
# 默认为空，只能通过代码设置
# scheduledExecutor=

# JNDI 配置的数据源名
# 默认为空
# dataSourceJndiName=null
```
### 测试连接
```java
//加载配置文件
HikariConfig hikariConfig = new HikariConfig("src\\HikariCP.properties");
//在工厂中创建一个数据源,数据源的连接信息来源于hikariConfig配置文件中
HikariDataSource ds = new HikariDataSource(hikariConfig);
//获取连接
Connection conn = ds.getConnection();
//执行sql语句
ResultSet rs = conn.prepareStatement("select count(*) from user").executeQuery();
//处理结果
while (rs.next()) {
System.out.println(rs.getInt(1));
}
//释放资源
conn.close();
rs.close();
```
结果
![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/39a0d90c9534448fb1af4a00be936d8c.png)
这样就是连接成功了！
## 七、DBCP连接池
DBCP需要下载两个jar包

DBCP.jar包：[https://commons.apache.org/proper/commons-dbcp/download_dbcp.cgi](https://commons.apache.org/proper/commons-dbcp/download_dbcp.cgi)

pool.jar包：[https://commons.apache.org/proper/commons-pool/download_pool.cgi](https://commons.apache.org/proper/commons-pool/download_pool.cgi)
### 下载jar包
两个都是这个位置
![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/9518484f4a3b47bc98610d3675f2a34a.png)
### 配置文件
创建DBCP.properties
```
#数据库连接地址
#url=jdbc:mysql://localhost:3306/数据库名（?配置参数）
url=jdbc:mysql://localhost:3306/vehicleUpkeepDB?useUnicode=true&characterEncoding=utf-8
#数据库驱动类的全名
#driverClassName=com.mysql.jdbc.Driver
#数据库帐号
username=root
#数据库密码 等于号后面直接填密码，不需要引号，密码为空时可以不填或 ""
password=sasa
#初始化连接池时,创建的连接数量
initialSize=5
#连接池的最大连接容量，连接使用完后不释放会很容易达到最大值，导致之后的连接被卡住
maxActive=20
#空闲时允许保留的最大连接数量
maxIdle=5
#空闲时允许保留的最小连接数量
minIdle=5
#排队等候的超时时间(毫秒)
maxWait=3000

```
### 测试连接
```java
//文件输入流
InputStream is = DBCP_Demo.class.getClassLoader().getResourceAsStream("DBCP.properties");
//将配置文件,转换为Properties对象
Properties ppt = new Properties();
ppt.load(is);
//通过连接池的工厂类(DruidDataSourceFactory)的创建连接池的方法(createDataSource())
DataSource ds = BasicDataSourceFactory.createDataSource(ppt);
//从连接池,获取连接对象
Connection con = ds.getConnection();
//对sql语句进行预处理
PreparedStatement ps = con.prepareStatement("select count(*) from user");
//执行命令
ResultSet re = ps.executeQuery();
//处理结果
if(re.next()){
int anInt = re.getInt(1);
System.out.println(anInt);
}
//释放资源
re.close();
ps.close();
con.close();
```
结果：
![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/aacec267ec76445ea64277a0ac926725.png)
### 可能遇到的问题
NoClassDefFoundError 错误

```
Exception in thread "main" java.lang.NoClassDefFoundError: Could not initialize class lesson04.utils.JDBCUtils_DBCP
```

原因：DBCP2之后的版本需要 logging 包
官网下载：[https://commons.apache.org/proper/commons-logging/download_logging.cgi](https://commons.apache.org/proper/commons-logging/download_logging.cgi)
按照上面的步骤导入 IDEA 中即可
