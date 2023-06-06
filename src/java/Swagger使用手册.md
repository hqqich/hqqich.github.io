> ### OAS
>
> OAS是OpenAPI Specification的简称，可以翻译为OpenAPI规范，它是定义API的一种规范，它的前身是Swagger规范。
>
> ### Swagger
>
> Swagger是一个工具、一个项目、一个流行的API开发框架(当然，我们上面也说了Swagger是规范，但是后面演变成了OAS)，这个框架以OAS为基础，对整个API的开发周期都提供了相应的解决方案，是一个非常庞大的项目（包括Swagger Editor、Swagger UI、Swagger Codegen、Swagger Inspector）。
>
> ### Springfox
>
> Springfox是践行OAS的一个项目，它将Swagger融合进流行的Spring框架，根据OpenAPI规范，帮助开发者自动生成API文档。Springfox是由Marty Pitt创建的项目swagger-springmvc发展而来。它其中有一个组件叫springfox-swagger2，springfox-swagger2是依赖OSA规范文档，也就是一个描述API的json文件，而这个组件的功能就是帮助我们自动生成这个json文件，我们会用到的另外一个组件springfox-swagger-ui就是将这个json文件解析出来，用一种更友好的方式呈现出来。

# Swagger2

> 认识Swagger:
>  Swagger 是一个规范和完整的框架，用于生成、描述、调用和可视化 RESTful 风格的 Web 服务。总体目标是使客户端和文件系统作为服务器以同样的速度来更新。文件的方法，参数和模型紧密集成到服务器端的代码，允许API来始终保持同步。

作用：
 \1. 接口的文档在线自动生成。
 \2. 功能测试。

Swagger使用的注解及其说明：

##### 主要配置属性如下：主要说一些常用的配置

`@Api(tags = "测试接口")`：用在请求的controller类上，表示对类的说明，tags=“说明该类的作用，可以在UI界面上看到的注解”

`@ApiOperation("测试")`：用在请求的方法上；value=方法的用途；notes=“方法的备注”

`@ApiResponses`：用在请求的方法上，表示一组响应;

 `@ApiResponse`：用在@ApiResponses中，一般用于表达一个错误的响应信息
​		code：请求的状态码，例如 200、401、403 ……
​		message：信息，例如"请求参数没填好"

`@ApiImplicitParams`：用在请求的方法上，表示一组参数说明;

`@ApiImplicitParam`：用在方法上，表示一个请求参数描述；多在参与，用在@ApiImplicitParams中；

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ApiImplicitParam {
   	//参数名
    String name() default "";
    //参数描述
    String value() default "";
    //参数默认值
    String defaultValue() default "";

    String allowableValues() default "";
   	//是否必传
    boolean required() default false;

    String access() default "";
   	//允许多个，当传入的参数为数组或者list时候，指定参数类型dataType()，属性设置为true；
    boolean allowMultiple() default false;
		//数据类型：这可以是类名或基础类型。
    String dataType() default "";
		//数据的class类
    Class<?> dataTypeClass() default Void.class;
    /**
    	请求参数类型：
    				path：请求参数的获取：@PathVariable
    				query：请求参数的获取：@RequestParam
    				body：@RequestBody
    				header：请求参数的获取：@RequestHeader
    				form：表单数据
     */
    String paramType() default "";
    /** a single example for non-body type parameters*/
    String example() default "";
   //Examples for the parameter.  Applies only to BodyParameters
    Example examples() default @Example(value = @ExampleProperty(mediaType = "", value = ""));
  	//Adds the ability to override the detected type
    String type() default "";
		//Adds the ability to provide a custom format
    String format() default "";
		//Adds the ability to set a format as empty
    boolean allowEmptyValue() default false;
		//adds ability to be designated as read only.
    boolean readOnly() default false;
		//adds ability to override collectionFormat with `array` types
    String collectionFormat() default "";
}
```
`@ApiModel`:用于类上，表示一个返回响应数据的信息，或者传入的参数对象的内容：例如post请求；

`@ApiModelProperty`：用在属性上，描述响应类的属性

```dart
@Api：用在类上，说明该类的作用。
    tags="说明该类的作用，可以在UI界面上看到的注解"
    value="该参数没什么意义，在UI界面上也看到，所以不需要配置"

