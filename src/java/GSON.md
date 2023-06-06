# GSON
GSON弥补了JSON的许多不足的地方，在实际应用中更加适用于Java开发。在这里，我们主要讲解的是利用GSON来操作java对象和json数据之间的相互转换，包括了常见的对象序列化和反序列化的知识。

## 一、前言

因为json有2种类型：

- 一种是对象，`object` -> `{key:value,key:value,...}` 。
- 另一种是数组，`array` -> `[value,value,...]` 。

所以针对这两种类型，来展开对json数据的操作。

GSON在解析json的时候，大体上有2种类型，一种是直接在内存中生成object或array，通过手工指定key来获取值；另一种是借助javabean来进行映射获取值。

## 二、对 `json` 数据进行反序列化，得到`java` 对象

### 1、不借助`java` 类，直接解析`json` 数据

#### 1、`json` 是对象类型

当ajax传过来的json数据属于对象时，不论这个对象简单还是复杂，都可以轻松地把它们给解析出来。

ajax传过来的json数据（是对象形式）：



```javascript
var data_json =  {
        "sex": '男',
        "hobby":["baskte","tennis"],
        "introduce": {
            "name":"tom",
            "age":23
        }
    };

data: JSON.stringify(data_json),
```

GSON解析：



```java
BufferedReader reader = request.getReader();
    // 读取json数据
    StringBuffer buffer = new StringBuffer();
    String s;
    while ((s = reader.readLine()) != null) {
        buffer.append(s);
    }
    String json = buffer.toString();
    System.out.println("json:" + json);  

    // json解析器，解析json数据
    JsonParser parser = new JsonParser();
    JsonElement element = parser.parse(json);
    // json属于对象类型时
    if (element.isJsonObject()) {  
        JsonObject object = element.getAsJsonObject();  // 转化为对象

        // 1. value为string时，取出string
        String sex = object.get("sex").getAsString();                         System.out.println("sex:" + sex);

        // 2. value为array时，取出array
        JsonArray hobbies = object.getAsJsonArray("hobby");  // 
        for (int i = 0; i < hobbies.size(); i++) {
            String hobby = hobbies.get(i).getAsString();
            System.out.println("hobby:" + hobby);
        }

        // 3. value为object时，取出object
        JsonObject introduce = object.getAsJsonObject("introduce");
        String name = introduce.get("name").getAsString();
        int age = introduce.get("age").getAsInt();
        System.out.println("name:" + name+";age:" + age);
    }
```

**解读：**

很明显，对于传过来的对象类型的json数据，使用GSON是很方便进行解析的，在得到了json数据对应的`JsonObject` 对象之后，我们就可以很简单地进行操作了。这种方法是直接获取json中的值，而没有进行java对象的还原（简单情况下，没有必要生成相应的javabean）。

#### 2、`json` 是数组类型

ajax传过来的json数据（是数组形式）：



```javascript
var data_json =  [
    "cake",
    2,
    {"brother":"tom","sister":"lucy"},
    ["red","orange"]
];

data: JSON.stringify(data_json),
```

GSON解析：



```java
BufferedReader reader = request.getReader();
    StringBuffer buffer = new StringBuffer();
    String s;
    while ((s = reader.readLine()) != null) {
        buffer.append(s);
    }
    String json = buffer.toString();
    System.out.println("json:"+json);

    // json解析器，解析json数据
    JsonParser parser = new JsonParser();
    JsonElement element = parser.parse(json);
    // json属于数组类型
    if (element.isJsonArray()) {  
        JsonArray array = element.getAsJsonArray();

        // 1. value为string时，取出string
        String array_1 = array.get(0).getAsString();
        System.out.println("array_1:"+array_1);

        // 2. value为int时，取出int
        int array_2 = array.get(1).getAsInt();
        System.out.println("array_2:"+array_2);

        // 3. value为object时，取出object
        JsonObject array_3 = array.get(2).getAsJsonObject();
        String brother = array_3.get("brother").getAsString();
        String sister = array_3.get("sister").getAsString();
        System.out.println("brother:"+brother+";sister:"+sister);

        // 4. value为array时，取出array
        JsonArray array_4 = array.get(3).getAsJsonArray();
        for (int i = 0; i < array_4.size(); i++) {
        System.out.println(array_4.get(i).getAsString());
        }

    }
```

**解读：**

