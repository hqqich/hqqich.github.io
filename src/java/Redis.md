# Redis

## **一、<String, String> 存储**

**pom.xml**

> ```xml
> <!-- 引入依赖 -->
> <dependency>
> 	<groupId>org.springframework.boot</groupId>
> 	<artifactId>spring-boot-starter-data-redis</artifactId>
> </dependency>
> ```

- **application.properties**
> ```properties
> #编写配置文件(redis)
> spring.redis.host=127.0.0.1
> spring.redis.port=6379
> spring.redis.password=
> spring.redis.database=0
> spring.redis.pool.max-active=8
> spring.redis.pool.max-wait=-1
> spring.redis.pool.max-idle=500
> spring.redis.pool.min-idle=0
> spring.redis.timeout=0
> ```



### **连接redis做相应的数据操作**



查看源码可知 `redisTemplate` 和 `StringRedisTemplate`已被自动配置，所以我们直接用就可以

- **RedisRepository.java**

```java
@Repository
public class RedisRepository {

  @Autowired 
  private StringRedisTemplate template;

  public void setKey(String key, String value) {
    ValueOperations<String, String> ops = template.opsForValue();
    ops.set(key, value);
  }

  public String getValue(String key) {
    ValueOperations<String, String> ops = this.template.opsForValue();
    return ops.get(key);
  }
}
```

- **RedisController.java**

```java
@RestController
public class RedisController {
  
  @Autowired
  private RedisRepository redisRepository;

  @RequestMapping("/set")
  public String set(String key,String value){
    redisRepository.setKey(key, value);
    return "success";
  }
  
  @RequestMapping("/get")
  public String get(String key){
    return redisRepository.getValue(key);
  }
}
```

### **访问测试**

=> `http://127.0.0.1:8087/set?key=name&value=hqqich`

<= `success`

=> `127.0.0.1:8087/set?key=name&value=hqqich`

<= `hqqich`





## 二、<String, Object> 存储

### **默认情况下RedisTemplate只支持String**

- **RedisConfig.java** `redis`配置类

```java
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

  @Bean
  @SuppressWarnings("all")
  public RedisTemplate<String,Object> redisTemplate(RedisConnectionFactory factory){
    RedisTemplate<String, Object> template = new RedisTemplate<String, Object>();
    template.setConnectionFactory(factory);
    Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(Object.class);
    ObjectMapper om = new ObjectMapper();
    om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
    om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
    jackson2JsonRedisSerializer.setObjectMapper(om);
    StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();
    // key采用String的序列化方式
    template.setKeySerializer(stringRedisSerializer);
    // hash的key也采用String的序列化方式
    template.setHashKeySerializer(stringRedisSerializer);
    // value序列化方式采用jackson
    template.setValueSerializer(jackson2JsonRedisSerializer);
    // hash的value序列化方式采用jackson
    template.setHashValueSerializer(jackson2JsonRedisSerializer);
    template.afterPropertiesSet();
    return template;
  }
}
```

- **RedisUtil.java** `redis`工具类

