# SpringMvc中获取@PathVariable的值的方式

## 一、地址：{id}

```java
@RequestMapping(value = "/del/{id}", method = RequestMethod.GET)
public void del(HttpServletRequest request, @PathVariable("id") Long id){
   System.out.println(id);
}
```



## 二、方式

### 1、直接通过@PathVariable注解获取

```java
@RequestMapping(value = "/del/{id}", method = RequestMethod.GET)
public void del(HttpServletRequest request, @PathVariable("id") Long id){
	System.out.println(id);
}
```



### 2、通用@PathVariable注解批量获取, 只有注解的参数才能得到

```java
@RequestMapping(value = "/del/{id}", method = RequestMethod.GET)
public void del(HttpServletRequest request, @PathVariable("id") Long id){
    NativeWebRequest webRequest = new ServletWebRequest(request);
    Map<String, Object> map = (Map<String, Object>)webRequest.getAttribute(View.PATH_VARIABLES,RequestAttributes.SCOPE_REQUEST);
    System.out.println(map.get("id"));
}
```



###     3、批量获取，不需要任何注解

```java
@RequestMapping(value = "/del/{id}", method = RequestMethod.GET)
public void del(HttpServletRequest request){
    NativeWebRequest webRequest = new ServletWebRequest(request);
    Map<String, String> map = (Map<String, String>) webRequest.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE,RequestAttributes.SCOPE_REQUEST);
    System.out.println(map.get("id"));
}
```





## @RequestMapping 多个url映射到一个方法

```java
@RequestMapping(value={"url","resturl"})
@ResponseBody
public String url() {
    return "url";
}
```

