# Guava文件操作

```java

//1.通过guava 实现文件复制
private static String from = "C:\\text\\1.txt";
private static String to = "C:\\text\\2.txt";
Files.copy(new File(from),new File(to));


//2.移动
//to若存在,将被删除,重新生成
Files.move(new File(from),new File(to));


//3.按行读取文件
//读取文件第一行
String configJson = Files.readFirstLine(file, Charsets.UTF_8);
//将文件每一行读到list里
List<String> readLines = Files.readLines(file, Charsets.UTF_8);
//按照条件，将文件每行读到list里
Files.readLines(file, Charsets.UTF_8, new LineProcessor<List<String>>() {
	List<String> list = new ArrayList<>();
	@Override
	public List<String> getResult() {
		return list;
	}
	@Override
	public boolean processLine(String arg0) throws IOException {
		// TODO Auto-generated method stub
		return false;
	}
});


//4、计算文件hashcode (可对比两个文件是否一样)
//Hashing.md5();Hashing.sha256()
HashCode hash = Files.asByteSource(new File(to)).hash(Hashing.sha512());


//5.遍历目录
String path = "D:\\自定义代码\\Guava\\guava\\src\\main";
File file = new File(path);
//获取path下子目录
Iterable<File> childrens = Files.fileTreeTraverser().children(file);
for (File children : childrens) {
  System.out.println("子目录: " + children);
}
//获取path下所有目录  preOrderTraversal postOrderTraversal顺序不一样
FluentIterable<File> files = Files.fileTreeTraverser().preOrderTraversal(file);
for (File file1 : files) {
  System.out.println("全目录: " + file1);
}
        /**
         子目录: D:\自定义代码\Guava\guava\src\main\java
         子目录: D:\自定义代码\Guava\guava\src\main\resources
         全目录: D:\自定义代码\Guava\guava\src\main
         全目录: D:\自定义代码\Guava\guava\src\main\java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\cache
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\cache\LRU
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\cache\LRU\LinkedHashLRUcache.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\cache\LRU\LRUcache.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\cache\LRU\Test.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\cache\reference
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\cache\reference\Phantom_Reference.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\cache\reference\Soft_Reference.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\cache\reference\StrongReference.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\cache\reference\Weak_Reference.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\ClassScaner.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\evenbus
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\evenbus\AbstractListener.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\evenbus\mybus
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\evenbus\mybus\Bus.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\evenbus\mybus\MyDispatcher.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\evenbus\mybus\MyEvenBus.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\evenbus\mybus\MyEvenContext.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\evenbus\mybus\MyEvenExceptionHandle.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\evenbus\mybus\MyRegistry.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\evenbus\mybus\MySubscribe.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\evenbus\mybus\MySubscriber.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\evenbus\SimpleEventBus.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\evenbus\SimpleListener.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\evenbus\test
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\evenbus\test\EventBusTest.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\evenbus\test\MyListener.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\files
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\files\FilesTest.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\GuavaApplication.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\monitorFile
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\monitorFile\DirectoryTargetMonitor.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\monitorFile\MainTest.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\monitorFile\TargetMonitor.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\ratelimit
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\ratelimit\RateLimitTest.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\utils
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\utils\CharMatchsTest.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\utils\JoinerTest.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\utils\PreconditionsTest.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\utils\SplitterTest.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\utils\StopWatchTest.java
         全目录: D:\自定义代码\Guava\guava\src\main\java\com\cai\ya\utils\StringsTest.java
         全目录: D:\自定义代码\Guava\guava\src\main\resources
         全目录: D:\自定义代码\Guava\guava\src\main\resources\application.properties
         全目录: D:\自定义代码\Guava\guava\src\main\resources\io
         全目录: D:\自定义代码\Guava\guava\src\main\resources\io\2.txt
         全目录: D:\自定义代码\Guava\guava\src\main\resources\io\rest.txt
         全目录: D:\自定义代码\Guava\guava\src\main\resources\log4j2.xml
        */



//6.自定义过滤目录

public static void main(String[] args) {
    String path = "D:\\自定义代码\\Guava\\guava\\src\\main";
    File file = new File(path);
    //preOrderTraversal postOrderTraversal顺序不一样
    FluentIterable<File> files =
        Files.fileTreeTraverser().preOrderTraversal(file).filter(new Predicate<File>() {
          @Override
          public boolean apply(@Nullable File input) {
            return input.isFile();  //只要文件
          }
        });
    for (File file1 : files) {
      System.out.println(file1);
    }
  }


//7.写、追加文件：
#写文件（覆盖原内容）
File configPath = new File("D:/test");
Files.write("sdfsdfdsfds33334444", configPath, Charsets.UTF_8);
//追加内容
File configPath1 = new File("D:/test1");
Files.append("sdfsdfdsfds33334444", configPath1, Charsets.UTF_8);


//8.常用功能
//获取扩展名
String ext = Files.getFileExtension("D:/binom.py");
//获得不带扩展名的文件名
String fn = Files.getNameWithoutExtension("D:/binom.py");
//创建或者更新文件的时间戳
File configPath = new File("D:/aaa");
Files.touch(configPath);
//获取文件的内存映射
MappedByteBuffer map = Files.map(configPath);
// 注：该方法实际调用的是jdk中的MappedByteBuffer，会受到文件大小不能超过2G的限制！



//9。guava流，文件快速读写
Files.asByteSource(new File("d:/1.txt")).copyTo(Files.asByteSink(new File("d:/2.txt"), FileWriteMode.APPEND));
```
