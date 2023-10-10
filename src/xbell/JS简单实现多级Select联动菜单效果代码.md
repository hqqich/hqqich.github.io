# JS简单实现多级Select联动菜单效果代码

 更新时间：2015年09月06日 09:39:45  作者：企鹅  

这篇文章主要介绍了JS简单实现多级Select联动菜单效果代码,涉及JavaScript数组元素的遍历及动态设置select的实现技巧,需要的朋友可以参考下

本文实例讲述了JS简单实现多级Select联动菜单效果代码。分享给大家供大家参考。具体如下：

JS联动菜单，简单代码实现JS多级Select联动菜单，也就是大家常用的一款菜单，Select联动状态的菜单，网页上经常见到的效果，希望大家能用得上。

运行效果截图如下：

![img](https://img.jbzj.com/file_images/article/201509/20159694932770.jpg?20158694953)

在线演示地址如下：

http://demo.jb51.net/js/2015/js-simple-select-ld-menu-codes/

具体代码如下：

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
<title>JS联动下拉框</title>
<script language="javascript" >
/* 
** ====================================
** 类名：CLASS_LIANDONG_YAO 
** 功能：多级连动菜单 
** 作者：YAODAYIZI 
**/  
 function CLASS_LIANDONG_YAO(array)
 {
 //数组，联动的数据源
  this.array=array; 
  this.indexName='';
  this.obj='';
  //设置子SELECT
 // 参数：当前onchange的SELECT ID，要设置的SELECT ID
 this.subSelectChange=function(selectName1,selectName2)
  {
  //try
  //{
 var obj1=document.all[selectName1];
 var obj2=document.all[selectName2];
 var objName=this.toString();
 var me=this;
 obj1.onchange=function()
 {
  me.optionChange(this.options[this.selectedIndex].value,obj2.id)
 }
  }
  //设置第一个SELECT
 // 参数：indexName指选中项,selectName指select的ID
  this.firstSelectChange=function(indexName,selectName) 
  {
  this.obj=document.all[selectName];
  this.indexName=indexName;
  this.optionChange(this.indexName,this.obj.id)
  }
 // indexName指选中项,selectName指select的ID
  this.optionChange=function (indexName,selectName)
  {
 var obj1=document.all[selectName];
 var me=this;
 obj1.length=0;
 obj1.options[0]=new Option("请选择",'');
 for(var i=0;i<this.array.length;i++)
 { 
  if(this.array[i][1]==indexName)
  {
  //alert(this.array[i][1]+" "+indexName);
 obj1.options[obj1.length]=new Option(this.array[i][2],this.array[i][0]);
  }
 }
  } 
 }
 </script>
</head>
<body>
<form name="form1" method="post">
  &nbsp;
  <SELECT ID="s1" NAME="s1" >
 <OPTION selected></OPTION>
  </SELECT>
  <SELECT ID="s2" NAME="s2" >
 <OPTION selected></OPTION>
  </SELECT>
  <SELECT ID="s3" NAME="s3">
 <OPTION selected></OPTION>
  </SELECT>
  <br>
  <br><br>
  <SELECT ID="x1" NAME="x1" >
 <OPTION selected></OPTION>
  </SELECT>
  <SELECT ID="x2" NAME="x2" >
 <OPTION selected></OPTION>
  </SELECT>
  <SELECT ID="x3" NAME="x3">
 <OPTION selected></OPTION>
  </SELECT>
  <SELECT ID="x4" NAME="x4">
 <OPTION selected></OPTION>
  </SELECT>
  <SELECT ID="x5" NAME="x5">
 <OPTION selected></OPTION>
  </SELECT>
 </form>
 </body>
<script language="javascript">
//例子1-------------------------------------------------------------
//数据源
var array=new Array();
 array[0]=new Array("华南地区","根目录","华南地区"); //数据格式 ID，父级ID，名称
 array[1]=new Array("华北地区","根目录","华北地区");
 array[2]=new Array("上海","华南地区","上海");
 array[3]=new Array("广东","华南地区","广东");
 array[4]=new Array("徐家汇","上海","徐家汇");
 array[5]=new Array("普托","上海","普托"); 
 array[6]=new Array("广州","广东","广州");
 array[7]=new Array("湛江","广东","湛江");
 //--------------------------------------------
 //这是调用代码
 var liandong=new CLASS_LIANDONG_YAO(array) //设置数据源
 liandong.firstSelectChange("根目录","s1"); //设置第一个选择框
 liandong.subSelectChange("s1","s2"); //设置子级选择框
 liandong.subSelectChange("s2","s3");
 //例子2-------------------------------------------------------------
 //数据源 
 var array2=new Array();//数据格式 ID，父级ID，名称
 array2[0]=new Array("测试测试","根目录","测试测试"); 
 array2[1]=new Array("华北地区","根目录","华北地区");
 array2[2]=new Array("上海","测试测试","上海");
 array2[3]=new Array("广东","测试测试","广东");
 array2[4]=new Array("徐家汇","上海","徐家汇");
 array2[5]=new Array("普托","上海","普托"); 
 array2[6]=new Array("广州","广东","广州");
 array2[7]=new Array("湛江","广东","湛江");
 array2[8]=new Array("不知道","湛江","不知道");
 array2[9]=new Array("5555","湛江","555");
 array2[10]=new Array("++++","不知道","++++");
 array2[11]=new Array("111","徐家汇","111");
 array2[12]=new Array("222","111","222");
 array2[13]=new Array("333","222","333");
 //--------------------------------------------
 //这是调用代码
 //设置数据源
 var liandong2=new CLASS_LIANDONG_YAO(array2);
 //设置第一个选择框
 liandong2.firstSelectChange("根目录","x1");
 //设置子选择框
 liandong2.subSelectChange("x1","x2")
 liandong2.subSelectChange("x2","x3")
 liandong2.subSelectChange("x3","x4")
 liandong2.subSelectChange("x4","x5")
</script>
</html>
```

希望本文所述对大家的JavaScript程序设计有所帮助。

**您可能感兴趣的文章:**

- [JS实多级联动下拉菜单类，简单实现省市区联动菜单！](https://www.jb51.net/article/9790.htm)
- [jsp从数据库获取数据填充下拉框实现二级联动菜单的方法](https://www.jb51.net/article/73852.htm)
- [js实现简单的联动菜单效果](https://www.jb51.net/article/71250.htm)
- [实例详解AngularJS实现无限级联动菜单](https://www.jb51.net/article/78126.htm)
- [从QQ网站中提取的纯JS省市区三级联动菜单](https://www.jb51.net/article/44836.htm)
- [基于Javascript实现二级联动菜单效果](https://www.jb51.net/article/80421.htm)
- [JS实现的五级联动菜单效果完整实例](https://www.jb51.net/article/106525.htm)
- [JavaScript实现三级联动菜单效果](https://www.jb51.net/article/121289.htm)
- [PHP+JS三级菜单联动菜单实现方法](https://www.jb51.net/article/79954.htm)
- [JavaScript实现联动菜单特效](https://www.jb51.net/article/177941.htm)













# 2.

html写的三个下拉框，如下：

```
 <select name="ddlQYWZYJ" id="ddl_QYWZYJ" class="fieldsel" style="width: 200px;font-size:12px"  ></select>
 <select name="ddlQYWZEJ" id="ddl_QYWZEJ" class="fieldsel" style="width: 200px;font-size:12px"></select>
 <select name="ddlQYWZSJ" id="ddl_QYWZSJ" class="fieldsel" style="width: 200px;font-size:12px"></select>
```

**要求1：加载页面时初始化一级下拉框，当一级下拉框点击取值后加载二级下拉框，点击二级下拉框后加载三级下拉框；**

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

![复制代码](https://common.cnblogs.com/images/copycode.gif)

```
$(document).ready(function () {
            //一级单位的下拉显示框
        $.getJSON(rootPath + 'Dictionary/GetDicDataForSelect?idfield=ID&textfield=VALUE&' + "where=" + JSON2.stringify({
                op: 'and',
                rules: [{ field: 'PARENTID', value: 1, op: 'equal' }]
            }), function (json) {
                var lst = eval(json);
                for (i = 0; i < lst.length; i++) {
                    var tname = lst[i].text;
                    var tid = lst[i].id;
                    $("#ddl_QYWZYJ").append("<option value='" + tid + "'>" + tname + "</option>");
                }
            });
            $("#ddl_QYWZYJ").click(function () {
                GetQYWZYJData();
            });
            $("#ddl_QYWZEJ").click(function () {
                GetQYMSData();
            })
        })
          

         @* 一级下拉框值改变时触发加载二级下拉框*@
        function GetQYWZYJData() {
            var QYWZYJvalue = $('#ddl_QYWZYJ option:selected').val();//选中的文本
            $.getJSON(rootPath + 'Dictionary/GetDicDataForSelect?idfield=ID&textfield=VALUE&' + "where=" + JSON2.stringify({
                op: 'and',
                rules: [{ field: 'PARENTID', value: QYWZYJvalue, op: 'equal' }]
             }), function (json) {
                 $("#ddl_QYWZEJ").html("");//清空下拉框  
                 $("#txt_QYMS").html("");//清空区域描述
                var lst = eval(json);
                 for (var i = 0; i < lst.length; i++) {
                     $("#ddl_QYWZEJ").append("<option value='" + lst[i].id + "'>" + lst[i].name + "</option>");
                 }
            })
        }


        @* 二级下拉框值改变时触发加载三级下拉框*@
        function GetQYMSData() {
            var QYWZEJvalue = $('#ddl_QYWZEJ option:selected').val();//选中的文本
            if (QYWZEJvalue == null) return;
            $.getJSON(rootPath + 'Dictionary/GetDicDataForSelect?idfield=ID&textfield=VALUE&' + "where=" + JSON2.stringify({
                op: 'and',
                rules: [{ field: 'ID', value: QYWZEJvalue, op: 'equal' }]
            }), function (json) {
                $("#ddl_QYWZSJ").html("");
                var lst = eval(json);             
                for (var i = 0; i < lst.length; i++) {
                    $("#ddl_QYWZSJ").append("<option value='" + lst[i].id + "'>" + lst[i].name + "</option>");
                }
            }) 
        }
```









# 3.

## 1.使用<select>标签

优点：可以初始化选中项

缺点：不能自定义option的样式，自带的样式很丑

效果图：

![img](https://img2020.cnblogs.com/blog/1399488/202003/1399488-20200306124715599-1254331518.gif)

代码如下：

```
<select id="group" value="1">
    <option value="1">Dimond</option>
    <option value="2">vertical</option>
</select>
```

 

## 2.使用<input>标签

为input标签添加list属性，下拉选项包含在<datalist>标签中，list的值为<datalist>的id

优点：选项框可以手动输入

缺点：没有value，不适合键值对应关系的输入。且当input中有值时选项框只显示对应选项。

效果图：

![img](https://img2020.cnblogs.com/blog/1399488/202003/1399488-20200306123726564-462919893.gif)

代码如下：

```
<input id="type" type="text" list="typelist" placeholder="请选择">
<datalist id="typelist">
　　<option>Dimond</option>
　　<option>vertical</option>
</datalist>
```

## 3.使用<div>模拟select功能

优点：和select实现的功能完全相同，且可以自定义option样式。

缺点：制作方式麻烦。









# 4.

# [html实现下拉框、switch开关、复选框效果](https://www.cnblogs.com/cyfeng/p/13074162.html)

1、下拉框，效果如下图所示：

![img](https://img2020.cnblogs.com/blog/1726954/202006/1726954-20200609170811224-1107265496.gif)

 

代码：

```php+HTML
<style>
    .selectBox {
      width: 90px;
      margin: 50px;
    }
 
    .select {
      width: 90px;
      background-color: #17a6b5;
      height: 40px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 3px;
    }
 
    .select img {
      width: 20px;
      cursor: pointer;
      transition: all 0.5s;
    }
 
    .selectOption {
      background-color: #666666;
      width: 90px;
      list-style: none;
      padding-left: 0;
      margin-top: 0;
      display: none;
    }
 
    .selectOption li {
      width: 100%;
      color: #ffffff;
      text-align: center;
      cursor: pointer;
    }
 
    .selectOption li:hover {
      background-color: #17a6b5;
    }
  </style>
```

 

```html
<body>
  <div class="selectBox">
    <div class="select">
      <span class="selectText">北京</span>
    </div>
    <ul class="selectOption">
      <li class="selectOption1">北京</li>
      <li class="selectOption2">上海</li>
    </ul>
  </div>
  <script>
    var selectBox = document.getElementsByClassName('selectBox')[0]
    var Select = document.getElementsByClassName('select')[0]
    var selectText = document.getElementsByClassName('selectText')[0]
    var option = document.getElementsByClassName('selectOption')[0]
    var option1 = document.getElementsByClassName('selectOption1')[0]
    var option2 = document.getElementsByClassName('selectOption2')[0]
    // 点击select
    Select.onclick = function () {
      option.style.display = 'block'
    }
    // 鼠标移除
    selectBox.onmouseleave = function () {
      option.style.display = 'none'
    }
    option1.onclick = function () {
      option.style.display = 'none'
      selectText.innerHTML = '北京'
    }
    option2.onclick = function () {
      option.style.display = 'none'
      selectText.innerHTML = '上海'
    }
  </script>
</body>
```

2、switch开关，效果如下图所示：

![img](https://img2020.cnblogs.com/blog/1726954/202006/1726954-20200609173108658-83769277.gif)

代码：

```html
<style>
    .switch-container {
      height: 25px;
      width: 48px;
      margin: 50px;
      display: inline-block;
      overflow: hidden;
    }
 
    .switch-container input {
      display: none;
    }
 
    .switch-container label {
      display: block;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.25);
      cursor: pointer;
      border-radius: 25px;
      transition: all 0.4s ease;
    }
 
    .switch-container label:before {
      content: '';
      display: block;
      border-radius: 25px;
      height: 21px;
      width: 21px;
      box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.08);
      transition: all 0.4s ease;
      background-color: #fff;
      position: relative;
      right: -2px;
      top: 2px;
    }
 
    .switch-container input:checked~label:before {
      right: -25px;
      background-color: rgba(31, 255, 255, 1);
    }
 
    /* .switch-container input:checked~label {
      background-color: #1890ff;
    } */
  </style>
```

 

```html
<body>
  <div class="switch-container">
    <input type="checkbox" id="user-switch" />
    <label for="user-switch"></label>
  </div>
</body>
```

2、复选框，效果如下图所示：

![img](https://img2020.cnblogs.com/blog/1726954/202006/1726954-20200609173633686-689418429.gif)

代码：

```html
<!DOCTYPE html>
<html lang="en">
 
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge" />
  <title>Document</title>
  <style>
    .check {
      display: inline-block;
      cursor: pointer;
      margin: 50px;
    }
 
    .check input {
      display: inline-block;
      width: 14px;
      height: 14px;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      outline: none;
      background: url(./images_select_bgs.png) no-repeat center center;
      background-size: 100% 100%;
      cursor: pointer;
      vertical-align: middle;
      margin-top: -3px;
    }
 
    .check input:checked {
      position: relative;
      background: url(./images_select_duihaos.png) no-repeat center center;
      background-size: 100% 100%;
    }
  </style>
</head>
 
<body>
  <label class="check"> <input type="checkbox" />复选框 </label>
</body>
 
</html>
```