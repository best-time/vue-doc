## http https

Http：超文本传输协议（Http，HyperText Transfer Protocol)是互联网上应用最为广泛的一种网络协议。设计Http最初的目的是为了提供一种发布和接收HTML页面的方法。它可以使浏览器更加高效。

Http协议是以明文方式发送信息的，如果黑客截取了Web浏览器和服务器之间的传输报文，就可以直接获得其中的信息。

Https：是以安全为目标的Http通道，是Http的安全版。Https的安全基础是SSL。SSL协议位于TCP/IP协议与各种应用层协议之间，为数据通讯提供安全支持。SSL协议可分为两层：SSL记录协议（SSL Record Protocol），它建立在可靠的传输协议（如TCP）之上，为高层协议提供数据封装、压缩、加密等基本功能的支持。

SSL握手协议（SSL Handshake Protocol），它建立在SSL记录协议之上，用于在实际的数据传输开始前，通讯双方进行身份认证、协商加密算法、交换加密密钥等。

HTTP与HTTPS的区别

1、HTTP是超文本传输协议，信息是明文传输，HTTPS是具有安全性的SSL加密传输协议。
2、HTTPS协议需要ca申请证书，一般免费证书少，因而需要一定费用。
3、HTTP和HTTPS使用的是完全不同的连接方式，用的端口也不一样。前者是80，后者是443。
4、HTTP连接是无状态的，HTTPS协议是由SSL+HTTP协议构建的可进行加密传输、身份认证的网络协议，安全性高于HTTP协议。

https的优点

尽管HTTPS并非绝对安全，掌握根证书的机构、掌握加密算法的组织同样可以进行中间人形式的攻击，但HTTPS仍是现行架构下最安全的解决方案，主要有以下几个好处：

1）使用HTTPS协议可认证用户和服务器，确保数据发送到正确的客户机和服务器；
2）HTTPS协议是由SSL+HTTP协议构建的可进行加密传输、身份认证的网络协议，要比http协议安全，可防止数据在传输过程中不被窃取、改变，确保数据的完整性。
3）HTTPS是现行架构下最安全的解决方案，虽然不是绝对安全，但它大幅增加了中间人攻击的成本。
4）谷歌曾在2014年8月份调整搜索引擎算法，并称“比起同等HTTP网站，采用HTTPS加密的网站在搜索结果中的排名将会更高”。

Https的缺点

1）Https协议握手阶段比较费时，会使页面的加载时间延长近。
2）Https连接缓存不如Http高效，会增加数据开销，甚至已有的安全措施也会因此而受到影响；
3）SSL证书通常需要绑定IP，不能在同一IP上绑定多个域名，IPv4资源不可能支撑这个消耗。
4）Https协议的加密范围也比较有限。最关键的，SSL证书的信用链体系并不安全，特别是在某些国家可以控制CA根证书的情况下，中间人攻击一样可行。


## spa 理解
SPA（ single-page application ）仅在 Web 页面初始化时加载相应的 HTML、JavaScript 和 CSS。一旦页面加载完成，
SPA 不会因为用户的操作而进行页面的重新加载或跳转；取而代之的是利用路由机制实现 HTML 内容的变换，UI 与用户的交互，避免页面的重新加载。

优点：
用户体验好、快，内容的改变不需要重新加载整个页面，避免了不必要的跳转和重复渲染；
基于上面一点，SPA 相对对服务器压力小；
前后端职责分离，架构清晰，前端进行交互逻辑，后端负责数据处理；

缺点：
初次加载耗时多：为实现单页 Web 应用功能及显示效果，需要在加载页面的时候将 JavaScript、CSS 统一加载，部分页面按需加载；
前进后退路由管理：由于单页应用在一个页面中显示所有的内容，所以不能使用浏览器的前进后退功能，所有的页面切换需要自己建立堆栈管理；
SEO 难度较大：由于所有的内容都在一个页面中动态替换显示，所以在 SEO 上其有着天然的弱势。



## Proxy 与 Object.defineProperty 优劣对比
Proxy 的优势如下:

Proxy 可以直接监听对象而非属性；

Proxy 可以直接监听数组的变化；

Proxy 有多达 13 种拦截方法,不限于 apply、ownKeys、deleteProperty、has 等等是 Object.defineProperty 不具备的；

Proxy 返回的是一个新对象,我们可以只操作新的对象达到目的,而 Object.defineProperty 只能遍历对象属性直接修改；

Proxy 作为新标准将受到浏览器厂商重点持续的性能优化，也就是传说中的新标准的性能红利；

