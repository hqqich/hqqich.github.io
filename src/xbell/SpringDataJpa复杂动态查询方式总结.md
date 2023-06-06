



一.Spring data jpa 简介
首先我并不推荐使用jpa作为ORM框架,毕竟对于负责查询的时候还是不太灵活,还是建议使用mybatis,自己写sql比较好.但是如果公司用这个就没办法了,可以学习一下,对于简单查询还是非常好用的.

    首先JPA是Java持久层API,由Sun公司开发, 希望整合ORM技术，实现天下归一.  诞生的缘由是为了整合第三方ORM框架，建立一种标准的方式，目前也是在按照这个方向发展，但是还没能完全实现。在ORM框架中，Hibernate是一支很大的部队，使用很广泛，也很方便，能力也很强，同时Hibernate也是和JPA整合的比较良好，我们可以认为JPA是标准，事实上也是，JPA几乎都是接口，实现都是Hibernate在做，宏观上面看，在JPA的统一之下Hibernate很良好的运行。
    
    Spring-data-jpa，Spring与jpa的整合
    
    Spring主要是在做第三方工具的整合 不重新造轮子. 而在与第三方整合这方面，Spring做了持久化这一块的工作，于是就有了Spring-data-**这一系列包。包括，Spring-data-jpa,Spring-data-template,Spring-data-mongodb,Spring-data-redis
    
    Spring-data-jpa，目的少使用sql
    
    我们都知道，在使用持久化工具的时候，一般都有一个对象来操作数据库，在原生的Hibernate中叫做Session，在JPA中叫做EntityManager，在MyBatis中叫做SqlSession，通过这个对象来操作数据库。我们一般按照三层结构来看的话，Service层做业务逻辑处理，Dao层和数据库打交道，在Dao中，就存在着上面的对象。那么ORM框架本身提供的功能有什么呢？答案是基本的CRUD(增删改查)，所有的基础CRUD框架都提供，我们使用起来感觉很方便，很给力，业务逻辑层面的处理ORM是没有提供的，如果使用原生的框架，业务逻辑代码我们一般会自定义，会自己去写SQL语句，然后执行。在这个时候，Spring-data-jpa的威力就体现出来了，ORM提供的能力他都提供，ORM框架没有提供的业务逻辑功能Spring-data-jpa也提供，全方位的解决用户的需求。使用Spring-data-jpa进行开发的过程中，常用的功能，我们几乎不需要写一条sql语句，至少在我看来，企业级应用基本上可以不用写任何一条sql，当然spring-data-jpa也提供自己写sql的方式
    
     返回值为对象的意义
    
    是jpa查询表内容返回值基本上都是对象,但是仅仅需要一个字段返回整体对象不是会有很多数据冗余吗,其实大多数情况对一个数据表的查询不可能只有一次或者说这个表不仅仅是这一次会用到,如果我写好一个返回对象的方法,之后都可以直接调用,一般情况下多出一点数据对网络的压力可以忽略不计,而这样对开发效率的提升还是很大的.如果仅仅想得到一部分字段也可以新建一个只有想要字段的Entity.

 



二.Spring data jpa 基本使用
对于配置方法和基础的dao层写法等不做介绍,基础篇仅当做一个方法字典.

    1.核心方法

查询所有数据 findAll()
修改 添加数据  S save(S entity)
分页查询 Page<S> findAll(Example<S> example, Pageable pageable)
根据id查询 findOne()
根据实体类属性查询： findByProperty (type Property); 例如：findByAge(int age)
删除 void delete(T entity)
计数 查询 long count() 或者 根据某个属性的值查询总数 countByAge(int age)
是否存在   boolean existsById(ID primaryKey)


    2.查询关键字

-and

And 例如：findByUsernameAndPassword(String user, Striang pwd)；

-or
Or 例如：findByUsernameOrAddress(String user, String addr)；

