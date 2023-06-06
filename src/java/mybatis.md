# **mybatis**

![img](https://upload-images.jianshu.io/upload_images/7896890-f534c3282f1f6192.png?imageMogr2/auto-orient/strip|imageView2/2/w/1119/format/webp)

# 一、springboot 集成 mybatis

> mybatis 使用

pom.xml 文件中引入依赖
```xml
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!--    mybatis    -->
                <dependency>
                    <groupId>org.mybatis.spring.boot</groupId>
                    <artifactId>mybatis-spring-boot-starter</artifactId>
                    <version>2.1.0</version>
                </dependency>

                <dependency>
                    <groupId>com.alibaba</groupId>
                    <artifactId>druid</artifactId>
                    <version>1.2.4</version>
                </dependency>

```

yml文件中配置数据库信息
```yml
server:
  port: 8080

# 数据库数据源
spring:
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource
    username: root
    password: password1314
    url: jdbc:mysql://127.0.0.1:3306/runoob?serverTimezone=UTC&characterEncoding=utf8&useUnicode=true&useSSL=true
    driver-class-name: com.mysql.cj.jdbc.Driver

mybatis:
  type-aliases-package: com.example.demo.pojo   #   别名
  mapper-locations: classpath:/mapper/*.xml   #   xml文件

logging:
  file:
    name: log/log.log
  level:
    root: info
    wuhobin: debug
```




编写 mapper
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
<mapper namespace="com.example.demo.mapper.UserMapper">

<!-- id 是接口中的方法名   resultType 是返回类型， list<> 集合使用的也是类 -->
    <select id="find" resultType="com.example.demo.pojo.User">
        select * from user;
    </select>

</mapper>
```

创建mapper 接口
```java
import com.example.demo.pojo.User;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by Administrator on 26/05/2021 is 4:17 PM.
 *
 * @Description
 * @Author hqqich <hqqich1314@outlook.com>
 * @Version V1.0.0
 * @Since 1.0
 * @Date 26/05/2021
 */
@Repository  //
@Mapper  //让spring容器扫描它是 mybatis 的mapper
public interface UserMapper {

    List<User> find();

}
```





# 二、插入一小段知识

### 1. mybatis开启驼峰命名映射
>
> mybatis自定义的SQL语句中，如select语句，如果数据库表的字段为驼峰命名，即如img_address这样的形式，那么select语句执行的结果会变成null。
>
> 解决办法是在配置文件中加上开启驼峰映射的配置信息。根据配置文件的类型分为以下两种：
>
> 1.在.properties文件中添加：
>
> ```properties
> mybatis.configuration.map-underscore-to-camel-case=true 
> ```
>
> 但如果已经在.properties中配置了mybatis.config-location=classpath:mybatis/mybatis-config.xml这样的语句，就应该使用下一种方式，即把配置信息写在.xml中。
>
> 2.在mybatis的配置文件，如mybatis-config.xml中进行配置：
>
> ```xml
> <configuration>
>  <!-- 开启驼峰映射 ，为自定义的SQL语句服务-->
>  <!--设置启用数据库字段下划线映射到java对象的驼峰式命名属性，默认为false-->  
>  <settings>
>    <setting name="mapUnderscoreToCamelCase" value="true"/>
>  </settings>
> </configuration>
> ```
>
### 2. mybatis中#和$符号的区别
>
> mybatis做为一个轻量级ORM框架在许多项目中使用，因其简单的入门受到了广大开发者的热爱。在近期项目中再做一个相关的开发，碰到了#、$符号这样的问题，之前没怎么注意过，通过学习之后，有了点感悟，分享如下，
>
> **#{}** 
>
> 使用#{}意味着使用的预编译的语句，即在使用jdbc时的preparedStatement，sql语句中如果存在参数则会使用?作占位符，我们知道这种方式可以防止sql注入，并且在使用#{}时形成的sql语句，已经带有引号，例，select * from table1 where id=#{id} 在调用这个语句时我们可以通过后台看到打印出的sql为：select * from table1 where id='2' 加入传的值为2.也就是说在组成sql语句的时候把参数默认为字符串。
>
> **${}**
>
> 使用${}时的sql不会当做字符串处理，是什么就是什么，如上边的语句：select * from table1 where id=${id} 在调用这个语句时控制台打印的为：select * from table1 where id=2 ，假设传的参数值为2
>
> 从上边的介绍可以看出这两种方式的区别，我们最好是能用#{}则用它，因为它可以防止sql注入，且是预编译的，在需要原样输出时才使用${}，如，
>
> select * from ${tableName} order by ${id} 这里需要传入表名和按照哪个列进行排序 ，加入传入table1、id 则语句为：select * from table1 order by id
>
> 如果是使用#{} 则变成了select * from 'table1' order by 'id' 我们知道这样就不对了。
>
>  
>
> 另，在使用以下的配置时，必须使用#{}
>
> ```
> <select id="selectMessageByIdI" parameterType="int" resultType="Message">
>          
>          select * from message where id=#{id};
>      </select>
> ```
>
> 在parameterType是int时，sql语句中必须是#{}。
>
### 3. @SelectProvider 注解

> ```java
> //源码会发现 有几个眼生的注解
> public MapperAnnotationBuilder(Configuration configuration, Class<?> type) {
>     ...
>     sqlAnnotationTypes.add(Select.class);
>     sqlAnnotationTypes.add(Insert.class);
>     sqlAnnotationTypes.add(Update.class);
>     sqlAnnotationTypes.add(Delete.class);
>     // 这四个注解眼生的很
>     sqlProviderAnnotationTypes.add(SelectProvider.class);
>     sqlProviderAnnotationTypes.add(InsertProvider.class);
>     sqlProviderAnnotationTypes.add(UpdateProvider.class);
>     sqlProviderAnnotationTypes.add(DeleteProvider.class);
> }
> ```
>
> 这里介绍下 mybatis 具体编写 SQL 的三种形式, 以及介绍不同的方式对应的使用场景
>
> ### **1 @Select**
>
> 这种方式能够定义简单的 sql, 不涉及复杂查询和多参数的场景, 类似下述方式
>
> @Select 定义 sql 的方式是最简单的, 省去了定义 xml文件的繁琐, 也少了定义编写 @SelectProvider 对应类和方法的步骤
>
> ```sql
> SELECT * FROM subject WHERE id = #{id}
> ```
>
> ### **2 @SelectProvider**
>
> ```java
> @Documented
> @Retention(RetentionPolicy.RUNTIME)
> @Target(ElementType.METHOD)
> public @interface InsertProvider {
>     // 用于指定获取 sql 语句的指定类
>     Class<?> type();
>     // 指定类中要执行获取 sql 语句的方法
>     String method();
> }
> ```
>
> 这种方式编写sql适合编写中等长度, 简单的查询搭配 join、group、order...
>
> SQL 工具类提供了这种简单的 API 语法, 还是比较方便的
>
> 如果不想使用 SQL 工具类, 自己编写 sql 字符串也是可以的
>
> ```java
> @SelectProvider(type = SubjectSqlProvider.class, method = "getSubjectTestProvider")
> PrimitiveSubject getSubjectTestProvider(@Param("id") int id);
> ```
>
> ![img](https://pic3.zhimg.com/80/v2-74b0fc668e4f3bad7be67e2c9b1ee432_720w.jpg)
>
> ### **3 .xml 文件**
>
> 这种方式就不多说了, 功能全部具备, 比如计算函数、动态SQL、各种关键字都支持
>
> 这几种方式都能够实现我们的 sql 编写需求, 只不过针对不同的场景, 合理的使用即可
### 4. 扫描mapper类的方式

> 1. 在mapper类上面添加注解`@Mapper`
>
>    ```java
>    @Mapper
>    public interface EmployeeMapper {
>    
>      @Select("SELECT * FROM employees")
>      @Results({
>          @Result(property = "firstName",  column = "first_name"),
>          @Result(property = "lastName", column = "last_name"),
>          @Result(property = "emailId", column = "email_id")
>      })
>      List<Employee> getAll();
>
>
>    }
>    ```
> 
> 
> 
> 2. 在springboot 主启动类上 添加mapper扫描注解，指向包名`@MapperScan("com.example.miaosha.mapper")`
> 
>    ```java
>    @MapperScan("com.example.miaosha.mapper")
>    public class MiaoshaApplication {
> 
>      public static void main(String[] args) {
>        SpringApplication.run(MiaoshaApplication.class, args);
>      }
> 
>    }
>    ```
>
> 
>
> 3. 在配置类中添加方法，
>
>    ```java
>    import com.baomidou.mybatisplus.core.MybatisConfiguration;
>    import org.mybatis.spring.mapper.MapperScannerConfigurer;
>    import org.springframework.boot.autoconfigure.AutoConfigureAfter;
>    import org.springframework.context.annotation.Bean;
>    import org.springframework.context.annotation.Configuration;
>
>
>    @Configuration
>    //TODO 注意，由于MapperScannerConfigurer执行的比较早，所以必须有下面的注解
>    @AutoConfigureAfter({MybatisConfiguration.class})
>    public class MyBatisMapperScannerConfig {
>
>      @Bean
>      public MapperScannerConfigurer mapperScannerConfigurer() {
>        MapperScannerConfigurer mapperScannerConfigurer = new MapperScannerConfigurer();
>        mapperScannerConfigurer.setSqlSessionFactoryBeanName("sqlSessionFactory");
>        mapperScannerConfigurer.setBasePackage("com.zsx.dao");
>        return mapperScannerConfigurer;
>      }
>    }
>
>    ```

## 5. 加载mybatis的配置

> #### 1. 手写配置，写死在代码里面
>
> ```java
> import java.io.IOException;
> import java.util.Properties;
> import javax.sql.DataSource;
> import org.apache.commons.logging.Log;
> import org.apache.commons.logging.LogFactory;
> import org.apache.ibatis.plugin.Interceptor;
> import org.apache.ibatis.session.SqlSessionFactory;
> import org.mybatis.spring.SqlSessionFactoryBean;
> import org.springframework.beans.factory.annotation.Autowired;
> import org.springframework.context.annotation.Bean;
> import org.springframework.context.annotation.Configuration;
> import org.springframework.core.io.DefaultResourceLoader;
> import org.springframework.core.io.Resource;
> import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
> import org.springframework.jdbc.datasource.DataSourceTransactionManager;
> import org.springframework.transaction.PlatformTransactionManager;
> import org.springframework.transaction.annotation.EnableTransactionManagement;
> import org.springframework.transaction.annotation.TransactionManagementConfigurer;
> import com.github.pagehelper.PageHelper;
> 
> @Configuration
> @EnableTransactionManagement
> public class MybatisConfiguration implements TransactionManagementConfigurer {
> 
>   private static Log logger = LogFactory.getLog(MybatisConfiguration.class);
> 
>   @Autowired 
>   private DataSource dataSource;
> 
>   // 提供SqlSeesion
>   @Bean(name = "sqlSessionFactory")
>   public SqlSessionFactory sqlSessionFactoryBean() {
>     try {
>       SqlSessionFactoryBean sessionFactoryBean = new SqlSessionFactoryBean();
>       sessionFactoryBean.setDataSource(dataSource);
>       // 手写配置
>       // 配置类型别名
>       sessionFactoryBean.setTypeAliasesPackage("com.zsx.entity");
>       // 配置mapper的扫描，找到所有的mapper.xml映射文件
>       Resource[] resources =
>           new PathMatchingResourcePatternResolver().getResources("classpath:mybatis/mapper/*.xml");
>       sessionFactoryBean.setMapperLocations(resources);
>       // 加载全局的配置文件
>       sessionFactoryBean.setConfigLocation(
>           new DefaultResourceLoader().getResource("classpath:mybatis/mybatis-config.xml"));
>       // 添加插件
>       sessionFactoryBean.setPlugins(new Interceptor[] {pageHelper()});
>       return sessionFactoryBean.getObject();
>     } catch (IOException e) {
>       logger.warn("mybatis resolver mapper*xml is error");
>       return null;
>     } catch (Exception e) {
>       logger.warn("mybatis sqlSessionFactoryBean create error");
>       return null;
>     }
>   }
> 
>   @Bean
>   public PlatformTransactionManager annotationDrivenTransactionManager() {
>     return new DataSourceTransactionManager(dataSource);
>   }
> 
>   @Bean
>   public PageHelper pageHelper() {
>     logger.info("MyBatis分页插件PageHelper");
>     // 分页插件
>     PageHelper pageHelper = new PageHelper();
>     Properties properties = new Properties();
>     properties.setProperty("offsetAsPageNum", "true");
>     properties.setProperty("rowBoundsWithCount", "true");
>     properties.setProperty("reasonable", "true");
>     properties.setProperty("supportMethodsArguments", "true");
>     properties.setProperty("returnPageInfo", "check");
>     properties.setProperty("params", "count=countSql");
>     pageHelper.setProperties(properties)
>     return pageHelper;
>   }
> }
> ```
>
> #### 2. 读取配置文件方式
>
> ##### 先在配置文件`application.yml中添加`
>
> ```yaml
> # MyBatis
> mybatis:
>     # 配置类型别名
>     typeAliasesPackage: com.zsx.entity
>     # 配置mapper的扫描，找到所有的mapper.xml映射文件
>     mapperLocations: classpath:mybatis/mapper/*.xml
>     # 加载全局的配置文件
>     configLocation: classpath:mybatis/mybatis-config.xml
> ```
>
> ##### 然后配置文件为：
>
> ```java
> 
> import java.io.IOException;
> import javax.sql.DataSource;
> import org.apache.commons.logging.Log;
> import org.apache.commons.logging.LogFactory;
> import org.apache.ibatis.session.SqlSessionFactory;
> import org.mybatis.spring.SqlSessionFactoryBean;
> import org.springframework.beans.factory.annotation.Autowired;
> import org.springframework.beans.factory.annotation.Value;
> import org.springframework.context.annotation.Bean;
> import org.springframework.context.annotation.Configuration;
> import org.springframework.core.io.DefaultResourceLoader;
> import org.springframework.core.io.Resource;
> import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
> import org.springframework.jdbc.datasource.DataSourceTransactionManager;
> import org.springframework.transaction.PlatformTransactionManager;
> import org.springframework.transaction.annotation.EnableTransactionManagement;
> import org.springframework.transaction.annotation.TransactionManagementConfigurer;
> 
> @Configuration
> @EnableTransactionManagement
> public class MybatisConfiguration implements TransactionManagementConfigurer {
> 
>   private static Log logger = LogFactory.getLog(MybatisConfiguration.class);
> 
>   //  配置类型别名
>   @Value("${mybatis.typeAliasesPackage}")
>   private String typeAliasesPackage;
> 
>   //  配置mapper的扫描，找到所有的mapper.xml映射文件
>   @Value("${mybatis.mapperLocations}")
>   private String mapperLocations;
> 
>   //  加载全局的配置文件
>   @Value("${mybatis.configLocation}")
>   private String configLocation;
> 
>   @Autowired 
>   private DataSource dataSource;
> 
>   // DataSource配置
>   //  @Bean
>   //  @ConfigurationProperties(prefix = "spring.datasource")
>   //  public DruidDataSource dataSource() {
>   //      return new com.alibaba.druid.pool.DruidDataSource();
>   //  }
>   // 提供SqlSeesion
>   @Bean(name = "sqlSessionFactory")
>   public SqlSessionFactory sqlSessionFactoryBean() {
>     try {
>       SqlSessionFactoryBean sessionFactoryBean = new SqlSessionFactoryBean();
>       sessionFactoryBean.setDataSource(dataSource);
>       // 读取配置
>       sessionFactoryBean.setTypeAliasesPackage(typeAliasesPackage);
>       Resource[] resources = new PathMatchingResourcePatternResolver().getResources(mapperLocations);
>       sessionFactoryBean.setMapperLocations(resources);
>       sessionFactoryBean.setConfigLocation(new DefaultResourceLoader().getResource(configLocation));
>       // 添加插件  （改为使用配置文件加载了）
>       //          sqlSessionFactoryBean.setPlugins(new Interceptor[]{pageHelper()});
>       return sessionFactoryBean.getObject();
>     } catch (IOException e) {
>       logger.warn("mybatis resolver mapper*xml is error");
>       return null;
>     } catch (Exception e) {
>       logger.warn("mybatis sqlSessionFactoryBean create error");
>       return null;
>     }
>   }
> 
>   //  @Bean
>   //    public SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
>   //        return new SqlSessionTemplate(sqlSessionFactory);
>   //    }
>   //  @Bean
>   //  public PlatformTransactionManager transactionManager(){
>   //      return new DataSourceTransactionManager(dataSource);
>   //  }
> 
>   @Bean
>   public PlatformTransactionManager annotationDrivenTransactionManager() {
>     return new DataSourceTransactionManager(dataSource);
>   }
> }
> ```
>
> 

## 6. `mybatis-config.xml`实例

> ```xml
> <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE configuration
> PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
> "https://mybatis.org/dtd/mybatis-3-config.dtd">
> <configuration>
>     <properties>
>         <property name="dialect" value="mysql" />
>     </properties>
>     <settings>
>         <!-- 开启驼峰匹配 -->
>         <setting name="mapUnderscoreToCamelCase" value="true"/>
>         <!-- 这个配置使全局的映射器启用或禁用缓存。系统默认值是true，设置只是为了展示出来 -->
>         <setting name="cacheEnabled" value="true" />
>         <!-- 全局启用或禁用延迟加载。当禁用时，所有关联对象都会即时加载。 系统默认值是true，设置只是为了展示出来 -->
>         <setting name="lazyLoadingEnabled" value="true" />
>         <!-- 允许或不允许多种结果集从一个单独的语句中返回（需要适合的驱动）。 系统默认值是true，设置只是为了展示出来 -->
>         <setting name="multipleResultSetsEnabled" value="true" />
>         <!--使用列标签代替列名。不同的驱动在这方便表现不同。参考驱动文档或充分测试两种方法来决定所使用的驱动。 系统默认值是true，设置只是为了展示出来 -->
>         <setting name="useColumnLabel" value="true" />
>         <!--允许 JDBC 支持生成的键。需要适合的驱动。如果设置为 true 则这个设置强制生成的键被使用，尽管一些驱动拒绝兼容但仍然有效（比如
> 
>             Derby）。 系统默认值是false，设置只是为了展示出来 -->
>         <setting name="useGeneratedKeys" value="false" />
>         <!--配置默认的执行器。SIMPLE 执行器没有什么特别之处。REUSE 执行器重用预处理语句。BATCH 执行器重用语句和批量更新 系统默认值是SIMPLE，设置只是为了展示出来 -->
>         <setting name="defaultExecutorType" value="SIMPLE" />
>         <!--设置超时时间，它决定驱动等待一个数据库响应的时间。 系统默认值是null，设置只是为了展示出来 -->
>         <setting name="defaultStatementTimeout" value="25000" />
>     </settings>    <!-- 分页助手 -->
>     <plugins>
>         <plugin interceptor="com.github.pagehelper.PageHelper">            <!-- 数据库方言 -->
>             <property name="dialect" value="mysql" />
>             <property name="offsetAsPageNum" value="true" />
>             <!-- 设置为true时，使用RowBounds分页会进行count查询 会去查询出总数 -->
>             <property name="rowBoundsWithCount" value="true" />
>             <property name="pageSizeZero" value="true" />
>             <property name="reasonable" value="true" />
>         </plugin>
>     </plugins>
> </configuration>
> ```
>
> 

# 三、spring 集成 mybatis

## MyBatis—Spring 项目

目前大部分的 Java 互联网项目，都是用 Spring MVC + Spring + MyBatis 搭建平台的。

使用 [Spring IoC](https://www.jianshu.com/p/20cea9170110) 可以有效的管理各类的 Java 资源，达到即插即拔的功能；通过 [Spring AOP](https://www.jianshu.com/p/994027425b44) 框架，数据库事务可以委托给 Spring 管理，消除很大一部分的事务代码，配合 MyBatis 的高灵活、可配置、可优化 SQL 等特性，完全可以构建高性能的大型网站。

毫无疑问，MyBatis 和 Spring 两大框架已经成了 Java 互联网技术主流框架组合，它们经受住了大数据量和大批量请求的考验，在互联网系统中得到了广泛的应用。使用 MyBatis-Spring 使得业务层和模型层得到了更好的分离，与此同时，在 Spring 环境中使用 MyBatis 也更加简单，节省了不少代码，甚至可以不用 SqlSessionFactory、 SqlSession 等对象，因为 MyBatis-Spring 为我们封装了它们。

> 摘自：《Java EE 互联网轻量级框架整合开发》

#### 第一步：创建测试工程

第一步，首先在 IDEA 中新建一个名为【MybatisAndSpring】的 WebProject 工程：

![img](https:////upload-images.jianshu.io/upload_images/7896890-7c8242b9afa48492.png?imageMogr2/auto-orient/strip|imageView2/2/w/941/format/webp)

然后在【src】中创建 4 个空包：

- cn.wmyskxz.dao（放置 DAO 数据交互层处理类）
- cn.wmyskxz.mapper（放置 Mapper 代理接口）
- cn.wmyskxz.pojo（放置 Java 实体类）
- cn.wmyskxz.test（放置测试类）

接着新建源文件夹【config】，用于放置各种资源配置文件：

- 在【config / mybatis】下创建一个空的名为 “SqlMapConfig.xml” 的 MyBatis 全局配置文件
- 在【config / spring】下创建一个空的名为 “applicationContext.xml” 的 Spring 资源配置文件
- 在【config / sqlmap】下创建一个空的名为 “UserMapper.xml” 的 Mapper 映射文件。
- 在【config】下创建两个 properties 属性文件，分别为 “db.properties” 和 “log4j.properties”，用于数据库连接和日志系统参数设置。

再在【web】文件夹下新建一个【WEB-INF】默认安全文件夹，并在其下创建一个【classes】和【lib】，并将项目的输出位置，改在【classes】下：

![img](https:////upload-images.jianshu.io/upload_images/7896890-f33c52b56b56ad91.png?imageMogr2/auto-orient/strip|imageView2/2/w/1020/format/webp)

工程的完整初始结构如下：

![img](https:////upload-images.jianshu.io/upload_images/7896890-2ea182a1f1e9bd9a.png?imageMogr2/auto-orient/strip|imageView2/2/w/363/format/webp)

#### 第二步：引入依赖 jar 包

第二步，就是要准备项目的依赖 jar 包：

- MyBatis 的包（[MyBatis 3.4.6](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fmybatis%2Fmybatis-3%2Freleases)）
- Spring 的 jar 包（[Spring 4.3.15](https://links.jianshu.com/go?to=http%3A%2F%2Frepo.spring.io%2Frelease%2Forg%2Fspringframework%2Fspring%2F)）
- MyBatis 与 Spring 的整合 jar 包（[mybatis-spring 1.3.2](https://links.jianshu.com/go?to=http%3A%2F%2Fmvnrepository.com%2Fartifact%2Forg.mybatis%2Fmybatis-spring)）
- mysql-connector-java-5.1.21.jar
- junit-4.12.jar

![img](https:////upload-images.jianshu.io/upload_images/7896890-9b60a2c6d0cde57d.png?imageMogr2/auto-orient/strip|imageView2/2/w/621/format/webp)

在【WEB-INF】文件夹下的【lib】文件夹中放置上面列举的 jar 包，然后添加依赖。

#### 第三步：编写 Spring 配置文件

第三步，编写 Spring 的配置文件：

- 加载数据库连接文件 “db.properties” 中的数据，建立数据源
- 配置 sqlSessionFactory 会话工厂对象



```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd">

    <!-- 加载配置文件 -->
    <context:property-placeholder location="classpath:db.properties"/>

    <!-- 配置数据源 -->
    <bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="driverClassName" value="${jdbc.driver}"/>
        <property name="url" value="${jdbc.url}"/>
        <property name="username" value="${jdbc.username}"/>
        <property name="password" value="${jdbc.password}"/>
    </bean>

    <!-- sqlSessionFactory -->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <!-- 加载 MyBatis 的配置文件 -->
        <property name="configLocation" value="mybatis/SqlMapConfig.xml"/>
        <!-- 数据源 -->
        <property name="dataSource" ref="dataSource"/>
    </bean>
</beans>
```

- **头部的信息就是声明 xml 文档配置标签的规则的限制与规范。**
- **“context:property-placeholder”** 配置是**用于读取工程中的静态属性文件**，然后在其他配置中使用时，就**可以采用 “${属性名}” 的方式获取该属性文件中的配置参数值。**
- 配置了一个名为 **“dataSrouce”** 的 bean 的信息，实际上是**连接数据库的数据源。**
- 设置 **sqlSessionFactory** 的 bean 实现类为 MyBatis 与 Spring 整合 jar 包中的 **SqlSessionFactoryBean** 类，**在其中只需要注入两个参数：一个是 MyBatis 的全局配置文件，一个是上面配置的数据源 bean**

#### 第四步：编写 MyBatis 配置文件

第四步，在【mybatis】包下编写 MyBatis 的全局配置文件 SqlMapConfig.xml ：



```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

    <!-- settings -->
    <settings>
        <!-- 打开延迟加载的开关 -->
        <setting name="lazyLoadingEnabled" value="true"/>
        <!-- 将积极加载改为消极加载（即按需加载） -->
        <setting name="aggressiveLazyLoading" value="false"/>
        <!-- 打开全局缓存开关（二级缓存）默认值就是 true -->
        <setting name="cacheEnabled" value="true"/>
    </settings>

    <!-- 别名定义 -->
    <typeAliases>
        <package name="cn.wmyskxz.pojo"/>
    </typeAliases>

    <!-- 加载映射文件 -->
    <mappers>
        <!-- 通过 resource 方法一次加载一个映射文件 -->
        <mapper resource="sqlmap/UserMapper.xml"/>
        <!-- 批量加载mapper -->
        <package name="cn.wmyskxz.mapper"/>
    </mappers>
</configuration>
```

在该配置文件中：

- 通过 **settings 配置了一些延迟加载和缓存的开关信息**
- 在 **typeAliases 中设置了一个 package 的别名扫描路径**，在该路径下的 Java 实体类都可以拥**有一个别名（即首字母小写的类名）**
- 在 mappers 配置中，使用 mapper 标签配置了即将要加载的 Mapper 映射文件的资源路径，当然也可以使用 package 标签，配置 mapper 代理接口所在的包名，以批量加载 mapper 代理对象。
- **注意：** 有了 Spring 托管数据源，在 MyBatis 配置文件中仅仅需要关注性能化配置。

#### 第五步：编写 Mapper 以及其他配置文件

第五步，编写 Mapper 映射文件，这里依然定义 Mapper 映射文件的名字为 “UserMapper.xml” （与 SqlMapConfig.xml 中配置一致），为了测试效果，只配置了一个查询类 SQL 映射：



```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="test">
    <select id="findUserById" parameterType="_int" resultType="user">
    SELECT * FROM USER WHERE id = #{id}
</select>
</mapper>
```

在该配置中，输出参数的映射为 “user” ，这是因为之前在 SqlMapConfig.xml 中配置了 “cn.wmyskxz.pojo” 包下的实体类使用别名（即首字母小写的类名），所以这里只需在 “cn.wmyskxz.pojo” 包下，创建 “finduserById” 对应的 Java 实体类 User：



```java
package cn.wmyskxz.pojo;

import java.io.Serializable;

public class User implements Serializable {
    private int id;
    private String username;

    /* getter and setter */
}
```

- 实现 Serializable 接口是为之后使用 Mapper 动态代理做准备，这里没有使用动态代理。

在数据库资源 “db.properties” 中配置了数据库的连接信息，以 “key=value” 的形式配置，String 正是使用 “${}” 获取其中 key 对应的 value 配置的：



```cpp
jdbc.driver=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/mybatis?characterEncoding=UTF-8
jdbc.username=root
jdbc.password=root
```

另外日志配置和[之前的配置](https://www.jianshu.com/p/76d35d939539)一样，我就直接黏贴了：



```cpp
# Global logging configuration
# 在开发环境下日志级别要设置成 DEBUG ，生产环境设为 INFO 或 ERROR
log4j.rootLogger=DEBUG, stdout
# Console output...
log4j.appender.stdout=org.apache.log4j.ConsoleAppender
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
log4j.appender.stdout.layout.ConversionPattern=%5p [%t] - %m%n
```

#### 第六步：编写 DAO 层

第六步，进行数据库交互（Data Access Object）层的编写。

由于该项目只对 User 用户查询，所以 DAO 层就只有一个类，在 “cn.wmyskxz” 包下创建 DAO 层的 interface 接口，其中定义了 findUserById 方法，参数为用户的 id 值（int 类型）：



```java
package cn.wmyskxz.dao;