Object.defineProperty 的优势如下:

兼容性好，支持 IE9，而 Proxy 的存在浏览器兼容性问题,而且无法用 polyfill 磨平，因此 Vue 的作者才声明需要等到下个大版本( 3.0 )才能用 Proxy 重写。


## 虚拟 DOM 的优缺点？
优点：

保证性能下限： 框架的虚拟 DOM 需要适配任何上层 API 可能产生的操作，它的一些 DOM 操作的实现必须是普适的，所以它的性能并不是最优的；但是比起粗暴的 DOM 操作性能要好很多，因此框架的虚拟 DOM 至少可以保证在你不需要手动优化的情况下，依然可以提供还不错的性能，即保证性能的下限；

无需手动操作 DOM： 我们不再需要手动去操作 DOM，只需要写好 View-Model 的代码逻辑，框架会根据虚拟 DOM 和 数据双向绑定，帮我们以可预期的方式更新视图，极大提高我们的开发效率；

跨平台： 虚拟 DOM 本质上是 JavaScript 对象,而 DOM 与平台强相关，相比之下虚拟 DOM 可以进行更方便地跨平台操作，例如服务器渲染、weex 开发等等。

缺点:

无法进行极致优化： 虽然虚拟 DOM + 合理的优化，足以应对绝大部分应用的性能需求，但在一些性能要求极高的应用中虚拟 DOM 无法进行针对性的极致优化。

虚拟 DOM 的实现原理主要包括以下 3 部分：

用 JavaScript 对象模拟真实 DOM 树，对真实 DOM 进行抽象；

diff 算法 — 比较两棵虚拟 DOM 树的差异；

pach 算法 — 将两个虚拟 DOM 对象的差异应用到真正的 DOM 树。


## 浏览器缓存
https://mp.weixin.qq.com/s/gV5CA96hsYNPBBn9iRcheg
好处:
1.缓解服务器压力，不用每次都去请求某些数据了。

2.提升性能，打开本地资源肯定会比请求服务器来的快。

3.减少带宽消耗，当我们使用缓存时，只会产生很小的网络消耗，至于为什么打开本地资源也会产生网络消耗，下面会有说明。

Web缓存种类：
1 数据库缓存，
将查询的数据放在内存中进行缓存, 下次查询此劫在内存中获取,提高响应速度
2 CDN缓存，
发送web请求时, cdn会帮我们计算去拿得到这些内容的路径短且快, 这个是网站管理员部署,他们也可以将大家经常访问的内容放在cdn里,加快响应
3 代理服务器缓存，
和浏览器缓存性质类似,但它面向群体更广,规模更大,不只为一个用户服务,一般为大量用户提供服务,同一个副本会被重用多次,在减少响应时间和贷款方面很有效
4 浏览器缓存
每个浏览器都实现了HTTP缓存,我们通过浏览器使用HTTP协议与服务器交互的时候,浏览器会根据一套与服务器约定的规则进行缓存工作,点击前进后退按钮时
利用的就是浏览器缓存机制

浏览器缓存其实就是指在本地使用的计算机中开辟一个内存区，同时也开辟一个硬盘区作为数据传输的缓冲区，
然后用这个缓冲区来暂时保存用户以前访问过的信息。

浏览器缓存过程： 强缓存，协商缓存
浏览器缓存位置一般分为四类： Service Worker--> Memory Cache--> Disk Cache--> Push Cache。


强缓存是当我们访问URL的时候，不会向服务器发送请求，直接从缓存中读取资源，但是会返回200的状态码。
如何设置强缓存？
我们第一次进入页面，请求服务器，然后服务器进行应答，浏览器会根据response Header来判断是否对资源进行缓存，
如果响应头中expires、pragma或者cache-control字段，代表这是强缓存，浏览器就会把资源缓存在memory cache 或 disk cache中。

第二次请求时，浏览器判断请求参数，如果符合强缓存条件就直接返回状态码200，从本地缓存中拿数据。否则把响应参数存在request header请求头中，看是否符合协商缓存，符合则返回状态码304，不符合则服务器会返回全新资源。

expires
是HTTP1.0控制网页缓存的字段，值为一个时间戳，准确来讲是格林尼治时间，
服务器返回该请求结果缓存的到期时间，意思是，再次发送请求时，如果未超过过期时间，直接使用该缓存，如果过期了则重新请求。

有个缺点，就是它判断是否过期是用本地时间来判断的，本地时间是可以自己修改的。

