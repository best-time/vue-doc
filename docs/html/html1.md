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


## HTML5的新特性如下：
拖放（ Drag and drop）APIl
语义化更好的内容标签（ header、nav、 footer、 aside、 article、 section）
音频、视频（ audio、 video）API
画布（ Canvas）API
地理（ Geolocation）APl
本地离线存储（ localStorage），即长期存储数据，浏览器关闭后数据不丢失。
会话存储（ sessionStorage），即数据在浏览器关闭后自动删除
表单控件包括 calendar、date、time、 email、url、 search。
新的技术包括 webwork、 websocket、 Geolocation

移除的元素如下：
纯表现的元素，包括 basefont,big、 center、font、s, strike,t、u

对可用性产生负面影响的元素，包括 frame、 frameset、 Noframes


## 请你说一下 Web Worker和 WebSocket的作用。

Web Worker的作用如下：
（1）通过 worker= new Worker（url）加载一个 JavaScript文件，创建一个 Worker，同时返回一个 Worker实例
（2）用 worker.postMessage（data）向 Worker发送数据
（3）绑定 worker.onmessage接收 Worker发送过来的数据
（4）可以使用 worker.terminate()终止一个 Worker的执行。

WebSocket的作用如下。

它是Web应用程序的传输协议，提供了双向的、按序到达的数据流。
它是HTML5新増的协议， WebSocket的连接是持久的，它在客户端和服务器之间保持双工连接，服务器的更新可以及时推送到客户端，而不需要客户端以一定的时间间隔去轮询。

## cookie的特点。

cookie虽然为持久保存客户端数据提供了方便，分担了服务器存储的负担，但是有以下局限性。
（1）每个特定的域名下最多生成20个 cookie。
（2）IE6或更低版本最多有20个 cookie。
（3）IE7和之后的版本最多可以有50个 cookie。
（4） Firefox最多可以有50个 cookie。
（5） Chrome和 Safari没有做硬性限制。

IE和 Opera会清理近期最少使用的 cookie, Firefox会随机清理 cookie。
cookie最大为4096字节，为了兼容性，一般不能超过4095字节。

IE提供了一种存储方式，可以让用户数据持久化，叫作 userdata，
从IE5.0就开始支持此功能。每块数据最多128KB，每个域名下最多1MB。这个持久化数据放在缓存中，如果缓存没有被清理，就会一直存在。

优点如下：

（1）通过良好的编程，控制保存在 cookie中的 session对象的大小。
（2）通过加密和安全传输技术（SSL），降低 cookie被破解的可能性。
（3）只在 cookie中存放不敏感数据，即使被盗也不会有重大损失。
（4）控制 cookie的生命周期，使之不会永远有效。数据偷盗者很可能得到一个过期的 cookie。

缺点如下：
（1）“ cookie”的数量和长度有限制。每个 domain最多只能有20条 cookie，每个cookie的长度不能超过4KB，否则会被截掉。
（2）安全性问题。如果 cookie被别人拦截了，就可以取得所有的 session信息。即使加密也于事无补，因为拦截者并不需要知道 cookie的意义，他只要原样转发 cookie就可以达到目的。
（3）有些状态不可能保存在客户端。例如，为了防止重复提交表单，我们需要在服务器端保存一个计数器。如果把这个计数器保存在客户端，那么它起不到任何作用

## localStorage和 cookie的区别是什么？

localStorage的概念和cookie相似，区别是 localStorage是为了更大容量的存储设计的。
cookie的大小是受限的，并且每次请求一个新页面时， cookie都会被发送过去，这样无形中浪费了带宽。
cookie还需要指定作用域，不可以跨域调用。

localStorage拥有 setlten, getItem、 removeltem、 clear等方法，
cookie则需要前端开发者自己封装 setCookie和 get Cookie。
但 cookie也是不可或缺的，因为 cookie的作用是与服务器进行交互，并且还是HTP规范的一部分，
而 localStorage仅因为是为了在本地“存储”数据而已，无法跨浏览器使用。

