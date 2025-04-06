---
title: MySQL实战45讲笔记
index: false
icon: laptop-code
category:
    mysql
---
目录

收起

01 | 基础架构： 一条SQL查询语句是如何执行的 ?

02 | 日志系统： 一条SQL更新语句是如何执行的？

03 | 事务隔离： 为什么你改了我还看不见？

04 | 深入浅出索引（上）

05 | 深入浅出索引（下）

06 | 全局锁和表锁 ： 给表加个字段怎么有这么多阻碍？

07 | 行锁功过： 怎么减少行锁对性能的影响？

08 | 事务到底是隔离的还是不隔离的？

09 | 普通索引和唯一索引， 应该怎么选择？

10 | MySQL为什么有时候会选错索引？

11 | 怎么给字符串字段加索引？

12 | 为什么我的MySQL会“抖”一下？

13 | 为什么表数据删掉一半， 表文件大小不变？

14 | count(\*)这么慢， 我该怎么办？

15 | 答疑文章（一） ： 日志和索引相关问题

16 | “order by”是怎么工作的？

17 | 如何正确地显示随机消息？

18 | 为什么这些SQL语句逻辑相同， 性能却差异巨大？

19 | 为什么我只查一行的语句， 也执行这么慢？

20 | 幻读是什么， 幻读有什么问题？

21 | 为什么我只改一行的语句， 锁这么多？

22 | MySQL有哪些“饮鸩止渴”提高性能的方法？

23 | MySQL是怎么保证数据不丢的？

24 | MySQL是怎么保证主备一致的？

25 | MySQL是怎么保证高可用的？

26 | 备库为什么会延迟好几个小时？

27 | 主库出问题了， 从库怎么办？

28 | 读写分离有哪些坑？

29 | 如何判断一个数据库是不是出问题了？

30 | 答疑文章（二） ： 用动态的观点看加锁

31 | 误删数据后除了跑路， 还能怎么办？

32 | 为什么还有kill不掉的语句？

33 | 我查这么多数据， 会不会把数据库内存打爆？

34 | 到底可不可以使用join？

35 | join语句怎么优化？

36 | 为什么临时表可以重名？

37 | 什么时候会使用内部临时表？

38 | 都说InnoDB好， 那还要不要使用Memory引擎？

39 | 自增主键为什么不是连续的？

40 | insert语句的锁为什么这么多？

41 | 怎么最快地复制一张表？

42 | grant之后要跟着flush privileges吗？

43 | 要不要使用分区表？

44 | 答疑文章（三） ： 说一说这些好问题

45 | 自增id用完怎么办？

**01 | 基础架构：** **一条SQL查询语句是如何执行的 ?**
------------------------------------

<img src="https://pic1.zhimg.com/v2-11c6a2de7650b8cbd1a93d678aa64e4c\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="647" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic1.zhimg.com/v2-11c6a2de7650b8cbd1a93d678aa64e4c\_r.jpg"/>

