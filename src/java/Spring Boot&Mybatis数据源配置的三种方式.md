# Spring Boot + Mybatis数据源配置的三种方式

通过之前两篇文章Spring Boot + JdbcTemplate和Spring Boot + Mybatis CRUD可以看出，无论是使用什么框架，数据源及框架的的一些配置总是不可避免的。在之前的两篇文章中分别使用了application.properties和Java Config的方式进行了配置。其实Mybatis也可以使用这两中方式进行配置，除此之外，Mybatis还可以通过使用xml配置的方式进行配置。本片文章将讲述一下三种配置的配置方法。

## 1. 项目结构

```
|   pom.xml
|   springboot-06-mybatis-config.iml
|
+---src
|   +---main
|   |   +---java
|   |   |   \---com
|   |   |       \---zhuoli
|   |   |           \---service
|   |   |               \---springboot
|   |   |                   \---mybatis
|   |   |                       \---config
|   |   |                           |   SpringBootMybatisConfigApplicationContext.java
|   |   |                           |
|   |   |                           +---controller
|   |   |                           |       UserController.java
|   |   |                           |
|   |   |                           +---repository
|   |   |                           |   +---conf
|   |   |                           |   |       DataSourceConfig.java
|   |   |                           |   |
|   |   |                           |   +---mapper
|   |   |                           |   |       UserMapper.java
|   |   |                           |   |
|   |   |                           |   +---model
|   |   |                           |   |       User.java
|   |   |                           |   |
|   |   |                           |   \---service
|   |   |                           |       |   UserRepository.java
|   |   |                           |       |
|   |   |                           |       \---impl
|   |   |                           |               UserRepositoryImpl.java
|   |   |                           |
|   |   |                           \---service
|   |   |                               |   UserControllerService.java
|   |   |                               |
|   |   |                               \---impl
|   |   |                                       UserControllerServiceImpl.java
|   |   |
|   |   \---resources
|   |       |   application.properties
|   |       |   mybatis-config.xml
|   |       |   repository-bean.xml
|   |       |
|   |       \---base
|   |           \---com
|   |               \---zhuoli
|   |                   \---service
|   |                       \---springboot
|   |                           \---mybatis
|   |                               \---config
|   |                                   \---repository
|   |                                       \---mapper
|   |                                               UserMapper.xml
|   |
|   \---test
|       \---java
```



## 2. application.properties配置

application.properties文件时Spring Boot默认加载的文件，并会通过文件内容进行一些默认配置。比如在使用jdbcTemplate时，如果application.properties文件中存在”spring.datasource.url”、”spring.datasource.password”、”spring.datasource.username”时，Spring Boot会默认自动配置DataSource，它将优先采用HikariCP连接池，如果没有该依赖的情况则选取tomcat-jdbc，如果前两者都不可用最后选取Commons DBCP2。在使用Mybatis时，通常在application.properties文件中做如下配置：

```properties
#数据源Datasource配置
spring.datasource.url=jdbc:mysql://115.47.149.48:3306/zhuoli_test?useUnicode=true&characterEncoding=UTF-8&zeroDateTimeBehavior=convertToNull&allowMultiQueries=true&useSSL=false
spring.datasource.password=zhuoli
spring.datasource.username=zhuoli
 
#mybatis配置
#Mybatis mapper.xml文件位置
mybatis.mapper-locations=classpath:base/com/zhuoli/service/springboot/mybatis/curd/repository/mapper/*.xml
#设置这个以后再Mapper.xml文件中在parameterType的值就不用写成全路径名了,可以写成parameterType = "User"
mybatis.type-aliases-package=com.zhuoli.service.springboot.mybatis.curd.repository.model
# 驼峰命名规范 如：数据库字段是order_id,那么实体字段就要写成orderId
mybatis.configuration.map-underscore-to-camel-case=true
```

除此之外不用做任何配置，Spring Boot会默认加载application.properties文件，并进行默认配置

## 3. Java Config配置