import cn.wmyskxz.pojo.User;

public interface UserDAO {

    // 根据 id 查询用户信息
    public User findUserById(int id) throws Exception;
}
```

然后在同一个包下创建 UserDAO 接口的实现类 UserDAOImpl:



```java
package cn.wmyskxz.dao;

import cn.wmyskxz.pojo.User;
import org.apache.ibatis.session.SqlSession;
import org.mybatis.spring.support.SqlSessionDaoSupport;

public class UserDAOImpl extends SqlSessionDaoSupport implements UserDAO {

    @Override
    public User findUserById(int id) throws Exception {
        // 继承 SqlSessionDaoSupport 类，通过 this.getSqlSession() 得到 sqlSession
        SqlSession sqlSession = this.getSqlSession();
        User user = sqlSession.selectOne("test.findUserById", id);
        return user;
    }
}
```

- **有几点解释：**
- **UserDAOImpl 不仅实现了 UserDAO 接口，而且继承了 SqlSessionDaoSupport 类。**
- SqlSessionDaoSupport 类是 MyBatis 与 Spring 整合的 jar 包中提供的，**在该类中已经包含了 sqlSessionFactory 对象作为其成员变量**，而且对外提供 get 和 set 方法，方便 Spring 从外部注入 sqlSessionFactory 对象。
- UserDAOImpl 类要成功获取 sqlSessionFactory 对象，还**需要在 Spring 配置文件 applicationContext.xml 中添加 userDAO 的 bean 配置，将其中定义的 sqlSessionFactory 对象当做参数注入进去**，这样 UserDAOImpl 继承 SqlSessionDaoSupport 类才会起到作用：



```xml
<!-- 原始 DAO 接口 -->
<bean id="userDAO" class="cn.wmyskxz.dao.UserDAOImpl">
    <property name="sqlSessionFactory" ref="sqlSessionFactory"/>
