# Spring Boot中使用JavaMailSender发送邮件



相信使用过Spring的众多开发者都知道Spring提供了非常好用的`JavaMailSender`接口实现邮件发送。在Spring Boot的Starter模块中也为此提供了自动化配置。下面通过实例看看如何在Spring Boot中使用`JavaMailSender`发送邮件。

## 快速入门

在Spring Boot的工程中的`pom.xml`中引入`spring-boot-starter-mail`依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

如其他自动化配置模块一样，在完成了依赖引入之后，只需要在`application.properties`中配置相应的属性内容。

下面我们以QQ邮箱为例，在`application.properties`中加入如下配置（注意替换自己的用户名和密码）：

```properties
spring.mail.host=smtp.qq.com
spring.mail.username=用户名
spring.mail.password=密码
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
```

通过单元测试来实现一封简单邮件的发送：

```java
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
public class ApplicationTests {

	@Autowired
	private JavaMailSender mailSender;

	@Test
	public void sendSimpleMail() throws Exception {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom("dyc87112@qq.com");
		message.setTo("dyc87112@qq.com");
		message.setSubject("主题：简单邮件");
		message.setText("测试邮件内容");

		mailSender.send(message);
	}

}
```

到这里，一个简单的邮件发送就完成了，运行一下该单元测试，看看效果如何？

> 由于Spring Boot的starter模块提供了自动化配置，所以在引入了`spring-boot-starter-mail`依赖之后，会根据配置文件中的内容去创建`JavaMailSender`实例，因此我们可以直接在需要使用的地方直接`@Autowired`来引入邮件发送对象。

## 进阶使用

在上例中，我们通过使用`SimpleMailMessage`实现了简单的邮件发送，但是实际使用过程中，我们还可能会带上附件、或是使用邮件模块等。这个时候我们就需要使用`MimeMessage`来设置复杂一些的邮件内容，下面我们就来依次实现一下。

#### 发送附件

在上面单元测试中加入如下测试用例（通过MimeMessageHelper来发送一封带有附件的邮件）：

```java
@Test
public void sendAttachmentsMail() throws Exception {

	MimeMessage mimeMessage = mailSender.createMimeMessage();

	MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
	helper.setFrom("dyc87112@qq.com");
	helper.setTo("dyc87112@qq.com");
	helper.setSubject("主题：有附件");
	helper.setText("有附件的邮件");

	FileSystemResource file = new FileSystemResource(new File("weixin.jpg"));
	helper.addAttachment("附件-1.jpg", file);
	helper.addAttachment("附件-2.jpg", file);

	mailSender.send(mimeMessage);

}
```

#### 嵌入静态资源

除了发送附件之外，我们在邮件内容中可能希望通过嵌入图片等静态资源，让邮件获得更好的阅读体验，而不是从附件中查看具体图片，下面的测试用例演示了如何通过`MimeMessageHelper`实现在邮件正文中嵌入静态资源。

```java
@Test
public void sendInlineMail() throws Exception {

	MimeMessage mimeMessage = mailSender.createMimeMessage();

	MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
	helper.setFrom("dyc87112@qq.com");
	helper.setTo("dyc87112@qq.com");
	helper.setSubject("主题：嵌入静态资源");
	helper.setText("<html><body><img src=\"cid:weixin\" ></body></html>", true);

	FileSystemResource file = new FileSystemResource(new File("weixin.jpg"));
	helper.addInline("weixin", file);

	mailSender.send(mimeMessage);

}
```

**这里需要注意的是`addInline`函数中资源名称`weixin`需要与正文中`cid:weixin`对应起来**

#### 模板邮件

通常我们使用邮件发送服务的时候，都会有一些固定的场景，比如重置密码、注册确认等，给每个用户发送的内容可能只有小部分是变化的。所以，很多时候我们会使用模板引擎来为各类邮件设置成模板，这样我们只需要在发送时去替换变化部分的参数即可。

在Spring Boot中使用模板引擎来实现模板化的邮件发送也是非常容易的，下面我们以velocity为例实现一下。

