# 利用 Builder 模式构建 Java 对象

一般我们构建对象有两种方法，一是构造器，二是默认无参构造器创建对象后使用 set 方法一个个赋值。第一种方法我们需要写一个全参的构造方法，但这样我们在构造对象时有一些不需要填写的对象也要给他赋值，而且对应参数可能弄混（虽然强大的 idea 可以清楚的提示），第二种方法很清晰，但代码冗余，写起来也累。如果类中变量不多，用哪种方法都差不多，但如果变量很多，或者说构建对象时需要传入的参数很多，我们就需要用到 builder 构建对象。

假如有这样一个学生类：



```java
public class Student {
    private int id;
    private String name;
    private String sex;
    private Integer age;
    private Integer mathScore;
    private Integer englishScore;
}
```

当我们使用 Builder 模式构建的时候代码如下：



```java
public class Student {
    private int id;
    private String name;
    private String sex;
    private int age;
    private int mathScore;
    private int englishScore;

    // 创建一个 Builder 的内部类，在下面 Student 的构造方法中我们会用这个内部类 new 一个 Builder 对象传进去
    public static class Builder {
        private int id;
        private String name;
        private String sex;
        private int age;
        private int mathScore;
        private int englishScore;

        // Builder 构造器，里面也可以传一些参数(比如有些情况有些参数必须要传入就可以放这边)
        public Builder() {

        }
        
        // 为每个变量设置方法，作用就是赋值，返回值还是 Builder，是一个链式的结构
        public Builder id(int id) {
            this.id = id;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder sex(String sex) {
            this.sex = sex;
            return this;
        }

        public Builder age(int age) {
            this.age = age;
            return this;
        }

        public Builder mathScore(int mathScore) {
            this.mathScore = mathScore;
            return this;
        }

        public Builder englishScore(int englishScore) {
            this.englishScore = englishScore;
            return this;
        }

        // 链的最后会调用 build 方法，其实到这一步才真的 new 了一个 Student 对象
        public Student build() {
            return new Student(this);
        }

    }

    // build 方法 new 的 Student 对象就是他，传入的也是 buil 对象
    private Student(Builder builder) {
        this.id = builder.id;
        this.name = builder.name;
        this.sex = builder.sex;
        this.age = builder.age;
        this.mathScore = builder.mathScore;
        this.englishScore = builder.englishScore;
    }
}
```

可以看下注释，我自己理解的，可能不是太规范

这时候，我们在需要 new 一个 Student 对象时就很简单了，如下：



```java
Student student = new Student.Builder().id(1).name("ethan").age(24).sex("男").mathScore(90).build();
```

十分简单，十分清晰，优雅。

如果你觉得写一个有builder 的类很麻烦，那可以试下 lombok 插件，一个注释就解决了，如下：



```java
import lombok.Builder;

@Builder
public class Student {
    private int id;
    private String name;
    private String sex;
    private Integer age;
    private Integer mathScore;
    private Integer englishScore;

}
```

可以看下编译出来的 class 文件，和我们自己写的效果基本一样，当然 lombok 还有很多用法，可以参照[官网](https://projectlombok.org/)。

### 一点讨论：

在《Effective Java》第二版（9-13页）中页讲到了 Builder 模式，并且例子中的变量声明用到了 final。我们把上面的类参照这个改造一下（假设我们的业务需求是创建一个学生对象时必须有名字和 id）：



```java
public class Student {
    // 所有变量的声明都加了 final
    private final int id;
    private final String name;
    private final String sex;
    private final int age;
    private final int mathScore;
    private final int englishScore;

    public static class Builder {
        // 因为每个 student 对象都必须有 id 和 name，所以在 Builder 内部类中也需要定义成 final
        private final int id;           // required
        private final String name;      // required
        
        // 这里初始化相当于给了一个默认值，如果没有初始化这一步，在创建对象时也没赋值的话，这个 field 就是 null，自己根据实际需求来吧，而且这里给分数初始化为0也不合理，因为这样你就分不清他是真的分数是0还是没有辅助，被你初始化的时候赋了0，可能-1更好些，这里不讨论这些了，不同的业务需求代码都不一样。
        private String sex = "";        // optional
        private int age = 0;           // optional
        private int mathScore = 0;     // optional
        private int englishScore = 0;  // optional

        // 这里就不是使用链式给 id 和 name 赋值了，而是在 new builder 的时候就赋值，因为这两个是必须的。
        public Builder(int id, String name) {
            this.id = id;
            this.name = name;
        }
        
        public Builder sex(String sex) {
            this.sex = sex;
            return this;
        }

        public Builder age(int age) {
            this.age = age;
            return this;
        }

        public Builder mathScore(int mathScore) {
            this.mathScore = mathScore;
            return this;
        }

        public Builder englishScore(int englishScore) {
            this.englishScore = englishScore;
            return this;
        }

        public Student build() {
            return new Student(this);
        }

    }

    private Student(Builder builder) {
        this.id = builder.id;
        this.name = builder.name;
        this.sex = builder.sex;
        this.age = builder.age;
        this.mathScore = builder.mathScore;
        this.englishScore = builder.englishScore;
    }
}
```

因为我现在工作中很少会把变量声明为 final，所以没有过多考虑，但以后工作中是不是可以考虑下是不是有些对象或者类中的一些变量在我们初始化后就不需要改动，也不能改动了，那我们就可以用上这个。