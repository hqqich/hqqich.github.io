# 时间戳和LocalDateTime和Date互转和格式化

## 时间戳与LocalDateTime互转

### 2.1 LocalDateTime 转 时间戳

>
这边值得一提的是在中国的时区偏移是8小时，本次示例转的时间戳是秒级别，得到的值是一个long值；知识追寻者这边是当前时间，故读者得到的结果与知识追寻者得到的结果不一致；读者可以使用站长工具进行测试校验 https://unixtime.51240.com/

```java
class Test{
	// 方式一
	@Test
	public void localTimeTest1(){
		// 获得当前时间
		LocalDateTime localDateTime = LocalDateTime.now();
		// 将当前时间转为时间戳
		long second = localDateTime.toEpochSecond(ZoneOffset.ofHours(8));
		// 1580706475
		System.out.println(second);
	}

	// 方式二，此方法执行的结果与之前一致，也是秒级别
	@Test
	public void localTimeTest2(){
		// 获得当前时间
		LocalDateTime localDateTime = LocalDateTime.now();
		// 将当前时间转为时间戳
		long second = localDateTime.toInstant(ZoneOffset.ofHours(8)).getEpochSecond();
		// 1580707001
		System.out.println(second);
	}


	// 方式三：此方式转的将是毫秒级别，直接用于站长工具是测试不出来，读者应该将其除1000取商获得正确的秒级时间戳；
	@Test
	public void localTimeTest3(){
		// 获得当前时间
		LocalDateTime localDateTime = LocalDateTime.now();
		// 将当前时间转为时间戳
		long milliseconds = localDateTime.toInstant(ZoneOffset.ofHours(8)).toEpochMilli();
		// 1580707268
		System.out.println(milliseconds/1000);
	}
}
```

### 2.2 时间戳 转LocalDateTime

> 以下几种获取的LocalDateTime方式按读者需求进行获取，不同的精确值，将获取不同的结果；

```java
class Test{

    // 方式一,先获取时间戳为秒级别，然后通过转换为LocalDateTime
    @Test
    public void localTimeTest4(){
        //获得时间戳
        long second = LocalDateTime.now().toInstant(ZoneOffset.of("+8")).getEpochSecond();
        // 将时间戳转为当前时间
        LocalDateTime localDateTime = LocalDateTime.ofEpochSecond(second, 0, ZoneOffset.ofHours(8));
        // 2020-02-03T13:30:44
        System.out.println(localDateTime);

    }

    // 方式二,本次获取的时间搓将是毫秒级别故要除以1000
    @Test
    public void localTimeTest5(){
        //获得时间戳
        long milliseconds = LocalDateTime.now().toInstant(ZoneOffset.of("+8")).toEpochMilli();
        // 将时间戳转为当前时间
        LocalDateTime localDateTime = LocalDateTime.ofEpochSecond(milliseconds/1000, 0, ZoneOffset.ofHours(8));
        // 2020-02-03T13:35:53
        System.out.println(localDateTime);

    }


    // 方式三, 本方式精确值是毫秒级别，故得到的结果会存在三位小数点；
    @Test
    public void localTimeTest6(){
        //获得时间戳
        long milliseconds = LocalDateTime.now().toInstant(ZoneOffset.of("+8")).toEpochMilli();
        // 将时间戳转为当前时间
        LocalDateTime localDateTime = Instant.ofEpochMilli(milliseconds).atZone(ZoneOffset.ofHours(8)).toLocalDateTime();
        // 2020-02-03T13:38:35.799
        System.out.println(localDateTime);
    }
}
```

## 三、时间戳与LocalDate互转
学会时间戳与LocalDate互转，同理就可以推出时间戳与LocalTime 互转，不过知识追寻者相信几乎没人会用到这个，故这边就不做示例；

### 3.1 时间戳转LocalDate

```java
class Test{
	// 方式一：注意这边是毫秒级的时间戳；
	@Test
	public void localDateTest1(){
        //获得时间戳
		long milliseconds = LocalDateTime.now().toInstant(ZoneOffset.of("+8")).toEpochMilli();
        // 将时间戳转为当前时间
		LocalDate localDate = Instant.ofEpochMilli(milliseconds).atZone(ZoneOffset.ofHours(8))
				.toLocalDate();
        // 2020-02-03
		System.out.println(localDate);
	}

    // 方式二：注意这边是秒级时间戳
	@Test
	public void localDateTest2(){
		//获得时间戳
		long seconds = LocalDateTime.now().toInstant(ZoneOffset.of("+8")).getEpochSecond();
		// 将时间戳转为当前时间
		LocalDate localDate = Instant.ofEpochSecond(seconds).atZone(ZoneOffset.ofHours(8)).toLocalDate();
		// 2020-02-03
		System.out.println(localDate);
	}
}
```


### 3.2 LocalDate 转 时间戳


```java
class Test{
	
	// 方式一:注意妙计时间戳
	@Test
	public void localDateTest3(){
		LocalDate localDate = LocalDate.now();
		//获得时间戳
		long seconds = localDate.atStartOfDay(ZoneOffset.ofHours(8)).toInstant().getEpochSecond();
		// 1580659200
		System.out.println(seconds);

	}

    // 方式二:注意毫秒级时间戳
	@Test
	public void localDateTest4(){
		LocalDate localDate = LocalDate.now();
		//获得时间戳
		long seconds = localDate.atStartOfDay(ZoneOffset.ofHours(8)).toInstant().toEpochMilli();
		// 1580659200000
		System.out.println(seconds);
	}
}
```

