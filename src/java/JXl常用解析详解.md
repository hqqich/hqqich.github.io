# [JXl常用解析详解](https://www.cnblogs.com/dgwblog/p/9368700.html)

## 目的：[#](https://www.cnblogs.com/dgwblog/p/9368700.html#497802188)

java解析 excel 无非就是apache poi 或者 jxl 两者在使用上其实都差不多，关键还是看你自己熟悉那个，用那个！我也是初次接触jxl 看很多博客说 jxl只适用于处理小数据量 excel，或者说是功能比较单一的，实际上我看了jxl的包，发现其实用

好了，功能还是很强大的。

需要了解：支持 Reads data from Excel 95, 97, 2000, XP, and 2003 workbooks

 

jxl.read.biff.BiffException: Unable to recognize OLE stream 出现这个错误就是excel 2007格式不符合引起的

 

官网：http://jexcelapi.sourceforge.net/

### java doc： http://jxl.sourceforge.net/javadoc/index.html[#](https://www.cnblogs.com/dgwblog/p/9368700.html#3520480942)

### 依赖管理：[#](https://www.cnblogs.com/dgwblog/p/9368700.html#790923869)

```
<dependency>
    <groupId>net.sourceforge.jexcelapi</groupId>
    <artifactId>jxl</artifactId>
    <version>2.6.12</version>
</dependency>
```

 

UML大纲：

 

[![img](https://images2018.cnblogs.com/blog/1160484/201807/1160484-20180725212957777-1356266150.png)](https://images2018.cnblogs.com/blog/1160484/201807/1160484-20180725212957777-1356266150.png)

 

## 创建简单的excel：[#](https://www.cnblogs.com/dgwblog/p/9368700.html#1763040436)

 

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
 1 @Test
 2     public void testCreateExcel() {
 3         try {
 4             // 创建xls文件
 5             file.createNewFile();
 6             // 2:创建工作簿
 7             WritableWorkbook workbook = Workbook.createWorkbook(file);
 8 
 9             // 3:创建sheet,设置第二三四..个sheet，依次类推即可
10             WritableSheet sheet = workbook.createSheet("测试", 0);
11             // 4：设置titles
12             String[] titles = { "编号", "账号"};
13             // 5:给第一行设置列名
14             for (int i = 0; i < titles.length; i++) {
15                 sheet.addCell(new Label(i, 0, titles[i]));
16             }
17             sheet.setHeader("aa", "cc", "cc");
18             // 6：模拟数据库导入数据 注意起始行为1
19             for (int i = 1; i < 100; i++) {
20                 //添加编号
21                 sheet.addCell(new Label(0, i, new String("编号"+i)));
22                 //添加密码
23                 sheet.addCell(new Label(1, i, new String("编号"+i)));
24             }
25             workbook.write();
26             workbook.close();
27         } catch (IOException e) {
28             e.printStackTrace();
29         } catch (RowsExceededException e) {
30             e.printStackTrace();
31         } catch (WriteException e) {
32             e.printStackTrace();
33         }
34     }
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

 

 

 效果：

 

 [![img](https://images2018.cnblogs.com/blog/1160484/201807/1160484-20180725214909558-409499633.gif)](https://images2018.cnblogs.com/blog/1160484/201807/1160484-20180725214909558-409499633.gif)

###  [#](https://www.cnblogs.com/dgwblog/p/9368700.html#1046849356)

## 简单读取Excel：[#](https://www.cnblogs.com/dgwblog/p/9368700.html#2098522692)

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
 1 @Test
 2     public void testCreateExcel() {
 3         try {
 4             //1:创建workbook
 5             Workbook workbook = Workbook.getWorkbook(file);
 6             //2:获取第一个工作表sheet
 7             Sheet sheet = workbook.getSheet(0);
 8              //3:读取数据
 9             System.out.println(sheet.getColumns());
10             System.out.println(sheet.getRows());
11             //4.自己注意行列关系
12             for (int i = 0; i < sheet.getRows(); i++) {
13                 for (int j = 0; j < sheet.getColumns(); j++) {
14                     Cell cell = sheet.getCell(j, i);
15                     System.out.println(cell.getContents());
16                 }
17             }
18         } catch (BiffException | IOException e) {
19             e.printStackTrace();
20         }
21     }
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

[![img](https://images2018.cnblogs.com/blog/1160484/201807/1160484-20180725220429111-1280536109.gif)](https://images2018.cnblogs.com/blog/1160484/201807/1160484-20180725220429111-1280536109.gif)

 



------

```
感谢您的阅读，如果您觉得阅读本文对您有帮助，请点一下“推荐”按钮。本文欢迎各位转载，但是转载文章之后必须在文章页面中给出作者和原文连接。
```

作者： ---dgw博客

出处：https://www.cnblogs.com/dgwblog/p/9368700.html

版权：本文采用「[署名-非商业性使用-相同方式共享 4.0 国际](https://creativecommons.org/licenses/by-nc-sa/4.0/)」知识共享许可协议进行许可。



分类: [Java](https://www.cnblogs.com/dgwblog/category/1194464.html)