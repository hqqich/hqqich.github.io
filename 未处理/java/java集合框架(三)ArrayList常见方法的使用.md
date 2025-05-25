@[toc]
## 一、什么是ArrarList
ArrayList是Java中的一个动态数组类，可以根据实际需要自动调整数组的大小。ArrayList是基于数组实现的，它内部维护的是一个Object数组，默认初始化容量为10，当添加的元素个数超过了当前容量时，会自动扩容。

ArrayList也被广泛用于Java中的集合框架，例如Java中的List和Vector都是基于ArrayList实现的。下面是ArrayList常见的方法及其使用方法。

使用场景:
ArrayList适用于需要动态添加、删除元素的场景，可以用于存储不确定数量的数据。ArrayList也可以用于需要频繁访问集合元素的场景，因为它的底层是基于数组实现的，可以通过索引值快速访问元素。

另外，由于ArrayList是基于数组实现的，因此在数据量较大时，会占用较多的内存空间，因此需要考虑内存的使用。对于频繁进行插入、删除操作的场景，可以使用LinkedList来代替ArrayList。

总之，ArrayList更适合于需要频繁访问、添加、删除元素的场景，而LinkedList则更适合于需要频繁进行插入和删除操作的场景。

## 二、常见方法
| 返回类型 |方法 |描述 |
|--|--|--|
| boolean | add(E o) | 将指定元素追加到此列表的结尾。|
| void | add(int index, E element) | 将指定的元素插入此列表中的指定位置。 |
| boolean | addAll(Collection<? extends E> c) | 按照指定 Collection 的迭代器所返回的元素顺序，将该 Collection 中的所有元素追加到此列表的尾部。 |
| boolean |addAll(int index, Collection<? extends E> c) | 从指定的位置开始，将指定 Collection 中的所有元素插入到此列表中。 |
| void | clear() | 从此列表中移除所有元素。 |
| void | ensureCapacity(int minCapacity) | 如有必要，增加此 ArrayList 实例的容量，以确保它至少能够容纳最小容量参数所指定的元素数。 |
| E | get(int index) | 返回此列表中指定位置上的元素。 |
| int| indexOf(Object elem) | 搜索指定参数第一次出现的位置，使用 equals 方法进行相等性测试。 |
| boolean | isEmpty()| 测试此列表中是否没有元素。 |
| int | lastIndexOf(Object elem) | 返回指定的对象在列表中最后一次出现的位置索引。 |
| E | remove(int index) | 移除此列表中指定位置处的元素。 |
| boolean | remove(Object o) | 从此列表中移除指定元素的单个实例（如果存在），此操作是可选的。 |
| protected void | removeRange(int fromIndex, int toIndex) | 移除列表中索引在 fromIndex（包括）和 toIndex（不包括）之间的所有元素。 |
| E | set(int index, E element) | 用指定的元素替代此列表中指定位置上的元素。 |
| int | size() | 返回此列表的元素数。 |

下面是一个示例代码:

### add()方法：
在ArrayList末尾添加元素或在指定位置添加。

```java
import java.util.ArrayList;

public class ArrayListDemo {
public static void main(String[] args) {
ArrayList<String> list = new ArrayList<String>();
list.add("apple");
list.add("banana");
list.add("orange");
System.out.println(list);
}
}
```

输出结果为：

```
[apple, banana, orange]
```

### get()方法：
获取指定位置元素。

```java
import java.util.ArrayList;

public class ArrayListDemo {
public static void main(String[] args) {
ArrayList<String> list = new ArrayList<String>();
list.add("apple");
list.add("banana");
list.add("orange");
String fruit = list.get(1);
System.out.println(fruit);
}
}
```

输出结果为：

```
banana
```

### remove()方法：
删除指定位置或指定元素。

```java
import java.util.ArrayList;

public class ArrayListDemo {
public static void main(String[] args) {
ArrayList<String> list = new ArrayList<String>();
list.add("apple");
list.add("banana");
list.add("orange");
list.remove(1);
System.out.println(list);
list.remove("orange");
System.out.println(list);
}
}
```

输出结果为：

```
[apple, orange]
[apple]
```

### size()方法：
获取ArrayList的元素个数。

```java
import java.util.ArrayList;

public class ArrayListDemo {
public static void main(String[] args) {
ArrayList<String> list = new ArrayList<String>();
list.add("apple");
list.add("banana");
list.add("orange");
int size = list.size();
System.out.println(size);
}
}
```

输出结果为：

```
3
```

### set()方法：
替换指定位置的元素。

```java
import java.util.ArrayList;

public class ArrayListDemo {
public static void main(String[] args) {
ArrayList<String> list = new ArrayList<String>();
list.add("apple");
list.add("banana");
list.add("orange");
list.set(1, "pear");
System.out.println(list);
}
}
```

输出结果为：

```
[apple, pear, orange]
```

### indexOf()方法：
查找指定元素的位置。

```java
import java.util.ArrayList;

public class ArrayListDemo {
public static void main(String[] args) {
ArrayList<String> list = new ArrayList<String>();
list.add("apple");
list.add("banana");
list.add("orange");
int index = list.indexOf("banana");
System.out.println(index);
}
}
```

输出结果为：

```
1
```

### clear()方法：
清空ArrayList中的所有元素。

```java
import java.util.ArrayList;

public class ArrayListDemo {
public static void main(String[] args) {
ArrayList<String> list = new ArrayList<String>();
list.add("apple");
list.add("banana");
list.add("orange");
list.clear();
System.out.println(list);
}
}
```

输出结果为：

```
[]
```
有不好的地方,可以指出大家一起共同进步