```java
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

@Component
public class RedisUtil {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    // =============================common============================
    /**
     * 指定缓存失效时间
     *
     * @param key  键
     * @param time 时间(秒)
     * @return
     */
    public boolean expire(String key, long time) {
        try {
            if (time > 0) {
                redisTemplate.expire(key, time, TimeUnit.SECONDS);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 根据key 获取过期时间
     *
     * @param key 键 不能为null
     * @return 时间(秒) 返回0代表为永久有效
     */
    public long getExpire(String key) {
        return redisTemplate.getExpire(key, TimeUnit.SECONDS);
    }

    /**
     * 判断key是否存在
     *
     * @param key 键
     * @return true 存在 false不存在
     */
    public boolean hasKey(String key) {
        try {
            return redisTemplate.hasKey(key);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 删除缓存
     *
     * @param key 可以传一个值 或多个
     */
    @SuppressWarnings("unchecked")
    public void del(String... key) {
        if (key != null && key.length > 0) {
            if (key.length == 1) {
                redisTemplate.delete(key[0]);
            } else {
                redisTemplate.delete((Collection<String>) CollectionUtils.arrayToList(key));
            }
        }
    }

    // ============================String=============================

    /**
     * 普通缓存获取
     *
     * @param key 键
     * @return 值
     */
    public Object get(String key) {
        return key == null ? null : redisTemplate.opsForValue().get(key);
    }

    /**
     * 普通缓存放入
     *
     * @param key   键
     * @param value 值
     * @return true成功 false失败
     */
    public boolean set(String key, Object value) {
        try {
            redisTemplate.opsForValue().set(key, value);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

    }

    /**
     * 普通缓存放入并设置时间
     *
     * @param key   键
     * @param value 值
     * @param time  时间(秒) time要大于0 如果time小于等于0 将设置无限期
     * @return true成功 false 失败
     */
    public boolean set(String key, Object value, long time) {
        try {
            if (time > 0) {
                redisTemplate.opsForValue().set(key, value, time, TimeUnit.SECONDS);
            } else {
                set(key, value);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 递增
     *
     * @param key   键
     * @param delta 要增加几(大于0)
     * @return
     */
    public long incr(String key, long delta) {
        if (delta < 0) {
            throw new RuntimeException("递增因子必须大于0");
        }
        return redisTemplate.opsForValue().increment(key, delta);
    }

    /**
     * 递减
     *
     * @param key   键
     * @param delta 要减少几(小于0)
     * @return
     */
    public long decr(String key, long delta) {
        if (delta < 0) {
            throw new RuntimeException("递减因子必须大于0");
        }
        return redisTemplate.opsForValue().increment(key, -delta);
    }

    // ================================Map=================================

    /**
     * HashGet
     *
     * @param key  键 不能为null
     * @param item 项 不能为null
     * @return 值
     */
    public Object hget(String key, String item) {
        return redisTemplate.opsForHash().get(key, item);
    }

    /**
     * 获取hashKey对应的所有键值
     *
     * @param key 键
     * @return 对应的多个键值
     */
    public Map<Object, Object> hmget(String key) {
        return redisTemplate.opsForHash().entries(key);
    }

    /**
     * HashSet
     *
     * @param key 键
     * @param map 对应多个键值
     * @return true 成功 false 失败
     */
    public boolean hmset(String key, Map<String, Object> map) {
        try {
            redisTemplate.opsForHash().putAll(key, map);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * HashSet 并设置时间
     *
     * @param key  键
     * @param map  对应多个键值
     * @param time 时间(秒)
     * @return true成功 false失败
     */
    public boolean hmset(String key, Map<String, Object> map, long time) {
        try {
            redisTemplate.opsForHash().putAll(key, map);
            if (time > 0) {
                expire(key, time);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 向一张hash表中放入数据,如果不存在将创建
     *
     * @param key   键
     * @param item  项
     * @param value 值
     * @return true 成功 false失败
     */
    public boolean hset(String key, String item, Object value) {
        try {
            redisTemplate.opsForHash().put(key, item, value);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 向一张hash表中放入数据,如果不存在将创建
     *
     * @param key   键
     * @param item  项
     * @param value 值
     * @param time  时间(秒) 注意:如果已存在的hash表有时间,这里将会替换原有的时间
     * @return true 成功 false失败
     */
    public boolean hset(String key, String item, Object value, long time) {
        try {
            redisTemplate.opsForHash().put(key, item, value);
            if (time > 0) {
                expire(key, time);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 删除hash表中的值
     *
     * @param key  键 不能为null
     * @param item 项 可以使多个 不能为null
     */
    public void hdel(String key, Object... item) {
        redisTemplate.opsForHash().delete(key, item);
    }

    /**
     * 判断hash表中是否有该项的值
     *
     * @param key  键 不能为null
     * @param item 项 不能为null
     * @return true 存在 false不存在
     */
    public boolean hHasKey(String key, String item) {
        return redisTemplate.opsForHash().hasKey(key, item);
    }

    /**
     * hash递增 如果不存在,就会创建一个 并把新增后的值返回
     *
     * @param key  键
     * @param item 项
     * @param by   要增加几(大于0)
     * @return
     */
    public double hincr(String key, String item, double by) {
        return redisTemplate.opsForHash().increment(key, item, by);
    }

    /**
     * hash递减
     *
     * @param key  键
     * @param item 项
     * @param by   要减少记(小于0)
     * @return
     */
    public double hdecr(String key, String item, double by) {
        return redisTemplate.opsForHash().increment(key, item, -by);
    }

    // ============================set=============================

    /**
     * 根据key获取Set中的所有值
     *
     * @param key 键
     * @return
     */
    public Set<Object> sGet(String key) {
        try {
            return redisTemplate.opsForSet().members(key);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 根据value从一个set中查询,是否存在
     *
     * @param key   键
     * @param value 值
     * @return true 存在 false不存在
     */
    public boolean sHasKey(String key, Object value) {
        try {
            return redisTemplate.opsForSet().isMember(key, value);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 将数据放入set缓存
     *
     * @param key    键
     * @param values 值 可以是多个
     * @return 成功个数
     */
    public long sSet(String key, Object... values) {
        try {
            return redisTemplate.opsForSet().add(key, values);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 将set数据放入缓存
     *
     * @param key    键
     * @param time   时间(秒)
     * @param values 值 可以是多个
     * @return 成功个数
     */
    public long sSetAndTime(String key, long time, Object... values) {
        try {
            Long count = redisTemplate.opsForSet().add(key, values);
            if (time > 0)
                expire(key, time);
            return count;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 获取set缓存的长度
     *
     * @param key 键
     * @return
     */
    public long sGetSetSize(String key) {
        try {
            return redisTemplate.opsForSet().size(key);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 移除值为value的
     *
     * @param key    键
     * @param values 值 可以是多个
     * @return 移除的个数
     */
    public long setRemove(String key, Object... values) {
        try {
            Long count = redisTemplate.opsForSet().remove(key, values);
            return count;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }
    // ===============================list=================================

    /**
     * 获取list缓存的内容
     *
     * @param key   键
     * @param start 开始
     * @param end   结束 0 到 -1代表所有值
     * @return
     */
    public List<Object> lGet(String key, long start, long end) {
        try {
            return redisTemplate.opsForList().range(key, start, end);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 获取list缓存的长度
     *
     * @param key 键
     * @return
     */
    public long lGetListSize(String key) {
        try {
            return redisTemplate.opsForList().size(key);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 通过索引 获取list中的值
     *
     * @param key   键
     * @param index 索引 index>=0时， 0 表头，1 第二个元素，依次类推；index<0时，-1，表尾，-2倒数第二个元素，依次类推
     * @return
     */
    public Object lGetIndex(String key, long index) {
        try {
            return redisTemplate.opsForList().index(key, index);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 将list放入缓存
     *
     * @param key   键
     * @param value 值
     * @return
     */
    public boolean lSet(String key, Object value) {
        try {
            redisTemplate.opsForList().rightPush(key, value);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 将list放入缓存
     *
     * @param key   键
     * @param value 值
     * @param time  时间(秒)
     * @return
     */
    public boolean lSet(String key, Object value, long time) {
        try {
            redisTemplate.opsForList().rightPush(key, value);
            if (time > 0)
                expire(key, time);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 将list放入缓存
     *
     * @param key   键
     * @param value 值
     * @return
     */
    public boolean lSet(String key, List<Object> value) {
        try {
            redisTemplate.opsForList().rightPushAll(key, value);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 将list放入缓存
     *
     * @param key   键
     * @param value 值
     * @param time  时间(秒)
     * @return
     */
    public boolean lSet(String key, List<Object> value, long time) {
        try {
            redisTemplate.opsForList().rightPushAll(key, value);
            if (time > 0)
                expire(key, time);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 根据索引修改list中的某条数据
     *
     * @param key   键
     * @param index 索引
     * @param value 值
     * @return
     */
    public boolean lUpdateIndex(String key, long index, Object value) {
        try {
            redisTemplate.opsForList().set(key, index, value);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 移除N个值为value
     *
     * @param key   键
     * @param count 移除多少个
     * @param value 值
     * @return 移除的个数
     */
    public long lRemove(String key, long count, Object value) {
        try {
            Long remove = redisTemplate.opsForList().remove(key, count, value);
            return remove;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }
}
```
- **RedisController.java**

