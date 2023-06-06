# SSM框架-SpringMVC 实例文件上传下载

## SSM框架-SpringMVC 实例文件上传下载

今天遇到文件上传的问题，使用Ajax方式进行提交，服务器一直报错`The current request is not a multipart request`，看了网上很多方法，最后才找到，我在表单提交的时候使用了序列化`$('#postForm').serialize()`，但是这种方式，只能传递一般的参数，上传文件的文件流是无法被序列化并传递的。所以一直在报错。后来就直接使用`submint()`,放弃使用Ajax。不过还是想记下来，以备不时之需。

**接下来进入正题：在SSM框架下实现文件上传和下载**

**导入需要的依赖包：**
pom.xml

```javascript
		<!-- 上传组件包 -->
		<dependency>
			<groupId>commons-fileupload</groupId>
			<artifactId>commons-fileupload</artifactId>
			<version>1.3.1</version>
		</dependency>
		<dependency>
			<groupId>commons-io</groupId>
			<artifactId>commons-io</artifactId>
			<version>2.4</version>
		</dependency>
		<dependency>
			<groupId>commons-codec</groupId>
			<artifactId>commons-codec</artifactId>
			<version>1.9</version>
		</dependency>
12345678910111213141516
```

web.xml

```javascript
<?xml version="1.0" encoding="UTF-8"?>  
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
    xmlns="http://java.sun.com/xml/ns/javaee" xmlns:web="http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"  
    xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"  
    id="WebApp_ID" version="3.0">  
    <!-- SpringMVC的前端控制器 -->  
    <servlet>  
        <servlet-name>MyDispatcher</servlet-name>  
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>  
        <!-- 设置自己定义的控制器xml文件 -->  
        <init-param>  
            <param-name>contextConfigLocation</param-name>  
            <param-value>/WEB-INF/springMVC-servlet.xml</param-value>  
        </init-param>  
        <load-on-startup>1</load-on-startup>  
    </servlet>  
    <!-- Spring MVC配置文件结束 -->  
  
    <!-- 拦截设置 -->  
    <servlet-mapping>  
        <servlet-name>MyDispatcher</servlet-name>  
        <!-- 由SpringMVC拦截所有请求 -->  
        <url-pattern>/</url-pattern>  
    </servlet-mapping>      
</web-app> 
12345678910111213141516171819202122232425
```

spring-mvc.xml

```java
<beans xmlns="http://www.springframework.org/schema/beans"  
    xmlns:context="http://www.springframework.org/schema/context"  
    xmlns:util="http://www.springframework.org/schema/util"   
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:p="http://www.springframework.org/schema/p"  
     xmlns:mvc="http://www.springframework.org/schema/mvc"    
    xsi:schemaLocation="    
        http://www.springframework.org/schema/util   
        http://www.springframework.org/schema/util/spring-util-3.0.xsd  
        http://www.springframework.org/schema/mvc   
        http://www.springframework.org/schema/mvc/spring-mvc-3.0.xsd  
        http://www.springframework.org/schema/beans         
        http://www.springframework.org/schema/beans/spring-beans-3.0.xsd    
        http://www.springframework.org/schema/mvc      
        http://www.springframework.org/schema/mvc/spring-mvc-3.0.xsd  
        http://www.springframework.org/schema/context     
        http://www.springframework.org/schema/context/spring-context-3.0.xsd">  
          
    <!-- 把标记了@Controller注解的类转换为bean -->  
    <context:component-scan base-package="com.mucfc" />  

	<!-- 视图解析器 对模型视图名称的解析，即在模型视图名称添加前后缀-->
	<bean id="viewResolver"		class="org.springframework.web.servlet.view.InternalResourceViewResolver">
		<property name="prefix" value="/WEB-INF/view/" />
		<property name="suffix" value=".jsp"></property>
	</bean>
            
    <!-- 上传文件的设置 ，maxUploadSize=-1，表示无穷大。uploadTempDir为上传的临时目录 -->  
   <bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver"    
    	<!-- one of the properties available; the maximum file size in bytes -->
    	<!-- 1KB= 1024 byte   1MB=1024KB    1GB=1024MB-->   	
        <!-- 默认编码 -->  
        <property name="defaultEncoding" value="utf-8" />    
        <!-- 文件大小最大值 -->  
        <property name="maxUploadSize" value="10000000" />    
        <!-- 内存中的最大值 -->  
        <property name="maxInMemorySize" value="40960" />  
     />      
</beans>  
1234567891011121314151617181920212223242526272829303132333435363738
```