@ApiOperation：注解来给API增加方法说明。
  value="说明方法的用途、作用"
  notes="方法的备注说明"
    
@ApiImplicitParams : 用在方法上包含一组参数说明。
    @ApiImplicitParam：用来注解来给方法入参增加说明。
    参数：
       ·paramType：指定参数放在哪个地方
          ··header：请求参数放置于Request Header，使用@RequestHeader获取
          ··query：请求参数放置于请求地址，使用@RequestParam获取
          ··path：（用于restful接口）-->请求参数的获取：@PathVariable
          ··body：（不常用）
          ··form（不常用）
       ·name：参数名
       ·dataType：参数类型,默认是String(其他值dataType = "Long"、dataType = "Integer"、....)
       ·required：参数是否必须传(true | false)
       ·value：说明参数的意思
       ·defaultValue：参数的默认值

@ApiResponses：用于表示一组响应
    @ApiResponse：用在@ApiResponses中，一般用于表达一个错误的响应信息
          ——code：数字，例如400
          ——message：信息，例如"请求参数异常!"
          ——response：抛出异常的类   

@ApiModel：描述一个Model的信息（一般用在请求参数无法使用@ApiImplicitParam注解进行描述的时候）

@ApiModelProperty：描述一个model的属性
```

#### 第一步：导入依赖包(Maven方式)

```xml
<!-- swagger依赖 -->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.2.2</version>
</dependency>
<!-- UI依赖 -->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger-ui</artifactId>
    <version>2.2.2</version>
</dependency>
```

#### 第二步：创建Swagger2配置类

```dart
@Configuration
@EnableSwagger2
public class Swagger2 {
    
    /**
     * 创建API应用
     * apiInfo() 增加API相关信息
     * 通过select()函数返回一个ApiSelectorBuilder实例,用来控制哪些接口暴露给Swagger来展现，
     * 本例采用指定扫描的包路径来定义指定要建立API的目录。
     * 
     * @return
     */
    @Bean
    public Docket createRestApi() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.swaggerTest.controller"))
                .paths(PathSelectors.any())
                .build();
    }
    
    /**
     * 创建该API的基本信息（这些基本信息会展现在文档页面中）
     * 访问地址：http://项目实际地址/swagger-ui.html
     * @return
     */
    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("Spring Boot中使用Swagger2构建RESTful APIs")
                .description("更多请关注http://www.baidu.com")
                .termsOfServiceUrl("http://www.baidu.com")
                .contact("sunf")
                .version("1.0")
                .build();
    }
}
```

如上代码所示，通过createRestApi函数创建Docket的Bean之后，apiInfo()用来创建该Api的基本信息（这些基本信息会展现在文档页面中）。

#### 第三步：使用Swagger提供的注解

```kotlin
/**
 * @Auther: 折戟沉沙
 * @Description: 简书-演示
 * @Version: 1.0
 */
@RestController
@RequestMapping("/oss")
@Api(value = "简书-演示",description = "用来演示Swagger的一些注解")
public class TestController {


    @ApiOperation(value="修改用户密码", notes="根据用户id修改密码")
    @ApiImplicitParams({
        @ApiImplicitParam(paramType="query", name = "userId", value = "用户ID", required = true, dataType = "Integer"),
        @ApiImplicitParam(paramType="query", name = "password", value = "旧密码", required = true, dataType = "String"),
        @ApiImplicitParam(paramType="query", name = "newPassword", value = "新密码", required = true, dataType = "String")
    })
    @RequestMapping("/updatePassword")
    public String updatePassword(@RequestParam(value="userId") Integer userId, @RequestParam(value="password") String password, 
            @RequestParam(value="newPassword") String newPassword){
         if(userId <= 0 || userId > 2){
             return "未知的用户";
         }
         if(StringUtils.isEmpty(password) || StringUtils.isEmpty(newPassword)){
             return "密码不能为空";
         }
         if(password.equals(newPassword)){
             return "新旧密码不能相同";
         }
         return "密码修改成功!";
     }
}
```

启动Spring Boot程序,访问 http://locahost:8080/swagger-ui.html

参考文献：
 1.https://blog.csdn.net/sanyaoxu_2/article/details/80555328
 Swagger官网 ：http://swagger.io/
 Spring Boot & Swagger UI ： http://fruzenshtein.com/spring-boot-swagger-ui/
 Github：https://github.com/swagger-api/swagger-core/wiki/Annotations





# Swagger3(springboot)

## 一、引入依赖

```xml
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-boot-starter</artifactId>
    <version>3.0.0</version>