Cache-Control
是HTTP1.1中控制网页缓存的字段，当Cache-Control都存在时，Cache-Control优先级更高，主要取值为：

public：资源客户端和服务器都可以缓存。

privite：资源只有客户端可以缓存。

no-cache：客户端缓存资源，但是是否缓存需要经过协商缓存来验证。

no-store：不使用缓存。

max-age：缓存保质期。

Cache-Control使用了max-age相对时间，解决了expires的问题。

pragma
这个是HTTP1.0中禁用网页缓存的字段，其取值为no-cache，和Cache-Control的no-cache效果一样。

```
缓存位置
强缓存我们会把资源房放到memory cache 和 disk cache中，那什么资源放在memory cache，什么资源放在disk cache中存

存储图像和网页等资源主要缓存在disk cache，操作系统缓存文件等资源大部分都会缓存在memory cache中。
具体操作浏览器自动分配，看谁的资源利用率不高就分给谁。

可以看到memory cache请求时间都是0ms，这个是不是太神奇了，这方面我来梳理下。

查找浏览器缓存时会按顺序查找: Service Worker-->Memory Cache-->Disk Cache-->Push Cache。


1. Service Worker
是运行在浏览器背后的独立线程，一般可以用来实现缓存功能。
使用 Service Worker的话，传输协议必须为 HTTPS。
因为 Service Worker 中涉及到请求拦截，所以必须使用 HTTPS 协议来保障安全。
Service Worker 的缓存与浏览器其他内建的缓存机制不同，
它可以让我们自由控制缓存哪些文件、如何匹配缓存、如何读取缓存，并且缓存是持续性的。

2. Memory Cache
内存中的缓存，主要包含的是当前中页面中已经抓取到的资源，
例如页面上已经下载的样式、脚本、图片等。读取内存中的数据肯定比磁盘快，内存缓存虽然读取高效，
可是缓存持续性很短，会随着进程的释放而释放。一旦我们关闭 Tab 页面，内存中的缓存也就被释放了。

3. Disk Cache
存储在硬盘中的缓存，读取速度慢点，但是什么都能存储到磁盘中，比之 Memory Cache 胜在容量和存储时效性上。

在所有浏览器缓存中，Disk Cache 覆盖面基本是最大的。它会根据 HTTP Herder 中的字段判断哪些资源需要缓存，
哪些资源可以不请求直接使用，哪些资源已经过期需要重新请求。并且即使在跨站点的情况下，
相同地址的资源一旦被硬盘缓存下来，就不会再次去请求数据。绝大部分的缓存都来自 Disk Cache。

memory cache 要比 disk cache 快的多。
举个例子：从远程 web 服务器直接提取访问文件可能需要500毫秒(半秒)，那么磁盘访问可能需要10-20毫秒，
而内存访问只需要100纳秒，更高级的还有 L1缓存访问(最快和最小的 CPU 缓存)只需要0.5纳秒。

很神奇的，我们又看到了一个prefetch cache，这个又是什么呢?

prefetch cache(预取缓存)

link标签上带了prefetch，再次加载会出现。

prefetch是预加载的一种方式，被标记为prefetch的资源，将会被浏览器在空闲时间加载。

4. Push Cache
Push Cache（推送缓存）是 HTTP/2 中的内容，当以上三种缓存都没有命中时，它才会被使用。
它只在会话（Session）中存在，一旦会话结束就被释放，并且缓存时间也很短暂，
在Chrome浏览器中只有5分钟左右，同时它也并非严格执行HTTP头中的缓存指令。

5. CPU、内存、硬盘
这里提到了硬盘，内存，可能有些小伙伴对硬盘，内存没什么直观的概念。

CPU、内存、硬盘都是计算机的主要组成部分。

CPU：中央处理单元(CntralPocessingUit)的缩写，也叫处理器，是计算机的运算核心和控制核心。电脑靠CPU来运算、控制。让电脑的各个部件顺利工作，起到协调和控制作用。

硬盘：存储资料和软件等数据的设备，有容量大，断电数据不丢失的特点。

内存：负责硬盘等硬件上的数据与CPU之间数据交换处理。特点是体积小，速度快，有电可存，无电清空，即电脑在开机状态时内存中可存储数据，关机后将自动清空其中的所有数据。

3. 协商缓存

  协商缓存就是强缓存失效后，浏览器携带缓存标识向服务器发送请求，由服务器根据缓存标识来决定是否使用缓存的过程。

  主要有以下两种情况：

  协商缓存生效，返回304

  如何设置协商缓存？

Last-Modified / If-Modified-Since

Last-Modified是服务器响应请求时，返回该资源文件在服务器最后被修改的时间。

If-Modified-Since则是客户端再次发起该请求时，携带上次请求返回的Last-Modified值，通过此字段值告诉服务器该资源上次请求返回的最后被修改时间。服务器收到该请求，发现请求头含有If-Modified-Since字段，则会根据If-Modified-Since的字段值与该资源在服务器的最后被修改时间做对比，若服务器的资源最后被修改时间大于If-Modified-Since的字段值，则重新返回资源，状态码为200；否则则返回304，代表资源无更新，可继续使用缓存文件。

Etag / If-None-Match

Etag是服务器响应请求时，返回当前资源文件的一个唯一标识(由服务器生成)。

If-None-Match是客户端再次发起该请求时，携带上次请求返回的唯一标识Etag值，通过此字段值告诉服务器该资源上次请求返回的唯一标识值。服务器收到该请求后，发现该请求头中含有If-None-Match，则会根据If-None-Match的字段值与该资源在服务器的Etag值做对比，一致则返回304，代表资源无更新，继续使用缓存文件；不一致则重新返回资源文件，状态码为200。

Etag / If-None-Match优先级高于Last-Modified / If-Modified-Since，
同时存在则只有Etag / If-None-Match生效。

4. 缓存方案

  目前的项目大多使用这种缓存方案的：

  HTML: 协商缓存；

  css、js、图片：强缓存，文件名带上hash。


5. 强缓存与协商缓存的区别

  1. 强缓存不发请求到服务器，所以有时候资源更新了浏览器还不知道，但是协商缓存会发请求到服务器，所以资源是否更新，服务器肯定知道。

  2. 大部分web服务器都默认开启协商缓存。

6. 刷新对于强缓存和协商缓存的影响

  1. 当ctrl+f5强制刷新网页时，直接从服务器加载，跳过强缓存和协商缓存。

  2. 当f5刷新网页时，跳过强缓存，但是会检查协商缓存。

  3. 浏览器地址栏中写入URL，回车 浏览器发现缓存中有这个文件了，不用继续请求了，直接去缓存拿。（最快）

```