![](https://pic1.zhimg.com/80/v2-11c6a2de7650b8cbd1a93d678aa64e4c_720w.webp)

MySQL可以分为Server层和存储引擎层两部分。Server层包括连接器、 查询缓存、 分析器、 优化器、 执行器等。存储引擎层负责数据的存储和提取，现在最常用的存储引擎是InnoDB。

**连接器**

第一步，会先连接到这个数据库上， 这时候接待你的就是连接器。 连接器负责跟客户端建立连接、 获取权限、 维持和管理连接。

**查询缓存**

MySQL拿到一个查询请求后， 会先到查询缓存看看， 之前是不是执行过这条语句。 之前执行过的语句及其结果可能会以key-value对的形式， 被直接缓存在内存中。 key是查询的语句， value是查询的结果。 如果你的查询能够直接在这个缓存中找到key， 那么这个value就会被直接返回给客户端。查询缓存往往弊大于利 ，大多数时候建议不要使用。

**分析器**

如果没有命中查询缓存， 就要开始真正执行语句了。 分析器先会做“词法分析”。 你输入的是由多个字符串和空格组成的一条SQL语句， MySQL需要识别出里面的字符串分别是什么， 代表什么 。做完了这些识别以后， 就要做“语法分析”。 根据词法分析的结果， 语法分析器会根据语法规则，判断你输入的这个SQL语句是否满足MySQL语法。

**优化器**

在开始执行之前， 还要先经过优化器的处理。优化器是在表里面有多个索引的时候， 决定使用哪个索引； 或者在一个语句有多表关联（join）的时候， 决定各个表的连接顺序。

**执行器**

开始执行的时候， 要先判断一下你对这个表T有没有执行查询的权限 。如果有权限， 就打开表继续执行。 打开表的时候， 执行器就会根据表的引擎定义， 去使用这个引擎提供的接口。

**02 | 日志系统：** **一条SQL更新语句是如何执行的？**
-----------------------------------

与查询流程不一样的是， 更新流程还涉及两个重要的日志模块： redo log（重做日志） 和 binlog（归档日志）。 当有一条记录需要更新的时候， InnoDB引擎就会先把记录写到redo log里面， 并更新内存， 这个时候更新就算完成了。 同时， InnoDB引擎会在适当的时候， 将这个操作记录更新到磁盘里面。

**Redo log**

InnoDB的redo log是固定大小的， 比如可以配置为一组4个文件， 每个文件的大小是1GB， 那么这块“粉板”总共就可以记录4GB的操作。 从头开始写， 写到末尾就又回到开头循环写， 如下面这个图所示。

<img src="https://pic2.zhimg.com/v2-3395dd7878a0a4bd1c314583ab3759ed\_b.jpg" data-caption="" data-size="normal" data-rawwidth="825" data-rawheight="475" class="origin\_image zh-lightbox-thumb" width="825" data-original="https://pic2.zhimg.com/v2-3395dd7878a0a4bd1c314583ab3759ed\_r.jpg"/>

![](https://pic2.zhimg.com/80/v2-3395dd7878a0a4bd1c314583ab3759ed_720w.webp)

write pos是当前记录的位置， 一边写一边后移， 写到第3号文件末尾后就回到0号文件开头。checkpoint是当前要擦除的位置， 也是往后推移并且循环的， 擦除记录前要把记录更新到数据文件。write pos和checkpoint之间的是“粉板”上还空着的部分， 可以用来记录新的操作。 如果write pos追上checkpoint， 表示“粉板”满了， 这时候不能再执行新的更新， 得停下来先擦掉一些记录， 把checkpoint推进一下。

**Binlog**

这两种日志有以下三点不同。

• 1. redo log是InnoDB引擎特有的； binlog是MySQL的Server层实现的， 所有引擎都可以使用。

• 2. redo log是物理日志， 记录的是“在某个数据页上做了什么修改”； binlog是逻辑日志， 记录的是这个语句的原始逻辑， 比如“给ID=2这一行的c字段加1 ”。

• 3. redo log是循环写的， 空间固定会用完； binlog是可以追加写入的。 “追加写”是指binlog文件写到一定大小后会切换到下一个， 并不会覆盖以前的日志。

update T set c=c+1 where ID=2; update语句的执行流程图

<img src="https://pic2.zhimg.com/v2-a240cea06cf06f7ce0ef200d9e6663e9\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="1150" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic2.zhimg.com/v2-a240cea06cf06f7ce0ef200d9e6663e9\_r.jpg"/>

![](https://pic2.zhimg.com/80/v2-a240cea06cf06f7ce0ef200d9e6663e9_720w.webp)

  

**两阶段提交**

由于redo log和binlog是两个独立的逻辑， 如果不用两阶段提交， 要么就是先写完redo log再写binlog， 或者采用反过来的顺序。仍然用前面的update语句来做例子。 假设当前ID=2的行， 字段c的值是0， 再假设执行update语句过程中在写完第一个日志后， 第二个日志还没有写完期间发生了crash， 会出现什么情况呢？

**先写redo log后写binlog。** 假设在redo log写完， binlog还没有写完的时候， MySQL进程异常重启。 由redo log写完之后， 系统即使崩溃， 仍然能够把数据恢复回来， 所以恢复后这一行c的值是1。但是由于binlog没写完就crash了， 这时候binlog里面就没有记录这个语句。 因此， 之后备份日志的时候， 存起来的binlog里面就没有这条语句。如果需要用这个binlog来恢复临时库的话，恢复出来的这一行c的值就是0， 与原库的值不同。

**先写binlog后写redo log。** 如果在binlog写完之后crash， 由于redo log还没写， 崩溃恢复以后这个事务无效， 所以这一行c的值是0。 但是binlog里面已经记录了“把c从0改成1”这个日志。 所以， 在之后用binlog来恢复的时候就多了一个事务出来， 恢复出来的这一行c的值就是1， 与原库的值不同。

简单说， redo log和binlog都可以用于表示事务的提交状态， 而两阶段提交就是让这两个状态保持逻辑上的一致

**03 | 事务隔离：** **为什么你改了我还看不见？**
-------------------------------

简单来说， 事务就是要保证一组数据库操作， 要么全部成功， 要么全部失败。 在MySQL中， 事务支持是在引擎层实现的。 你现在知道， MySQL是一个支持多引擎的系统， 但并不是所有的引擎都支持事务。 比如MySQL原生的MyISAM引擎就不支持事务， 这也是MyISAM被InnoDB取代的重要原因之一。

**隔离性与隔离级别**

当数据库上有多个事务同时执行的时候， 就可能出现脏读（dirtyread） 、 不可重复读（non repeatable read） 、 幻读（ phantom read） 的问题， 为了解决这些问题， 就有了“隔离级别”的概念。SQL标准的事务隔离级别包括： 读未提交（ read uncommitted） 、读提交（read committed） 、 可重复读（ repeatable read） 和串行化（ serializable ） 。

￮ 读未提交是指， 一个事务还没提交时， 它做的变更就能被别的事务看到。

￮ 读提交是指， 一个事务提交之后， 它做的变更才会被其他事务看到。

￮ 可重复读是指， 一个事务执行过程中看到的数据， 总是跟这个事务在启动时看到的数据是一致的。 当然在可重复读隔离级别下， 未提交变更对其他事务也是不可见的。

￮ 串行化， 顾名思义是对于同一行记录， “写”会加“写锁”， “读”会加“读锁”。 当出现读写锁冲突的时候， 后访问的事务必须等前一个事务执行完成， 才能继续执行。

假设数据表T中只有一列， 其中一行的值为1， 下面是按照时间顺序执行两个事务的行为。

<table data-draft-node="block" data-draft-type="table" data-size="normal" data-row-style="normal"><tbody><tr><td>SQL<br>mysql&gt;<br>create table T(c int) engine=InnoDB;<br>insert into T(c) values(1);</td></tr></tbody></table>

<img src="https://pic1.zhimg.com/v2-a1e70650c95d975492518036c03a5434\_b.jpg" data-caption="" data-size="normal" data-rawwidth="734" data-rawheight="914" class="origin\_image zh-lightbox-thumb" width="734" data-original="https://pic1.zhimg.com/v2-a1e70650c95d975492518036c03a5434\_r.jpg"/>

![](https://pic1.zhimg.com/v2-a1e70650c95d975492518036c03a5434_r.jpg)

• 若隔离级别是“读未提交”， 则V1的值就是2。 这时候事务B虽然还没有提交， 但是结果已经被A看到了。 因此， V2、 V3也都是2。

• 若隔离级别是“读提交”， 则V1是1， V2的值是2。 事务B的更新在提交后才能被A看到。 所以，V3的值也是2。

• 若隔离级别是“可重复读”， 则V1、 V2是1， V3是2。 之所以V2还是1， 遵循的就是这个要求：事务在执行期间看到的数据前后必须是一致的。

• 若隔离级别是“串行化”， 则在事务B执行“将1改成2”的时候， 会被锁住。 直到事务A提交后，事务B才可以继续执行。 所以从A的角度看， V1、 V2值是1， V3的值是2。

在实现上， 数据库里面会创建一个视图， 访问的时候以视图的逻辑结果为准。 在“可重复读”隔离级别下， 这个视图是在事务启动时创建的， 整个事务存在期间都用这个视图。 在“读提交”隔离级别下， 这个视图是在每个SQL语句开始执行的时候创建的。 这里需要注意的是， “读未提交”隔离级别下直接返回记录上的最新值， 没有视图概念； 而“串行化”隔离级别下直接用加锁的方式来避免并行访问。

**事务隔离的实现**

可重复读 ：在MySQL中， 实际上每条记录在更新的时候都会同时记录一条回滚操作。 记录上的最新值， 通过回滚操作， 都可以得到前一个状态的值。假设一个值从1被按顺序改成了2、 3、 4， 在回滚日志里面就会有类似下面的记录。

<img src="https://pic3.zhimg.com/v2-baeb938c5286e8bb53ead7e259dc935e\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="556" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic3.zhimg.com/v2-baeb938c5286e8bb53ead7e259dc935e\_r.jpg"/>

![](https://pic3.zhimg.com/v2-baeb938c5286e8bb53ead7e259dc935e_r.jpg)

**事务的启动方式**

1\. 显式启动事务语句， begin 或 start transaction。 配套的提交语句是commit， 回滚语句是rollback。

2\. set autocommit=0， 这个命令会将这个线程的自动提交关掉。 意味着如果你只执行一个select语句， 这个事务就启动了， 而且并不会自动提交。 这个事务持续存在直到你主动执行commit 或 rollback 语句， 或者断开连接。

**04 | 深入浅出索引（上）**
------------------

索引的出现其实就是为了提高数据查询的效率， 就像书的目录一样。

**索引的常见模型**

哈希表、 有序数组和搜索树

<img src="https://pic1.zhimg.com/v2-acd105b0320328bf30449e02d0ff5700\_b.jpg" data-caption="" data-size="normal" data-rawwidth="739" data-rawheight="555" class="origin\_image zh-lightbox-thumb" width="739" data-original="https://pic1.zhimg.com/v2-acd105b0320328bf30449e02d0ff5700\_r.jpg"/>

![](https://pic1.zhimg.com/v2-acd105b0320328bf30449e02d0ff5700_r.jpg)

<img src="https://pic1.zhimg.com/v2-1a17f4fd8836806ce9fe1101fe4b2810\_b.jpg" data-caption="" data-size="normal" data-rawwidth="742" data-rawheight="513" class="origin\_image zh-lightbox-thumb" width="742" data-original="https://pic1.zhimg.com/v2-1a17f4fd8836806ce9fe1101fe4b2810\_r.jpg"/>

![](https://pic1.zhimg.com/v2-1a17f4fd8836806ce9fe1101fe4b2810_r.jpg)

<img src="https://pic1.zhimg.com/v2-5ae1af8f9e7f0acf484112204f629f24\_b.jpg" data-caption="" data-size="normal" data-rawwidth="748" data-rawheight="563" class="origin\_image zh-lightbox-thumb" width="748" data-original="https://pic1.zhimg.com/v2-5ae1af8f9e7f0acf484112204f629f24\_r.jpg"/>

![](https://pic1.zhimg.com/v2-5ae1af8f9e7f0acf484112204f629f24_r.jpg)

**InnoDB的索引模型**

InnoDB中， 表都是根据主键顺序以索引的形式存放的， 这种存储方式的表称为索引组织表。又因为前面我们提到的， InnoDB使用了B+树索引模型， 所以数据都是存储在B+树中的。每一个索引在InnoDB里面对应一棵B+树。  
假设， 我们有一个主键列为ID的表， 表中有字段k， 并且在k上有索引。  
这个表的建表语句是：

<img src="https://pic1.zhimg.com/v2-6547c5a922c19979385263efa29f670c\_b.jpg" data-caption="" data-size="normal" data-rawwidth="478" data-rawheight="289" class="origin\_image zh-lightbox-thumb" width="478" data-original="https://pic1.zhimg.com/v2-6547c5a922c19979385263efa29f670c\_r.jpg"/>

![](https://pic1.zhimg.com/v2-6547c5a922c19979385263efa29f670c_r.jpg)

表中R1~R5的(ID,k)值分别为(100,1)、 (200,2)、 (300,3)、 (500,5)和(600,6)， 两棵树的示例示意图如下。

<img src="https://pic1.zhimg.com/v2-b617b529c6b851d689a12cd2bdb1b568\_b.jpg" data-caption="" data-size="normal" data-rawwidth="720" data-rawheight="541" class="origin\_image zh-lightbox-thumb" width="720" data-original="https://pic1.zhimg.com/v2-b617b529c6b851d689a12cd2bdb1b568\_r.jpg"/>

![](https://pic1.zhimg.com/v2-b617b529c6b851d689a12cd2bdb1b568_r.jpg)

从图中不难看出， 根据叶子节点的内容， 索引类型分为主键索引和非主键索引。主键索引的叶子节点存的是整行数据。 在InnoDB里， 主键索引也被称为聚簇索引（clustered index） 。非主键索引的叶子节点内容是主键的值。 在InnoDB里， 非主键索引也被称为二级索引（secondaryindex）。

基于主键索引和普通索引的查询有什么区别？

如果语句是select \* from Twhere ID=500， 即主键查询方式， 则只需要搜索ID这棵B+树；如果语句是select \* from Twhere k=5， 即普通索引查询方式， 则需要先搜索k索引树， 得到ID的值为500， 再到ID索引树搜索一次。 这个过程称为回表。

**索引维护**

显然， 主键长度越小， 普通索引的叶子节点就越小， 普通索引占用的空间也就越小。

**如何避免长事务对业务的影响** **？**

首先， 从应用开发端来看：  
1\. 确认是否使用了set autocommit=0。 这个确认工作可以在测试环境中开展， 把MySQL的general\_log开起来， 然后随便跑一个业务逻辑， 通过general\_log的日志来确认。 一般框架如果会设置这个值， 也就会提供参数来控制行为， 你的目标就是把它改成1。  
2\. 确认是否有不必要的只读事务。 有些框架会习惯不管什么语句先用begin/commit框起来。 我见过有些是业务并没有这个需要， 但是也把好几个select语句放到了事务中。 这种只读事务可以去掉。  
3\. 业务连接数据库的时候， 根据业务本身的预估， 通过SETMAX\_EXECUTION\_TIME命令，来控制每个语句执行的最长时间， 避免单个语句意外执行太长时间。 （为什么会意外？ 在后续的文章中会提到这类案例）

**其次，** **从数据库端来看**

1\. 监控 information\_schema.Innodb\_trx表， 设置长事务阈值， 超过就报警/或者kill；  
2\. Percona的pt-kill这个工具不错， 推荐使用；  
3\. 在业务功能测试阶段要求输出所有的general\_log， 分析日志行为提前发现问题；  
4\. 如果使用的是MySQL 5.6或者更新版本， 把innodb\_undo\_tablespaces设置成2（或更大的值） 。 如果真的出现大事务导致回滚段过大， 这样设置后清理起来更方便。

**05 | 深入浅出索引（下）**
------------------

select \* from Twhere k between 3 and 5，

<img src="https://pic4.zhimg.com/v2-cf8a71e2c16bfd78082b3f6a9401ba1b\_b.jpg" data-caption="" data-size="normal" data-rawwidth="792" data-rawheight="595" class="origin\_image zh-lightbox-thumb" width="792" data-original="https://pic4.zhimg.com/v2-cf8a71e2c16bfd78082b3f6a9401ba1b\_r.jpg"/>

![](https://pic4.zhimg.com/v2-cf8a71e2c16bfd78082b3f6a9401ba1b_r.jpg)

我们一起来看看这条SQL查询语句的执行流程：  
1\. 在k索引树上找到k=3的记录， 取得 ID = 300；  
2\. 再到ID索引树查到ID=300对应的R3；  
3\. 在k索引树取下一个值k=5， 取得ID=500；  
4\. 再回到ID索引树查到ID=500对应的R4；  
5\. 在k索引树取下一个值k=6， 不满足条件， 循环结束。

回到主键索引树搜索的过程， 我们称为回表。

**覆盖索引**

由于覆盖索引可以减少树的搜索次数， 显著提升查询性能， 所以使用覆盖索引是一个常用的性能优化手段。

**最左前缀原则**

如果为每一种查询都设计一个索引， 索引是不是太多了。B+树这种索引结构， 可以利用索引的“最左前缀”， 来定位记录。

<img src="https://pic2.zhimg.com/v2-feff4f94335ad0776f9c1048fc65da09\_b.jpg" data-caption="" data-size="normal" data-rawwidth="805" data-rawheight="577" class="origin\_image zh-lightbox-thumb" width="805" data-original="https://pic2.zhimg.com/v2-feff4f94335ad0776f9c1048fc65da09\_r.jpg"/>

![](https://pic2.zhimg.com/v2-feff4f94335ad0776f9c1048fc65da09_r.jpg)

可以看到， 索引项是按照索引定义里面出现的字段顺序排序的。

**索引下推**

mysql> select \* from tuser where name like '张%' and age=10 and ismale=1;

在MySQL 5.6之前， 只能从ID3开始一个个回表。 到主键索引上找出数据行， 再对比字段值。  
而MySQL 5.6 引入的索引下推优化（indexcondition pushdown)， 可以在索引遍历过程中， 对索引中包含的字段先做判断， 直接过滤掉不满足条件的记录， 减少回表次数。

<img src="https://pic1.zhimg.com/v2-0fc2c15481cc7af5b07fd7e3c7ae5f0c\_b.jpg" data-caption="" data-size="normal" data-rawwidth="722" data-rawheight="527" class="origin\_image zh-lightbox-thumb" width="722" data-original="https://pic1.zhimg.com/v2-0fc2c15481cc7af5b07fd7e3c7ae5f0c\_r.jpg"/>

![](https://pic1.zhimg.com/v2-0fc2c15481cc7af5b07fd7e3c7ae5f0c_r.jpg)

<img src="https://pic1.zhimg.com/v2-c305c53f3ed6c52a0222b5f5522c2f80\_b.jpg" data-caption="" data-size="normal" data-rawwidth="741" data-rawheight="556" class="origin\_image zh-lightbox-thumb" width="741" data-original="https://pic1.zhimg.com/v2-c305c53f3ed6c52a0222b5f5522c2f80\_r.jpg"/>

![](https://pic1.zhimg.com/v2-c305c53f3ed6c52a0222b5f5522c2f80_r.jpg)

区别是， InnoDB在(name,age)索引内部就判断了age是否等于10， 对于不等于10的记录， 直接判断并跳过。 在我们的这个例子中， 只需要对ID4、 ID5这两条记录回表取数据判断， 就只需要回表2次。

**06 | 全局锁和表锁** **：** **给表加个字段怎么有这么多阻碍？**
-----------------------------------------

根据加锁的范围， MySQL里面的锁大致可以分成全局锁、 表级锁和行锁三类。

**全局锁**

当你需要让整个库处于只读状态的时候， 可以使用这个命令， 之后其他线程的以下语句会被阻塞： 数据更新语句（数据的增删改） 、 数据定义语句（包括建表、 修改表结构等） 和更新类事务的提交语句。

全局锁的典型使用场景是， 做全库逻辑备份。

但是让整库都只读， 听上去就很危险：  
如果你在主库上备份， 那么在备份期间都不能执行更新， 业务基本上就得停摆；  
如果你在从库上备份， 那么备份期间从库不能执行主库同步过来的binlog， 会导致主从延迟 。

<img src="https://pic1.zhimg.com/v2-9b8a5daeb55fda6309b78b2d154383b4\_b.jpg" data-caption="" data-size="normal" data-rawwidth="695" data-rawheight="522" class="origin\_image zh-lightbox-thumb" width="695" data-original="https://pic1.zhimg.com/v2-9b8a5daeb55fda6309b78b2d154383b4\_r.jpg"/>

![](https://pic1.zhimg.com/v2-9b8a5daeb55fda6309b78b2d154383b4_r.jpg)

这个备份结果里， 用户A的数据状态是“账户余额没扣， 但是用户课程表里面已经多了一门课”。 如果后面用这个备份来恢复数据的话， 用户A就发现， 自己赚了。

**表级锁**

MySQL里面表级别的锁有两种： 一种是表锁， 一种是元数据锁（meta data lock， MDL) 。表锁的语法是 lock tables …read/write。举个例子, 如果在某个线程A中执行lock tables t1 read, t2 write; 这个语句， 则其他线程写t1、 读写t2的语句都会被阻塞。 同时， 线程A在执行unlock tables之前， 也只能执行读t1、 读写t2的操作。 连写t1都不允许， 自然也不能访问其他表。

另一类表级的锁是MDL（ metadata lock)。 MDL不需要显式使用， 在访问一个表的时候会被自动加上。 MDL的作用是， 保证读写的正确性。 你可以想象一下， 如果一个查询正在遍历一个表中的数据， 而执行期间另一个线程对这个表结构做变更， 删了一列， 那么查询线程拿到的结果跟表结构对不上， 肯定是不行的。

MDL读锁之间不互斥， 因此你可以有多个线程同时对一张表增删改查。读写锁之间、 写锁之间是互斥的， 用来保证变更表结构操作的安全性。 因此， 如果有两个线程要同时给一个表加字段， 其中一个要等另一个执行完才能开始执行。

**07 | 行锁功过：** **怎么减少行锁对性能的影响？**
--------------------------------

MySQL的行锁是在引擎层由各个引擎自己实现的。 但并不是所有的引擎都支持行锁。 InnoDB是支持行锁的 。

**从两阶段锁说起**

<img src="https://pic1.zhimg.com/v2-4353aadf97d1d898306624163a6b01c8\_b.jpg" data-caption="" data-size="normal" data-rawwidth="772" data-rawheight="580" class="origin\_image zh-lightbox-thumb" width="772" data-original="https://pic1.zhimg.com/v2-4353aadf97d1d898306624163a6b01c8\_r.jpg"/>

![](https://pic1.zhimg.com/v2-4353aadf97d1d898306624163a6b01c8_r.jpg)

实际上事务B的update语句会被阻塞， 直到事务A执行commit之后， 事务B才能继续执行。 在InnoDB事务中， 行锁是在需要的时候才加上的， 但并不是不需要了就立刻释放， 而是要等到事务结束时才释放。 这个就是两阶段锁协议。

**死锁和死锁检测**

<img src="https://pic4.zhimg.com/v2-2d221273ffb9f6f67cf8e31a29ea2783\_b.jpg" data-caption="" data-size="normal" data-rawwidth="809" data-rawheight="608" class="origin\_image zh-lightbox-thumb" width="809" data-original="https://pic4.zhimg.com/v2-2d221273ffb9f6f67cf8e31a29ea2783\_r.jpg"/>

![](https://pic4.zhimg.com/v2-2d221273ffb9f6f67cf8e31a29ea2783_r.jpg)

这时候， 事务A在等待事务B释放id=2的行锁， 而事务B在等待事务A释放id=1的行锁。 事务A和事务B在互相等待对方的资源释放， 就是进入了死锁状态。 当出现死锁以后， 有两种策略：

• 一种策略是， 直接进入等待， 直到超时。 这个超时时间可以通过参数innodb\_lock\_wait\_timeout来设置。

• 另一种策略是， 发起死锁检测， 发现死锁后， 主动回滚死锁链条中的某一个事务，让其他事务得以继续执行。 将参数innodb\_deadlock\_detect设置为on， 表示开启这个逻辑。

**08 | 事务到底是隔离的还是不隔离的？**
------------------------

如果是可重复读隔离级别， 事务T启动的时候会创建一个视图read-view， 之后事务T执行期间， 即使有其他事务修改了数据， 事务T看到的仍然跟在启动时看到的一样。

begin/start transaction 命令并不是一个事务的起点， 在执行到它们之后的第一个操作InnoDB表的语句， 事务才真正启动。 如果你想要马上启动一个事务， 可以使用start transaction withconsistent snapshot 这个命令。

在MySQL里， 有两个“视图”的概念：一个是view。 它是一个用查询语句定义的虚拟表， 在调用的时候执行查询语句并生成结果。创建视图的语法是create view …， 而它的查询方法与表一样。另一个是InnoDB在实现MVCC时用到的一致性读视图， 即consistent read view， 用于支持RC（Read Committed， 读提交） 和RR（ Repeatable Read， 可重复读） 隔离级别的实现。

**“快照”在MVCC里是怎么工作的？**

InnoDB里面每个事务有一个唯一的事务ID， 叫作transaction id。 它是在事务开始的时候向InnoDB的事务系统申请的， 是按申请顺序严格递增的。而每行数据也都是有多个版本的。 每次事务更新数据的时候， 都会生成一个新的数据版本， 并且把transaction id赋值给这个数据版本的事务ID， 记为row trx\_id。 同时， 旧的数据版本要保留，并且在新的数据版本中， 能够有信息可以直接拿到它。也就是说， 数据表中的一行记录， 其实可能有多个版本(row)， 每个版本有自己的row trx\_id。

<img src="https://pic2.zhimg.com/v2-6732d1260bb489b0b3d5456645a1c97d\_b.jpg" data-caption="" data-size="normal" data-rawwidth="733" data-rawheight="550" class="origin\_image zh-lightbox-thumb" width="733" data-original="https://pic2.zhimg.com/v2-6732d1260bb489b0b3d5456645a1c97d\_r.jpg"/>

![](https://pic2.zhimg.com/v2-6732d1260bb489b0b3d5456645a1c97d_r.jpg)

实际上， 图2中的三个虚线箭头， 就是undo log； 而V1、 V2、 V3并不是物理上真实存在的， 而是每次需要的时候根据当前版本和undo log计算出来的。 比如， 需要V2的时候， 就是通过V4依次执行U3、 U2算出来。

InnoDB为每个事务构造了一个数组， 用来保存这个事务启动瞬间， 当前正在“活跃”的所有事务ID。 “活跃”指的就是， 启动了但还没提交。

更新数据都是先读后写的， 而这个读， 只能读当前的值， 称为“当前读”（ current read） 。

InnoDB的行数据有多个版本， 每个数据版本有自己的row trx\_id， 每个事务或者语句有自己的一致性视图。 普通查询语句是一致性读， 一致性读会根据row trx\_id和一致性视图确定数据版本的可见性。

￮ 对于可重复读， 查询只承认在事务启动前就已经提交完成的数据；

￮ 对于读提交， 查询只承认在语句启动前就已经提交完成的数据；

￮ 而当前读， 总是读取已经提交完成的最新版本。

**09 | 普通索引和唯一索引，** **应该怎么选择？**
-------------------------------

从性能的角度考虑， 你选择唯一索引还是普通索引呢？ 选择的依据是什么呢？

<img src="https://pic1.zhimg.com/v2-667337b01de82a81d4ba744c0b5a4544\_b.jpg" data-caption="" data-size="normal" data-rawwidth="814" data-rawheight="611" class="origin\_image zh-lightbox-thumb" width="814" data-original="https://pic1.zhimg.com/v2-667337b01de82a81d4ba744c0b5a4544\_r.jpg"/>

![](https://pic1.zhimg.com/v2-667337b01de82a81d4ba744c0b5a4544_r.jpg)

如果要在这张表中插入一个新记录(4,400)的话， InnoDB的处理流程是怎样的。

第一种情况是， 这个记录要更新的目标页在内存中。 这时， InnoDB的处理流程如下：对于唯一索引来说， 找到3和5之间的位置， 判断到没有冲突， 插入这个值， 语句执行结束；对于普通索引来说， 找到3和5之间的位置， 插入这个值， 语句执行结束。

第二种情况是， 这个记录要更新的目标页不在内存中。 这时， InnoDB的处理流程如下：对于唯一索引来说， 需要将数据页读入内存， 判断到没有冲突， 插入这个值， 语句执行结束；对于普通索引来说， 则是将更新记录在change buffer， 语句执行就结束了。

<table data-draft-node="block" data-draft-type="table" data-size="normal" data-row-style="normal"><tbody><tr><td>Plain<br>Text<br>mysql&gt;<br>insert into t(id,k) values(id1,k1),(id2,k2);</td></tr></tbody></table>

这里， 我们假设当前k索引树的状态， 查找到位置后， k1所在的数据页在内存(InnoDB bufferpool)中， k2所在的数据页不在内存中。 如图所示是带change buffer的更新状态图。

<img src="https://pic3.zhimg.com/v2-0b9183012a1244f0f0cba72c3f35fefe\_b.jpg" data-caption="" data-size="normal" data-rawwidth="769" data-rawheight="577" class="origin\_image zh-lightbox-thumb" width="769" data-original="https://pic3.zhimg.com/v2-0b9183012a1244f0f0cba72c3f35fefe\_r.jpg"/>

![](https://pic3.zhimg.com/v2-0b9183012a1244f0f0cba72c3f35fefe_r.jpg)

分析这条更新语句， 你会发现它涉及了四个部分： 内存、 redo log（ib\_log\_fileX） 、 数据表空间（t.ibd） 、 系统表空间（ibdata1） 。

这条更新语句做了如下的操作（按照图中的数字顺序） ：  
1\. Page 1在内存中， 直接更新内存；  
2\. Page 2没有在内存中， 就在内存的change buffer区域， 记录下“我要往Page 2插入一行”这个信息  
3\. 将上述两个动作记入redo log中（图中3和4） 。

那在这之后的读请求， 要怎么处理呢？我们现在要执行 select \* from t where k in (k1, k2)。

如果读语句发生在更新语句后不久， 内存中的数据都还在， 那么此时的这两个读操作就与系统表空间（ibdata1） 和 redo log（ib\_log\_fileX） 无关了。

<img src="https://pic1.zhimg.com/v2-b1fbb2ac7035a0472d083dd788698cc8\_b.jpg" data-caption="" data-size="normal" data-rawwidth="798" data-rawheight="600" class="origin\_image zh-lightbox-thumb" width="798" data-original="https://pic1.zhimg.com/v2-b1fbb2ac7035a0472d083dd788698cc8\_r.jpg"/>

![](https://pic1.zhimg.com/v2-b1fbb2ac7035a0472d083dd788698cc8_r.jpg)

1\. 读Page 1的时候， 直接从内存返回。  
2\. 要读Page 2的时候， 需要把Page 2从磁盘读入内存中， 然后应用change buffer里面的操作日志， 生成一个正确的版本并返回结果。

**10 | MySQL为什么有时候会选错索引？**
--------------------------

一种方法是， 像我们第一个例子一样， 采用force index强行选择一个索引。

第二种方法就是， 我们可以考虑修改 语句， 引导MySQL使用我们期望的索引。 比如， 在这个例子里， 显然把“order byb limit 1” 改成 “order byb,a limit 1” ， 语义的逻辑是相同的。

第三种方法是， 在有些场景下， 我们可以新建一个更合适的索引， 来提供给优化器做选择， 或删掉误用的索引。

**11 | 怎么给字符串字段加索引？**
---------------------

<table data-draft-node="block" data-draft-type="table" data-size="normal" data-row-style="normal"><tbody><tr><td>Plain<br>Text<br>mysql&gt;<br>alter table SUser add index index1(email);<br>mysql&gt; alter table SUser add index index2(email(6));</td></tr></tbody></table>

第一个语句创建的index1索引里面， 包含了每个记录的整个字符串； 而第二个语句创建的index2索引里面， 对于每个记录都是只取前6个字节。

<img src="https://pic4.zhimg.com/v2-1f9c86deee7fdf253806b755ce1a2a4f\_b.jpg" data-caption="" data-size="normal" data-rawwidth="758" data-rawheight="569" class="origin\_image zh-lightbox-thumb" width="758" data-original="https://pic4.zhimg.com/v2-1f9c86deee7fdf253806b755ce1a2a4f\_r.jpg"/>

![](https://pic4.zhimg.com/v2-1f9c86deee7fdf253806b755ce1a2a4f_r.jpg)

<img src="https://pic2.zhimg.com/v2-4bc09dda4f949d96a83830caaec4a741\_b.jpg" data-caption="" data-size="normal" data-rawwidth="767" data-rawheight="577" class="origin\_image zh-lightbox-thumb" width="767" data-original="https://pic2.zhimg.com/v2-4bc09dda4f949d96a83830caaec4a741\_r.jpg"/>

![](https://pic2.zhimg.com/v2-4bc09dda4f949d96a83830caaec4a741_r.jpg)

  

<table data-draft-node="block" data-draft-type="table" data-size="normal" data-row-style="normal"><tbody><tr><td>select<br>id,name,email from SUser where email='zhangssxyz@xxx.com';</td></tr></tbody></table>

如果使用的是index1（即email整个字符串的索引结构） ， 执行顺序是这样的：  
1\. 从index1索引树找到满足索引值是’zhangssxyz@xxx.com’的这条记录， 取得ID2的值；  
2\. 到主键上查到主键值是ID2的行， 判断email的值是正确的， 将这行记录加入结果集；  
3\. 取index1索引树上刚刚查到的位置的下一条记录， 发现已经不满足  
email='zhangssxyz@xxx.com’的条件了， 循环结束。

如果使用的是index2（即email(6)索引结构） ， 执行顺序是这样的：  
1\. 从index2索引树找到满足索引值是’zhangs’的记录， 找到的第一个是ID1；  
2\. 到主键上查到主键值是ID1的行， 判断出email的值不是’zhangssxyz@xxx.com’， 这行记录丢弃；  
3\. 取index2上刚刚查到的位置的下一条记录， 发现仍然是’zhangs’， 取出ID2， 再到ID索引上取整行然后判断， 这次值对了， 将这行记录加入结果集；  
4\. 重复上一步， 直到在idxe2上取到的值不是’zhangs’时， 循环结束。

**前缀索引对覆盖索引的影响**

使用前缀索引就用不上覆盖索引对查询性能的优化了， 这也是你在选择是否使用前缀索引时需要考虑的一个因素。

**其他方式**

第一种方式是使用倒序存储。

第二种方式是使用hash字段。

首先， 它们的相同点是， 都不支持范围查询。 倒序存储的字段上创建的索引是按照倒序字符串的方式排序的， 已经没有办法利用索引方式查出身份证号码在\[ID\_X, ID\_Y\]的所有市民了。 同样地， hash字段的方式也只能支持等值查询。

它们的区别， 主要体现在以下三个方面：

1\. 从占用的额外空间来看， 倒序存储方式在主键索引上， 不会消耗额外的存储空间， 而hash字段方法需要增加一个字段。 当然， 倒序存储方式使用4个字节的前缀长度应该是不够的， 如果再长一点， 这个消耗跟额外这个hash字段也差不多抵消了。

2\. 在CPU消耗方面， 倒序方式每次写和读的时候， 都需要额外调用一次reverse函数， 而hash字段的方式需要额外调用一次crc32()函数。 如果只从这两个函数的计算复杂度来看的话， reverse函数额外消耗的CPU资源会更小些。

3\. 从查询效率上看， 使用hash字段方式的查询性能相对更稳定一些。 因为crc32算出来的值虽然有冲突的概率， 但是概率非常小， 可以认为每次查询的平均扫描行数接近1。 而倒序存储方式毕竟还是用的前缀索引的方式， 也就是说还是会增加扫描行数。

**12 | 为什么我的MySQL会“抖”一下？**
--------------------------

当内存数据页跟磁盘数据页内容不一致的时候， 我们称这个内存页为“脏页”。 内存数据写入到磁盘后， 内存和磁盘上的数据页的内容就一致了， 称为“干净页”。

什么时候flush？

1：是InnoDB的redo log写满了。 这时候系统会停止所有更新操作， 把:checkpoint往前推进， redo log留出空间可以继续写。

<img src="https://pic3.zhimg.com/v2-325baeae578777a56032cf6283376322\_b.jpg" data-caption="" data-size="normal" data-rawwidth="805" data-rawheight="605" class="origin\_image zh-lightbox-thumb" width="805" data-original="https://pic3.zhimg.com/v2-325baeae578777a56032cf6283376322\_r.jpg"/>

![](https://pic3.zhimg.com/v2-325baeae578777a56032cf6283376322_r.jpg)

checkpoint可不是随便往前修改一下位置就可以的。 比如图中， 把checkpoint位置从CP推进到CP’， 就需要将两个点之间的日志（浅绿色部分） ， 对应的所有脏页都flush到磁盘上。 之后， 图中从write pos到CP’之间就是可以再写入的redo log的区域。

2：系统内存不足。 当需要新的内存页， 而内存不够用的时候， 就要淘汰一些数据页， 空出内存给别的数据页使用。 如果淘汰的是“脏页”， 就要先将脏页写到磁盘。

3：MySQL认为系统“空闲”的时候。

4：MySQL正常关闭的情况。 这时候， MySQL会把内存的脏页都flush到磁盘上， 这样下次MySQL启动的时候， 就可以直接从磁盘上读数据， 启动速度会很快。

第一种是“redo log写满了， 要flush脏页”， 这种情况是InnoDB要尽量避免的。 因为出现这种情况的时候， 整个系统就不能再接受更新了， 所有的更新都必须堵住。

第二种是“内存不够用了， 要先将脏页写到磁盘”， 这种情况其实是常态。InnoDB用缓冲池（ buffer pool） 管理内存， 缓冲池中的内存页有三种状态：第一种是， 还没有使用的；第二种是， 使用了并且是干净页；第三种是， 使用了并且是脏页。

InnoDB的刷盘速度就是要参考这两个因素： 一个是脏页比例， 一个是redo log写盘速度。 InnoDB会根据这两个因素先单独算出两个数字。

InnoDB每次写入的日志都有一个序号， 当前写入的序号跟checkpoint对应的序号之间的差值，我们假设为N。 InnoDB会根据这个N算出一个范围在0到100之间的数字， 这个计算公式可以记为F2(N)。 F2(N)算法比较复杂， 你只要知道N越大， 算出来的值越大就好了。然后， 根据上述算得的F1(M)和F2(N)两个值， 取其中较大的值记为R， 之后引擎就可以按照innodb\_io\_capacity定义的能力乘以R%来控制刷脏页的速度。

<img src="https://pic4.zhimg.com/v2-4be9555fc3d92d3147a8e56bb47002ef\_b.jpg" data-caption="" data-size="normal" data-rawwidth="714" data-rawheight="953" class="origin\_image zh-lightbox-thumb" width="714" data-original="https://pic4.zhimg.com/v2-4be9555fc3d92d3147a8e56bb47002ef\_r.jpg"/>

![](https://pic4.zhimg.com/v2-4be9555fc3d92d3147a8e56bb47002ef_r.jpg)

现在你知道了， InnoDB会在后台刷脏页， 而刷脏页的过程是要将内存页写入磁盘。 所以， 无论是你的查询语句在需要内存的时候可能要求淘汰一个脏页， 还是由于刷脏页的逻辑会占用IO资源并可能影响到了你的更新语句

而MySQL中的一个机制， 可能让你的查询会更慢： 在准备刷一个脏页的时候， 如果这个数据页旁边的数据页刚好是脏页， 就会把这个“邻居”也带着一起刷掉； 而且这个把“邻居”拖下水的逻辑还可以继续蔓延， 也就是对于每个邻居数据页， 如果跟它相邻的数据页也还是脏页的话， 也会被放到一起刷

**13 | 为什么表数据删掉一半，** **表文件大小不变？**
---------------------------------

InnoDB引擎只会把R4这个记录标记为删除。 如果之后要再插入一个ID在300和600之间的记录时， 可能会复用这个位置。 但是， 磁盘文件的大小并不会缩小。

delete命令其实只是把记录的位置， 或者数据页标记为了“可复用”， 但磁盘文件的大小是不会变的。 也就是说， 通过delete命令是不能回收表空间的。 这些可以复用， 而没有被使用的空间， 看起来就像是“空洞”。

不止是删除数据会造成空洞， 插入数据也会。

<img src="https://pic4.zhimg.com/v2-ef142ebd4bf1c82e27927c549d8b88b3\_b.jpg" data-caption="" data-size="normal" data-rawwidth="733" data-rawheight="978" class="origin\_image zh-lightbox-thumb" width="733" data-original="https://pic4.zhimg.com/v2-ef142ebd4bf1c82e27927c549d8b88b3\_r.jpg"/>

![](https://pic4.zhimg.com/v2-ef142ebd4bf1c82e27927c549d8b88b3_r.jpg)

page A满了， 再插入一个ID是550的数据时， 就不得不再申请一个新的页面page B来保存数据了。 页分裂完成后， page A的末尾就留下了空洞（注意： 实际上， 可能不止1个记录的位置是空洞） 。

**重建表**

你可以新建一个与表A结构相同的表B， 然后按照主键ID递增的顺序， 把数据一行一行地从表A里读出来再插入到表B中。由于表B是新建的表， 所以表A主键索引上的空洞， 在表B中就都不存在了。 显然地， 表B的主键索引更紧凑， 数据页的利用率也更高。 如果我们把表B作为临时表， 数据从表A导入表B的操作完成后， 用表B替换A，从效果上看， 就起到了收缩表A空间的作用。

<img src="https://pic4.zhimg.com/v2-f034d8f27934b84a166348a591fec79f\_b.jpg" data-caption="" data-size="normal" data-rawwidth="702" data-rawheight="527" class="origin\_image zh-lightbox-thumb" width="702" data-original="https://pic4.zhimg.com/v2-f034d8f27934b84a166348a591fec79f\_r.jpg"/>

![](https://pic4.zhimg.com/v2-f034d8f27934b84a166348a591fec79f_r.jpg)

引入了Online DDL之后， 重建表的流程：  
1\. 建立一个临时文件， 扫描表A主键的所有数据页；  
2\. 用数据页中表A的记录生成B+树， 存储到临时文件中；  
3\. 生成临时文件的过程中， 将所有对A的操作记录在一个日志文件（row log） 中，对应的是图中state2的状态；  
4\. 临时文件生成后， 将日志文件中的操作应用到临时文件， 得到一个逻辑数据上与表A相同的数据文件， 对应的就是图中state3的状态；  
5\. 用临时文件替换表A的数据文件

<img src="https://pic4.zhimg.com/v2-68df36b78de15f58569abab878e2e57b\_b.jpg" data-caption="" data-size="normal" data-rawwidth="702" data-rawheight="527" class="origin\_image zh-lightbox-thumb" width="702" data-original="https://pic4.zhimg.com/v2-68df36b78de15f58569abab878e2e57b\_r.jpg"/>

![](https://pic4.zhimg.com/v2-68df36b78de15f58569abab878e2e57b_r.jpg)

**14 | count(\*)这么慢，** **我该怎么办？**
---------------------------------

**count(\*)的实现方式**

在不同的MySQL引擎中， count(\*)有不同的实现方式。MyISAM引擎把一个表的总行数存在了磁盘上， 因此执行count(\*)的时候会直接返回这个数，效率很高；而InnoDB引擎就麻烦了， 它执行count(\*)的时候， 需要把数据一行一行地从引擎里面读出来， 然后累积计数

那为什么InnoDB不跟MyISAM一样， 也把数字存起来呢？ 这是因为即使是在同一个时刻的多个查询， 由于多版本并发控制（MVCC） 的原因， InnoDB表“应该返回多少行”也是不确定的。 这里， 我用一个算count(\*)的例子来为你解释一下。

<img src="https://pic2.zhimg.com/v2-9bfaf25fec3ec708d7cbbe15d930a90d\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="330" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic2.zhimg.com/v2-9bfaf25fec3ec708d7cbbe15d930a90d\_r.jpg"/>

![](https://pic2.zhimg.com/v2-9bfaf25fec3ec708d7cbbe15d930a90d_r.jpg)

这和InnoDB的事务设计有关系， 可重复读是它默认的隔离级别， 在代码上就是通过多版本并发控制， 也就是MVCC来实现的。 每一行记录都要判断自己是否对这个会话可见， 因此对于count(\*)请求来说， InnoDB只好把数据一行一行地读出依次判断， 可见的行才能够用于计算“基于这个查询”的表的总行数。

MyISAM表虽然count(\*)很快， 但是不支持事务；  
show table status命令虽然返回很快， 但是不准确；  
InnoDB表直接count(\*)会遍历全表， 虽然结果准确， 但会导致性能问题。

**15 | 答疑文章（一）** **：** **日志和索引相关问题**
------------------------------------

**日志相关问题**

1\. 如果redo log里面的事务是完整的， 也就是已经有了commit标识， 则直接提交；  
2\. 如果redo log里面的事务只有完整的prepare， 则判断对应的事务binlog是否存在并完整：

a. 如果是， 则提交事务；  
b. 否则， 回滚事务。

**redo log 和 binlog是怎么关联起来的?**

回答： 它们有一个共同的数据字段， 叫XID。 崩溃恢复的时候， 会按顺序扫描redo log：  
如果碰到既有prepare、 又有commit的redo log， 就直接提交；  
如果碰到只有parepare、 而没有commit的redo log， 就拿着XID去binlog找对应的事务。

**redo log一般设置多大？**

redo log太小的话， 会导致很快就被写满， 然后不得不强行刷redo log， 这样WAL机制的能力就发挥不出来了。所以， 如果是现在常见的几个TB的磁盘的话， 就不要太小气了， 直接将redo log设置为4个文件、 每个文件1GB吧。

**16 | “order by”是怎么工作的？**
--------------------------

<table data-draft-node="block" data-draft-type="table" data-size="normal" data-row-style="normal"><tbody><tr><td>SQL<br>select<br>city,name,age from t where city='杭州' order by name limit 1000<br>;</td></tr></tbody></table>

为避免全表扫描， 我们需要在city字段加上索引。在city字段上创建索引之后， 我们用explain命令来看看这个语句的执行情况。

<img src="https://pic4.zhimg.com/v2-7e0a9ccbe43a3e179bc65fcce9bdafc7\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="73" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic4.zhimg.com/v2-7e0a9ccbe43a3e179bc65fcce9bdafc7\_r.jpg"/>

![](https://pic4.zhimg.com/v2-7e0a9ccbe43a3e179bc65fcce9bdafc7_r.jpg)

  

<img src="https://pic1.zhimg.com/v2-01abc172371c9df04bd8b07c6ae80a44\_b.jpg" data-caption="" data-size="normal" data-rawwidth="731" data-rawheight="548" class="origin\_image zh-lightbox-thumb" width="731" data-original="https://pic1.zhimg.com/v2-01abc172371c9df04bd8b07c6ae80a44\_r.jpg"/>

![](https://pic1.zhimg.com/v2-01abc172371c9df04bd8b07c6ae80a44_r.jpg)

通常情况下， 这个语句执行流程如下所示 ：  
1\. 初始化sort\_buffer， 确定放入name、 city、 age这三个字段；  
2\. 从索引city找到第一个满足city='杭州’条件的主键id， 也就是图中的ID\_X；  
3\. 到主键id索引取出整行， 取name、 city、 age三个字段的值， 存入sort\_buffer中；  
4\. 从索引city取下一个记录的主键id；  
5\. 重复步骤3、 4直到city的值不满足查询条件为止， 对应的主键id也就是图中的ID\_Y；  
6\. 对sort\_buffer中的数据按照字段name做快速排序；  
7\. 按照排序结果取前1000行返回给客户端。

<img src="https://pic1.zhimg.com/v2-66ebb983b335c5172916104ea7f166f4\_b.jpg" data-caption="" data-size="normal" data-rawwidth="736" data-rawheight="553" class="origin\_image zh-lightbox-thumb" width="736" data-original="https://pic1.zhimg.com/v2-66ebb983b335c5172916104ea7f166f4\_r.jpg"/>

![](https://pic1.zhimg.com/v2-66ebb983b335c5172916104ea7f166f4_r.jpg)

新的算法放入sort\_buffer的字段， 只有要排序的列（ 即name字段） 和主键id。但这时， 排序的结果就因为少了city和age字段的值， 不能直接返回了， 整个执行流程就变成如  
下所示的样子：  
1\. 初始化sort\_buffer， 确定放入两个字段， 即name和id；  
2\. 从索引city找到第一个满足city='杭州’条件的主键id， 也就是图中的ID\_X；  
3\. 到主键id索引取出整行， 取name、 id这两个字段， 存入sort\_buffer中；  
4\. 从索引city取下一个记录的主键id；  
5\. 重复步骤3、 4直到不满足city='杭州’条件为止， 也就是图中的ID\_Y；  
6\. 对sort\_buffer中的数据按照字段name进行排序；  
7\. 遍历排序结果， 取前1000行， 并按照id的值回到原表中取出city、 name和age三个字段返回给客户端。

<img src="https://pic2.zhimg.com/v2-287db8b31431470798e493a389111bcd\_b.jpg" data-caption="" data-size="normal" data-rawwidth="773" data-rawheight="581" class="origin\_image zh-lightbox-thumb" width="773" data-original="https://pic2.zhimg.com/v2-287db8b31431470798e493a389111bcd\_r.jpg"/>

![](https://pic2.zhimg.com/v2-287db8b31431470798e493a389111bcd_r.jpg)

**17 | 如何正确地显示随机消息？**
---------------------

对于内存表， 回表过程只是简单地根据数据行的位置， 直接访问内存得到数据， 根本不会导致多访问磁盘。

MySQL的表是用什么方法来定位“一行数据”的。 如果你创建的表没有主键， 或者把一个表的主键删掉了， 那么InnoDB会自己生成一个长度为6字节的rowid来作为主键

**18 | 为什么这些SQL语句逻辑相同，** **性能却差异巨大？**
-------------------------------------

案例一： 条件字段函数操作

对索引字段做函数操作， 可能会破坏索引值的有序性， 因此优化器就决定放弃走树搜索功能。

案例二： 隐式类型转换

数据类型转换的规则是什么？  
为什么有数据类型转换， 就需要走全索引扫描？

在MySQL中， 字符串和数字做比较的话， 是将字符串转换成数字

案例三： 隐式字符编码转换

其实是在说同一件事儿， 即： 对索引字段做函数操作， 可能会破坏索引值的有序性， 因此优化器就决定放弃走树搜索功能。

**19 | 为什么我只查一行的语句，** **也执行这么慢？**
---------------------------------

有些情况下， “查一行”， 也会执行得特别慢。

**第一类：** **查询长时间不返回**

如图1所示， 在表t执行下面的SQL语句：

<table data-draft-node="block" data-draft-type="table" data-size="normal" data-row-style="normal"><tbody><tr><td>SQL<br>mysql&gt;<br>select * from t where id=1;</td></tr></tbody></table>

查询结果长时间不返回。一般碰到这种情况的话， 大概率是表t被锁住了。 接下来分析原因的时候， 一般都是首先执行一下show processlist命令， 看看当前语句处于什么状态。然后我们再针对每种状态， 去分析它们产生的原因、 如何复现， 以及如何处理。

等MDL锁

<img src="https://pic1.zhimg.com/v2-43cf67835af1b1eb4b909d75235f6740\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="139" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic1.zhimg.com/v2-43cf67835af1b1eb4b909d75235f6740\_r.jpg"/>

![](https://pic1.zhimg.com/v2-43cf67835af1b1eb4b909d75235f6740_r.jpg)

出现这个状态表示的是， 现在有一个线程正在表t上请求或者持有MDL写锁， 把select语句堵住了。

等flush

<table data-draft-node="block" data-draft-type="table" data-size="normal" data-row-style="normal"><tbody><tr><td>SQL<br>mysql&gt;<br>select * from information_schema.processlist where id=1;</td></tr></tbody></table>

<img src="https://pic2.zhimg.com/v2-9c2586eb0d7a875c1d8c5ba6db76b019\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="103" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic2.zhimg.com/v2-9c2586eb0d7a875c1d8c5ba6db76b019\_r.jpg"/>

![](https://pic2.zhimg.com/v2-9c2586eb0d7a875c1d8c5ba6db76b019_r.jpg)

等行锁

现在， 经过了表级锁的考验， 我们的select 语句终于来到引擎里了

<table data-draft-node="block" data-draft-type="table" data-size="normal" data-row-style="normal"><tbody><tr><td>SQL<br>mysql&gt;<br>select * from t where id=1 lock in share mode;</td></tr></tbody></table>

<img src="https://pic3.zhimg.com/v2-1c1cc2504a4ff4a3eb3372ef367670b2\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="161" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic3.zhimg.com/v2-1c1cc2504a4ff4a3eb3372ef367670b2\_r.jpg"/>

![](https://pic3.zhimg.com/v2-1c1cc2504a4ff4a3eb3372ef367670b2_r.jpg)

<img src="https://pic3.zhimg.com/v2-1c1cc2504a4ff4a3eb3372ef367670b2\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="161" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic3.zhimg.com/v2-1c1cc2504a4ff4a3eb3372ef367670b2\_r.jpg"/>

![](https://pic3.zhimg.com/v2-1c1cc2504a4ff4a3eb3372ef367670b2_r.jpg)

**第二类：** **查询慢**

<table data-draft-node="block" data-draft-type="table" data-size="normal" data-row-style="normal"><tbody><tr><td>SQL<br>mysql&gt;<br>select * from t where id=1；</td></tr></tbody></table>

虽然扫描行数是1， 但执行时间却长达800毫秒。

<img src="https://pic2.zhimg.com/v2-a843797d072459d7af2e0795768df019\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="77" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic2.zhimg.com/v2-a843797d072459d7af2e0795768df019\_r.jpg"/>

![](https://pic2.zhimg.com/v2-a843797d072459d7af2e0795768df019_r.jpg)

select \* from t where id=1 lock in share mode， 执行时扫描行数也是1行， 执行时间是0.2毫秒。

<img src="https://pic2.zhimg.com/v2-3072bd544c2e9d47fab1661dbd2cba05\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="75" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic2.zhimg.com/v2-3072bd544c2e9d47fab1661dbd2cba05\_r.jpg"/>

![](https://pic2.zhimg.com/v2-3072bd544c2e9d47fab1661dbd2cba05_r.jpg)

<img src="https://pic2.zhimg.com/v2-4cd8ed4aedd5ee0a75562e60bc4c1bd1\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="511" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic2.zhimg.com/v2-4cd8ed4aedd5ee0a75562e60bc4c1bd1\_r.jpg"/>

![](https://pic2.zhimg.com/v2-4cd8ed4aedd5ee0a75562e60bc4c1bd1_r.jpg)

<img src="https://pic3.zhimg.com/v2-9dbeb09a512d2f83b9e75ba75f0f24d2\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="295" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic3.zhimg.com/v2-9dbeb09a512d2f83b9e75ba75f0f24d2\_r.jpg"/>

![](https://pic3.zhimg.com/v2-9dbeb09a512d2f83b9e75ba75f0f24d2_r.jpg)

session A先用start transaction with consistent snapshot命令启动了一个事务， 之后session B才开始执行update 语句。session B执行完100万次update语句后， id=1这一行处于什么状态呢？

<img src="https://pic4.zhimg.com/v2-8368c500a1b6df1a1f29e9ac0d0265fb\_b.jpg" data-caption="" data-size="normal" data-rawwidth="606" data-rawheight="455" class="origin\_image zh-lightbox-thumb" width="606" data-original="https://pic4.zhimg.com/v2-8368c500a1b6df1a1f29e9ac0d0265fb\_r.jpg"/>

![](https://pic4.zhimg.com/v2-8368c500a1b6df1a1f29e9ac0d0265fb_r.jpg)

带lock in share mode的SQL语句， 是当前读， 因此会直接读到1000001这个结果， 所以速度很快； 而select \* from t where id=1这个语句， 是一致性读， 因此需要从1000001开始， 依次执行undo log， 执行了100万次以后， 才将1这个结果返回。

**20 | 幻读是什么，** **幻读有什么问题？**
----------------------------

**幻读是什么？**

如果只在id=5这一行加锁， 而其他行的不加锁的话， 会怎么样。

<img src="https://pic4.zhimg.com/v2-bf801996b8b58d70a970ecba7465eab3\_b.jpg" data-caption="" data-size="normal" data-rawwidth="814" data-rawheight="433" class="origin\_image zh-lightbox-thumb" width="814" data-original="https://pic4.zhimg.com/v2-bf801996b8b58d70a970ecba7465eab3\_r.jpg"/>

![](https://pic4.zhimg.com/v2-bf801996b8b58d70a970ecba7465eab3_r.jpg)

可以看到， session A里执行了三次查询， 分别是Q1、 Q2和Q3。 它们的SQL语句相同， 都是select \* from t where d=5 for update。 查所有d=5的行， 而且使用的是当前读， 并且加上写锁。  
1\. Q1只返回id=5这一行；  
2\. 在T2时刻， session B把id=0这一行的d值改成了5， 因此T3时刻Q2查出来的是id=0和id=5这  
两行；  
3\. 在T4时刻， session C又插入一行（1,1,5） ， 因此T5时刻Q3查出来的是id=0、 id=1和id=5的这三行。  
其中， Q3读到id=1这一行的现象， 被称为“幻读”。 也就是说， 幻读指的是一个事务在前后两次查询同一个范围的时候， 后一次查询看到了前一次查询没有看到的行。

**说明**

1.在可重复读隔离级别下， 普通的查询是快照读， 是不会看到别的事务插入的数据的。 因此，幻读在“当前读”下才会出现。  
2\. 上面session B的修改结果， 被session A之后的select语句用“当前读”看到， 不能称为幻读。幻读仅专指“新插入的行”。

**幻读有什么问题？**

<img src="https://pic1.zhimg.com/v2-5f5b55f8c09a85be017bf3d4854a8908\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="500" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic1.zhimg.com/v2-5f5b55f8c09a85be017bf3d4854a8908\_r.jpg"/>

![](https://pic1.zhimg.com/v2-5f5b55f8c09a85be017bf3d4854a8908_r.jpg)

1\. 经过T1时刻， id=5这一行变成 (5,5,100)， 当然这个结果最终是在T6时刻正式提交的;  
2\. 经过T2时刻， id=0这一行变成(0,5,5);  
3\. 经过T4时刻， 表里面多了一行(1,5,5);  
4\. 其他行跟这个执行序列无关， 保持不变。

**如何解决幻读？**

行锁只能锁住行， 但是新插入记录这个动作， 要更新的是记录之间的“间隙”。 因此， 为了解决幻读问题， InnoDB只好引入新的锁， 也就是间隙锁(Gap Lock)。

<img src="https://pic4.zhimg.com/v2-3e3fd86868c6ddbdff2f8efe9c5e2d0b\_b.jpg" data-caption="" data-size="normal" data-rawwidth="683" data-rawheight="330" class="origin\_image zh-lightbox-thumb" width="683" data-original="https://pic4.zhimg.com/v2-3e3fd86868c6ddbdff2f8efe9c5e2d0b\_r.jpg"/>

![](https://pic4.zhimg.com/v2-3e3fd86868c6ddbdff2f8efe9c5e2d0b_r.jpg)

执行 select \* from t where d=5 for update的时候， 就不止是给数据库中已有的6个记录加上了行锁， 还同时加了7个间隙锁。 这样就确保了无法再插入新的记录。也就是说这时候， 在一行行扫描的过程中， 不仅将给行加上了行锁， 还给行两边的空隙， 也加上了间隙锁。

跟间隙锁存在冲突关系的， 是“往这个间隙中插入一个记录”这个操作。 间隙锁之间都不存在冲突关系

间隙锁和行锁合称next-keylock， 每个next-keylock是前开后闭区间。 也就是说， 我们的表t初始化以后， 如果用select \* from t for update要把整个表所有记录锁起来， 就形成了7个next-key lock， 分别是 (-∞,0\]、 (0,5\]、 (5,10\]、 (10,15\]、 (15,20\]、 (20, 25\]、 (25, +supremum\]。

**21 | 为什么我只改一行的语句，** **锁这么多？**
-------------------------------

1\. 原则1： 加锁的基本单位是next-keylock。 希望你还记得， next-keylock是前开后闭区间。  
2\. 原则2： 查找过程中访问到的对象才会加锁。  
3\. 优化1： 索引上的等值查询， 给唯一索引加锁的时候， next-keylock退化为行锁。  
4\. 优化2： 索引上的等值查询， 向右遍历时且最后一个值不满足等值条件的时候， next-key lock退化为间隙锁。  
5\. 一个bug： 唯一索引上的范围查询会访问到不满足条件的第一个值为止。

**22 | MySQL有哪些“饮鸩止渴”提高性能的方法？**
-------------------------------

第一种方法： 先处理掉那些占着连接但是不工作的线程。

第二种方法： 减少连接过程的消耗。

**慢查询性能问题**

导致慢查询的第一种可能是， 索引没有设计好。

导致慢查询的第二种可能是， 语句没写好。

**QPS突增问题**

1\. 一种是由全新业务的bug导致的。 假设你的DB运维是比较规范的， 也就是说白名单是一个个加的。 这种情况下， 如果你能够确定业务方会下掉这个功能， 只是时间上没那么快， 那么就可以从数据库端直接把白名单去掉。  
2\. 如果这个新功能使用的是单独的数据库用户， 可以用管理员账号把这个用户删掉， 然后断开现有连接。 这样， 这个新功能的连接不成功， 由它引发的QPS就会变成0。  
3\. 如果这个新增的功能跟主体功能是部署在一起的， 那么我们只能通过处理语句来限制。 这时， 我们可以使用上面提到的查询重写功能， 把压力最大的SQL语句直接重写成"select 1"返回。

**23 | MySQL是怎么保证数据不丢的？**
-------------------------

只要redo log和binlog保证持久化到磁盘， 就能确保MySQL异常重启后， 数据可以恢复。

**binlog的写入机制**

事务执行过程中， 先把日志写到binlog cache， 事务提交的时候， 再把binlog cache写到binlog文件中。 一个事务的binlog是不能被拆开的， 因此不论这个事务多大， 也要确保一次性写入。系统给binlog cache分配了一片内存， 每个线程一个， 参数 binlog\_cache\_size用于控制单个线程内binlog cache所占内存的大小。 如果超过了这个参数规定的大小， 就要暂存到磁盘。事务提交的时候， 执行器把binlog cache里的完整事务写入到binlog中， 并清空binlog cache。

<img src="https://pic4.zhimg.com/v2-9a9cb0303a9836b94005fbbf691f762b\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="564" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic4.zhimg.com/v2-9a9cb0303a9836b94005fbbf691f762b\_r.jpg"/>

![](https://pic4.zhimg.com/v2-9a9cb0303a9836b94005fbbf691f762b_r.jpg)

每个线程有自己binlog cache， 但是共用同一份binlog文件。

图中的write， 指的就是指把日志写入到文件系统的page cache， 并没有把数据持久化到磁盘， 所以速度比较快。图中的fsync， 才是将数据持久化到磁盘的操作。 一般情况下， 我们认为fsync才占磁盘的IOPS。

**redo log的写入机制**

事务在执行过程中， 生成的redolog是要先写到redo log buffer的。 redo log buffer里面的内容， 是不是每次生成后都要直接持久化到磁盘呢？答案是， 不需要。如果事务执行期间MySQL发生异常重启， 那这部分日志就丢了。 由于事务并没有提交， 所以这时日志丢了也不会有损失。事务还没提交的时候， redo log buffer中的部分日志有没有可能被持久化到磁盘呢？答案是， 确实会有。

<img src="https://pic3.zhimg.com/v2-7eb0fc74247e587fd9a08cb79e98d9ba\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="483" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic3.zhimg.com/v2-7eb0fc74247e587fd9a08cb79e98d9ba\_r.jpg"/>

![](https://pic3.zhimg.com/v2-7eb0fc74247e587fd9a08cb79e98d9ba_r.jpg)

这三种状态分别是：  
1\. 存在redo log buffer中， 物理上是在MySQL进程内存中， 就是图中的红色部分；  
2\. 写到磁盘(write)， 但是没有持久化（fsync)， 物理上是在文件系统的page cache里面， 也就  
是图中的黄色部分；  
3\. 持久化到磁盘， 对应的是hard disk， 也就是图中的绿色部分。

日志写到redo log buffer是很快的， wirte到page cache也差不多， 但是持久化到磁盘的速度就慢多了。

三个并发事务(trx1, trx2, trx3)在prepare 阶段， 都写完redo log buffer， 持久化到磁盘的过程， 对应的LSN分别是50、 120 和160。

<img src="https://pic4.zhimg.com/v2-07603a49fdebe4405d5fb3dc23f798f3\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="1639" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic4.zhimg.com/v2-07603a49fdebe4405d5fb3dc23f798f3\_r.jpg"/>

![](https://pic4.zhimg.com/v2-07603a49fdebe4405d5fb3dc23f798f3_r.jpg)

1\. trx1是第一个到达的， 会被选为这组的 leader；  
2\. 等trx1要开始写盘的时候， 这个组里面已经有了三个事务， 这时候LSN也变成了160；  
3\. trx1去写盘的时候， 带的就是LSN=160， 因此等trx1返回时， 所有LSN小于等于160的redo log， 都已经被持久化到磁盘；  
4\. 这时候trx2和trx3就可以直接返回了。  
所以， 一次组提交里面， 组员越多， 节约磁盘IOPS的效果越好。 但如果只有单线程压测， 那就  
只能老老实实地一个事务对应一次持久化操作了。

WAL机制主要得益于两个方面：

1\. redo log 和 binlog都是顺序写， 磁盘的顺序写比随机写速度要快；  
2\. 组提交机制， 可以大幅度降低磁盘的IOPS消耗。

**如果你的MySQL现在出现了性能瓶颈，** **而且瓶颈在IO上，** **可以通过哪些方法来提升性能呢？**

1\. 设置 binlog\_group\_commit\_sync\_delay和 binlog\_group\_commit\_sync\_no\_delay\_count参数， 减少binlog的写盘次数。 这个方法是基于“额外的故意等待”来实现的， 因此可能会增加语句的响应时间， 但没有丢失数据的风险。  
2\. 将sync\_binlog 设置为大于1的值（比较常见是100~1000） 。 这样做的风险是， 主机掉电时会丢binlog日志。  
3\. 将innodb\_flush\_log\_at\_trx\_commit设置为2。 这样做的风险是， 主机掉电的时候会丢数据。

**24 | MySQL是怎么保证主备一致的？**
-------------------------

**MySQL主备的基本原理**

<img src="https://pic3.zhimg.com/v2-bb7fe8417281a97b90efed8e220674c2\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="647" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic3.zhimg.com/v2-bb7fe8417281a97b90efed8e220674c2\_r.jpg"/>

![](https://pic3.zhimg.com/v2-bb7fe8417281a97b90efed8e220674c2_r.jpg)

节点A到B这条线的内部流程是什么样的。

<img src="https://pic1.zhimg.com/v2-538db96e693af848879420762b1d296c\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="647" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic1.zhimg.com/v2-538db96e693af848879420762b1d296c\_r.jpg"/>

![](https://pic1.zhimg.com/v2-538db96e693af848879420762b1d296c_r.jpg)

当binlog\_format=statement时， binlog里面记录的就是SQL语句的原文。

<img src="https://pic1.zhimg.com/v2-f33fc8107d45aad207242904c1a7a424\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="97" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic1.zhimg.com/v2-f33fc8107d45aad207242904c1a7a424\_r.jpg"/>

![](https://pic1.zhimg.com/v2-f33fc8107d45aad207242904c1a7a424_r.jpg)

把binlog的格式改为binlog\_format=‘row’

<img src="https://pic4.zhimg.com/v2-e3e64dcbcfea73068ce6d62517578b73\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="239" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic4.zhimg.com/v2-e3e64dcbcfea73068ce6d62517578b73\_r.jpg"/>

![](https://pic4.zhimg.com/v2-e3e64dcbcfea73068ce6d62517578b73_r.jpg)

row格式的binlog里没有了SQL语句的原文， 而是替换成了两个event： Table\_map和Delete\_rows

**为什么会有mixed这种binlog格式的存在场景？**

因为有些statement格式的binlog可能会导致主备不一致， 所以要使用row格式。但row格式的缺点是， 很占空间。 比如你用一个delete语句删掉10万行数据， 用statement的话就是一个SQL语句被记录到binlog中， 占用几十个字节的空间。 但如果用row格式的binlog，就要把这10万条记录都写到binlog中。 这样做， 不仅会占用更大的空间， 同时写binlog也要耗费IO资源， 影响执行速度。所以， MySQL就取了个折中方案， 也就是有了mixed格式的binlog。 mixed格式的意思是， MySQL自己会判断这条SQL语句是否可能引起主备不一致， 如果有可能， 就用row格式，否则就用statement格式。

**循环复制问题**

<img src="https://pic4.zhimg.com/v2-7a742531eb308259763289860b0e93cb\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="647" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic4.zhimg.com/v2-7a742531eb308259763289860b0e93cb\_r.jpg"/>

![](https://pic4.zhimg.com/v2-7a742531eb308259763289860b0e93cb_r.jpg)

双M结构和M-S结构， 其实区别只是多了一条线， 即： 节点A和B之间总是互为主备关系。 这样在切换的时候就不用再修改主备关系。

业务逻辑在节点A上更新了一条语句， 然后再把生成的binlog 发给节点B， 节点B执行完这条更新语句后也会生成binlog。如果节点A同时是节点B的备库， 相当于又把节点B新生成的binlog拿过来执行了一次， 然后节点A和B间， 会不断地循环执行这个更新语句， 也就是循环复制了。 这个要怎么解决呢？

MySQL在binlog中记录了这个命令第一次执行时所在实例的serverid。 因此， 我们可以用下面的逻辑， 来解决两个节点间的循环复制的问题：

1\. 规定两个库的server id必须不同， 如果相同， 则它们之间不能设定为主备关系；  
2\. 一个备库接到binlog并在重放的过程中， 生成与原binlog的server id相同的新的binlog；  
3\. 每个库在收到从自己的主库发过来的日志后， 先判断server id， 如果跟自己的相同， 表示这个日志是自己生成的， 就直接丢弃这个日志。

按照这个逻辑， 如果我们设置了双M结构， 日志的执行流就会变成这样：

1\. 从节点A更新的事务， binlog里面记的都是A的server id；  
2\. 传到节点B执行一次以后， 节点B生成的binlog 的server id也是A的server id；  
3\. 再传回给节点A， A判断到这个server id与自己的相同， 就不会再处理这个日志。 所以， 死循环在这里就断掉了。

**25 | MySQL是怎么保证高可用的？**
------------------------

正常情况下， 只要主库执行更新生成的所有binlog， 都可以传到备库并被正确地执行， 备库就能达到跟主库一致的状态， 这就是最终一致性。

**主备延迟**

主备切换可能是一个主动运维动作， 比如软件升级、 主库所在机器按计划下线等， 也可能是被动操作， 比如主库所在机器掉电。

与数据同步有关的时间点主要包括以下三个：

1\. 主库A执行完成一个事务， 写入binlog， 我们把这个时刻记为T1;  
2\. 之后传给备库B， 我们把备库B接收完这个binlog的时刻记为T2;  
3\. 备库B执行完成这个事务， 我们把这个时刻记为T3。

所谓主备延迟， 就是同一个事务， 在备库执行完成的时间和主库执行完成的时间之间的差值， 也就是T3-T1。

**主备延迟的来源**

首先， 有些部署条件下， 备库所在机器的性能要比主库所在的机器性能差。

备库的压力大：备库上的查询耗费了大量的CPU资源， 影响了同步速度， 造成主备延迟

￮ 这种情况， 我们一般可以这么处理：  
1\. 一主多从。 除了备库外， 可以多接几个从库， 让这些从库来分担读的压力。  
2\. 通过binlog输出到外部系统， 比如Hadoop这类系统， 让外部系统提供统计类查询的能力。

大事务

**可靠性优先策略**

双M结构下， 从状态1到状态2切换的详细过程是这样的：  
1\. 判断备库B现在的seconds\_behind\_master， 如果小于某个值（比如5秒） 继续下一步， 否则  
持续重试这一步；  
2\. 把主库A改成只读状态， 即把readonly设置为true；  
3\. 判断备库B的seconds\_behind\_master的值， 直到这个值变成0为止；  
4\. 把备库B改成可读写状态， 也就是把readonly设置为false；  
5\. 把业务请求切到备库B。  
这个切换流程， 一般是由专门的HA系统来完成的， 我们暂时称之为可靠性优先流程。

<img src="https://pic4.zhimg.com/v2-dc61cac01250cff693b1798c68f0b877\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="666" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic4.zhimg.com/v2-dc61cac01250cff693b1798c68f0b877\_r.jpg"/>

![](https://pic4.zhimg.com/v2-dc61cac01250cff693b1798c68f0b877_r.jpg)

**可用性优先策略**

强行把步骤4、 5调整到最开始执行， 也就是说不等主备数据同步， 直接把连接切到备库B， 并且让备库B可以读写， 那么系统几乎就没有不可用时间了。我们把这个切换流程， 暂时称作可用性优先流程。 这个切换流程的代价， 就是可能出现数据不一致的情况。

**26 | 备库为什么会延迟好几个小时？**
-----------------------

如果备库执行日志的速度持续低于主库生成日志的速度， 那这个延迟就有可能成了小时级别。 而且对于一个压力持续比较高的主库来说， 备库很可能永远都追不上主库的节奏。

<img src="https://pic4.zhimg.com/v2-ca4f659fec2a47c4b76552836f39388b\_b.jpg" data-caption="" data-size="normal" data-rawwidth="844" data-rawheight="633" class="origin\_image zh-lightbox-thumb" width="844" data-original="https://pic4.zhimg.com/v2-ca4f659fec2a47c4b76552836f39388b\_r.jpg"/>

![](https://pic4.zhimg.com/v2-ca4f659fec2a47c4b76552836f39388b_r.jpg)

coordinator在分发的时候， 需要满足以下这两个基本要求：  
1\. 不能造成更新覆盖。 这就要求更新同一行的两个事务， 必须被分发到同一个worker中。  
2\. 同一个事务不能被拆开， 必须放到同一个worker中。

**MySQL 5.5版本的并行复制策略**

**按表分发策略**

按表分发事务的基本思路是， 如果两个事务更新不同的表， 它们就可以并行。 因为数据是存储在表里的， 所以按表分发， 可以保证两个worker不会更新同一行。

<img src="https://pic2.zhimg.com/v2-e50b09f788eb17b9029a9326fe969fad\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="647" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic2.zhimg.com/v2-e50b09f788eb17b9029a9326fe969fad\_r.jpg"/>

![](https://pic2.zhimg.com/v2-e50b09f788eb17b9029a9326fe969fad_r.jpg)

**按行分发策略**

要解决热点表的并行复制问题， 就需要一个按行并行复制的方案。 按行复制的核心思路是： 如果两个事务没有更新相同的行， 它们在备库上可以并行执行。 显然， 这个模式要求binlog格式必须是row。

相比于按表并行分发策略， 按行并行策略在决定线程分发的时候， 需要消耗更多的计算资源。

**MySQL 5.6版本的并行复制策略**

官方MySQL5.6版本， 支持了并行复制， 只是支持的粒度是按库并行。这个策略的并行效果， 取决于压力模型。 如果在主库上有多个DB， 并且各个DB的压力均衡， 使用这个策略的效果会很好。

**MySQL 5.7的并行复制策略**

MySQL 5.7并行复制策略的思想是：  
1\. 同时处于prepare状态的事务， 在备库执行时是可以并行的；  
2\. 处于prepare状态的事务， 与处于commit状态的事务之间， 在备库执行时也是可以并行的。

为什么要有多线程复制呢？ 这是因为单线程复制的能力全面低于多线程复制， 对于更新压力较大的主库， 备库是可能一直追不上主库的。 从现象上看就是， 备库上seconds\_behind\_master的值越来越大。

**27 | 主库出问题了，** **从库怎么办？**
---------------------------

<img src="https://pic3.zhimg.com/v2-43542007fb09aee00b9a4973314718ea\_b.jpg" data-caption="" data-size="normal" data-rawwidth="844" data-rawheight="633" class="origin\_image zh-lightbox-thumb" width="844" data-original="https://pic3.zhimg.com/v2-43542007fb09aee00b9a4973314718ea\_r.jpg"/>

![](https://pic3.zhimg.com/v2-43542007fb09aee00b9a4973314718ea_r.jpg)

图中， 虚线箭头表示的是主备关系， 也就是A和A’互为主备， 从库B、 C、 D指向的是主库A。一主多从的设置， 一般用于读写分离， 主库负责所有的写入和一部分读， 其他的读请求则由从库分担。

<img src="https://pic2.zhimg.com/v2-ee10dc61b8c9cdf8e6c0e4f601d6bf91\_b.jpg" data-caption="" data-size="normal" data-rawwidth="850" data-rawheight="638" class="origin\_image zh-lightbox-thumb" width="850" data-original="https://pic2.zhimg.com/v2-ee10dc61b8c9cdf8e6c0e4f601d6bf91\_r.jpg"/>

![](https://pic2.zhimg.com/v2-ee10dc61b8c9cdf8e6c0e4f601d6bf91_r.jpg)

相比于一主一备的切换流程， 一主多从结构在切换完成后， A’会成为新的主库， 从库B、 C、 D也要改接到A’。 正是由于多了从库B、 C、 D重新指向的这个过程， 所以主备切换的复杂性也相应增加了。

**28 | 读写分离有哪些坑？**
------------------

怎么处理过期读问题

**强制走主库方案**

我们可以将查询请求分为这么两类：  
1\. 对于必须要拿到最新结果的请求， 强制将其发到主库上。 比如， 在一个交易平台上， 卖家发布商品以后， 马上要返回主页面， 看商品是否发布成功。 那么， 这个请求需要拿到最新的结果， 就必须走主库。  
2\. 对于可以读到旧数据的请求， 才将其发到从库上。 在这个交易平台上， 买家来逛商铺页面，就算晚几秒看到最新发布的商品， 也是可以接受的。 那么， 这类请求就可以走从库。

**Sleep 方案**

主库更新后， 读从库之前先sleep一下。

**判断主备无延迟方案**

第一种确保主备无延迟的方法是， 每次从库执行查询请求前， 先判断seconds\_behind\_master是否已经等于0。 如果还不等于0 ， 那就必须等到这个参数变为0才能执行查询请求 。第二种方法， 对比位点确保主备无延迟 。第三种方法， 对比GTID集合确保主备无延迟 。

**等主库位点方案**

<img src="https://pic4.zhimg.com/v2-4511f9ed17afa8ed75e71d12d7907cff\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="664" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic4.zhimg.com/v2-4511f9ed17afa8ed75e71d12d7907cff\_r.jpg"/>

![](https://pic4.zhimg.com/v2-4511f9ed17afa8ed75e71d12d7907cff_r.jpg)

1\. trx1事务更新完成后， 马上执行show master status得到当前主库执行到的File和Position；  
2\. 选定一个从库执行查询语句；  
3\. 在从库上执行select master\_pos\_wait(File, Position, 1)；  
4\. 如果返回值是>=0的正整数， 则在这个从库执行查询语句；  
5\. 否则， 到主库执行查询语句。

**29 | 如何判断一个数据库是不是出问题了？**
--------------------------

主备切换有两种场景， 一种是主动切换， 一种是被动切换。 而其中被动切换， 往往是因为主库出问题了， 由HA系统发起的。

**查表判断**

为了能够检测InnoDB并发线程数过多导致的系统不可用情况， 我们需要找一个访问InnoDB的场景。 一般的做法是， 在系统库（mysql库） 里创建一个表， 比如命名为health\_check， 里面只放一行数据， 然后定期执行： mysql> select \* from mysql.health\_check;

**内部统计**

MySQL 5.6版本以后提供的performance\_schema库， 就在file\_summary\_by\_event\_name表里统计了每次IO请求的时间。

**30 | 答疑文章（二）** **：** **用动态的观点看加锁**
------------------------------------

原则1： 加锁的基本单位是next-keylock。 希望你还记得， next-keylock是前开后闭区间。  
原则2： 查找过程中访问到的对象才会加锁。  
优化1： 索引上的等值查询， 给唯一索引加锁的时候， next-keylock退化为行锁。  
优化2： 索引上的等值查询， 向右遍历时且最后一个值不满足等值条件的时候， next-keylock退化为间隙锁。  
一个bug： 唯一索引上的范围查询会访问到不满足条件的第一个值为止。

**31 | 误删数据后除了跑路，** **还能怎么办？**
------------------------------

先对和MySQL相关的误删数据， 做下分类：  
1\. 使用delete语句误删数据行；  
2\. 使用drop table或者truncate table语句误删数据表；  
3\. 使用drop database语句误删数据库；  
4\. 使用rm命令误删整个MySQL实例。

**误删行**

具体恢复数据时， 对单个事务做如下处理：  
1\. 对于insert语句， 对应的binlog event类型是Write\_rows event， 把它改成Delete\_rows event即可；  
2\. 同理， 对于delete语句， 也是将Delete\_rows event改为Write\_rows event；  
3\. 而如果是Update\_rows的话， binlog里面记录了数据行修改前和修改后的值， 对调这两行的位置即可。

**误删库/表**

这种情况下， 要想恢复数据， 就需要使用全量备份， 加增量日志的方式了。 这个方案要求线上有定期的全量备份， 并且实时备份binlog。在这两个条件都具备的情况下， 假如有人中午12点误删了一个库， 恢复数据的流程如下：  
1\. 取最近一次全量备份， 假设这个库是一天一备， 上次备份是当天0点；  
2\. 用备份恢复出一个临时库；  
3\. 从日志备份里面， 取出凌晨0点之后的日志；  
4\. 把这些日志， 除了误删除数据的语句外， 全部应用到临时库。

<img src="https://pic1.zhimg.com/v2-382cfaac87b4c2b02706df690cbcd31c\_b.jpg" data-caption="" data-size="normal" data-rawwidth="744" data-rawheight="558" class="origin\_image zh-lightbox-thumb" width="744" data-original="https://pic1.zhimg.com/v2-382cfaac87b4c2b02706df690cbcd31c\_r.jpg"/>

![](https://pic1.zhimg.com/v2-382cfaac87b4c2b02706df690cbcd31c_r.jpg)

**rm删除数据**

只要不是恶意地把整个集群删除， 而只是删掉了其中某一个节点的数据的话， HA系统就会开始工作， 选出一个新的主库， 从而保证整个集群的正常工作。这时， 你要做的就是在这个节点上把数据恢复回来， 再接入整个集群

**32 | 为什么还有kill不掉的语句？**
------------------------

在MySQL中有两个kill命令： 一个是kill query+线程id， 表示终止这个线程中正在执行的语句； 一个是kill connection +线程id， 这里connection可缺省， 表示断开这个线程的连接， 当然如果这个线程有语句正在执行， 也是要先停止正在执行的语句的。不知道你在使用MySQL的时候， 有没有遇到过这样的现象： 使用了kill命令， 却没能断开这个连接。 再执行show processlist命令， 看到这条语句的Command列显示的是Killed。

kill并不是马上停止的意思， 而是告诉执行线程说， 这条语句已经不需要继续执行了，可以开始“执行停止的逻辑了”。

MySQL客户端发送请求后， 接收服务端返回结果的方式有两种：  
1\. 一种是本地缓存， 也就是在本地开一片内存， 先把结果存起来。 如果你用API开发， 对应的就是mysql\_store\_result 方法。  
2\. 另一种是不缓存， 读一个处理一个。 如果你用API开发， 对应的就是mysql\_use\_result方法。

**33 | 我查这么多数据，** **会不会把数据库内存打爆？**
----------------------------------

**全表扫描对server层的影响**

InnoDB的数据是保存在主键索引上的， 所以全表扫描实际上是直接扫描表t的主键索引。 这条查询语句由于没有其他的判断条件， 所以查到的每一行都可以直接放到结果集里面， 然后返回给客户端

实际上， 服务端并不需要保存一个完整的结果集。 取数据和发数据的流程是这样的：  
1\. 获取一行， 写到net\_buffer中。 这块内存的大小是由参数net\_buffer\_length定义的， 默认是16k。  
2\. 重复获取行， 直到net\_buffer写满， 调用网络接口发出去。  
3\. 如果发送成功， 就清空net\_buffer， 然后继续取下一行， 并写入net\_buffer。  
4\. 如果发送函数返回EAGAIN或WSAEWOULDBLOCK， 就表示本地网络栈（socket send buffer） 写满了， 进入等待。 直到网络栈重新可写， 再继续发送。

<img src="https://pic3.zhimg.com/v2-62fef2f8c289b95fdec311cf7d452c92\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="664" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic3.zhimg.com/v2-62fef2f8c289b95fdec311cf7d452c92\_r.jpg"/>

![](https://pic3.zhimg.com/v2-62fef2f8c289b95fdec311cf7d452c92_r.jpg)

**全表扫描对InnoDB的影响**

InnoDB内存管理用的是最近最少使用 (Least RecentlyUsed, LRU)算法， 这个算法的核心就是淘汰最久未使用的数据。

<img src="https://pic3.zhimg.com/v2-f5d3a0ac4b5ec837c34c7ab5e8a1fa8e\_b.jpg" data-caption="" data-size="normal" data-rawwidth="773" data-rawheight="597" class="origin\_image zh-lightbox-thumb" width="773" data-original="https://pic3.zhimg.com/v2-f5d3a0ac4b5ec837c34c7ab5e8a1fa8e\_r.jpg"/>

![](https://pic3.zhimg.com/v2-f5d3a0ac4b5ec837c34c7ab5e8a1fa8e_r.jpg)

InnoDB不能直接使用这个LRU算法。 实际上， InnoDB对LRU算法做了改进。在InnoDB实现上， 按照5:3的比例把整个LRU链表分成了young区域和old区域。 图中LRU\_old指向的就是old区域的第一个位置， 是整个链表的5/8处。 也就是说， 靠近链表头部的5/8是young区域， 靠近链表尾部的3/8是old区域。

<img src="https://pic1.zhimg.com/v2-704efbf40ddf82d6e7ba7623c6aa0654\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="664" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic1.zhimg.com/v2-704efbf40ddf82d6e7ba7623c6aa0654\_r.jpg"/>

![](https://pic1.zhimg.com/v2-704efbf40ddf82d6e7ba7623c6aa0654_r.jpg)

改进后的LRU算法执行流程变成了下面这样。  
1\. 图7中状态1， 要访问数据页P3， 由于P3在young区域， 因此和优化前的LRU算法一样， 将其移到链表头部， 变成状态2。  
2\. 之后要访问一个新的不存在于当前链表的数据页， 这时候依然是淘汰掉数据页Pm， 但是新插入的数据页Px， 是放在LRU\_old处。  
3\. 处于old区域的数据页， 每次被访问的时候都要做下面这个判断：若这个数据页在LRU链表中存在的时间超过了1秒， 就把它移动到链表头部；如果这个数据页在LRU链表中存在的时间短于1秒， 位置保持不变。 1秒这个时间， 是由参数innodb\_old\_blocks\_time控制的。 其默认值是1000， 单位毫秒。

我们看看改进后的LRU算法的操作逻辑：  
1\. 扫描过程中， 需要新插入的数据页， 都被放到old区域;  
2\. 一个数据页里面有多条记录， 这个数据页会被多次访问到， 但由于是顺序扫描， 这个数据页第一次被访问和最后一次被访问的时间间隔不会超过1秒， 因此还是会被保留在old区域；  
3\. 再继续扫描后续的数据， 之前的这个数据页之后也不会再被访问到， 于是始终没有机会移到链表头部（也就是young区域） ， 很快就会被淘汰出去。

**34 | 到底可不可以使用join？**
----------------------

在实际生产中， 关于join语句使用的问题， 一般会集中在以下两类：  
1\. 我们DBA不让使用join， 使用join有什么问题呢？  
2\. 如果有两个大小不同的表做join， 应该用哪个表做驱动表呢？

**Index Nested-Loop Join**

<table data-draft-node="block" data-draft-type="table" data-size="normal" data-row-style="normal"><tbody><tr><td>SQL<br>select<br>* from t1 straight_join t2 on (t1.a=t2.a);</td></tr></tbody></table>

如果直接使用join语句， MySQL优化器可能会选择表t1或t2作为驱动表， 这样会影响我们分析SQL语句的执行过程。 所以， 为了便于分析执行过程中的性能问题， 我改用straight\_join让MySQL使用固定的连接方式执行查询， 这样优化器只会按照我们指定的方式去join。 在这个语句里， t1 是驱动表， t2是被驱动表。

<img src="https://pic4.zhimg.com/v2-3eae9f3770ef6e5746e0416f6e5ad483\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="100" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic4.zhimg.com/v2-3eae9f3770ef6e5746e0416f6e5ad483\_r.jpg"/>

![](https://pic4.zhimg.com/v2-3eae9f3770ef6e5746e0416f6e5ad483_r.jpg)

可以看到， 在这条语句里， 被驱动表t2的字段a上有索引， join过程用上了这个索引， 因此这个语句的执行流程是这样的：  
1\. 从表t1中读入一行数据 R；  
2\. 从数据行R中， 取出a字段到表t2里去查找；  
3\. 取出表t2中满足条件的行， 跟R组成一行， 作为结果集的一部分；  
4\. 重复执行步骤1到3， 直到表t1的末尾循环结束。

<img src="https://pic3.zhimg.com/v2-574e0ec8edb9be29274323e322f09e36\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="664" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic3.zhimg.com/v2-574e0ec8edb9be29274323e322f09e36\_r.jpg"/>

![](https://pic3.zhimg.com/v2-574e0ec8edb9be29274323e322f09e36_r.jpg)

1\. 使用join语句， 性能比强行拆成多个单表执行SQL语句的性能要好；  
2\. 如果使用join语句的话， 需要让小表做驱动表。

**Simple Nested-Loop Join**

由于表的字段b上没有索引， 因此再用图的执行流程时， 每次到t2去匹配的时候， 就要做一次全表扫描 。

**Block Nested-Loop Join**

这时候， 被驱动表上没有可用的索引， 算法的流程是这样的：

1\. 把表t1的数据读入线程内存join\_buffer中， 由于我们这个语句中写的是select \*， 因此是把整个表t1放入了内存；

2\. 扫描表t2， 把表t2中的每一行取出来， 跟join\_buffer中的数据做对比， 满足join条件的， 作为结果集的一部分返回。

<img src="https://pic3.zhimg.com/v2-5e3ae7c51fae55c7f1cd16f4135d5416\_b.jpg" data-caption="" data-size="normal" data-rawwidth="748" data-rawheight="578" class="origin\_image zh-lightbox-thumb" width="748" data-original="https://pic3.zhimg.com/v2-5e3ae7c51fae55c7f1cd16f4135d5416\_r.jpg"/>

![](https://pic3.zhimg.com/v2-5e3ae7c51fae55c7f1cd16f4135d5416_r.jpg)

join\_buffer的大小是由参数join\_buffer\_size设定的， 默认值是256k。 如果放不下表t1的所有数据话， 策略很简单， 就是分段放。 我把join\_buffer\_size改成1200， 再执行：

<table data-draft-node="block" data-draft-type="table" data-size="normal" data-row-style="normal"><tbody><tr><td>SQL<br>select<br>* from t1 straight_join t2 on (t1.a=t2.b);</td></tr></tbody></table>

执行过程就变成了：  
1\. 扫描表t1， 顺序读取数据行放入join\_buffer中， 放完第88行join\_buffer满了， 继续第2步；  
2\. 扫描表t2， 把t2中的每一行取出来， 跟join\_buffer中的数据做对比， 满足join条件的， 作为结果集的一部分返回；  
3\. 清空join\_buffer；  
4\. 继续扫描表t1， 顺序读取最后的12行数据放入join\_buffer中， 继续执行第2步。

<img src="https://pic3.zhimg.com/v2-f638f76339448e29e8589773fa6638a6\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="664" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic3.zhimg.com/v2-f638f76339448e29e8589773fa6638a6\_r.jpg"/>

![](https://pic3.zhimg.com/v2-f638f76339448e29e8589773fa6638a6_r.jpg)

我们再来看下， 在这种情况下驱动表的选择问题。

假设， 驱动表的数据行数是N， 需要分K段才能完成算法流程， 被驱动表的数据行数是M。注意， 这里的K不是常数， N越大K就会越大， 因此把K表示为λ\*N， 显然λ的取值范围是(0,1)。所以， 在这个算法的执行过程中：  
1\. 扫描行数是 N+λ\*N\*M；  
2\. 内存判断 N\*M次。  
显然， 内存判断次数是不受选择哪个表作为驱动表影响的。 而考虑到扫描行数， 在M和N大小确定的情况下， N小一些， 整个算式的结果会更小。所以结论是， 应该让小表当驱动表。当然， 你会发现， 在N+λ\*N\*M这个式子里， λ才是影响扫描行数的关键因素， 这个值越小越好。

第一个问题： 能不能使用join语句？  
1\. 如果可以使用IndexNested-Loop Join算法， 也就是说可以用上被驱动表上的索引， 其实是没问题的；  
2\. 如果使用Block Nested-Loop Join算法， 扫描行数就会过多。 尤其是在大表上的join操作， 这样可能要扫描被驱动表很多次， 会占用大量的系统资源。 所以这种join尽量不要用。所以你在判断要不要使用join语句时， 就是看explain结果里面， Extra字段里面有没有出现“Block Nested Loop”字样。

第二个问题是： 如果要使用join， 应该选择大表做驱动表还是选择小表做驱动表？  
1\. 如果是IndexNested-Loop Join算法， 应该选择小表做驱动表；  
2\. 如果是Block Nested-Loop Join算法：  
在join\_buffer\_size足够大的时候， 是一样的；在join\_buffer\_size不够大的时候（这种情况更常见） ， 应该选择小表做驱动表。所以， 这个问题的结论就是， 总是应该使用小表做驱动表。

在决定哪个表做驱动表的时候， 应该是两个表按照各自的条件过滤， 过滤完成之后， 计算参与join的各个字段的总数据量， 数据量小的那个表， 就是“小表”， 应该作为驱动表。

**35 | join语句怎么优化？**
--------------------

**Multi-Range Read优化**

Multi-Range Read优化 (MRR)。 这个优化的主要目的是尽量使用顺序读盘。

主键索引是一棵B+树， 在这棵树上， 每次只能根据一个主键id查到一行数据。 因此， 回表肯定是一行行搜索主键索引的

<img src="https://pic4.zhimg.com/v2-56fae159de238ecab6344550ed81a80b\_b.jpg" data-caption="" data-size="normal" data-rawwidth="853" data-rawheight="658" class="origin\_image zh-lightbox-thumb" width="853" data-original="https://pic4.zhimg.com/v2-56fae159de238ecab6344550ed81a80b\_r.jpg"/>

![](https://pic4.zhimg.com/v2-56fae159de238ecab6344550ed81a80b_r.jpg)

如果随着a的值递增顺序查询的话， id的值就变成随机的， 那么就会出现随机访问， 性能相对较差。 虽然“按行查”这个机制不能改， 但是调整查询的顺序， 还是能够加速的。因为大多数的数据都是按照主键递增顺序插入得到的， 所以我们可以认为， 如果按照主键的递增顺序查询的话， 对磁盘的读比较接近顺序读， 能够提升读性能。

这就是MRR优化的设计思路。 此时， 语句的执行流程变成了这样：  
1\. 根据索引a， 定位到满足条件的记录， 将id值放入read\_rnd\_buffer中;  
2\. 将read\_rnd\_buffer中的id进行递增排序；  
3\. 排序后的id数组， 依次到主键id索引中查记录， 并作为结果返回。

**Batched Key Access**

NLJ算法执行的逻辑是： 从驱动表t1， 一行行地取出a的值， 再到被驱动表t2去做join。 也就是说， 对于表t2来说， 每次都是匹配一个值。 这时， MRR的优势就用不上了。

**BNL算法的性能问题**

大表join操作虽然对IO有影响， 但是在语句执行结束后， 对IO的影响也就结束了。 但是，对Buffer Pool的影响就是持续性的， 需要依靠后续的查询请求慢慢恢复内存命中率。

也就是说， BNL算法对系统的影响主要包括三个方面：  
1\. 可能会多次扫描被驱动表， 占用磁盘IO资源；  
2\. 判断join条件需要执行M\*N次对比（M、 N分别是两张表的行数） ， 如果是大表就会占用非常多的CPU资源；  
3\. 可能会导致Buffer Pool的热数据被淘汰， 影响内存命中率。

**36 | 为什么临时表可以重名？**
--------------------

有的人可能会认为， 临时表就是内存表。 但是，这两个概念可是完全不同的。

• 内存表， 指的是使用Memory引擎的表， 建表语法是create table engine=memory。 这种表的数据都保存在内存里， 系统重启的时候会被清空， 但是表结构还在。 除了这两个特性看上去比较“奇怪”外， 从其他的特征上看， 它就是一个正常的表。

• 而临时表， 可以使用各种引擎类型 。 如果是使用InnoDB引擎或者MyISAM引擎的临时表， 写数据的时候是写到磁盘上的。 当然， 临时表也可以使用Memory引擎。

**临时表的特性**

临时表在使用上有以下几个特点：  
1\. 建表语法是create temporarytable …。  
2\. 一个临时表只能被创建它的session访问， 对其他线程不可见。  
3\. 临时表可以与普通表同名。  
4\. session A内有同名的临时表和普通表的时候， show create语句， 以及增删改查语句访问的是临时表。  
5\. show tables命令不显示临时表。

**为什么临时表可以重名？**

<table data-draft-node="block" data-draft-type="table" data-size="normal" data-row-style="normal"><tbody><tr><td>SQL<br>create<br>temporary table temp_t(id int primary key)engine=innodb;</td></tr></tbody></table>

MySQL要给这个InnoDB表创建一个frm文件保存表结构定义， 还要有地方保存表数据。这个frm文件放在临时文件目录下， 文件名的后缀是.frm， 前缀是“#sql{进程id}\_{线程id}\_序列号”。 你可以使用select @@tmpdir命令， 来显示实例的临时文件目录。

**37 | 什么时候会使用内部临时表？**
----------------------

**union 执行流程**

<table data-draft-node="block" data-draft-type="table" data-size="normal" data-row-style="normal"><tbody><tr><td>SQL<br>(select<br>1000 as f) union (select id from t1 order by id desc limit 2);</td></tr></tbody></table>

<img src="https://pic3.zhimg.com/v2-cdd30127279ee84efdc01b6e0ca55962\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="106" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic3.zhimg.com/v2-cdd30127279ee84efdc01b6e0ca55962\_r.jpg"/>

![](https://pic3.zhimg.com/v2-cdd30127279ee84efdc01b6e0ca55962_r.jpg)

1\. 创建一个内存临时表， 这个临时表只有一个整型字段f， 并且f是主键字段。  
2\. 执行第一个子查询， 得到1000这个值， 并存入临时表中。  
3\. 执行第二个子查询：

i. 拿到第一行id=1000， 试图插入临时表中。 但由于1000这个值已经存在于临时表了， 违反了唯一性约束， 所以插入失败， 然后继续执行；

ii. 取到第二行id=999， 插入临时表成功。

4\. 从临时表中按行取出数据， 返回结果， 并删除临时表， 结果中包含两行数据分别是1000和999。

<img src="https://pic1.zhimg.com/v2-a18152939ede88f01591b0504f57372c\_b.jpg" data-caption="" data-size="normal" data-rawwidth="817" data-rawheight="631" class="origin\_image zh-lightbox-thumb" width="817" data-original="https://pic1.zhimg.com/v2-a18152939ede88f01591b0504f57372c\_r.jpg"/>

![](https://pic1.zhimg.com/v2-a18152939ede88f01591b0504f57372c_r.jpg)

可以看到， 这里的内存临时表起到了暂存数据的作用， 而且计算过程还用上了临时表主键id的唯一性约束， 实现了union的语义。

**group by 执行流程**

<table data-draft-node="block" data-draft-type="table" data-size="normal" data-row-style="normal"><tbody><tr><td>SQL<br>select<br>id%10 as m, count(*) as c from t1 group by m;</td></tr></tbody></table>

<img src="https://pic3.zhimg.com/v2-89efa9683898c3ff213b80a5ff3f1f36\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="72" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic3.zhimg.com/v2-89efa9683898c3ff213b80a5ff3f1f36\_r.jpg"/>

![](https://pic3.zhimg.com/v2-89efa9683898c3ff213b80a5ff3f1f36_r.jpg)

在Extra字段里面， 我们可以看到三个信息：  
Using index， 表示这个语句使用了覆盖索引， 选择了索引a， 不需要回表；  
Using temporary， 表示使用了临时表；  
Using filesort， 表示需要排序。

这个语句的执行流程是这样的：  
1\. 创建内存临时表， 表里有两个字段m和c， 主键是m；  
2\. 扫描表t1的索引a， 依次取出叶子节点上的id值， 计算id%10的结果， 记为x；

￮ 如果临时表中没有主键为x的行， 就插入一个记录(x,1);

￮ 如果表中有主键为x的行， 就将x这一行的c值加1；

3\. 遍历完成后， 再根据字段m做排序， 得到结果集返回给客户端。

<img src="https://pic3.zhimg.com/v2-ca23b59b386b342687be5d858f84b60a\_b.jpg" data-caption="" data-size="normal" data-rawwidth="792" data-rawheight="611" class="origin\_image zh-lightbox-thumb" width="792" data-original="https://pic3.zhimg.com/v2-ca23b59b386b342687be5d858f84b60a\_r.jpg"/>

![](https://pic3.zhimg.com/v2-ca23b59b386b342687be5d858f84b60a_r.jpg)

**指导原则**

1\. 如果对group by语句的结果没有排序要求， 要在语句后面加 order bynull；  
2\. 尽量让group by过程用上表的索引， 确认方法是explain结果里没有Using temporary和 Using filesort；  
3\. 如果group by需要统计的数据量不大， 尽量只使用内存临时表； 也可以通过适当调大tmp\_table\_size参数， 来避免用到磁盘临时表；  
4\. 如果数据量实在太大， 使用SQL\_BIG\_RESULT这个提示， 来告诉优化器直接使用排序算法得到group by的结果。

**38 | 都说InnoDB好，** **那还要不要使用Memory引擎？**
----------------------------------------

**内存表的数据组织结构**

假设有以下的两张表t1 和 t2， 其中表t1使用Memory引擎， 表t2使用InnoDB引擎。

<img src="https://pic4.zhimg.com/v2-71d662c48f636cb64e9a24079f6e4e43\_b.jpg" data-caption="" data-size="normal" data-rawwidth="708" data-rawheight="391" class="origin\_image zh-lightbox-thumb" width="708" data-original="https://pic4.zhimg.com/v2-71d662c48f636cb64e9a24079f6e4e43\_r.jpg"/>

![](https://pic4.zhimg.com/v2-71d662c48f636cb64e9a24079f6e4e43_r.jpg)

可以看到， 内存表t1的返回结果里面0在最后一行， 而InnoDB表t2的返回结果里0在第一行。表t2用的是InnoDB引擎， 它的主键索引id的组织方式， 你已经很熟悉了： InnoDB表的数据就放在主键索引树上， 主键索引是B+树。 所以表t2的数据组织方式如下图所示：

<img src="https://pic4.zhimg.com/v2-31fb882227ccc787aff9365efa4a7377\_b.jpg" data-caption="" data-size="normal" data-rawwidth="628" data-rawheight="484" class="origin\_image zh-lightbox-thumb" width="628" data-original="https://pic4.zhimg.com/v2-31fb882227ccc787aff9365efa4a7377\_r.jpg"/>

![](https://pic4.zhimg.com/v2-31fb882227ccc787aff9365efa4a7377_r.jpg)

与InnoDB引擎不同， Memory引擎的数据和索引是分开的。

<img src="https://pic4.zhimg.com/v2-e1c19189b71c463c4291ec510aad365b\_b.jpg" data-caption="" data-size="normal" data-rawwidth="800" data-rawheight="617" class="origin\_image zh-lightbox-thumb" width="800" data-original="https://pic4.zhimg.com/v2-e1c19189b71c463c4291ec510aad365b\_r.jpg"/>

![](https://pic4.zhimg.com/v2-e1c19189b71c463c4291ec510aad365b_r.jpg)

可见， InnoDB和Memory引擎的数据组织方式是不同的：

￮ InnoDB引擎把数据放在主键索引上， 其他索引上保存的是主键id。 这种方式， 我们称之为索引组织表（IndexOrganizied Table） 。

￮ 而Memory引擎采用的是把数据单独存放， 索引上保存数据位置的数据组织形式， 我们称之为堆组织表（Heap Organizied Table） 。

从中我们可以看出， 这两个引擎的一些典型不同

1\. InnoDB表的数据总是有序存放的， 而内存表的数据就是按照写入顺序存放的；  
2\. 当数据文件有空洞的时候， InnoDB表在插入新数据的时候， 为了保证数据有序性， 只能在固定的位置写入新值， 而内存表找到空位就可以插入新值；  
3\. 数据位置发生变化的时候， InnoDB表只需要修改主键索引， 而内存表需要修改所有索引；  
4\. InnoDB表用主键索引查询时需要走一次索引查找， 用普通索引查询的时候， 需要走两次索引查找。 而内存表没有这个区别， 所有索引的“地位”都是相同的。  
5\. InnoDB支持变长数据类型， 不同记录的长度可能不同； 内存表不支持Blob 和 Text字段， 并且即使定义了varchar(N)， 实际也当作char(N)， 也就是固定长度字符串来存储， 因此内存表的每行数据长度相同。

**hash索引和B-Tree索引**

存表也是支B-Tree索引的。 在id列上创建一个B-Tree索引， SQL语句可以这么写：

<table data-draft-node="block" data-draft-type="table" data-size="normal" data-row-style="normal"><tbody><tr><td>SQL<br>alter<br>table t1 add index a_btree_index using btree (id);</td></tr></tbody></table>

<img src="https://pic3.zhimg.com/v2-7aedaca45c3601f3710f00f625210abe\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="664" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic3.zhimg.com/v2-7aedaca45c3601f3710f00f625210abe\_r.jpg"/>

![](https://pic3.zhimg.com/v2-7aedaca45c3601f3710f00f625210abe_r.jpg)

**内存表的锁**

内存表不支持行锁， 只支持表锁。 因此， 一张表只要有更新， 就会堵住其他所有在这个表上的读写操作。

**数据持久性问题**

数据放在内存中， 是内存表的优势， 但也是一个劣势。 因为， 数据库重启的时候， 所有的内存表都会被清空。内存表并不适合在生产环境上作为普通数据表使用 。

1\. 如果你的表更新量大， 那么并发度是一个很重要的参考指标， InnoDB支持行锁， 并发度比内存表好；  
2\. 能放到内存表的数据量都不大。 如果你考虑的是读的性能， 一个读QPS很高并且数据量不大的表， 即使是使用InnoDB， 数据也是都会缓存在InnoDB Buffer Pool里的。 因此， 使用InnoDB表的读性能也不会差。

建议你把普通内存表都用InnoDB表来代替

内存临时表刚好可以无视内存表的两个不足， 主要是下面的三个原因：  
1\. 临时表不会被其他线程访问， 没有并发性的问题；  
2\. 临时表重启后也是需要删除的， 清空数据这个问题不存在；  
3\. 备库的临时表也不会影响主库的用户线程。

**39 | 自增主键为什么不是连续的？**
----------------------

**自增值保存在哪儿？**

<img src="https://pic3.zhimg.com/v2-bc4fe24539032e9af68fb573831972ea\_b.jpg" data-caption="" data-size="normal" data-rawwidth="745" data-rawheight="283" class="origin\_image zh-lightbox-thumb" width="745" data-original="https://pic3.zhimg.com/v2-bc4fe24539032e9af68fb573831972ea\_r.jpg"/>

![](https://pic3.zhimg.com/v2-bc4fe24539032e9af68fb573831972ea_r.jpg)

可以看到， 表定义里面出现了一个AUTO\_INCREMENT=2， 表示下一次插入数据时， 如果需要自动生成自增值， 会生成id=2。其实， 这个输出结果容易引起这样的误解： 自增值是保存在表结构定义里的。 实际上， 表的结构定义存放在后缀名为.frm的文件中， 但是并不会保存自增值。

不同的引擎对于自增值的保存策略不同。MyISAM引擎的自增值保存在数据文件中。InnoDB引擎的自增值， 其实是保存在了内存里， 并且到了MySQL 8.0版本后， 才有了“自增值持久化”的能力， 也就是才实现了“如果发生重启， 表的自增值可以恢复为MySQL重启前的值”

**40 | insert语句的锁为什么这么多？**
--------------------------

insert …select 是很常见的在两个表之间拷贝数据的方法。 你需要注意， 在可重复读隔离级别下， 这个语句会给select的表里扫描到的记录和间隙加读锁。  
而如果insert和select的对象是同一个表， 则有可能会造成循环写入。 这种情况下， 我们需要引入用户临时表来做优化。  
insert 语句如果出现唯一键冲突， 会在冲突的唯一值上加共享的next-keylock(S锁)。 因此， 碰到由于唯一键约束导致报错后， 要尽快提交或回滚事务， 避免加锁时间过长。

**41 | 怎么最快地复制一张表？**
--------------------

**mysqldump方法**

<table data-draft-node="block" data-draft-type="table" data-size="normal" data-row-style="normal"><tbody><tr><td>SQL<br>mysqldump<br>-h$host -P$port -u$user --add-locks=0 --no-create-info --single-transaction<br>--set-gtid-purged=OFF db1</td></tr></tbody></table>

这条命令中， 主要参数含义如下：  
1\. –single-transaction的作用是， 在导出数据的时候不需要对表db1.t加表锁， 而是使用STARTTRANSACTION WITH CONSISTENTSNAPSHOT的方法；  
2\. –add-locks设置为0， 表示在输出的文件结果里， 不增加" LOCKTABLES t WRITE;"；  
3\. –no-create-info的意思是， 不需要导出表结构；  
4\. –set-gtid-purged=off表示的是， 不输出跟GTID相关的信息；  
5\. –result-file指定了输出文件的路径， 其中client表示生成的文件是在客户端机器上的。  
通过这条mysqldump命令生成的t.sql文件中就包含了如图1所示的INSERT语句。

**导出CSV文件**

另一种方法是直接将结果导出成.csv文件。 MySQL提供了下面的语法， 用来将查询结果导出到服务端本地目录：

<table data-draft-node="block" data-draft-type="table" data-size="normal" data-row-style="normal"><tbody><tr><td>SQL<br>select<br>* from db1.t where a&gt;900 into outfile '/server_tmp/t.csv';</td></tr></tbody></table>

**物理拷贝**

**42 | grant之后要跟着flush privileges吗？**
-------------------------------------

grant之后真的需要执行flush privileges吗？ 如果没有执行这个flush命令的话， 赋权语句真的不能生效吗？grant语句会同时修改数据表和内存， 判断权限的时候使用的是内存数据。 因此， 规范地使用grant和revoke语句， 是不需要随后加上flush privileges语句的。flush privileges语句本身会用数据表的数据重建一份内存权限数据， 所以在权限数据可能存在不一致的情况下再使用。 而这种不一致往往是由于直接用DML语句操作系统权限表导致的， 所以我们尽量不要使用这类语句。

**43 | 要不要使用分区表？**
------------------

<table data-draft-node="block" data-draft-type="table" data-size="normal" data-row-style="normal"><tbody><tr><td>SQL<br>CREATE<br>TABLE `t` (<br>`ftime` datetime NOT NULL,<br>`c` int(11) DEFAULT NULL,<br>KEY (`ftime`)<br>) ENGINE=InnoDB DEFAULT CHARSET=latin1<br>PARTITION BY RANGE (YEAR(ftime))<br>(PARTITION p_2017 VALUES LESS THAN (2017) ENGINE = InnoDB,<br>PARTITION p_2018 VALUES LESS THAN (2018) ENGINE = InnoDB,<br>PARTITION p_2019 VALUES LESS THAN (2019) ENGINE = InnoDB,<br>PARTITION p_others VALUES LESS THAN MAXVALUE ENGINE = InnoDB);<br>insert into t values('2017-4-1',1),('2018-4-1',1);</td></tr></tbody></table>

在表t中初始化插入了两行记录， 按照定义的分区规则， 这两行记录分别落在p\_2018和p\_2019这两个分区上。可以看到， 这个表包含了一个.frm文件和4个.ibd文件， 每个分区对应一个.ibd文件。 也就是说：对于引擎层来说， 这是4个表；对于Server层来说， 这是1个表。

**分区策略**

• MyISAM分区表使用的分区策略， 我们称为通用分区策略（generic partitioning） ， 每次访问分区都由server层控制。 通用分区策略， 是MySQL一开始支持分区表的时候就存在的代码， 在文件管理、 表管理的实现上很粗糙， 因此有比较严重的性能问题。

• 从MySQL 5.7.9开始， InnoDB引擎引入了本地分区策略（native partitioning） 。 这个策略是在InnoDB内部自己管理打开分区的行为。

• MySQL从5.7.17开始， 将MyISAM分区表标记为即将弃用(deprecated)， 意思是“从这个版本开始不建议这么使用， 请使用替代方案。 在将来的版本中会废弃这个功能”。

• 从MySQL 8.0版本开始， 就不允许创建MyISAM分区表了， 只允许创建已经实现了本地分区策略的引擎。 目前来看， 只有InnoDB和NDB这两个引擎支持了本地分区策略。

**分区表的server层行为**

如果从server层看的话， 一个分区表就只是一个表。

<img src="https://pic3.zhimg.com/v2-62f1c5f791fa40af51a63f518df75daa\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="186" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic3.zhimg.com/v2-62f1c5f791fa40af51a63f518df75daa\_r.jpg"/>

![](https://pic3.zhimg.com/v2-62f1c5f791fa40af51a63f518df75daa_r.jpg)

<img src="https://pic2.zhimg.com/v2-a11c4be4a883796c662d150664a3af5d\_b.jpg" data-caption="" data-size="normal" data-rawwidth="863" data-rawheight="108" class="origin\_image zh-lightbox-thumb" width="863" data-original="https://pic2.zhimg.com/v2-a11c4be4a883796c662d150664a3af5d\_r.jpg"/>

![](https://pic2.zhimg.com/v2-a11c4be4a883796c662d150664a3af5d_r.jpg)

可以看到， 虽然session B只需要操作p\_2107这个分区， 但是由于session A持有整个表t的MDL锁， 就导致了session B的alter语句被堵住。

1\. MySQL在第一次打开分区表的时候， 需要访问所有的分区；  
2\. 在server层， 认为这是同一张表， 因此所有分区共用同一个MDL锁；  
3\. 在引擎层， 认为这是不同的表， 因此MDL锁之后的执行过程， 会根据分区表规则，只访问必要的分区。

有两个问题需要注意：1. 分区并不是越细越好。 实际上， 单表或者单分区的数据一千万行， 只要没有特别大的索引，对于现在的硬件能力来说都已经是小表了。2. 分区也不要提前预留太多， 在使用之前预先创建即可。 比如， 如果是按月分区， 每年年底时再把下一年度的12个新分区创建上即可。 对于没有数据的历史分区， 要及时的drop掉。

至于分区表的其他问题， 比如查询需要跨多个分区取数据， 查询性能就会比较慢， 基本上就不是分区表本身的问题， 而是数据量的问题或者说是使用方式的问题了。

**44 | 答疑文章（三）** **：** **说一说这些好问题**
-----------------------------------

**45 | 自增id用完怎么办？**
-------------------

MySQL里面的几种自增id， 一起分析一下它们的值达到上限以后，会出现什么情况。2 -1（4294967295） 不是一个特别大的数， 对于一个频繁插入删除数据的表来说， 是可能会被用完的。 因此在建表的时候你需要考察你的表是否有可能达到这个上限， 如果有可能， 就应该创建成8个字节的bigint unsigned。

**InnoDB系统自增row\_id**

如果你创建的InnoDB表没有指定主键， 那么InnoDB会给你创建一个不可见的， 长度为6个字节的row\_id。 InnoDB维护了一个全局的dict\_sys.row\_id值， 所有无主键的InnoDB表， 每插入一行数据， 都将当前的dict\_sys.row\_id值作为要插入数据的row\_id， 然后把dict\_sys.row\_id的值加1。

每种自增id有各自的应用场景， 在达到上限后的表现也不同：  
1\. 表的自增id达到上限后， 再申请时它的值就不会改变， 进而导致继续插入数据时报主键冲突的错误。  
2\. row\_id达到上限后， 则会归0再重新递增， 如果出现相同的row\_id， 后写的数据会覆盖之前的数据。  
3\. Xid只需要不在同一个binlog文件中出现重复值即可。 虽然理论上会出现重复值， 但是概率极小， 可以忽略不计。  
4\. InnoDB的max\_trx\_id 递增值每次MySQL重启都会被保存起来， 所以我们文章中提到的脏读的例子就是一个必现的bug， 好在留给我们的时间还很充裕。  
5\. thread\_id是我们使用中最常见的， 而且也是处理得最好的一个自增id逻辑了。

本文转自 <https://zhuanlan.zhihu.com/p/658288649>，如有侵权，请联系删除。