## 四 LocalDateTime与Date互转

### 4.1 Date转LocalDateTime

> 注意避坑，如下代码，执行完毕，可以看出会有时间误差8小时的区别

```java
class Test {
	
	public static void main(String[] args) throws ParseException {
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String zhi="2022-11-02 00:00:00";
		Date date=dateFormat.parse(zhi);
		System.out.println(date);
		LocalDateTime dateTime=LocalDateTime.ofInstant(date.toInstant(), ZoneOffset.UTC);
		System.out.println("一个"+dateTime);
		LocalDateTime dateTime1=Instant.ofEpochMilli(date.getTime()).atZone(ZoneId.of("UTC")).toLocalDateTime();
		System.out.println("这个"+dateTime1);
		LocalDateTime dateTime2=date.toInstant().atOffset(ZoneOffset.ofHours(8)).toLocalDateTime();
		System.out.println("又是"+dateTime2);
	}
}
```

输出结果:
Wed Nov 02 00:00:00 CST 2022
一个2022-11-01T16:00
这个2022-11-01T16:00
又是2022-11-02T00:00

```java
class Test {
	// 方式一:得出结果是有小数点，毫秒级精确
	@Test
	public void DateTest1(){
		// 创建时间
		Date date = new Date();
		// 将时间转为 LocalDateTime
		LocalDateTime localDateTime = date.toInstant().atOffset(ZoneOffset.ofHours(8)).toLocalDateTime();
		// 2020-02-03T14:07:49.833
		System.out.println(localDateTime);
	}

	// 方式二:秒级精确；
	@Test
	public void DateTest2(){
		// 创建时间
		Date date = new Date();
		// 将时间转为 秒级时间戳
		long second = date.toInstant().atOffset(ZoneOffset.ofHours(8)).toEpochSecond();
		LocalDateTime localDateTime = LocalDateTime.ofEpochSecond(second, 0, ZoneOffset.ofHours(8));
		// 2020-02-03T14:11:39
		System.out.println(localDateTime);

	}
}
```

### 4.2 LocalDateTime 转 Date

```java
class Test {
	// 方式一:秒级
	@Test
	public void DateTest3(){
		//当前时间
		LocalDateTime localDateTime = LocalDateTime.now();
		// 获得 Instant
		Instant instant = Instant.ofEpochSecond(localDateTime.toEpochSecond(ZoneOffset.ofHours(8)));
		// 获得 Date
		Date date = Date.from(instant);
		// Mon Feb 03 14:16:27 CST 2020
		System.out.println(date);

	}

	// 方式二
	@Test
	public void DateTest4(){
		//当前时间
		LocalDateTime localDateTime = LocalDateTime.now();
		// 获得 Instant
		Instant instant = localDateTime.atZone(ZoneOffset.ofHours(8)).toInstant();
		// 获得 Date
		Date date = Date.from(instant);
		// Mon Feb 03 14:20:32 CST 2020
		System.out.println(date);

	}
}
```

## 五 LocalDate与Date互转

### 5.1 LocalDate 转 Date

```java
class Test{
	@Test
	public void DateTest5(){
        //当前时间
		LocalDate localDate = LocalDate.now();
        // 获得 Instant
		Instant instant = localDate.atStartOfDay(ZoneOffset.ofHours(8)).toInstant();
		// 获得 Date
		Date date = Date.from(instant);
        // Mon Feb 03 00:00:00 CST 2020
		System.out.println(date);

	}
}
```

### 5.2 Date 转LocalDate

```java
class Test {
	@Test
	public void DateTest6(){
        // 获得 date
		Date date = new Date();
        // 获得 LocalDate
		LocalDate localDate = date.toInstant().atOffset(ZoneOffset.ofHours(8)).toLocalDate();
        // 2020-02-03
		System.out.println(localDate);
	}
}
```

## 六 LocalDateTime格式化

> 最后再说下格式化；知识追寻者这边就不提 LocalDateTime， LocalDate , LocalTime 互转问题，原因是前言那篇文章已经提到过；

### 6.1 LocalDateTime 转字符串

```java
class Test{
	@Test
	public void format1(){
		// 获得 localDateTime
		LocalDateTime localDateTime = LocalDateTime.now();
		// 指定模式
		DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy/MM/dd HH/mm/ss");
		// 将 LocalDateTime 格式化为字符串
		String format = localDateTime.format(dateTimeFormatter);
		// 2020/02/03 14/38/54
		System.out.println(format);
	}
}
```

### 6.2 字符串 转LocalDateTime

```java
class Test{
	@Test
	public void format2(){
		String time = "2020/02/03 14/38/54";
		// 指定模式
		DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy/MM/dd HH/mm/ss");
		// 将字符串格式化为 LocalDateTime
		LocalDateTime localDateTime = LocalDateTime.parse(time, dateTimeFormatter);
		// 2020-02-03T14:38:54
		System.out.println(localDateTime);
	}
}
```