---
title: SpringBoot第十三篇：同时集成华为RC6.5.1安全版kafka和原生kafka，通过配置文件动态控制
index: false
icon: laptop-code
category:
    java
---


背景
--

> 最近又收到新需求，原本项目已经集成了开源kafka进行功能开发，但是又因为开源的kafka不稳定，也不安全，所以就要求要集成华为RC6.5.1安全版kafka，并且能够跟开源的kafka进行动态切换，想用哪个用哪个。。

> 注意：kafka集成是通过bean管理，所以有注册bean的操作

> 废话不多说，开搞，我把我经历的踩坑和埋坑经验分享给有需要的人

解决了哪些问题
-------

#### 1.如何通过配置文件控制初始化注册哪个版本的kafka的bean

```
简单说怎么解让springboot在启动时动态根据配置文件的配置项确定初始化注册指定版本的kafka的bean呢？
```

> 使用`@Bean`+`@ConditionalOnPoroperty`+`@ConditionalOnMissingBean`做到可通过配置文件进行动态初始化

示例：

```java
@Configuration
public KafkaInitAutoConfigure{

	@Bean
	@ConditionalOnPoroperty(prefix="kafka", name="type", havingValue="apache")
	@ConditionalOnMissingBean({KafkaInitTemplate.class,ApacheKafkaTemplate.class})
	public KafkaInitTemplate apacheKafkaTemplateInit(){
		//初始化apache开源kafka的逻辑
	}

	@Bean
	@ConditionalOnPoroperty(prefix="kafka", name="type", havingValue="huawei")
	@ConditionalOnMissingBean({KafkaInitTemplate.class,HuaweiKafkaTemplate.class})
	public HuaweiKafkaTemplate huaweiKafkaTemplateInit(){
		//初始化华为安全版kafka的逻辑
	}
}
```

```yaml
kafka:
	# 选择使用开源版的kafka
	type: apache
	# 选择使用华为安全版的kafka
	# type: huawei
```

#### 2.认证文件读取问题

使用华为安全版RC6.5.1，需要使用`krb5.conf`、`user.keytab`、以及jass.conf文件  
`jass.conf`文件可代码生成，也可自己创建填写，内容格式如下：

```java
KafkaClient {
com.sun.security.auth.module.Krb5LoginModule required
useKeyTab=true
keyTab="src/main/resources/user.keytab"
principal="developuser"
useTicketCache=false
storeKey=true
debug=true;
refreshKrb5Config=true;
};
```

其中`keyTab`为`user.keytab`文件的绝对路径，`principal`是认证用户.  
就如`jass.conf`文件中keytab的路径要求是一个绝对路径，所以，你的项目如果打成jar包去运行的话，就得考虑把这个认证文件放在一个固定的路径。  
如果你是上k8s，也不用担心，挂载对应的路径去读取就好了。

#### 3.运行报错：could not login: the client is being …

> 如果运行时初始化kafka生产者出现这个错误，一定是你的认证文件不正确，或者`jass.conf`中的配置信息填写不正确

*   仔仔细细确认程序读取的那两个认证文件是否正确
*   仔仔细细确认`jass.conf`中配置的`user.keytab`路径是否正确
*   仔仔细细确认`jass.conf`中配置的`principal`是否正确

#### 4\. 运行报错：Clock skew too great (37) - PROCESS\_TGS

> 原因就是：客户端和服务器系统时间相隔超过5分钟

确认下两个系统之间的时间之差吧，通过相应的命令修改好即可  
注意：k8s启动的服务是看配置的时区是什么，即`timezone`，并不是所谓的系统时间。

#### 5\. 运行报错：Server not found in Kerberos database (7) - LOOKING\_UP\_SERVER

> 原因：是因为kafka-clients版本问题

要使用华为提供的kafka-clients，它兼容开源的kafka-clients，不用担心使用它，就不能切换到开源版的kafka

完整的【同时集成华为RC6.5.1安全版kafka和原生kafka，通过配置文件动态控制】的代码如下
--------------------------------------------------

kafka自动装配类：`KafkaInitAutoConfigure.java`  
作用：用于项目启动时，根据指定配置初始化指定类型的kafkaTemple的bean，以便在各个service层使用。同一返回KafkaInitTemplate便于统一使用KafkaInitTemplate去进行kafka的生产和消费，关键在于底层的生产和消费使用不同的版本kafka即可，不需要把所有的类型都引用一遍

