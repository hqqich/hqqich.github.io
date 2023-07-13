# ffmpeg工具使用




## ffmpeg指令

#### ffmpeg -formats

查看支持的视频文件格式

#### ffmpeg -help

查看帮助信息

#### ffmpeg -codecs

查看支持的所有编解码器

#### ffmpeg -encoders

查看支持的编码器

#### ffmpeg -decoders

查看支持的解码器

#### ffmpeg -h muxer=flv

查看 flv 格式封装器的参数支持

#### ffmpeg -h demuxer=flv

查看 flv 格式解封装器的参数支持

#### ffmpeg -h encoder=h264

查看H.264(AVC)编码参数支持

#### ffmpeg -h decoder=h264

查看H.264(AVC)解码参数支持

#### ffmpeg -h filter=colorkey

查看colorkey滤镜的参数支持

## 封装，编码

- 通过 libavformat 库进行封装和解封装
- 通过 libavcodec 库进行编码和解码

## 例子

### `ffmpeg -i input.rmvb -vcodec mpeg4 -b:v 200k -r 15 -an output.mp4`

- 转封装格式从RMVB格式转换为MP4格式
- 视频编码从RV40转换为MPEG4格式
- 视频码率从原来的 377kbit/s转换为200kbit/s
- 视频帧率从原来的 23.98fps转换为15fps
- 转码后的文件中不包括音频(-an参数）

## ffprobe 使用

### `ffprobe -show_packets 1G.mp4`

查看多媒体数据包信息

### `ffprobe -show_data -show_packets 1G.mp4`

组合参数查看包具体数据

### `ffprobe -show_format 1G.mp4`

显示视频封装格式

### `ffprobe -show_frames 1G.mp4`

显示视频封装的帧信息

### `ffprobe -show_streams 1G.mp4`

查看多媒体文件中的流信息

- `ffprobe -of xml -show_streams 1G.mp4 > a.xml`  将格式的xml数据覆盖到a.xml中

- `ffprobe -of xml -show_streams 1G.mp4 >> b.xml` 将格式的xml数据追加到b.xml中

- `ffprobe -of ini -show_streams 1G.mp4 > c.ini`  将格式的ini数据覆盖到c.ini中

- `ffprobe -of flat -show_streams 1G.mp4 > d.flat` 将格式的flat数据覆盖到d.flat中

- `ffprobe -of json -show_streams 1G.mp4 > e.json` 将格式的json数据覆盖到e.json中

- `ffprobe -of csv -show_streams 1G.mp4 > f.csv` 将格式的csv数据覆盖到f.csv中


### `ffprobe -show_frames -select_streams v -of xml 1G.mp4`

使用select_streams可以只查看音频(a)、视频 (v)、 字幕（ s）的信息， 例如配合show_ frames查看视频的frames信息

- `ffprobe -show_frames -select_streams v -of xml 1G.mp4 > a.xml`  将格式的xml数据覆盖到a.xml中


## ffplay 命令

> fplay不仅仅是播放器，同时也是测试ffmpeg的codec引擎、format引擎，以及filter引擎的工具， 并且还可以进行可视化的媒体参数分析， 其可以通过ffplay --help进行查看：

常用参数：

| 选项                    | 说明                                                         | 原文                                                         |
| :---------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| -x width                | 强制显示宽度                                                 | .D....... Initial x coordinate. (from 0 to INT_MAX) (default 0) |
| -y height               | 强制显示高度                                                 | .D....... Initial y coordinate. (from 0 to INT_MAX) (default 0) |
| -video_size size        | 帧尺寸 设置显示帧存储(WxH格式)，仅适用于类似原始YUV等没有包含帧大小(WxH)的视频 | .D....... A string describing frame size, such as 640x480 or hd720. (default "vga") |
| -pixel_format format    | 设置像素格式                                                 | .D....... set video pixel format                             |
| -fs                     | 以全屏模式启动                                               | force full screen                                            |
| -an                     | 禁用音频                                                     | disable audio                                                |
| -vn                     | 禁用视频                                                     | disable video                                                |
| -sn                     | 禁用字幕                                                     | diable subtitling                                            |
| -ss pos                 | 根据设置的位置进行定位播放                                   | seek to a given position in seconds                          |
| -t duration             | 设置播放视频/音频时长                                        | play "duration" seconds of audio/video                       |
| -bytes val              | 以字节为单位进行定位播放                                     | seek by bytes 0=off 1=on -1=auto                             |
| -seek_interval interval | 自定义左/右键定位拖动间隔                                    | set seek interval for left/right keys, in seconds            |
| -nodisp                 | 关闭图形显示，不显示视频。。。                               | disable graphical display                                    |
| -volume volume          | 设置起始音量                                                 | set startup volume 0=min 100=max                             |
| -f fmt                  | 强制使用指定格式解码                                         | force format                                                 |
| -window_title title     | 设置窗口标题（默认为文件名）                                 | set window title                                             |
| -loop number            | 设置播放循环次数                                             | set number of times the playback shall be looped             |
| -showmode mode          | 设置显示模式,可用的模式值: 0 显示视频,1 显示音频波形,2 显示音频频谱。缺省为0,如果视频不存在则自动选择2 | select show mode (0 = video, 1 = waves, 2 = RDFT)            |
| -vf filter_graph        | 设置视频滤镜                                                 | set video filters                                            |
| -af filter_graph        | 设置音频滤镜                                                 | set audio filters                                            |


高级选项 Advanced Options：

| 参数                                  | 说明                                                         | 原文                                                         |
| ------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| -stats                                | 打印回放统计信息                                             | show status                                                  |
| -fast                                 | 非标准规范的多媒体兼容优化                                   | non spec compliant optimizations                             |
| -genpts                               | 生成pts                                                      | generate pts                                                 |
| **-sync type**                        | 同步类型，默认audio为主时钟                                  | set audio-video sync. type (type=audio/video/ext)            |
| -ast audio_stream_specifier           | 指定音频流索引                                               | select desired audio stream                                  |
| -vst video_stream_specifier           | 指定视频流索引                                               | select desired video stream                                  |
| -sst substitle_stream_specifier       | 指定字幕流索引                                               | select desired substitle stream                              |
| -autoexit                             | 视频播放完成后自动退出                                       | exit at the end                                              |
| -exitonkeydown                        | 键盘按下任何键退出播放                                       | exit on key down                                             |
| -exitonmousedown                      | 鼠标按下任何键退出播放                                       | exit on mouse down                                           |
| **-codec:media_specifier codec_name** | 强制使用设置的多媒体解码器, media_specifier可选值为a(audio), v(video), s(substitle)，如codec:v h264 , *同名*表示：-vcodec h264 == -c:v h264 == -codec:v h264 |                                                              |
| -acodec codec_name                    | 强制使用设置的音频解码器进行音频解码                         | force audio decoder                                          |
| -vcodec codec_name                    | 强制使用设置的视频解码器进行视频解码                         | force video decoder                                          |
| -scodec codec_name                    | 强制使用设置的字幕解码器进行字幕解码                         | force subtitle decoder                                       |
| -autorotate                           | 根据文件元数据进行自动旋转                                   | automatically rotate video                                   |
| -framedrop                            | 如果视频不同步则丢弃视频帧。当主时钟非视频时钟时默认开启。若需禁用则使用 -noframedrop | drop frames when cpu is too slow                             |
| -infbuf                               | 不限制输入缓冲区大小。此选项将不限制缓冲区的大小。若需禁用则使用-noinfbuf | don't limit the input buffer size (useful with realtime streams) |

播放控制：

| 快捷键       | 作用                                                         | 原文                                                         |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| q, ESC       | 退出                                                         | Quit.                                                        |
| f            | 全屏切换                                                     | Toggle full screen.                                          |
| p, space     | 暂停/播放切换                                                | Pause.                                                       |
| m(mute)      | 静音切换                                                     | Toggle mute.                                                 |
| 9, 0         | 9减小音量，0增大音量                                         | Decrease and increase volume respectively.                   |
| /, *         | /减小音量，*增大音量                                         | Decrease and increase volume respectively.                   |
| a            | 循环切换音频流                                               | Cycle audio channel in the current program.                  |
| v            | 循环切换视频流                                               | Cycle video channel.                                         |
| *t*          | 循环切换字幕流                                               | Cycle subtitle channel in the current program.               |
| s            | 逐帧播放                                                     | Step to the next frame. Pause if the stream is not already paused, step to the next video frame, and pause.Cycle program. |
| c            | 循环切换节目                                                 | Cycle program.                                               |
| w            | 循环切换过滤器或显示模式                                     | Cycle video filters or show modes.                           |
| left/right   | 向后/向前拖动10s                                             | Seek backward/forward 10 seconds.                            |
| down/up      | 向后/向前拖动1min                                            | Seek backward/forward 1 minute.                              |
| 鼠标右键单击 | 拖动与显示宽度对应百分比的文件进行播放                       | Seek to percentage in file corresponding to fraction of width. |
| 鼠标左键双击 | 全屏切换                                                     | Toggle full screen.                                          |
| page down/up | 查找前一章/下一章。或者如果没有章节，请向后/向前寻求 10 分钟。 | Seek to the previous/next chapter. or if there are no chapters Seek backward/forward 10 minutes. |




### `ffplay --help`

获取帮助文档

### `ffplay -ss 30 -t 10 1G.mp4`

视频的第30 秒开始播放， 播放10 秒钟的文件

### `ffplay.exe -window_title "8KTest" -x 500 -y 500 -vcodec hevc -an -vn 8K.mkv`

指定宽度高度，指定编码格式，指定不播放音频不播放视频


1. 播放本地文件
- `ffplay test.flv`
- `ffpaly -window_title "test window" test.flv` # 指定播放窗口名称
2. 播放网络流
- `ffplay rtmp://58.200.131.2:1935/livetv/cctv6`
3. 禁用音频或者视频
- `ffplay -an test.flv` # 禁用音频
- `ffplay -vn test.flv` # 禁用视频
4. 指定解码器
- `ffplay -vcodec h264 test.flv` # 指定h264解码器
5. 播放YUV数据
- `ffplay -pixel_format yuv420p -video_size 1280x720 -framerate 5 1280x720_yuv420p.yuv`
6. 播放RGB数据
- `ffplay -pixel_format rgb24 -video_size 1280x720 -framerate 5 1280x720_rgb24.rgb`
7. 播放pcm数据
- `ffplay -ar 44100 -ac 2 -f s16le 44100_2_s16le.pcm`

#### 简单过滤器

1. 视频旋转
- `ffplay -i test.flv -vf transpose =1` # 顺时针旋转90度

2. 视频反转
- `ffplay -i test.flv -vf hflip # 以垂直中线互换左右`
- `ffplay -i test.flv -vf vflip # 以水平中线互换上下`

3. 视频旋转同时反转
- `ffplay -i test.flv -vf hflip，transpose=2` # 多个滤镜，相同参数，逗号间隔

4. 音频倍数播放
- `ffplay -i test.flv -af atempo=3`

5. 视频倍数播放
- `ffplay -i test.flv -vf setpts=PTS/3`

6. 音频与视频同时倍数
- `ffplay -i test.flv -vf setpts=PTS/3 -af atempo=3` # 多个滤镜，不同种类参数，空格追加