-between
Between 例如：SalaryBetween(int max, int min)；

-"<"
LessThan 例如： findBySalaryLessThan(int max)；

-">"
GreaterThan 例如： findBySalaryGreaterThan(int min)；

-is null
IsNull 例如： findByUsernameIsNull()；

-is not null
IsNotNull NotNull 与 IsNotNull 等价 例如： findByUsernameIsNotNull()；

-like
Like 例如： findByUsernameLike(String user)；

-not like
NotLike 例如： findByUsernameNotLike(String user)；

-order by
OrderBy 例如： findByUsernameOrderByNameAsc(String user)；直接通过name正序排序

-"!="
Not 例如： findByUsernameNot(String user)；

-in
In 例如： findByUsernameIn(Collection<String> userList) ，方法的参数可以是 Collection 类型，也可以是数组或者不定长参数；

-not in
NotIn 例如： findByUsernameNotIn(Collection<String> userList) ，方法的参数可以是 Collection 类型，也可以是数组或者不定长参数；

-Top/Limit
查询方法结果的数量可以通过关键字来限制，first 或者 top都可以使用。top/first加数字可以指定要返回最大结果的大小 默认为1

     例如:

User findFirstByOrderByLastnameAsc();
User findTopByOrderByAgeDesc();
Page<User> queryFirst10ByLastname(String lastname, Pageable pageable);
Slice<User> findTop3ByLastname(String lastname, Pageable pageable);
List<User> findFirst10ByLastname(String lastname, Sort sort);
List<User> findTop10ByLastname(String lastname, Pageable pageable);
详细查询语法
关键词	示例	对应的sql片段
And

findByLastnameAndFirstname

… where x.lastname = ?1 and x.firstname = ?2

Or

findByLastnameOrFirstname

… where x.lastname = ?1 or x.firstname = ?2

Is,Equals

findByFirstname,findByFirstnameIs,findByFirstnameEquals

… where x.firstname = ?1

Between

findByStartDateBetween

… where x.startDate between ?1 and ?2

LessThan

findByAgeLessThan

… where x.age < ?1

LessThanEqual

findByAgeLessThanEqual

… where x.age <= ?1

GreaterThan

findByAgeGreaterThan

… where x.age > ?1

GreaterThanEqual

findByAgeGreaterThanEqual

… where x.age >= ?1

After

findByStartDateAfter

… where x.startDate > ?1

Before

findByStartDateBefore

… where x.startDate < ?1

IsNull

findByAgeIsNull

… where x.age is null

IsNotNull,NotNull

findByAge(Is)NotNull

… where x.age not null

Like

findByFirstnameLike

… where x.firstname like ?1

NotLike

findByFirstnameNotLike

… where x.firstname not like ?1

StartingWith

findByFirstnameStartingWith

… where x.firstname like ?1 (parameter bound with appended %)

EndingWith

findByFirstnameEndingWith

… where x.firstname like ?1 (parameter bound with prepended %)

Containing

findByFirstnameContaining

… where x.firstname like ?1 (parameter bound wrapped in %)

OrderBy

findByAgeOrderByLastnameDesc

… where x.age = ?1 order by x.lastname desc

Not

findByLastnameNot

… where x.lastname <> ?1

In

findByAgeIn(Collection<Age> ages)

… where x.age in ?1

NotIn

findByAgeNotIn(Collection<Age> ages)

… where x.age not in ?1

True

findByActiveTrue()

… where x.active = true

False

findByActiveFalse()

… where x.active = false

IgnoreCase

findByFirstnameIgnoreCase

… where UPPER(x.firstame) = UPPER(?1)

 

    3.内置方法

Sort_排序
Sort sort =new Sort(Sort.Direction.ASC,"id");
//其中第一个参数表示是降序还是升序（此处表示升序）
//第二个参数表示你要按你的 entity（记住是entity中声明的变量，不是数据库中表对应的字段）中的那个变量进行排序
PageRequest_分页
PageRequest pageRequest = new PageRequest(index, num, sort);
//index偏移量 num查询数量 sort排序
    分页+排序实现:

