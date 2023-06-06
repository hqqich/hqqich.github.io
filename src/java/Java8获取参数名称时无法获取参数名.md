# Java8获取参数名称

## 前言

在mybatis的源码学习中，知道了mybatis可以开始在Java8将参数名称作为映射名称，Java8一项新的特性——在class文件中保留参数名。



> 1. File->Settings->Build,Execution,Deployment->Compiler->Java Compiler
>
> 2. 在 Additional command line parameters: 后面填上 -parameters，



## 通过反射获取参数名称

Java8中反射包出现了新的方法，Method.getParameters()，可以获取Parameter数组。而以前只能使用Method.getParameterTypes()获取Class数组。

```java
package org.example.proxy.dynamic;

import java.lang.reflect.Method;
import java.lang.reflect.Parameter;

public class TestMethodParams {
  public String test(String name, int age) {
    return name;
  }
  public static void main(String[] args) throws NoSuchMethodException, SecurityException {
    Method method = TestMethodParams.class.getMethod("test",String.class,int.class);
    for (Parameter p : method.getParameters()) {
      System.out.println("parameter: " + p.getType().getName() + ", " + p.getName());
    }
  }
}
```

 

如果我们不做其他设置，我们可以得到以下结果

parameter: java.lang.String, arg0
parameter: int, arg1
1
2
这是因为Java8必须得打开编译开关才能使用，打开之后结果如下：

## parameter: java.lang.String, name parameter: int, age javac编译器

使用原生编译器javac，直接使用javac `-parameters` ***.java,得到的class文件将保留参数名称。

## Eclipse

Window->Preferencces->Java->Compiler 然后勾选红框选中值

![这里写图片描述](https://img-blog.csdn.net/20180719225600503?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RpZWh1YW5nMzQyNg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

## Idea

File->Setting

![这里写图片描述](https://img-blog.csdn.net/20180719225700485?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RpZWh1YW5nMzQyNg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

 Build,Execution,Deployment->Java Compiler 在框内填写-parameters参数

![这里写图片描述](https://img-blog.csdn.net/20180719225827433?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RpZWh1YW5nMzQyNg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

 

## Maven 在pom.xml的中添加编译插件

```xml
<!--        <plugin>-->
<!--          <groupId>org.apache.maven.plugins</groupId>-->
<!--          <artifactId>maven-compiler-plugin</artifactId>-->
<!--          <version>3.3</version>-->
<!--          <configuration>-->
<!--            <source>1.8</source>-->
<!--            <target>1.8</target>-->
<!--            <compilerArgs>-->
<!--              <arg>-parameters</arg>-->
<!--            </compilerArgs>-->
<!--          </configuration>-->
<!--        </plugin>-->

        <plugin>
          <groupId>org.apache.maven.plugins</groupId>
          <artifactId>maven-compiler-plugin</artifactId>
          <configuration>
            <source>1.8</source>
            <target>1.8</target>
            <compilerArgs>
              <arg>-parameters</arg>
            </compilerArgs>
          </configuration>
        </plugin>
```

## 填好后，再将项目重新build一下，如下图（rebuild project）

![img](https://www.freesion.com/images/740/06beec0c809a222afb2d93c5406e9b7c.png)