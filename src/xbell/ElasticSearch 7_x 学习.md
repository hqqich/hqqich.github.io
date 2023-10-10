# url请求

## 高级搜索





```json
{
    "query": {
        "match_all": {  //全部匹配
        }
    },
    "from": 0,  //第几页， 从0开始
    "size": 5,  //一页几条数据
    "sort": [{
        "date": {
            "order": "desc"  //排序， 在前面先排序
        }
    },{
        "id": {
            "order": "asc"  //排序
        }
    }]
}
```





```json
{
    "query": {
        "exists": {  //查看index 中是否有这个字段
            "field": "name"  //前面表示字段，后面接上字段名，， 如果莫一条数据这个字段们没有值，就不显示，这个字段有值则显示
        }
    },
    "_source": ["title", "date"]  //显示时只显示这里面的字段
}
```





```json
{
    "query":{
        "term":{  //这个字段表示不会对传入的数据进行分词，
            "title": "elasticsearch a"  //这里将不会进行分词，全量搜索"elasticsearch a"，使用"match"就会分词
        }
    }
}
```





```json
{
    "query":{
        "terms":{  //和上面差不多，这个支持多个
            "title": ["elasticsearch", "a"]  //将2个条件的搜索结果合并起来  
        }
    }
}
```





##### 与match类似，会先将关键字分词，然后用每个分词去查询，但会对文档中分词间的间隔有一定限制，使用slop属性去限制，默认是0，需要小于设置的间隔，才能匹配文档。

>  例如：slop设置为0，则两个分词在文档中的位置必须是紧挨着，否则无法命中。

```json
{
	"query": {
		"match_phrase": {
			"title": {
				"query": "这是一篇 博客",
				"slop": 8
			}
		}
	}
}
```





```json
{
	"query": {
	    "ids": {  //通过ID集查询
	        "type": "_doc",
	        "values": ["1001", "8NreIH8B8JBq1iUAgZuE"]
	    }
	}
}
```



```json
{
	"query": {
	    "multi_match": {
	        "query": "博客",
	        "fields": ["title", "name"]  //传入的参数可以在多个字段中查询
	    }
	}
}
```



几个匹配条件：

- match  参数分词匹配
- match_all  匹配所有
- match_phrase  间隔查询
- terms  参数不分词,支持多个参数,查询后取并集
- term  参数不分词
- exists  看字段是否有值,有值则显示这条记录,没值则不显示这条记录
- ids 通过id集查询
- multi_match  参数匹配多个字段