**一、单个文件上传**

JSP,这个页面是用来上传又用来显示上传后的图片的页面fileUpload.jsp

```javascript
<%@ page language="java" contentType="text/html; charset=UTF-8"  
    pageEncoding="UTF-8"%>  
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>  
<%  
    String path = request.getContextPath();  
    String basePath = request.getScheme() + "://"  
            + request.getServerName() + ":" + request.getServerPort()  
            + path + "/";  
%>  
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">  
<html>  
<head>  
<title>用户上传图片页面</title>  
 <base href="<%=basePath%>">  
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">  
</head>  
<body>  
    <center>  
        <form action="file/onefile"  
            method="post" enctype="multipart/form-data">  
            <input type="file" name="file" />   
            <input type="submit" value="上 传" />  
        </form>  
        <h5>上传结果：</h5>  
        <img alt="暂无图片" src="${fileUrl}" />  
    </center>  
</body>  
</html>  
12345678910111213141516171819202122232425262728
```

Conroller层
1、方法一

```java
@Controller  
@RequestMapping("/file")  
public class FileController {  
  
    @RequestMapping("/toFile")  
    public String toFileUpload() {  
        return "fileUpload";  
    }  
  
    @RequestMapping("/toFile2")  
    public String toFileUpload2() {  
        return "fileUpload2";  
    }  
  
    /** 
     * 方法一上传文件 
     */  
    @RequestMapping("/onefile")  
    public String oneFileUpload(@RequestParam("file") MultipartFile file,HttpServletRequest request,HttpServletResponse response) {  
  
        // 获得原始文件名  
        String fileName = file.getOriginalFilename();  
        System.out.println("原始文件名:" + fileName);  
  
        //避免文件名重复使用uuid来避免,产生一个随机的uuid字符，并赋予一个新的文件名
        String newFileName = UUID.randomUUID() + fileName;  
  
        // 获得项目的路径  
     	ServletContext servletContext = request.getSession().getServletContext();
        // 上传位置  
       String path=servletContext.getRealPath("/upload")+"/";     //设定文件保存的目录
  
        File f = new File(path);  
        if (!f.exists())  
            f.mkdirs();  
        if (!file.isEmpty()) {  
            try {  
                FileOutputStream fos = new FileOutputStream(path + newFileName);  
                InputStream in = file.getInputStream();  
                int b = 0;  
                while ((b = in.read()) != -1) {  
                    fos.write(b);  
                }  
                fos.close();  
                in.close();  
            } catch (Exception e) {  
                e.printStackTrace();  
            }  
        }  
  
        System.out.println("上传图片到:" + path + newFileName);  
        // 保存文件地址，用于JSP页面回显  
        model.addAttribute("fileUrl", path + newFileName);  
        return "fileUpload";  
    }  
12345678910111213141516171819202122232425262728293031323334353637383940414243444546474849505152535455
```

运行后的效果：
原始文件名:`1522330092612.jpg`
上传位置:`D:\tomcat-8.5.43\webapps\telecomsystem\upload`
效果图：上传前：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191006135135656.png)
上传后：
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019100613530956.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0NvZGVfX3Jvb2tpZQ==,size_16,color_FFFFFF,t_70)
2、方法二：使用文件流的方式来上传