DemoBean demoBean = new DemoBean();
demoBean.setAppId(appId); //查询条件
//创建查询参数
Example<DemoBean> example = Example.of(demoBean);
//获取排序对象
Sort sort = new Sort(Sort.Direction.DESC, "id");
//创建分页对象
PageRequest pageRequest = new PageRequest(index, num, sort);
//分页查询
return demoRepository.findAll(example, pageRequest).getContent();
Example_实例查询
    创建一个ExampleMatcher对象，最后再用Example的of方法构造相应的Example对象并传递给相关查询方法。我们看看Spring的例子。

Person person = new Person();                          
person.setFirstname("Dave");  //Firstname = 'Dave'                          

ExampleMatcher matcher = ExampleMatcher.matching()                     
                        .withMatcher("name", GenericPropertyMatchers.startsWith()) //姓名采用“开始匹配”的方式查询
                      .withIgnorePaths("int");  //忽略属性：是否关注。因为是基本类型，需要忽略掉

Example<Person> example = Example.of(person, matcher);  //Example根据域对象和配置创建一个新的ExampleMatcher  
    ExampleMatcher用于创建一个查询对象，上面的代码就创建了一个查询对象。withIgnorePaths方法用来排除某个属性的查询。withIncludeNullValues方法让空值也参与查询，就是我们设置了对象的姓，而名为空值.

 

1、概念定义:

    上面例子中，是这样创建“实例”的：Example<Customer> ex = Example.of(customer, matcher);我们看到，Example对象，由customer和matcher共同创建。
    
    A、实体对象：在持久化框架中与Table对应的域对象，一个对象代表数据库表中的一条记录，如上例中Customer对象。在构建查询条件时，一个实体对象代表的是查询条件中的“数值”部分。如：要查询名字是“Dave”的客户，实体对象只能存储条件值“Dave”。
    
    B、匹配器：ExampleMatcher对象，它是匹配“实体对象”的，表示了如何使用“实体对象”中的“值”进行查询，它代表的是“查询方式”，解释了如何去查的问题。如：要查询FirstName是“Dave”的客户,即名以“Dave"开头的客户，该对象就表示了“以什么开头的”这个查询方式，如上例中:withMatcher("name", GenericPropertyMatchers.startsWith())
    
    C、实例：即Example对象，代表的是完整的查询条件。由实体对象（查询条件值）和匹配器（查询方式）共同创建。
    
    再来理解“实例查询”，顾名思义，就是通过一个例子来查询。要查询的是Customer对象，查询条件也是一个Customer对象，通过一个现有的客户对象作为例子，查询和这个例子相匹配的对象。

 



2、特点及约束（局限性）:

    A、支持动态查询。即支持查询条件个数不固定的情况，如：客户列表中有多个过滤条件，用户使用时在“地址”查询框中输入了值，就需要按地址进行过滤，如果没有输入值，就忽略这个过滤条件。对应的实现是，在构建查询条件Customer对象时，将address属性值置具体的条件值或置为null。
    
    B、不支持过滤条件分组。即不支持过滤条件用 or(或) 来连接，所有的过滤查件，都是简单一层的用 and(并且) 连接。
    
    C、仅支持字符串的开始/包含/结束/正则表达式匹配 和 其他属性类型的精确匹配。查询时，对一个要进行匹配的属性（如：姓名 name），只能传入一个过滤条件值，如以Customer为例，要查询姓“刘”的客户，“刘”这个条件值就存储在表示条件对象的Customer对象的name属性中，针对于“姓名”的过滤也只有这么一个存储过滤值的位置，没办法同时传入两个过滤值。正是由于这个限制，有些查询是没办法支持的，例如要查询某个时间段内添加的客户，对应的属性是 addTime，需要传入“开始时间”和“结束时间”两个条件值，而这种查询方式没有存两个值的位置，所以就没办法完成这样的查询。

 



