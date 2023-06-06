# [通过Gson解析Json数据](https://www.cnblogs.com/tianzhijiexian/p/4246497.html)

![img](https://images0.cnblogs.com/blog/651487/201501/241957473132835.png)

Json是一种数据格式，便于数据传输、存储、交换；
Gson是一种组件库，可以把java对象数据转换成json数据格式。

gson.jar的下载地址：[http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22gson%22](http://search.maven.org/#search|ga|1|a%3A"gson")

 

**一、Json数据样式**

为了便于理解我们先来看看Json的数据样式：

**1. 单个数据对象**



```
{
    "id": 100,
    "body": "It is my post",
    "number": 0.13,
    "created_at": "2014-05-22 19:12:38"
}
```



**2. 多组数据**

这是一组Json数据，可以看到就像数组一样，一组数据是用[]围起来的，内部{}围起来的就是单个的数据对象



```
[{
    "id": 100,
    "body": "It is my post1",
    "number": 0.13,
    "created_at": "2014-05-20 19:12:38"
},
{
    "id": 101,
    "body": "It is my post2",
    "number": 0.14,
    "created_at": "2014-05-22 19:12:38"
}]
```



**3. 嵌套数据**

这段数据是用{}围起来的所以是单个数据对象，我们又能发现其内部又是一个数据对象，名字叫foo2.这就是嵌套的Json数据

```
{
    "id": 100,
    "body": "It is my post",
    "number": 0.13,
    "created_at": "2014-05-22 19:12:38",
    "foo2": {
        "id": 200,
        "name": "haha"
    }
}
```



**二、通过JsonReader解析Json数据**

**2.1 数据**

```
String jsonData = "[{\"username\":\"name01\",\"userId\":001},{\"username\":\"name02\",\"userId\":002}]";
```

一般的Json都是从网上获取的，这里为了简单将Json数据直接用String定义。因为该数据中有各种标点符号，所以要用转译。

 

**2.2 解析**


```
    /**
     * @description 通过JsonReader解析Json对象
     * 
     * @web http://codego.net/480737/
     */
    private void jsonReaderTest() {
        // 这里的Json放到string中，所以加上了转译
        String jsonData = "[{\"username\":\"name01\",\"userId\":001},{\"username\":\"name02\",\"userId\":002}]";

        JsonReader reader = new JsonReader(new StringReader(jsonData));
        reader.setLenient(true); // 在宽松模式下解析
        try {
            reader.beginArray(); // 开始解析数组（包含一个或多个Json对象）
            while (reader.hasNext()) { // 如果有下一个数据就继续解析
                reader.beginObject(); // 开始解析一个新的对象
                while (reader.hasNext()) {
                    String tagName = reader.nextName(); // 得到下一个属性名
                    if (tagName.equals("username")) {
                        System.out.println(reader.nextString());
                    } else if (tagName.equals("userId")) {
                        System.out.println(reader.nextString());
                    }
                }
                reader.endObject(); // 结束对象的解析
            }
            reader.endArray(); // 结束解析当前数组
        } catch (IOException e) {
            // TODO 自动生成的 catch 块
            e.printStackTrace();
        }
    }
```


在JsonReader的构造函数中传入json data，然后开始解析，判断是否还有下一个对象，如果有就开始解析对象名和对象体，直到解析完毕。

 

 **三、通过Gson解析单个Json对象**

 **3.1 数据**

assets/Json01

```
{
    "id": 100,
    "body": "It is my post",
    "number": 0.13,
    "created_at": "2014-05-22 19:12:38"
}
```

**3.2 载入数据** 

因为这个数据是定义在本地的，所以要先加载到内存中。方法是通过getAssets()得到AssetManager对象，再通过open(文件名)来获得文件流。这里因为我能确保本地的文件小于1m，所以就没做循环读取，实际中请务必用循环读取的方式。最终得到的数据存放在strData中。


```
　　/**
     * @description 通过assets文件获取json数据，这里写的十分简单，没做循环判断。
     *
     * @return Json数据（String）
     */
    private String getStrFromAssets(String name) {
        String strData = null;
        try {
            InputStream inputStream = getAssets().open(name);
            byte buf[] = new byte[1024];
            inputStream.read(buf);
            strData = new String(buf);
            strData = strData.trim();

        } catch (IOException e) {
            // TODO 自动生成的 catch 块
            e.printStackTrace();
        }
        System.out.println("strData = " + strData);
        return strData;
    }
```


 

**3.3 建立类**

首先，我们要根据数据的格式定义一个类


```
public class Foo01 {
    public int id;
    public String body;
    public float number;
    public String created_at;
}
```


**这个类的定义方式有讲究：**

1>类里面的成员变量名必须跟Json字段里面的name是一模一样的：

```
"id": 100,  ----  public int id;
```

2>如果Json数据是嵌套定义的，那么这个类中就的成员变量肯定有个类对象，一般这个类包含内部类


```
{
    "id": 100,
    "body": "It is my post",
    "number": 0.13,
    "created_at": "2014-05-22 19:12:38",
    "childFoo": {
        "id": 200,
        "name": "jack"
    }
}
```



```
public class Foo02 {
    private int id;
    private String body;
    private float number;
    
    @SerializedName("created_at")
    private Date createdAt; // 通过注释的方式更换名字，同时保证使用方式不变。

}
```

 

**3.4 开始解析**


```
    /**
     * @description 将json数据解析为类对象
     */
    private void GsonTest01() {
        Foo01 foo = new Gson().fromJson(getStrFromAssets("Json01"), Foo01.class);
        System.out.println("id = " + foo.id);
    }
```

 

**3.5 结果**

 

**四、通过Gson将数据转换为Date对象，并且重命名**

**4.1 数据**

本例的数据和上面完全一样，是单个的Json数据

```
{
    "id": 100,
    "body": "It is my post",
    "number": 0.13,
    "created_at": "2014-05-22 19:12:38"
}
```

我们可以明显的发现，最后的建立日期是一个date对象，但通过一般的解析方式，我们只能把日期数据赋值给string，但以后的操作就很麻烦了。因此，我们用到了gsonBuilder。gsonBuilder可以通过检查json数据的格式，讲符合用户设置格式的数据变为相应的对象，下面就来演示一下。

 

**4.2 解析**

解析还是两步，首先定义一个类：


```
public class Foo02 {
    private int id;
    private String body;
    private float number;
    
    @SerializedName("created_at")
    private Date createdAt; // 通过注释的方式更换名字，同时保证使用方式不变。
    
    public String get_my_date() {
        return createdAt.toString();
    }
}
```

 然后，通过gson解析：


```
    /**
     * @description 当json中有日期对象时，通过定义构建格式生成需要的date对象
     * 当json数据命名和java命名产生不一致时，可以通过注释的方式实现更换名字，更方便进行代码处理
     */
    private void GsonTest02() {
        GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.setDateFormat("yyyy-MM-dd HH:mm:ss"); // 设置日期的格式，遇到这个格式的数据转为Date对象
        Gson gson = gsonBuilder.create();
        Foo02 foo = gson.fromJson(getStrFromAssets("Json01"), Foo02.class);
        System.out.println("date = " + foo.get_my_date());
    }
```



分析：初始化GsonBuilder后，通过setDateFormat来设置什么样的数据会变为date对象，因为原始数据中created_at的日期格式是yyyy-mm-dd HH:mm:ss所以就写了如下的代码：

```
gsonBuilder.setDateFormat("yyyy-MM-dd HH:mm:ss"); // 设置日期的格式，遇到这个格式的数据转为Date对象
```

之后再通过gsonBuilder的create来建立gson对象，然后解析即可。

 

**4.3 重命名**

有时候json的对象名不符合java命名规则，比如这个created_at就没采用驼峰命名法，但java代码中推荐用驼峰命名，这样就产生了矛盾，虽然可以用别的方式来解决，但我们还希望用代码在不影响解析的情况下，产生符合java命名规则的成员变量。实现也相当简单，用注释。


```
public class Foo02 {
    private int id;
    private String body;
    private float number;
    
    @SerializedName("created_at")
    private Date createdAt; // 通过注释的方式更换名字，同时保证使用方式不变。
    
    public String get_my_date() {
        // 可以通过simpleDateFormat指定data对象的输出格式，注意：如果要添加自定义字符串，比如下面的custom，必须在字符串两边加单引号。
        SimpleDateFormat dateFormat = new SimpleDateFormat("'custom'_yyyyMMdd_HHmmss");
        //return dateFormat.format(created_at);
        
        return createdAt.toString();
    }
}
```


在建立Date对象时，我们在上面加上了换名设定，这样gson解析时会根据created_at来初始化这个date对象，而我们使用的时候用craetedAt就可以了。这里顺便提一下，如果你要输出date，可以通过simpleDtaeFormat来设置输出的格式，这点在设置照片名或文件名时很有用。当然，如果你没这个需求，你完全可以用toString()方法。

 

**4.4 结果**


可以看见，这里的date对象是按照标准的格式进行显示的，说明解析成功！

 

**五、解析嵌套的Json数据**

**5.1数据**


```
{
    "id": 100,
    "body": "It is my post",
    "number": 0.13,
    "created_at": "2014-05-22 19:12:38",
    "childFoo": {
        "id": 200,
        "name": "jack"
    }
}
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

先来分析下数据，这是一个单个数据，里面嵌套了一个childFoo。那么构建类的时候就需要有两个类，一个类包含id，body,number,created_at,childFoo.另一个类中包含id，name。

 

**5.2 构建类**

这里为了简单，把两个类合二为一了。注意下这个内部类其实可以不叫ChildFoo的，只要这个类产生的对象的名字叫做childFoo就行（区分大小写）。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
package com.kale.gsontest;

/**
 * @author:Jack Tony
 * @description  : 针对有嵌套的json数据
 * @date  :2015年1月24日
 */
public class Foo03 {
    public int id;
    public String body;
    public float number;
    public String created_at;
    public ChildFoo childFoo;

    public class ChildFoo {
        public int id;
        public String name;
    }
}
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

 

**5.3 解析**

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
    /**
     * @description 解析嵌套是Json数据
     *
     */
    private void GsonTest03() {
        Foo03 foo = new Gson().fromJson(getStrFromAssets("Json02"), Foo03.class);
        System.out.println("name = " + foo.childFoo.name);
    }
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

为了看是否解析成功，这里直接输出类中内部类的成员变量：name

 

**5.4 结果**

![img](https://images0.cnblogs.com/blog/651487/201501/241936517032172.jpg)

可以看见，输出了childFoo中的name值：jack

 

**六、将Json序列解析为数组**

**6.1 数据**

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
[{
    "id": 100,
    "body": "It is my post1",
    "number": 0.13,
    "created_at": "2014-05-20 19:12:38"
},
{
    "id": 101,
    "body": "It is my post2",
    "number": 0.14,
    "created_at": "2014-05-22 19:12:38"
}]
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

通常情况下Json数据包含多个对象，如果不包含多个对象的情况比较少见。举个例子：

http://m.weather.com.cn/data/101010100.html

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
{"weatherinfo":{"city":"北京","city_en":"beijing","date_y":"2014年3月4日","date":"","week":"星期二","fchh":"11","cityid":"101010100","temp1":"8℃~-3℃","temp2":"8℃~-3℃","temp3":"7℃~-3℃","temp4":"8℃~-1℃","temp5":"10℃~1℃","temp6":"10℃~2℃","tempF1":"46.4℉~26.6℉","tempF2":"46.4℉~26.6℉","tempF3":"44.6℉~26.6℉","tempF4":"46.4℉~30.2℉","tempF5":"50℉~33.8℉","tempF6":"50℉~35.6℉","weather1":"晴","weather2":"晴","weather3":"晴","weather4":"晴转多云","weather5":"多云","weather6":"多云","img1":"0","img2":"99","img3":"0","img4":"99","img5":"0","img6":"99","img7":"0","img8":"1","img9":"1","img10":"99","img11":"1","img12":"99","img_single":"0","img_title1":"晴","img_title2":"晴","img_title3":"晴","img_title4":"晴","img_title5":"晴","img_title6":"晴","img_title7":"晴","img_title8":"多云","img_title9":"多云","img_title10":"多云","img_title11":"多云","img_title12":"多云","img_title_single":"晴","wind1":"北风4-5级转微风","wind2":"微风","wind3":"微风","wind4":"微风","wind5":"微风","wind6":"微风","fx1":"北风","fx2":"微风","fl1":"4-5级转小于3级","fl2":"小于3级","fl3":"小于3级","fl4":"小于3级","fl5":"小于3级","fl6":"小于3级","index":"寒冷","index_d":"天气寒冷，建议着厚羽绒服、毛皮大衣加厚毛衣等隆冬服装。年老体弱者尤其要注意保暖防冻。","index48":"冷","index48_d":"天气冷，建议着棉服、羽绒服、皮夹克加羊毛衫等冬季服装。年老体弱者宜着厚棉衣、冬大衣或厚羽绒服。","index_uv":"中等","index48_uv":"中等","index_xc":"较适宜","index_tr":"一般","index_co":"较舒适","st1":"7","st2":"-3","st3":"8","st4":"0","st5":"7","st6":"-1","index_cl":"较不宜","index_ls":"基本适宜","index_ag":"易发"}}
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

现在我们想把这多个对象解析为一个数组对象，应该怎么做呢？

 

**6.2 建立类**

十分简单，包含一个对象中的信息即可。顺便一提，如果你不需要解析那么多结果，你可以仅仅列出你想要解析的变量。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
public class Foo01 {
    public int id;
    public String body;
    public float number;
    public String created_at;
}
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

 

**6.3 解析**

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
    /**
     * @description 解析为数组
     *
     */
    private void GsonTest04() {
        Foo01[] foos = new Gson().fromJson(getStrFromAssets("Json03"), Foo01[].class);
        System.out.println("name01 = " + foos[0].id);
        System.out.println("name02 = " + foos[1].id);
        // 这时候想转成List的话调用如下方法
        // List<Foo> foosList = Arrays.asList(foos);
    }
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

gson的构造函数提供了解析成数组对象的方法，所以直接像解析单个对象一样使用就行。

 

**6.4 结果**

![img](https://images0.cnblogs.com/blog/651487/201501/241946149066633.jpg)

 

**七、将数据解析为list**

**7.1 数据**

这个数据和上面完全一样

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
[{
    "id": 100,
    "body": "It is my post1",
    "number": 0.13,
    "created_at": "2014-05-20 19:12:38"
},
{
    "id": 101,
    "body": "It is my post2",
    "number": 0.14,
    "created_at": "2014-05-22 19:12:38"
}]
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

 

**7.2 建立类**

类也和上面的一样，没任何变化

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
package com.kale.gsontest;

public class Foo01 {
    public int id;
    public String body;
    public float number;
    public String created_at;
}
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

 

**7.3 解析**

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
    /**
     * @description 将json序列变为list对象
     *
     */
    private void GsonTest05() {
        Type listType = new TypeToken<ArrayList<Foo01>>(){}.getType();
        ArrayList<Foo01> foos = new Gson().fromJson(getStrFromAssets("Json03"), listType);
        for (int i = 0; i < foos.size(); i++) {
            System.out.println("name ["+ i +"] = " + foos.get(i).id);
        }
    }
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

这里不同的一点就是要定义list的类型，其余的没什么可说的。一般我们都会用这种方式将数据放到list中，很少会用到解析成数组。

 

**7.4 结果**

![img](https://images0.cnblogs.com/blog/651487/201501/241952075167825.jpg)

 

**源码下载：http://download.csdn.net/detail/shark0017/8393351**

 

 

参考自：

http://stormzhang.com/android/2014/05/22/android-gson/

http://www.cnblogs.com/jxgxy/p/3677256.html

http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22gson%22

 