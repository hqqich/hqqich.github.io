# Java流.orElseThrow



```java
for (Map.Entry<JdbConnection,Instant> entry : borrowed.entrySet()) {
  Instant leaseTime = entry.getValue();
  JdbConnection jdbConnection = entry.getKey();
  Duration timeElapsed = Duration.between(leaseTime,Instant.now());
  if (timeElapsed.toMillis() > leaseTimeInMillis) {
    //expired,let's close it and remove it from the map
    jdbConnection.close();
    borrowed.remove(jdbConnection);
 
    //create a new one,mark it as borrowed and give it to the client
    JdbConnection newJdbConnection = factory.create();
    borrowed.put(newJdbConnection,Instant.now());
    return newJdbConnection;
  }
}
 
throw new ConnectionPoolException("No connections available");
```

我已经明白了这一点



```java
borrowed.entrySet().stream()
                   .filter(entry -> Duration.between(entry.getValue(),Instant.now()).toMillis() > leaseTimeInMillis)
                   .findFirst()
                   .ifPresent(entry -> {
                     entry.getKey().close();
                     borrowed.remove(entry.getKey());
                   });
 
 
JdbConnection newJdbConnection = factory.create();
borrowed.put(newJdbConnection,Instant.now());
return newJdbConnection;
```

以上可以编译但是我在IfPresent之后[添加](https://www.jb51.cc/tag/tianjia/)orElseThrow的那一刻我得到以下内容

```shell
/home/prakashs/connection_pool/src/main/java/com/spakai/ConnectionPool.java:83: error: void cannot be dereferenced
                       .orElseThrow(ConnectionPoolException::new);
```

### [解决方法](https://www.jb51.cc/tag/jiejuefangfa/)

那是因为ifPresent返回void.它无法[链接](https://www.jb51.cc/tag/lianjie/).你可以这样做：

```java
Entry<JdbConnection,Instant> entry =
    borrowed.entrySet().stream()
        .filter(entry -> Duration.between(entry.getValue(),Instant.now())
                            .toMillis() > leaseTimeInMillis)
        .findFirst()
        .orElseThrow(ConnectionPoolException::new));
entry.getKey().close();
borrowed.remove(entry.getKey());
```

你在寻找什么会读得很好：

```java
.findFirst().ifPresent(value -> use(value)).orElseThrow(Exception::new);
```

但是为了工作,ifPresent必须返回Optional,这有点奇怪.这意味着您可以将一个ifPresent[链接](https://www.jb51.cc/tag/lianjie/)到另一个,对该值执行多个操作.这可能是一个很好的设计,但它不是Optional的创造者所采用的.

