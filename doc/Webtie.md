# Webtie

## 什么是 Webtie
Webtie 是一个轻量级的网页转换框架，用于解析转换不同类别的 URL，并渲染对应页面。

## 使用方法
```
webtie/index.html?adapter=<adapter>&url=<url>
```
参数说明

| 名称 | 类型 | 可选值 | 默认值 | 说明 |
|:---|:---|:---|:---|:---|
| `adapter` | `Enum` | `'web'`, `'bilibili'` | `''` | 适配器 key。 |
| `url` | `String` | | `''` | URL 地址，**注：** 需要进行 `encode` 后传入。 |

## 适配器
### 网页适配器 (`web`)
* `url` 网页地址
* 显示为：地址所指向的网页

### B站视频适配器 (`bilibili`)
* `url` B站视频分享地址
  * 支持：
    * av号
    * BV号
    * 分P
    * 精准跳转时间
* 显示为：B站视频播放器
