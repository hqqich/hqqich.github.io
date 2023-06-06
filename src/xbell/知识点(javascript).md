1. jquery 使 input 获取焦点 `$("#credit").focus();`

2. jquery 设置 input 的值 `$("#credit").val(value);`

3. 设置属性值
```javascript
$("#credit").attr("required", false);  //必须输入设为 false
$("#credit").attr("readonly", true);  //只读设为 true
```


4. ajax json请求
```javascript
$.ajax({
  url: "<%=basePath%>course/submitFrom",
  type: "POST",
  data: JSON.stringify(this.form),
  dataType: "json",
  contentType: "application/json;charset=utf-8",
  success: function (result) {
    alert("test");
  }
});
```
后端就可以用map接收
```java
@RequestMapping(value = "/submitFrom", method = RequestMethod.POST)
@ResponseBody
public void submitFrom(@RequestBody HashMap map){
  System.out.println(map);
}
```


5. jquery ajax属性async(同步异步)
```javascript
$.ajax({
  url: "url",
  type: "GET",
  asyns: false  //关键是这个参数 是否异步请求=>false:使用同步请求
})
```

6. vue ajax请求数据不更新
主要原因是指示的this不同导致的，jquery中是全局dom,vue中是vue dom
```javascript
selectUser() {
    let vm = this;  //全局 DOM VUE 化
    $.ajax({
        url: "<%=basePath%>course/test",
        type: "GET",
        success: function (result) {
            vm.$set(vm, 'message', result);
            // this.$set(vm, 'message', result);
        }
    });
}
```


7. 清空表单from
```javascript
$('#myFrom').resetForm();  //清空表单
```

8. 获取radio值
```javascript
var status = $("input[name='status']:checked").val();
```