3、ExampleMatcher的使用 :

一些问题:
（1）Null值的处理。当某个条件值为Null,是应当忽略这个过滤条件呢，还是应当去匹配数据库表中该字段值是Null的记录？
（2）基本类型的处理。如客户Customer对象中的年龄age是int型的，当页面不传入条件值时，它默认是0，是有值的，那是否参与查询呢？
（3）忽略某些属性值。一个实体对象，有许多个属性，是否每个属性都参与过滤？是否可以忽略某些属性？
（4）不同的过滤方式。同样是作为String值，可能“姓名”希望精确匹配，“地址”希望模糊匹配，如何做到？

（5）大小写匹配。字符串匹配时，有时可能希望忽略大小写，有时则不忽略，如何做到？

一些方法:
1、关于基本数据类型。
实体对象中，避免使用基本数据类型，采用包装器类型。如果已经采用了基本类型，

而这个属性查询时不需要进行过滤，则把它添加到忽略列表（ignoredPaths）中。

2、Null值处理方式。

默认值是 IGNORE（忽略），即当条件值为null时，则忽略此过滤条件，一般业务也是采用这种方式就可满足。当需要查询数据库表中属性为null的记录时，可将值设为INCLUDE，这时，对于不需要参与查询的属性，都必须添加到忽略列表（ignoredPaths）中，否则会出现查不到数据的情况。

3、默认配置、特殊配置。

默认创建匹配器时，字符串采用的是精确匹配、不忽略大小写，可以通过操作方法改变这种默认匹配，以满足大多数查询条件的需要，如将“字符串匹配方式”改为CONTAINING（包含，模糊匹配），这是比较常用的情况。对于个别属性需要特定的查询方式，可以通过配置“属性特定查询方式”来满足要求。

4、非字符串属性

如约束中所谈，非字符串属性均采用精确匹配，即等于。

5、忽略大小写的问题。

忽略大小的生效与否，是依赖于数据库的。例如 MySql 数据库中，默认创建表结构时，字段是已经忽略大小写的，所以这个配置与否，都是忽略的。如果业务需要严格区分大小写，可以改变数据库表结构属性来实现，具体可百度。

一些例子:
综合使用:

//创建查询条件数据对象
        Customer customer = new Customer();
        customer.setName("zhang");
        customer.setAddress("河南省");
        customer.setRemark("BB");

        //创建匹配器，即如何使用查询条件
        ExampleMatcher matcher = ExampleMatcher.matching() //构建对象
                .withStringMatcher(StringMatcher.CONTAINING) //改变默认字符串匹配方式：模糊查询
                .withIgnoreCase(true) //改变默认大小写忽略方式：忽略大小写
                .withMatcher("address", GenericPropertyMatchers.startsWith()) //地址采用“开始匹配”的方式查询
                .withIgnorePaths("focus");  //忽略属性：是否关注。因为是基本类型，需要忽略掉
        
        //创建实例
        Example<Customer> ex = Example.of(customer, matcher); 
        
        //查询
        List<Customer> ls = dao.findAll(ex);
查询null值:

　　　　 //创建查询条件数据对象
        Customer customer = new Customer();

        //创建匹配器，即如何使用查询条件
        ExampleMatcher matcher = ExampleMatcher.matching() //构建对象
                .withIncludeNullValues() //改变“Null值处理方式”：包括
                .withIgnorePaths("id","name","sex","age","focus","addTime","remark","customerType");  //忽略其他属性
        
        //创建实例
        Example<Customer> ex = Example.of(customer, matcher); 
        
        //查询
        List<Customer> ls = dao.findAll(ex);


三.Spring data jpa 注解
1.Repository注解

@Modifying //做update操作时需要添加