在文章[Spring Boot + Mybatis CRUD](http://lidol.top/2018/08/03/033/)中，已经演示了如何使用Java Config Mybatis配置，这里总结一些配置步骤，如下：

### 3.1 application.properties文件定义数据源信息

其实这一步也可以不配置，如果不配置，在后续DataSourceConfig.java文件中，就要将数据源信息写死，不够灵活。

```properties
##数据源配置
test.datasource.url=jdbc:mysql://115.47.149.48:3306/zhuoli_test?useUnicode=true&characterEncoding=UTF-8&zeroDateTimeBehavior=convertToNull&allowMultiQueries=true&useSSL=false
test.datasource.username=zhuoli
test.datasource.password=zhuoli
test.datasource.driverClassName=com.mysql.jdbc.Driver
```

### 3.2 添加DataSourceConfig.java配置类

```java
@Configuration
public class DataSourceConfig {
    @Value("${test.datasource.url}")
    private String url;
 
    @Value("${test.datasource.username}")
    private String user;
 
    @Value("${test.datasource.password}")
    private String password;
 
    @Value("${test.datasource.driverClassName}")
    private String driverClass;
 
    @Bean(name = "dataSource")
    public DataSource dataSource() {
        PooledDataSource dataSource = new PooledDataSource();
        dataSource.setDriver(driverClass);
        dataSource.setUrl(url);
        dataSource.setUsername(user);
        dataSource.setPassword(password);
        return dataSource;
    }
 
    @Bean(name = "transactionManager")
    public DataSourceTransactionManager dataSourceTransactionManager() {
        return new DataSourceTransactionManager(dataSource());
    }
 
    @Bean(name = "sqlSessionFactory")
    public SqlSessionFactory sqlSessionFactory(@Qualifier("dataSource") DataSource dataSource) throws Exception {
        final SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
        sessionFactory.setDataSource(dataSource);
 
        /*设置mapper文件位置*/
        sessionFactory.setMapperLocations(new PathMatchingResourcePatternResolver()
                .getResources("classpath:base/com/zhuoli/service/springboot/mybatis/config/repository/mapper/*.xml"));
 
        /*设置实体类映射规则: 下划线 -> 驼峰*/
        org.apache.ibatis.session.Configuration configuration = new org.apache.ibatis.session.Configuration();
        configuration.setMapUnderscoreToCamelCase(true);
        sessionFactory.setConfiguration(configuration);
        return sessionFactory.getObject();
    }
}
```

注意，要使用@Configuration注解标注，表明这个类是个配置类，相当于一个Spring配置的xml文件。@Bean注解在方法上，声明当前方法的返回值是一个Bean。

### 3.3 Spring Boot启动类通过@Import加载配置类

```java
@SpringBootApplication
@Import(DataSourceConfig.class)
public class SpringBootMybatisConfigApplicationContext {
    public static void main(String[] args) {
        SpringApplication.run(SpringBootMybatisConfigApplicationContext.class, args);
    }
}
```

## 4. xml配置

xml配置的方式，是通过自定义datasource Bean的方式实现数据源配置，一般都会结合性能较好的数据库连接池(Druid、Zebra……)定义数据源，并定义sqlSessionFactory、transactionManager Bean。如下展示，使用PooledDatasource进行配置：

### 4.1 application.properties文件定义数据源信息

```properties
##数据源配置
test.datasource.url=jdbc:mysql://115.47.149.48:3306/zhuoli_test?useUnicode=true&characterEncoding=UTF-8&zeroDateTimeBehavior=convertToNull&allowMultiQueries=true&useSSL=false
test.datasource.username=zhuoli
test.datasource.password=zhuoli
test.datasource.driverClassName=com.mysql.jdbc.Driver
```

### 4.2 repository-bean.xml定义数据源DataSource

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
 
    <!--datasource-->
    <bean id="commDataSource" class="org.apache.ibatis.datasource.pooled.PooledDataSource">
        <property name="url" value="${test.datasource.url}"/>
        <property name="username" value="${test.datasource.username}"/>
        <property name="password" value="${test.datasource.password}"/>
        <property name="driver" value="${test.datasource.driverClassName}"/>
    </bean>
 
    <bean id="commSqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean"
          name="commSqlSessionFactory">
        <property name="dataSource" ref="commDataSource" />
        <property name="mapperLocations" value="classpath:base/com/zhuoli/service/springboot/mybatis/config/repository/mapper/*.xml" />
        <!--<property name="configuration">
            <bean class="org.apache.ibatis.session.Configuration">
                <property name="mapUnderscoreToCamelCase" value="true"/>
            </bean>
        </property>-->
        <!--通过configLocation使用其他配置文件配置，但是configLocation与configuration不能共存-->
        <property name="configLocation" value="classpath:mybatis-config.xml" />
    </bean>
 
    <bean id="commTransactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="commDataSource"/>
    </bean>
</beans>
```

上述配置通过SqlSessionFactory Bean的configLocation property属性，指明了mybatis配置文件位置，通过mybatis-config.xml文件的配置构造SqlSessionFactory。其实也可以通过上述配置中注释的部分进行配置，效果是一样的。

### 4.3 mybatis-config.xml配置

```xml
<?xml version="1.0" encoding="UTF-8" ?>
        <!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
<settings>
    <setting name="logImpl" value="STDOUT_LOGGING"/>
    <setting name="mapUnderscoreToCamelCase" value="true"/>
</settings>
</configuration>
```

上述mybatis-config.xml配置了一个重要属性 mapUnderscoreToCamelCase，当该属性为true时，从数据库中查询到的数据映射到实体类，会把下划线映射成驼峰形式。如果在不设定resultMap的情况下，实体类又是驼峰定义的，这个属性是必设的，否则实体类所有的驼峰成员都将拿不到值。

### 4.4 Spring Boot启动类通过@ImportResource加载配置文件

```java
@SpringBootApplication
@ImportResource(locations = {"classpath:repository-bean.xml"})
public class SpringBootMybatisConfigApplicationContext {
    public static void main(String[] args) {
        SpringApplication.run(SpringBootMybatisConfigApplicationContext.class, args);
    }
}
```



## 5. 关于自动配置和手动配置的一个问题

在测试这个xml配置的时候，我最开始的配置文件长这个样子：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
 
    <!--datasource-->
    <bean id="commDataSource" class="org.apache.ibatis.datasource.pooled.PooledDataSource">
        <property name="url" value="${test.datasource.url}"/>
        <property name="username" value="${test.datasource.username}"/>
        <property name="password" value="${test.datasource.password}"/>
        <property name="driver" value="${test.datasource.driverClassName}"/>
    </bean>
 
    <bean id="commSqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean"
          name="commSqlSessionFactory">
        <property name="dataSource" ref="commDataSource" />
        <property name="mapperLocations" value="classpath:base/com/zhuoli/service/springboot/mybatis/config/repository/mapper/*.xml" />
    </bean>
 
    <bean id="commTransactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="commDataSource"/>
    </bean>
</beans>
```



跟我最终的配置的区别在于，SqlSessionFactoryBean没有配置configuration和configLocation property。我当时的想法是，Spring Boot应该能默认加载mybatis-config.xml文件的配置(驼峰设置)，这样我最终查询到的数据应该是没问题的。但是在测试时，却发现一个现象，实体类的驼峰成员变量值都为null，结果返回长这个样子：

```json
{
  "id": 5,
  "userName": null,
  "description": "Michael is a student",
  "isDeleted": null
}
```

很明显，Spring Boot并没有加载到mybatis-config.xml文件中的配置。后来我依次做了如下尝试：

- 是不是Spring Boot不知道mybatis-config.xml配置文件的位置，所以我在application.properties文件中又加了一行：

  ```
  mybatis.config-location=classpath:mybatis-config.xml
  ```

  结果，实体类的驼峰成员变量值依然都为null

- 在application.properties文件中新增配置，如下：

  ```
  mybatis.configuration.map-underscore-to-camel-case=true
  ```

  结果，实体类的驼峰成员变量值依然都为null

- 后来我想到，Spring Boot默认自动配置Mybatis的时候，肯定也初始化了一个默认的SqlSessionFactoryBean，假如不手动配置了，改用Spring Boot默认配置，情况会怎样
  所以我把repository-bean.xml配置文件的SqlSessionFactoryBean整个注释掉了，然后在application.properties文件中加了一行：

  ```
  mybatis.config-location=classpath:mybatis-config.xml
  ```

  


奇迹出现了，实体类的驼峰成员变量值正常拿到了，后来我做了各种组合情况测试，发现一个规律：当手动配置SqlSessionFactoryBean的时候，application.properties中mybatis的配置是不起作用的，也无法通过指定mybatis配置文件位置的方式，获取mybatis-config.xml配置文件中的配置

一度很纠结，在一通debug之后，发现了根源所在：

在使用Spring Boot默认配置时，会在MybatisAutoConfiguration类中定义一个SqlSessionFactory的Bean，该方法中调用了SqlSessionFactory的getObject方法，SqlSessionFactory实例在SqlSessionFactoryBean类中完成初始化，在初始化过程中会加载配置。将核心代码粘出，如下：

```java
/*1. MybatisAutoConfiguration定义SqlSessionFactory Bean*/
@Bean
@ConditionalOnMissingBean
public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
    SqlSessionFactoryBean factory = new SqlSessionFactoryBean();
    factory.setDataSource(dataSource);
    factory.setVfs(SpringBootVFS.class);
    /*加载application.properties文件mybatis.config-location属性*/
    if (StringUtils.hasText(this.properties.getConfigLocation())) {
        factory.setConfigLocation(this.resourceLoader.getResource(this.properties.getConfigLocation()));
    }
 
    /*加载application.properties文件mybatis.configuration.*属性*/
    org.apache.ibatis.session.Configuration configuration = this.properties.getConfiguration();
    if (configuration == null && !StringUtils.hasText(this.properties.getConfigLocation())) {
        configuration = new org.apache.ibatis.session.Configuration();
    }
 
	//省略……
 
    factory.setConfiguration(configuration);
    /*加载application.properties文件mybatis.configuration-properties.*属性*/
    if (this.properties.getConfigurationProperties() != null) {
        factory.setConfigurationProperties(this.properties.getConfigurationProperties());
    }
 
    //省略……
    return factory.getObject();
}
 
/*2. SqlSessionFactoryBean类getObject方法*/
public SqlSessionFactory getObject() throws Exception {
	/*3. sqlSessionFactory为null*/
    if (this.sqlSessionFactory == null) {
        this.afterPropertiesSet();
    }
 
    return this.sqlSessionFactory;
}
 
/*4. 调用buildSqlSessionFactory获取sqlSessionFactory*/
public void afterPropertiesSet() throws Exception {
    Assert.notNull(this.dataSource, "Property 'dataSource' is required");
    Assert.notNull(this.sqlSessionFactoryBuilder, "Property 'sqlSessionFactoryBuilder' is required");
    Assert.state(this.configuration == null && this.configLocation == null || this.configuration == null || this.configLocation == null, "Property 'configuration' and 'configLocation' can not specified with together");
    this.sqlSessionFactory = this.buildSqlSessionFactory();
}
 
protected SqlSessionFactory buildSqlSessionFactory() throws IOException {
    XMLConfigBuilder xmlConfigBuilder = null;
    Configuration configuration;
    /*从上述1的SqlSessionFactoryBean的configuration获取配置*/
    if (this.configuration != null) {
        configuration = this.configuration;
        if (configuration.getVariables() == null) {
            configuration.setVariables(this.configurationProperties);
        } else if (this.configurationProperties != null) {
            configuration.getVariables().putAll(this.configurationProperties);
        }
    } else if (this.configLocation != null) {
    	/*从上述1的SqlSessionFactoryBean的configLocation获取配置*/
        xmlConfigBuilder = new XMLConfigBuilder(this.configLocation.getInputStream(), (String)null, this.configurationProperties);
        configuration = xmlConfigBuilder.getConfiguration();
    } else {
    	/*configuration和configLocation都没配置，加载默认配置*/
        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("Property 'configuration' or 'configLocation' not specified, using default MyBatis Configuration");
        }
 
        configuration = new Configuration();
        if (this.configurationProperties != null) {
            configuration.setVariables(this.configurationProperties);
        }
    }
 
    //省略……
 
    if (xmlConfigBuilder != null) {
        try {
        	/*parse mybatis-config.xml配置文件*/
            xmlConfigBuilder.parse();
            if (LOGGER.isDebugEnabled()) {
                LOGGER.debug("Parsed configuration file: '" + this.configLocation + "'");
            }
        } catch (Exception var22) {
            throw new NestedIOException("Failed to parse config resource: " + this.configLocation, var22);
        } finally {
            ErrorContext.instance().reset();
        }
    }
 
    //省略……
 
    /*获取SqlSessionFactory实例*/
    return this.sqlSessionFactoryBuilder.build(configuration);
}
```

而在使用手动sqlSessionFactory配置时(在repository-bean.xml文件中配置SqlSessionFactory Bean)，Spring Boot是通过如下方式加载的：

```java
/*1. AbstractAutowireCapableBeanFactory */
protected BeanWrapper instantiateBean(String beanName, RootBeanDefinition mbd) {
    
    //省略……
    /*构造configuration*/
    beanInstance = this.getInstantiationStrategy().instantiate(mbd, beanName, this);
    //省略……  
}
 
/*2. SimpleInstantiationStrategy*/
public Object instantiate(RootBeanDefinition bd, @Nullable String beanName, BeanFactory owner) {
    
    //省略……
    return BeanUtils.instantiateClass(constructorToUse, new Object[0]);
    //省略……
}
 
/*3. BeanUtils*/
public static <T> T instantiateClass(Constructor<T> ctor, Object... args) throws BeanInstantiationException {
 
	//省略……
	//执行ctor.newInstance(args)构造configuration
    return KotlinDetector.isKotlinType(ctor.getDeclaringClass()) ? BeanUtils.KotlinDelegate.instantiateClass(ctor, args) : ctor.newInstance(args);
}
 
/*4. DelegatingConstructorAccessorImpl*/
public Object newInstance(Object[] var1) throws InstantiationException, IllegalArgumentException, InvocationTargetException {
    return this.delegate.newInstance(var1);
}
 
/*5. NativeConstructorAccessorImpl*/
public Object newInstance(Object[] var1) throws InstantiationException, IllegalArgumentException, InvocationTargetException {
    if (++this.numInvocations > ReflectionFactory.inflationThreshold() && !ReflectUtil.isVMAnonymousClass(this.c.getDeclaringClass())) {
        ConstructorAccessorImpl var2 = (ConstructorAccessorImpl)(new MethodAccessorGenerator()).generateConstructor(this.c.getDeclaringClass(), this.c.getParameterTypes(), this.c.getExceptionTypes(), this.c.getModifiers());
        this.parent.setDelegate(var2);
    }
 
    /*反射Configuration类的构造函数构造Configuration对象*/
    return newInstance0(this.c, var1);
}
 
/*6. Configuration 默认构造函数构造一个默认Configuration对象*/
public Configuration() {
    this.safeResultHandlerEnabled = true;
    this.multipleResultSetsEnabled = true;
    //省略……, 默认构造函数
}
 
/*7. AbstractAutowireCapableBeanFactory populateBean加载repository-bean.xml property属性，set第6步生成的configuration, mapUnderscoreToCamelCase属性就会在这一步set进去*/
public void setPropertyValues(PropertyValues pvs, boolean ignoreUnknown, boolean ignoreInvalid) throws BeansException {
    List<PropertyAccessException> propertyAccessExceptions = null;
    List<PropertyValue> propertyValues = pvs instanceof MutablePropertyValues ? ((MutablePropertyValues)pvs).getPropertyValueList() : Arrays.asList(pvs.getPropertyValues());
    Iterator var6 = propertyValues.iterator();
 
    while(var6.hasNext()) {
        PropertyValue pv = (PropertyValue)var6.next();
        //省略……
        this.setPropertyValue(pv);
        //省略……
    }
    //省略……
}
 
/*8. AbstractAutowireCapableBeanFactory构造SqlSessionFactoryBean*/
protected void invokeInitMethods(String beanName, Object bean, @Nullable RootBeanDefinition mbd) throws Throwable {
    //省略……
    ((InitializingBean)bean).afterPropertiesSet();
}
 
/*9. SqlSessionFactoryBean类*/
public void afterPropertiesSet() throws Exception {
    Assert.notNull(this.dataSource, "Property 'dataSource' is required");
    Assert.notNull(this.sqlSessionFactoryBuilder, "Property 'sqlSessionFactoryBuilder' is required");
    Assert.state(this.configuration == null && this.configLocation == null || this.configuration == null || this.configLocation == null, "Property 'configuration' and 'configLocation' can not specified with together");
    this.sqlSessionFactory = this.buildSqlSessionFactory();
}
 
protected SqlSessionFactory buildSqlSessionFactory() throws IOException {
XMLConfigBuilder xmlConfigBuilder = null;
Configuration configuration;
/*this.configuration为第6步构造的默认Configuration*/
if (this.configuration != null) {
    configuration = this.configuration;
    if (configuration.getVariables() == null) {
        configuration.setVariables(this.configurationProperties);
    } else if (this.configurationProperties != null) {
        configuration.getVariables().putAll(this.configurationProperties);
    }
} else if (this.configLocation != null) {
	/*repository-bean.xml文件的 configLocation property*/
    xmlConfigBuilder = new XMLConfigBuilder(this.configLocation.getInputStream(), (String)null, this.configurationProperties);
    configuration = xmlConfigBuilder.getConfiguration();
} else {
	/*configuration和configLocation都没配置，加载默认配置*/
    if (LOGGER.isDebugEnabled()) {
        LOGGER.debug("Property 'configuration' or 'configLocation' not specified, using default MyBatis Configuration");
    }
 
    configuration = new Configuration();
    if (this.configurationProperties != null) {
        configuration.setVariables(this.configurationProperties);
    }
}
 
/*10. 构造出repository-bean.xml文件的commSqlSessionFactory*/
```

从上述两段源码可以看出，当手动配置SqlSessionFactoryBean时，其实是不会加载application.properties文件中的配置的，只会加载repositroy-bean.xml文件中的property属性set Configuration的成员，并最终影响生成的SqlSessionFactoryBean。

所以，我们可以总结出如下：

1. 手动配置SqlSessionFactoryBean时，如果需要对mybatis进行设置，可以通过两种方式，一是通过mybatis-config.xml文件，并在repository-bean.xml文件中定义configLocation property。二是通过在repository-bean.xml文件中定义Configuration property。

2. 不手动配置SqlSessionFactoryBean时，application.properties文件中的mybatis配置是可以生效的。如果想使用额外的mybatis-config.xml配置文件，只需在application.properties文件中加入”mybatis.config-location=classpath:mybatis-config.xml“设置即可。


其实，在本篇文章的示例代码中，之所以这么看重mapUnderscoreToCamelCase属性设置，是因为我在UserMapper中没有设置resultMap(数据表列和Model成员的映射关系)，实际开发中其实会设置resultMap的，所以并不需要对mapUnderscoreToCamelCase进行特殊设置。特别在使用Mybatis Generator这种逆向工程插件，Model、Examp、Mapper、Mapper.xml都是插件自动生成的，可以满足绝大多数情况的使用，且不用手写sql，使用Mybatis默认配置就能很好的工作，我会在下一篇文章对Mybatis Generator进行介绍。

示例代码：码云 – 卓立 – Mybaits 数据源配置的三种方式