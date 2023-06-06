部分时候，我们都是在Spring 里面去集成MyBatis。因为Spring 对MyBatis 的一些操作进行的封装，我们不能直接看到它的本质，所以先看下不使用容器的时候，也就是编程的方式，MyBatis 怎么使用。先引入mybatis jar 包。

　　首先我们要创建一个全局配置文件，这里面是对MyBatis 的核心行为的控制，比如mybatis-config.xml。

　　第二个就是我们的映射器文件，Mapper.xml，通常来说一张表对应一个，我们会在这个里面配置我们增删改查的SQL 语句，以及参数和返回的结果集的映射关系。跟JDBC 的代码一样，我们要执行对数据库的操作，必须创建一个会话，这个在MyBatis 里面就是SqlSession。SqlSession 又是工厂类根据全局配置文件创建的。所以整个的流程就是这样的（如下代码）。最后我们通过SqlSession 接口上的方法，传入我们的Statement ID 来执行SQL。这是第一种方式。

　　这种方式有一个明显的缺点，就是会对Statement ID 硬编码，而且不能在编译时进行类型检查，所以通常我们会使用第二种方式，就是定义一个Mapper 接口的方式。这个接口全路径必须跟Mapper.xml 里面的namespace 对应起来，方法也要跟StatementID 一一对应。



```
public void testMapper() throws IOException {
　　String resource = "mybatis-config.xml";
　　InputStream inputStream = Resources.getResourceAsStream(resource);
　　SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
　　SqlSession session = sqlSessionFactory.openSession();
　　try {
　　　　BlogMapper mapper = session.getMapper(BlogMapper.class);
　　　　Blog blog = mapper.selectBlogById(1);
　　　　System.out.println(blog);
　　} finally {
　　　　session.close();
　　}
}
```

　　这个就是我们单独使用MyBatis 的基本流程。

## 核心对象的生命周期

　　在编程式使用的这个demo 里面，我们看到了MyBatis 里面的几个核心对象：SqlSessionFactoryBuiler、SqlSessionFactory、SqlSession 和Mapper 对象。这几个核心对象在MyBatis 的整个工作流程里面的不同环节发挥作用。如果说我们不用容器，自己去管理这些对象的话，我们必须思考一个问题：什么时候创建和销毁这些对象？在一些分布式的应用里面，多线程高并发的场景中，如果要写出高效的代码，必须了解这四个对象的生命周期。这四个对象的声明周期的描述在官网上面也可以找到。我们从每个对象的作用的角度来理解一下，只有理解了它们是干什么的，才知道什么时候应该创建，什么时候应该销毁。

### SqlSessionFactoryBuilder

　　这个类可以被实例化、使用和丢弃，一旦创建了 SqlSessionFactory，就不再需要它了。 因此 SqlSessionFactoryBuilder 实例的最佳作用域是方法作用域（也就是局部方法变量）。 你可以重用 SqlSessionFactoryBuilder 来创建多个 SqlSessionFactory 实例，但是最好还是不要让其一直存在，以保证所有的 XML 解析资源可以被释放给更重要的事情。

### SqlSessionFactory

　　SqlSessionFactory 一旦被创建就应该在应用的运行期间一直存在，没有任何理由丢弃它或重新创建另一个实例。 使用 SqlSessionFactory 的最佳实践是在应用运行期间不要重复创建多次，多次重建 SqlSessionFactory 被视为一种代码“坏味道（bad smell）”。因此 SqlSessionFactory 的最佳作用域是应用作用域。 有很多方法可以做到，最简单的就是使用单例模式或者静态单例模式。

### SqlSession

　　每个线程都应该有它自己的 SqlSession 实例。SqlSession 的实例不是线程安全的，因此是不能被共享的，所以它的最佳的作用域是请求或方法作用域。 绝对不能将 SqlSession 实例的引用放在一个类的静态域，甚至一个类的实例变量也不行。 也绝不能将 SqlSession 实例的引用放在任何类型的托管作用域中，比如 Servlet 框架中的 HttpSession。 如果你现在正在使用一种 Web 框架，要考虑 SqlSession 放在一个和 HTTP 请求对象相似的作用域中。 换句话说，每次收到的 HTTP 请求，就可以打开一个 SqlSession，返回一个响应，就关闭它。 这个关闭操作是很重要的，你应该把这个关闭操作放到 finally 块中以确保每次都能执行关闭。 下面的示例就是一个确保 SqlSession 关闭的标准模式：

```
SqlSession session = sqlSessionFactory.openSession();
try {
  // 你的应用逻辑代码
} finally {
  session.close();
}
```

　　在你的所有的代码中一致地使用这种模式来保证所有数据库资源都能被正确地关闭。

### 映射器实例（Mapper）

　　映射器是一些由你创建的、绑定你映射的语句的接口。映射器接口的实例是从 SqlSession 中获得的。因此从技术层面讲，任何映射器实例的最大作用域是和请求它们的 SqlSession 相同的。尽管如此，映射器实例的最佳作用域是方法作用域。 也就是说，映射器实例应该在调用它们的方法中被请求，用过之后即可丢弃。 并不需要显式地关闭映射器实例，尽管在整个请求作用域保持映射器实例也不会有什么问题，但是你很快会发现，像 SqlSession 一样，在这个作用域上管理太多的资源的话会难于控制。 为了避免这种复杂性，最好把映射器放在方法作用域内。下面的示例就展示了这个实践：