@Query // 自定义Sql

@Query(value = "SELECT * FROM USERS WHERE X = ?1", nativeQuery = true)
  User findByEmailAddress(String X);
@Query("select u from User u where u.firstname = :firstname") //不加nativeQuery应使用HQL
  User findByLastnameOrFirstname(@Param("lastname") String lastname);
@Transactional //事务

@Async //异步操作

 

2.Entity注解

@Entity //不写@Table默认为user
@Table(name="t_user") //自定义表名
public class user {

    @Id //主键
    @GeneratedValue(strategy = GenerationType.AUTO)//采用数据库自增方式生成主键
    //JPA提供的四种标准用法为TABLE,SEQUENCE,IDENTITY,AUTO.
    //TABLE：使用一个特定的数据库表格来保存主键。
    //SEQUENCE：根据底层数据库的序列来生成主键，条件是数据库支持序列。
    //IDENTITY：主键由数据库自动生成（主要是自动增长型）
    //AUTO：主键由程序控制。
     
    @Transient //此字段不与数据库关联
    @Version//此字段加上乐观锁
    //字段为name，不允许为空，用户名唯一
    @Column(name = "name", unique = true, nullable = false)
    private String name;
     
    @Temporal(TemporalType.DATE)//生成yyyy-MM-dd类型的日期
    //出参时间格式化
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    //入参时，请求报文只需要传入yyyymmddhhmmss字符串进来，则自动转换为Date类型数据
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm")
    private Date createTime;
     
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}


四.继承JpaSpecificationExecutor接口进行复杂查询
spring data jpa 通过创建方法名来做查询，只能做简单的查询，那如果我们要做复杂一些的查询呢，多条件分页怎么办，这里，spring data jpa为我们提供了JpaSpecificationExecutor接口，只要简单实现toPredicate方法就可以实现复杂的查询

参考:https://www.cnblogs.com/happyday56/p/4661839.html

1.首先让我们的接口继承于JpaSpecificationExecutor

public interface TaskDao extends JpaSpecificationExecutor<Task>{
}
2.JpaSpecificationExecutor提供了以下接口

public interface JpaSpecificationExecutor<T> {

    T findOne(Specification<T> spec);
     
    List<T> findAll(Specification<T> spec);
     
    Page<T> findAll(Specification<T> spec, Pageable pageable);
     
    List<T> findAll(Specification<T> spec, Sort sort);
     
    long count(Specification<T> spec);
}

//其中Specification就是需要我们传入查询方法的参数，它是一个接口


public interface Specification<T> {

    Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder cb);
}
提供唯一的一个方法toPredicate，我们只要按照JPA 2.0 criteria api写好查询条件就可以了，关于JPA 2.0 criteria api的介绍和使用，欢迎参考 
http://blog.csdn.net/dracotianlong/article/details/28445725 

http://developer.51cto.com/art/200911/162722.htm

3.接下来我们在service bean

@Service
public class TaskService {

    @Autowired TaskDao taskDao ;

 


    /**
     * 复杂查询测试
     * @param page
     * @param size
     * @return
     */
    public Page<Task> findBySepc(int page, int size){
     
        PageRequest pageReq = this.buildPageRequest(page, size);
        Page<Task> tasks = this.taskDao.findAll(new MySpec(), pageReq);
        //传入了new MySpec() 既下面定义的匿名内部类 其中定义了查询条件
        return tasks;
     
    }
     
     /**
      * 建立分页排序请求 
      * @param page
      * @param size
      * @return
      */
     private PageRequest buildPageRequest(int page, int size) {
           Sort sort = new Sort(Direction.DESC,"createTime");
           return new PageRequest(page,size, sort);
     }
     
    /**
     * 建立查询条件
     */
    private class MySpec implements Specification<Task>{
     