## 前端监控
https://mp.weixin.qq.com/s/0uv_Oz6LcSarNYI4i5Be5Q

指标	计算
重定向耗时	redirectEnd - redirectStart
DNS解析耗时	domainLookupEnd - domainLookupStart
TCP连接耗时	connectEnd - connectStart
SSL连接耗时	connectEnd - secureConnectionStart
TTFB 网络请求耗时	responseStart - requestStart
数据传输耗时	responseEnd - responseStart
资源加载耗时	loadEventStart - domContentLoadedEventEnd

```
Google工程师一直在推动以用户为中心的性能指标，所以页面展示层面的变化较大，求解方式稍有不同：

FP和FCP
通过window.performance.getEntriesByType(‘paint’)的方式获取

const paint = window.performance.getEntriesByType('paint');
const FP = paint[0].startTime,
const FCP = paint[1].startTime,
LCP
function getLCP() {
    // 增加一个性能条目的观察者
    new PerformanceObserver((entryList, observer) => {
        let entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        observer.disconnect();
        console.log('LCP', lastEntry.renderTime || lastEntry.loadTime);
    }).observe({entryTypes: ['largest-contentful-paint']});
}
FMP
function getFMP() {
    let FMP;
    new PerformanceObserver((entryList, observer) => {
        let entries = entryList.getEntries();
        observer.disconnect();
        console.log('FMP', entries);
    }).observe({entryTypes: ['element']});
}
DCL
domContentLoadEventEnd – fetchStart
L
loadEventStart – fetchStart
TTI
domInteractive – fetchStart
FID
function getFID() {
    new PerformanceObserver((entryList, observer) => {
        let firstInput = entryList.getEntries()[0];
        if (firstInput) {
            const FID = firstInput.processingStart - firstInput.startTime;
            console.log('FID', FID);
        }
        observer.disconnect();
    }).observe({type: 'first-input', buffered: true});
}

```
JavaScript运行时有可能会发生错误，
可归类为七种：语法错误、类型错误、范围错误、引用错误、eval错误、URL错误、资源加载错误。
为了捕获代码错误，需要考虑两类场景：非Promise场景和Promise场景，因为两种场景捕获错误的策略不同

