# springboot获取静态图片路径_Spring Boot 静态资源处理，妙招！

>做web开发的时候，我们往往会有很多静态资源，如html、图片、css等。那如何向前端返回静态资源呢？ 以前做过web开发的同学应该知道，我们以前创建的web工程下面会有一个webapp的目录，我们只要把静态资源放在该目录下就可以直接访问。 但是，基于Spring boot的工程并没有这个目录，那我们应该怎么处理？

## 一、最笨的方式

我们首先来分享一种最笨的办法，就是将静态资源通过流直接返回给前端，我们在maven工程的resources的根目录下建立一个html的目录，然后我们把html文件放在该目录下，并且规定任何访问路径以static开头的即访问该目录下的静态资源，其实现如下：

```java
@Controller
public class StaticResourceController {
    
   @RequestMapping("/static/**")
   public void getHtml(HttpServletRequest request, HttpServletResponse response) {
       String uri = request.getRequestURI();    
       String[] arr = uri.split(static);    
       String resourceName = index.html;    
       if (arr.length > 1) {    
           resourceName = arr[1];    
       }    
       String url=StaticResourceController.class.getResource().getPath()+html+resourceName;
    
       try {
    
           FileReader reader = new FileReader(new File(url));
    
           BufferedReader br = new BufferedReader(reader);
    
           StringBuilder sb = new StringBuilder();
    
           String line = br.readLine();
           while (line != null) {
               sb.append(line);
               line = br.readLine();
           }    
           response.getOutputStream().write(sb.toString().getBytes());
           response.flushBuffer();
       } catch (IOException e) {
           e.printStackTrace();
       }
   }
}
```

其实现过程很简单，就是先从路径中分离出来资源uri，然后从static目录下读取文件，并输出到前端。 因为只做简单演示，所以这里只处理了文本类型的文件，图片文件可以做类似的处理。当然，我们在实际中肯定不会这么做，Spring Boot 也肯定有更好的解决办法。 不过这个办法虽然有点笨，但确是最本质的东西，无论框架如何方便的帮我们处理了这类问题，但是抛开框架，我们依然要能够熟练的写出一个web项目，只有知道其实现原理，你才会在遇到问题时能得心应手。 现在我们再来看看Spring boot对静态资源的支持。

## 二、Spring boot默认静态资源访问方式



Spring boot默认对的访问可以直接访问四个目录下的文件：

> * classpath:/public/
>
> * classpath:/resources/
>
> * classpath:/static/
>
> * classpath:/META-INFO/resouces/
>

我们现在就在资源文件resources目录下建立如下四个目录：  注意蓝色条下的资源文件夹resources与类路径下的文件夹classpathresources是不同的，蓝色条下的resources代表的是该目录下的文件为资源文件，在打包的时候会将该目录下的文件全部打包的类路径下，这个名称是可以改的，在pom.xml指定资源目录即可：
        srcmainresources

而类路径下的resources是spring boot默认的静态资源文件夹之一，和public、static以及MEAT-INFOresources的功能相同。现在我们重启Spring boot就可以通过
httplocalhost80801.html

httplocalhost80802.html

httplocalhost80803.html

httplocalhost80804.html

四个URL访问到四个目录下的静态资源了。

## 三、自定义静态资源目录

通过第二节内容我们已经知道了Spring boot默认可以访问的静态资源的目录，但是大家肯定会想，这个目录是固定的吗？我们可不可以自己定义静态资源目录？ 答案是肯定的，我们现在就来自定义一个静态资源目录，我们定义一个images的目录来存放图片，所有image的路径都会访问images目录下的资源：

```java
@Configuration

public class ImageMvcConfig extends WebMvcConfigurerAdapter {
   @Override
   public void addResourceHandlers(ResourceHandlerRegistry registry) {

       registry.addResourceHandler("/image/**"")
    
               .addResourceLocations("classpath:/images/");

   }

}
```

这段代码应该比较简单， WebMvcConfigurerAdapter是Spring提供的一个配置mvc的适配器，里面有很多配置的方法，addResourceHandlers就是专门处理静态资源的方法，其他方法后续我们还会讲到。 现在我们在验证上面的配置是否有效。我在images目录下放了一张spring.jpg的图片，现在我们通过httplocalhost8080imagespring.jpg来访问图片：  其实除了上面的办法还有一种更简单的办法，就是直接在application.yml中配置即可：
```yml
spring:
 mvc:
  static-path-pattern: /image/**
 resources:
  static-locations: classpath/images/
```

static-path-pattern：访问模式，默认为，多个可以逗号分隔 static-locations：资源目录，多个目录逗号分隔，默认资源目录为classpathMETA-INFresources,classpathresources,classpathstatic,classpathpublic 注意，这个配置会覆盖Spring boot默认的静态资源目录，例如如果按示例中配置，则无法再访问static、public、resources等目录下的资源了。