</bean>
```

- **注意：** DAO 实现类继承了 SqlSessionDaoSupport 父类后，就无须自己定义获取 SqlSession 会话实例类方法了，该父类会默认加载数据源信息并提供获取 SqlSession 类的方法。

#### 第七步：编写 Service 测试类

在 “cn.wmyskxz.test” 包下创建【UserServiceTest】测试类：



```java
package cn.wmyskxz.test;

import cn.wmyskxz.dao.UserDAO;
import cn.wmyskxz.pojo.User;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class UserServiceTest {

    private ApplicationContext applicationContext;

    // 在执行测试方法之前首先获取 Spring 配置文件对象
    // 注解@Before在执行本类所有测试方法之前先调用这个方法
    @Before
    public void setup() throws Exception {
        applicationContext = new
                ClassPathXmlApplicationContext("classpath:spring/applicationContext.xml");
    }

    @Test
    public void testFindUserById() throws Exception {
        // 通过配置资源对象获取 userDAO 对象
        UserDAO userDAO = (UserDAO) applicationContext.getBean("userDAO");
        // 调用 UserDAO 的方法
        User user = userDAO.findUserById(1);
        // 输出用户信息
        System.out.println(user.getId() + ":" + user.getUsername());
    }
}
```

运行测试方法，输出结果如下：

![img](https:////upload-images.jianshu.io/upload_images/7896890-3aa5986831a67175.png?imageMogr2/auto-orient/strip|imageView2/2/w/921/format/webp)

------

## 动态代理 + 注解实现

上面的实例程序并没有使用 Mapper 动态代理和注解来完成，下面我们就来试试如何用动态代理和注解：

#### 第一步：编写 UserQueryMapper

在【mapper】下新建一个【UserQueryMapper】代理接口，并使用注解：



```java
package cn.wmyskxz.mapper;

