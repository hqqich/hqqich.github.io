# ffmpeg示例


## `ffmpeg -i 1G.mp4 1G.avi`

> 转换视频容器

- 获得输入源 1G.mp4
- 转码
- 输出文件 1G.avi

也可以使用以下命令 `ffmpeg -i 1G.mp4 -f avi 1G.dat`

`-f` 指定了输出文件的格式

解封装(Demuxing) => 解码(Decoding) => 编码(Encoding) => 封装📦(Muxing)

![test](./images/2023-07-11 20.58.20.png)