        @Override
        public Predicate toPredicate(Root<Task> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
     
     //1.混合条件查询
          Path<String> exp1 = root.get("taskName");
            Path<Date>  exp2 = root.get("createTime");
            Path<String> exp3 = root.get("taskDetail");
            Predicate predicate = cb.and(cb.like(exp1, "%taskName%"),cb.lessThan(exp2, new Date()));
            return cb.or(predicate,cb.equal(exp3, "kkk"));
     
           /* 类似的sql语句为:
            Hibernate: 
                select
                    count(task0_.id) as col_0_0_ 
                from
                    tb_task task0_ 
                where
                    (
                        task0_.task_name like ?
                    ) 
                    and task0_.create_time<? 
                    or task0_.task_detail=?
            */
     
    //2.多表查询
        Join<Task,Project> join = root.join("project", JoinType.INNER);
            Path<String> exp4 = join.get("projectName");
            return cb.like(exp4, "%projectName%");
     
           /* Hibernate: 
            select
                count(task0_.id) as col_0_0_ 
            from
                tb_task task0_ 
            inner join
                tb_project project1_ 
                    on task0_.project_id=project1_.id 
            where
                project1_.project_name like ?*/ 
           return null ;  
        }
    }
}
4.实体类task代码如下

@Entity
@Table(name = "tb_task")
public class Task {

    private Long id ;
    private String taskName ;
    private Date createTime ;
    private Project project;
    private String taskDetail ;
     
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
     
    @Column(name = "task_name")
    public String getTaskName() {
        return taskName;
    }
    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }
     
    @Column(name = "create_time")
    @DateTimeFormat(pattern = "yyyy-MM-dd hh:mm:ss")
    public Date getCreateTime() {
        return createTime;
    }
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

 


    @Column(name = "task_detail")
    public String getTaskDetail() {
        return taskDetail;
    }
    public void setTaskDetail(String taskDetail) {
        this.taskDetail = taskDetail;
    }
     
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    public Project getProject() {
        return project;
    }
    public void setProject(Project project) {
        this.project = project;
    }

}
通过重写toPredicate方法，返回一个查询 Predicate，spring data jpa会帮我们进行查询。


也许你觉得，每次都要写一个类来实现Specification很麻烦，那或许你可以这么写

public class TaskSpec {

    public static Specification<Task> method1(){
     
        return new Specification<Task>(){
            @Override
            public Predicate toPredicate(Root<Task> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                return null;
            }
     
        };
    }
     
    public static Specification<Task> method2(){
     
        return new Specification<Task>(){
            @Override
            public Predicate toPredicate(Root<Task> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                return null;
            }
     
        };
    }

}
那么用的时候，我们就这么用

Page<Task> tasks = this.taskDao.findAll(TaskSpec.method1(), pageReq);


五.Spring data jpa + QueryDSL 进行复杂查询
QueryDSL仅仅是一个通用的查询框架，专注于通过Java API构建类型安全的SQL查询。
Querydsl可以通过一组通用的查询API为用户构建出适合不同类型ORM框架或者是SQL的查询语句，也就是说QueryDSL是基于各种ORM框架以及SQL之上的一个通用的查询框架。
借助QueryDSL可以在任何支持的ORM框架或者SQL平台上以一种通用的API方式来构建查询。目前QueryDSL支持的平台包括JPA,JDO,SQL,Java Collections,RDF,Lucene,Hibernate Search。
P.s.配置可以根据官网介绍来配置

1 实体类

城市类:

@Entity
@Table(name = "t_city", schema = "test", catalog = "")
public class TCity {
    //省略JPA注解标识
    private int id;
    private String name;
    private String state;
    private String country;
    private String map;
}


旅馆类:

@Entity
@Table(name = "t_hotel", schema = "test", catalog = "")
public class THotel {
    //省略JPA注解标识
    private int id;
    private String name;
    private String address;
    private Integer city;//保存着城市的id主键
}
2 单表动态分页查询

