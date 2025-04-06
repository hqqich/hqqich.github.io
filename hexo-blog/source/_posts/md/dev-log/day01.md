---
title: Day01
index: false
icon: laptop-code
category:
  - 开发笔记
  - 学习记录
---

## 遇到的问题

1. 数据库乱码问题

   测试模块 RPC 远程调用返回的结果为:

   ```json
   测试结果：{"activity":{"activityDesc":"?????????","activityId":100002,"activityName":"????","beginDateTime":1705215282000,"endDateTime":1705215282000,"stockCount":100,"takeCount":10},"result":{"code":"0000","info":"成功"}}
   ```

   明显的乱码问题，查看数据库，发现插入的时候就以及乱码了，看了一下配置文件中的数据库连接 url，发现使用了 useUnicode=true，并没有指定字符集，所以添加一下 utf-8 字符集即可，完整 url: `jdbc:mysql://127.0.0.1:3306/lottery?useUnicode=true&characterEncoding=UTF-8`

   再进行一轮测试，测试结果：

   ```json
   测试结果：{"activity":{"activityDesc":"仅用于插入数据测试","activityId":100003,"activityName":"测试活动","beginDateTime":1705218054000,"endDateTime":1705218054000,"stockCount":100,"takeCount":10},"result":{"code":"0000","info":"成功"}}
   ```
