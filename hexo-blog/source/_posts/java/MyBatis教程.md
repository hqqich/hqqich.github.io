

# MyBatis教程（看这一篇就够了）入门到精通

# MyBatis

环境

* JDK1.8
* MySql8.0
* maven3.6
* IDEA

SSM框架：配置文件

官方文档：[mybatis.org/mybatis-3/z…](https://link.juejin.cn?target=https%3A%2F%2Fmybatis.org%2Fmybatis-3%2Fzh%2Fgetting-started.html "https://mybatis.org/mybatis-3/zh/getting-started.html")

官方文档：[https://mybatis.org/mybatis-3/zh_CN/java-api.html](https://mybatis.org/mybatis-3/zh_CN/java-api.html)

## 1、简介

### 1.1、什么是mybatis

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c5a25f99604468da60a4bbef75f1f4c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

* MyBatis 是一款优秀的持久层框架

* 它支持自定义 SQL、存储过程以及高级映射。

* MyBatis 免除了几乎所有的 JDBC 代码以及设置参数和获取结果集的工作。

* MyBatis 可以通过简单的 XML 或注解来配置和映射原始类型、接口和 Java POJO（Plain Old Java Objects，普通老式 Java 对象）为数据库中的记录。

* MyBatis本是apache的一个[开源项目](https://link.juejin.cn?target=https%3A%2F%2Fbaike.baidu.com%2Fitem%2F%25E5%25BC%2580%25E6%25BA%2590%25E9%25A1%25B9%25E7%259B%25AE%2F3406069%3FfromModule%3Dlemma_inlink "https://baike.baidu.com/item/%E5%BC%80%E6%BA%90%E9%A1%B9%E7%9B%AE/3406069?fromModule=lemma_inlink")iBatis，2010年这个项目由apache software foundation迁移到了\[google code\]([baike.baidu.com/item/google](https://link.juejin.cn?target=https%3A%2F%2Fbaike.baidu.com%2Fitem%2Fgoogle "https://baike.baidu.com/item/google") code/2346604?fromModule=lemma_inlink)，并且改名为MyBatis。2013年11月迁移到[Github](https://link.juejin.cn?target=https%3A%2F%2Fbaike.baidu.com%2Fitem%2FGithub%2F10145341%3FfromModule%3Dlemma_inlink "https://baike.baidu.com/item/Github/10145341?fromModule=lemma_inlink")。


**从哪使用mybatis**

* maven仓库

    ```xml
    <!-- https://mvnrepository.com/artifact/org.mybatis/mybatis -->
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.5.2</version>
    </dependency>

    ```

* GitHub：[github.com/mybatis/myb…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmybatis%2Fmybatis-3 "https://github.com/mybatis/mybatis-3")

* 中文文档：[mybatis.org/mybatis-3/z…](https://link.juejin.cn?target=https%3A%2F%2Fmybatis.org%2Fmybatis-3%2Fzh%2Findex.html "https://mybatis.org/mybatis-3/zh/index.html")


### 1.2、持久层

数据持久化

* 持久化就是将程序的数据在持久状态和瞬时状态转化的过程
* 内存：**断电即失**
* 数据库（jdbc）、io文件持久化

**为什么需要持久化**？

* 不能丢掉的对象
* 节约内存

### 1.3、持久层

定义：

* 完成持久化工作的代码块
* 层的界限十分明显

### 1.4、使用mybatis的原因

* 帮助程序员将数据存入到数据库中
* 方便
* jdbc过于复杂，简化框架。
* 实现自动化
* 不使用框架也能写网站，但是使用框架更容易上手
* 优点
    * 简单易学
    * 灵活
    * sql和代码的分离，提高代码的可维护性
    * 提供映射标签，支持对象关系组件维护
    * 提供xml标签，支持编写动态sql

## 2、第一个MyBatis程序

\==搭建环境----->导入MyBatis--->编写代码--->测试==

### 2.1、搭建环境

搭建数据库

```sql
CREATE DATABASE `mybatis`;
USE `mybatis`;
CREATE DATABASE `mybatis`;

CREATE TABLE `user`(
	`id` INT(20) NOT NULL,
	`name` VARCHAR(30) DEFAULT NULL,
	`pwd` VARCHAR(30) DEFAULT NULL,
	PRIMARY KEY(`id`)
)ENGINE=INNODB DEFAULT CHARSET=utf8;
INSERT INTO `user`(`id`,`name`,`pwd`) VALUES
(1,'狂神','123456'),
(2,'张三','abcdef'),
(3,'李四','987654');

```

新建项目

1.  新建一个普通的maven项目

2.  删除src目录

3.  导入maven依赖

    ```xml
        <dependencies>
    <!--        mysql驱动-->
            <dependency>
                <groupId>mysql</groupId>
                <artifactId>mysql-connector-java</artifactId>
                <version>8.0.28</version>
            </dependency>
    <!--        junit-->
            <dependency>
                <groupId>junit</groupId>
                <artifactId>junit</artifactId>
                <version>4.11</version>
                <scope>test</scope>
            </dependency>
    <!--        mybatis-->
            <dependency>
                <groupId>org.mybatis</groupId>
                <artifactId>mybatis</artifactId>
                <version>3.5.2</version>
            </dependency>
        </dependencies>

    ```


### 2.2、创建一个模块

* 创建mybatis的核心配置文件

    ```xml
    <?xml version="1.0" encoding="UTF-8" ?>
    <!DOCTYPE configuration
            PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
            "https://mybatis.org/dtd/mybatis-3-config.dtd">
    <!--configuration核心配置文件-->
    <configuration>
        <environments default="development">
            <environment id="development">
                <transactionManager type="JDBC"/>
                <dataSource type="POOLED">
                    <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                    <property name="url" value="jdbc:mysql://localhost:3306/mybatis?useSSL=true&amp;useUnicode=true&amp;characterEncoding=YTF-8"/>
                    <property name="username" value="root"/>
                    <property name="password" value="root"/>
                </dataSource>
            </environment>
        </environments>
    </configuration>

    ```

* 编写mybatis工具类

    ```java
    // SqlSessionFactory--> SqlSession
    public class MybatisUntils {
        private static SqlSessionFactory sqlSessionFactory;
        static {
            try {
                //获取 SqlSessionFactory对象
                String resource = "org/mybatis/example/mybatis-config.xml";
                InputStream inputStream = Resources.getResourceAsStream(resource);
                sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        //既然有了 SqlSessionFactory，顾名思义，我们可以从中获得 SqlSession 的实例。
        // SqlSession 提供了在数据库执行 SQL 命令所需的所有方法。
        public static SqlSession getSqlSession(){
            return sqlSessionFactory.openSession();
        }
    }

    ```


### 2.3、编写代码

* 实体类

    ```java
    public class User {
        private int id;
        private String name;
        private String pwd;

        public User() {
        }

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getPwd() {
            return pwd;
        }

        public void setPwd(String pwd) {
            this.pwd = pwd;
        }

        public User(int id, String name, String pwd) {
            this.id = id;
            this.name = name;
            this.pwd = pwd;
        }

        @Override
        public String toString() {
            return "User{" +
                    "id=" + id +
                    ", name='" + name + '\'' +
                    ", pwd='" + pwd + '\'' +
                    '}';
        }
    }

    ```

* Dao接口

    ```java
    public interface UserDao {
        List<User> getUserList();
    }

    ```

* 接口实现类 由原来的Impl实现类转换为一个Mapper配置文件

    ```xml
    <?xml version="1.0" encoding="UTF-8" ?>
    <!DOCTYPE mapper
            PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
            "https://mybatis.org/dtd/mybatis-3-mapper.dtd">
    <!--namespace绑定了一个对应的Dao/Mapper接口-->
    <mapper namespace="com.hwt.dao.UserDao">
    <!--    select查询-->
        <select id="getUserList" resultType="com.hwt.pojo.User">
            select * from mybatis.user
        </select>
    </mapper>

    ```


### 2.4、测试

常见报错：

1.  绑定异常：

```java
 org.apache.ibatis.binding.BindingException: Type interface com.hwt.dao.UserDao is not known to the MapperRegistry.

```

解决方法：

```xml
mybatis配置文件添加
<!--    每一个Mapper.xml都需要在MyBatis核心配置文件中注册-->
 <mappers>
     <mapper resource="com/hwt/dao/UserMapper.xml"/>
 </mappers>

```

2.  初始化异常

```java
java.lang.ExceptionInInitializerError
	at com.hwt.dao.UserDaoTest.test(UserDaoTest.java:15)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)

```

​ 解决方法：

```xml
pom文件添加：
<!--在build中配置resources，来防止资源导出失败的问题-->
    <build>
        <resources>
            <resource>
                <directory>src/main/java</directory>
                <includes>
                    <include>**/*.xml</include>
                    <include>**/*.properties</include>
                </includes>
                <filtering>false</filtering>
            </resource>

            <resource>
                <directory>src/main/resources</directory>
                <includes>
                    <include>**/*.xml</include>
                    <include>**/*.properties</include>
                </includes>
                <filtering>false</filtering>
            </resource>
        </resources>
    </build>

```

M**apperRegistry是什么？**

核心配置文件中注册Mappers

* junit测试

    ```java
    public class UserDaoTest {
        @Test
        public void test(){
            //第一步，获取SqlSession对象
            SqlSession sqlSession = MybatisUntils.getSqlSession();
            // 执行sql
            //方式一：getMapper
            UserDao userDao = sqlSession.getMapper(UserDao.class);
            List<User> userList = userDao.getUserList();

            for (User user : userList) {
                System.out.println(user);
            }
            //关闭sqlSession
            sqlSession.close();
        }
    }

    ```


排错思路：

1.  mybatis配置文件没有注册
2.  绑定接口错误
3.  方法名错误
4.  返回类型错误
5.  maven导出资源更新

#### SqlSession

每个线程都应该有它自己的 SqlSession 实例。SqlSession 的实例不是线程安全的，因此是不能被共享的，所以它的最佳的作用域是请求或方法作用域。 绝对不能将 SqlSession 实例的引用放在一个类的静态域，甚至一个类的实例变量也不行。 也绝不能将 SqlSession 实例的引用放在任何类型的托管作用域中，比如 Servlet 框架中的 HttpSession。 如果你现在正在使用一种 Web 框架，考虑将 SqlSession 放在一个和 HTTP 请求相似的作用域中。 换句话说，每次收到 HTTP 请求，就可以打开一个 SqlSession，返回一个响应后，就关闭它。 这个关闭操作很重要，为了确保每次都能执行关闭操作，你应该把这个关闭操作放到 finally 块中。 下面的示例就是一个确保 SqlSession 关闭的标准模式：

```java
try (SqlSession session = sqlSessionFactory.openSession()) {
  // 你的应用逻辑代码
}

```

## 3、Mybatis下的增删改

### 3.1、namespace

​ namespace中的包名需要和Dao/mapper接口的包名一致！

### 3.2、select

​ **\==选择、查询语句==**

* ​ id：对应的接口中的方法名
* ​ resultType： sql语句执行的返回值类型
* ​ parameterType：参数类型

1.  编写接口

    ```java
        //根据ID查询用户
        User getUserById(int id);

    ```

2.  编写mapper文件中的sql语句

    ```xml
     <select id="getUserById" resultType="com.hwt.pojo.User" parameterType="int">
            select * from mybatis.user where id = #{id}
    </select>

    ```

3.  编写测试类

    ```java
        @Test
        public void getUserById(){
            SqlSession sqlSession = MybatisUntils.getSqlSession();
            UserMapper mapper = sqlSession.getMapper(UserMapper.class);
            User user = mapper.getUserById(1);
            System.out.println(user);
            sqlSession.close();
        }

    ```


### 3.3、inster

```xml
<insert id="addUser" parameterType="com.hwt.pojo.User">
    insert into mybatis.user (id,name,pwd) values (#{id},#{name},#{pwd});
</insert>

```

### 3.4、update

```xml
<update id="updateUser" parameterType="com.hwt.pojo.User">
    update mybatis.user set name=#{name} ,pwd=#{pwd} where id=#{id};
</update>

```

### 3.5、delete

```xml
<delete id="deleterUser" parameterType="int">
    delete from mybatis.user where id=#{id};
</delete>

```

### 3.6、分析错误

1.  标签匹配错误
2.  resource绑定mapper，MyBatis核心配置文件中注册需要使用路径（不能使用 点）
3.  NuLLPointerException，没有找到注册资源

### 3.7、Map

如果实体类，或者数据库中的表，字段或者参数过多，使用Map

```xml
//插入用户
int addUser2(Map<String,Object> map);

```

```xml
<insert id="addUser2" parameterType="map">
    insert into mybatis.user (id,name,pwd) values (#{userid},#{username},#{password});
</insert>

```

```java
public void addUser2(){
    SqlSession sqlSession = MybatisUntils.getSqlSession();
    UserMapper mapper = sqlSession.getMapper(UserMapper.class);

    HashMap<String, Object> map = new HashMap<>();
    map.put("userid",5);
    map.put("username","hello");
    map.put("password","2222222");
    mapper.addUser2(map);
    sqlSession.commit();
    sqlSession.close();
}

```

* Map传递参数，直接在sql中取出key
* 对象传递参数，直接在SQL中去除对象的属性
* 一个参数，直接在sql中取到；多个参数时使用set

### 3.8、模糊查询注意：

mybatis中的#{value}和${value}的区别：

1.  #{value}将传入的数据都当成一个字符串，会对自动传入的数据加一个双引号。
2.  ${value}将传入的数据直接显示生成在sql中。
3.  #{value}方式能够很大程度防止sql注入。　
4.  ${value}方式无法防止Sql注入。
5.  ${value}方式一般用于传入数据库对象，例如传入表名.
6.  一般能用#{value}的就别用value.\[MyBatis)排序时使用orderby动态参数时需要注意，用{value}. \[MyBatis)排序时使用order by 动态参数时需要注意，用value.\[MyBatis)排序时使用orderby动态参数时需要注意，用{value}而不是#{value} 字符串替换 默认情况下，使用#{value}格式的语法会导致MyBatis创建预处理语句属性并以它为背景设置安全的值。这样做很安全，很迅速也是首选做法，有时你只是想直接在SQL语句中插入一个不改变的字符串。

\==**重要：**\==接受从用户输出的内容并提供给语句中不变的字符串，这样做是不安全的。这会导致潜在的SQL注入攻击，因此你不应该允许用户输入这些字段，或者通常自行转义并检查。

## 4、mybatis配置详情

### 4.1、核心配置

**mybatis-config.xml**（官方推荐命名）

MyBatis 的配置文件包含了会深深影响 MyBatis 行为的设置和属性信息。 配置文档的顶层结构如下：

> * configuration（配置）
> * properties（属性）
> * settings（设置）
> * typeAliases（类型别名）
> * typeHandlers（类型处理器）
> * objectFactory（对象工厂）
> * plugins（插件）
> * environments（环境配置）
>     * environment（环境变量）
>         * transactionManager（事务管理器）
>         * dataSource（数据源）
> * databaseIdProvider（数据库厂商标识）
> * mappers（映射器）

### 4.2、环境配置（environments）

* MyBatis 可以配置成适应多种环境
* **尽管可以配置多个环境，但每个 SqlSessionFactory 实例只能选择一种环境。**

配置多套环境

> mybatis’默认事务管理器（transactionManager）：JDBC
>
> 默认数据源dataSource：POOLED

### 4.3、属性（properties）

通过properties文件实现引用配置文件

这些属性可以在外部进行配置，并可以进行动态替换。你既可以在典型的 Java 属性文件中配置这些属性，也可以在 properties 元素的子元素中设置。（db.properties）

1.  编写配置文件

```properties
driver=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost:3306/mybatis?useSSL=true&amp;useUnicode=true&amp;characterEncoding=UTF-8
username=root
password=root

```

2.  在核心配置文件中引入

```xml
<!--    引入外部文件-->
    <properties resource="db.properties">
        <property name="username" value="root"/>
        <property name="pwd" value="root"/>
    </properties>

```

* 可以直接引入外部文件
* 可以在标签内增加一些属性配置
* 如果外部properties文件和标签有相同字段，会优先使用外部properties文件

### 4.4、类型别名（typeAliases）

* 类型别名是Java中的短名字

* 主要作用就是减少冗余，方便使用

    ```xml
    <!--给类起别名-->
        <typeAliases>
            <typeAlias type="com.hwt.pojo.User" alias="user"/>
        </typeAliases>

    ```


也可以只指定一个包名，mybatis会在包名下搜索需要的Java bean

扫描实体类的包，就是这个类的类名，但是首字母小写

```xml
<!--给类起别名-->
  <typeAliases>
      <typeAlias type="com.hwt.pojo.User"/>
  </typeAliases>

```

**当实体类较少的时候使用第一种，实体类多的时候使用第二种**

**第一种可以自定义命名，第二种需要借助实体类增加注解，而且需要mapper.xml文件有的所有实体类都需要改名**

```java
@Alias("user1")
public class User {
    private int id;
    private String name;
    private String pwd;

    public User() {
    }
}

```

\==常见的 Java 类型内建的类型别名。它们都是不区分大小写的==

| 别名  | 映射的类型 |
| :--- | :--- |
| \_byte | byte |
| \_char (since 3.5.10) | char |
| \_character (since 3.5.10) | char |
| \_long | long |
| \_short | short |
| \_int | int |
| \_integer | int |
| \_double | double |

### 4.5、设置（settings）

| 设置名 | 描述  | 有效值 | 默认值 |
| :--- | :--- | :--- | :--- |
| logImpl | 指定 MyBatis 所用日志的具体实现，未指定时将自动查找。 | SLF4J \| LOG4J（3.5.9 起废弃） \| LOG4J2 \| JDK_LOGGING \| COMMONS_LOGGING \| STDOUT_LOGGING \| NO_LOGGING | 未设置 |
| 设置名 | 描述  | 有效值 | 默认值 |
| cacheEnabled | 全局性地开启或关闭所有映射器配置文件中已配置的任何缓存。 | true \| false | true |
| lazyLoadingEnabled | 延迟加载的全局开关。当开启时，所有关联对象都会延迟加载。 特定关联关系中可通过设置 `fetchType` 属性来覆盖该项的开关状态。 | true \| false | false |

### 4.6、其他设置

* typeHandlers（类型处理器）
* objectFactory（对象工厂）
* plugins（插件）
    * mybatis-generator
    * mybatis-plus
    * 通用mapper

### 4.7、映射器（mappers）

定义 SQL 映射语句，相当于直接告诉 MyBatis 到哪里去找映射文件

方式一：

```xml
<!--    每一个Mapper.xml都需要在MyBatis核心配置文件中注册-->
<!-- 使用相对于类路径的资源引用 -->
    <mappers>
        <mapper resource="com/hwt/dao/UserMapper.xml"/>
    </mappers>

```

方式二：

```xml
<!-- 使用映射器接口实现类的完全限定类名 -->
<mappers>
  <mapper class="com/hwt/dao/UserMapper.xml"/>
</mappers>


```

方式三：

```xml
<!-- 将包内的映射器接口全部注册为映射器 -->
<mappers>
  <package name="com.hwt.dao"/>
</mappers>

```

> **方式二和三需要注意：**
>
> * 接口和Mapper配置文件必须同名
>
> * 接口和Mapper配置文件必须在同一个包下
>

### 4.8、生命周期和作用域

可能会导致严重的并发问题

> **执行流程：** ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73f9253f372743d89d7007c8e9a37caa~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> * 作用域和生命周期类别是至关重要的，因为错误的使用会导致非常严重的并发问题。

**SqlSessionFactoryBuilder：**

* 一旦创建了 SqlSessionFactory，就不再需要它了。
* 因此 SqlSessionFactoryBuilder 实例的最佳作用域是方法作用域（也就是局部方法变量）。

**SqlSessionFactory**：

* SqlSessionFactory 一旦被创建就应该在应用的运行期间一直存在，没有任何理由丢弃它或重新创建另一个实例。 使用 SqlSessionFactory 的最佳实践是在应用运行期间不要重复创建多次，多次重建 SqlSessionFactory 被视为一种代码“坏习惯”。因此 SqlSessionFactory 的最佳作用域是应用作用域。

* 有很多方法可以做到，最简单的就是使用**单例模式**或者**静态单例模式**，保证全局只有一份变量。

* 说白了SqlSessionFactory可以看做一个连接池。


**SqlSession：**

* 每个线程都应该有它自己的 SqlSession 实例。SqlSession 的实例不是线程安全的，因此是不能被共享的，所以它的最佳的作用域是请求或方法作用域。 绝对不能将 SqlSession 实例的引用放在一个类的静态域，甚至一个类的实例变量也不行。
* 用完之后必须关闭，否则会导致资源占用

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/47fc3a0296524d8b81260dbc18867aa7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

每一个Mapper都是为了一个具体的业务

## 5、解决属性名和字段名不一样的问题

测试实体类字段不一致的情况

### 5.1、出现的问题

属性名：

```java
@Alias("user1")
public class User {
    private int id;
    private String name;
    private String password;

    public User() {
    }
}

```

字段： ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab340ddac68b481c93182edde857ac22~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

出现的问题：

```java
 User{id=1, name='老六', password='null'}

```

```sql
select * from mybatis.user where id = #{id}
#类型转换器
select id,name,pwd from mybatis.user where id = #{id}

```

解决方法：

* 起别名

```sql
select id,name,pwd as password from mybatis.user where id = #{id}

```

### 5.2、resultMap

结果集映射

```#
id	name	pwd
id	name	password

```

```xml
    <!--    结果集映射-->
    <resultMap id="UserMap" type="user">
<!--        colum数据库中的字段，property实体类中的属性-->
        <result column="id" property="id"/>
        <result column="name" property="name"/>
        <result column="pwd" property="password"/>
    </resultMap>
    <select id="getUserById" resultMap="UserMap" >
        select id,name,pwd from mybatis.user where id = #{id}
    </select>

```

* `resultMap` 元素是 MyBatis 中最重要最强大的元素
* ResultMap 的设计思想是，对简单的语句做到零配置，对于复杂一点的语句，只需要描述语句之间的关系就行了。
* ResultMap的优秀之处在于，完全可以不用显式地配置他们。
* 显式使用外部的 `resultMap` 会怎样，这也是解决列名不匹配的另外一种方式。

## 6、日志

### 6.1、日志工厂

| 设置名 | 描述  | 有效值 | 默认值 |
| --- | --- | :--- | --- |
| logImpl | 指定 MyBatis 所用日志的具体实现，未指定时将自动查找。 | SLF4J \| LOG4J（3.5.9 起废弃） \| LOG4J2 \| JDK_LOGGING \| COMMONS_LOGGING \| STDOUT_LOGGING \| NO_LOGGING | 未设置 |

* LF4J
* LOG4J（掌握）
* LOG4J2
* JDK_LOGGING
* COMMONS_LOGGING
* STDOUT_LOGGING （掌握）
* NO_LOGGING

在Mybaits中具体使用那个日志实现，在设置中设定

STDOUT_LOGGING 标准日志输出

**在mybatis-config.xml中配置STDOUT_LOGGING 日志：**

```xml
<settings>
    <setting name="logImpl" value="STDOUT_LOGGING"/>
</settings>

```

### 6.2、LOG4J

什么是LOG4J？

* Log4j是[Apache](https://link.juejin.cn?target=https%3A%2F%2Fbaike.baidu.com%2Fitem%2FApache%2F8512995%3FfromModule%3Dlemma_inlink "https://baike.baidu.com/item/Apache/8512995?fromModule=lemma_inlink")的一个[开源项目](https://link.juejin.cn?target=https%3A%2F%2Fbaike.baidu.com%2Fitem%2F%25E5%25BC%2580%25E6%25BA%2590%25E9%25A1%25B9%25E7%259B%25AE%2F3406069%3FfromModule%3Dlemma_inlink "https://baike.baidu.com/item/%E5%BC%80%E6%BA%90%E9%A1%B9%E7%9B%AE/3406069?fromModule=lemma_inlink")，通过使用Log4j，我们可以控制日志信息输送的目的地是[控制台](https://link.juejin.cn?target=https%3A%2F%2Fbaike.baidu.com%2Fitem%2F%25E6%258E%25A7%25E5%2588%25B6%25E5%258F%25B0%2F2438626%3FfromModule%3Dlemma_inlink "https://baike.baidu.com/item/%E6%8E%A7%E5%88%B6%E5%8F%B0/2438626?fromModule=lemma_inlink")、文件、GUI组件，甚至是[套接口](https://link.juejin.cn?target=https%3A%2F%2Fbaike.baidu.com%2Fitem%2F%25E5%25A5%2597%25E6%258E%25A5%25E5%258F%25A3%2F10058888%3FfromModule%3Dlemma_inlink "https://baike.baidu.com/item/%E5%A5%97%E6%8E%A5%E5%8F%A3/10058888?fromModule=lemma_inlink")服务器、NT的事件记录器、[UNIX](https://link.juejin.cn?target=https%3A%2F%2Fbaike.baidu.com%2Fitem%2FUNIX%3FfromModule%3Dlemma_inlink "https://baike.baidu.com/item/UNIX?fromModule=lemma_inlink") [Syslog](https://link.juejin.cn?target=https%3A%2F%2Fbaike.baidu.com%2Fitem%2FSyslog%3FfromModule%3Dlemma_inlink "https://baike.baidu.com/item/Syslog?fromModule=lemma_inlink")[守护进程](https://link.juejin.cn?target=https%3A%2F%2Fbaike.baidu.com%2Fitem%2F%25E5%25AE%2588%25E6%258A%25A4%25E8%25BF%259B%25E7%25A8%258B%2F966835%3FfromModule%3Dlemma_inlink "https://baike.baidu.com/item/%E5%AE%88%E6%8A%A4%E8%BF%9B%E7%A8%8B/966835?fromModule=lemma_inlink")等
* 我们也可以控制每一条日志的输出格式
* 可以通过一个配置文来灵活地进行配置，而不需要修改应用的代码。

1.  导入lo4g包

    ```xml
    <dependency>
        <groupId>log4j</groupId>
        <artifactId>log4j</artifactId>
        <version>1.2.17</version>
    </dependency>

    ```

2.  log4j.properties

    ```properties
    #将等级为DEBUG的日志信息输出到console和file这两个目的地，console和file的定义在下面的代码
    log4j.rootLogger=DEBUG,console,file

    #控制台输出的相关设置
    log4j.appender.console = org.apache.log4j.ConsoleAppender
    log4j.appender.console.Target = System.out
    log4j.appender.console.Threshold=DEBUG
    log4j.appender.console.layout = org.apache.log4j.PatternLayout
    log4j.appender.console.layout.ConversionPattern=[%c]-%m%n

    # 文件输出的相关设置
    log4j.appender.file = org.apache.log4j.RollingFileAppender
    log4j.appender.file.File=./log/kuang.log
    log4j.appender.file.MaxFileSize=10mb
    log4j.appender.file.Threshold=DEBUG
    log4j.appender.file.layout=org.apache.log4j.PatternLayout
    log4j.appender.file.layout.ConversionPattern=[%p][%d{yy-MM-dd}][%c]%m%n

    # 日志输出级别
    log4j.logger.org.mybatis=DEBUG
    log4j.logger.java.sql=DEBUG
    log4j.logger.java.sql.Statement=DEBUG
    log4j.logger.java.sql.ResultSet=DEBUG
    log4j.logger.java.sql.PreparedStatement=DEBUG

    ```

3.  配置lo4g日志的实现

    ```xml
        <settings>
            <setting name="logImpl" value="LOG4J"/>
        </settings>

    ```

4.  lo4g测试

    ![\[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-sqSi8n8p-1676813599903)(./typora-user-images/image-20230218011812978.png)\]](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44049914095e48bda3529773348c225e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)


**使用：**

1.  在要使用Log4j的类中，导入包import org.apache.log4j.Logger;

2.  日志对象，加载参数为当前类的class

    ```java
    static Logger logger = Logger.getLogger(UserDaoTest.class);

    ```

3.  日志级别

    ```java
    logger.info("info:进入了testLo4g");
    logger.debug("DEBUG:进入了testLo4g");
    logger.error("error:进入了testLo4g");

    ```


## 7、分页

分页的作用：

* 较少数据的处理

```sql
-- SQL语法：select * from user limit startIndex,paheSize
select * from user limit 2,2;#第二个开始的两个

```

### 7.1、使用Limit分页

**使用MyBatis实现分页，核心SQL**

1.  接口

    ```java
    //分页查询xxxxxxxxxx2 1////分页查询2List<User> getUserByLimit(Map<String,Integer> map);

    ```

2.  接口实现文件Mapper.xml

    ```xml
    <select id="getUserByLimit" resultType="user" parameterType="map">
        select * from user limit #{startIndex},#{pageSize}
    </select>

    ```

3.  测试

    ```java
    public void getUserByLimit(){
        SqlSession sqlSession = MybatisUntils.getSqlSession();
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);

        HashMap<String, Integer> map = new HashMap<>();
        map.put("startIndex",1);
        map.put("pageSize",2);
        List<User> list = mapper.getUserByLimit(map);
        for (User user : list) {
            System.out.println(user.toString());
        }

        sqlSession.close();
    }

    ```

    ```log
    输出的日志显示密码为空

    [com.hwt.dao.UserMapper.getUserByLimit]-==>  Preparing: select * from user limit ?,?
    [com.hwt.dao.UserMapper.getUserByLimit]-==> Parameters: 1(Integer), 2(Integer)
    [com.hwt.dao.UserMapper.getUserByLimit]-<==      Total: 2
    User{id=2, name='李四', password='null'}
    User{id=3, name='张三', password='null'}

    ```

4.  解决方案：使用resultMap设置UserMap为返回值类型

    ```xml

    <!--    结果集映射-->
        <resultMap id="UserMap" type="user">
    <!--        colum数据库中的字段，property实体类中的属性-->
            <result column="id" property="id"/>
            <result column="name" property="name"/>
            <result column="pwd" property="password"/>
        </resultMap>

        <select id="getUserByLimit" resultMap="UserMap" parameterType="map">
            select * from user limit #{startIndex},#{pageSize}
        </select>


    ```


### 7.2、RowBounds分页

**使用java自带的RowBounds类实现分页**

**sql不需要使用分页**

1.  接口

    ```java
    //使用RowBounds实现分页
    List<User> getRowBounds();

    ```

2.  mapper.xml

    ```xml
    <select id="getRowBounds" resultMap="UserMap">
        select * from user;
    </select>

    ```

3.  测试

    ```java
    public void getRowBounds(){
        //RowBounds实现
        RowBounds rowBounds = new RowBounds(0, 2);

        SqlSession sqlSession = MybatisUntils.getSqlSession();
        List<User> userList = sqlSession.selectList("com.hwt.dao.UserMapper.getRowBounds",null,rowBounds);
        for (User user : userList) {
            System.out.println(user);
        }
        sqlSession.close();
    }

    ```


### 7.3、分页插件

[MyBatis 分页插件 PageHelper](https://link.juejin.cn?target=https%3A%2F%2Fpagehelper.github.io%2F "https://pagehelper.github.io/")

## 8、使用注解开发

### 8.1、面向接口编程

* 大家之前都学过面向对象编程，也学习过接口，但在真正的开发中，很多时候我们会选择面向接口编程
* \*\*根本原因：==解耦==，可拓展，提高复用，分层开发中，上层不用管具体的实现，大家都遵守共同的标准，使得开发变得容易，规范性更好
* 在一个面向对象的系统中，系统的各种功能是由许许多多的不同对象协作完成的。在这种情况下，各个对象内部是如何实现自己的，对系统设计人员来讲就不那么重要了；
* 而各个对象之间的协作关系则成为系统设计的关键。小到不同类之间的通信，大到各模块之间的交互，在系统设计之初都是要着重考虑的，这也是系统设计的主要工作内容。面向接口编程就是指按照这种思想来编程。

**关于接口的理解**

* 从更深层次的理解，应是定义（规范，约束）与实现（名实分离的原则）的分离。

* 接口的本身反映了系统设计人员对系统的抽象理解。


**接口应有两类：**

* 第一类是对一个个体的抽象，它可对应为一个抽象体(abstract class);

* 第二类是对一个个体某一方面的抽象，即形成一个抽象面(interface);

* 一个体有可能有多个抽象面。抽象体与抽象面是有区别的。


**三个面向区别：**

* 面向对象是指，我们考虑问题时，以对象为单位，考虑它的属性及方法.
* 面向过程是指，我们考虑问题时，以一个具体的流程（事务过程）为单位，考虑它的实现
* 接口设计与非接口设计是针对复用技术而言的，与面向对象（过程）不是一个问题更多的体现就是对系统整体的架构

### 8.2、使用注解开发

1.  接口

    ```java
    public interface UserMapper {

        @Select("select * from user")
        List<User> getUsers();
    }

    ```

2.  注册 mapper-config.xml文件中注册

    ```xml
    <mappers>
        <mapper class="com.hwt.dao.UserMapper"/>
    </mappers>

    ```

3.  测试

    ```java
    public class UserMapperTest {
        @Test
        public void getUsers(){
            SqlSession sqlSession = MybatisUntils.getSqlSession();
            UserMapper mapper = sqlSession.getMapper(UserMapper.class);
            List<User> userList = mapper.getUsers();
            for (User user : userList) {
                System.out.println(user);
            }
            sqlSession.close();
        }
    }

    ```


实现的本质是反射机制

\*\*动态代理： \*\*[Java动态代理设计模式 - 大数据技术派 - 博客园 (cnblogs.com)](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fdata-magnifier%2Fp%2F14083193.html "https://www.cnblogs.com/data-magnifier/p/14083193.html")

![image-20220316191046917](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a09f5216507f40c99b52e91fac6ef29e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**mybatis执行过程**

1.  Resource获取全局配置文件
2.  实例化SqlsessionFactoryBuilder
3.  解析配置文件流XMLCondigBuilder
4.  Configration所有的配置信息
5.  SqlSessionFactory实例化
6.  trasactional事务管理
7.  创建executor执行器
8.  创建SqlSession
9.  实现CRUD
10. 查看是否执行成功
11. 提交事务
12. 关闭

![image-20220316192533168](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80260296169f42f1aeefe3de631df85b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) ![image-20220316192617568](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/accb0d428e84428e8fb8b933331a99ca~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)![image-20220316192634662](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d4e51d3e7eb4c3ba0d1420e3c10feb5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)![image-20220316192649920](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bafa032786a54e8e88b50fdfc70dfc64~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 8.3、CRUD

在工具类创建的时候实现自动提交事务

```java
public static SqlSession getSqlSession(){
    return sqlSessionFactory.openSession(true);
}

```

1.  绑定接口注册

    ```xml
    <mappers>
        <mapper class="com.hwt.dao.UserMapper"/>
    </mappers>

    ```

2.  编写接口，增加注解

    ```java
    public interface UserMapper {

        @Select("select * from user")
        List<User> getUsers();

        //方法存在多个参数，所有的参数前面必须加上@Param("id")注解,sql中用的是注解中的id
        @Select("select * from user where id=#{id}")
        User getUsersById(@Param("id") int id);

        @Insert("insert into user(id,name,pwd) values (#{id},#{name},#{password})")
        int addUser(User user);

        @Update("update user set name=#{name},pwd=#{password} where id=#{id}")
        int uptateUser(User user);

        @Delete("delete from user where id=#{id}")
        int deleteUser(@Param("id") int id);
    }

    ```

3.  测试类

    ```java
    public class UserMapperTest {

        @Test
        public void getUsers(){
            SqlSession sqlSession = MybatisUntils.getSqlSession();
            UserMapper mapper = sqlSession.getMapper(UserMapper.class);
            List<User> userList = mapper.getUsers();
            for (User user : userList) {
                System.out.println(user);
            }
            sqlSession.close();
        }
        @Test
        public void getUsersById(){
            SqlSession sqlSession = MybatisUntils.getSqlSession();
            UserMapper mapper = sqlSession.getMapper(UserMapper.class);
            User user = mapper.getUsersById(2);
            System.out.println(user);
            sqlSession.close();
        }

        @Test
        public void addUser(){
            SqlSession sqlSession = MybatisUntils.getSqlSession();
            UserMapper mapper = sqlSession.getMapper(UserMapper.class);
            int i = mapper.addUser(new User(6, "高启强", "66666"));
            sqlSession.close();
        }

        @Test
        public void uptateUser(){
            SqlSession sqlSession = MybatisUntils.getSqlSession();
            UserMapper mapper = sqlSession.getMapper(UserMapper.class);
            int i = mapper.uptateUser(new User(5, "高启盛", "111111"));
            sqlSession.close();
        }

        @Test
        public void deleteUser(){
            SqlSession sqlSession = MybatisUntils.getSqlSession();
            UserMapper mapper = sqlSession.getMapper(UserMapper.class);
            int i = mapper.deleteUser(4);
            sqlSession.close();
        }
    }

    ```


### 8.4、关于@Param0注解

* 基本类型的参数或者String类型，需要加上
* 引用类型不需要加
* 如果只有一个基本类型的话，可以忽略，但是建议加上！
* 我们在SQL中引用的就是@Param()中设定的属性名！

## 9、Lombok

​ Lombok项目是一个java库，它可以自动插入到编辑器和构建工具中，增强java的性能。不需要再写getter、setter或equals方法，只要有一个[注解](https://link.juejin.cn?target=https%3A%2F%2Fbaike.baidu.com%2Fitem%2F%25E6%25B3%25A8%25E8%25A7%25A3%2F22344968%3FfromModule%3Dlemma_inlink "https://baike.baidu.com/item/%E6%B3%A8%E8%A7%A3/22344968?fromModule=lemma_inlink")，你的类就有一个功能齐全的构建器、自动记录变量等等。

**Lombok注解：**

```java
@Getter and @Setter
@FieldNameConstants
@ToString
@EqualsAndHashCode
@AllArgsConstructor, @RequiredArgsConstructor and @NoArgsConstructor
@Log, @Log4j, @Log4j2, @Slf4j, @XSlf4j, @CommonsLog, @JBossLog, @Flogger, @CustomLog
@Data
@Builder
@SuperBuilder
@Singular
@Delegate
@Value
@Accessors
@Wither
@With
@SneakyThrows

```

\==**@Data：**\==无参构造，get，set，tostring，hashcode，equals

**使用步骤：**

1.  在IDEA中安装Lombok插件！

    高版本idea安装Lombok：[blog.csdn.net/weixin_4491…](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fweixin_44917577%2Farticle%2Fdetails%2F118937025 "https://blog.csdn.net/weixin_44917577/article/details/118937025")

2.  在项目中导入Lombok的包

    ```xml
    <!--        lombok-->
            <!-- https://mvnrepository.com/artifact/org.projectlombok/lombok -->
            <dependency>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>1.18.26</version>
            </dependency>

    ```

3.  实体类添加注解

    ```java
    @Data
    @AllArgsConstructor//有参构造
    @NoArgsConstructor//无参构造
    public class User {
        private int id;
        private String name;
        private String password;
    }

    ```


## 10、多对一处理

多对一：

* 多个学生对应一个老师
* 对于学生而言，**关联**···多个学生关联一个老师【多对一】
* 对于老师而言，**集合**···一个老师有很多学生【一对多】

需要用到的数据库

```sql
CREATE TABLE `teacher` (
  `id` INT(10) NOT NULL,
  `name` VARCHAR(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;

INSERT INTO teacher(`id`, `name`) VALUES (1, '秦老师');

CREATE TABLE `student` (
  `id` INT(10) NOT NULL,
  `name` VARCHAR(30) DEFAULT NULL,
  `tid` INT(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fktid` (`tid`),
  CONSTRAINT `fktid` FOREIGN KEY (`tid`) REFERENCES `teacher` (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;
INSERT INTO `student` (`id`, `name`, `tid`) VALUES (1, '小明', 1);
INSERT INTO `student` (`id`, `name`, `tid`) VALUES (2, '小红', 1);
INSERT INTO `student` (`id`, `name`, `tid`) VALUES (3, '小张', 1);
INSERT INTO `student` (`id`, `name`, `tid`) VALUES (4, '小李', 1);
INSERT INTO `student` (`id`, `name`, `tid`) VALUES (5, '小王', 1);

```

### 10.1、测试环境搭建

1.  在pom.xml文件中导入Lombok

    ```xml
    <dependencies>
        <!--        lombok-->
        <!-- https://mvnrepository.com/artifact/org.projectlombok/lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.26</version>
        </dependency>
    </dependencies>

    ```

2.  在pojo包下新建实体类eacher,Student

    ```java
    @Data
    public class Teacher {
        private int id;
        private String name;
    }

    ```

    ```java
    @Data
    public class Student {
        private int id;
        private String name;
        //学生需要关联一个老师
        private Teacher teacher;
    }

    ```

3.  建立Mappe接口

    ```java
    public interface StudentMapper {

    }

    ```

    ```java
    public interface TeacherMapper {
        @Select("select *from teacher where id=#{tid}")
        Teacher getTeacher(@Param("tid") int id);
    }

    ```

4.  在resource目录新建与java目录相同的dao包目录并且建立Mapper.xml文件


![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5dc690fd2dd7409cbf7cc0e28b4263eb~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
     PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
     "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!--核心配置文件-->
<mapper namespace="com.hwt.dao.TeacherMapper">

</mapper>

```

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
     PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
     "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!--核心配置文件-->
<mapper namespace="com.hwt.dao.StudentMapper">

</mapper>

```

5.  在核心配置文件中绑定注册我们的Mapper接口或者文件

    ```xml
    <!--绑定接口-->
    <mappers>
        <mapper class="com.hwt.dao.StudentMapper"/>
        <mapper class="com.hwt.dao.TeacherMapper"/>
    </mappers>

    ```

6.  测试

    ```java
    public class MybatisTest {
        public static void main(String[] args) {
            SqlSession sqlSession = MybatisUntils.getSqlSession();
            TeacherMapper mapper = sqlSession.getMapper(TeacherMapper.class);
            Teacher teacher = mapper.getTeacher(1);
            System.out.println(teacher);

            sqlSession.close();
        }
    }

    ```


### 10.2、按照查询嵌套处理

```sql
select s.id,s.name,t.name from student s,teacher t where s.tid=t.id

```

```xml
<!--
    思路：
    1. 查询搜有的学生信息
    2. 根据查询出来的学生的tid，寻找对应的老师    子查询
    -->
    <select id="getStudent" resultMap="StudentTeacher">
        select * from student;
    </select>
        <resultMap id="StudentTeacher" type="student">
            <result property="id" column="id"/>
            <result property="name" column="name"/>
                <!--复杂的属性，需要单独处理   对象：association 集合：collection -->
            <association property="teacher" column="tid" javaType="student" select="getTeacher"/>
        </resultMap>
    <select id="getTeacher" resultType="teacher">
        select * from teacher where id = #{tid}
    </select>

```

resultType后面的类型报错就先给该类起别名

### 10.3、按照结果嵌套处理

```xml
<!--    按照结果嵌套处理-->
    <select id="getStudent2" resultMap="StudentTeacher2">
        select s.id sid,s.name sname,t.name tname
        from student s,teacher t where s.tid=t.id
    </select>
    <resultMap id="StudentTeacher2" type="Student">
        <result property="id" column="sid"/>
        <result property="name" column="sname"/>
        <association property="teacher" javaType="Teacher">
            <result property="name" column="tname"/>
        </association>
    </resultMap>

```

## 11、一对多处理

**环境搭建：**

实体类：

```java
@Alias("teacher")
@Data
public class Teacher {
    private int id;
    private String name;
    //一个老师拥有多个学生
    private List<Student> students;
}

```

```java
@Alias("student")
@Data
public class Student {
    private int id;
    private String name;
    //学生需要关联一个老师
    private int tid;
}

```

### 11.1、按照结果嵌套处理：

```xml
<!--按结果嵌套查询-->
<select id="getTeacher" resultMap="TeacherStudent">
    select  s.id sid,s.name sname,t.name tname,t.id tid
    from mybatis.student s,mybatis.teacher t
    where s.tid=t.id and t.id=#{tid}
</select>
<resultMap id="TeacherStudent" type="Teacher">
    <result property="id" column="tid"/>
    <result property="name" column="tname"/>
    <!--复杂的属性我们需要单独处理-->
    <!--对象:association-->
    <!-- 集合：collection -->
    <!--        javaType=""指定属性的类型 集合中的泛型信息，我们使用ofType获取-->
    <collection property="students" ofType="Student">
        <result property="id" column="sid"/>
        <result property="name" column="sname"/>
        <result property="tid" column="tid"/>
    </collection>
</resultMap>

```

### 11.2、按照查询嵌套处理：

```xml
<!--子查询-->
    <select id="getTeacher2" resultMap="TeacherStudent2">
        select * from teacher where id = #{tid}
    </select>

    <resultMap id="TeacherStudent2" type="teacher">
        <collection property="students" javaType="ArrayList" ofType="student" select="TeacherStudentByTeacherId" column="id"/>
    </resultMap>

    <select id="TeacherStudentByTeacherId" resultType="student">
        select * from student where tid = #{tid}
    </select>

```

### 11.3、小结

1.  关联-association 【多对一】

2.  集合-collection 【一对多】

3.  javaType & ofType

    * javaType用来指定实体类中属性的类型

    * ofType用来指定映射到List或者集合中的pojo类型，泛型中的约束类型


`注意点：`

* 保证SQL的可读性，尽量保证通俗易懂
* 注意一对多和多对一中，属性名和字段的问题
* 如果问题不好排查错误，可以使用日志，建议使用log4j

\==面试重点==

* MySql引擎
* InnoDB底层原理
* 索引
* 索引优化

## 12、动态SQL

\==**什么是动态SQL：动态SQL就是根据不同的条件生成不同的SQL语句**\==

```sql
动态 SQL 元素和 JSTL或任何基于类 XML 语言的文本处理器相似。在 MyBatis 之前的版本中，需要花时间了解大量的元素。借助功能强大的基于 OGNL 的表达式，MyBatis 3 替换了之前的大部分元素，大大精简了元素种类，现在要学习的元素种类比原来的一半还要少。

 - if
 - choose (when, otherwise)
 - trim (where, set)
 - foreach

```

搭建环境

```sql
CREATE TABLE `blog`(
`id` VARCHAR(50) NOT NULL COMMENT '博客id',
`title` VARCHAR(100) NOT NULL COMMENT '博客标题',
`author` VARCHAR(30) NOT NULL COMMENT '博客作者',
`create_time` DATETIME NOT NULL COMMENT '创建时间',
`views` INT(30) NOT NULL COMMENT '浏览量'
)ENGINE=INNODB DEFAULT CHARSET=utf8;

```

创建一个基础工程

1.  导包

2.  编写配置文件

3.  编写实体类

    ```java
    @Alias("blog")
    @Data
    public class Blog {
        private int id;
        private String title;
        private String author;
        private Date createTime;
        private  int views;
    }

    ```

4.  编写实体类对应的Mapper接口和Mapper.xml文件并且插入实验数据

    ```java
    public interface BlogMapper {
        //插入数据
        int addBlog(Blog blog);
    }

    ```

    ```xml
    <?xml version="1.0" encoding="UTF-8" ?>
    <!DOCTYPE mapper
            PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
            "https://mybatis.org/dtd/mybatis-3-mapper.dtd">
    <mapper namespace="com.hwt.dao.BlogMapper">

        <insert id="addBlog">
            insert into blog (id, title, author, create_time, views)
            VALUE (#{id},#{title},#{author},#{createTime},#{views});
        </insert>
    </mapper>

    ```

5.  插入实验数据：

    ```java
    public class ITest {
        @Test
        public void addBlog(){
            SqlSession sqlSession = MybatisUntils.getSqlSession();
            BlogMapper mapper = sqlSession.getMapper(BlogMapper.class);
            Blog blog = new Blog();
            blog.setId(IdUtils.getId());
            blog.setTitle("保证SQL的可读性，尽量保证通俗易懂");
            blog.setAuthor("高启强");
            blog.setCreateTime(new Date());
            blog.setViews(6666);
            mapper.addBlog(blog);

            blog.setId(IdUtils.getId());
            blog.setTitle("注意一对多和多对一中，属性名和字段的问题");
            blog.setAuthor("高启盛");
            mapper.addBlog(blog);

            blog.setId(IdUtils.getId());
            blog.setTitle("如果问题不好排查错误，可以使用日志，建议使用log4j");
            blog.setAuthor("麻子");
            mapper.addBlog(blog);

            sqlSession.close();
        }
    }

    ```


### 12.1、IF

1.  接口

    ```java
    //查询博客
    List<Blog> queryBlogIf(Map map);

    ```

2.  XML

    ```xml
    <select id="queryBlogIf" parameterType="map" resultType="blog">
        select * from blog where 1=1
        <if test="title != null">
            and title = #{title}
        </if>
        <if test="author != null">
            and author = #{author}
        </if>
    </select>

    ```

3.  测试

    ```java
    @Test
    public void queryBlogIf(){
        SqlSession sqlSession = MybatisUntils.getSqlSession();
        BlogMapper mapper = sqlSession.getMapper(BlogMapper.class);
        HashMap map = new HashMap();
        map.put("title","保证SQL的可读性，尽量保证通俗易懂");
        map.put("author","高启强");
        List<Blog> blogs = mapper.queryBlogIf(map);
        for (Blog blog : blogs) {
            System.out.println(blog);
        }
        sqlSession.close();
    }

    ```


### 12.2、choose、when、otherwise

\*\*choose：\*\*不想使用所有的条件，而只是想从多个条件中选择一个使用。针对这种情况，MyBatis 提供了 choose 元素，它有点像 Java 中的 switch 语句。

```xml
<select id="queryBlogChoose" resultType="Blog" parameterType="map">
    select * from blog
    <where>
        <choose>
            <when test="title != null">
                title = #{title}
            </when>
            <otherwise>
                and views = #{views}
            </otherwise>
        </choose>
    </where>
</select>

```

### 12.3、trim、where、set

\*\*where：\*\*where 元素只会在子元素返回任何内容的情况下才插入 “WHERE” 子句。而且，若子句的开头为 “AND” 或 “OR”，_where_ 元素也会将它们去除

```xml
<select id="queryBlogIf" parameterType="map" resultType="blog">
    select * from blog
    <where>
        <if test="title != null">
            title = #{title}
        </if>
        <if test="author != null">
            and author = #{author}
        </if>
    </where>
</select>

```

\*\*set：\*\*set 元素会动态地在行首插入 SET 关键字，并会删掉额外的逗号（这些逗号是在使用条件语句给列赋值时引入的）或者，可以通过使用_trim_元素来达到同样的效果：

```xml
<update id="updateBlog" parameterType="map">
    update blog
    <set>
        <if test="title != null">
            title = #{title},
        </if>
        <if test="author != null">
            author = #{author}
        </if>
    </set>
    where id = #{id}
</update>

```

\*\*trim：\*\*prefix/suffix属性：如果trim后内容不为空，则增加某某字符串（作前缀/后缀）； 如果trim后内容不为空，则删掉（前缀/后缀的）某某字符串。

```xml
<trim prefix="SET" suffixOverrides=",">
  ...
</trim>

```

我们覆盖了后缀值设置，并且自定义了前缀值

所谓动态SQL，本质还是SQL语句，只是我们可以在SQL层面去执行一个逻辑代码

### 12.4、SQL片段

就是将sql中一些功能片段提取出来，方便使用

1.  使用sql标签抽取公共部分

    ```xml
    <sql id="if-title-author">
        <if test="title != null">
            title = #{title}
        </if>
        <if test="author != null">
            and author = #{author}
        </if>
    </sql>

    ```

2.  在需要使用的地方使用Include标签引用

    ```xml
    <select id="queryBlogIf" parameterType="map" resultType="blog">
        select * from blog
        <where>
            <include refid="if-title-author"></include>
        </where>
    </select>

    ```


\==注意：==

* 最好基于单表来定义sql片段
* 不要存在where标签

### 12.5、foreach

1.  接口

```java
//查询第1，2，3号的记录
List<Blog> queryBlogForeach(Map map);

```

2.  mapper.xml

```xml
<select id="selectPostIn" resultType="domain.blog.Post">
  SELECT *
  FROM POST P
  <where>
    <foreach item="item" index="index" collection="list"
        open="ID in (" separator="," close=")" nullable="true">
          #{item}
    </foreach>
  </where>
</select>

```

foreach 元素的功能非常强大，它允许指定一个集合，声明可以在元素体内使用的集合项（item）和索引（index）变量。也允许指定开头与结尾的字符串以及集合项迭代之间的分隔符。这个元素也不会错误地添加多余的分隔符。

\*\*提示 ：\*\*可以将任何可迭代对象（如 List、Set 等）、Map 对象或者数组对象作为集合参数传递给 foreach。当使用可迭代对象或者数组时，index 是当前迭代的序号，item 的值是本次迭代获取到的元素。当使用 Map 对象（或者 Map.Entry 对象的集合）时，index 是键，item 是值。

```xml
<select id="queryBlogForeach" resultType="Blog" parameterType="map">
    select * from blog
        <where>
            <foreach collection="ids" item="id"
                open="and (" close=")" separator="or">
                id =#{id}
            </foreach>
        </where>
</select>

```

小结：

_**动态SQL就是在拼接SQL语句，我们只要保证SQL的正确性，按照SQL的格式，去排列组合就可以了**_

建议：

* 先在Mysql中写出完整的SQL再对应去修改成为我们的动态SQL实现通用即可
* Mysql重点掌握的知识
    * Mysql引擎
    * InnoDB底层原理
    * 索引
    * 索引优化

## 13、缓存

### 13.1、简介

1.  **什么是缓存【Cache】：**

    * 存在内存中的临时数据！

    * 将用户经常查询的数据放在缓存（内存）中，用户去查询数据就不用了从磁盘上（关系型数据库数据文件）查询，从缓存中查询，从而提高查询效率，解决了高并发系统的性能问题

2.  **为什么使用缓存？**

    * 减少和数据库的交互次数，较少系统开销，提高系统效率
3.  **什么样的数据能使用缓存？**

    * 经常查询而且不经常改变的数据

### **13.2、Mybatis缓存：**

* MyBatis包含一个非常强大的查询缓存特性，它可以非常方便地定制和配置缓存。缓存可以极大的提升查询效率。

* MyBatis系统中默认定义了两级缓存：**一级缓存**和**二级缓存**

    * 默认情况下，只有一级缓存开启。(SqlSession级别的缓存，也称为本地缓存)

    * 二级缓存需要手动开启和配置，他是基于namespace级别的缓存。

    * 为了提高扩展性，MyBatis定义了缓存接口Cache。我们可以通过实现Cache接口来自定义二级缓存


### 13.2、一级缓存：

* 一级缓存也叫本地缓存：

* 与数据库同一次会话期间查询到的数据会放在本地缓存中。

* 以后如果需要获取相同的数据，直接从缓存中拿，没必须再去查询数据库；


测试步骤

1.  开启日志

2.  测试在一个Session中查询两次相同的记录

3.  查看日志输出


![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd69a847e17049f2b6cab8c44c1bdf78~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**缓存失效的情况：**

1.  查询不同的东西
2.  增删改操作，可能会改变原来的数据，所以必定会刷新缓存！
3.  查询不同的Mapper.xml
4.  手动清理缓存！

```java
@Test
public void queryUserById(){
    SqlSession sqlSession = MybatisUntils.getSqlSession();
    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    User user = mapper.queryUserById(1);
    System.out.println(user);
    //mapper.updateUser(new User(2,"aaaa","bbbbb"));

    sqlSession.clearCache();

    System.out.println("*************************");
    User user1 = mapper.queryUserById(1);
    System.out.println(user1);
    System.out.println(user==user1);
    sqlSession.close();
}

```

\==**`一级缓存默认是开启的，只在一次SqlSession中有效，也就是拿到连接到关闭连接这个区间(相当于一个用户不断查询相同的数据，比如不断刷新)`**\==

一级缓存就是一个map！

### 13.4、二级缓存

* 二级缓存也叫全局缓存，一级缓存作用域太低了，所以诞生了二级缓存
* 基于namespace级别的缓存，一个名称空间，对应一个二级缓存：
* 工作机制
    * 一个会话查询一条数据，这个数据就会被放在当前会话的一级缓存中：
    * 如果当前会话关闭了，这个会话对应的一级缓存就没了；但是我们想要的是，会话关闭了，一级缓存中的数据被保存到二级缓存中；
    * 新的会话查询信息，就可以从二级缓存中获取内容：
    * 不同的mapperi查出的数据会放在自己对应的缓存(map)中；

步骤：

1.  开启全局缓存

    ```xml
    <!--        开启全局缓存-->
            <setting name="cacheEnabled" value="true"/>

    ```

2.  mapper文件添加二级缓存

    ```xml
    <!--    在当前Mapper.xml中使用二级缓存-->
        <cache  eviction="FIFO"
                flushInterval="60000"
                size="512"
                readOnly="true"/>
    <!--    没有参数也可以用-->
    	<cache/>

    ```

3.  测试

    * 实体类没有序列化报错

        ```sheel
        Caused by: java.io.NotSerializableException: com.hwt.pojo.User

        ```

    * 解决方式

        ```java
        @Data
        @AllArgsConstructor
        @NoArgsConstructor
        public class User implements Serializable {
            private int id ;
            private String name;
            private String pwd;
        }

        ```

    * 4.小结

        * 只要开启了二级缓存，在同一个Mapper下就有效

        * 所有的数据都会先放在一级缓存中

        * 只有当会话提交，或者关闭的时候才会提交到二级缓存中


### 13.5、缓存原理

缓存顺序：

1.  先看二级缓存中有没有
2.  再看一级缓存中有没有
3.  查询数据库

注：一二级缓存都没有，查询数据库，查询后将数据放入一级缓存

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60386d680a124146bba935b6615cdc1d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 13.6、自定义缓存-ehcache

介绍：

* EhCache 是一个纯Java的进程内缓存框架，具有快速、精干等特点，是Hibernate中默认的CacheProvider
* Ehcache是一种广泛使用的开源Java分布式缓存。主要面向通用缓存

要在程序中使用ehcache，先要导包

```xml
<!-- https://mvnrepository.com/artifact/org.mybatis.caches/mybatis-ehcache -->
<dependency>
    <groupId>org.mybatis.caches</groupId>
    <artifactId>mybatis-ehcache</artifactId>
    <version>1.1.0</version>
</dependency>

```

在mapper中指定使用我们的ehcache缓存实现

```xml
<cache type="org.mybatis.caches.ehcache.EhcacheCache"/>

```

ehcache.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ehcache xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="http://ehcache.org/ehcache.xsd"
         updateCheck="false">
    <!--
       diskStore：为缓存路径，ehcache分为内存和磁盘两级，此属性定义磁盘的缓存位置。参数解释如下：
       user.home – 用户主目录
       user.dir  – 用户当前工作目录
       java.io.tmpdir – 默认临时文件路径
     -->
    <diskStore path="java.io.tmpdir/Tmp_EhCache"/>
    <!--
       defaultCache：默认缓存策略，当ehcache找不到定义的缓存时，则使用这个缓存策略。只能定义一个。
     -->
    <!--
      name:缓存名称。
      maxElementsInMemory:缓存最大数目
      maxElementsOnDisk：硬盘最大缓存个数。
      eternal:对象是否永久有效，一但设置了，timeout将不起作用。
      overflowToDisk:是否保存到磁盘，当系统当机时
      timeToIdleSeconds:设置对象在失效前的允许闲置时间（单位：秒）。仅当eternal=false对象不是永久有效时使用，可选属性，默认值是0，也就是可闲置时间无穷大。
      timeToLiveSeconds:设置对象在失效前允许存活时间（单位：秒）。最大时间介于创建时间和失效时间之间。仅当eternal=false对象不是永久有效时使用，默认是0.，也就是对象存活时间无穷大。
      diskPersistent：是否缓存虚拟机重启期数据 Whether the disk store persists between restarts of the Virtual Machine. The default value is false.
      diskSpoolBufferSizeMB：这个参数设置DiskStore（磁盘缓存）的缓存区大小。默认是30MB。每个Cache都应该有自己的一个缓冲区。
      diskExpiryThreadIntervalSeconds：磁盘失效线程运行时间间隔，默认是120秒。
      memoryStoreEvictionPolicy：当达到maxElementsInMemory限制时，Ehcache将会根据指定的策略去清理内存。默认策略是LRU（最近最少使用）。你可以设置为FIFO（先进先出）或是LFU（较少使用）。
      clearOnFlush：内存数量最大时是否清除。
      memoryStoreEvictionPolicy:可选策略有：LRU（最近最少使用，默认策略）、FIFO（先进先出）、LFU（最少访问次数）。
      FIFO，first in first out，这个是大家最熟的，先进先出。
      LFU， Less Frequently Used，就是上面例子中使用的策略，直白一点就是讲一直以来最少被使用的。如上面所讲，缓存的元素有一个hit属性，hit值最小的将会被清出缓存。
      LRU，Least Recently Used，最近最少使用的，缓存的元素有一个时间戳，当缓存容量满了，而又需要腾出地方来缓存新的元素的时候，那么现有缓存元素中时间戳离当前时间最远的元素将被清出缓存。
   -->
    <defaultCache
            eternal="false"
            maxElementsInMemory="10000"
            overflowToDisk="false"
            diskPersistent="false"
            timeToIdleSeconds="1800"
            timeToLiveSeconds="259200"
            memoryStoreEvictionPolicy="LRU"/>

    <cache
            name="cloud_user"
            eternal="false"
            maxElementsInMemory="5000"
            overflowToDisk="false"
            diskPersistent="false"
            timeToIdleSeconds="1800"
            timeToLiveSeconds="1800"
            memoryStoreEvictionPolicy="LRU"/>

</ehcache>

```

以后开发会用Redis数据库来做缓存
