+++
author = "hqqich"
title = "mysql存储过程"
date = "2025-03-05"
description = "Guide to emoji usage in Hugo"
tags = [
    "sql",
]
+++

## 3.1、MYSQL 存储过程中的关键语法
```sql
# 将语句的结束符号从分号;临时改为两个$$(可以是自定义)，其中，使用命令delimiter ; 将语句的结束符号恢复为分号。
# 1、声明语句结束符，可以自定义:
DELIMITER $$ 
或
DELIMITER //
# 2、声明存储过程:
CREATE PROCEDURE demo_in_parameter(IN p_in int)     
   
# 3、存储过程开始和结束符号:   
BEGIN .... END
# 4、变量赋值:
SET @p_in=1
# 5、变量定义:
DECLARE l_int int unsigned default 0; 
# 6、创建mysql存储过程、存储函数:
create procedure 存储过程名(参数)
# 7、存储过程体:
create function 存储函数名(参数)
```

## 3.2、存储过程的案例
　　
>解析：默认情况下，存储过程和默认数据库相关联，如果想指定存储过程创建在某个特定的数据库下，那么在过程名前面加数据库名做前缀。 在定义过程时，使用 DELIMITER 命令将语句的结束符号从分号;临时改为两个 ，使得过程体中使用的分号被直接传递到服务器，而不会被客户端（如mysql）解释。


```shell
1 mysql> delimiter $$　　# 将语句的结束符号从分号;临时改为两个$$(可以是自定义)。
2 mysql> CREATE PROCEDURE delete_matches(IN p_playerno INTEGER)
3     -> BEGIN
4     -> 　　DELETE FROM MATCHES
5     ->     WHERE playerno = p_playerno;
6     -> END$$
7 Query OK, 0 rows affected (0.01 sec)
8  
9 mysql> delimiter;　　# 将语句的结束符号恢复为分号。
```

## 3.3、调用存储过程：

> 解析：在存储过程中设置了需要传参的变量p_playerno，调用存储过程的时候，通过传参将57赋值给p_playerno，然后进行存储过程里的SQL操作。

```shell
1 call sp_name[(传参)];
```

##### 调用存储过程的案例，如下所示：

```shell
 1 mysql> select * from MATCHES;
 2 +---------+--------+----------+-----+------+
 3 | MATCHNO | TEAMNO | PLAYERNO | WON | LOST |
 4 +---------+--------+----------+-----+------+
 5 |       1 |      1 |        6 |   3 |    1 |
 6 |       7 |      1 |       57 |   3 |    0 |
 7 |       8 |      1 |        8 |   0 |    3 |
 8 |       9 |      2 |       27 |   3 |    2 |
 9 |      11 |      2 |      112 |   2 |    3 |
10 +---------+--------+----------+-----+------+
11 5 rows in set (0.00 sec)
12  
13 mysql> call delete_matches(57);
14 Query OK, 1 row affected (0.03 sec)
15  
16 mysql> select * from MATCHES;
17 +---------+--------+----------+-----+------+
18 | MATCHNO | TEAMNO | PLAYERNO | WON | LOST |
19 +---------+--------+----------+-----+------+
20 |       1 |      1 |        6 |   3 |    1 |
21 |       8 |      1 |        8 |   0 |    3 |
22 |       9 |      2 |       27 |   3 |    2 |
23 |      11 |      2 |      112 |   2 |    3 |
24 +---------+--------+----------+-----+------+
25 4 rows in set (0.00 sec)
```


## 3.4、存储过程体
　　存储过程体包含了在过程调用时必须执行的语句，例如：dml、ddl语句，if-then-else和while-do语句、声明变量的declare语句等。
　　过程体格式：以begin开始，以end结束(可嵌套)。

```sql
BEGIN
　　BEGIN
　　　　BEGIN
　　　　　　statements; 
　　　　END
　　END
END
```
> 注意：每个嵌套块及其中的每条语句，必须以分号结束，表示过程体结束的begin-end块(又叫做复合语句compound statement)，则不需要分号。
## 3.5、为语句块贴标签：

**标签有两个作用：**
- 1）、增强代码的可读性。

- 2）、在某些语句(例如:leave和iterate语句)，需要用到标签。

```sql
[begin_label:] BEGIN
　　[statement_list]
END [end_label]
```

