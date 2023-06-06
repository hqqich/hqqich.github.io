# Lombok的基本使用

**以前的Java项目中，充斥着太多不友好的代码：POJO的getter/setter/toString；异常处理；I/O流的关闭操作等等，这些样板代码既没有技术含量，又影响着代码的美观，Lombok应运而生。**



# **为什么推荐使用Lombok:**

**[@Lombok有啥牛皮的？SpringBoot和IDEA官方都要支持它！](https://links.jianshu.com/go?to=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FYs6ksYasfUj7TSCGICHM8w)
**

> **最近[IDEA 2020最后一个版本发布了](https://links.jianshu.com/go?to=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzU1Nzg4NjgyMw%3D%3D%26mid%3D2247488358%26idx%3D1%26sn%3D6eee5162428ff64d6c5a2b72552c58db%26scene%3D21%23wechat_redirect)，已经内置了Lombok插件，SpringBoot 2.1.x之后的版本也在Starter中内置了Lombok依赖。为什么他们都要支持Lombok呢？今天我来讲讲Lombok的使用，看看它有何神奇之处！**



任何技术的出现都是为了解决某一类问题，如果在此基础上再建立奇技淫巧，不如回归Java本身，应该保持合理使用而不滥用。

***Lombok的使用非常简单：\***

### 1）引入相应的maven包

>   <dependency>
>
> ​     <groupId>org.projectlombok</groupId>
>
> ​     <artifactId>lombok</artifactId>
>
> ​     <version>1.16.18</version>
>
> ​     <scope>provided</scope>
>
>   </dependency>

Lombok的scope=provided，说明它只在编译阶段生效，不需要打入包中。事实正是如此，Lombok在编译期将带Lombok注解的Java文件正确编译为完整的Class文件。

## 2）添加IDE工具对Lombok的支持 

  IDEA中引入Lombok支持如下：

  点击File-- Settings设置界面，安装Lombok插件:





![img](https://upload-images.jianshu.io/upload_images/15718833-1afe50458f8d1450.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/864)

点击File-- Settings设置界面，开启 AnnocationProcessors：

![img](https://upload-images.jianshu.io/upload_images/15718833-9c160cda34dd360b.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/1072)

开启该项是为了让Lombok注解在编译阶段起到作用。

> Eclipse的Lombok插件安装可以自行百度，也比较简单，值得一提的是，由于Eclipse内置的编译器不是Oracle  javac，而是eclipse自己实现的Eclipse Compiler for Java  (ECJ).要让ECJ支持Lombok，需要在eclipse.ini配置文件中添加如下两项内容：
>
>   -Xbootclasspath/a:[lombok.jar所在路径

## 3）Lombok实现原理

自从Java 6起，javac就支持“JSR 269 Pluggable Annotation Processing API”规范，只要程序实现了该API，就能在javac运行的时候得到调用。

Lombok就是一个实现了"JSR 269 API"的程序。在使用javac的过程中，它产生作用的具体流程如下：

------

\1. javac对源代码进行分析，生成一棵抽象语法树(AST)

\2. javac编译过程中调用实现了JSR 269的Lombok程序

\3. 此时Lombok就对第一步骤得到的AST进行处理，找到Lombok注解所在类对应的语法树    (AST)，然后修改该语法树(AST)，增加Lombok注解定义的相应树节点

\4. javac使用修改后的抽象语法树(AST)生成字节码文件

------

## 4) Lombok注解的使用

#### POJO类常用注解:

**@Getter/@Setter: 作用类上，生成所有成员变量的getter/setter方法；作用于成员变量上，生成该成员变量的getter/setter方法。可以设定访问权限及是否懒加载等。**

> package com.kaplan.pojo;
>
> import lombok.*;
>
> import lombok.extern.log4j.Log4j;
>
> @Getter
>
> @Setter
>
> public class TestDemo {
>
> private String name;
>
> ​    private int age ;    private String email;
>
>    private String address;    private String password;
>
> ​    @Getter @Setter private boolean funny;
>
>    }

**@ToString：作用于类，覆盖默认的toString()方法，可以通过of属性限定显示某些字段，通过exclude属性排除某些字段。**

![img](https://upload-images.jianshu.io/upload_images/15718833-3a5bcb5ef8c44919.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/480)

**
@EqualsAndHashCode：作用于类，覆盖默认的equals和hashCode**

**@NonNull：主要作用于成员变量和参数中，标识不能为空，否则抛出空指针异常。**

![img](https://upload-images.jianshu.io/upload_images/15718833-a8b3130e33b0fd46.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/532)

@NoArgsConstructor, @RequiredArgsConstructor, @AllArgsConstructor：作用于类上，用于生成构造函数。有staticName、access等属性。

**staticName属性一旦设定，将采用静态方法的方式生成实例，access属性可以限定访问权限。**

**@NoArgsConstructor：生成无参构造器；**

**@RequiredArgsConstructor：生成包含final和@NonNull注解的成员变量的构造器；**

**@AllArgsConstructor：生成全参构造器**

![img](https://upload-images.jianshu.io/upload_images/15718833-174549c9dd605992.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/584)

**@Data：作用于类上，是以下注解的集合：@ToString @EqualsAndHashCode @Getter @Setter @RequiredArgsConstructor
**

**@Builder：作用于类上，将类转变为建造者模式**

**@Log：作用于类上，生成日志变量。针对不同的日志实现产品，有不同的注解：**

#### 其他重要注解：

**@Cleanup：自动关闭资源，针对实现了java.io.Closeable接口的对象有效，如：典型的IO流对象**

![img](https://upload-images.jianshu.io/upload_images/15718833-b12e7d13e5ca73b5.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/544)

**编译后结果如下：**

![img](https://upload-images.jianshu.io/upload_images/15718833-95f0e9bed44ae1d6.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/572)

**@SneakyThrows：可以对受检异常进行捕捉并抛出，可以改写上述的main方法如下：**

![img](https://upload-images.jianshu.io/upload_images/15718833-fcf6d6886fc8117a.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/536)

@Synchronized：作用于方法级别，可以替换synchronize关键字或lock锁，用处不大.