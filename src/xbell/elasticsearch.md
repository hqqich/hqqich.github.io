# 1、windows

## 2

### 创建索引

> PUT> `http://127.0.0.1:9200/customer?pretty`
>
> pretty的意思是响应（如果有的话）以JSON格式返回
>
> 返回数据
>
> ```json
> {
>   "acknowledged" : true,
>   "shards_acknowledged" : true,
>   "index" : "customer"
> }
> ```
>
> 

### 往索引插入文档数据

> PUT> `http://127.0.0.1:9200/customer/_doc/1?pretty`
>
> 写入数据
>
> ```json
> {
>     "name":"John Doe"
> }
> ```
>
> 返回数据
>
> ```json
> {
>     "_index": "customer",
>     "_type": "_doc",
>     "_id": "1",
>     "_version": 1,
>     "result": "created",
>     "_shards": {
>         "total": 2,
>         "successful": 1,
>         "failed": 0
>     },
>     "_seq_no": 0,
>     "_primary_term": 1
> }
> ```
>
> 查询写入的数据
>
> GET> `http://127.0.0.1:9200/customer/_doc/1?pretty`
>
> ```json
> {
>     "_index": "customer",
>     "_type": "_doc",
>     "_id": "1",
>     "_version": 1,
>     "_seq_no": 0,
>     "_primary_term": 1,
>     "found": true,
>     "_source": {
>         "name": "John Doe"
>     }
> }
> ```
>
> 

















## kibana

查看当前有的索引：`http://localhost:9200/_cat/indices?v`





# 2.ubuntu

## 安装

> 有jdk 的基础上
>
> ```shell
> wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
> sudo apt-get install apt-transport-https
> echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-7.x.list
> sudo apt-get update
> sudo apt-get install elasticsearch
> ```
>
> 









外网访问

配置文件：`/etc/elasticsearch/elasticsearch.yml` 2地方配置

```yaml
# ---------------------------------- Network -----------------------------------
#
# By default Elasticsearch is only accessible on localhost. Set a different
# address here to expose this node on the network:
#
#network.host: 192.168.0.1
network.host: 0.0.0.0 
#
# By default Elasticsearch listens for HTTP traffic on the first free port it
# finds starting at 9200. Set a specific HTTP port here:
#
http.port: 9200 
#
# For more information, consult the network module documentation.
#
# --------------------------------- Discovery ----------------------------------
#
# Pass an initial list of hosts to perform discovery when this node is started:
# The default list of hosts is ["127.0.0.1", "[::1]"]
#
#discovery.seed_hosts: ["host1", "host2"]
discovery.seed_hosts: ["0.0.0.0"] 
#
# Bootstrap the cluster using an initial set of master-eligible nodes:
#
#cluster.initial_master_nodes: ["node-1", "node-2"]
#
# For more information, consult the discovery and cluster formation module documentation.
```