</dependency>
```

## 二、Application启动应用类上面加入@EnableOpenApi注解

```java
@SpringBootApplication
@EnableOpenApi
public class SpringbootreactApplication {
  public static void main(String[] args) {
    SpringApplication.run(SpringbootreactApplication.class, args);
  }
}
```

## 三、Swagger3Config的配置

```java
import io.swagger.annotations.ApiOperation;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

/**
 * 基于Swagger生成API文档
 */
@Configuration
public class Swagger3Config {

    @Bean
    public Docket createRestApi() {
        //swagger设置，基本信息
        return new Docket(DocumentationType.OAS_30)
            .groupName("com.example.springbootreact.controller")
            .apiInfo(apiInfo())
            .select()
            //RequestHandlerSelectors配置要扫描接口的方式，可点击该源码查看扫描方式
            //basePackage：指定扫描包；any（）扫描全部；none（）：不扫描；
            .apis(RequestHandlerSelectors.basePackage("com.example.springbootreact.controller"))
            //接口URI路径设置，ang是全路径，也可以通过PathSelectors.regex()正则匹配
            .paths(PathSelectors.any())
            .build();
    }



    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
            .title("员工管理")
            .description("员工管理数据接口")
//            .contact(new Contact("联系人", "www.baidu.com", "286279186@qq.com"))
            .version("1.0")
            .build();
    }


    @Bean
    public Docket docket1() {
        return new Docket(DocumentationType.SWAGGER_2)
            .groupName("ApiOperation")
            .apiInfo(apiInfo())
            .select()
            //设置通过什么方式定位需要自动生成文档的接口，这里是使用过@ApiOperation注解
            .apis(RequestHandlerSelectors.withMethodAnnotation(ApiOperation.class))
            .paths(PathSelectors.any())
            .build();
    }

    @Bean
    public Docket docket2() {
        return new Docket(DocumentationType.OAS_30)
            .groupName("Operation")
            .apiInfo(apiInfo())
            .select()
            //设置通过什么方式定位需要自动生成文档的接口，这里是使用过@Operation注解
            .apis(RequestHandlerSelectors.withMethodAnnotation(Operation.class))
            .paths(PathSelectors.any())
            .build();
    }
}
```

## 四、controller中使用注解

```java
package com.example.springbootreact.controller;

import com.example.springbootreact.exception.ResourceNotFoundException;
import com.example.springbootreact.model.Employee;
import com.example.springbootreact.repository.EmployeeRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@Api(tags = "Employee")
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/")
public class EmployeeController {

  @Autowired
  private EmployeeRepository employeeRepository;

  @ApiOperation("获取所有信息")
  @ApiResponses(value = {
      @ApiResponse(code = 200, message = "成功", reference = "http://www.baidu.com"),
      @ApiResponse(code = 404, message = "请求错误")
  })
  @GetMapping("/employees")
  public List<Employee> getAllEmployees(){
    return employeeRepository.findAll();
  }

  @ApiOperation(httpMethod = "POST", value = "添加一个员工")
  @PostMapping("/employees")
  public Employee createEmployee(@RequestBody Employee employee) {
    return employeeRepository.save(employee);
  }

