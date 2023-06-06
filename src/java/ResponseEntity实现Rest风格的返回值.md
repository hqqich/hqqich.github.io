# ResponseEntity实现Rest风格的返回值

### 简介

在前面，我们使用了@ResponseBody注解和@RestController注解，其作用就不多说了，但是问题就来了，如果想向前段返回一个状态码该怎么实现呢？

我们知道响应头并不属于响应体，所以即使使用自己封装的Bean加入状态码属性，也只能在前段获取一个所谓的状态码而已，在RESTful风格中，我们要明确的返回正确的状态码。那么单单使用@ResponseBody就不够用了。

### @ResponseStatus

前面我们说到@ResponseBody不能正确的返回响应状态码，于是出现了@ResponseStatus注解，带有@ResponseStatus注解的异常类会被ResponseStatusExceptionResolver 解析。可以实现自定义的一些异常,同时在页面上进行显示。具体的使用方法如下:

1.首先定义一个异常类：



```java
@ResponseStatus(value = HttpStatus.FORBIDDEN,reason = "用户名和密码不匹配!")
public class UserNameNotMatchPasswordException extends RuntimeException{
        
}
```

2.人为抛出一个异常:



```java
  @RequestMapping("/testResponseStatusExceptionResolver")
    public String testResponseStatusExceptionResolver(@RequestParam("i") int i){
        if (i==13){
            throw new UserNameNotMatchPasswordException();
        }
        System.out.println("testResponseStatusExceptionResolver....");
        return "success";
    }
```

3.输入如下额路径:

http://localhost:8090/testResponseStatusExceptionResolver?i=13

此时浏览器会显示403，以及用户名密码不匹配。

当然，也可以在方法上进行修饰:



```java
@ResponseStatus(reason = "测试",value = HttpStatus.NOT_FOUND)
    @RequestMapping("/testResponseStatusExceptionResolver")
    public String testResponseStatusExceptionResolver(@RequestParam("i") int i){
        if (i==13){
            throw new UserNameNotMatchPasswordException();
        }
        System.out.println("testResponseStatusExceptionResolver....");
        return "success";
    }
```

这时所有的请求都会报错。

不过我们也不会使用这个注解，会使用全局的异常处理。详见上篇。

### ResponseEntity

它是Spring提供的一个类，它内部封装了状态码，请求头，请求体等信息，用户可以根据自己的需要修改状态码、请求体的信息。ResponseEntity中的泛型用于指定请求体的类型，它的请求体和@ResponseBody的作用完全一致，并且ResponseEntity的优先级要高于@ResponseBody，即：**如果返回值是ResponseEntity，即使存在ResponseBody或者@RestController注解，也默认不会生效，而是使用ResponseEntity。**

### HttpStatus

这是Spring提供的一个枚举类，其遵循RESTful风格封装了大量了响应状态码。详见`org.springframework.http.HttpStatus;`

### 如何使用ResponseEntity

使用构造返回，其中第一个参数为响应体，第二个为响应码



```java
//使用构造参数构建
new ResponseEntity<String>("return info",HttpStatus.BAD_REQUEST);
//使用构造参数构建
new ResponseEntity<JavaBean>(javaBean,HttpStatus.BAD_REQUEST);
```

使用status设置响应码，body指定响应头



```java
//使用status方法和body方法
ResponseEntity.status(HttpStatus.CREATED).body(javaBean);
//使用status方法和body方法
ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
```

另外还可以设置响应头：



```java
@GetMapping("/customHeader")
ResponseEntity<String> customHeader() {
    HttpHeaders headers = new HttpHeaders();
    headers.add("Custom-Header", "foo");

    return new ResponseEntity<>(
      "Custom header set", headers, HttpStatus.OK);
}
```

如果只是返回一个状态码为200的内容，可以简写为：



```java
@GetMapping("/hello")
ResponseEntity<String> hello() {
    return ResponseEntity.ok("Hello World!");
}
```

最后强调一下：BodyBuilder.body()返回ResponseEntity ,所以需要最后调用。

### 使用HttpServletResponse response

Spring同样支持我们使用HttpServletResponse对象来操作请求头和请求体，用法如下：



```java
@GetMapping("/manual")
void manual(HttpServletResponse response) throws IOException {
    response.setHeader("Custom-Header", "foo");
    response.setStatus(200);
    response.getWriter().println("Hello World!");
}
```

既然spring已经提供底层实现的抽象和附件功能，我们不建议直接操作response。



```
ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
ResponseEntity.ok(list);
ResponseEntity.badRequest().build();
ResponseEntity.notFound().build();
```

上述是比较简单的两种用法，分别是500和200、400、404