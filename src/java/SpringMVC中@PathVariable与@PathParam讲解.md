# **SpringMVC中@PathVariable与@PathParam讲解**

2019.09.29 08:45 15697浏览

# 后端如何获取前端传的参数

传统来讲，肯定是两种方式为主，一种是 GET ，一种是 POST ，这两种方式都是向一个 URL 传参 GET 方式体现到了地址栏里，POST 方式将内容放在了 body 里

`@RequestParam` 和 `@PathVariable` 注解是用于从 request 中接收请求的，两个都可以接收参数，关键点不同的是`@RequestParam` 是从 request 里面拿取值，而 `@PathVariable` 是从一个URI模板里面来填充

# @PathVariable

通过 URI 模板来填充
举例：

```java
	@RequestMapping(value = "/getbyid/{id}", method = RequestMethod.GET)
	@ResponseBody
	private Map<String, Object> getbyid( HttpServletRequest request,@PathVariable("id") int idnum){
		Map<String, Object> modelMap = new HashMap<String, Object>();
		modelMap.put("idnum", idnum);
		return modelMap;
	}
```

当我们访问：

```
http://localhost:8080/upmovie/movie/getbyid/19
```

![图片描述](http://img1.sycdn.imooc.com/5d8ffc560001c97104370128.png)
￼
我们可以直接获取地址里的19

# @PathParam

获取 request 里的值

```java
	@RequestMapping(value = "/getbyid", method = RequestMethod.GET)
	@ResponseBody
	private Map<String, Object> getbyid( HttpServletRequest request,@RequestParam(value="id", required=true)int idnum){
		Map<String, Object> modelMap = new HashMap<String, Object>();
		modelMap.put("idnum", idnum);
		return modelMap;
	}
```

当我们访问：

```
http://localhost:8080/upmovie/movie/getbyid?id=21
```

![图片描述](http://img1.sycdn.imooc.com/5d8ffc620001cf1204680139.png)
￼

我们只能获取 ?id 的值，如果是 POST 方式，我们也可以获取指定值

## 优缺点

直接获取 URI 模板里的值是很方便的，不用去获取 request 里的固定参数，比较直接，藏在 request 里的使用 POST 方式会优雅一点，如果只是 ID 这种单个或者多个数字字母，使用 @PathVariable 会好很多，这里借鉴的是 thinkphp5 里的优点加以利用。

## 总结

我认为在单个参数提交 API 获取信息的时候，直接放在 URL 地址里，也就是使用 URI 模板的方式是非常方便的，而不使用 @PathVariable 还需要从 request 里提取指定参数，多一步操作，所以如果提取的是多个参数，而且是多个不同类型的参数，我觉得应该使用其他方式，也就是 @PathParam。