```java
@Configuration
@EnableConfigurationProperties({KafkaInitProperties.class,HuaweiKafkaProperties.class})
@AutoConfigureAfter(KafkaAutoConfiguration.class)
public KafkaInitAutoConfigure{
	
	private static final Logger logger = LoggerFactory.getLogger(KafkaInitAutoConfigure.class)

	@Bean
	@ConditionalOnPoroperty(prefix="kafka", name="type", havingValue="apache")
    @ConditionalOnMissingBean({KafkaInitTemplate.class,ApacheKafkaTemplate.class})
	public KafkaInitTemplate apacheKafkaTemplateInit(KafkaTemplate kafkaTemplate, ComsumerFactory consumerFactory, KafkaInitProperties kafkaInitProperties) throws Exception{
		//初始化apache开源kafka的逻辑
		logger.info("初始化apache的kafka");
		KafkaInitTemplate kafkaInitTemplate = new KafkaInitTemplate();
		kafkaInitTemplate.setKafkaInitProperties(kafkaInitProperties);
		kafkaInitTemplate.setKafkaTemplate(kafkaTemplate);
		kafkaInitTemplate.setComsumerFactory(consumerFactory);
		kafkaInitTemplate.afterPropertiesSet();
		return  kafkaInitTemplate;
	}

	@Bean
	@ConditionalOnPoroperty(prefix="kafka", name="type", havingValue="huawei")
	@ConditionalOnMissingBean({KafkaInitTemplate.class,HuaweiKafkaTemplate.class})
	public KafkaInitTemplate huaweiKafkaTemplateInit(HuaweiKafkaProperties huaweiKafkaProperties,KafkaInitProperties kafkaInitProperties) throws Exception{
		//初始化华为安全版kafka的逻辑
		logger.info("初始化apache的kafka");
		KafkaInitTemplate kafkaInitTemplate = new KafkaInitTemplate();
		kafkaInitTemplate.setKafkaInitProperties(kafkaInitProperties);
		HuaweiKafkaTemplate huaweiKafkaTemplate = new HuaweiKafkaTemplate();
		kafkaInitTemplate.setHuaweiKafkaTemplate(huaweiKafkaTemplate);
		kafkaInitTemplate.afterPropertiesSet();
		return  kafkaInitTemplate;
	}
}
```

统一处理的kafka处理类：`KafkaInitTemplate.java`  
作用：提供一个各个类型的kafka装饰类，提供各个类型kafka的get和set方法，以及配置文件的get和set。提供send（生产）和recieve（消费）两个方法，recieve（消费）提供一个监听器，你可以通过代码起一个线程异步实时监听获取kafka消息