当json是数组类型的时候，使用GSON操作和上一小节几乎差不多，只不过是第一步生成的json对象是数组而已。上面2种方式解析json十分简单，在日常使用中足够了。

但是对于有规律的json数据，比如往往是可以映射成一个javabean对象，那么我们就没有必要一个个手工取值了，我们可以借助javabean配合GSON来更加快速地解析json数据。

### 2、借助`java` 类，生成对应`java` 对象来解析数据

详细的前端`json` 数据，可以看前面的反例，以下只是使用直接的`json`数据进行说明。

生成对于的java对象之后，就可以通过getter方法来获取相应的数据了。

**通用代码：**

在这个方法里，借助json数据来生成java对象的代码都是一致的：



```java
Gson gson = new Gson();
BeanType bean = gson.fronJson(jsonData, BeanType.class);
```

#### 1. `json` 是对象类型

##### 1.1 基本案列

**`json` 数据**



```javascript
{"name":"tom","salary":2999}
```

**java类**



```java
public class MyEntry {
    private String name;
    private int age;
    public String address;
    public int salary;
    // getter、setter、toString
}
```

**`java` 代码**



```java
String json1 = "{\"name\":\"tom\",\"salary\":2999}";
Gson gson1 = new Gson();
MyEntry entry1 = gson1.fromJson(json1, MyEntry.class);
System.out.println(entry1.toString());  // name:tom,age:0,address:null,salary:2999
```

**解读**

可以看出，对于不完整的`json` 数据，在我们映射了相应的`java` 类之后，转化得到的java对象，未赋值的字段都是默认值。这就符合java的规范和常理。

##### 1.2 字段名并不一致怎么办？

如果前端传过来的`json` 数据的key和我们java类的字段不一致，就需要我们在java类中手工进行指定。

**`@SerializedName()` 注解**

比如对于上面的`json` 数据，`salary` 改成`money` ，我们得到的java对象中，`salary` 就会变成默认值：0。

因此，我们要使用注解:



```java
@SerializedName("money")
private String salary;

@SerializedName({"money", "salary"})  // 可以有多个备选值
private String salary;
```

##### 1.3 如何限定某个字段不参加序列化或反序列化？

**`@Expose()注解`**

如果想要让java类的某些字段不参加序列化或反序列化，可以显示来设置。如：



```java
@Expose(serialize=false,deserialize=false)
private String name;
```

上面的`name` 字段将不参加序列化及反序列化。

##### 1.4 复合的对象怎么处理？

当`json` 数据是对象形式时，常见的`value` 会是一个数组或对象。如：



```json
{
  "name": "tom",
  "age": 0,
  "money": 2999,
  "hobbies": [
    "basket",
    "tennis"
  ],
  "collections": {
    "2": "paint",
    "3": "mouse"
  }
}
```

举一反三，`value` 是数组时（hobbies），对应在java类中也是数组；`value` 是对象时，对应在java类中就是map（k-v对）了。

因此，我们可以很容易得到对应的java类：



```java
private List<String> hobbies;
private Map<Integer, String> collections;
```

**解读：** 可知，再复杂的`json` 数据，我们也可以构造出对应的java类。

#### 2. `json` 是数组类型

##### 1.1 基本案例：

json数据



```json
["apple", "banana", "pear"]
```

显然，数组在java中对应的也是数组。

java代码



```java
String json2 = "[\"apple\", \"pear\", \"banana\"]";
Gson gson2 = new Gson();
// 传入的java类型是String[].class
String[] fruits = gson2.fromJson(json2, String[].class);  
```

##### 1.2 我想用`List` 数组

对于上面这种简单的数组形式的json数据，我们还可以反序列化为List类型的数组。因为List进行增删改都比较方便。

这里就要使用泛型了，具体的泛型讲解，会在下面进行说明。



```java
String json2 = "[\"apple\", \"pear\", \"banana\"]";
Gson gson2 = new Gson();
List<String> fruitList = gson2.fromJson(json2, new TypeToken<List<String>>(){}.getType());
```

### 3、使用泛型

有的时候，传过来的json数据在格式上是很相近的，只不过某个字段的value不固定，如果为此生成多个相似的java类就十分多余了。

如：前端传过来的json数据主要是2类：



```json
{"code":"0","message":"success","data":{}}
```



```json
{"code":"0","message":"success","data":[]}
```

对于字段`data` ，有时候是对象，有时候是数组。

