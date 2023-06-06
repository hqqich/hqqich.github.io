# Comparable和Comparator的区别

初次碰到这个问题是之前有一次电话面试，问了一个小时的问题，其中有一个问题就问到Comparable和Comparator的区别，当时没答出 来。之后是公司入职时候做的一套Java编程题，里面用JUnit跑用例的时候也用到了Comparator接口，再加上JDK的大量的类包括常见的  String、Byte、Char、Date等都实现了Comparable接口，因此要学习一下这两个类的区别以及用法。

 

**Comparable**

Comparable可以认为是一个**内比较器**，实现了Comparable接口的类有一个特点，就是这些类是可以和自己比较的，至于具体和另一个实现了Comparable接口的类如何比较，则依赖compareTo方法的实现，compareTo方法也被称为**自然比较方法**。如果开发者add进入一个Collection的对象想要Collections的sort方法帮你自动进行排序的话，那么这个对象必须实现Comparable接口。compareTo方法的返回值是int，有三种情况：

1、比较者大于被比较者（也就是compareTo方法里面的对象），那么返回正整数

2、比较者等于被比较者，那么返回0

3、比较者小于被比较者，那么返回负整数

写个很简单的例子：

```
public class Domain implements Comparable<Domain>
{
    private String str;

    public Domain(String str)
    {
        this.str = str;
    }

    public int compareTo(Domain domain)
    {
        if (this.str.compareTo(domain.str) > 0)
            return 1;
        else if (this.str.compareTo(domain.str) == 0)
            return 0;
        else 
            return -1;
    }
    
    public String getStr()
    {
        return str;
    }
}
```



```
public static void main(String[] args)
    {
        Domain d1 = new Domain("c");
        Domain d2 = new Domain("c");
        Domain d3 = new Domain("b");
        Domain d4 = new Domain("d");
        System.out.println(d1.compareTo(d2));
        System.out.println(d1.compareTo(d3));
        System.out.println(d1.compareTo(d4));
    }
```

运行结果为：

```
0
1
-1
```

注意一下，前面说实现Comparable接口的类是可以支持和自己比较的，但是其实代码里面Comparable的泛型未必就一定要是Domain，将泛型指定为String或者指定为其他任何任何类型都可以----只要开发者指定了具体的比较算法就行。

 

**Comparator**

Comparator可以认为是是一个**外比较器**，个人认为有两种情况可以使用实现Comparator接口的方式：

1、一个对象不支持自己和自己比较（没有实现Comparable接口），但是又想对两个对象进行比较

2、一个对象实现了Comparable接口，但是开发者认为compareTo方法中的比较方式并不是自己想要的那种比较方式

Comparator接口里面有一个compare方法，方法有两个参数T o1和T o2，是泛型的表示方式，分别表示待比较的两个对象，方法返回值和Comparable接口一样是int，有三种情况：

1、o1大于o2，返回正整数

2、o1等于o2，返回0

3、o1小于o3，返回负整数

写个很简单的例子，上面代码的Domain不变（假设这就是第2种场景，我对这个compareTo算法实现不满意，要自己写实现）：



```
public class DomainComparator implements Comparator<Domain>
{
    public int compare(Domain domain1, Domain domain2)
    {
        if (domain1.getStr().compareTo(domain2.getStr()) > 0)
            return 1;
        else if (domain1.getStr().compareTo(domain2.getStr()) == 0)
            return 0;
        else 
            return -1;
    }
}
```



```
public static void main(String[] args)
{
    Domain d1 = new Domain("c");
    Domain d2 = new Domain("c");
    Domain d3 = new Domain("b");
    Domain d4 = new Domain("d");
    DomainComparator dc = new DomainComparator();
    System.out.println(dc.compare(d1, d2));
    System.out.println(dc.compare(d1, d3));
    System.out.println(dc.compare(d1, d4));
}
```



看一下运行结果：

```
0
1
-1
```

当然因为泛型指定死了，所以实现Comparator接口的实现类只能是两个相同的对象（不能一个Domain、一个String）进行比较了，因此实现Comparator接口的实现类一般都会以"待比较的实体类+Comparator"来命名

 

**总结**

总结一下，两种比较器Comparable和Comparator，后者相比前者有如下优点：

1、如果实现类没有实现Comparable接口，又想对两个类进行比较（或者实现类实现了Comparable接口，但是对compareTo方法内的比较算法不满意），那么可以实现Comparator接口，自定义一个比较器，写比较算法

2、实现Comparable接口的方式比实现Comparator接口的耦合性  要强一些，如果要修改比较算法，要修改Comparable接口的实现类，而实现Comparator的类是在外部进行比较的，不需要对实现类有任何修  改。从这个角度说，其实有些不太好，尤其在我们将实现类的.class文件打成一个.jar文件提供给开发者使用的时候。实际上实现Comparator 接口的方式后面会写到就是一种典型的**策略模式**。

当然，这不是鼓励用Comparator，意思是开发者还是要在具体场景下选择最合适的那种比较器而已。