import cn.wmyskxz.pojo.User;
import org.apache.ibatis.annotations.Select;

public interface UserQueryMapper {

    @Select("SELECT * FROM USER WHERE id = #{id}")
    public User findUserById(int id) throws Exception;
}
```

- **注意：** 在默认情况下，该 bean 的名字为 userQueryMapper（即首字母小写）

现在有了代理类，我们需要通知 Spring 在这里来扫描到该类，Mapper 扫描配置对象需要用专门的扫描器：



```xml
<!-- Mapper 扫描器 -->
<bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
    <!-- 扫描 cn.wmyskxz.mapper 包下的组件 -->
    <property name="basePackage" value="cn.wmyskxz.mapper"/>
</bean>
```

#### 第二步：编写测试类

这一次我们获取的不再是 userDAO 对象，而是定义的 Mapper 代理对象 userQueryMapper：



```java
package cn.wmyskxz.test;

import cn.wmyskxz.mapper.UserQueryMapper;
import cn.wmyskxz.pojo.User;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class UserServiceTest {

    private ApplicationContext applicationContext;

    // 在执行测试方法之前首先获取 Spring 配置文件对象
    // 注解@Before在执行本类所有测试方法之前先调用这个方法
    @Before
    public void setup() throws Exception {
        applicationContext = new
                ClassPathXmlApplicationContext("classpath:spring/applicationContext.xml");
    }

    @Test
    public void testFindUserById() throws Exception {
        // 通过配置资源对象获取 userDAO 对象
        UserQueryMapper userQueryMapper = (UserQueryMapper) applicationContext.getBean("userQueryMapper");
        // 调用 UserDAO 的方法
        User user = userQueryMapper.findUserById(1);
        // 输出用户信息
        System.out.println(user.getId() + ":" + user.getUsername());
    }
}
```

运行测试方法，得到正确结果：

![img](https:////upload-images.jianshu.io/upload_images/7896890-8543b70d3880b5ac.png?imageMogr2/auto-orient/strip|imageView2/2/w/421/format/webp)

可以看到，查询结果和之前非 Mapper 代理的查询结果一样。

- **原理：** 在 applicationContext.xml 配置文件中配置的 **mapper 批量扫描器类，会从 mapper 包中扫描出 Mapper 接口，自动创建代理对象并且在 Spring 容器中注入。**自动扫描出来的 Mapper 的 bean 的 id 为 mapper 类名（首字母小写），所以这里获取的就是名为 “userQueryMapper” 的 mapper 代理对象。

#### 参考资料：

- 《Java EE 互联网轻量级框架整合开发》
- 《Spring MVC + MyBatis开发从入门到项目实战》
- 全能的百度和万能的大脑



作者：我没有三颗心脏
链接：https://www.jianshu.com/p/412051d41d73
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。





# 四、springboot使用Mybatis(xml和注解)全解析

其他依赖版本见下面 pom.xml:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>mybatis-test</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <packaging>jar</packaging>

    <name>mybatis-test</name>
    <description>Demo project for Spring Boot</description>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.0.3.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>
        <!--mybatis依赖 -->
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>1.3.2</version>
        </dependency>
        <!--alibaba连接池依赖-->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid-spring-boot-starter</artifactId>
            <version>1.1.9</version>
        </dependency>
        <!--分页依赖-->
        <dependency>
            <groupId>com.github.pagehelper</groupId>
            <artifactId>pagehelper-spring-boot-starter</artifactId>
            <version>1.2.5</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

## 1.创建项目

 使用 idea 中的 spring initializr 生成 maven 项目，项目命令为 mybatis-test，选择 web，mysql，mybatis 依赖，即可成功。（详细过程不赘述，如有需要学习 springboot 创建过程，可参考[这篇文章](http://tapme.top/blog/detail/2018-08-13-10-38)。

 然后依照上面的 pom 文件，补齐缺少的依赖。接着创建包 entity，service 和 mybatis 映射文件夹 mapper，创建。为了方便配置将 application.properties 改成 application.yml。由于我们时 REST 接口，故不需要 static 和 templates 目录。修改完毕后的项目结构如下：

![项目结构](https://raw.githubusercontent.com/FleyX/files/master/blogImg/%E6%95%B0%E6%8D%AE%E5%BA%93/20190107101305.png)

  修改启动类，增加`@MapperScan("com.example.mybatistest.dao")`,以自动扫描 dao 目录，避免每个 dao 都手动加`@Mapper`注解。代码如下：

```java
@SpringBootApplication
@MapperScan("com.example.mybatistest.dao")
public class MybatisTestApplication {
    public static void main(String[] args) {
        SpringApplication.run(MybatisTestApplication.class, args);
    }
}
```

修改 application.yml,配置项目，代码如下：

```yml
mybatis:
  #对应实体类路径
  type-aliases-package: com.example.mybatistest.entity
  #对应mapper映射文件路径
  mapper-locations: classpath:mapper/*.xml

#pagehelper物理分页配置
pagehelper:
  helper-dialect: mysql
  reasonable: true
  support-methods-arguments: true
  params: count=countSql
  returnPageInfo: check

server:
  port: 8081

spring:
  datasource:
    name: mysqlTest
    type: com.alibaba.druid.pool.DruidDataSource
    #druid连接池相关配置
    druid:
      #监控拦截统计的filters
      filters: stat
      driver-class-name: com.mysql.jdbc.Driver
      url: jdbc:mysql://localhost:3306/test?useUnicode=true&characterEncoding=utf-8&useSSL=true
      username: root
      password: 123456
      #配置初始化大小，最小，最大
      initial-size: 1
      min-idle: 1
      max-active: 20
      #获取连接等待超时时间
      max-wait: 6000
      #间隔多久检测一次需要关闭的空闲连接
      time-between-eviction-runs-millis: 60000
      #一个连接在池中的最小生存时间
      min-evictable-idle-time-millis: 300000
      #打开PSCache，并指定每个连接上PSCache的大小。oracle设置为true，mysql设置为false。分库分表设置较多推荐设置
      pool-prepared-statements: false
      max-pool-prepared-statement-per-connection-size: 20
  http:
    encoding:
      charset: utf-8
      enabled: true
```

## 2.编写代码

 首先创建数据表，sql 语句如下：

```sql
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `age` tinyint(4) NOT NULL DEFAULT '0',
  `password` varchar(255) NOT NULL DEFAULT '123456',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;
```

 然后在 entity 包中创建实体类 User.java

```java
public class User {
    private int id;
    private String name;
    private int age;
    private String password;

    public User(int id, String name, int age, String password) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.password = password;
    }
    public User(){}
    //getter setter自行添加
}
```

 在 dao 包下创建 UserDao.java

```java
public interface UserDao {
    //插入用户
    int insert(User user);
    //根据id查询
    User selectById(String id);
    //查询所有
    List<User> selectAll();
}
```

 在 mapper 文件夹下创建 UserMapper.xml,具体的 xml 编写方法查看文首的官方文档。

```xml
<?xml version="1.0" encoding="utf-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
<mapper namespace="com.example.mybatistest.dao.UserDao">
    <sql id="BASE_TABLE">
        user
    </sql>
    <sql id="BASE_COLUMN">
        id,name,age,password
    </sql>

    <insert id="insert" parameterType="com.example.mybatistest.entity.User" useGeneratedKeys="true" keyProperty="id">
        INSERT INTO <include refid="BASE_TABLE"/>
        <trim prefix="(" suffix=")" suffixOverrides=",">
            name,password,
            <if test="age!=null">
                age
            </if>
        </trim>
        <trim prefix=" VALUE(" suffix=")" suffixOverrides=",">
            #{name,jdbcType=VARCHAR},#{password},
            <if test="age!=null">
                #{age}
            </if>
        </trim>
    </insert>

    <select id="selectById" resultType="com.example.mybatistest.entity.User">
        select
          <include refid="BASE_COLUMN"/>
        from
          <include refid="BASE_TABLE"/>
        where id=#{id}
    </select>

    <select id="selectAll" resultType="com.example.mybatistest.entity.User">
        select
          <include refid="BASE_COLUMN"/>
        from
          <include refid="BASE_TABLE"/>
    </select>
</mapper>
```

 至此使用 mybatis 的代码编写完了，之后要用时调用 dao 接口中的方法即可。

## 3.测试

 我们通过编写 service，controller 然后使用 postman 进行测试。

 首先编写 UserService.java,代码如下：

```java
@Component
public class UserService {

    @Autowired
    private UserDao userDao;

    public User getByUserId(String id){
        return userDao.selectById(id);
    }
    //获取全部用户
    public List<User> getAll(){
        return userDao.selectAll();
    }
    //测试分页
    public PageInfo<User> getAll(int pageNum,int pageSize){
        PageHelper.startPage(pageNum,pageSize);
        List<User> users = userDao.selectAll();
        System.out.println(users.size());
        PageInfo<User> result = new PageInfo<>(users);
        return result;
    }

    public int insert(User user){
        return userDao.insert(user);
    }

}
```

 编写 UserController.java

```java
@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/user/{userId}")
    public User getUser(@PathVariable String userId){
        return userService.getByUserId(userId);
    }

    @GetMapping("/user")
    public List<User> getAll(){
        return userService.getAll();
    }

    @GetMapping("/user/page/{pageNum}")
    public Object getPage(@PathVariable int pageNum,
                          @RequestParam(name = "pageSize",required = false,defaultValue = "10") int pageSize){
        return userService.getAll(pageNum,pageSize);
    }

    @PostMapping("/user")
    public Object addOne(User user){
        userService.insert(user);
        return user;
    }
}
```

 启动项目，通过 postman 进行请求测试，测试结果如下：

- 插入数据：

![插入](https://raw.githubusercontent.com/FleyX/files/master/blogImg/%E6%95%B0%E6%8D%AE%E5%BA%93/20190107101358.png)

- 查询数据

![查询](https://raw.githubusercontent.com/FleyX/files/master/blogImg/%E6%95%B0%E6%8D%AE%E5%BA%93/20190107101412.png)

- 分页查询

![分页查询](https://raw.githubusercontent.com/FleyX/files/master/blogImg/%E6%95%B0%E6%8D%AE%E5%BA%93/20190107101608.png)

## 4.注解编写 sql

 上面使用的是 xml 方式编写 sql 代码，其实 mybatis 也支持在注解中编写 sql，这样可以避免编写复杂的 xml 查询文件，但同时也将 sql 语句耦合到了代码中，也不易实现复杂查询，因此多用于简单 sql 语句的编写。

 要使用注解首先将 applicaton.yml 配置文件中的`mapper-locations: classpath:mapper/*.xml`注释掉。然后在 UserDao.java 中加入 sql 注解，代码如下：

```java
public interface UserDao {
    //插入用户
    @Insert("insert into user(name,age,password) value(#{name},#{age},#{password})")
    @Options(useGeneratedKeys=true,keyColumn="id",keyProperty="id")
    int insert(User user);
    //根据id查询
    @Select("select * from user where id=#{id}")
    User selectById(String id);
    //查询所有
    @Select("select * from user")
    List<User> selectAll();
}
```

然后重新启动项目测试，测试结果跟上面完全一样。

**本文原创发布于：**https://www.tapme.top/blog/detail/2018-09-01-10-38

**源码地址：**https://github.com/FleyX/demo-project/tree/master/mybatis-test.

**我的个人博客**[www.tapme.top](https://www.tapme.top/)





# 五、Mybatis与Spring整合（纯注解）

java1.5版本之后开始支持注解，spring*2开始提供注解配置方式，到spring**4后spring推荐使用注解配置

IOC注解(主要作用就是在spring容器中声明一个Bean，同xml中的Bean节点作用相同，用在类上)：

　　@Repository(标识DAO层)

　　@Service(标识Service层)

　　@Conmpent(用在其他组件上)

　　隐式注入：

　　@Autowired:根据类型注入

　　@Qualifier：更具名字注入，但是需要和Autowired连用

　　@Resource:jdk提供，默认根据名字注入，如果没找到名字则根据类型注入

Aop注解（）

　　@Aspect（作用在类上，标识这是一个切面）

　　@Before(作用在方法上，前置增强)

　　@AfterReturing(作用在方法上，后置增强)

　　@AfterThrowing(作用在方法上，异常抛出增强)

　　@After(作用在方法上，最终增强)

其他注解

　　@Configuration：标识作用，表示这个类是一个核心配置类

　　@MapperScan：扫描Mapper接口，为dao层生成动态代理

　　@ComponentScan：扫描有注解的类所在的包

　　@EnableTransactionManagement：开启事务的注解

　　@EnableAspectJAutoProxy：开启aop的注解

　　@Transactional表示开启事务，作用在类上为该类所有方法都开启一个事务，也可以作用在方法上，表示当前方法开启一个事务

1.导入依赖

pom节点砸死上一章spring+mybatis整合（xml）配置中有，这里就不重复了。

2.准备数据库

![img](https://img2018.cnblogs.com/blog/1445100/201903/1445100-20190310152333526-1417779972.png)

3.业务代码

　　dao层代码

　　　　

```
1 public interface AccountDao {
2     List<Account>getAll();//查询数据库中所有信息
3     @Update("update account set accountmonkey=accountmonkey+1000 where accountid=1")
4     int addMonkey();//给id为1的用户加1000块钱
5     @Update("update account set accountmonkey=accountmonkey-1000 where accountid=2")
6     int subMonkey();//给id为2的用户减1000块钱
7 }
```

service层接口

```
1 public interface AccountService {
2     List<Account> getAll();//查询所有
3     int changemonkey();//模拟转账
4 }
```

service层实现类

```
 1 @Service
 2 public class AccountServiceImpl implements AccountService {
 3     //注入dao接口实例
 4     @Autowired
 5     private AccountDao dao;
 6     @Override
 7     public List<Account> getAll() {
 8         return dao.getAll();
 9     }
10 
11     @Transactional(propagation = Propagation.REQUIRED,isolation = Isolation.READ_COMMITTED)
12     @Override
13     public int changemonkey() {
14         dao.subMonkey();//id为2的先转出1000
15         //int reuslt=5/0;//模拟一个异常，中断交易
16         dao.addMonkey();//id为1的收到1000
17         return 0;
18     }
19 
20 }
```

实体类（建完表一定要先写实体类）

```
public class Account {
    private int accountid;
    private String accountname;
    private Double accountmonkey;
//省略setter,getter
}
```

 4.核心配置类

```
 1 package com.cn.config;
 2 
 3 import com.cn.advisor.AccountAdvisor;
 4 import org.apache.commons.dbcp2.BasicDataSource;
 5 import org.mybatis.spring.SqlSessionFactoryBean;
 6 import org.mybatis.spring.annotation.MapperScan;
 7 import org.springframework.context.annotation.Bean;
 8 import org.springframework.context.annotation.ComponentScan;
 9 import org.springframework.context.annotation.Configuration;
10 import org.springframework.context.annotation.EnableAspectJAutoProxy;
11 import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
12 import org.springframework.jdbc.datasource.DataSourceTransactionManager;
13 import org.springframework.transaction.annotation.EnableTransactionManagement;
14 
15 import javax.sql.DataSource;
16 import java.beans.PropertyVetoException;
17 import java.io.IOException;
18 import java.net.MalformedURLException;
19 
20 @Configuration//指定这是一个核心配置类
21 @MapperScan("com.cn.dao")//扫描dao层，生成动态代理
22 @ComponentScan("com.cn")//扫描该路径下所有类上的注解
23 @EnableTransactionManagement//开启事务
24 @EnableAspectJAutoProxy
25 public class ApplicationConfig {
26     //配置数据源
27     @Bean//等同于xml中的<bean>节点
28     public DataSource dataSource(JdbcConfig dbcp) throws PropertyVetoException {
29         //其中JdbcConfig是自定义的配置类，读取properties文件的类
30         BasicDataSource cd = new BasicDataSource();
31         cd.setDriverClassName(dbcp.getDriver());
32         cd.setUrl(dbcp.getUrl());
33         cd.setUsername(dbcp.getName());
34         cd.setPassword(dbcp.getPassword());
35         return cd;
36     }
37     //配置核心Mybatis核心工厂
38     @Bean
39     public SqlSessionFactoryBean sqlSessionFactoryBean(DataSource ds) throws IOException {
40         SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
41         bean.setDataSource(ds);//配置数据源
42         bean.setTypeAliasesPackage("com.cn.entity");//设置实体类别名
43         PathMatchingResourcePatternResolver  resolver = new PathMatchingResourcePatternResolver();
44         bean.setMapperLocations(resolver.getResources("classpath:/mapper/*.xml"));//配置Mapper映射文件的路径
45         return bean;
46     }
47     //配置事务管理器
48     @Bean
49     public DataSourceTransactionManager dataSourceTransactionManager(DataSource ds){
50         DataSourceTransactionManager dm = new DataSourceTransactionManager();
51         dm.setDataSource(ds);
52         return dm;
53     }
54 }
```

读取连接参数的配置类

```
package com.cn.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

@Repository//这里就是向证明一下IOC的几个声明bean的注解是可以混用的
@PropertySource("classpath:/database.properties")
public class JdbcConfig {
    @Value("${jdbc.username}")
    private String name;
    @Value("${jdbc.password}")
    private String password;
    @Value("${jdbc.driver}")
    private String driver;
    @Value("${jdbc.url}")
    private String url;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getDriver() {
        return driver;
    }

    public void setDriver(String driver) {
        this.driver = driver;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
```

切面

 

```
@Aspect//标志这是一个切面
@Component//和@Service作用一样，都是在spring容器中声明一个Bean
public class AccountAdvisor {
    @Pointcut("execution(* com.cn.service.*.*(..))")
    public void pointcut(){}
    @Before("pointcut()")
    public void before(JoinPoint jp){
        System.out.println("我是前置增强！！！");
    }
}
```

 

编写测试类

```
public class App 
{
    public static void main( String[] args ) {
        ApplicationContext context = new AnnotationConfigApplicationContext(ApplicationConfig.class);
        AccountService bean = context.getBean(AccountService.class);
        System.out.println(bean.getAll());//获取所有用户
        bean.changemonkey();//模拟转账
    }
}
```

 将service层的算术异常的注释解开，模拟一个异常，可以验证事务是否能用！

转载于:https://www.cnblogs.com/Tiandaochouqin1/p/10505448.html





# 六、Spring+Mybatis整合(注解方式)

mybatis-config.xml

```xml
<?xml version="1.0" encoding="utf-8"?>

<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" 
"http://mybatis.org/dtd/mybatis-3-config.dtd">

<configuration>
	<!-- 配置别名 -->
	<typeAliases>
		<package name="cn.qf.springandmybatis.pojo"></package>
	</typeAliases>
</configuration>
```


applicationContext.xml
	
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:aop="http://www.springframework.org/schema/aop"
    xmlns:p="http://www.springframework.org/schema/p"
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
	http://www.springframework.org/schema/beans/spring-beans-3.2.xsd
	http://www.springframework.org/schema/context
	http://www.springframework.org/schema/context/spring-context-3.2.xsd
	http://www.springframework.org/schema/aop
	http://www.springframework.org/schema/aop/spring-aop-3.2.xsd">
<!--1.配置数据源（连接池）  ,destroy-method="close":创建后自动关闭-->
<bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource" destroy-method="close">
	<!-- name是这个bean对象所在类的属性值，是固定值-->
	<property name="driverClassName" value="com.mysql.jdbc.Driver"></property>
	<property name="url" value="jdbc:mysql://localhost:3306/supermarket"></property>
	<property name="username" value="root"></property>
	<property name="password" value="cuichen975541045"></property>
</bean>

<!-- 2.通过配置让spring创建sqlSessionFactory,作用：获取一个连接，创建sqlSessionTemplate(相当于mybatis中的sqlSession),来操作数据库 -->
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
	<!-- 2.1设置引用的数据源，通过ref到设置的连接池中获取连接,然后赋给name -->
	<property name="dataSource" ref="dataSource"></property>
	<!-- 2.2设置mybatis的配置文件位置，使用这个bean所对应类中的configLocation(Resource类型)属性来读取配置文件的位置 -->
	<property name="configLocation" value="mybatis-config.xml"></property>
</bean>

<!-- 加载Mapper映射文件: MapperScannerConfigurer加载,读取mapper文件
	根据Mapper映射文件和对应的接口生成实现类,并且创建实现类的对象
-->
<bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
	<property name="basePackage" value="cn.qf.springandmybatis.dao"></property>
</bean>

<!-- 告诉spring扫描指定的包,按注解执行 -->
<context:component-scan base-package="cn.qf.springandmybatis.service"></context:component-scan>
<!-- 启用AOP -->
<aop:aspectj-autoproxy></aop:aspectj-autoproxy>
</beans>
```



dao层

UserMapper.java



​	

```java
package cn.qf.springandmybatis.dao;

import java.util.List;

import cn.qf.springandmybatis.pojo.User;
//注意!接口的名字一定要和mapper文件的名字一致
public interface UserMapper {
//添加
public int addUser(User user);

//查询
public List<User> getUserListBy(User user);
}
```

UserMapper.xml

```
<!DOCTYPE mapper
PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<?xml version="1.0" encoding="utf-8"?>
<mapper namespace="cn.qf.springandmybatis.dao.UserMapper">
	<insert id="addUser" parameterType="User">
		insert into smbms_user(userCode,userName,userRole)
		values(#{userCode},#{userName},#{userRole2.id}) 
	</insert>
	<select id="getUserListBy" parameterType="User" resultType="User">
		select id,userCode,userName,userPassword from smbms_user
		where userName like CONCAT('%',#{userName},'%') and userRole=#{userRole2.id}
	</select>
</mapper>
```


Service层
UserService.java


​	
```java
package cn.qf.springandmybatis.service;

import java.util.List;

import cn.qf.springandmybatis.pojo.User;

public interface UserService {
	//添加方法
	public boolean addUser(User user);
//查询方法
public List<User> getUsersBy(User user);
}
```



UserServiceImpl.java
@Service(“usi”) 指定当前类对象的名字
@Autowired 用自动装配的方式给对象注入值


​	
```java
package cn.qf.springandmybatis.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cn.qf.springandmybatis.dao.UserMapper;
import cn.qf.springandmybatis.pojo.User;
@Service("usi")
public class UserServiceImpl implements UserService{
	//注入值,用自动装配的方式
	@Autowired
	private UserMapper userDao;

public UserMapper getUserDao() {
	return userDao;
}

public void setUserDao(UserMapper userDao) {
	this.userDao = userDao;
}

//添加方法
public boolean addUser(User user) {
	int result = userDao.addUser(user);
	if (result==1) {
		return true;
	}else {
		return false;
	}
}
//查询方法
public List<User> getUsersBy(User user) {
	return userDao.getUserListBy(user);
}
}
controller层
```

————————————————
版权声明：本文为CSDN博主「cuichen97」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/cuichen16/article/details/101234200







# 七、spring boot 如何优雅的使用mybatis-spring-boot-starter

地址出处：http://www.ityouknow.com/springboot/2016/11/06/spring-boo-mybatis.html

这两天启动了一个新项目因为项目组成员一直都使用的是mybatis，虽然个人比较喜欢jpa这种极简的模式，但是为了项目保持统一性技术选型还是定了 mybatis。到网上找了一下关于spring boot和mybatis组合的相关资料，各种各样的形式都有，看的人心累，结合了mybatis的官方demo和文档终于找到了最简的两种模式，花了一天时间总结后分享出来。

orm框架的本质是简化编程中操作数据库的编码，发展到现在基本上就剩两家了，一个是宣称可以不用写一句SQL的hibernate，一个是可以灵活调试动态sql的mybatis,两者各有特点，在企业级系统开发中可以根据需求灵活使用。发现一个有趣的现象：传统企业大都喜欢使用hibernate,互联网行业通常使用mybatis。

hibernate特点就是所有的sql都用Java代码来生成，不用跳出程序去写（看）sql，有着编程的完整性，发展到最顶端就是spring data jpa这种模式了，基本上根据方法名就可以生成对应的sql了，有不太了解的可以看我的上篇文章[springboot(五)：spring data jpa的使用](http://www.ityouknow.com/springboot/2016/08/20/springboot(五)-spring-data-jpa的使用.html)。

mybatis初期使用比较麻烦，需要各种配置文件、实体类、dao层映射关联、还有一大推其它配置。当然mybatis也发现了这种弊端，初期开发了[generator](https://github.com/mybatis/generator)可以根据表结果自动生产实体类、配置文件和dao层代码，可以减轻一部分开发量；后期也进行了大量的优化可以使用注解了，自动管理dao层和配置文件等，发展到最顶端就是今天要讲的这种模式了，mybatis-[spring-boot](https://so.csdn.net/so/search?from=pc_blog_highlight&q=spring-boot)-starter就是springboot+mybatis可以完全注解不用配置文件，也可以简单配置轻松上手。

> 现在想想spring boot 就是牛逼呀，任何东西只要关联到spring boot都是化繁为简。

## mybatis-spring-boot-starter

官方说明：`MyBatis Spring-Boot-Starter will help you use MyBatis with Spring Boot`
其实就是myBatis看spring boot这么火热也开发出一套解决方案来凑凑热闹,但这一凑确实解决了很多问题，使用起来确实顺畅了许多。mybatis-spring-boot-starter主要有两种解决方案，一种是使用注解解决一切问题，一种是简化后的老传统。

当然任何模式都需要首先引入mybatis-spring-boot-starter的pom文件,现在最新版本是1.1.1（`刚好快到双11了 :)`）

```xml
<dependency>
	<groupId>org.mybatis.spring.boot</groupId>
	<artifactId>mybatis-spring-boot-starter</artifactId>
	<version>1.1.1</version>
</dependency>
```

好了下来分别介绍两种开发模式

## 无配置文件注解版

就是一切使用注解搞定。

### 1 添加相关maven文件

```xml
<dependencies>
	<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter</artifactId>
	</dependency>
	<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-test</artifactId>
		<scope>test</scope>
	</dependency>
	<dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
	<dependency>
		<groupId>org.mybatis.spring.boot</groupId>
		<artifactId>mybatis-spring-boot-starter</artifactId>
		<version>1.1.1</version>
	</dependency>
     <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
    </dependency>
     <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <optional>true</optional>
	</dependency>
</dependencies>
```

完整的pom包这里就不贴了，大家直接看源码

### 2、`application.properties` 添加相关配置

```scala
mybatis.type-aliases-package=com.neo.entity
 
spring.datasource.driverClassName = com.mysql.jdbc.Driver
spring.datasource.url = jdbc:mysql://localhost:3306/test1?useUnicode=true&characterEncoding=utf-8
spring.datasource.username = root
spring.datasource.password = root
```

springboot会自动加载spring.datasource.*相关配置，数据源就会自动注入到sqlSessionFactory中，sqlSessionFactory会自动注入到Mapper中，对了你一切都不用管了，直接拿起来使用就行了。

在启动类中添加对mapper包扫描`@MapperScan`

```typescript
@SpringBootApplication
@MapperScan("com.neo.mapper")
public class Application {
 
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}
```

或者直接在Mapper类上面添加注解`@Mapper`,建议使用上面那种，不然每个mapper加个注解也挺麻烦的

### 3、开发Mapper

第三步是最关键的一块，sql生产都在这里

```python
public interface UserMapper {
	
	@Select("SELECT * FROM users")
	@Results({
		@Result(property = "userSex",  column = "user_sex", javaType = UserSexEnum.class),
		@Result(property = "nickName", column = "nick_name")
	})
	List<UserEntity> getAll();
	
	@Select("SELECT * FROM users WHERE id = #{id}")
	@Results({
		@Result(property = "userSex",  column = "user_sex", javaType = UserSexEnum.class),
		@Result(property = "nickName", column = "nick_name")
	})
	UserEntity getOne(Long id);
 
	@Insert("INSERT INTO users(userName,passWord,user_sex) VALUES(#{userName}, #{passWord}, #{userSex})")
	void insert(UserEntity user);
 
	@Update("UPDATE users SET userName=#{userName},nick_name=#{nickName} WHERE id =#{id}")
	void update(UserEntity user);
 
	@Delete("DELETE FROM users WHERE id =#{id}")
	void delete(Long id);
 
}
```

**为了更接近生产我特地将user_sex、nick_name两个属性在数据库加了下划线和实体类属性名不一致，另外user_sex使用了枚举**

> - @Select 是查询类的注解，所有的查询均使用这个
> - @Result 修饰返回的结果集，关联实体类属性和数据库字段一一对应，如果实体类属性和数据库属性名保持一致，就不需要这个属性来修饰。
> - @Insert 插入数据库使用，直接传入实体类会自动解析属性到对应的值
> - @Update 负责修改，也可以直接传入对象
> - @delete 负责删除

[了解更多属性参考这里](http://www.mybatis.org/mybatis-3/zh/java-api.html)

> **注意，使用#符号和$符号的不同：**

```kotlin
// This example creates a prepared statement, something like select * from teacher where name = ?;
@Select("Select * from teacher where name = #{name}")
Teacher selectTeachForGivenName(@Param("name") String name);
 
// This example creates n inlined statement, something like select * from teacher where name = 'someName';
@Select("Select * from teacher where name = '${name}'")
Teacher selectTeachForGivenName(@Param("name") String name);
```

### 4、使用

上面三步就基本完成了相关dao层开发，使用的时候当作普通的类注入进入就可以了

```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class UserMapperTest {
 
	@Autowired
	private UserMapper UserMapper;
 
	@Test
	public void testInsert() throws Exception {
		UserMapper.insert(new UserEntity("aa", "a123456", UserSexEnum.MAN));
		UserMapper.insert(new UserEntity("bb", "b123456", UserSexEnum.WOMAN));
		UserMapper.insert(new UserEntity("cc", "b123456", UserSexEnum.WOMAN));
 
		Assert.assertEquals(3, UserMapper.getAll().size());
	}
 
	@Test
	public void testQuery() throws Exception {
		List<UserEntity> users = UserMapper.getAll();
		users.forEach(userEntity -> {
      System.out.println(userEntity.toString());
    });
	}
	
	@Test
	public void testUpdate() throws Exception {
		UserEntity user = UserMapper.getOne(3l);
		System.out.println(user.toString());
		user.setNickName("neo");
		UserMapper.update(user);
		Assert.assertTrue(("neo".equals(UserMapper.getOne(3l).getNickName())));
	}
}
```

源码中controler层有完整的增删改查，这里就不贴了

## 极简xml版本

极简xml版本保持映射文件的老传统，优化主要体现在不需要实现dao的是实现层，系统会自动根据方法名在映射文件中找对应的sql.

### 1、配置

pom文件和上个版本一样，只是`application.properties`新增以下配置

```lua
mybatis.config-locations=classpath:mybatis/mybatis-config.xml
mybatis.mapper-locations=classpath:mybatis/mapper/*.xml
```

指定了mybatis基础配置文件和实体类映射文件的地址

mybatis-config.xml 配置

```bash
<configuration>
	<typeAliases>
		<typeAlias alias="Integer" type="java.lang.Integer" />
		<typeAlias alias="Long" type="java.lang.Long" />
		<typeAlias alias="HashMap" type="java.util.HashMap" />
		<typeAlias alias="LinkedHashMap" type="java.util.LinkedHashMap" />
		<typeAlias alias="ArrayList" type="java.util.ArrayList" />
		<typeAlias alias="LinkedList" type="java.util.LinkedList" />
	</typeAliases>
</configuration>
```

这里也可以添加一些mybatis基础的配置

### 2、添加User的映射文件

```xml
<mapper namespace="com.neo.mapper.UserMapper" >
    <resultMap id="BaseResultMap" type="com.neo.entity.UserEntity" >
        <id column="id" property="id" jdbcType="BIGINT" />
        <result column="user_name" property="userName" jdbcType="VARCHAR" />
        <result column="pass_word" property="passWord" jdbcType="VARCHAR" />
        <result column="user_sex"  property="userSex"  javaType="com.neo.enums.UserSexEnum"/>
        <result column="nick_name" property="nickName" jdbcType="VARCHAR" />
    </resultMap>
    
    <sql id="Base_Column_List" >
        id, userName, passWord, user_sex, nick_name
    </sql>
 
    <select id="getAll" resultMap="BaseResultMap"  >
       SELECT 
       <include refid="Base_Column_List" />
	   FROM users
    </select>
 
    <select id="getOne" parameterType="java.lang.Long" resultMap="BaseResultMap" >
        SELECT 
       <include refid="Base_Column_List" />
	   FROM users
	   WHERE id = #{id}
    </select>
 
    <insert id="insert" parameterType="com.neo.entity.UserEntity" >
       INSERT INTO 
       		users
       		(userName,passWord,user_sex) 
       	VALUES
       		(#{userName}, #{passWord}, #{userSex})
    </insert>
    
    <update id="update" parameterType="com.neo.entity.UserEntity" >
       UPDATE 
       		users 
       SET 
       	<if test="userName != null">userName = #{userName},</if>
       	<if test="passWord != null">passWord = #{passWord},</if>
       	nick_name = #{nickName}
       WHERE 
       		id = #{id}
    </update>
    
    <delete id="delete" parameterType="java.lang.Long" >
       DELETE FROM
       		 users 
       WHERE 
       		 id =#{id}
    </delete>
</mapper>
```

其实就是把上个版本中mapper的sql搬到了这里的xml中了

### 3、编写Dao层的代码

```csharp
public interface UserMapper {
	
	List<UserEntity> getAll();
	
	UserEntity getOne(Long id);
 
	void insert(UserEntity user);
 
	void update(UserEntity user);
 
	void delete(Long id);
 
}
```

对比上一步这里全部只剩了接口方法

### 4、使用

使用和上个版本没有任何区别，大家就看代码吧

## 如何选择

两种模式各有特点，注解版适合简单快速的模式，其实像现在流行的这种微服务模式，一个微服务就会对应一个自已的数据库，多表连接查询的需求会大大的降低，会越来越适合这种模式。

老传统模式比适合大型项目，可以灵活的动态生成SQL，方便调整SQL，也有痛痛快快，洋洋洒洒的写SQL的感觉。

**[\**示例代码-github\**](https://github.com/ityouknow/spring-boot-examples)**

**[\**示例代码-码云\**](https://gitee.com/ityouknow/spring-boot-examples)**