```java
/** 
 * 方法二上传文件，一次一张 
 */  
@RequestMapping("/onefile2")  
public String oneFileUpload2(HttpServletRequest request,  
        HttpServletResponse response) throws Exception {     
    CommonsMultipartResolver cmr = new CommonsMultipartResolver(  
            request.getServletContext());  
    
    if (cmr.isMultipart(request)) {  
        MultipartHttpServletRequest mRequest = (MultipartHttpServletRequest) (request);  
        Iterator<String> files = mRequest.getFileNames();  
        while (files.hasNext()) {  
            MultipartFile mFile = mRequest.getFile(files.next());  
            if (mFile != null) {  
                String fileName = UUID.randomUUID()  
                        + mFile.getOriginalFilename();  
                String path = "d:/upload/" + fileName;  
  
                File localFile = new File(path);  
                mFile.transferTo(localFile);  
                request.setAttribute("fileUrl", path);  
            }  
        }  
    }  
    return "fileUpload";  
} 
123456789101112131415161718192021222324252627
```

jsp部分代码：

```javascript
<center>  
   <form action="file/onefile2"   
        method="post" enctype="multipart/form-data">  
        <input type="file" name="file" />   
        <input type="submit" value="上 传" />  
    </form>  
    <h5>上传结果：</h5>  
    <img alt="暂无图片" src="${fileUrl}" />  
</center>  
123456789
```

方法二指定上传到了本地E盘的upload文件夹
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191006140714465.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0NvZGVfX3Jvb2tpZQ==,size_16,color_FFFFFF,t_70)
**二、多个文件上传**
多个文件上传其实就是将单文件上传的方法一中修改成循环就可以了

JSP显示页面fileUpload2.jsp

```javascript
<%@ page language="java" import="java.util.*" contentType="text/html; charset=UTF-8"  
    pageEncoding="UTF-8"%>  
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>  
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>  
<%  
    String path = request.getContextPath();  
    String basePath = request.getScheme() + "://"  
            + request.getServerName() + ":" + request.getServerPort()  
            + path + "/";  
%>  
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">  
<html>  
<head>  
<title>用户上传图片页面</title>  
<base href="<%=basePath%>">  
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">  
</head>  
<body>  
    <center>  
        <form action="file/threeFile" method="post"  
            enctype="multipart/form-data">  
            <input type="file" name="file" /><br /> <input type="file"  
                name="file" /><br /> <input type="file" name="file" /><br /> <input  
                type="submit" value="上 传" />  
        </form>  
        <h5>上传结果：</h5>  
  
        <c:forEach items="${fileList}" var="imagename">  
                <img alt="暂无图片" src="${imagename}" /> <br/>  
        </c:forEach>  
    </center>  
</body>  
</html>  
123456789101112131415161718192021222324252627282930313233
```

Controller层

```java
/** 
 * 一次上传多张图片 
 */  
@RequestMapping("/threeFile")  
public String threeFileUpload(  
        @RequestParam("file") CommonsMultipartFile files[],  
        HttpServletRequest request, ModelMap model) {  
  
    List<String> list = new ArrayList<String>();  
    // 获得项目的路径  
    ServletContext sc = request.getSession().getServletContext();  
    // 上传位置  
    String path = sc.getRealPath("/img") + "/"; // 设定文件保存的目录  
    File f = new File(path);  
    if (!f.exists())  
        f.mkdirs();  
  
    for (int i = 0; i < files.length; i++) {  
        // 获得原始文件名  
        String fileName = files[i].getOriginalFilename();  
        System.out.println("原始文件名:" + fileName);  
        // 新文件名  
        String newFileName = UUID.randomUUID() + fileName;  
        if (!files[i].isEmpty()) {  
            try {  
                FileOutputStream fos = new FileOutputStream(path  
                        + newFileName);  
                InputStream in = files[i].getInputStream();  
                int b = 0;  
                while ((b = in.read()) != -1) {  
                    fos.write(b);  
                }  
                fos.close();  
                in.close();  
            } catch (Exception e) {  
                e.printStackTrace();  
            }  
        }  
        System.out.println("上传图片到:" + path + newFileName);  
        list.add(path + newFileName);  
  
    }  
    // 保存文件地址，用于JSP页面回显  
    model.addAttribute("fileList", list);  
    return "fileUpload2";    
}  
12345678910111213141516171819202122232425262728293031323334353637383940414243444546
```