这里，我们将使用`Result<T>` 来映射`json`数据，使用`MyEntry` 类来映射`json` 数据的`data` 部分。这意味着，对于不同的json数据，我们将不再生成多个java类，而是动态生成所需的java对象。

result对象



```java
public class Result<T>{
    public int code;
    public String message;
    public T data;
    // getter、setter
}
```

##### 1.1 data为对象的json1：



```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "name": "tom",
      "age": 32,
      "address": "street one",
      "salary": 4999
    },
    {
      "name": "tom",
      "age": 32,
      "address": "street one",
      "salary": 4999
    }
  ]
}
```

java代码



```java
String typeJson1 = "{\n" +
                        "  \"code\":0,\n" +
                        "  \"message\":\"success\",\n" +
                        "  \"data\":{\n" +
                        "    \"name\":\"tom\",\n" +
                        "    \"age\":32,\n" +
                        "    \"address\":\"street one\",\n" +
                        "    \"salary\":4999\n" +
                        "  }\n" +
                        "}";
Gson typeGson1 = new Gson();
// 动态生成所需的java类的类型
Type type1 = new TypeToken<Result<MyEntry>>(){}.getType();
// 动态生成java对象
Result<MyEntry> result1 = typeGson1.fromJson(typeJson1, type1);
System.out.println(result1);
```

##### 1.2 data为数值的json2：



```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "name": "tom",
      "age": 32,
      "address": "street one",
      "salary": 4999
    },
    {
      "name": "lucy",
      "age": 24,
      "address": "street three",
      "salary": 2333
    }
  ]
}
```

java代码



```java
String typeJson2 = "{\n" +
                        "  \"code\": 0,\n" +
                        "  \"message\": \"success\",\n" +
                        "  \"data\": [\n" +
                        "    {\n" +
                        "      \"name\": \"tom\",\n" +
                        "      \"age\": 32,\n" +
                        "      \"address\": \"street one\",\n" +
                        "      \"salary\": 4999\n" +
                        "    },\n" +
                        "    {\n" +
                        "      \"name\": \"lucy\",\n" +
                        "      \"age\": 24,\n" +
                        "      \"address\": \"street three\",\n" +
                        "      \"salary\": 2333\n" +
                        "    }\n" +
                        "  ]\n" +
                        "}";
Gson typeGson2 = new Gson();
// 再次动态生成java类型
Type type2 = new TypeToken<Result<List<MyEntry>>>(){}.getType();
// 再次动态生成java对象
Result<List<MyEntry>> result2 = typeGson2.fromJson(typeJson2, type2);
System.out.println(result2);
```

## 四、`java` 对象序列化为`json` 数据

这一部分，主要是讲解如何将一个java对象序列化为json数据，也会涉及到如何组装这个java对象。

### 1、由具体的`java`类对象，序列化为`json` 数据

我们可以直接把java对象给序列化为json数据。对于未设置的属性，会采取默认值；但是如果默认是null的话，该属性就不会被序列化。

java类，我们仍然采用的是`MyEntry` 类。



```java
MyEntry entry2 = new MyEntry();
entry2.setName("tom");
entry2.setSalary(2999);
List<String> hobbies = new ArrayList<>();
hobbies.add("basket");
hobbies.add("tennis");
entry2.setHobbies(hobbies);
Map<Integer, String> collections = new HashMap<>();
collections.put(2, "paint");
collections.put(3, "mouse");
entry2.setCollections(collections);
Gson gson2 = new Gson();
String json2 = gson2.toJson(entry2);
System.out.println(json2);
// {"name":"tom","age":0,"money":2999,"hobbies":["basket","tennis"],"collections":{"2":"paint","3":"mouse"}}
```

对于非值属性，即引用属性，如hobbies、collections，如果没有设置值的话，在序列化后的json数据中，是不会出现的。而如果是值属性的话，没有设置值的情况下，在json数据中会是使用java中的默认值。

#### 1.1 要生成对象形式的`json` 数据

- 第一种方法是上面的，直接使用java类对象
- 还可以使用生成map对象，进行序列化

#### 1.2 要生成数组形式的`json` 数据

- 第一种，使用`String[]` 字符串数组来生成
- 还可以使用List对象来序列化
- 还可以使用Set对象来序列化

对于序列化的要求，更多的情况会使用注解来选择需要/不需要进行序列化的字段。