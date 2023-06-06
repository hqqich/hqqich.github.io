# 在 Spring Boot 项目中实现文件下载功能

**（一）需求**

在您的 springboot 项目中，可能会存在让用户下载文档的需求，比如让用户下载 readme 文档来更好地了解该项目的概况或使用方法。

所以，您需要为用户提供可以下载文件的 API ，将用户希望获取的文件作为下载资源返回给前端。

**（二）代码**

**maven 依赖**

请您创建好一个 springboot 项目，一定要引入 web 依赖：

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

建议引入 thymeleaf 作为前端模板：

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

**配置 application**

在您的 `application.yml `中，进行如下属性配置：

```yml
file:
 doc-dir: doc/
```

该路径就是待下载文件存放在服务器上的目录，为相对路径，表示与当前项目（jar包）的相对位置。

![doc and jar](https://img.jbzj.com/file_images/article/201909/2019091909474013.png)

**将属性与 pojo 类自动绑定**

springboot 中的注解 `@ConfigurationProperties `可以将 application 中定义的属性与 pojo 类自动绑定。所以，我们需要定义一个 pojo 类来做 application 中 `file.doc-dir=doc/ `的配置绑定：

```java
@ConfigurationProperties(prefix = "file")
@Data
public class FileProperties {
  private String docDir;
}
```

注解 `@ConfigurationProperties(prefix = "file") `在 springboot 应用启动时将 file 为前缀的属性与 pojo 类绑定，也就是将 `application.yml `中的` file.doc-dir `与 FileProperties 中的字段 docDir 做了绑定。

**激活配置属性**

在启动类或其他配置类（@Configuration注解标记）上加入 @EnableConfigurationProperties 即可让 ConfigurationProperties 特性生效。

```java
@SpringBootApplication
@EnableConfigurationProperties({FileProperties.class})
public class AutoTestApplication {
  public static void main(String[] args) {
    SpringApplication.run(AutoTestApplication.class, args);
  }
}
```

**控制层**

在控制层我们将以 spring 框架的 ResponseEntity 类作为返回值传给前端，其中泛型为 spring io 包的 Resource 类，这意味着返回内容为 io 流资源；并在返回体头部添加附件，以便于前端页面下载文件。

```java
@RestController
@RequestMapping("file")
public class FileController {
  private static final Logger logger = LoggerFactory.getLogger(FileController.class);
  @Autowired
  private FileService fileService;
  @GetMapping("download/{fileName}")
  public ResponseEntity<Resource> downloadFile(@PathVariable String fileName,
                         HttpServletRequest request) {
    Resource resource = fileService.loadFileAsResource(fileName);
    String contentType = null;
    try {
      contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
    } catch (IOException e) {
      logger.error("无法获取文件类型", e);
    }
    if (contentType == null) {
      contentType = "application/octet-stream";
    }
    return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType(contentType))
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
        .body(resource);
  }
}
```

**服务层**

服务层的主要工作是把文件作为 IO 资源加载。注意，在 Service 实现类的构造方法中要使用 @Autowired 注入前面定义好的属性绑定类 FileProperties.

```java
@Service
public class FileServiceImpl implements FileService {
  private final Path filePath;
  @Autowired
  public FileServiceImpl(FileProperties fileProperties) {
    filePath = Paths.get(fileProperties.getDocDir()).toAbsolutePath().normalize();
  }
  @Override
  public Resource loadFileAsResource(String fileName) {
    Path path = filePath.resolve(fileName).normalize();
    try {
      UrlResource resource = new UrlResource(path.toUri());
      if (resource.exists()) {
        return resource;
      }
      throw new FileException("file " + fileName + " not found");
    } catch (MalformedURLException e) {
      throw new FileException("file " + fileName + " not found", e);
    }
  }
}
```

**自定义异常**

在服务层，我们抛出自定义的文件异常 FileException.

```java
public class FileException extends RuntimeException {
  public FileException(String message) {
    super(message);
  }
  public FileException(String message, Throwable cause) {
    super(message, cause);
  }
}
```

**前端**

在前端 html 页面，可以使用 a 标签来下载文件，注意在 a 标签中定义 download 属性来规定这是一个下载文件。

```html
<a href="/file/download/readme.pdf" rel="external nofollow" download>下载使用手册</a>
```

**（三）参考博客**

更多关于 springboot 项目上传、下载文件的功能请参考：[Spring Boot File Upload / Download Rest API Example](https://www.callicoder.com/spring-boot-file-upload-download-rest-api-example/)

**总结**

以上所述是小编给大家介绍的在 Spring Boot 项目中实现文件下载功能,希望对大家有所帮助，如果大家有任何疑问请给我留言，小编会及时回复大家的。在此也非常感谢大家对脚本之家网站的支持！
如果你觉得本文对你有帮助，欢迎转载，烦请注明出处，谢谢！