```java
@RestController
public class RedisController {

  @Autowired
  private RedisUtil redisUtil;

  @RequestMapping(value = "/setUser", method = RequestMethod.POST)
  public boolean setUser(@RequestBody User user, @RequestParam(value = "user") String username){
    boolean set = redisUtil.set(username, user);
    return set;
  }
    
  @RequestMapping("/getUser")
  public Object getUser(@RequestParam(value = "user") String user){
    Object object = redisUtil.get(user);
    return object;
  }
}
```

### **访问测试**

=>POST `127.0.0.1:8087/setUser?user=user0008` 传入JSON数据`{"id":"7", "name":"hqqich", "age":"10"}`

<= `true`

=> GET `127.0.0.1:8087/getUser?user=user0008`

<= `{"id":"7", "name":"hqqich", "age":"10"}`







## **三、利用redis做cache缓存 **

1. #### **`pom.xml`添加依赖**

   ```xml
   <!-- 最好使用连接池 -->
   <dependency>
       <groupId>org.apache.commons</groupId>
       <artifactId>commons-pool2</artifactId>
   </dependency>
   <!-- 下面的用不用无所谓 -->
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-cache</artifactId>
   </dependency>
   ```

2. #### **3个重要注解**

   > `@CachePut` 表示将方法结果返回存放到缓存中。（**cache中查询到结果后继续执行后续**）
   > `@Cacheable` 表示先从缓存中通过定义的键查询，如果可以查询到数据，则返回，否则执行该方法，返回数据，并且将返回结果保存到缓存中。（**cache中查询到结果过不再执行后续**）
   > `@CacheEvict` 通过定义的键移除缓存，它有一个 Boolean 类型的配置项 beforeInvocation，表示在方法之前或者之后移除缓存。因为其默认值为false ，所以默认为方法之后将缓存移除 。