Spring Data JPA中提供了QueryDslPredicateExecutor接口,用于支持QueryDSL的查询操作

public interface tCityRepository extends JpaRepository<TCity, Integer>, QueryDslPredicateExecutor<TCity> {
}
这样的话单表动态查询就可以参考如下代码:

//查找出Id小于3,并且名称带有`shanghai`的记录.

//动态条件
QTCity qtCity = QTCity.tCity; //SDL实体类
//该Predicate为querydsl下的类,支持嵌套组装复杂查询条件
Predicate predicate = qtCity.id.longValue().lt(3).and(qtCity.name.like("shanghai"));
//分页排序
Sort sort = new Sort(new Sort.Order(Sort.Direction.ASC,"id"));
PageRequest pageRequest = new PageRequest(0,10,sort);
//查找结果
Page<TCity> tCityPage = tCityRepository.findAll(predicate,pageRequest);
3 多表动态查询

QueryDSL对多表查询提供了一个很好地封装,看下面代码:

 /**
     * 关联查询示例,查询出城市和对应的旅店
     * @param predicate 查询条件
     * @return 查询实体
     */
    @Override
    public List<Tuple> findCityAndHotel(Predicate predicate) {
        JPAQueryFactory queryFactory = new JPAQueryFactory(em);
        JPAQuery<Tuple> jpaQuery = queryFactory.select(QTCity.tCity,QTHotel.tHotel)
                                        .from(QTCity.tCity)
                                        .leftJoin(QTHotel.tHotel)
                                        .on(QTHotel.tHotel.city.longValue().eq(QTCity.tCity.id.longValue()));
        //添加查询条件
        jpaQuery.where(predicate);
        //拿到结果
        return jpaQuery.fetch();
    }
城市表左连接旅店表,当该旅店属于这个城市时查询出两者的详细字段,存放到一个Tuple的多元组中.相比原生sql,简单清晰了很多.
那么该怎么调用这个方法呢?

@Test
    public void findByLeftJoin(){
        QTCity qtCity = QTCity.tCity;
        QTHotel qtHotel = QTHotel.tHotel;
        //查询条件
        Predicate predicate = qtCity.name.like("shanghai");
        //调用
        List<Tuple> result = tCityRepository.findCityAndHotel(predicate);
        //对多元组取出数据,这个和select时的数据相匹配
        for (Tuple row : result) {
            System.out.println("qtCity:"+row.get(qtCity));
            System.out.println("qtHotel:"+row.get(qtHotel));
            System.out.println("--------------------");
        }
        System.out.println(result);
    }


这样做的话避免了返回Object[]数组,下面是自动生成的sql语句:

select
        tcity0_.id as id1_0_0_,
        thotel1_.id as id1_1_1_,
        tcity0_.country as country2_0_0_,
        tcity0_.map as map3_0_0_,
        tcity0_.name as name4_0_0_,
        tcity0_.state as state5_0_0_,
        thotel1_.address as address2_1_1_,
        thotel1_.city as city3_1_1_,
        thotel1_.name as name4_1_1_ 
    from
        t_city tcity0_ 
    left outer join
        t_hotel thotel1_ 
            on (
                cast(thotel1_.city as signed)=cast(tcity0_.id as signed)
            ) 
    where
        tcity0_.name like ? escape '!'
4 多表动态分页查询

