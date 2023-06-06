# SpringBoot整合Sqlite数据库流程

#### 1.创建项目

　　方式一： 通过网站https://start.spring.io/

　　方式二： 通过开发工具（IDEA或者Eclipse自行百度）

#### 2.修改pom.xml配置文件，添加必要的驱动包

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.3.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.xuanyin</groupId>
    <artifactId>homektv</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <packaging>jar</packaging>
    <!-- 统一管理jar包版本 -->
    <properties>
        <java.version>12</java.version>
        <mybatis.spring.boot.version>2.0.0</mybatis.spring.boot.version>
        <sqlite.jdbc.version>3.27.2.1</sqlite.jdbc.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>    
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>${mybatis.spring.boot.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <!-- druid 驱动 -->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>1.1.9</version>
        </dependency>
        <!-- sqlite3驱动包 -->
        <dependency>
            <groupId>org.xerial</groupId>
            <artifactId>sqlite-jdbc</artifactId>
            <version>${sqlite.jdbc.version}</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <fork>true</fork>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <configuration>
                    <archive>
                        <manifest>
                            <addClasspath>true</addClasspath>
                            <classpathPrefix></classpathPrefix>
                            <mainClass>com.xuanyin.HomektvApplication</mainClass>
                        </manifest>
                    </archive>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```



#### 3.添加项目的数据库配置文件application.yml



```yaml
# Tomcat
server:
    tomcat:
        uri-encoding: UTF-8
        max-threads: 1000
        min-spare-threads: 30
    port: 8088
#spring
spring:
    # 指定静态资源的路径
    resources:
        static-locations: classpath:/static/,classpath:/views/,file:${web.upload},file:${web.ueditorUpload}
    datasource:
        driver-class-name: org.sqlite.JDBC
# 方式一：  引用外部文件
#        url: jdbc:sqlite:D:/eclipse/xy.db
#方式二： 引用项目中的文件
        url: jdbc:sqlite::resource:static/sqlite/xy.db
        username: 
        password: 
               
# Mybatis配置
mybatis:
    mapperLocations: classpath:mapper/**/*.xml
    #configLocation: classpath:mybatis.xml
# sql打印
logging:
    level: debug
    level.com.xuanyin: debug
    path: logs/
#    file: admin.log
```



 

#### 4.添加测试Controller以及Server和Mapper等

　　注意各层级的注解的使用





# Spring Boot操作Sqlite数据库 从入门到跑路

# 创建SQLITE数据库

在`main`目录下方新建一个`DB`目录，并且在目录上右键点击，新建一个Sqlite数据库。
![img](http://www.yodfz.com/upload/20180828/1535424953000.png)

在右侧`DataBase`中点击数据库，右键`Open Console`,运行如下脚本，创建一个表：

```sql
create table hello
(
  id    INTEGER primary key,
  title varchar(150),
  text  TEXT
);
```

# 配置项目SQLITE

## 基本配置

### Maven配置

打开`pom.xml`文件，在`dependencies`节点中增加以下节点

```xml
<dependency>
    <groupId>org.xerial</groupId>
    <artifactId>sqlite-jdbc</artifactId>
    <version>3.21.0.1</version>
</dependency>
```

保存之后，稍等一会，IDEA会通过MAVEN拉取指定版本的包。
如果没有成功拉取到包，可以尝试手动拉取。
![img](http://www.yodfz.com/upload/20180828/1535428268000.png)
点击刷新，查看dependencies是否多了Sqlite包。

### Mybatis配置

创建`config`目录。新增`MyBatisConfig`文件,代码如下

```java
package com.example.demo.Config;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.sqlite.SQLiteDataSource;

import javax.sql.DataSource;

@Configuration
public class MyBatisConfig {
    @Autowired
    private DataSourceProperties dataSourceProperties;

    @Bean(name="dataSource")
    public DataSource dataSource() {
        SQLiteDataSource dataSource = new SQLiteDataSource();
        dataSource.setUrl(dataSourceProperties.getUrl());
        return dataSource;
    }

    public SqlSessionFactory sqlSessionFactory() throws Exception {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(dataSource());
        return sqlSessionFactoryBean.getObject();
    }
}
```

增加MyBatis的扫描配置文件，新建文件`MyBatisMapperScannerConfig`,代码如下:

```java
package com.example.demo.Config;

import org.mybatis.spring.mapper.MapperScannerConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class MyBatisMapperScannerConfig {
    @Bean
    public MapperScannerConfigurer mapperScannerConfigurer() {
        MapperScannerConfigurer mapperScannerConfigurer = new MapperScannerConfigurer();
        mapperScannerConfigurer.setSqlSessionFactoryBeanName("sqlSessionFactory");

        //com.example.demo.dal.mapper 这个包名是所有的Mapper.java文件所在的路径，该包下面的子包里面的文件同样会扫描到。
        //此包名与具体的应用的名称相关
        mapperScannerConfigurer.setBasePackage("com.example.demo.Mapper");

        return mapperScannerConfigurer;
    }

}
```

### 项目入口配置

打开`DemoApplication`文件。增加新的注解

```java
package com.example.demo;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

// 下面这一行为新增数据库关联注解
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@MapperScan("com.example.demo.mapper")
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

## 编写数据库对象模型

在目录中创建`Model`目录，并且添加`HelloModel`类文件。

在文件中输入数据库对象结构。

```java
package com.example.demo.Model;

public class HelloModel {
    private long Id;
    private String Title;
    private String Text;
}
```

在文件中，点击右键，选择`Generate` 选择 `Getter and Setter`自动生成对象的GET,SET。


处理完成之后的文件应该是这样的

```java
package com.example.demo.Model;

public class HelloModel {
    private long Id;

    public long getId() {
        return Id;
    }

    public void setId(long id) {
        Id = id;
    }

    public String getTitle() {
        return Title;
    }

    public void setTitle(String title) {
        Title = title;
    }

    public String getText() {
        return Text;
    }

    public void setText(String text) {
        Text = text;
    }

    private String Title;
    private String Text;
}
```

与Model同目录创建文件夹`Mapper`，新建一个`HelloMapper`类文件，编写以下内容。

```java
package com.example.demo.Mapper;

import com.example.demo.Model.*;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component
public interface HelloMapper {

    // 插入 并查询id 赋给传入的对象
    @Insert("INSERT INTO hello(key, value) VALUES(#{key}, #{value})")
    @SelectKey(statement = "SELECT seq id FROM sqlite_sequence WHERE (name = 'hello')", before = false, keyProperty = "id", resultType = int.class)
    int insert(HelloModel model);

    // 根据 ID 查询
    @Select("SELECT * FROM hello WHERE id=#{id}")
    HelloModel select(int id);

    // 查询全部
    @Select("SELECT * FROM hello")
    List<HelloModel> selectAll();

    // 更新 value
    @Update("UPDATE hello SET value=#{value} WHERE id=#{id}")
    int updateValue(HelloModel model);

    // 根据 ID 删除
    @Delete("DELETE FROM hello WHERE id=#{id}")
    int delete(Integer id);

}
```

同目录创建`Service`文件夹，新建`HelloService`类文件。编写以下代码

```java
package com.example.demo.Service;

import com.example.demo.Mapper.HelloMapper;
import com.example.demo.Model.HelloModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HelloService {

    private final HelloMapper dao;

    @Autowired
    public HelloService(HelloMapper dao) {
        this.dao = dao;
    }

    public boolean insert(HelloModel model) {
        return dao.insert(model) > 0;
    }

    public HelloModel select(int id) {
        return dao.select(id);
    }

    public List<HelloModel> selectAll() {
        return dao.selectAll();
    }

    public boolean updateValue(HelloModel model) {
        return dao.updateValue(model) > 0;
    }

    public boolean delete(Integer id) {
        return dao.delete(id) > 0;
    }
}
```

整个项目的Mapper,DAL文件架构看起来应该是这个样子的。

## 为项目指定数据库地址

打开`src\main\resources\application.properties`文件，配置数据库信息。

```ini
spring.datasource.driver-class-name=org.sqlite.JDBC
spring.datasource.url=jdbc:sqlite:E:/Java/demo1/src/main/db/myDb
spring.datasource.username=root
spring.datasource.password=root
```

# 编写第一个Hello World

新建一个`HelloWorld`的类。
![img](http://www.yodfz.com/upload/20180828/1535423961000.png)
将内容替换成如下

```java
package com.example.demo.Controller;

import org.springframework.web.bind.annotation.*;

@RestController
public class HelloWorld {
    @RequestMapping("/")
    public String Index() {
        return "Hello World";
    }
}
```

增加了一个名为`Index`的方法，并且通过注解设置了如何访问此方法的路径。

点击右上角按钮，运行这个项目。
![img](http://www.yodfz.com/upload/20180828/1535424142000.png)

打开浏览器，输入`http://localhost:8080`可以看到第一个控制器显示的内容。
![img](http://www.yodfz.com/upload/20180828/1535428445000.png)

# 输出数据库内容到浏览器

双击`hello`表,显示表内容
![img](http://www.yodfz.com/upload/20180828/1535428560000.png)
在表界面中，右键点击`Add New Row`,伪造几条数据进去
![img](http://www.yodfz.com/upload/20180828/1535428652000.png)

在`Controller/HelloWorld`文件中，新建`List`方法。

```java
package com.example.demo.Controller;

import com.example.demo.Model.HelloModel;
import com.example.demo.Service.HelloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class HelloWorld {
    private final HelloService HelloService;

    @Autowired
    public HelloWorld(HelloService HelloService) {
        this.HelloService = HelloService;

    }

    @RequestMapping("/")
    public String Index() {
        return "Hello World";
    }

    @RequestMapping("/list")
    public List<HelloModel> List() {
        return HelloService.selectAll();
    }
}
```

注意我们创建了`HelloWorld`的DAL层依赖注入。
重新运行整个项目，我们输入`http://localhost:8080/list`可以看到，服务端将数据库内容组合成了JSON输出给我们了。


# 创建请求对象

在`model`文件夹中新建`ReqBody`类文件。输入以下内容

```java
package com.example.demo.Model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ReqBody {

    /**
     * 分支名
     */
    private String Name;

    public String getName() {
        return Name;
    }
    @JsonProperty(value="Name")
    public void setName(String name) {
        Name = name;
    }

    public String getEmail() {
        return Email;
    }
    @JsonProperty(value="Email")
    public void setEmail(String email) {
        Email = email;
    }

    private String Email;


}
```

注意，关注JsonProperty这个注解，我看很多教程都只是说了，使用@RequestBody就可以将POST对象映射出来，但是，经过多次尝试，发现必须增加这个注解并且指定解析名字。@RequestBody才会正确的解析提交的Application/Json数据格式。

# 获取Post数据

我们回到`HelloWorld`这个Controller上。新增一个Post方法，并且指定他的访问路径。

```java
    @RequestMapping(value = "/post", method = RequestMethod.POST)
    public String Post(
            @RequestBody ReqBody map
    ) throws  IOException {
        return "输入的姓名是" + map.getName() + ",电子邮件是:" + map.getEmail();
    }
```

打开POSTMAN，POST请求这个接口。


# 后记

作为有一定的.net开发基础的前端攻城狮，对于写JAVA还是略有不擅长。主要需要知道什么是依赖注入，和控制反转。还有AOP编程。了解这些之后，对于写项目有莫大的帮助。

另外，十分感谢Java开发的朋友帮助解析困惑。@Alex @青龙

# 参考文章

[https://www.jianshu.com/p/418...](https://link.segmentfault.com/?enc=%2F4KAqv7sK9G9cYzYTHXEDg%3D%3D.kbktxcR%2BSdDnSZyTOctmNJ5GBoQrCDyP3KKNiyv9GirTN4Y%2FM%2F0u7Ni9e3Tstvx4)

# 项目地址

[https://github.com/yodfz/springboot-sqlite](https://link.segmentfault.com/?enc=rZlxLeuLmgybEA0bMRfLPA%3D%3D.8KXGOHjtlr5YPo%2FdHLtvqO7gtUWwjCcjFvwWEtK5Buwbv%2BIWN%2FW%2BJNM9Z89D6Hit)