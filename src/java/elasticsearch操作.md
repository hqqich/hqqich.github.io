# ES

# BoolQueryBuilder

### 查询QueryBuilders

`BoolQueryBuilder queryBuilder= QueryBuilders.boolQuery();`

1. matchAllQuery匹配所有

   `queryBuilder.matchAllQuery();`

2. termQuery精准匹配，大小写敏感且不支持

   `queryBuilder.termQuery("key", value)` 一次匹配一个值，完全匹配

   `queryBuilder.termsQuery("key", obj1, obj2..)  ` 一次匹配多个值

3. matchPhraseQuery对中文精确匹配

   `queryBuilder.matchPhraseQuery("key", value)`

4. matchQuery("key", Obj) 单个匹配, field不支持通配符, 前缀具高级特性

   `queryBuilder.matchQuery(key, value);`

5. multiMatchQuery("text", "field1", "field2"..); 匹配多个字段, field有通配符忒行

   `queryBuilder.multiMatchQuery(value, key1, key2, key3);`

6. 组合查询

   - must:   AND

   - mustNot: NOT

   - should:: OR

     `queryBuilder.must(QueryBuilders.termQuery("user", "kimchy")).mustNot(QueryBuilders.termQuery("message", "nihao")).should(QueryBuilders.termQuery("gender", "male"));`

### BoolQueryBuilder 实现and or多条件分页求和查询（ElasticsearchTemplate 实现）

```java
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.client.Client;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.elasticsearch.search.SearchHit;
import org.springframework.data.elasticsearch.core.query.SearchQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
 
public class TestController{
 
	@Autowired
	private ElasticsearchTemplate elasticsearchTemplate;
	
    public void searchQuery(){
        TermQueryBuilder aQuery =null;
        TermQueryBuilder bQuery = null;
        //es查询器
        Client client = elasticsearchTemplate.getClient();
		// 创建查询索引
	    SearchRequestBuilder searchRequestBuilder =   client.prepareSearch("es_info").setTypes("case");
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        BoolQueryBuilder query= QueryBuilders.boolQuery();
 
        BoolQueryBuilder bqb1 = QueryBuilders.boolQuery();
        aQuery = QueryBuilders.termQuery("a", "451");
        aQuery = QueryBuilders.termQuery("b", "aa");
        bqb1.must(aQuery);
 
        BoolQueryBuilder bqb2 = QueryBuilders.boolQuery();
        bQuery = QueryBuilders.termQuery("a", "452");
        bQuery = QueryBuilders.termQuery("b", "cc");
        bqb2.must(bQuery);
 
        query.should(bqb1);
        query.should(bqb2);
        searchSourceBuilder.postFilter(query);
 
       Pageable pageable = PageRequest.of(page - 1, limit);
       //不求和
       SearchQuery searchQuery = new NativeSearchQueryBuilder().withQuery(query).withPageable(pageable).build();
       //求和
       TermsAggregationBuilder agg = AggregationBuilders.terms("sum").field("aa").size(30);
       searchRequestBuilder.setQuery(query).addAggregation(agg);
       SearchResponse rs = searchRequestBuilder.execute().actionGet();
	   Terms terms = rs.getAggregations().get("sum");
    }
}
```

# Spring中，使用RestHighLevelClient查询es

elasticsearch 的java驱动中，提供了许多查询尔对构造方式，如下：

```
org.elasticsearch.index.query.QueryBuilders
```

| queryName              | 说明                             | 关键词分词 |
| :--------------------- | :------------------------------- | :--------- |
| matchAllQuery          | 查询所有                         |            |
| matchQuery             |                                  | 分词       |
| multiMatchQuery        |                                  | 分词       |
| matchPhraseQuery       |                                  | 不         |
| matchPhrasePrefixQuery |                                  | 不         |
| idsQuery               | 根据_id查询文档                  |            |
| termQuery              | 匹配term                         | 不         |
| termsQuery             | 匹配任何一个term                 | 不         |
| fuzzyQuery             | 模糊，相似(自动判断)             |            |
| prefixQuery            | start with                       |            |
| rangeQuery             | 范围（gt、lt、gte、lte）         |            |
| wildcardQuery          | 模糊（*匹配任意、?匹配单个字符） |            |
| regexpQuery            | k.*y 匹配 ky、key                |            |
| queryStringQuery       | 编写query_string（不推荐）       |            |
| simpleQueryStringQuery | 编写query_string                 |            |
| existsQuery            | 存在某个字段                     |            |
|                        |                                  |            |

> Term查询不会对字段进行分词查询，会采用精确匹配。
>
> Match会根据该字段的分词器，进行分词查询。

es中有以上常用的查询，bool查询就是使用must、should、must_not组合以上各个查询的查询方式。

#### RestHighLevelClient查询es示例

```java
@Autowired
private RestHighLevelClient esClient;
/**
 * 使用boolQuery查询es
 * @param indices 索引名称
 * @return
 */
public Map<String, List<SearchHit>> esBoolQuery(String... indices) {
    SearchRequest searchRequest = new SearchRequest(indices);
    SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
    // 建立一个bool查询
    BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery();
    boolQueryBuilder.must(
            QueryBuilders.rangeQuery("month")
                    .gte(startMonth)
                    .lte(endMonth)
            )
            .mustNot(
                    QueryBuilders.matchPhraseQuery("idCardNo", idNo).boost(1.2F)
            )
            .filter(
                    QueryBuilders.fuzzyQuery("name", "王")
            )
            .filter(
                    QueryBuilders.wildcardQuery("name", "王*")
            );
    sourceBuilder.query(boolQueryBuilder);
    // 包含字段和忽略字段
    sourceBuilder.fetchSource(new String[]{"name", "age"}, new String[]{"id"});
    // 排序
    sourceBuilder.sort("name", SortOrder.DESC);
    // 分页
    sourceBuilder.from(0);
    sourceBuilder.size(10);
    // 聚合函数
    sourceBuilder.aggregation(AggregationBuilders.sum("age"));
    // 高亮
    HighlightBuilder highlightBuilder = new HighlightBuilder();
    highlightBuilder.preTags("<span class=\"highlight\">");
    highlightBuilder.postTags("</span>");
    highlightBuilder.fields().add(new HighlightBuilder.Field("name"));
    sourceBuilder.highlighter(highlightBuilder);
 
    searchRequest.source(sourceBuilder);
    // 查询
    SearchResponse response;
    try {
        response = esClient.search(searchRequest, RequestOptions.DEFAULT);
    } catch (IOException e) {
        LOGGER.error("es查询失败！", e);
        return null;
    }
    // 处理查询结果
    SearchHits hits = response.getHits();
 
    return Arrays.stream(hits.getHits()).collect(Collectors.groupingBy(SearchHit::getIndex));
}
```