  @ApiOperation(httpMethod = "GET", value = "通过指定id获取信息")
  @ApiImplicitParams(value = {
      @ApiImplicitParam(name = "id", value = "唯一ID", required = true, paramType = "path", dataType = "Long")
  })
  @GetMapping("/employees/{id}")
  public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
    Employee employee = employeeRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("员工ID不存在 :" + id));
    return ResponseEntity.ok(employee);
  }

  @ApiOperation(httpMethod = "PUT", value = "更新一条数据")
  @ApiImplicitParams(value = {
      @ApiImplicitParam(name = "id", value = "唯一ID", required = true, paramType = "path", dataType = "Long")
  })
  @PutMapping("/employees/{id}")
  public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee employeeDetails){
    Employee employee = employeeRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("员工ID不存在 :" + id));

    employee.setFirstName(employeeDetails.getFirstName());
    employee.setLastName(employeeDetails.getLastName());
    employee.setEmailId(employeeDetails.getEmailId());

    Employee updatedEmployee = employeeRepository.save(employee);
    return ResponseEntity.ok(updatedEmployee);
  }

  @ApiOperation(httpMethod = "DELETE", value = "通过ID删除一条数据")
  @ApiImplicitParams(value = {
      @ApiImplicitParam(name = "id", value = "唯一ID", required = true, paramType = "path", dataType = "Long")
  })
  @DeleteMapping("/employees/{id}")
  public ResponseEntity<Map<String, Boolean>> deleteEmployee(@PathVariable Long id){
    Employee employee = employeeRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("员工ID不存在 :" + id));

    employeeRepository.delete(employee);
    Map<String, Boolean> response = new HashMap<>();
    response.put("deleted", Boolean.TRUE);
    return ResponseEntity.ok(response);
  }
}
```

## 五、传输时的实体类添加注解

```java
package com.example.springbootreact.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
/**
 * Created by Administrator on 2021/10/16 is 14:11.
 *
 * @Description
 * @Author hqqich <hqqich1314@outlook.com>
 * @Version V1.0.0
 * @Since 1.0
 * @Date 2021/10/16
 */
@ApiModel(value = "请求实体{employees}")
@Entity
@Table(name = "employees")
public class Employee {

  @ApiModelProperty("唯一ID")
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @ApiModelProperty("名字")
  @Column(name = "first_name")
  private String firstName;

  @ApiModelProperty("姓氏")
  @Column(name = "last_name")
  private String lastName;

  @ApiModelProperty("邮箱")
  @Column(name = "email_id")
  private String emailId;

  public Employee() {

  }

  public Employee(String firstName, String lastName, String emailId) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
    this.emailId = emailId;
  }
  public long getId() {
    return id;
  }
  public void setId(long id) {
    this.id = id;
  }
  public String getFirstName() {
    return firstName;
  }
  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }
  public String getLastName() {
    return lastName;
  }
  public void setLastName(String lastName) {
    this.lastName = lastName;
  }
  public String getEmailId() {
    return emailId;
  }
  public void setEmailId(String emailId) {
    this.emailId = emailId;
  }

  @Override
  public String toString() {
    return "Employee{" +
        "id=" + id +
        ", firstName='" + firstName + '\'' +
        ", lastName='" + lastName + '\'' +
        ", emailId='" + emailId + '\'' +
        '}';
  }
}

```

## 六、技巧

- ```properties
#是否激活 swagger
springfox.documentation.enabled=true




- Swagger页面地址：`http://localhost:8081/swagger-ui/`