分页查询对于queryDSL无论什么样的sql只需要写一遍,会自动转换为相应的count查询,也就避免了文章开始的问题4,下面代码是对上面的查询加上分页功能:

 @Override
 public QueryResults<Tuple> findCityAndHotelPage(Predicate predicate,Pageable pageable) {
    JPAQueryFactory queryFactory = new JPAQueryFactory(em);
    JPAQuery<Tuple> jpaQuery = queryFactory.select(QTCity.tCity.id,QTHotel.tHotel)
                                               .from(QTCity.tCity)
                                               .leftJoin(QTHotel.tHotel)
                                               .on(QTHotel.tHotel.city.longValue().eq(QTCity.tCity.id.longValue()))
                                               .where(predicate)
                                               .offset(pageable.getOffset())
                                               .limit(pageable.getPageSize());
    //拿到分页结果
    return jpaQuery.fetchResults();
}
和上面不同之处在于这里使用了offset和limit限制查询结果.并且返回一个QueryResults,该类会自动实现count查询和结果查询,并进行封装.
调用形式如下:

    @Test
    public void findByLeftJoinPage(){
        QTCity qtCity = QTCity.tCity;
        QTHotel qtHotel = QTHotel.tHotel;
        //条件
        Predicate predicate = qtCity.name.like("shanghai");
        //分页
        PageRequest pageRequest = new PageRequest(0,10);
        //调用查询
        QueryResults<Tuple> result = tCityRepository.findCityAndHotelPage(predicate,pageRequest);
        //结果取出
        for (Tuple row : result.getResults()) {
            System.out.println("qtCity:"+row.get(qtCity));
            System.out.println("qtHotel:"+row.get(qtHotel));
            System.out.println("--------------------");
        }
        //取出count查询总数
        System.out.println(result.getTotal());
    }
生成的原生count查询sql,当该count查询结果为0的话,则直接返回,并不会再进行具体数据查询:

select
    count(tcity0_.id) as col_0_0_ 
from
    t_city tcity0_ 
left outer join
    t_hotel thotel1_ 
        on (
            cast(thotel1_.city as signed)=cast(tcity0_.id as signed)
        ) 
where
    tcity0_.name like ? escape '!'
生成的原生查询sql:

select
    tcity0_.id as id1_0_0_,
    thotel1_.id as id1_1_1_,
    tcity0_.country as country2_0_0_,
    tcity0_.map as map3_0_0_,
    tcity0_.name as name4_0_0_,
    tcity0_.state as state5_0_0_,
    thotel1_.address as address2_1_1_,
    thotel1_.city as city3_1_1_,
    thotel1_.name as name4_1_1_ 
from
    t_city tcity0_ 
left outer join
    t_hotel thotel1_ 
        on (
            cast(thotel1_.city as signed)=cast(tcity0_.id as signed)
        ) 
where
    tcity0_.name like ? escape '!' limit ?
查看打印,可以发现对应的city也都是同一个对象,hotel是不同的对象.



5 改造
有了上面的经验,改造就变得相当容易了.
首先前面的一堆sql可以写成如下形式,无非是多了一些select和left join

JPAQueryFactory factory = new JPAQueryFactory(entityManager);
        factory.select($.pcardCardOrder)
               .select($.pcardVcardMake.vcardMakeDes)
               .select($.pcardVtype.cardnumRuleId,$.pcardVtype.vtypeNm)
               .select($.pcardCardbin)
               .leftJoin($.pcardVcardMake).on($.pcardCardOrder.makeId.eq($.pcardVcardMake.vcardMakeId))
               //......省略
查询条件使用Predicate代替,放在service拼接,或者写一个生产条件的工厂都可以.

 jpaQuery.where(predicate);
最后的分页处理就和之前的一样了

        jpaQuery.offset(pageable.getOffset())
                .limit(pageable.getPageSize());
        return jpaQuery.fetchResults();


写在最后:

    个人认为jpa的意义就在于少用原生sql 为了方便开发 封装已经是在所难免了. 推荐多使用简单查询,需要使用动态查询的时候推荐使用JpaSpecificationExecutor个人认为比较好用.
    
    虽然我还是喜欢原生的写法...

另外很多时候简单的条件可以在server层进行判断调用不同的Dao层方法就可以。

 

P.s.参考资料 

 

使用QueryDSL
Spring Data JPA 实例查询
Spring Data JPA - Reference Documentation
Querydsl Reference Guide