**三、上传文件列表显示**

jsp文件listFile.jsp

```javascript
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>  
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>  
<!DOCTYPE HTML>  
<html>  
  <head>  
    <title>下载文件显示页面</title>  
  </head>      
  <body>  
      <!-- 遍历Map集合 -->  
    <c:forEach var="me" items="${fileNameMap}">  
        <c:url value="/file/downFile" var="downurl">  
            <c:param name="filename" value="${me.key}"></c:param>  
        </c:url>  
        ${me.value}<a href="${downurl}">下载</a>  
        <br/>  
    </c:forEach>     
  </body>  
</html>    
123456789101112131415161718
```

Controller层

```java
/** 
 * 列出所有的图片 
 */  
@RequestMapping("/listFile")  
public String listFile(HttpServletRequest request,  
        HttpServletResponse response) {  
    // 获取上传文件的目录  
    ServletContext sc = request.getSession().getServletContext();  
    // 上传位置  
    String uploadFilePath = sc.getRealPath("/img") + "/"; // 设定文件保存的目录  
    // 存储要下载的文件名  
    Map<String, String> fileNameMap = new HashMap<String, String>();  
    // 递归遍历filepath目录下的所有文件和目录，将文件的文件名存储到map集合中  
    listfile(new File(uploadFilePath), fileNameMap);// File既可以代表一个文件也可以代表一个目录  
    // 将Map集合发送到listfile.jsp页面进行显示  
    request.setAttribute("fileNameMap", fileNameMap);  
    return "listFile";  
}  
123456789101112131415161718
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191006141439570.png)
**四、文件下载**
Controller层

```java
@RequestMapping("/downFile")  
public void downFile(HttpServletRequest request,  
        HttpServletResponse response) {  
    System.out.println("1");  
    // 得到要下载的文件名  
    String fileName = request.getParameter("filename");  
    System.out.println("2");  
    try {  
        fileName = new String(fileName.getBytes("iso8859-1"), "UTF-8");  
        System.out.println("3");  
        // 获取上传文件的目录  
        ServletContext sc = request.getSession().getServletContext();  
        System.out.println("4");  
        // 上传位置  
        String fileSaveRootPath = sc.getRealPath("/img");   
          
        System.out.println(fileSaveRootPath + "\\" + fileName);  
        // 得到要下载的文件  
        File file = new File(fileSaveRootPath + "\\" + fileName);  
          
        // 如果文件不存在  
        if (!file.exists()) {  
            request.setAttribute("message", "您要下载的资源已被删除！！");  
            System.out.println("您要下载的资源已被删除！！");  
            return;  
        }  
        // 处理文件名  
        String realname = fileName.substring(fileName.indexOf("_") + 1);  
        // 设置响应头，控制浏览器下载该文件  
        response.setHeader("content-disposition", "attachment;filename="  
                + URLEncoder.encode(realname, "UTF-8"));  
        // 读取要下载的文件，保存到文件输入流  
        FileInputStream in = new FileInputStream(fileSaveRootPath + "\\" + fileName);  
        // 创建输出流  
        OutputStream out = response.getOutputStream();  
        // 创建缓冲区  
        byte buffer[] = new byte[1024];  
        int len = 0;  
        // 循环将输入流中的内容读取到缓冲区当中  
        while ((len = in.read(buffer)) > 0) {  
            // 输出缓冲区的内容到浏览器，实现文件下载  
            out.write(buffer, 0, len);  
        }  
        // 关闭文件输入流  
        in.close();  
        // 关闭输出流  
        out.close();  
    } catch (Exception e) {    
    }  
}  
1234567891011121314151617181920212223242526272829303132333435363738394041424344454647484950
```

注：这里是通过文件流的方式来下载图片的。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191006141814248.gif)
注：本篇文章为参考他人文章，代码部分已实测有效。在这里仅做整理保存使用。
转载地址：
[SSM框架-SpringMVC 实例文件上传下载](http://www.360doc.com/content/17/1109/14/49433510_702360164.shtml)