```
1.非Promise场景

非Promise场景可通过监听error事件来捕获错误。对于error事件捕获的错误分为两类：资源错误和代码错误。资源错误指的就是js、css、img等未加载，该错误只能在捕获阶段获取到，且为资源错误时event.target.localName存在值（用此区分资源错误与代码错误）；代码错误指的就是语法错误、类型错误等这一类错误，可以获取代码错误的信息、堆栈等，用于排查错误。

export function listenerError() {
    window.addEventListener('error', (event) => {
        if (event.target.localName) {
            console.log('这是资源错误', event);
        }
        else {
            console.log('这是代码错误', event);
        }
    }, true)
}
2.Promise场景

Promise场景的处理方式有所不同，当Promise被reject且没有reject处理器的时候，会触发unhandlerejection事件，所以通过监听unhandlerejection的事件来捕获错误。

export function listenerPromiseError() {
    window.addEventListener('unhandledrejection', (event) => {
        console.log('这是Promise场景中错误', event);
    })
}
```
二、接口错误

对于浏览器来说，所有的接口均是基于XHR和Fetch实现的，为了捕获接口中的错误，可以通过重写该方法，然后通过接口返回的信息来判断当前接口的状况，下面以XHR为例来展示封装过程。

function newXHR() {
    const XMLHttpRequest = window.XMLHttpRequest;
    const oldXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = (method, url, async) => {
        // 做一些自己的数据上报操作
        return oldXHROpen.apply(this, arguments);
    }

    const oldXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = (body) => {
        // 做一些自己的数据上报操作
        return oldXHRSend.apply(this, arguments);
    }
}

上报方式

```
对于上报的方式无外乎两种：一种是Ajax的方式上报；另一种是通过Image的形式进行上报。目前很多大厂采用的上报方式均是通过一个1*1像素的的gif图片进行上报，既然人家都采用该种策略，那我们就来唠一唠下面两个问题。

为什么采用Image的方式上报?

没有跨域问题。因为数据服务器和后端服务器大概率是不同的域名，若采用Ajax的方式进行处理还要处理跨域问题，否则数据会被浏览器拦截。
不会阻塞页面加载，只需new Image对象即可。
图片类型很多，为什么采用gif这种格式进行上报？
其实归结为一个字——小。对于1*1px的图片，BMP结 构的文件需要74字节，PNG结构的文件需要67字节，GIF结构的文件只需要43字节。同样的响应，GIF可以比BMP节约41%的流量，比PNG节约35%的流量，所以选择gif进行上报。
```

☆☆☆☆☆ http 相关知识点 ☆☆☆☆☆
https://juejin.cn/post/6844904070889603085#heading-38
## HTTP 缓存

HTTP 缓存又分为强缓存和协商缓存：

首先通过 Cache-Control 验证强缓存是否可用，如果强缓存可用，那么直接读取缓存
如果不可以，那么进入协商缓存阶段，发起 HTTP 请求，服务器通过请求头中是否带上 If-Modified-Since 和 If-None-Match 这些条件请求字段检查资源是否更新：
若资源更新，那么返回资源和 200 状态码
如果资源未更新，那么告诉浏览器直接使用缓存获取资源

## HTTP 常用的状态码及使用场景？

1xx：表示目前是协议的中间状态，还需要后续请求
2xx：表示请求成功
3xx：表示重定向状态，需要重新请求
4xx：表示请求报文错误
5xx：服务器端错误
常用状态码：

101 切换请求协议，从 HTTP 切换到 WebSocket
200 请求成功，有响应体
301 永久重定向：会缓存
302 临时重定向：不会缓存
304 协商缓存命中
403 服务器禁止访问
404 资源未找到
400 请求错误
500 服务器端错误
503 服务器繁忙


## 302状态码 有哪些场景
而 302 表示临时重定向，这个资源只是暂时不能被访问了，但是之后过一段时间还是可以继续访问，
一般是访问某个网站的资源需要权限时，会需要用户去登录，跳转到登录页面之后登录之后，还可以继续访问。

301 类似，都会跳转到一个新的网站，但是 301 代表访问的地址的资源被永久移除了，以后都不应该访问这个地址，搜索引擎抓取的时候也会用新的地址替换这个老的。可以在返回的响应的 location 首部去获取到返回的地址。301 的场景如下：

比如从 http://baidu.com，跳转到 https://baidu.com
域名换了

## HTTP 常用的请求方式，区别和用途？

http/1.1 规定如下请求方法：

GET：通用获取数据
HEAD：获取资源的元信息
POST：提交数据
PUT：修改数据
DELETE：删除数据
CONNECT：建立连接隧道，用于代理服务器
OPTIONS：列出可对资源实行的请求方法，常用于跨域
TRACE：追踪请求-响应的传输路径