例如：

```sql
label1: BEGIN
　　label2: BEGIN
　　　　label3: BEGIN
　　　　　　statements; 
　　　　END label3 ;
　　END label2;
END label1
```

# 4、存储过程的参数

MySQL存储过程的参数用在存储过程的定义，共有三种参数类型，IN、OUT、INOUT，形式如：

```sql
CREATE PROCEDURE 存储过程名([[IN |OUT |INOUT ] 参数名 数据类形...])
```

如果过程没有参数，也必须在过程名后面写上小括号例：

```sql
CREATE PROCEDURE sp_name ([proc_parameter[,...]]) ……
```

确保参数的名字不等于列的名字，否则在过程体中，参数名被当做列名来处理。

## 4.1、IN输入参数

> IN 输入参数：表示调用者向过程传入值（传入值可以是字面量或变量），默认是IN输入参数，如果不填写，就是默认的IN输入参数。

```shell
# 以下可以看出，p_in 在存储过程中被修改，但并不影响 @p_in 的值，因为前者为局部变量、后者为全局变量。
mysql> delimiter $$
mysql> create procedure in_param(in p_in int)
    -> begin
    -> 　　select p_in;
    -> 　　set p_in=2;
    ->    select P_in;
    -> end$$
mysql> delimiter ;
 
mysql> set @p_in=1;
 
mysql> call in_param(@p_in);
+------+
| p_in |
+------+
|    1 |
+------+
 
+------+
| P_in |
+------+
|    2 |
+------+
 
mysql> select @p_in;
+-------+
| @p_in |
+-------+
|     1 |
+-------+
```


## 4.2、OUT输出参数

> OUT 输出参数：表示过程向调用者传出值(可以返回多个值)（传出值只能是变量）。

```shell
mysql> delimiter //
mysql> create procedure out_param(out p_out int)
    ->   begin
    ->     select p_out;
    ->     set p_out=2;
    ->     select p_out;
    ->   end
    -> //
mysql> delimiter ;
 
mysql> set @p_out=1;
 
mysql> call out_param(@p_out);
+-------+
| p_out |
+-------+
|  NULL |
+-------+
　　#因为out是向调用者输出参数，不接收输入的参数，所以存储过程里的p_out为null
+-------+
| p_out |
+-------+
|     2 |
+-------+
 
mysql> select @p_out;
+--------+
| @p_out |
+--------+
|      2 |
+--------+

#调用了out_param存储过程，输出参数，改变了p_out变量的值
```

## 4.3、INOUT 输入输出参数

> INOUT 输入输出参数：既表示调用者向过程传入值，又表示过程向调用者传出值（值只能是变量）。

```shell
mysql> delimiter $$
mysql> create procedure inout_param(inout p_inout int)
    ->   begin
    ->     select p_inout;
    ->     set p_inout=2;
    ->     select p_inout;
    ->   end
    -> $$
mysql> delimiter ;
 
mysql> set @p_inout=1;
 
mysql> call inout_param(@p_inout);
+---------+
| p_inout |
+---------+
|       1 |
+---------+
 
+---------+
| p_inout |
+---------+
|       2 |
+---------+
 
mysql> select @p_inout;
+----------+
| @p_inout |
+----------+
|        2 |
+----------+
#调用了inout_param存储过程，接受了输入的参数，也输出参数，改变了变量
```
 

# 5、存储过程声明变量

- 1）、用户变量名一般以@开头。

- 2）、滥用用户变量会导致程序难以理解及管理。

##  5.1、变量定义

> 局部变量声明一定要放在存储过程体的开始：

```sql
DECLARE variable_name [,variable_name...] datatype [DEFAULT value];
```

其中，datatype 为 MySQL 的数据类型，如: int, float, date,varchar(length)，例如：

```sql
DECLARE l_int int unsigned default 4000000;  
DECLARE l_numeric number(8,2) DEFAULT 9.95;  
DECLARE l_date date DEFAULT '1999-12-31';  
DECLARE l_datetime datetime DEFAULT '1999-12-31 23:59:59';  
DECLARE l_varchar varchar(255) DEFAULT 'This will not be padded';
```

##  5.2、变量赋值

```sql
SET 变量名 = 表达式值 [,variable_name = expression ...]
```