引入velocity模块的依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-velocity</artifactId>
</dependency>
```

在`resources/templates/`下，创建一个模板页面`template.vm`：

```html
<html>
<body>
    <h3>你好， ${username}, 这是一封模板邮件!</h3>
</body>
</html>
```

**我们之前在Spring Boot中开发Web应用时，提到过在Spring Boot的自动化配置下，模板默认位于`resources/templates/`目录下**

最后，我们在单元测试中加入发送模板邮件的测试用例，具体如下：

```java
@Test
public void sendTemplateMail() throws Exception {

	MimeMessage mimeMessage = mailSender.createMimeMessage();

	MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
	helper.setFrom("dyc87112@qq.com");
	helper.setTo("dyc87112@qq.com");
	helper.setSubject("主题：模板邮件");

	Map<String, Object> model = new HashedMap();
	model.put("username", "didi");
	String text = VelocityEngineUtils.mergeTemplateIntoString(
			velocityEngine, "template.vm", "UTF-8", model);
	helper.setText(text, true);

	mailSender.send(mimeMessage);
}
```

尝试运行一下，就可以收到内容为`你好， didi, 这是一封模板邮件!`的邮件。这里，我们通过传入username的参数，在邮件内容中替换了模板中的`${username}`变量。

## 代码示例

本文的相关例子可以查看下面仓库中的`chapter4-5-1`目录：

- Github：[https://github.com/dyc87112/SpringBoot-Learning](https://github.com/dyc87112/SpringBoot-Learning/tree/1.x)
- Gitee：[https://gitee.com/didispace/SpringBoot-Learning](https://gitee.com/didispace/SpringBoot-Learning/tree/1.x)

**如果您觉得本文不错，欢迎`Star`支持，您的关注是我坚持的动力！**









# [SpringBoot 教程之发送邮件](https://www.cnblogs.com/jingmoxukong/p/10249093.html)

## 1. 简介

Spring Boot 收发邮件最简便方式是通过 `spring-boot-starter-mail`。

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

spring-boot-starter-mail 本质上是使用 JavaMail(javax.mail)。如果想对 JavaMail 有进一步了解，可以参考： [JavaMail 使用指南](https://dunwu.github.io/java-tutorial/#/javalib/javamail)

## 2. API

Spring Framework 提供了一个使用 `JavaMailSender` 接口发送电子邮件的简单抽象，这是发送邮件的核心 API。

`JavaMailSender` 接口提供的 API 如下：

![img](http://dunwu.test.upcdn.net/snap/20190110111102.png)

## 3. 配置

Spring Boot 为 `JavaMailSender` 提供了自动配置以及启动器模块。

如果 `spring.mail.host` 和相关库（由 spring-boot-starter-mail 定义）可用，则 Spring Boot 会创建默认 `JavaMailSender`（如果不存在）。可以通过 `spring.mail` 命名空间中的配置项进一步自定义发件人。
特别是，某些默认超时值是无限的，您可能希望更改它以避免线程被无响应的邮件服务器阻塞，如以下示例所示：

```properties
spring.mail.properties.mail.smtp.connectiontimeout=5000
spring.mail.properties.mail.smtp.timeout=3000
spring.mail.properties.mail.smtp.writetimeout=5000
```

也可以使用 JNDI 中的现有会话配置 `JavaMailSender`：

```
spring.mail.jndi-name=mail/Session
```

以下为 Spring Boot 关于 Mail 的配置：

有关更多详细信息，请参阅 [`MailProperties`](https://github.com/spring-projects/spring-boot/tree/v2.1.1.RELEASE/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/mail/MailProperties.java)。

```properties
# Email (MailProperties)
spring.mail.default-encoding=UTF-8 # Default MimeMessage encoding.
spring.mail.host= # SMTP server host. For instance, `smtp.example.com`.
spring.mail.jndi-name= # Session JNDI name. When set, takes precedence over other Session settings.
spring.mail.password= # Login password of the SMTP server.
spring.mail.port= # SMTP server port.
spring.mail.properties.*= # Additional JavaMail Session properties.
spring.mail.protocol=smtp # Protocol used by the SMTP server.
spring.mail.test-connection=false # Whether to test that the mail server is available on startup.
spring.mail.username= # Login user of the SMTP server.
```

## 4. 实战

### 4.1. 引入依赖

```xml
<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
  </dependency>

  <dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
  </dependency>
  <dependency>
    <groupId>com.github.dozermapper</groupId>
    <artifactId>dozer-spring-boot-starter</artifactId>
    <version>6.4.0</version>
  </dependency>
