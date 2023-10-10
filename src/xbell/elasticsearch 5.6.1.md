## 添加IK分词

> GitHub地址：https://github.com/medcl/elasticsearch-analysis-ik
>
> 自带安装命令（版本号一定要对应上）：`./bin/elasticsearch-plugin install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v6.3.0/elasticsearch-analysis-ik-6.3.0.zip`

#### 测试分词器分成啥样（有两种分词格式`ik_max_word`和`ik_smart`）

测试样例：

GET：`127.0.0.1:9200/_analyze?analyzer=ik_smart&pretty=true&text=剧TOP：一口气看完经典历史神剧《大明王朝1566》`

```json
{
	"tokens": [
		{
			"token": "剧",
			"start_offset": 0,
			"end_offset": 1,
			"type": "CN_CHAR",
			"position": 0
		},
		{
			"token": "top",
			"start_offset": 1,
			"end_offset": 4,
			"type": "ENGLISH",
			"position": 1
		},
		{
			"token": "一口气",
			"start_offset": 5,
			"end_offset": 8,
			"type": "CN_WORD",
			"position": 2
		},
		{
			"token": "看完",
			"start_offset": 8,
			"end_offset": 10,
			"type": "CN_WORD",
			"position": 3
		},
		{
			"token": "经典",
			"start_offset": 10,
			"end_offset": 12,
			"type": "CN_WORD",
			"position": 4
		},
		{
			"token": "历史",
			"start_offset": 12,
			"end_offset": 14,
			"type": "CN_WORD",
			"position": 5
		},
		{
			"token": "神剧",
			"start_offset": 14,
			"end_offset": 16,
			"type": "CN_WORD",
			"position": 6
		},
		{
			"token": "大明",
			"start_offset": 17,
			"end_offset": 19,
			"type": "CN_WORD",
			"position": 7
		},
		{
			"token": "王朝",
			"start_offset": 19,
			"end_offset": 21,
			"type": "CN_WORD",
			"position": 8
		},
		{
			"token": "1566",
			"start_offset": 21,
			"end_offset": 25,
			"type": "ARABIC",
			"position": 9
		}
	]
}
```



GET：`127.0.0.1:9200/_analyze?analyzer=ik_max_word&pretty=true&text=剧TOP：一口气看完经典历史神剧《大明王朝1566》`

```json
{
	"tokens": [
		{
			"token": "剧",
			"start_offset": 0,
			"end_offset": 1,
			"type": "CN_CHAR",
			"position": 0
		},
		{
			"token": "top",
			"start_offset": 1,
			"end_offset": 4,
			"type": "ENGLISH",
			"position": 1
		},
		{
			"token": "一口气",
			"start_offset": 5,
			"end_offset": 8,
			"type": "CN_WORD",
			"position": 2
		},
		{
			"token": "一口",
			"start_offset": 5,
			"end_offset": 7,
			"type": "CN_WORD",
			"position": 3
		},
		{
			"token": "一",
			"start_offset": 5,
			"end_offset": 6,
			"type": "TYPE_CNUM",
			"position": 4
		},
		{
			"token": "口气",
			"start_offset": 6,
			"end_offset": 8,
			"type": "CN_WORD",
			"position": 5
		},
		{
			"token": "口",
			"start_offset": 6,
			"end_offset": 7,
			"type": "COUNT",
			"position": 6
		},
		{
			"token": "气",
			"start_offset": 7,
			"end_offset": 8,
			"type": "CN_CHAR",
			"position": 7
		},
		{
			"token": "看完",
			"start_offset": 8,
			"end_offset": 10,
			"type": "CN_WORD",
			"position": 8
		},
		{
			"token": "经典",
			"start_offset": 10,
			"end_offset": 12,
			"type": "CN_WORD",
			"position": 9
		},
		{
			"token": "历史",
			"start_offset": 12,
			"end_offset": 14,
			"type": "CN_WORD",
			"position": 10
		},
		{
			"token": "神剧",
			"start_offset": 14,
			"end_offset": 16,
			"type": "CN_WORD",
			"position": 11
		},
		{
			"token": "大明",
			"start_offset": 17,
			"end_offset": 19,
			"type": "CN_WORD",
			"position": 12
		},
		{
			"token": "明王朝",
			"start_offset": 18,
			"end_offset": 21,
			"type": "CN_WORD",
			"position": 13
		},
		{
			"token": "明王",
			"start_offset": 18,
			"end_offset": 20,
			"type": "CN_WORD",
			"position": 14
		},
		{
			"token": "王朝",
			"start_offset": 19,
			"end_offset": 21,
			"type": "CN_WORD",
			"position": 15
		},
		{
			"token": "1566",
			"start_offset": 21,
			"end_offset": 25,
			"type": "ARABIC",
			"position": 16
		}
	]
}
```