## 5.3、用户变量

在MySQL客户端使用用户变量：

```shell
mysql > SELECT 'Hello World' into @x;  
mysql > SELECT @x;  
+-------------+  
|   @x        |  
+-------------+  
| Hello World |  
+-------------+  
mysql > SET @y='Goodbye Cruel World';  
mysql > SELECT @y;  
+---------------------+  
|     @y              |  
+---------------------+  
| Goodbye Cruel World |  
+---------------------+  
 
mysql > SET @z=1+2+3;  
mysql > SELECT @z;  
+------+  
| @z   |  
+------+  
|  6   |  
+------+
```

在存储过程中使用用户变量：

```shell
mysql > CREATE PROCEDURE GreetWorld( ) SELECT CONCAT(@greeting,' World');  
mysql > SET @greeting='Hello';  
mysql > CALL GreetWorld( );  
+----------------------------+  
| CONCAT(@greeting,' World') |  
+----------------------------+  
|  Hello World               |  
+----------------------------+
```

在存储过程间传递全局范围的用户变量：

```shell
mysql> CREATE PROCEDURE p1()   SET @last_procedure='p1';  
mysql> CREATE PROCEDURE p2() SELECT CONCAT('Last procedure was ',@last_procedure);  
mysql> CALL p1( );  
mysql> CALL p2( );  
+-----------------------------------------------+  
| CONCAT('Last procedure was ',@last_proc       |  
+-----------------------------------------------+  
| Last procedure was p1                         |  
 +-----------------------------------------------+
```

 


# 6、存储过程的注释
　　
> MySQL 存储过程可使用两种风格的注释。
> 　　
> 两个横杆--：该风格一般用于单行注释。
> 
> c 风格： 一般用于多行注释。

```shell
mysql > DELIMITER //  
mysql > CREATE PROCEDURE proc1 -- name存储过程名  
     -> (IN parameter1 INTEGER)   
     -> BEGIN   
     -> DECLARE variable1 CHAR(10);   
     -> IF parameter1 = 17 THEN   
     -> SET variable1 = 'birds';   -- 使用SET进行变量赋值，知识点很重要。
     -> ELSE 
     -> SET variable1 = 'beasts';   
    -> END IF;   
    -> INSERT INTO table1 VALUES (variable1);  
    -> END   
    -> //  
mysql > DELIMITER ;
```
 


# 7、存储过程的查询、修改、删除、调用控制
## 7.1、MySQL存储过程的调用

用call和你过程名以及一个括号，括号里面根据需要，加入参数，参数包括输入参数、输出参数、输入输出参数。具体的调用方法可以参看上面的例子。
## 7.2、MySQL存储过程的查询

我们像知道一个数据库下面有那些表，我们一般采用 show tables; 进行查看。那么我们要查看某个数据库下面的存储过程，是否也可以采用呢？答案是，我们可以查看某个数据库下面的存储过程，但是是另一钟方式。 

我们可以用以下语句进行查询：

```sql
select name from mysql.proc where db='数据库名';
或者
select routine_name from information_schema.routines where routine_schema='数据库名';
或者
show procedure status where db='数据库名';
```

如果我们想知道，某个存储过程的详细，那我们又该怎么做呢？是不是也可以像操作表一样用describe 表名进行查看呢？

答案是：我们可以查看存储过程的详细，但是需要用另一种方法：`SHOW CREATE PROCEDURE 数据库.存储过程名;`就可以查看当前存储过程的详细。


## 7.3、MySQL存储过程的调用

```sql
ALTER PROCEDURE
```

更改用 `CREATE PROCEDURE` 建立的预先指定的存储过程，其不会影响相关存储过程或存储功能。


## 7.4、MySQL存储过程的调用

删除一个存储过程比较简单，和删除表一样：

```sql
DROP PROCEDURE
```

从 MySQL 的表格中删除一个或多个存储过程。


 
# 8、MySQL存储过程的控制语句
## 8.1、变量作用域

内部的变量在其作用域范围内享有更高的优先权，当执行到 end。变量时，内部变量消失，此时已经在其作用域外，变量不再可见了，应为在存储过程外再也不能找到这个申明的变量，但是你可以通过 out 参数或者将其值指派给会话变量来保存其值。