- 忽略接口
  ```java
  @ApiIgnore

- 1. entity中的@ApiModel注解中的参数加了和没加一个效果，所以，直接写@ApiModel就可以了。
  2. `@ApiParam(value = “文章ID”)` 注解中的value参数只有和：@PathVariable(value = “id”) 以及@RequestParam使用，value参数才会有效果。其他没有

- base-error-controller

  ```java
  SwaggerConfig新增指定包
  .apis(RequestHandlerSelectors.basePackage("xx.xx.xx.controller"))
  ```



## 七、使用 swagger3 注解代替 swagger2注解

> 如果你希望为文档加上更详细的中文注释，使用如下注解（对比Swagger2注解使用方法使用即可）。但是笔者觉得没有必要学习这东西，意义不大。注意变量、接口命名规范，英文的接口文档就挺好。

用 swagger 3 的注解（已经在上面maven包引入）代替 swagger 2 的注解，swagger 3 注解的包路径为io.swagger.v3.oas.annotations。

| Swagger2注解       | OpenAPI3(swagger3)注解                                       |
| :----------------- | :----------------------------------------------------------- |
| @ApiParam          | @Parameter                                                   |
| @ApiOperation      | @Operation                                                   |
| @Api               | @Tag                                                         |
| @ApiImplicitParams | @Parameters                                                  |
| @ApiImplicitParam  | @Parameter                                                   |
| @ApiIgnore         | @Parameter(hidden = true) or @Operation(hidden = true) or @Hidden |
| @ApiModel          | @Schema                                                      |
| @ApiModelProperty  | @Schema                                                      |

更多内容指引官网：https://springdoc.org/

## 八、使用swagger需要注意的问题

- 对于只有一个HttpServletRequest参数的方法,如果参数小于5个，推荐使用 @ApiImplicitParams的方式单独封装每一个参数；如果参数大于5个，采用定义一个对象去封装所有参数的属性，然后使用@APiParam的方式
- 默认的访问地址：ip:port/swagger-ui.html#/,但是在shiro中,会拦截所有的请求，必须加上默认访问路径（比如项目中，就是ip:port/context/swagger-ui.html#/），然后登陆后才可以看到
- 在GET请求中，参数在Body体里面,不能使用@RequestBody。在POST请求，可以使用@RequestBody和@RequestParam，如果使用@RequestBody，对于参数转化的配置必须统一
- controller必须指定请求类型，否则swagger会把所有的类型(6种)都生成出来
- swagger在生产环境不能对外暴露,可以使用@Profile({“dev”, “prod”,“pre”})指定可以使用的环境

## 总结

> 现在让我们来总结一下。首先有人定义了一个API文档产生的规范，前期叫Swagger，后面贡献给了Linux基金会，逐渐演变成OpenAPI Specification，逐渐成为世界级别的规范，即OAS，它定义了一种JSON格式或者YAML格式的API文档文件格式；而Swagger提供了Swagger Editor来帮助开发人员熟悉和编写正确的符合OpenAPI规范的API文档文件，这个文件可以使JSON格式的，也可以是YAML格式的；Swagger又提供了Swagger Codegen来生成API文档对应的代码，Swagger Codegen来展示API文档，Swagger Inspector来测试API对应的代码；最后Springfox结合Spring与Swagger，帮助开发人员自动生成对应代码的对应API。

参考：

```dart
https://swagger.io/
http://springfox.github.io/springfox/docs/snapshot/
http://www.cnblogs.com/getupmorning/p/7267076.html
http://springfox.github.io/springfox/
https://petstore.swagger.io/
https://editor.swagger.io/
https://www.jianshu.com/p/cdb41c9e52e2
https://github.com/swagger-api
https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md
```







# 使用 OpenAPI3 快速生成 REST API 文档(springdoc-openapi)

> [springdoc-openapi](https://link.zhihu.com/?target=https%3A//github.com/springdoc/springdoc-openapi) 是一个在 Spring Boot 项目中快速生成 API 文档的 Java 库。[springdoc-openapi](https://link.zhihu.com/?target=https%3A//github.com/springdoc/springdoc-openapi) 通过在运行时检查检查程序中的 Spring 配置，类的定义和各种注解来推导 API 的语义。

## 集成

默认的情况下，我们需要先将 [springdoc-openapi](https://link.zhihu.com/?target=https%3A//github.com/springdoc/springdoc-openapi) 添加到项目依赖列表中：

```xml
<dependency>
  <groupId>org.springdoc</groupId>
  <artifactId>springdoc-openapi-ui</artifactId>
  <version>1.4.3</version>
