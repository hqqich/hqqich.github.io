@[toc]
## 一、什么是LinkedList

LinkedList是Java中的一个双向链表。

它实现了List和Deque接口，在使用时可以像List一样使用元素索引，也可以像Deque一样使用队列操作。

LinkedList每个节点都包含了前一个和后一个节点的引用，因此可以很方便地在其中进行节点的插入、删除和移动。

相比于ArrayList，LinkedList的插入和删除操作效率更高，但是访问元素时效率较低，因为需要遍历链表来寻找目标元素。

LinkedList的使用场景主要是场景是需要频繁执行插入和删除操作且对访问操作的效率要求较低的情况。例如队列、栈等数据结构的实现，或者是需要实现LRU缓存淘汰策略的场景。

## 二、常用的方法

| 返回类型 |方法 |描述 |
|--|--|--|
| boolean | add(E o) |将指定元素追加到此列表的结尾。|
| void | add(int index, E element) | 在此列表中指定的位置插入指定的元素。 |
| boolean | addAll(Collection<? extends E> c) | 追加指定 collection 中的所有元素到此列表的结尾，顺序是指定 collection 的迭代器返回这些元素的顺序。 |
| boolean |addAll(int index, Collection<? extends E> c) | 将指定集合中的所有元素从指定位置开始插入此列表。 |
| void | addFirst(E o) | 将指定元素插入此列表的开头。 |
| void | addLast(E o) |将指定元素追加到此列表的结尾。 |
| void | clear() | 从此列表中移除所有元素。 |
| boolean | contains(Object o) | 如果此列表包含指定元素，则返回 true。 |
| E | get(int index) | 返回此列表中指定位置处的元素。 |
| E | getFirst() | 返回此列表的第一个元素。 |
| E | getLast() | 返回此列表的最后一个元素。 |
| int | indexOf(Object o) | 返回此列表中首次出现的指定元素的索引，如果列表中不包含此元素，则返回 -1。 |
| int |lastIndexOf(Object o) | 返回此列表中最后出现的指定元素的索引，如果列表中不包含此元素，则返回 -1。 |
| ListIterator<E> | listIterator(int index) | 返回此列表中的元素的列表迭代器（按适当顺序），从列表中指定位置开始。 |
| E | peek() | 找到但不移除此列表的头（第一个元素）。 |
| E | remove() | 找到并移除此列表的头（第一个元素）。 |
| E | remove(int index) | 移除此列表中指定位置处的元素。 |
| boolean | remove(Object o) | 移除此列表中首次出现的指定元素。 |
| E | removeFirst() | 移除并返回此列表的第一个元素。 |
| E | removeLast() | 移除并返回此列表的最后一个元素。 |
| E | set(int index, E element) | 将此列表中指定位置的元素替换为指定的元素。 |
| int | size() | 返回此列表的元素数。 |

下面是一个示例代码：

### 2.1 add()：
在链表的末尾添加元素。如果需要在指定位置添加元素，则可以使用add(index, element)方法。

代码演示：

```java
LinkedList<String> list = new LinkedList<>();
list.add("apple");
list.add("banana");
list.add("orange");

System.out.println(list); // 结果:[apple, banana, orange]
```

### 2.2 remove()：
在链表中删除指定元素。如果需要删除指定位置的元素，则可以使用remove(index)方法。

代码演示：

```java
LinkedList<String> list = new LinkedList<>();
list.add("apple");
list.add("banana");
list.add("orange");

list.remove("banana");

System.out.println(list); // 结果:[apple, orange]
```

### 2.3 get()：
获取指定位置的元素。

代码演示：

```java
LinkedList<String> list = new LinkedList<>();
list.add("apple");
list.add("banana");
list.add("orange");

String second = list.get(1);

System.out.println(second); // 结果:banana
```

### 2.4 set()：
替换指定位置的元素。

代码演示：

```java
LinkedList<String> list = new LinkedList<>();
list.add("apple");
list.add("banana");
list.add("orange");

list.set(1, "grape");

System.out.println(list); // 结果:[apple, grape, orange]
```

### 2.5 clear()：
清空链表中的所有元素。

代码演示：

```java
LinkedList<String> list = new LinkedList<>();
list.add("apple");
list.add("banana");
list.add("orange");

list.clear();

System.out.println(list); // 结果:[]
```

### 2.6 size()：
返回链表中的元素数量。

代码演示：

```java
LinkedList<String> list = new LinkedList<>();
list.add("apple");
list.add("banana");
list.add("orange");

int size = list.size();

System.out.println(size); //结果:3
```

### 2.7 contains()：
判断链表中是否包含指定元素。

代码演示：

```java
LinkedList<String> list = new LinkedList<>();
list.add("apple");
list.add("banana");
list.add("orange");

boolean hasApple = list.contains("apple");

System.out.println(hasApple); //结果: true
```

### 2.8 addFirst()：
在链表的头部插入元素。

代码演示：

```java
LinkedList<String> list = new LinkedList<>();
list.add("apple");
list.add("banana");
list.add("orange");

list.addFirst("pear");

System.out.println(list); // 结果:[pear, apple, banana, orange]
```

### 2.9 addLast()：
在链表的尾部插入元素。

代码演示：

```java
LinkedList<String> list = new LinkedList<>();
list.add("apple");
list.add("banana");
list.add("orange");

list.addLast("pear");

System.out.println(list); // 结果:[apple, banana, orange, pear]
```

### 2.10 getFirst()：
获取链表的第一个元素。

代码演示：

```java
LinkedList<String> list = new LinkedList<>();
list.add("apple");
list.add("banana");
list.add("orange");

String first = list.getFirst();

System.out.println(first); // 结果:apple
```

### 2.11 getLast()：
获取链表的最后一个元素。

代码演示：

```java
LinkedList<String> list = new LinkedList<>();
list.add("apple");
list.add("banana");
list.add("orange");

String last = list.getLast();

System.out.println(last); // 结果:orange
```

### 2.12 removeFirst()：
移除链表的第一个元素。

代码演示：

```java
LinkedList<String> list = new LinkedList<>();
list.add("apple");
list.add("banana");
list.add("orange");

list.removeFirst();

System.out.println(list); // 结果:[banana, orange]
```

### 2.13 removeLast()：
移除链表的最后一个元素。

代码演示：

```java
LinkedList<String> list = new LinkedList<>();
list.add("apple");
list.add("banana");
list.add("orange");

list.removeLast();

System.out.println(list); // 结果:[apple, banana]
```

所有代码演示的,运行结果：

```java
[apple, banana, orange]
[apple, orange]
banana
[apple, grape, orange]
[]
3
true
[pear, apple, banana, orange]
[apple, banana, orange, pear]
apple
orange
[banana, orange]
[apple, banana]
```