```java
public class KafkaInitTemplate implements InitalizingBean{
	private KafkaInitProperties kafkaInitProperties;
	private KafkaTemplate<String,String> kafkaTemplate;
	private ConsumerFactory consumerFactory;
	private HuaweiKafkaTemplate huaweiKafkaTemplate；
	
	@Override
	public void afterPropertiesSet() throws Exception{
		switch(kafkaInitProperties.getKafkaType){
			case "huawei":
				Assert.state(huaweiKafkaTemplate != null, "huaweiKafkaTemplate未初始化");
				break;
			default:
			    Assert.state(kafkaTemplate != null, "kafkaTemplate未初始化");
				Assert.state(consumerFactory != null, "consumerFactory未初始化");	
		}
	}

	public KafkaTemplate<String,String> getKafkaTemplate(){
		Assert.state(kafkaTemplate != null, "kafkaTemplate未初始化");
		return kafkaTemplate;
	}
	
	public void setKafkaTemplate(KafkaTemplate<String,String> kafkaTemplate){
		this.kafkaTemplate = kafkaTemplate;
	}

	public KafkaInitProperties getKafkaInitProperties(){
		return kafkaInitProperties;
	}
	
	public void setKafkaInitProperties(KafkaInitProperties kafkaInitProperties){
		this.kafkaInitProperties = kafkaInitProperties;
	}

	public ConsumerFactory getConsumerFactory(){
		Assert.state(consumerFactory != null, "consumerFactory未初始化");
		return consumerFactory;
	}
	
	public void setConsumerFactory(ConsumerFactory consumerFactory){
		this.consumerFactory = consumerFactory;
	}

	public HuaweiKafkaTemplate getHuaweiKafkaTemplate(){
		Assert.state(huaweiKafkaTemplate != null, "huaweiKafkaTemplate未初始化");
		return huaweiKafkaTemplate;
	}
	
	public void setKafkaTemplate(HuaweiKafkaTemplate huaweiKafkaTemplate){
		this.huaweiKafkaTemplate = huaweiKafkaTemplate;
	}
}
	/**
	* 往指定topic生产发布消息
	*/
	public void send(String topic,String key, Object value){
		Assert.notNull(topic,"topic不能为空");
		Assert.notNull(key,"key不能为空");
		Assert.notNull(value,"value不能为空");
		switch(this.kafkaInitProperties.getKafkaType){
			case "huawei":
				this.huaweiKafkaTemplate.send(topic,key,JSON.toJSONString(value));
				break;
			default:
				this.kafkaTemplate.send(topic,key,JSON.toJSONString(value));	
		}
	}

	public AbstractMessageListenerContainer<String,String> receive(String topic, String groupId,MessageListener messageListener){
		Assert.notNull(topic,"topic不能为空");
		Assert.notNull(groupId,"groupId不能为空");
		Assert.notNull(messageListener,"messageListener不能为空");
		ContainerProperties containerProperties = new ContainerProperties(new String[]{topic});
		containerProperties.setGroupId(groupId);
		containerProperties.setMessageListener(messageListener);
		KafkaMessageListenerContainer<String,String> messageListenerContainer;
		switch(this.kafkaInitProperties.getKafkaType){
			case "huawei":
				messageListenerContainer = new KafkaMessageListenerContainer(this.huaweiKafkaTemplate.createConsumerFactory(), containerProperties);
				break;
			default:
				messageListenerContainer = new KafkaMessageListenerContainer(this.consumerFactory, containerProperties);	
		}
		messageListenerContainer.setBeanName(topic + "_" + groupId);
		messageListenerContainer.start();
		return messageListenerContainer;
	}
```

至于HuaweiKafkaTemplate.java，参照从华为集群下载的kafka客户端示例中，初始化即可，下面就不一一手打了，太累了，提供一些照片给大家看看

*   这是构造方法里面初始化了一个生产者  
    ![在这里插入图片描述](https://img-blog.csdnimg.cn/db0484c9851a400eaf1e019c381d57f0.png)
*   这是创建一个消费者工厂的方法  
    ![在这里插入图片描述](https://img-blog.csdnimg.cn/22fcbbc75a284f6e86b193cfb6ca332e.png)
*   这是用消费者发送kafka消息的方法  
    ![在这里插入图片描述](https://img-blog.csdnimg.cn/3505dff36142405a8d21c9574540b68e.png)
*   这是安全认证的方法  
    ![在这里插入图片描述](https://img-blog.csdnimg.cn/7a319bd316a547199fedda4016fc5a2f.png)  
    ![在这里插入图片描述](https://img-blog.csdnimg.cn/a76115f8038645e1a877446cd75e3761.png)  
    ![在这里插入图片描述](https://img-blog.csdnimg.cn/aa4a289c1ac646d6b785a9a904314fca.png)  
    ![在这里插入图片描述](https://img-blog.csdnimg.cn/00fac037fc4c4cbf94ff224a70dc03db.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/0ffd6e9dac8a461eb7339224d4454784.png)

如果你通过自己生成`jass.conf`文件，就没要调用`writeJassFile`方法

以上只是提供一个实现思路，和一些问题的解决方案，大家在实操过程中可以参考，切不可生搬硬套，有问题可以问我，我会及时回复大家
-------------------------------------------------------------

 

文章知识点与官方知识档案匹配，可进一步学习相关知识

[云原生入门技能树](https://edu.csdn.net/skill/cloud_native/?utm_source=csdn_ai_skill_tree_blog)[首页](https://edu.csdn.net/skill/cloud_native/?utm_source=csdn_ai_skill_tree_blog)[概览](https://edu.csdn.net/skill/cloud_native/?utm_source=csdn_ai_skill_tree_blog)17248 人正在系统学习中

本文转自 <https://blog.csdn.net/zhangtao0417/article/details/125466693>，如有侵权，请联系删除。