```
SqlSession session = sqlSessionFactory.openSession();
try {
  BlogMapper mapper = session.getMapper(BlogMapper.class);
  // 你的应用逻辑代码
} finally {
  session.close();
}
```



 　　这个就是我们在编程式的使用里面看到的四个对象的生命周期的总结。

![img](https://img2018.cnblogs.com/blog/1383365/201906/1383365-20190627091402475-763763294.png)

## 核心配置解读

　　第一个是config 文件。大部分时候我们只需要很少的配置就可以让MyBatis 运行起来。其实MyBatis 里面提供的配置项非常多，我们没有配置的时候使用的是系统的默认值。

　　目前最新的版本是3.5.1，大家可以从官方上下载到最新的源码。中文地址：http://www.mybatis.org/mybatis-3/zh/index.html



```
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

    <properties resource="db.properties"></properties>
    <settings>
        <!-- 打印查询语句 -->
        <setting name="logImpl" value="STDOUT_LOGGING" />
        <!-- 控制全局缓存（二级缓存）-->
        <setting name="cacheEnabled" value="true"/>
        <!-- 延迟加载的全局开关。当开启时，所有关联对象都会延迟加载。默认 false  -->
        <setting name="lazyLoadingEnabled" value="true"/>
        <!-- 当开启时，任何方法的调用都会加载该对象的所有属性。默认 false，可通过select标签的 fetchType来覆盖-->
        <setting name="aggressiveLazyLoading" value="false"/>
        <!--  Mybatis 创建具有延迟加载能力的对象所用到的代理工具，默认JAVASSIST -->
        <!--<setting name="proxyFactory" value="CGLIB" />-->
        <!-- STATEMENT级别的缓存，使一级缓存，只针对当前执行的这一statement有效 -->
        <!--
                <setting name="localCacheScope" value="STATEMENT"/>
        -->
        <setting name="localCacheScope" value="SESSION"/>
    </settings>

    <typeAliases>
        <typeAlias alias="blog" type="com.wuzz.domain.Blog" />
    </typeAliases>

<!--    <typeHandlers>
        <typeHandler handler="com.wuzz.type.MyTypeHandler"></typeHandler>
    </typeHandlers>-->

    <!-- 对象工厂 -->
<!--    <objectFactory type="com.wuzz.objectfactory.GPObjectFactory">
        <property name="wuzz" value="666"/>
    </objectFactory>-->

<!--    <plugins>
        <plugin interceptor="com.wuzz.interceptor.SQLInterceptor">
            <property name="wuzz" value="betterme" />
        </plugin>
        <plugin interceptor="com.wuzz.interceptor.MyPageInterceptor">
        </plugin>
    </plugins>-->

    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/><!-- 单独使用时配置成MANAGED没有事务 -->
            <dataSource type="POOLED">
                <property name="driver" value="${jdbc.driver}"/>
                <property name="url" value="${jdbc.url}"/>
                <property name="username" value="${jdbc.username}"/>
                <property name="password" value="${jdbc.password}"/>
            </dataSource>
        </environment>
    </environments>

    <mappers>
        <mapper resource="BlogMapper.xml"/>
        <mapper resource="BlogMapperExt.xml"/>
    </mappers>

</configuration>
```



### configuration

　　configuration 是整个配置文件的根标签，实际上也对应着MyBatis 里面最重要的配置类Configuration。它贯穿MyBatis 执行流程的每一个环节。这里面有很多的属性，跟其他的子标签也能对应上。

　　注意：MyBatis 全局配置文件顺序是固定的，否则启动的时候会报错。

### properties

　　第一个是properties 标签，用来配置参数信息，比如最常见的数据库连接信息。为了避免直接把参数写死在xml 配置文件中，我们可以把这些参数单独放在properties 文件中，用properties 标签引入进来，然后在xml 配置文件中用${}引用就可以了。可以用resource 引用应用里面的相对路径，也可以用url 指定本地服务器或者网络的绝对路径。

　　我们为什么要把这些配置独立出来？有什么好处？或者说，公司的项目在打包的时候，有没有把properties 文件打包进去？

1. 提取，利于多处引用，维护简单；
2. 把配置文件放在外部，避免修改后重新编译打包，只需要重启应用；
3. 程序和配置分离，提升数据的安全性，比如生产环境的密码只有运维人员掌握。

### settings　　

　　这是 MyBatis 中极为重要的调整设置，它们会改变 MyBatis 的运行时行为。 下表描述了设置中各项的意图、默认值等。

| 设置名                           | 描述                                                         | 有效值                                                       | 默认值                                                |
| -------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ----------------------------------------------------- |
| cacheEnabled                     | 全局地开启或关闭配置文件中的所有映射器已经配置的任何缓存。   | true \| false                                                | true                                                  |
| lazyLoadingEnabled               | 延迟加载的全局开关。当开启时，所有关联对象都会延迟加载。 特定关联关系中可通过设置 `fetchType`属性来覆盖该项的开关状态。 | true \| false                                                | false                                                 |
| aggressiveLazyLoading            | 当开启时，任何方法的调用都会加载该对象的所有属性。 否则，每个属性会按需加载（参考 `lazyLoadTriggerMethods`)。 | true \| false                                                | false （在 3.4.1 及之前的版本默认值为 true）          |
| multipleResultSetsEnabled        | 是否允许单一语句返回多结果集（需要驱动支持）。               | true \| false                                                | true                                                  |
| useColumnLabel                   | 使用列标签代替列名。不同的驱动在这方面会有不同的表现，具体可参考相关驱动文档或通过测试这两种不同的模式来观察所用驱动的结果。 | true \| false                                                | true                                                  |
| useGeneratedKeys                 | 允许 JDBC 支持自动生成主键，需要驱动支持。 如果设置为 true 则这个设置强制使用自动生成主键，尽管一些驱动不能支持但仍可正常工作（比如 Derby）。 | true \| false                                                | False                                                 |
| autoMappingBehavior              | 指定 MyBatis 应如何自动映射列到字段或属性。 NONE 表示取消自动映射；PARTIAL 只会自动映射没有定义嵌套结果集映射的结果集。 FULL 会自动映射任意复杂的结果集（无论是否嵌套）。 | NONE, PARTIAL, FULL                                          | PARTIAL                                               |
| autoMappingUnknownColumnBehavior | 指定发现自动映射目标未知列（或者未知属性类型）的行为。`NONE`: 不做任何反应`WARNING`: 输出提醒日志 (`'org.apache.ibatis.session.AutoMappingUnknownColumnBehavior'`的日志等级必须设置为 `WARN`)`FAILING`: 映射失败 (抛出 `SqlSessionException`) | NONE, WARNING, FAILING                                       | NONE                                                  |
| defaultExecutorType              | 配置默认的执行器。SIMPLE 就是普通的执行器；REUSE 执行器会重用预处理语句（prepared statements）； BATCH 执行器将重用语句并执行批量更新。 | SIMPLE REUSE BATCH                                           | SIMPLE                                                |
| defaultStatementTimeout          | 设置超时时间，它决定驱动等待数据库响应的秒数。               | 任意正整数                                                   | 未设置 (null)                                         |
| defaultFetchSize                 | 为驱动的结果集获取数量（fetchSize）设置一个提示值。此参数只可以在查询设置中被覆盖。 | 任意正整数                                                   | 未设置 (null)                                         |
| safeRowBoundsEnabled             | 允许在嵌套语句中使用分页（RowBounds）。如果允许使用则设置为 false。 | true \| false                                                | False                                                 |
| safeResultHandlerEnabled         | 允许在嵌套语句中使用分页（ResultHandler）。如果允许使用则设置为 false。 | true \| false                                                | True                                                  |
| mapUnderscoreToCamelCase         | 是否开启自动驼峰命名规则（camel case）映射，即从经典数据库列名 A_COLUMN 到经典 Java 属性名 aColumn 的类似映射。 | true \| false                                                | False                                                 |
| localCacheScope                  | MyBatis 利用本地缓存机制（Local Cache）防止循环引用（circular references）和加速重复嵌套查询。 默认值为 SESSION，这种情况下会缓存一个会话中执行的所有查询。 若设置值为 STATEMENT，本地会话仅用在语句执行上，对相同 SqlSession 的不同调用将不会共享数据。 | SESSION \| STATEMENT                                         | SESSION                                               |
| jdbcTypeForNull                  | 当没有为参数提供特定的 JDBC 类型时，为空值指定 JDBC 类型。 某些驱动需要指定列的 JDBC 类型，多数情况直接用一般类型即可，比如 NULL、VARCHAR 或 OTHER。 | JdbcType 常量，常用值：NULL, VARCHAR 或 OTHER。              | OTHER                                                 |
| lazyLoadTriggerMethods           | 指定哪个对象的方法触发一次延迟加载。                         | 用逗号分隔的方法列表。                                       | equals,clone,hashCode,toString                        |
| defaultScriptingLanguage         | 指定动态 SQL 生成的默认语言。                                | 一个类型别名或完全限定类名。                                 | org.apache.ibatis.scripting.xmltags.XMLLanguageDriver |
| defaultEnumTypeHandler           | 指定 Enum 使用的默认 `TypeHandler` 。（新增于 3.4.5）        | 一个类型别名或完全限定类名。                                 | org.apache.ibatis.type.EnumTypeHandler                |
| callSettersOnNulls               | 指定当结果集中值为 null 的时候是否调用映射对象的 setter（map 对象时为 put）方法，这在依赖于 Map.keySet() 或 null 值初始化的时候比较有用。注意基本类型（int、boolean 等）是不能设置成 null 的。 | true \| false                                                | false                                                 |
| returnInstanceForEmptyRow        | 当返回行的所有列都是空时，MyBatis默认返回 `null`。 当开启这个设置时，MyBatis会返回一个空实例。 请注意，它也适用于嵌套的结果集 （如集合或关联）。（新增于 3.4.2） | true \| false                                                | false                                                 |
| logPrefix                        | 指定 MyBatis 增加到日志名称的前缀。                          | 任何字符串                                                   | 未设置                                                |
| logImpl                          | 指定 MyBatis 所用日志的具体实现，未指定时将自动查找。        | SLF4J \| LOG4J \| LOG4J2 \| JDK_LOGGING \| COMMONS_LOGGING \| STDOUT_LOGGING \| NO_LOGGING | 未设置                                                |
| proxyFactory                     | 指定 Mybatis 创建具有延迟加载能力的对象所用到的代理工具。    | CGLIB \| JAVASSIST                                           | JAVASSIST （MyBatis 3.3 以上）                        |
| vfsImpl                          | 指定 VFS 的实现                                              | 自定义 VFS 的实现的类全限定名，以逗号分隔。                  | 未设置                                                |
| useActualParamName               | 允许使用方法签名中的名称作为语句参数名称。 为了使用该特性，你的项目必须采用 Java 8 编译，并且加上 `-parameters` 选项。（新增于 3.4.1） | true \| false                                                | true                                                  |
| configurationFactory             | 指定一个提供 `Configuration` 实例的类。 这个被返回的 Configuration 实例用来加载被反序列化对象的延迟加载属性值。 这个类必须包含一个签名为`static Configuration getConfiguration()` 的方法。（新增于 3.2.3） | 类型别名或者全类名.                                          | 未设置                                                |

