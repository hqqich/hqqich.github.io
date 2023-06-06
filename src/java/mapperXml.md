# mapper.xml中的常用标签

>  mybatis的mapper xml文件中的常用标签 [https://blog.csdn.net/qq_41426442/article/details/79663467](https://blog.csdn.net/qq_41426442/article/details/79663467) 

### SQL语句标签 

### 1、查询语句

```xml
<select id="selectByPrimaryKey"  resultMap="BaseResultMap" parameterType="java.lang.String" >
   selec...   
 </select> 
```

### 2、插入语句

```xml
<insert id="insert" parameterType="pojo.OrderTable" >
insert into ordertable(...)
values(...)
</insert> 
```

### 3、删除语句

```xml
<delete id="deleteByPrimaryKey" parameterType="java.lang.String" >
    delete from ordertable  
    where order_id = #{orderId,jdbcType=VARCHAR}  
</delete>  
```

### 4、修改语句

```xml
<update id="updateByPrimaryKey" parameterType="pojo.OrderTable" >  
   update ordertable 
   set cid = #{cid,jdbcType=VARCHAR},  
   address = #{address,jdbcType=VARCHAR},  
   create_date = #{createDate,jdbcType=TIMESTAMP},  
   orderitem_id = #{orderitemId,jdbcType=VARCHAR}  
   where order_id = #{orderId,jdbcType=VARCHAR}  
</update> 
```

### 需要配置的属性

1. `id="xxxx"`   表示此段SQL执行语句的唯一标识，也是接口的方法名称【必须一致才能找到】
2. `parameterType="xxxx"`   表示SQL语句中需要传入的参数，类型要与对应的接口方法的类型一致
3. `resultMap="xxx"`   定义出参，调用已定义的映射管理器的id的值
4. `resultType="xxxx"`   定义出参，匹配普通Java类型或自定义的pojo    【出参类型若不指定，将为语句类型默认类型，如语句返回值为int】

### 注意

> 为什么insert、delete、update语句的返回值类型是int？

有JDBC操作经验的朋友可能会有印象，增删改操作实际上返回的是操作的条数。而Mybatis框架本身是基于JDBC的，所以此处也沿袭这种返回值类型。

### 传参和取值

> mapper.xml 的灵活性还体现在SQL执行语句可以传参，参数类型通过parameterType= "" 定义

★取值方式1：#{value jdbcType = valuetype}：jdbcType 表示该属性的数据类型在数据库中对应的类型，如 #{user jdbcType=varchar} 等价于 String username；

★取值方式2：${value } : 这种方式不建议大量使用，可能会发送sql注入而导致安全性问题。一般该取值方式可用在非经常变化的值上，如orderby ${columnName}；

## SQL片段标签

#### 优点：通过该标签可定义能复用的sql语句片段，在执行sql语句标签中直接引用即可。这样既可以提高编码效率，还能有效简化代码，提高可读性

1. 需要配置的属性：id="" 表示需要改sql语句片段的唯一标识

2. 引用：通过标签引用，refid="" 中的值指向需要引用的中的id=""属性