## HTTPS 是什么？具体流程

HTTPS 是在 HTTP 和 TCP 之间建立了一个安全层，HTTP 与 TCP 通信的时候，必须先进过一个安全层，对数据包进行加密，然后将加密后的数据包传送给 TCP，相应的 TCP 必须将数据包解密，才能传给上面的 HTTP。

浏览器传输一个 client_random 和加密方法列表，服务器收到后，传给浏览器一个 server_random、加密方法列表和数字证书（包含了公钥），然后浏览器对数字证书进行合法验证，如果验证通过，则生成一个 pre_random，然后用公钥加密传给服务器，服务器用 client_random、server_random 和 pre_random ，使用公钥加密生成 secret，然后之后的传输使用这个 secret 作为秘钥来进行数据的加解密。


## 三次握手 和 四次挥手

为什么要进行三次握手：为了确认对方的发送和接收能力。

三次握手
三次握手主要流程：

一开始双方处于 CLOSED 状态，然后服务端开始监听某个端口进入 LISTEN 状态
然后客户端主动发起连接，发送 SYN，然后自己变为 SYN-SENT，seq = x
服务端收到之后，返回 SYN seq = y 和 ACK ack = x + 1（对于客户端发来的 SYN），自己变成 SYN-REVD
之后客户端再次发送 ACK seq = x + 1, ack = y + 1给服务端，自己变成 EASTABLISHED 状态，服务端收到 ACK，也进入 ESTABLISHED

SYN 需要对端确认，所以 ACK 的序列化要加一，凡是需要对端确认的，一点要消耗 TCP 报文的序列化

为什么不是两次？
无法确认客户端的接收能力。
如果首先客户端发送了 SYN 报文，但是滞留在网络中，TCP 以为丢包了，然后重传，两次握手建立了连接。

等到客户端关闭连接了。但是之后这个包如果到达了服务端，那么服务端接收到了，然后发送相应的数据表，就建立了链接，但是此时客户端已经关闭连接了，所以带来了链接资源的浪费。

为什么不是四次？
四次以上都可以，只不过 三次就够了

四次挥手
一开始都处于 ESTABLISH 状态，然后客户端发送 FIN 报文，带上 seq = p，状态变为 FIN-WAIT-1
服务端收到之后，发送 ACK 确认，ack = p + 1，然后进入 CLOSE-WAIT 状态
客户端收到之后进入 FIN-WAIT-2  状态
过了一会等数据处理完，再次发送 FIN、ACK，seq = q，ack = p + 1，进入 LAST-ACK 阶段
客户端收到 FIN 之后，客户端收到之后进入 TIME_WAIT（等待 2MSL），然后发送 ACK 给服务端 ack = 1 + 1
服务端收到之后进入 CLOSED 状态
客户端这个时候还需要等待两次 MSL 之后，如果没有收到服务端的重发请求，就表明 ACK 成功到达，挥手结束，客户端变为 CLOSED 状态，否则进行 ACK 重发

为什么需要等待 2MSL（Maximum Segement Lifetime）：

因为如果不等待的话，如果服务端还有很多数据包要给客户端发，且此时客户端端口被新应用占据，那么就会接收到无用的数据包，造成数据包混乱，所以说最保险的方法就是等服务器发来的数据包都死翘翘了再启动新应用。

1个 MSL 保证四次挥手中主动关闭方最后的 ACK 报文能最终到达对端
1个 MSL 保证对端没有收到 ACK 那么进行重传的 FIN 报文能够到达
为什么是四次而不是三次？

**如果是三次的话，那么服务端的 ACK 和 FIN 合成一个挥手，那么长时间的延迟可能让 TCP 一位 FIN 没有达到服务器端，然后让客户的不断的重发 FIN



## 在交互过程中如果数据传送完了，还不想断开连接怎么办，怎么维持？

在 HTTP 中响应体的 Connection 字段指定为 keep-alive


## WebSocket与Ajax的区别

本质不同
Ajax 即异步 JavaScript 和 XML，是一种创建交互式网页的应用的网页开发技术

websocket 是 HTML5 的一种新协议，实现了浏览器和服务器的实时通信

生命周期不同：

websocket 是长连接，会话一直保持
ajax 发送接收之后就会断开
适用范围：

websocket 用于前后端实时交互数据
ajax 非实时
发起人：

AJAX 客户端发起
WebSocket 服务器端和客户端相互推送