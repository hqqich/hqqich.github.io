# java中的IO流之文件复制

 

![img](https://www.jb51.cc/res/2021/10-01/18/bdb6437acb7c9bddd4beff9db611f18f.jpg)



简单分析一下，IO分为两种流：字符流和字节流。字符流的[父类](https://www.jb51.cc/tag/fulei/)Reader（读取到内存）和Writer（从内存[输出](https://www.jb51.cc/tag/shuchu/)），字节流的[父类](https://www.jb51.cc/tag/fulei/)InputStream（读取到内存）和OutputStream（从内存[输出](https://www.jb51.cc/tag/shuchu/)），然后为了方便各种操作，比如为了[文件](https://www.jb51.cc/tag/wenjian/)操作，派生了[文件](https://www.jb51.cc/tag/wenjian/)流；为了对象操作，派生了对象流；等等。当初我也是傻傻分不清到底是Input还是Output,其实搞懂了谁是主体就容易懂了，以你现在正在写的程序为主体，Input就是流入你的程序，Output就是从你的程序流出去。

 

2.对于缓冲的理解

 

刚开始学IO时，不理解那个Buffered究竟有什么作用，为什么要输入[输出](https://www.jb51.cc/tag/shuchu/)总要有一步缓冲过渡呢？后来还是看了[百度](https://www.jb51.cc/tag/baidu/)知道上一个大神写的，个人觉得很有道理，复制粘贴如下，应该不算侵权吧(⊙﹏⊙)

 

“如果是边读边写，就会很慢，也伤硬盘。缓冲区就是内存里的一块区域，把数据先存内存里，然后一次性写入，类似[数据库](https://www.jb51.cc/tag/shujuku/)的批量操作，这样效率比较高。

[调用](https://www.jb51.cc/tag/diaoyong/)I\O操作的时候，实际上还是一个一个的读或者写，关键就在，[cpu](https://www.jb51.cc/tag/cpu/)只有一个，不论是几个核心。[cpu](https://www.jb51.cc/tag/cpu/)在系统[调用](https://www.jb51.cc/tag/diaoyong/)时，会不会还要参与主要操作？参与多次就会花更多的时间。 

系统[调用](https://www.jb51.cc/tag/diaoyong/)时，若不用缓冲，[cpu](https://www.jb51.cc/tag/cpu/)会酌情考虑使用 中断。此时[cpu](https://www.jb51.cc/tag/cpu/)是主动地，每个周期中都要花去一部分去询问I\O设备是否读完数据，这段时间[cpu](https://www.jb51.cc/tag/cpu/)不能做任何其他的事情（至少负责执行这段模块的核不能）。所以，[调用](https://www.jb51.cc/tag/diaoyong/)一次读了一个字，通报一次，[cpu](https://www.jb51.cc/tag/cpu/)腾出时间处理一次。 

而设置缓冲，[cpu](https://www.jb51.cc/tag/cpu/)通常会使用 DMA 方式去执行 I\O 操作。[cpu](https://www.jb51.cc/tag/cpu/) 将这个工作交给DMA控制器来做，自己腾出时间做其他的事，当DMA完成工作时，DMA会主动告诉[cpu](https://www.jb51.cc/tag/cpu/)“操作完成”。这时，[cpu](https://www.jb51.cc/tag/cpu/)接管后续工作。在此，[cpu](https://www.jb51.cc/tag/cpu/) 是被动的。DMA是专门 做 I＼O 与 内存 数据交换的，不仅自身效率高，也节约了[cpu](https://www.jb51.cc/tag/cpu/)时间，[cpu](https://www.jb51.cc/tag/cpu/)在DMA开始和结束时做了一些设置罢了。 
所以，[调用](https://www.jb51.cc/tag/diaoyong/)一次，不必通报[cpu](https://www.jb51.cc/tag/cpu/)，等缓冲区满了，DMA 会对C PU 说 “嘿，伙计！快过来看看，把他们都搬走吧”。 

综上，设置缓冲，就建立了数据块，使得DMA执行更方便，[cpu](https://www.jb51.cc/tag/cpu/)也有空闲，而不是呆呆地候着I\O数据读来。从微观角度来说，设置缓冲效率要高很多。尽管，不能从这个程序上看出来。 几万字的读写就能看到差距。”

OK，从以上可以看出，省时省力。

 

3.[文件](https://www.jb51.cc/tag/wenjian/)复制

 

[文件](https://www.jb51.cc/tag/wenjian/)复制的原理很简单，从硬盘读取[文件](https://www.jb51.cc/tag/wenjian/)流到程序，再从程序中[输出](https://www.jb51.cc/tag/shuchu/)流到目标[文件](https://www.jb51.cc/tag/wenjian/)，就完成了[文件](https://www.jb51.cc/tag/wenjian/)的复制。事实上用到了java中的[文件](https://www.jb51.cc/tag/wenjian/)输入[输出](https://www.jb51.cc/tag/shuchu/)流。看着[代码](https://www.jb51.cc/tag/daima/)挺多，其实忽略那些try-catch及异常处理，很简单的几行[代码](https://www.jb51.cc/tag/daima/)。

```java
import java.awt.Desktop;
import java.io.*;
import java.net.URI;

public class Manage {
  private InputStream input;
  private OutputStream output;
  private static int length;
  /**
   * 文件的复制
   *
   * @param beginFilename
   *            原始文件
   * @param endFilename
   *            目标文件
   */
  void fileCopy(String beginFilename,String endFilename) throws IOException {
    // 创建输入输出流对象
    try {
      input = new FileInputStream(beginFilename);
      output = new FileOutputStream(endFilename);

      length = input.available();

      byte[] buffer = new byte[length];

      input.read(buffer);
      output.write(buffer);

    } catch (Exception e) {
      e.printStackTrace();
    } finally {
      if (input != null && output != null) {
        input.close();
        output.close();
      }
    }
  }

  public static void main(String[] args) throws Exception {
    Manage manage = new Manage();
    manage.fileCopy("C:\\Users\\Administrator\\Desktop\\input.txt", "C:\\Users\\Administrator\\Desktop\\output.txt");

    //Desktop desktop = Desktop.getDesktop();
    //desktop.browse(new URI("http://www.baidu.com"));
  }
}
```

