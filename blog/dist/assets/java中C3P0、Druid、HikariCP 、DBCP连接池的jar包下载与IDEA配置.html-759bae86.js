import{_ as t}from"./plugin-vue_export-helper-c27b6911.js";import{r as c,o as l,c as o,a as s,d as n,e,f as i}from"./app-51229bef.js";const p={},r=i('<h2 id="一、什么是连接池" tabindex="-1"><a class="header-anchor" href="#一、什么是连接池" aria-hidden="true">#</a> 一、什么是连接池</h2><p>连接池是应用程序与数据库之间的一个缓冲区，它存储了一定数量的空闲数据库连接，当应用程序需要连接数据库时，可以从连接池中获取一个可用连接，使用完毕后再将连接归还给连接池，从而避免了每次连接都需要创建和销毁连接的开销，提高了应用程序的性能和可伸缩性。连接池也可以控制数据库连接的数量和复用，从而减少了数据库的负担。</p><p>简单理解的话就是将连接放到自己家抽屉里，需要用的时候就去拿，不用了就放回去，减少了连接的时间，不用去远处去拿。</p><h2 id="二、连接池的好处" tabindex="-1"><a class="header-anchor" href="#二、连接池的好处" aria-hidden="true">#</a> 二、连接池的好处</h2><p>连接池的好处可以总结为以下几点：</p><h3 id="_1-提高性能" tabindex="-1"><a class="header-anchor" href="#_1-提高性能" aria-hidden="true">#</a> 1. 提高性能</h3><p>数据库连接是资源密集型操作，每次建立连接都需要进行TCP握手，验证用户身份等操作。连接池缓存了一定数量的已经建立的连接，可以更快速地获取和释放连接，减少了连接建立和关闭的时间，提高了应用程序的性能。</p><h3 id="_2-稳定性" tabindex="-1"><a class="header-anchor" href="#_2-稳定性" aria-hidden="true">#</a> 2. 稳定性</h3><p>当并发量较高时，如果每个请求都建立一个新的数据库连接，可能会导致数据库服务器过载。使用连接池可以控制连接的数量，避免过多的连接导致数据库服务器崩溃。</p><h3 id="_3-节省资源" tabindex="-1"><a class="header-anchor" href="#_3-节省资源" aria-hidden="true">#</a> 3. 节省资源</h3><p>使用连接池可以重复利用已有的数据库连接，避免了频繁创建和关闭连接的开销，从而节省了资源。</p><h3 id="_4-提高可靠性" tabindex="-1"><a class="header-anchor" href="#_4-提高可靠性" aria-hidden="true">#</a> 4. 提高可靠性</h3><p>连接池可以监控数据库连接的状态，并在连接出现问题时自动重置连接。这对于保持应用程序的可靠性和稳定性非常重要。</p><p>有四种连接池c3p0、driuid、HikariCP、DBCP</p><h2 id="三、导入jar包" tabindex="-1"><a class="header-anchor" href="#三、导入jar包" aria-hidden="true">#</a> 三、导入jar包</h2><p><strong>因为所有导入jar包步骤都是一致的，所以单拎出来写</strong></p><p>因为需要测试连接池连接数据库是否成功，我们这里使用的是MySql</p>',17),d={href:"https://dev.mysql.com/downloads/connector/j/",target:"_blank",rel:"noopener noreferrer"},u=i('<h3 id="下载mysqljar包" tabindex="-1"><a class="header-anchor" href="#下载mysqljar包" aria-hidden="true">#</a> 下载MySqljar包</h3><p><img src="https://img-blog.csdnimg.cn/direct/97e8ce7ab76b446183d93a26d44ee538.png" alt="在这里插入图片描述" loading="lazy"><img src="https://img-blog.csdnimg.cn/direct/b63fb95b25f848acb6f809510e0fb2f9.png" alt="在这里插入图片描述" loading="lazy"></p><h3 id="导入jar包" tabindex="-1"><a class="header-anchor" href="#导入jar包" aria-hidden="true">#</a> 导入jar包</h3><p>将下载好的jar包复制到项目中，建议大家建一个文件专门用来放置jar包。 <img src="https://img-blog.csdnimg.cn/direct/344bf81226c14992aeafce67177df33c.png" alt="在这里插入图片描述" loading="lazy"> 复制进去就是这样，接下来添加为库</p><h3 id="添加为库" tabindex="-1"><a class="header-anchor" href="#添加为库" aria-hidden="true">#</a> 添加为库</h3><p>右击jar包添加为库 <img src="https://img-blog.csdnimg.cn/direct/f75e873734824b34a919e349a1ccbc8a.png" alt="在这里插入图片描述" loading="lazy"></p><p>根据需求选择级别之后直接确定 <img src="https://img-blog.csdnimg.cn/direct/3ce890f4b56f4e7a936fc93b3054c92e.png" alt="在这里插入图片描述" loading="lazy"> 所有jar包都是这样导入。</p><h2 id="四、c3p0连接池" tabindex="-1"><a class="header-anchor" href="#四、c3p0连接池" aria-hidden="true">#</a> 四、c3p0连接池</h2><h3 id="下载jar包" tabindex="-1"><a class="header-anchor" href="#下载jar包" aria-hidden="true">#</a> 下载jar包</h3>',9),v={href:"https://sourceforge.net/projects/c3p0/",target:"_blank",rel:"noopener noreferrer"},m=s("img",{src:"https://img-blog.csdnimg.cn/direct/e2afbb316dcd4aca9f96d819e78b44c4.png",alt:"在这里插入图片描述",loading:"lazy"},null,-1),k=i(`<h3 id="创建配置文件" tabindex="-1"><a class="header-anchor" href="#创建配置文件" aria-hidden="true">#</a> 创建配置文件</h3><p>创建c3p0-config.xml</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;
&lt;c3p0-config&gt;
&lt;!--默认配置--&gt;
&lt;default-config&gt;
&lt;!--数据库驱动--&gt;
&lt;property name=&quot;driverClass&quot;&gt;com.mysql.cj.jdbc.Driver&lt;/property&gt;
&lt;!--数据库的url--&gt;
&lt;property name=&quot;jdbcUrl&quot;&gt;jdbc:mysql://localhost:3306/vehicleUpkeepDB&lt;/property&gt;
&lt;!--用户名写自己的--&gt;
&lt;property name=&quot;user&quot;&gt;root&lt;/property&gt;
&lt;!--密码写自己的--&gt;
&lt;property name=&quot;password&quot;&gt;sasa&lt;/property&gt;
&lt;!--初始连接数--&gt;
&lt;property name=&quot;initialPoolSize&quot;&gt;10&lt;/property&gt;
&lt;!--最大连接数--&gt;
&lt;property name=&quot;maxPoolSize&quot;&gt;100&lt;/property&gt;
&lt;!--最小连接数--&gt;
&lt;property name=&quot;minPoolSize&quot;&gt;10&lt;/property&gt;
&lt;/default-config&gt;
&lt;/c3p0-config&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="测试连接" tabindex="-1"><a class="header-anchor" href="#测试连接" aria-hidden="true">#</a> 测试连接</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">// 创建 ComboPooledDataSource 对象，该对象间接实现了 java 官方提供的 DataSource 接口</span>
<span class="token class-name">ComboPooledDataSource</span> dataSource <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ComboPooledDataSource</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//获取连接，这里会有个异常可能连接不成功，你可以抛出或者处理</span>
<span class="token class-name">Connection</span> connection <span class="token operator">=</span> dataSource<span class="token punctuation">.</span><span class="token function">getConnection</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//执行sql语句，这里会有个异常sql语句可能出错，你可以抛出或者处理</span>
<span class="token class-name">ResultSet</span> resultSet <span class="token operator">=</span> connection<span class="token punctuation">.</span><span class="token function">prepareStatement</span><span class="token punctuation">(</span><span class="token string">&quot;select count(0) from user &quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">executeQuery</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//处理结果</span>
<span class="token keyword">if</span><span class="token punctuation">(</span>resultSet<span class="token punctuation">.</span><span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>resultSet<span class="token punctuation">.</span><span class="token function">getInt</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">//释放资源</span>
resultSet<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
connection<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>结果 会有很多事务的东西，需要手动去关闭 <img src="https://img-blog.csdnimg.cn/direct/2d834c9615e04944bf110dbff2221938.png" alt="在这里插入图片描述" loading="lazy"> 这样就是连接成功了！</p><h2 id="五、driuid连接池" tabindex="-1"><a class="header-anchor" href="#五、driuid连接池" aria-hidden="true">#</a> 五、driuid连接池</h2><h3 id="下载jar包-1" tabindex="-1"><a class="header-anchor" href="#下载jar包-1" aria-hidden="true">#</a> 下载jar包</h3>`,8),b={href:"https://repo1.maven.org/maven2/com/alibaba/druid/1.2.0/",target:"_blank",rel:"noopener noreferrer"},h=s("img",{src:"https://img-blog.csdnimg.cn/direct/a90c4989ac6549b7b6c92e887ae4460e.png",alt:"在这里插入图片描述",loading:"lazy"},null,-1),g=i(`<h3 id="创建配置文件-1" tabindex="-1"><a class="header-anchor" href="#创建配置文件-1" aria-hidden="true">#</a> 创建配置文件</h3><p>创建driuid.properties</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 驱动名称(连接Mysql)
driverClassName = com.mysql.cj.jdbc.Driver
# 参数?rewriteBatchedStatements=True表示支持批处理机制
url = jdbc:mysql://localhost:3306/cinemaDB?useServerPrepStmts=true
# 用户名,注意这里是按&quot;userName&quot;来读取的
userName = root
# 用户密码(自己改)
password = sasa
# 初始化连接数量
initialSize = 10
# 最小连接数量
minIdle = 10
# 最大连接数量
maxActive = 50
# 超时时间5000ms (在等待队列中的最长等待时间,若超时,)
maxWait = 5000
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="测试连接-1" tabindex="-1"><a class="header-anchor" href="#测试连接-1" aria-hidden="true">#</a> 测试连接</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">//加载配置文件,会报错，可能找不到文件，可以选择抛出或者处理</span>
<span class="token class-name">Properties</span> properties <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Properties</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
properties<span class="token punctuation">.</span><span class="token function">load</span><span class="token punctuation">(</span><span class="token class-name">Files</span><span class="token punctuation">.</span><span class="token function">newInputStream</span><span class="token punctuation">(</span><span class="token class-name">Paths</span><span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&quot;src\\\\driuid.properties&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//在工厂中创建一个数据源,数据源的连接信息来源于properties配置文件中</span>
<span class="token class-name">DataSource</span> dataSource <span class="token operator">=</span> <span class="token class-name">DruidDataSourceFactory</span><span class="token punctuation">.</span><span class="token function">createDataSource</span><span class="token punctuation">(</span>properties<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//从连接池,获取连接对象</span>
<span class="token class-name">Connection</span> connection <span class="token operator">=</span> dataSource<span class="token punctuation">.</span><span class="token function">getConnection</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//对sql语句进行预处理</span>
<span class="token class-name">PreparedStatement</span> preparedStatement <span class="token operator">=</span> connection<span class="token punctuation">.</span><span class="token function">prepareStatement</span><span class="token punctuation">(</span><span class="token string">&quot;select count(0) from user &quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//执行命令</span>
<span class="token class-name">ResultSet</span> resultSet <span class="token operator">=</span> preparedStatement<span class="token punctuation">.</span><span class="token function">executeQuery</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//处理结果</span>
<span class="token keyword">if</span><span class="token punctuation">(</span>resultSet<span class="token punctuation">.</span><span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>resultSet<span class="token punctuation">.</span><span class="token function">getInt</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">//释放资源</span>
resultSet<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
connection<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>结果 <img src="https://img-blog.csdnimg.cn/direct/ffa75c5e2aa945ff9655731b0ffa6aa8.png" alt="在这里插入图片描述" loading="lazy"></p><p>这样就是连接成功了！</p><h2 id="六、hikaricp连接池" tabindex="-1"><a class="header-anchor" href="#六、hikaricp连接池" aria-hidden="true">#</a> 六、HikariCP连接池</h2><p>HikariCP需要下载三个jar包</p>`,9),f={href:"https://repo1.maven.org/maven2/com/zaxxer/HikariCP/4.0.3/",target:"_blank",rel:"noopener noreferrer"},x={href:"https://repo1.maven.org/maven2/org/slf4j/slf4j-api/1.7.25/",target:"_blank",rel:"noopener noreferrer"},_={href:"https://repo1.maven.org/maven2/org/slf4j/slf4j-log4j12/1.7.25/",target:"_blank",rel:"noopener noreferrer"},j=i(`<h3 id="下载jar包-2" tabindex="-1"><a class="header-anchor" href="#下载jar包-2" aria-hidden="true">#</a> 下载jar包</h3><p>三个jar包都是找到**.jar**的后缀 <img src="https://img-blog.csdnimg.cn/direct/81f704e9557d4ed9a437477758178030.png" alt="在这里插入图片描述" loading="lazy"></p><h3 id="创建配置文件-2" tabindex="-1"><a class="header-anchor" href="#创建配置文件-2" aria-hidden="true">#</a> 创建配置文件</h3><p>创建HikariCP.properties</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 驱动参数
jdbcUrl=jdbc:mysql://localhost:3306/vehicleUpkeepDB?characterEncoding=utf8&amp;serverTimezone=GMT%2B8
#驱动名称(连接MySql)
DriverClassName = com.mysql.cj.jdbc.Driver
#账号
username=root
#密码
password=sasa
上面的都是必须要的，下面都有默认参数一般不用配置

#常用的参数
# 从池中借出的连接是否默认自动提交事务
# 默认 true
autoCommit=true

# 当我从池中借出连接时，愿意等待多长时间。如果超时，将抛出 SQLException
# 默认 30000 ms，最小值 250 ms。支持 JMX 动态修改
connectionTimeout=30000

# 一个连接在池里闲置多久时会被抛弃
# 当 minimumIdle &lt; maximumPoolSize 才生效
# 默认值 600000 ms，最小值为 10000 ms，0表示禁用该功能。支持 JMX 动态修改
idleTimeout=600000

# 多久检查一次连接的活性
# 检查时会先把连接从池中拿出来（空闲的话），然后调用isValid()或执行connectionTestQuery来校验活性，如果通过校验，则放回池里。
# 默认 0 （不启用），最小值为 30000 ms，必须小于 maxLifetime。支持 JMX 动态修改
keepaliveTime=0

# 当一个连接存活了足够久，HikariCP 将会在它空闲时把它抛弃
# 默认 1800000 ms，最小值为 30000 ms，0 表示禁用该功能。支持 JMX 动态修改
maxLifetime=1800000

# 用来检查连接活性的 sql，要求是一个查询语句，常用select &#39;x&#39;
# 如果驱动支持 JDBC4.0，建议不设置，这时默认会调用 Connection.isValid() 来检查，该方式会更高效一些
# 默认为空
# connectionTestQuery=

# 池中至少要有多少空闲连接。
# 当空闲连接 &lt; minimumIdle，总连接 &lt; maximumPoolSize 时，将新增连接
# 默认等于 maximumPoolSize。支持 JMX 动态修改
minimumIdle=5

# 池中最多容纳多少连接（包括空闲的和在用的）
# 默认为 10。支持 JMX 动态修改
maximumPoolSize=10

# 用于记录连接池各项指标的 MetricRegistry 实现类
# 默认为空，只能通过代码设置
# metricRegistry=

# 用于报告连接池健康状态的 HealthCheckRegistry 实现类
# 默认为空，只能通过代码设置
# healthCheckRegistry=

# 连接池名称。
# 默认自动生成
poolName=zzsCP

#少用的参数
# 如果启动连接池时不能成功初始化连接，是否快速失败 TODO
# &gt;0 时，会尝试获取连接。如果获取时间超过指定时长，不会开启连接池，并抛出异常
# =0 时，会尝试获取并验证连接。如果获取成功但验证失败则不开启池，但是如果获取失败还是会开启池
# &lt;0 时，不管是否获取或校验成功都会开启池。
# 默认为 1
initializationFailTimeout=1

# 是否在事务中隔离 HikariCP 自己的查询。
# autoCommit 为 false 时才生效
# 默认 false
isolateInternalQueries=false

# 是否允许通过 JMX 挂起和恢复连接池
# 默认为 false
allowPoolSuspension=false

# 当连接从池中取出时是否设置为只读
# 默认值 false
readOnly=false

# 是否开启 JMX
# 默认 false
registerMbeans=true

# 数据库 catalog
# 默认由驱动决定
# catalog=

# 在每个连接创建后、放入池前，需要执行的初始化语句
# 如果执行失败，该连接会被丢弃
# 默认为空
# connectionInitSql=

# JDBC 驱动使用的 Driver 实现类
# 一般根据 jdbcUrl 判断就行，报错说找不到驱动时才需要加
# 默认为空
# driverClassName=

# 连接的默认事务隔离级别
# 默认值为空，由驱动决定
# transactionIsolation=

# 校验连接活性允许的超时时间
# 默认 5000 ms，最小值为 250 ms，要求小于 connectionTimeout。支持 JMX 动态修改
validationTimeout=5000

# 连接对象可以被借出多久
# 默认 0（不开启），最小允许值为 2000 ms。支持 JMX 动态修改
leakDetectionThreshold=0

# 直接指定 DataSource 实例，而不是通过 dataSourceClassName 来反射构造
# 默认为空，只能通过代码设置
# dataSource=

# 数据库 schema
# 默认由驱动决定
# schema=

# 指定连接池获取线程的 ThreadFactory 实例
# 默认为空，只能通过代码设置
# threadFactory=

# 指定连接池开启定时任务的 ScheduledExecutorService 实例（建议设置setRemoveOnCancelPolicy(true)）
# 默认为空，只能通过代码设置
# scheduledExecutor=

# JNDI 配置的数据源名
# 默认为空
# dataSourceJndiName=null
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="测试连接-2" tabindex="-1"><a class="header-anchor" href="#测试连接-2" aria-hidden="true">#</a> 测试连接</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">//加载配置文件</span>
<span class="token class-name">HikariConfig</span> hikariConfig <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HikariConfig</span><span class="token punctuation">(</span><span class="token string">&quot;src\\\\HikariCP.properties&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//在工厂中创建一个数据源,数据源的连接信息来源于hikariConfig配置文件中</span>
<span class="token class-name">HikariDataSource</span> ds <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HikariDataSource</span><span class="token punctuation">(</span>hikariConfig<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//获取连接</span>
<span class="token class-name">Connection</span> conn <span class="token operator">=</span> ds<span class="token punctuation">.</span><span class="token function">getConnection</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//执行sql语句</span>
<span class="token class-name">ResultSet</span> rs <span class="token operator">=</span> conn<span class="token punctuation">.</span><span class="token function">prepareStatement</span><span class="token punctuation">(</span><span class="token string">&quot;select count(*) from user&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">executeQuery</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//处理结果</span>
<span class="token keyword">while</span> <span class="token punctuation">(</span>rs<span class="token punctuation">.</span><span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>rs<span class="token punctuation">.</span><span class="token function">getInt</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">//释放资源</span>
conn<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
rs<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>结果 <img src="https://img-blog.csdnimg.cn/direct/39a0d90c9534448fb1af4a00be936d8c.png" alt="在这里插入图片描述" loading="lazy"> 这样就是连接成功了！</p><h2 id="七、dbcp连接池" tabindex="-1"><a class="header-anchor" href="#七、dbcp连接池" aria-hidden="true">#</a> 七、DBCP连接池</h2><p>DBCP需要下载两个jar包</p>`,10),y={href:"https://commons.apache.org/proper/commons-dbcp/download_dbcp.cgi",target:"_blank",rel:"noopener noreferrer"},S={href:"https://commons.apache.org/proper/commons-pool/download_pool.cgi",target:"_blank",rel:"noopener noreferrer"},C=i(`<h3 id="下载jar包-3" tabindex="-1"><a class="header-anchor" href="#下载jar包-3" aria-hidden="true">#</a> 下载jar包</h3><p>两个都是这个位置 <img src="https://img-blog.csdnimg.cn/direct/9518484f4a3b47bc98610d3675f2a34a.png" alt="在这里插入图片描述" loading="lazy"></p><h3 id="配置文件" tabindex="-1"><a class="header-anchor" href="#配置文件" aria-hidden="true">#</a> 配置文件</h3><p>创建DBCP.properties</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>#数据库连接地址
#url=jdbc:mysql://localhost:3306/数据库名（?配置参数）
url=jdbc:mysql://localhost:3306/vehicleUpkeepDB?useUnicode=true&amp;characterEncoding=utf-8
#数据库驱动类的全名
#driverClassName=com.mysql.jdbc.Driver
#数据库帐号
username=root
#数据库密码 等于号后面直接填密码，不需要引号，密码为空时可以不填或 &quot;&quot;
password=sasa
#初始化连接池时,创建的连接数量
initialSize=5
#连接池的最大连接容量，连接使用完后不释放会很容易达到最大值，导致之后的连接被卡住
maxActive=20
#空闲时允许保留的最大连接数量
maxIdle=5
#空闲时允许保留的最小连接数量
minIdle=5
#排队等候的超时时间(毫秒)
maxWait=3000

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="测试连接-3" tabindex="-1"><a class="header-anchor" href="#测试连接-3" aria-hidden="true">#</a> 测试连接</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">//文件输入流</span>
<span class="token class-name">InputStream</span> is <span class="token operator">=</span> <span class="token class-name">DBCP_Demo</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">.</span><span class="token function">getClassLoader</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getResourceAsStream</span><span class="token punctuation">(</span><span class="token string">&quot;DBCP.properties&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//将配置文件,转换为Properties对象</span>
<span class="token class-name">Properties</span> ppt <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Properties</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
ppt<span class="token punctuation">.</span><span class="token function">load</span><span class="token punctuation">(</span>is<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//通过连接池的工厂类(DruidDataSourceFactory)的创建连接池的方法(createDataSource())</span>
<span class="token class-name">DataSource</span> ds <span class="token operator">=</span> <span class="token class-name">BasicDataSourceFactory</span><span class="token punctuation">.</span><span class="token function">createDataSource</span><span class="token punctuation">(</span>ppt<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//从连接池,获取连接对象</span>
<span class="token class-name">Connection</span> con <span class="token operator">=</span> ds<span class="token punctuation">.</span><span class="token function">getConnection</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//对sql语句进行预处理</span>
<span class="token class-name">PreparedStatement</span> ps <span class="token operator">=</span> con<span class="token punctuation">.</span><span class="token function">prepareStatement</span><span class="token punctuation">(</span><span class="token string">&quot;select count(*) from user&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//执行命令</span>
<span class="token class-name">ResultSet</span> re <span class="token operator">=</span> ps<span class="token punctuation">.</span><span class="token function">executeQuery</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//处理结果</span>
<span class="token keyword">if</span><span class="token punctuation">(</span>re<span class="token punctuation">.</span><span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
<span class="token keyword">int</span> anInt <span class="token operator">=</span> re<span class="token punctuation">.</span><span class="token function">getInt</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>anInt<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">//释放资源</span>
re<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
ps<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
con<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>结果： <img src="https://img-blog.csdnimg.cn/direct/aacec267ec76445ea64277a0ac926725.png" alt="在这里插入图片描述" loading="lazy"></p><h3 id="可能遇到的问题" tabindex="-1"><a class="header-anchor" href="#可能遇到的问题" aria-hidden="true">#</a> 可能遇到的问题</h3><p>NoClassDefFoundError 错误</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Exception in thread &quot;main&quot; java.lang.NoClassDefFoundError: Could not initialize class lesson04.utils.JDBCUtils_DBCP
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,11),q={href:"https://commons.apache.org/proper/commons-logging/download_logging.cgi",target:"_blank",rel:"noopener noreferrer"};function D(P,w){const a=c("ExternalLinkIcon");return l(),o("div",null,[r,s("p",null,[n("MySql.jar包："),s("a",d,[n("https://dev.mysql.com/downloads/connector/j/"),e(a)])]),u,s("p",null,[n("C3P0jar包： "),s("a",v,[n("https://sourceforge.net/projects/c3p0/"),e(a)]),m]),k,s("p",null,[n("driuid.jar包:"),s("a",b,[n("https://repo1.maven.org/maven2/com/alibaba/druid/1.2.0/"),e(a)]),h,n(" 导入项目，所有步骤都是一样的，不会就看上面c3p0")]),g,s("p",null,[n("HiariCP.jar包："),s("a",f,[n("https://repo1.maven.org/maven2/com/zaxxer/HikariCP/4.0.3/"),e(a)]),n(" slf4j.jar包："),s("a",x,[n("https://repo1.maven.org/maven2/org/slf4j/slf4j-api/1.7.25/"),e(a)]),n(" log4j12.jar包："),s("a",_,[n("https://repo1.maven.org/maven2/org/slf4j/slf4j-log4j12/1.7.25/"),e(a)])]),j,s("p",null,[n("DBCP.jar包："),s("a",y,[n("https://commons.apache.org/proper/commons-dbcp/download_dbcp.cgi"),e(a)])]),s("p",null,[n("pool.jar包："),s("a",S,[n("https://commons.apache.org/proper/commons-pool/download_pool.cgi"),e(a)])]),C,s("p",null,[n("原因：DBCP2之后的版本需要 logging 包 官网下载："),s("a",q,[n("https://commons.apache.org/proper/commons-logging/download_logging.cgi"),e(a)]),n(" 按照上面的步骤导入 IDEA 中即可")])])}const I=t(p,[["render",D],["__file","java中C3P0、Druid、HikariCP 、DBCP连接池的jar包下载与IDEA配置.html.vue"]]);export{I as default};