3. #### `application.properties`添加配置

   > ```properties
   > # cache
   > spring.cache.type=redis
   > spring.cache.cache-names=redisCache
   > # 缓存超时时间，0为永不超时
   > spring.cache.redis.time-to-live=0ms
   > ```

4. #### 在DAO层添加注解（**命名一定要注意，不要写错**）

   > ```java
   > @Service
   > public class UserService {
   >     
   >   //
   >   @CachePut(value = "redisCache" , key = "'redis_user_'+#result.id")
   >   public User insertUser(User user){
   >     //模拟数据库操作
   >     try {
   >       Thread.sleep(1000*1);
   >     } catch (InterruptedException e) {
   >       e.printStackTrace();
   >     }
   >     return user;
   >   }
   > 
   >   @Cacheable(value = "redisCache" , key = "'redis_user_'+#id")
   >   public User getUser(int id){
   >     //模拟数据库操作
   >     try {
   >       Thread.sleep(1000*1);
   >     } catch (InterruptedException e) {
   >       e.printStackTrace();
   >     }
   >     return new User(1, "name", "age");
   >   }
   >   
   >   //命中率低，所以不采用缓存机制
   >   public List<User> findUsers(String age){
   >     return new ArrayList<User>();
   >   }
   > 
   >   @CachePut(value = "redisCache" ,condition = "#result != 'null'", key = "'redis_user_'+#id")
   >   public User UpdateUser(int id, String name){
   >     //此处调用 getUser 方法，该方法缓存注解失效
   >     //所以这里还是会执行SQL，将查询到数据库中的最新数据
   >     User user = this.getUser(id);
   >     if (user == null){
   >       return null;
   >     }
   >     //模拟数据库操作
   >     try {
   >       Thread.sleep(1000*1);
   >     } catch (InterruptedException e) {
   >       e.printStackTrace();
   >     }
   >     return user;
   >   }
   > 
   >   @CacheEvict(value = "redisCache" , key = "'redis_user_'+#id", beforeInvocation = false)
   >   public int deleteUser(int id){
   >     //模拟数据库操作
   >     try {
   >       Thread.sleep(1000*1);
   >     } catch (InterruptedException e) {
   >       e.printStackTrace();
   >     }
   >     return 1;
   >   }
   > }
   > ```

5. #### **在`springboot`启动类中添加启动cache缓存的注解**

   ```java
   @SpringBootApplication
   @EnableCaching
   public class DemoRedisApplication {
     public static void main(String[] args) {
       SpringApplication.run(DemoRedisApplication.class, args);
     }
   }
   ```

   此时在controller中调用时间会缩短