# html

## 如何检测iframe是否能打开，如果打不开则跳到404页面

```javascript
首先我们知道 iframe 只有 onload 事件，没有 onerror 事件，
无论 iframe 能否正常加载都会正常触发 onload 事件。

但是由于场景不同，最终所能使用的方案也不同。

非跨域
如果不跨域，那问题就很好解决了，有以下几种方案可以使用：

使用 ajax 发送一个 head 请求，看状态是否返回 200 （之所以发送 head 请求，是轻量级，响应速度快）。
检测 iframe 元素特征，在 iframe onload 触发后，检测 html 元素，例如有没有 title，内容是否为空等。

跨域
如果跨域的情况，要看你是否能控制跨域服务器。

能控制跨域服务器
可以使用 jsonp 或 CORS，允许客户端发送跨域 head 请求，来获取是否状态正常

如果不能跨域的情况，见下面的通用方案


通用方案
如果要兼容跨域/非跨域情况，可以使用下面几种通用方案：

使用定时器检测，如果onload触发时间晚于预设阈值，判定为无法加载。
使用link标签来测试url能否访问。
下面重点来讲下方案2。

link标签来测试url
我们为什么要使用link标签？

支持跨域的检测标签有如下几个：

script
img
link
video
audio
支持 onload 和 onerror 的只有 script 、link、img

之所以不用 img、script的原因是：

img会检测格式，如果不是图片类型，也会触发onerror。
script可能会有安全问题（XSS等）。
检测 demo 代码如下

为了兼容使用了es5语法。

<html>

<body>
  <iframe id="iframe" onload="frameLoad()" width="100%" height="100%" src="https://baidu1.com">
  </iframe>
  <script>
    function frameLoad() {
      console.log('frame load')
    }
    function accessTest() {
      var link = document.createElement('link')
      link.rel = "stylesheet"
      link.type = "text/css"
      // 这里设置需要检测的url
      link.href = "https://baidu1.com"
      link.onload = function () {
        console.log('accessTest success')
      }
      link.onerror = function () {
        console.log('accessTest fail')
      }
      document.body.appendChild(link)
    }
    accessTest()
  </script>
</body>

</html>
```



## a标签的download属性下载文件会有跨域问题吗？如何解决？

```javascript
a标签的 download 属性只对同源文件有效，
所以我们这里先把图片 url 转为 blob 格式，然后再下载 

/**
   ** 将图片 url 转换为 blob 格式
   ** @param httpUrl: 图片链接，如 https://cdn.aaa.com/bbb.jpg
   */
  private async urlToBlob(httpUrl) {
    const res: Response = await fetch(httpUrl);
    const blob: Blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
  }

  /**
   ** 下载图片到本地
   ** @param blobUrl： blob 格式的图片文件
   ** @param name: 图片名称
   */
  private download(blobUrl, name) {
    // 创建虚拟a标签
    const eleLink = document.createElement('a');
    eleLink.download = name;
    eleLink.style.display = 'none';
    eleLink.href = blobUrl;
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
    URL.revokeObjectURL(blobUrl);
  }
```

## 文章阅读的进度条

```javascript
通过document.documentElement.scrollTop获取页面滚过高度，
通过document.documentElement.scrollHeight获取页面总高度，
通过document.documentElement.clientHeight获取当前内容高度。
通过给window对象设置scroll事件，触发回调函数：将进度条dom style属性中的width或height动态修改为（页面滚过高度 + 当前内容高度）/ 页面总高度
```



## 禁用页面中的右键、打印、另存为、复制等功能



```javascript
<body oncontextmenu=self.event.returnValue=false onselectstart="return false">
  禁止打印页面
document.onbeforeprint = function(){ return false; };
```

## webp与jpg、png比较，它有什么优劣势？

```
优势
更优的图像数据压缩算法 带来更小的图片体积
肉眼识别无差异的图片质量
支持有损和无损压缩
支持动画 透明
色彩丰富 24-bit颜色数
劣势
存在兼容性问题
选择
​ 当 图片较少 体积不大 且存在兼容性问题时,兼容性方法处理起来较为复杂 可以选择传统格式

​ 当图片较多 且不存在兼容性问题或者兼容性方法处理起来较为简单时 便使用webp格式

兼容性处理
1.通过picture标签进行选择判断
<picture>
    <source srcset="img/pic.webp" type="image/webp">
    <source srcset="img/pic.jpg" type="image/jpeg">
    <img src="img/pic.jpg">
</picture>
该种方法要求在每个要请求webp图片的标签下都要通过picture标签来进行兼容性处理，
同时注意该标签在IE的兼容性并不是很好，不过已经比webp的兼容性好一些。

2.通过服务端判断请求头中的Accept的值判断是否支持webp
通过HTTP request header中是否存在Accept: image/webp来判断，
这种方法的缺点在于：很多时候我们的图片等静态资源都会放到CDN服务器上，在这个层面加上判断webp的逻辑会更麻烦一些

3.由浏览器端判断是否支持WebP格式
if(document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0){
   //  该浏览器支持WebP格式的图片
 }
该种方法的原理为：

HTMLCanvasElement.toDataURL() 方法返回一个包含图片展示的 data URI 。可以使用 type 参数其类型，默认为 PNG 格式。

1.如果画布的高度或宽度是0，那么会返回字符串“data:,”。

2.如果传入的类型非“image/png”，但是返回的值以“data:image/png”开头，说明该传入的类型是不支持的。

3.Chrome支持“image/webp”类型。
```