## cookie和 session的区别是什么？
区别如下：
（1） cookie数据存放在客户的浏览器上， session数据存放在服务器上。
（2） cookie不是很安全，别人可以分析存放在本地的 cookie并进行 cookie欺骗。考虑到安全问题应当使用 session。
（3） session会在一定时间内保存在服务器上。当访问增多时，会占用较多服务器的资源。为了减轻服务器的负担，应当使用 cookie。
（4）单个 cookie保存的数据不能超过4KB，很多浏览器都限制一个站点最多保存20个 cookie。

所以个人建议可以将登录信息等重要信息存放在 session中，其他信息（如果需要保留）可以存放在 cookie中。


## Canvas和SvG的区别是什么？

两者的区别如下：
（1）一旦 Canvas绘制完成将不能访问像素或操作它；任何使用SVG绘制的形状都能被记忆和操作，可以被浏览器再次显示。
（2） Canvas对绘制动画和游戏非常有利；SVG对创建图形（如CAD）非常有利。
（3）因为不需要记住以后事情，所以 Canvas运行更快；因为为了之后的操作，SVG需要记录坐标，所以运行比较缓慢。
（4）在 Canvas中不能为绘制对象绑定相关事件；在SVG中可以为绘制对象绑定相关事件。
（5） Canvas绘制出的是位图，因此与分辨率有关；SvG绘制出的是矢量图，因此与分辨率无关。

##  Canvas和HTML5中的SVG画一个矩形
```

<svg xmlns=http://www.w3.org/2000/svg  version="1.1">
<rect style="fill:rgb（255,100，0）；"height=200"  width="400"></rect>
</svg>


<canvas id="myCanvas" width=500" height="500"></canvas>
var canvas=document.getElementById（'mycanvas'）；
var ctx= canvas.getContext（'2d'）；
 ctx.rect（100,100,300,200）；
ctx fillstyle = 'pink '
ctx. fill()
```

## manifest

```
文件

CACHE MANTEEST
# version 1.0    应用缓存通过变更“#”标签后的版本号来刷新
/demo. css
/demo. js
/demo.png
所有 manifest文件都以” CACHE MANIFEST"语句开始。
#（散列标签）有助于提供缓存文件的版本。
manifest文件的内容类型应是"text/ cache- manifest”。

FALLBACK：
/home//404. html

NETWORK
login. php

使用
<html manifest="icketang. appcache">
```

## html 页面声明周期
DOMContentLoaded —— 浏览器已经完全加载了 HTML，DOM 树已经构建完毕，但是像是 <img> 和样式表等外部资源可能并没有下载完毕。

load —— 浏览器已经加载了所有的资源（图像，样式表等）。

beforeunload —— 当用户即将离开当前页面（刷新或关闭）时触发。正要去服务器读取新的页面时调用，此时还没开始读取；

unload —— 在用户离开页面后触发。从服务器上读到了需要加载的新的页面，在即将替换掉当前页面时调用。

```

document.addEventListener("DOMContentLoaded", () => {});


window.addEventListener('load', function(e) {...});
window.onload = function(e) { ... };


// 推荐使用
window.addEventListener('beforeunload', (event) => {
  // Cancel the event as stated by the standard.
  event.preventDefault();
  // Chrome requires returnValue to be set.
  event.returnValue = '关闭提示';
});


window.onbeforeunload = function (e) {
  e = e || window.event;
  // 兼容IE8和Firefox 4之前的版本
  if (e) {
    e.returnValue = '关闭提示';
  }
  // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
  return '关闭提示';
};


// 推荐使用
window.addEventListener("unload", function(event) { ... });

window.onunload = function(event) { ... };
```

readyState
document.readyState 表示页面的加载状态，有三个值：

loading 加载 —— document仍在加载。

interactive 互动 —— 文档已经完成加载，文档已被解析，但是诸如图像，样式表和框架之类的子资源仍在加载。

complete —— 文档和所有子资源已完成加载。 load 事件即将被触发。

```
document.addEventListener('readystatechange', () => {
  console.log(document.readyState);
});
```