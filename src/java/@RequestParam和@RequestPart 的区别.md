一、今天写了两个文件上传的接口用到了@RequestParam和@RequestPart
@RequestPart

```java
/**
 * 单文件上传
 * @param file
 * @param bucket
 * @return
 */
@RequestMapping("uploadFile")
public JsonResult uploadFile(@RequestPart("file") MultipartFile file, @RequestParam String bucket){

    String fileUrl = aliossService.uploadFile(file, bucket);
    Map<String,String> result = new HashMap<>();
    result.put("fileUrl",fileUrl);

    return success(result);
}
```

@RequestParam

```java
/**
 * 上传字符串
 * @param stringFile
 * @param bucket
 * @return
 */
@RequestMapping("uploadStringFile")
public JsonResult uploadStringFile(@RequestParam("stringFile") String stringFile, @RequestParam("bucket") String bucket){

    String fileUrl = aliossService.uploadStringFile(stringFile, bucket);
    Map<String,String> result = new HashMap<>();
    result.put("fileUrl",fileUrl);

    return success(result);
}
```
二、比较一下他们的区别吧
@RequestPart

![RequestPart](https://img-blog.csdn.net/2018032814200546?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dkMjAxNDYxMA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

译文：
1.@RequestPart这个注解用在multipart/form-data表单提交请求的方法上。
2.支持的请求方法的方式MultipartFile，属于Spring的MultipartResolver类。这个请求是通过http协议传输的。
3.@RequestParam也同样支持multipart/form-data请求。
4.他们最大的不同是，当请求方法的请求参数类型不再是String类型的时候。
5.@RequestParam适用于name-valueString类型的请求域，@RequestPart适用于复杂的请求域（像JSON，XML）。