</dependencies>
```

### 4.2. 配置邮件属性

在 `src/main/resources` 目录下添加 `application-163.properties` 配置文件，内容如下：

```properties
spring.mail.host = smtp.163.com
spring.mail.username = xxxxxx
spring.mail.password = xxxxxx
spring.mail.properties.mail.smtp.auth = true
spring.mail.properties.mail.smtp.starttls.enable = true
spring.mail.properties.mail.smtp.starttls.required = true
spring.mail.default-encoding = UTF-8

mail.domain = 163.com
mail.from = ${spring.mail.username}@${mail.domain}
```

注：需替换有效的 `spring.mail.username`、`spring.mail.password`。

`application-163.properties` 配置文件表示使用 163 邮箱时的配置，为了使之生效，需要通过 `spring.profiles.active = 163` 来激活它。

在 `src/main/resources` 目录下添加 `application.properties` 配置文件，内容如下：

```properties
spring.profiles.active = 163
```

### 4.3. Java 代码

首先，需要读取部分配置属性，方法如下：

```java
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

@Validated
@Component
@ConfigurationProperties(prefix = "mail")
public class MailProperties {
    private String domain;
    private String from;

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }
}
```

接着，定义一个邮件参数实体类（使用 lombok 简化了 getter、setter）：

```java
import lombok.Data;
import java.util.Date;

@Data
public class MailDTO {
    private String from;
    private String replyTo;
    private String[] to;
    private String[] cc;
    private String[] bcc;
    private Date sentDate;
    private String subject;
    private String text;
    private String[] filenames;
}
```

接着，实现发送邮件的功能接口：

```java
import com.github.dozermapper.core.Mapper;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import java.io.IOException;

@Service
public class MailService {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private MailProperties mailProperties;

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private Mapper mapper;

    public void sendSimpleMailMessage(MailDTO mailDTO) {
        SimpleMailMessage simpleMailMessage = mapper.map(mailDTO, SimpleMailMessage.class);
        if (StringUtils.isEmpty(mailDTO.getFrom())) {
            mailDTO.setFrom(mailProperties.getFrom());
        }
        javaMailSender.send(simpleMailMessage);
    }

    public void sendMimeMessage(MailDTO mailDTO) {

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper messageHelper;
        try {
            messageHelper = new MimeMessageHelper(mimeMessage, true);

            if (StringUtils.isEmpty(mailDTO.getFrom())) {
                messageHelper.setFrom(mailProperties.getFrom());
            }
            messageHelper.setTo(mailDTO.getTo());
            messageHelper.setSubject(mailDTO.getSubject());

            mimeMessage = messageHelper.getMimeMessage();
            MimeBodyPart mimeBodyPart = new MimeBodyPart();
            mimeBodyPart.setContent(mailDTO.getText(), "text/html;charset=UTF-8");

            // 描述数据关系
            MimeMultipart mm = new MimeMultipart();
            mm.setSubType("related");
            mm.addBodyPart(mimeBodyPart);

            // 添加邮件附件
            for (String filename : mailDTO.getFilenames()) {
                MimeBodyPart attachPart = new MimeBodyPart();
                try {
                    attachPart.attachFile(filename);
                } catch (IOException e) {
                    e.printStackTrace();
                }
                mm.addBodyPart(attachPart);
            }
            mimeMessage.setContent(mm);
            mimeMessage.saveChanges();

        } catch (MessagingException e) {
            e.printStackTrace();
        }

        javaMailSender.send(mimeMessage);
    }
}
```

## 5. 示例源码

> 示例源码：[spring-boot-mail](https://github.com/dunwu/spring-boot-tutorial/tree/master/spring-boot-mail)

## 6. 参考资料

- [Spring Boot 官方文档之 Sending Email](https://docs.spring.io/spring-boot/docs/2.1.1.RELEASE/reference/htmlsingle/#boot-features-email)