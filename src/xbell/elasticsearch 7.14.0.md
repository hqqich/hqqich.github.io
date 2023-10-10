# elasticsearch 7.14.0

https://docs.spring.io/spring-data/elasticsearch/docs/



![img](https://img2020.cnblogs.com/blog/318789/202010/318789-20201001224440958-1667060143.png)

**elasticsearch配置文件中http.cors.x字段有哪些用途和用法**

```bash
http.cors.enabled	是否支持跨域，默认为false
http.cors.allow-origin	当设置允许跨域，默认为*,表示支持所有域名，如果我们只是允许某些网站能访问，那么可以使用正则表达式。比如只允许本地地址。 /https?:\/\/localhost(:[0-9]+)?/
http.cors.max-age	浏览器发送一个“预检”OPTIONS请求，以确定CORS设置。最大年龄定义多久的结果应该缓存。默认为1728000（20天）
http.cors.allow-methods	允许跨域的请求方式，默认OPTIONS,HEAD,GET,POST,PUT,DELETE
http.cors.allow-headers	跨域允许设置的头信息，默认为X-Requested-With,Content-Type,Content-Length
http.cors.allow-credentials	是否返回设置的跨域Access-Control-Allow-Credentials头，如果设置为true,那么会返回给客户端。
```



## 增删改查

#### 创建一个索引

（Index）shopping:PUT（`/shopping`）

```json
//返回数据
{
    "acknowledged": true,
    "shards_acknowledged": true,
    "index": "shopping"
}
```

查看index:GET（`/_cat/indices?v`）

`yellow open   shopping                        gVM2gR34T1u5GbuBiZb1BA   1   1          0            0       208b           208b`

查看shopping:GET（`/shopping`）

```json
{
    "shopping": {
        "aliases": {},
        "mappings": {},
        "settings": {
            "index": {
                "routing": {
                    "allocation": {
                        "include": {
                            "_tier_preference": "data_content"
                        }
                    }
                },
                "number_of_shards": "1",
                "provided_name": "shopping",
                "creation_date": "1638076434458",
                "number_of_replicas": "1",
                "uuid": "gVM2gR34T1u5GbuBiZb1BA",
                "version": {
                    "created": "7140099"
                }
            }
        }
    }
}
```



#### 创建一个索引，通过mapping



#### 新增数据

> 新版本没有type概念，直接向index中添加数据

POST:`/shopping/_doc`

```json
//请求体
{
    "title":"小米手机",
    "category":"小米",
    "images":"http://www.images.com/xm.jpg",
    "price":"3999.00"
}

//返回数据
{
    "_index": "shopping",
    "_type": "_doc",
    "_id": "VOQJZX0Br2sQrkFla9lI",
    "_version": 1,
    "result": "created",
    "_shards": {
        "total": 2,
        "successful": 1,
        "failed": 0
    },
    "_seq_no": 0,
    "_primary_term": 1
}
```

查看shopping中所有的数据GET`/shopping/_search`

```json
{
    "took": 480,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 1,
            "relation": "eq"
        },
        "max_score": 1,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "VOQJZX0Br2sQrkFla9lI",
                "_score": 1,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.images.com/xm.jpg",
                    "price": "3999.00"
                }
            }
        ]
    }
}
```

#### 自定义ID的新增数据

POST:`/shopping/_doc/1001`

```json
//请求体
{
    "title":"华为手机",
    "category":"华为",
    "images":"http://www.images.com/hw.jpg",
    "price":"6999.00"
}

//返回数据
{
    "_index": "shopping",
    "_type": "_doc",
    "_id": "1001",
    "_version": 1,
    "result": "created",
    "_shards": {
        "total": 2,
        "successful": 1,
        "failed": 0
    },
    "_seq_no": 1,
    "_primary_term": 1
}
```



#### 更新数据(全量)

PUT:`/shopping/_doc/1001`

```json
//请求体
{
    "title":"华为手机",
    "category":"华为",
    "images":"http://www.images.com/hw.jpg",
    "price":"7999.00"
}

//返回数据
{
    "_index": "shopping",
    "_type": "_doc",
    "_id": "1001",
    "_version": 2,
    "result": "updated",
    "_shards": {
        "total": 2,
        "successful": 1,
        "failed": 0
    },
    "_seq_no": 2,
    "_primary_term": 1
}
```

#### 更新数据(局部)

POST:`/shopping/_update/1001`

```json
//请求体
{
    "doc":{
        "title":"荣耀手机"
    }
}

//返回数据
{
    "_index": "shopping",
    "_type": "_doc",
    "_id": "1001",
    "_version": 3,
    "result": "updated",
    "_shards": {
        "total": 2,
        "successful": 1,
        "failed": 0
    },
    "_seq_no": 3,
    "_primary_term": 1
}
```

#### 删除一条数据

DELETE:`/shopping/_doc/1001`

```json
{
    "_index": "shopping",
    "_type": "_doc",
    "_id": "1001",
    "_version": 4,
    "result": "deleted",
    "_shards": {
        "total": 2,
        "successful": 1,
        "failed": 0
    },
    "_seq_no": 4,
    "_primary_term": 1
}
```



## 查询进阶

#### 条件查询，URL方式

`/shopping/_search?q=category:小米`

```json
{
    "took": 1,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 1,
            "relation": "eq"
        },
        "max_score": 1.3862942,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "VOQJZX0Br2sQrkFla9lI",
                "_score": 1.3862942,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.images.com/xm.jpg",
                    "price": "3999.00"
                }
            }
        ]
    }
}
```

#### 条件查询，请求体方式

GET `/shopping/_search`

```json
//请求体
{
    "query" : {
        "match" : {
            "category":"华为"
        }
    }
}

//返回数据
{
    "took": 1,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 2,
            "relation": "eq"
        },
        "max_score": 2.7074363,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "VeQmZX0Br2sQrkFlS9nc",
                "_score": 2.7074363,
                "_source": {
                    "title": "华为手机",
                    "category": "华为",
                    "images": "http://www.images.com/hw.jpg",
                    "price": "5999.00"
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "WOQnZX0Br2sQrkFl69mD",
                "_score": 2.7074363,
                "_source": {
                    "title": "荣耀手机",
                    "category": "华为",
                    "images": "http://www.images.com/ry.jpg",
                    "price": "3999.00"
                }
            }
        ]
    }
}
```

#### 条件查询，请求体方式，全查询

GET `/shopping/_search`

```json
//请求体
{
    "query" : {
        "match_all" : {
            
        }
    }
}

//返回数据
{
    "took": 0,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 9,
            "relation": "eq"
        },
        "max_score": 1,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "VOQJZX0Br2sQrkFla9lI",
                "_score": 1,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.images.com/xm.jpg",
                    "price": "3999.00"
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "VeQmZX0Br2sQrkFlS9nc",
                "_score": 1,
                "_source": {
                    "title": "华为手机",
                    "category": "华为",
                    "images": "http://www.images.com/hw.jpg",
                    "price": "5999.00"
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "VuQmZX0Br2sQrkFlvNmY",
                "_score": 1,
                "_source": {
                    "title": "三星手机",
                    "category": "三星",
                    "images": "http://www.images.com/sx.jpg",
                    "price": "4999.00"
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "V-QnZX0Br2sQrkFlV9ky",
                "_score": 1,
                "_source": {
                    "title": "iphone手机",
                    "category": "apple",
                    "images": "http://www.images.com/iphone.jpg",
                    "price": "5999.00"
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "WOQnZX0Br2sQrkFl69mD",
                "_score": 1,
                "_source": {
                    "title": "荣耀手机",
                    "category": "华为",
                    "images": "http://www.images.com/ry.jpg",
                    "price": "3999.00"
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "WeQoZX0Br2sQrkFlsNnm",
                "_score": 1,
                "_source": {
                    "title": "pixel手机",
                    "category": "google",
                    "images": "http://www.images.com/pixel.jpg",
                    "price": "4999.00"
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "WuQpZX0Br2sQrkFlJNlg",
                "_score": 1,
                "_source": {
                    "title": "oppo手机",
                    "category": "步步高",
                    "images": "http://www.images.com/oppo.jpg",
                    "price": "7999.00"
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "W-QqZX0Br2sQrkFlA9lH",
                "_score": 1,
                "_source": {
                    "title": "vivo手机",
                    "category": "步步高",
                    "images": "http://www.images.com/vivo.jpg",
                    "price": "8999.00"
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "XOQrZX0Br2sQrkFlAdl9",
                "_score": 1,
                "_source": {
                    "title": "1+手机",
                    "category": "oneplus",
                    "images": "http://www.images.com/1plus.jpg",
                    "price": "4999.00"
                }
            }
        ]
    }
}
```

#### 条件查询，请求体方式，全查询，分页

GET `/shopping/_search`

from 计算公式 ： (页码 - 1) * 每页数据条数

```json
{
    "query" : {
        "match_all" : {

        }
    },
    "from" : 0,
    "size" : 2
}

//返回体
{
    "took": 0,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 9,
            "relation": "eq"
        },
        "max_score": 1,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "VOQJZX0Br2sQrkFla9lI",
                "_score": 1,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.images.com/xm.jpg",
                    "price": "3999.00"
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "VeQmZX0Br2sQrkFlS9nc",
                "_score": 1,
                "_source": {
                    "title": "华为手机",
                    "category": "华为",
                    "images": "http://www.images.com/hw.jpg",
                    "price": "5999.00"
                }
            }
        ]
    }
}
```

#### 条件查询，请求体方式，全查询，分页，指定需要查的字段

```json
{
    "query" : {
        "match_all" : {

        }
    },
    "from" : 0,
    "size" : 2,
    "_source" : ["title"]
}


//返回体
{
    "took": 1,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 9,
            "relation": "eq"
        },
        "max_score": 1,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "VOQJZX0Br2sQrkFla9lI",
                "_score": 1,
                "_source": {
                    "title": "小米手机"
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "VeQmZX0Br2sQrkFlS9nc",
                "_score": 1,
                "_source": {
                    "title": "华为手机"
                }
            }
        ]
    }
}

//或者多个参数请求体
{
    "query" : {
        "match_all" : {

        }
    },
    "from" : 0,
    "size" : 2,
    "_source" : ["title", "price"]
}

//返回体
{
    "took": 0,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 9,
            "relation": "eq"
        },
        "max_score": 1,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "VOQJZX0Br2sQrkFla9lI",
                "_score": 1,
                "_source": {
                    "price": "3999.00",
                    "title": "小米手机"
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "VeQmZX0Br2sQrkFlS9nc",
                "_score": 1,
                "_source": {
                    "price": "5999.00",
                    "title": "华为手机"
                }
            }
        ]
    }
}
```

#### 条件查询，请求体方式，全查询，分页，指定需要查的字段，排序



```json
{
    "query" : {
        "match_all" : {

        }
    },
    "from" : 0,
    "size" : 2,
    "_source" : ["title", "price"],
    "sort" : {
        "price" : {
            "order" : "asc"
        }
    }
}
```





#### 多个匹配

```json
//查询category为华为
{
    "query" : {
        "bool" : {
            "must" : [
                {
                    "match" : {
                        "category" : "华为"
                    }
                }
            ]
        }
    }
}

//查询category为华为且price为3999.00的
{
    "query" : {
        "bool" : {
            "must" : [
                {
                    "match" : {
                        "category" : "华为"
                    }
                },
                {
                    "match" : {
                        "price" : "3999.00"
                    }
                }
            ]
        }
    }
}

//查询category为华为或者为小米
{
    "query" : {
        "bool" : {
            "should" : [
                {
                    "match" : {
                        "category" : "华为"
                    }
                },
                {
                    "match" : {
                        "category" : "小米"
                    }
                }
            ]
        }
    }
}

//追加添加大于6000的数据
{
    "query" : {
        "bool" : {
            "should" : [
                {
                    "match" : {
                        "category" : "华为"
                    }
                },
                {
                    "match" : {
                        "category" : "小米"
                    }
                }
            ],
            "filter" : {
                "range" : {
                    "price" : {
                        "gt" : 6000
                    }
                }
            }
        }
    }
}
```





#### 完全匹配查询

```json
//不完全匹配下，可以查到包含“小”和“华”的数据
{
    "query" : {
        "match" : {
            "category" : "小华"
        }
    }
}
//完全匹配下，这个是查不到的，因为不会查到包含“小华”的数据
{
    "query" : {
        "match_phrase" : {
            "category" : "小华"
        }
    }
}
```



#### 高亮显示查询

```json
//请求体
{
    "query" : {
        "match_phrase" : {
            "category" : "小"
        }
    },
    "highlight" : {
        "fields" : {
            "category" : {}
        }
    }
}

//返回体
{
    "took": 36,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 1,
            "relation": "eq"
        },
        "max_score": 1.85254,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "VOQJZX0Br2sQrkFla9lI",
                "_score": 1.85254,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.images.com/xm.jpg",
                    "price": "3999.00"
                },
                "highlight": {
                    "category": [
                        "<em>小</em>米"
                    ]
                }
            }
        ]
    }
}
```



#### 聚合查询

```json
//根据价格，统计数量
{
    "aggs" : { //聚合操作
        "price_group" : { //名称，随便取
            "terms" : { //分组
                "field" : "price" //分组字段
            }
        }
    }
}


//根据价格，统计数量，不显示原始数据
{
    "aggs" : { //聚合操作
        "price_group" : { //名称，随便取
            "terms" : { //分组
                "field" : "price" //分组字段
            }
        }
    },
    "size" : 0 //不用查原始数据
}

//求价格的平均值
{
    "aggs" : { //聚合操作
        "price_avg" : { //名称，随便取
            "avg" : { //平均值
                "field" : "price" //分组字段
            }
        }
    },
    "size" : 0 //不用查原始数据
}
```





## 映射关系

1. 创建索引

   PUT `/user`

2. 