### typeAliases

　　TypeAlias 是类型的别名，跟Linux 系统里面的alias 一样，主要用来简化全路径类名的拼写。比如我们的参数类型和返回值类型都可能会用到我们的Bean，如果每个地方都配置全路径的话，那么内容就比较多，还可能会写错。我们可以为自己的Bean 创建别名，既可以指定单个类，也可以指定一个package，自动转换。配置了别名以后，只需要写别名就可以了，比如com.gupaoedu.domain.Blog都只要写blog 就可以了。MyBatis 里面有系统预先定义好的类型别名，在TypeAliasRegistry 中。

```
<typeAliases>
  <typeAlias alias="Author" type="domain.blog.Author"/>
  <typeAlias alias="Blog" type="domain.blog.Blog"/>
</typeAliases>
```

　　当这样配置时，`Blog` 可以用在任何使用 `domain.blog.Blog` 的地方。也可以指定一个包名，MyBatis 会在包名下面搜索需要的 Java Bean，比如：

```
<typeAliases>
  <package name="domain.blog"/>
</typeAliases>
```

　　每一个在包 `domain.blog` 中的 Java Bean，在没有注解的情况下，会使用 Bean 的首字母小写的非限定类名来作为它的别名。 比如 `domain.blog.Author` 的别名为 `author`；若有注解，则别名为其注解值。见下面的例子：