</dependency>
```

然后启动应用，打开地址 [http://server:port/swagger-ui.html](https://link.zhihu.com/?target=http%3A//server%3Aport/context-path/swagger-ui.html) 就可以访问到 API 接口的 UI 页面了。

## 配置

[springdoc-openapi](https://link.zhihu.com/?target=https%3A//github.com/springdoc/springdoc-openapi) 支持通过 Spring Boot 的 Bean 对文档的一些元数据进行配置。下面是两个常用的配置，这些 Bean 使用 `@Bean` 注解声明在任何一个 `@Configuration` 注解的配置类中即可：

使用 `GroupedOpenApi` 对 API 进行分组，防止所有 API 生成在一个页面中，导致阅读体验很差。

```java
@Bean
public GroupedOpenApi actuatorApi() {
    return GroupedOpenApi.builder()
            .group("Actuator")
            .pathsToMatch("/actuator/**")
            .pathsToExclude("/actuator/health/*")
            .build();
}
```

使用 `OpenAPI` 配置 API 的元数据信息：

```java
@Bean
public OpenAPI customOpenAPI(BuildProperties buildProperties) {
    return new OpenAPI()
            .components(new Components()
                .addSecuritySchemes("basicScheme", new SecurityScheme()
                    .type(SecurityScheme.Type.HTTP).scheme("basic")))
            .info(new Info()
                .title("Petstore API")
                .version(buildProperties.getVersion())
                .description(
                    "This is a sample server Petstore server. You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/). For this sample, you can use the api key `special-key` to test the authorization filters.")
                    .termsOfService("http://swagger.io/terms/")
                    .license(new License().name("Apache 2.0").url("http://springdoc.org")));
}
```

注意 `BuildProperties` 进行下面的配置才能生成对于的配置文件 `build-info.properties`，在 Spring Boot 中该文件的默认地址是 `classpath:META-INF/build-info.properties`：

Maven:

```xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <executions>
        <execution>
            <id>build-info</id>
            <goals>
                <goal>build-info</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

Gradle:

```groovy
springBoot {
    buildInfo()
}
```

## 使用注解声明 API

这里通过一个 Controller 类，一个 UserEntity 来演示如何通过注解完成文档的编写。代码的逻辑很诡异，但这个不是重点，重点是如何使用 Swagger3 的相关注解声明 API 接口。顺带提一下，这些注解均是遵循规范 [OpenAPI-Specification](https://link.zhihu.com/?target=https%3A//github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.3.md) 实现的，所以我们可以通过阅读该规范来了解如何使用这些注解。

UserController.java

```java
package cn.mingfer.demo;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("user")
@Tag(name = "user", description = "用户信息接口")
public class UserController {


    @PostMapping("test")
    @Operation(description = "用户信息测试")
    @Parameters({
            @Parameter(name = "uid", description = "用户 ID", required = true, in = ParameterIn.PATH),
            @Parameter(name = "name", description = "用户名称", required = true)
    })
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "操作成功", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = UserEntity.class, type = "array"))
            }),
            @ApiResponse(responseCode = "400", description = "参数错误", content = {
                    @Content(mediaType = "application/json", schema = @Schema())
            })
    })
    public List<UserEntity> test(@PathVariable("uid") String uid,
                       @RequestParam("name") String name,
                       @RequestBody UserEntity entity) {
        List<UserEntity> entities = new ArrayList<>();
        entities.add(new UserEntity(uid, name));
        entities.add(entity);
        return entities;
    }

}
```

UserEntity.java

```java
package cn.mingfer.demo;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "用户信息实体")
public class UserEntity {

    @Schema(description = "用户 ID", type = "string", required = true, minLength = 4, maxLength = 12, example = "10086")
    private final String uid;

    @Schema(description = "用户名称", required = true, example = "mingfer.cn")
    private final String name;

    public UserEntity(@JsonProperty("uid") String uid,
                      @JsonProperty("name") String name) {
        this.uid = uid;
        this.name = name;
    }

    public String getUid() {
        return uid;
    }

    public String getName() {
        return name;
    }
}
```