```shell
mysql > DELIMITER //  
mysql > CREATE PROCEDURE proc3()  
     -> begin 
     -> declare x1 varchar(5) default 'outer';  
     -> begin 
     -> declare x1 varchar(5) default 'inner';  
      -> select x1;  
      -> end;  
       -> select x1;  
     -> end;  
     -> //  
mysql > DELIMITER ;
```

## 8.2、条件语句，if-then-else 语句

```shell
mysql > DELIMITER //  
mysql > CREATE PROCEDURE proc2(IN parameter int)  
     -> begin 
     -> declare var int;  
     -> set var=parameter+1;  
     -> if var=0 then 
     -> insert into t values(17);  
     -> end if;  
     -> if parameter=0 then 
     -> update t set s1=s1+1;  
     -> else 
     -> update t set s1=s1+2;  
     -> end if;  
     -> end;  
     -> //  
mysql > DELIMITER ;
```

## 8.3、条件语句，case语句：

使用的语法，如下所示：
```sql
case
    when var=0 then
        insert into t values(30);
    when var>0 then
    when var<0 then
    else
end case
```

使用的案例，如下所示：

```shell
mysql > DELIMITER //  
mysql > CREATE PROCEDURE proc3 (in parameter int)  
     -> begin 
     -> declare var int;  
     -> set var=parameter+1;  
     -> case var  
     -> when 0 then   
     -> insert into t values(17);  
     -> when 1 then   
     -> insert into t values(18);  
     -> else   
     -> insert into t values(19);  
     -> end case;  
     -> end;  
     -> //  
mysql > DELIMITER ;
```

## 8.4、循环语句while ···· end while

使用的语法，如下所示：

```sql
while 条件 do
    --循环体
end while
```

使用的案例，如下所示：
```shell
mysql > DELIMITER //  
mysql > CREATE PROCEDURE proc4()  
     -> begin 
     -> declare var int;  
     -> set var=0;  
     -> while var<6 do  
     -> insert into t values(var);  
     -> set var=var+1;  
     -> end while;  
     -> end;  
     -> //  
mysql > DELIMITER ;
```

## 8.5、循环语句repeat···· end repeat

它在执行操作后检查结果，而 while 则是执行前进行检查。

使用的语法，如下所示：

```sql
repeat
    --循环体
until 循环条件  
end repeat;
```

使用的案例，如下所示：

```shell
mysql > DELIMITER //  
mysql > CREATE PROCEDURE proc5 ()  
     -> begin   
     -> declare v int;  
     -> set v=0;  
     -> repeat  
     -> insert into t values(v);  
     -> set v=v+1;  
     -> until v>=5  
     -> end repeat;  
     -> end;  
     -> //  
mysql > DELIMITER ;
```

## 8.6、循环语句loop ·····endloop

loop 循环不需要初始条件，这点和 while 循环相似，同时和 repeat 循环一样不需要结束条件, leave 语句的意义是离开循环。

```shell
mysql > DELIMITER //  
mysql > CREATE PROCEDURE proc6 ()  
     -> begin 
     -> declare v int;  
     -> set v=0;  
     -> LOOP_LABLE:loop  
     -> insert into t values(v);  
     -> set v=v+1;  
     -> if v >=5 then 
     -> leave LOOP_LABLE;  
     -> end if;  
     -> end loop;  
     -> end;  
     -> //  
mysql > DELIMITER ;
```

## 8.7、循环语句LABLES 标号：

标号可以用在 begin repeat while 或者 loop 语句前，语句标号只能在合法的语句前面使用。可以跳出循环，使运行指令达到复合语句的最后一步。

ITERATE 通过引用复合语句的标号,来从新开始复合语句:

```shell
mysql > DELIMITER //  
mysql > CREATE PROCEDURE proc10 ()  
     -> begin 
     -> declare v int;  
     -> set v=0;  
     -> LOOP_LABLE:loop  
     -> if v=3 then   
     -> set v=v+1;  
     -> ITERATE LOOP_LABLE;  
     -> end if;  
     -> insert into t values(v);  
     -> set v=v+1;  
     -> if v>=5 then 
     -> leave LOOP_LABLE;  
     -> end if;  
     -> end loop;  
     -> end;  
     -> //  
mysql > DELIMITER ;
```