```
@Alias("author")
public class Author {
    ...
}
```

 

### typeHandlers 

　　由于Java 类型和数据库的JDBC 类型不是一一对应的（比如String 与varchar），所以我们把Java 对象转换为数据库的值，和把数据库的值转换成Java 对象，需要经过一定的转换，这两个方向的转换就要用到TypeHandler。有的同学可能会有疑问，我没有做任何的配置，为什么实体类对象里面的一个String属性，可以保存成数据库里面的varchar 字段，或者保存成char 字段？这是因为MyBatis 已经内置了很多TypeHandler（在type 包下），它们全部全部注册在TypeHandlerRegistry 中，他们都继承了抽象类BaseTypeHandler，泛型就是要处理的Java 数据类型。

![img](https://img2018.cnblogs.com/blog/1383365/201906/1383365-20190627093440821-1028615596.png)

　　当我们做数据类型转换的时候，就会自动调用对应的TypeHandler 的方法。如果我们需要自定义一些类型转换规则，或者要在处理类型的时候做一些特殊的动作，就可以编写自己的TypeHandler，跟系统自定义的TypeHandler 一样，继承抽象类BaseTypeHandler<T>。有4 个抽象方法必须实现，我们把它分成两类：set 方法从Java 类型转换成JDBC 类型的，get 方法是从JDBC 类型转换成Java 类型的。

![img](https://img2018.cnblogs.com/blog/1383365/201906/1383365-20190627094208453-1165849756.png)

　　比如我们想要在获取或者设置String 类型的时候做一些特殊处理，我们可以写一个String 类型的TypeHandler



```
public class MyTypeHandler extends BaseTypeHandler<String> {
    public void setNonNullParameter(PreparedStatement ps, int i, String parameter, JdbcType jdbcType)
            throws SQLException {
        // 设置 String 类型的参数的时候调用，Java类型到JDBC类型
        // 注意只有在字段上添加typeHandler属性才会生效
        // insertBlog name字段
        System.out.println("---------------setNonNullParameter1："+parameter);
        ps.setString(i, parameter);
    }

    public String getNullableResult(ResultSet rs, String columnName) throws SQLException {
        // 根据列名获取 String 类型的参数的时候调用，JDBC类型到java类型
        // 注意只有在字段上添加typeHandler属性才会生效
        System.out.println("---------------getNullableResult1："+columnName);
        return rs.getString(columnName);
    }

    public String getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        // 根据下标获取 String 类型的参数的时候调用
        System.out.println("---------------getNullableResult2："+columnIndex);
        return rs.getString(columnIndex);
    }

    public String getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        System.out.println("---------------getNullableResult3：");
        return cs.getString(columnIndex);
    }
}
```



　　第二步，在mybatis-config.xml 文件中注册：

```
<typeHandlers>
<typeHandler handler="com.wuzz.type.MyTypeHandler"></typeHandler>
</typeHandlers>
```

　　第三步，在我们需要使用的字段上指定，比如：插入值的时候，从Java 类型到JDBC 类型，在字段属性中指定typehandler：



```
<insert id="insertBlog" parameterType="com.wuzz.domain.Blog">
　　insert into blog (bid, name, author_id)
　　values (#{bid,jdbcType=INTEGER},
　　#{name,jdbcType=VARCHAR,typeHandler=com.wuzz.type.MyTypeHandler},
　　#{authorId,jdbcType=INTEGER})
</insert>
```



　　返回值的时候，从JDBC 类型到Java 类型，在resultMap 的列上指定typehandler：

```
<result column="name" property="name" jdbcType="VARCHAR"
typeHandler="com.wuzz.type.MyTypeHandler"/>
```

处理枚举类型

　　若想映射枚举类型 `Enum`，则需要从 `EnumTypeHandler` 或者 `EnumOrdinalTypeHandler` 中选一个来使用。

　　比如说我们想存储取近似值时用到的舍入模式。默认情况下，MyBatis 会利用 `EnumTypeHandler` 来把 `Enum` 值转换成对应的名字。

　　注意 `EnumTypeHandler` 在某种意义上来说是比较特别的，其他的处理器只针对某个特定的类，而它不同，它会处理任意继承了 `Enum` 的类。

　　不过，我们可能不想存储名字，相反我们的 DBA 会坚持使用整形值代码。那也一样轻而易举： 在配置文件中把 `EnumOrdinalTypeHandler` 加到 `typeHandlers` 中即可， 这样每个 `RoundingMode` 将通过他们的序数值来映射成对应的整形数值。

### objectFactory 

　　当我们把数据库返回的结果集转换为实体类的时候，需要创建对象的实例，由于我们不知道需要处理的类型是什么，有哪些属性，所以不能用new 的方式去创建。在MyBatis 里面，它提供了一个工厂类的接口，叫做ObjectFactory，专门用来创建对象的实例，里面定义了4 个方法。



```
public interface ObjectFactory {
    void setProperties(Properties var1);

    <T> T create(Class<T> var1);

    <T> T create(Class<T> var1, List<Class<?>> var2, List<Object> var3);

    <T> boolean isCollection(Class<T> var1);
}
```



![img](https://img2018.cnblogs.com/blog/1383365/201906/1383365-20190627110321875-630505389.png)

　　ObjectFactory 有一个默认的实现类DefaultObjectFactory，创建对象的方法最终都调用了instantiateClass()，是通过反射来实现的。如果想要修改对象工厂在初始化实体类的时候的行为，就可以通过创建自己的对象工厂，继承DefaultObjectFactory 来实现（不需要再实现ObjectFactory 接口）。



```
public class MyObjectFactory extends DefaultObjectFactory {
    @Override
    public Object create(Class type) {
        System.out.println("创建对象方法：" + type);
        if (type.equals(Blog.class)) {
            Blog blog = (Blog) super.create(type);
            blog.setName("object factory");
            blog.setBid(1111);
            blog.setAuthorId(2222);
            return blog;
        }
        Object result = super.create(type);
        return result;
    }
}
```



　　我们可以直接用自定义的工厂类来创建对象：



```
public class ObjectFactoryTest {
    public static void main(String[] args) {
        MyObjectFactory factory = new MyObjectFactory();
        Blog myBlog = (Blog) factory.create(Blog.class);
        System.out.println(myBlog);
    }
}
```



应用场景举例：

　　比如有一个新锐手机品牌在一个电商平台上面卖货，为了让预约数量好看一点，只要有人预约，预约数量就自动乘以3。这个时候就可以创建一个ObjectFactory，只要是查询销量，就把它的预约数乘以3 返回这个实体类。

1、什么时候调用了objectFactory.create()？

　　创建DefaultResultSetHandler 的时候，和创建对象的时候。

2、创建对象后，已有的属性为什么被覆盖了？

　　在DefaultResultSetHandler 类的395 行getRowValue()方法里面里面调用了applyPropertyMappings()。

3、返回结果的时候，ObjectFactory 和TypeHandler 哪个先工作？

　　先是ObjectFactory，再是TypeHandler。肯定是先创建对象。PS：step out 可以看到一步步调用的层级。

### 插件（plugins）

　　MyBatis 允许你在已映射语句执行过程中的某一点进行拦截调用。默认情况下，MyBatis 允许使用插件来拦截的方法调用包括：

- Executor (update, query, flushStatements, commit, rollback, getTransaction, close, isClosed)
- ParameterHandler (getParameterObject, setParameters)
- ResultSetHandler (handleResultSets, handleOutputParameters)
- StatementHandler (prepare, parameterize, batch, update, query)

　　这些类中方法的细节可以通过查看每个方法的签名来发现，或者直接查看 MyBatis 发行包中的源代码。 如果你想做的不仅仅是监控方法的调用，那么你最好相当了解要重写的方法的行为。 因为如果在试图修改或重写已有方法的行为的时候，你很可能在破坏 MyBatis 的核心模块。 这些都是更低层的类和方法，所以使用插件的时候要特别当心。通过 MyBatis 提供的强大机制，使用插件是非常简单的，只需实现 Interceptor 接口，并指定想要拦截的方法签名即可。



```
// ExamplePlugin.java
@Intercepts({@Signature(
  type= Executor.class,
  method = "update",
  args = {MappedStatement.class,Object.class})})
public class ExamplePlugin implements Interceptor {
  public Object intercept(Invocation invocation) throws Throwable {
    return invocation.proceed();
  }
  public Object plugin(Object target) {
    return Plugin.wrap(target, this);
  }
  public void setProperties(Properties properties) {
  }
}
```



```
<!-- mybatis-config.xml -->
<plugins>
  <plugin interceptor="org.mybatis.example.ExamplePlugin">
    <property name="someProperty" value="100"/>
  </plugin>
</plugins>
```



　　上面的插件将会拦截在 Executor 实例中所有的 “update” 方法调用， 这里的 Executor 是负责执行低层映射语句的内部对象。

### environments、environment

　　environments 标签用来管理数据库的环境，比如我们可以有开发环境、测试环境、生产环境的数据库。可以在不同的环境中使用不同的数据库地址或者类型。



```
<environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/><!-- 单独使用时配置成MANAGED没有事务 -->
            <dataSource type="POOLED">
                <property name="driver" value="${jdbc.driver}"/>
                <property name="url" value="${jdbc.url}"/>
                <property name="username" value="${jdbc.username}"/>
                <property name="password" value="${jdbc.password}"/>
            </dataSource>
        </environment>
    </environments>
```



　　一个environment 标签就是一个数据源，代表一个数据库。这里面有两个关键的标签，一个是事务管理器，一个是数据源。

transactionManager

　　如果配置的是JDBC，则会使用Connection 对象的commit()、rollback()、close()管理事务。如果配置成MANAGED，会把事务交给容器来管理，比如JBOSS，Weblogic。因为我们跑的是本地程序，如果配置成MANAGE 不会有任何事务。如果是Spring + MyBatis ， 则没有必要配置， 因为我们会直接在applicationContext.xml 里面配置数据源，覆盖MyBatis 的配置。

### mappers

　　<mappers>标签配置的是我们的映射器，也就是Mapper.xml 的路径。这里配置的目的是让MyBatis 在启动的时候去扫描这些映射器，创建映射关系。我们有四种指定Mapper 文件的方式：

1. 使用相对于类路径的资源引用（resource）
2. 使用完全限定资源定位符（绝对路径）（URL）
3. 使用映射器接口实现类的完全限定类名
4. 将包内的映射器接口实现全部注册为映射器（最常用）

```
<!-- 使用相对于类路径的资源引用 -->
<mappers>
  <mapper resource="org/mybatis/builder/AuthorMapper.xml"/>
  <mapper resource="org/mybatis/builder/BlogMapper.xml"/>
  <mapper resource="org/mybatis/builder/PostMapper.xml"/>
</mappers>
<!-- 使用完全限定资源定位符（URL） -->
<mappers>
  <mapper url="file:///var/mappers/AuthorMapper.xml"/>
  <mapper url="file:///var/mappers/BlogMapper.xml"/>
  <mapper url="file:///var/mappers/PostMapper.xml"/>
</mappers>
<!-- 使用映射器接口实现类的完全限定类名 -->
<mappers>
  <mapper class="org.mybatis.builder.AuthorMapper"/>
  <mapper class="org.mybatis.builder.BlogMapper"/>
  <mapper class="org.mybatis.builder.PostMapper"/>
</mappers>
<!-- 将包内的映射器接口实现全部注册为映射器 -->
<mappers>
  <package name="org.mybatis.builder"/>
</mappers>
```



分类: [Mybatis](https://www.cnblogs.com/wuzhenzhao/category/1528246.html)





# 常用配置

`mybatis-config.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration
  PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <settings>
        <!-- 设置日志输出为LOG4J -->
        <setting name="logImpl" value="LOG4J" />
        <!--将以下画线方式命名的数据库列映射到 Java 对象的驼峰式命名属性中-->
        <setting name= "mapUnderscoreToCamelCase" value="true" />
    </settings>
    <!--简化类命名空间 -->
    <typeAliases>
        <package name="tk.mybatis.simple.model" />
    </typeAliases>

    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC" />
            <dataSource type="UNPOOLED">
                <property name="driver" value="com.mysql.jdbc.Driver" />
                <property name="url"
                    value="jdbc:mysql://localhost:3306/mybatis?useSSL=false" />
                <property name="username" value="root" />
                <property name="password" value="root" />
            </dataSource>
        </environment>
    </environments>
    <mappers>
        <!--常规做法-->
        <!--<mapper resource="tk/mybatis/simple/mapper/CountryMapper.xml" />-->
        <!--<mapper resource="tk/mybatis/simple/mapper/PrivilegeMapper.xml" />-->
        <!--<mapper resource="tk/mybatis/simple/mapper/RoleMapper.xml" />-->
        <!--<mapper resource="tk/mybatis/simple/mapper/RolePrivilegeMapper.xml" />-->
        <!--<mapper resource="tk/mybatis/simple/mapper/UserMapper.xml" />-->
        <!--<mapper resource="tk/mybatis/simple/mapper/UserRoleMapper.xml" />-->
        <!--第二种做法-->
        <package name="tk.mybatis.simple.mapper"/>
    </mappers>
</configuration>
```

### 设置日志输出为LOG4J, 设置完之后运行会打印出查询相关信息



```csharp
<setting name="logImpl" value="LOG4J" />
```

![img](https://upload-images.jianshu.io/upload_images/3055930-1e069a72916e044e.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

image.png

### 将数据库字段字段映射成java对象的驼峰命名



```csharp
<setting name= "mapUnderscoreToCamelCase" value="true" />
```

如果将上面的mapUnderscoreToCamelCase设置成true(默认为false),mybatis会将查出来的字段映射成java对象的驼峰命名,比如: 数据库字段是 user_Id=> userId, 所以就可免去了我们等下要说的resultMap配置

### 简化类命名空间



```xml
<typeAliases>
    <package name="tk.mybatis.simple.model" />
</typeAliases>
```

typeAliases翻译为"类命名", 此处我们写的包名称, 在我们平时开发的时候都是 "包.类名", 比如:



![img](https://upload-images.jianshu.io/upload_images/3055930-06fc34c2e37e0d71.png?imageMogr2/auto-orient/strip|imageView2/2/w/855/format/webp)

image.png



简化类命名空间简化之后我们只需要写类名就够了



![img](https://upload-images.jianshu.io/upload_images/3055930-88278449909deb82.png?imageMogr2/auto-orient/strip|imageView2/2/w/656/format/webp)

image.png

### 数据库信息配置



```xml
<environments default="development">
        <environment id="development">
            <transactionManager type="JDBC" />
            <dataSource type="UNPOOLED">
                <property name="driver" value="com.mysql.jdbc.Driver" />
                <property name="url"
                    value="jdbc:mysql://localhost:3306/mybatis?useSSL=false" />
                <property name="username" value="root" />
                <property name="password" value="root" />
            </dataSource>
        </environment>
</environments>
```

数据库信息配置
dataSource的type有三种选项: UNPOOLED,POOLED,JNDI
UNPOOLED这个数据源的实现只是每次被请求时打开和关闭连接,比较可靠
POOLED:连接池, 不用多说,能理解, 但是用连接池的时候需要注意如果超过8小时出现比较郁闷的事, 下列链接说明白了这个问题的解决方式
https://www.jianshu.com/p/ebfb0a838ef2

有关配置文件的事官网很明白了
http://www.mybatis.org/mybatis-3/zh/configuration.html

### 加载数据库操作文件

在mappers节点里面有两个属性节点



![img](https://upload-images.jianshu.io/upload_images/3055930-7b89b3d3fd1f9766.png?imageMogr2/auto-orient/strip|imageView2/2/w/275/format/webp)





```xml
<mappers> 
      <mapper resource=” tk/mybatis/simple/mapper/CountryMapper.xml ” / >
      <mapper resource=” tk/mybatis/simple/mapper/UserMapper . xml ” / >
      <mapper resource=” tk/mybatis/simple/mapper/RoleMapper.xml” />
      <mapper resource=” tk/mybatis/simple/mapper/PrivilegeMapper . xml ” />
      <mapper resource=” tk/mybatis/simple/mapper/UserRoleMapper . xml ” />
      <mapper resource=” tk/mybatis/simple/mapper/ RolePrivilegeMapper.xml ” />
</mappers> 
```

这种比较麻烦
我demo中用的是package引入xml,
1, 判断接口对应的命名 间是否己经存在，如果存在就抛出异常，不存在就继续进行接下
来的操作。
2,加载接口对应的却也映射文件 将接口全限定名转换为路径 例如 将接口tk.mybatis.smple.mapper.UserMapper 转换为 tk/m bati s/simple mapper/UserMapper xml,
以 .xml 为后缀搜索 XM 资源，如果找到就解析XML

1. 处理接口中的注解方法。
   因为这里的接口和 XML 映射文件完全符合上面操作的第 点，因此直接配置包名就能自
   动扫描包下 的接口和 XML 映射文件，省去了很多麻烦

   ![img](https://upload-images.jianshu.io/upload_images/3055930-c41068b593b37141.png?imageMogr2/auto-orient/strip|imageView2/2/w/962/format/webp)

   





# **mybatis-config.xml 核心配置文件**

mybatis-config.xml 包含的内容如下

- configuration（配置）
- properties（属性）
- settings（设置）
- typeAliases（类型别名）
- typeHandlers（类型处理器）
- objectFactory（对象工厂）
- plugins（插件）
- environments（环境配置）
- environment（环境变量）
- transactionManager（事务管理器）
- dataSource（数据源）
- databaseIdProvider（数据库厂商标识）
- mappers（映射器）

**注意元素节点的顺序！顺序不对会报错**

### **1. environments元素**

```text
<environments default="development">
 <environment id="development">
   <transactionManager type="JDBC">
     <property name="..." value="..."/>
   </transactionManager>
   <dataSource type="POOLED">
     <property name="driver" value="${driver}"/>
     <property name="url" value="${url}"/>
     <property name="username" value="${username}"/>
     <property name="password" value="${password}"/>
   </dataSource>
 </environment>
 <environment id="test">
   <transactionManager type="JDBC">
     <property name="..." value="..."/>
   </transactionManager>
   <dataSource type="POOLED">
     <property name="driver" value="${driver}"/>
     <property name="url" value="${url}"/>
     <property name="username" value="${username}"/>
     <property name="password" value="${password}"/>
   </dataSource>
 </environment>
</environments>
```

- environments配置mybatis 多套环境，将sql 映射到多个不同的数据库上，必须指定一个默认环境，即default="development"

### **1.1 子元素environment**

其中dataSource 数据源（共三种内建的数据源类型）

```xml
type="[UNPOOLED|POOLED|JNDI]"）
```

- unpooled：这个数据源的实现只是每次被请求时打开和关闭连接
- **pooled：这种数据源的实现利用“池”的概念将 JDBC 连接对象组织起来 , 这是一种使得并发 Web 应用快速响应请求的流行处理方式。**
- jndi：这个数据源的实现是为了能在如 Spring 或应用服务器这类容器中使用，容器可以集中或在外部配置数据源，然后放置一个 JNDI 上下文的引用。 **注： 数据源也有很多第三方的实现，比如dbcp，c3p0，druid等等....**

### **1.2 transactionManager 事务管理器（共两种）**

```xml
<transactionManager type="[ JDBC | MANAGED ]"/>
```

### **2. mappers 元素（定义映射SQL语句文件）**

**主要用于找到sql语句的文件在哪里？可以使用不同的方式引用sql语句 具体的引用方式如下**

- 使用相对路径引入sql语句的文件

```xml
<!-- 使用相对于类路径的资源引用 -->
<mappers>
 <mapper resource="org/mybatis/builder/PostMapper.xml"/>
</mappers>
```

- 使用完全限定资源定位符（URL）

```xml
<!-- 使用完全限定资源定位符（URL） -->
<mappers>
 <mapper url="file:///var/mappers/AuthorMapper.xml"/>
</mappers>
```

- 使用映射器接口实现类的完全限定类名,需要配置文件名称和接口名称一致，并且位于同一目录下

```xml
<!--
使用映射器接口实现类的完全限定类名需要配置文件名称和接口名称一致，并且位于同一目录下
-->
<mappers>
 <mapper class="org.mybatis.builder.AuthorMapper"/>
</mappers>
```

- 将包内的映射器接口实现全部注册为映射器但是需要配置文件名称和接口名称一致，并且位于同一目录下

```xml
<!--
将包内的映射器接口实现全部注册为映射器.但是需要配置文件名称和接口名称一致，并且位于同一目录下
-->
<mappers>
 <package name="org.mybatis.builder"/>
</mappers>
```

**mapper配置文件 主要用用关联dao接口中的方法，并书写sql语句 相当于实现了接口中的各个方法

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.xiezhr.dao.UserMapper">
    <select id="getUserList" resultType="com.xiezhr.pojo.User">
     select * from mybatis.user;
    </select>

    <insert id="addUser" parameterType="com.xiezhr.pojo.User">
        insert into mybatis.user values(#{id},#{name},#{pwd})
    </insert>

    <update id="updateUserById" parameterType="int">
        update mybatis.user set name='小头爸爸' where id=#{id}
    </update>

    <delete id="deleteUserById" parameterType="int">
        delete from mybatis.user where id=#{id}
    </delete>
</mapper>
```

### **3.properties**

- 我们都知道在java开发中，通过properties文件来配置一些参数。这我们就要通过db.properties文件来配置连接数据库的各个属性

具体步骤如下

（1）编写db.properties 文件

```properties
driver=com.mysql.jdbc.Driver
url=jdbc:mysql://localhost:3306/mybatis?useSSL=true&useUnicode=true&characterEncoding=utf8
username=root
password=123456
```

（2）在mybatis核心配置文件中加在外部配置文件来连接数据库

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <properties resource="db.properties"/>
 
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="${driver}"/>
                <property name="url" value="${url}"/>
                <property name="username" value="${username}"/>
                <property name="password" value="${password}"/>
            </dataSource>
        </environment>
    </environments>

    <mappers>
        <mapper resource="com/xiezhr/Dao/UserMapper.xml"></mapper>
    </mappers>
</configuration>
```

### **4. typeAliases（定义别名）**

- 类型别名是为java类型这只一个短的名字。意义在于用来减少过长类名的冗余

（1）自定义javabean别名

```xml
<typeAliases>
        <typeAlias type="com.xiezhr.pojo.User" alias="user"/>
</typeAliases>
```

如上配置之后就可以在任何地方用user 代替 com.xiezhr.pojo.User配置别名也可按照下面方式配置

（2）配置所有com.xiezhr.pojo 包下的Javabean别名为小写的类名

```xml
<typeAliases>
   <package name="com.xiezhr.pojo"/>
</typeAliases>
```

通过上述配置之后,以下的xml即等价

```xml
<select id="getUserList" resultType="user">
     select * from mybatis.user;
</select>

<select id="getUserList" resultType="com.xiezhr.pojo.user">
     select * from mybatis.user;
</select>
```

### **其他配置【设置】**

设置常用的有如下几个

- 懒加载
- 日志实现
- 缓存的开启与关闭 下面是一个完整的setting元素示例

```xml
<settings>
 <setting name="cacheEnabled" value="true"/>
 <setting name="lazyLoadingEnabled" value="true"/>
 <setting name="multipleResultSetsEnabled" value="true"/>
 <setting name="useColumnLabel" value="true"/>
 <setting name="useGeneratedKeys" value="false"/>
 <setting name="autoMappingBehavior" value="PARTIAL"/>
 <setting name="autoMappingUnknownColumnBehavior" value="WARNING"/>
 <setting name="defaultExecutorType" value="SIMPLE"/>
 <setting name="defaultStatementTimeout" value="25"/>
 <setting name="defaultFetchSize" value="100"/>
 <setting name="safeRowBoundsEnabled" value="false"/>
 <setting name="mapUnderscoreToCamelCase" value="false"/>
 <setting name="localCacheScope" value="SESSION"/>
 <setting name="jdbcTypeForNull" value="OTHER"/>
 <setting name="lazyLoadTriggerMethods" value="equals,clone,hashCode,toString"/>
</settings>
```



发布于 2020-12-20

