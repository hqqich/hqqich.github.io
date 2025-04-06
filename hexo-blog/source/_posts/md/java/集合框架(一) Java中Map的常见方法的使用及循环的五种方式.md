Map是Java中的一种集合，它是一种键值对的映射表，可以根据键快速获取对应的值。
@[toc]
## 1. 常见使用方式

以下是Java中Map的常见方法使用示例及运行结果：

### 1.1 存储键值对

使用put()方法向Map中添加键值对：

```java
Map<String, Integer> map = new HashMap<>();
map.put("apple", 10);//新增键值对,左边键右边值
map.put("banana", 20);
System.out.println(map);
```

输出结果：

```
{banana=20, apple=10}
```

### 1.2. 获取值

使用get()方法根据键获取对应的值：

```java
Map<String, Integer> map = new HashMap<>();
map.put("apple", 10);
map.put("banana", 20);
int value = map.get("apple");//获取指定键的值
System.out.println(value);
```

输出结果：

```
10
```

### 1.3. 判断是否包含某个键或值

使用containsKey()和containsValue()方法：

```java
Map<String, Integer> map = new HashMap<>();
map.put("apple", 10);
map.put("banana", 20);
boolean hasKey = map.containsKey("apple");//判断此map集合里是否存在指定键
boolean hasValue = map.containsValue(20);//判断此map集合里是否存在指定值
System.out.println(hasKey);
System.out.println(hasValue);
```

输出结果：

```
true
true
```

### 1.4. 获取所有键或值

使用keySet()和values()方法获取所有键或值：

```java
Map<String, Integer> map = new HashMap<>();
map.put("apple", 10);
map.put("banana", 20);
Set<String> keys = map.keySet();//获取所有的键
Collection<Integer> values = map.values();//获取所有的值
System.out.println(keys);
System.out.println(values);
```

输出结果：

```
[banana, apple]
[20, 10]
```

### 1.5. 删除键值对

使用remove()方法删除键值对：

```java
Map<String, Integer> map = new HashMap<>();
map.put("apple", 10);
map.put("banana", 20);
map.remove("banana");//根据指定的键删除该键值对
System.out.println(map);
```

输出结果：

```
{apple=10}
```


## 2. 循环方式

Map提供了很多不同的循环方式，可根据需求选择不同的方式。以下列举了五种常见的循环方式：

### 2.1使用for-each循环遍历：
使用for-each循环遍历Map中的所有键值对，代码示例：

```java
Map<String, Integer> map = new HashMap<>();
for (Map.Entry<String, Integer> entry : map.entrySet()) {
String key = entry.getKey();
Integer value = entry.getValue();
// Do something with key and value
}
```

### 2.2使用Iterator遍历：
使用Iterator遍历Map中的所有键值对，代码示例：

```java
Map<String, Integer> map = new HashMap<>();
Iterator<Map.Entry<String, Integer>> it = map.entrySet().iterator();
while (it.hasNext()) {
Map.Entry<String, Integer> entry = it.next();
String key = entry.getKey();
Integer value = entry.getValue();
// Do something with key and value
}
```

### 2.3遍历所有键：
使用keySet()方法获取所有键，然后遍历所有键，代码示例：

```java
Map<String, Integer> map = new HashMap<>();
for (String key : map.keySet()) {
Integer value = map.get(key);
// Do something with key and value
}
```

### 2.4遍历所有值：
使用values()方法获取所有值，然后遍历所有值，代码示例：

```java
Map<String, Integer> map = new HashMap<>();
for (Integer value : map.values()) {
// Do something with value
}
```

### 2.5 使用Lambda表达式遍历：
使用Lambda表达式遍历Map中的所有键值对，代码示例：

```java
Map<String, Integer> map = new HashMap<>();
map.forEach((key, value) -> {
// Do something with key and value
});
```
总结的有什么不好的地方,可以指出,大家共同进步。