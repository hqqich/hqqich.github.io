# SpringBoot Controller接收参数的几种常用方式  

# 第一类：请求路径参数

## 1、@PathVariable

获取路径参数。即*url/{id}*这种形式。

## 2、@RequestParam

获取查询参数。即*url?name=*这种形式

### 例子

GET 
 http://localhost:8080/demo/123?name=suki_rong 
 对应的java代码：

```java
@GetMapping("/demo/{id}")
public void demo(@PathVariable(name = "id") String id, @RequestParam(name = "name") String name) {
    System.out.println("id="+id);
    System.out.println("name="+name);
}12345
```

输出结果： 
 id=123 
 name=suki_rong

# 第二类：Body参数

因为是POST请求，这里用Postman的截图结合代码说明

## 1、@RequestBody

### 例子

![demo1](https://img-blog.csdn.net/20180525001103380?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3N1a2lfcm9uZw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70) 
 对应的java代码：

```java
@PostMapping(path = "/demo1")
public void demo1(@RequestBody Person person) {
    System.out.println(person.toString());
}1234
```

输出结果： 
 name:suki_rong;age=18;hobby:programing

也可以是这样

```java
@PostMapping(path = "/demo1")
public void demo1(@RequestBody Map<String, String> person) {
    System.out.println(person.get("name"));
}1234
```

输出结果： 
 suki_rong

## 2、无注解

### 例子

![demo2](https://img-blog.csdn.net/20180525001626615?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3N1a2lfcm9uZw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70) 
 对应的java代码：

```java
@PostMapping(path = "/demo2")
public void demo2(Person person) {
    System.out.println(person.toString());
}1234
```

输出结果： 
 name:suki_rong;age=18;hobby:programing

## Person类

```java
public class Person {

    private long id;
    private String name;
    private int age;
    private String hobby;

    @Override
    public String toString(){
        return "name:"+name+";age="+age+";hobby:"+hobby;
    }

    // getters and setters
}1234567891011121314
```

# 第三类：请求头参数以及Cookie

## 1、@RequestHeader

## 2、@CookieValue

### 例子

java代码：

```java
@GetMapping("/demo3")
public void demo3(@RequestHeader(name = "myHeader") String myHeader,
        @CookieValue(name = "myCookie") String myCookie) {
    System.out.println("myHeader=" + myHeader);
    System.out.println("myCookie=" + myCookie);
}123456
```

也可以这样

```java
@GetMapping("/demo3")
public void demo3(HttpServletRequest request) {
    System.out.println(request.getHeader("myHeader"));
    for (Cookie cookie : request.getCookies()) {
        if ("myCookie".equals(cookie.getName())) {
            System.out.println(cookie.getValue());
        }
    }
}
```













1、**直接把表单的参数写在Controller相应的方法的形参中，适用于get方式提交，不适用于post方式提交。若****"Content-Type"="application/x-www-form-urlencoded",可用post提交**

 

​    **url形式：[http://localhost:8080/SSMDemo/demo/addUser1?username=lixiaoxi&password=111111](http://localhost/SSMDemo/demo/addUser1?username=lixiaoxi&password=111111) 提交的参数需要和Controller方法中的入参名称一致。**

```java
@RequestController
class a {
    　　
    /**
     * 1.直接把表单的参数写在Controller相应的方法的形参中
     * 
     * @param username
     * @param password
     * @return
     */
    @RequestMapping("/addUser1")
    public String addUser1(String username, String password) {
        System.out.println("username is:" + username);
        System.out.println("password is:" + password);
        return "demo/index";
    }
    
    
    
    
    // 2、通过HttpServletRequest接收，post方式和get方式都可以。
    　　

    /**
     * 2、通过HttpServletRequest接收
     * 
     * @param request
     * @return
     */
    @RequestMapping("/addUser2")
    public String addUser2(HttpServletRequest request) {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        System.out.println("username is:" + username);
        System.out.println("password is:" + password);
        return "demo/index";
    }
    
    
    // 3、通过一个bean来接收,post方式和get方式都可以。
    　　

    /**
     * 3、通过一个bean来接收
     * 
     * @param user
     * @return
     */
    @RequestMapping("/addUser3")
    public String addUser3(UserModel user) {
        System.out.println("username is:" + user.getUsername());
        System.out.println("password is:" + user.getPassword());
        return "demo/index";
    }
    // 4、使用@ModelAttribute注解获取POST请求的FORM表单数据
    　　

    /**
     * 4、使用@ModelAttribute注解获取POST请求的FORM表单数据
     * 
     * @param user
     * @return
     */
    @RequestMapping(value = "/addUser5", method = RequestMethod.POST)
    public String addUser5(@ModelAttribute("user") UserModel user) {
        System.out.println("username is:" + user.getUsername());
        System.out.println("password is:" + user.getPassword());
        return "demo/index";
    }
    // 5、用注解@RequestParam绑定请求参数到方法入参
    // 当请求参数username不存在时会有异常发生,可以通过设置属性required=false解决,例如:
    // @RequestParam(value="username", required=false) ****
    // 若"Content-Type"="application/x-www-form-urlencoded"，post get都可以 ****
    // 若"Content-Type"="application/application/json"，只适用get
    　　

    /**
     * 5、用注解@RequestParam绑定请求参数到方法入参
     * 
     * @param username
     * @param password
     * @return
     */
    @RequestMapping(value = "/addUser6", method = RequestMethod.GET)
    public String addUser6(@RequestParam("username") String username, @RequestParam("password") String password) {
        System.out.println("username is:" + username);
        System.out.println("password is:" + password);
        return "demo/index";
    }
    // 6、用request.getQueryString() 获取spring MVC get请求的参数，只适用get请求
    　　@RequestMapping(value="/addUser6",method=RequestMethod.GET)
    public String addUser6(HttpServletRequest request) { 　　　　System.out.println("username is:"+request.getQueryString()); 
　　　　return "demo/index"; 
　　}
}
```