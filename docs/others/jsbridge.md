# jsbridge

https://mp.weixin.qq.com/s/cBsmunLXLBEtR14cFfy1LQ

#### Url scheme

你可以在浏览器里面直接输入 `weixin://`，系统就会提示你是否要打开微信。输入 `mqq://` 就会帮你唤起手机 QQ。

```
URI = scheme:[//authority]path[?query][#fragment]
// scheme     = http
// authority  = www.baidu.com
// path       = /link
// query      = url=xxxxx
authority = [userinfo@]host[:port]
```

 Android 里面需要到 AndroidManifest.xml 文件中去注册 Scheme

在 iOS 中需要在 Xcode 里面注册，有一些已经是系统使用的不应该使用，比如 Maps、YouTube、Music。

具体可以参考苹果开发者官网文档：Defining a Custom URL Scheme for Your App



#### Js 调用Native

iOS 里面又需要区分 UIWebView 和 WKWebView 两种 WebView：WKWebView 是 iOS8 之后出现的，目的是取代笨重的 UIWebView，它占用内存更少，大概是 UIWebView 的 1/3，支持更好的 HTML5 特性，性能更加强大。

但也有一些缺点，比如不支持缓存，需要自己注入 Cookie，发送 POST 请求的时候带不了参数，拦截 POST 请求的时候无法解析参数等等。



#### JS 调用 Native 通信大致有三种方法：

1. 拦截 Scheme
2. 弹窗拦截
3. 注入 JS 上下文

##### 拦截 Scheme

```


axios.get('http://xxxx?func=scan&callback_id=yyyy')
客户端可以拦截这个请求，去解析参数上面的 func 来判断当前需要调起哪个功能。客户端调起扫码功能之后，会获取 WebView 上面的 callbacks 对象，根据 callback_id 回调它。

所以基于上面的例子，我们可以把域名和路径当做通信标识，参数里面的 func 当做指令，callback_id 当做回调函数，其他参数当做数据传递。对于不满足条件的 http 请求不应该拦截。

当然了，现在主流的方式是前面我们看到的自定义 Scheme 协议，以这个为通信标识，域名和路径当做指令。

这种方式的好处就是 iOS6 以前只支持这种方式，兼容性比较好。
```

##### js 端

```


使用 a 标签跳转
<a href="taobao://">点击我打开淘宝</a>

重定向
location.href = "taobao://"

iframe 跳转
const iframe = document.createElement("iframe");
iframe.src = "taobao://"
iframe.style.display = "none"
document.body.appendChild(iframe)

Android 端

在 Android 侧可以用 shouldOverrideUrlLoading 来拦截 url 请求。

@Override
public boolean shouldOverrideUrlLoading(WebView view, String url) {
    if (url.startsWith("taobao")) {
        // 拿到调用路径后解析调用的指令和参数，根据这些去调用 Native 方法
        return true;
    }
}


在 iOS 侧需要区分 UIWebView 和 WKWebView 两种方式。

在 UIWebView 中：

- (BOOL)shouldStartLoadWithRequest:(NSURLRequest *)request
                    navigationType:(BPWebViewNavigationType)navigationType
{

    if (xxx) {
        // 拿到调用路径后解析调用的指令和参数，根据这些去调用 Native 方法
        return NO;
    }

    return [super shouldStartLoadWithRequest:request navigationType:navigationType];
}


在 WKWebView 中：

- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(nonnull WKNavigationAction *)navigationAction decisionHandler:(nonnull void (^)(WKNavigationActionPolicy))decisionHandler
{
    if(xxx) {
        // 拿到调用路径后解析调用的指令和参数，根据这些去调用 Native 方法
        BLOCK_EXEC(decisionHandler, WKNavigationActionPolicyCancel);
    } else {
        BLOCK_EXEC(decisionHandler, WKNavigationActionPolicyAllow);
    }

    [self.webView.URLLoader webView:webView decidedPolicy:policy forNavigationAction:navigationAction];
}
```

目前不建议只使用拦截 URL Scheme 解析参数的形式，主要存在几个问题。

1. 连续续调用 `location.href` 会出现消息丢失，因为 WebView 限制了连续跳转，会过滤掉后续的请求。
2. URL 会有长度限制，一旦过长就会出现信息丢失 因此，类似 WebViewJavaScriptBridge 这类库，就结合了注入 API 的形式一起使用，这也是我们这边目前使用的方式，后面会介绍一下。





##### 弹窗拦截

安卓实现

这种方式是利用弹窗会触发 WebView 相应事件来拦截的。

一般是在 `setWebChromeClient` 里面的 `onJsAlert`、`onJsConfirm`、`onJsPrompt` 方法拦截并解析他们传来的消息。

```
// 拦截 Prompt
@Override
public boolean onJsPrompt(WebView view, String url, String message, String defaultValue, JsPromptResult result) {
       if (xxx) {
        // 解析 message 的值，调用对应方法
       }
       return super.onJsPrompt(view, url, message, defaultValue, result);
   }
// 拦截 Confirm
@Override
public boolean onJsConfirm(WebView view, String url, String message, JsResult result) {
       return super.onJsConfirm(view, url, message, result);
   }
// 拦截 Alert
@Override
public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
       return super.onJsAlert(view, url, message, result);
   }
```

ios 实现

我们以 WKWebView 为例：

```
+ (void)webViewRunJavaScriptTextInputPanelWithPrompt:(NSString *)prompt
    defaultText:(NSString *)defaultText
    completionHandler:(void (^)(NSString * _Nullable))completionHandler
{
    /** Triggered by JS:
    var person = prompt("Please enter your name", "Harry Potter");
    if (person == null || person == "") {
       txt = "User cancelled the prompt.";
    } else {
       txt = "Hello " + person + "! How are you today?";
    }
    */
    if (xxx) {
        BLOCK_EXEC(completionHandler, text);
    } else {
        BLOCK_EXEC(completionHandler, nil);
    }
 }

```

这种方式的缺点就是在 iOS 上面 UIWebView 不支持，虽然 WKWebView 支持，但它又有更好的 `scriptMessageHandler`，比较尴尬。



##### 注入上下文

前面我们有讲过在 iOS 中内置了 JavaScriptCore 这个框架，可以实现执行 JS 以及注入 Native 对象等功能。

这种方式不依赖拦截，主要是通过 WebView 向 JS 的上下文注入对象和方法，可以让 JS 直接调用原生。

PS：iOS 中的 Block 是 OC 对于闭包的实现，它本质上是个对象，定义 JS 里面的函数。

ios uiwebview

iOS 侧代码：

```

// 获取 JS 上下文
JSContext *context = [webview valueForKeyPath:@"documentView.webView.mainFrame.javaScriptContext"];
// 注入 Block
context[@"callHandler"] = ^(JSValue * data) {
    // 处理调用方法和参数
    // 调用 Native 功能
    // 回调 JS Callback
}
```

js代码

```
window.callHandler(JSON.stringify({
    type: "scan",
    data: "",
    callback: function(data) {
    }
}));
```

这种方式的牛逼之处在于，JS 调用是同步的，可以立马拿到返回值。

我们也不再需要像拦截方式一样，每次传值都要把对象做 `JSON.stringify`，可以直接传 JSON 过去，也支持直接传一个函数过去。



```
iOS WKWebView

WKWebView 里面通过 addScriptMessageHandler 来注入对象到 JS 上下文，可以在 WebView 销毁的时候调用 removeScriptMessageHandler 来销毁这个对象。

前端调用注入的原生方法之后，可以通过 didReceiveScriptMessage 来接收前端传过来的参数。
```



#### Native 调用 JS

Native 调用 JS 一般就是直接 JS 代码字符串，有些类似我们调用 JS 中的 `eval` 去执行一串代码。一般有 `loadUrl`、`evaluateJavascript` 等几种方法，这里逐一介绍。

但是不管哪种方式，客户端都只能拿到挂载到 `window` 对象上面的属性和方法。

安卓调用方式

```
if (Build.VERSION.SDK_INT > 19) //see what wrapper we have
{
    webView.evaluateJavascript("javascript:foo()", null);
} else {
    webView.loadUrl("javascript:foo()");
}
```



```
UIWebView

在 iOS 的 UIWebView 里面使用 stringByEvaluatingJavaScriptFromString 来调用 JS 代码。这种方式是同步的，会阻塞线程。

results = [self.webView stringByEvaluatingJavaScriptFromString:"foo()"];
```



```
WKWebView

WKWebView 可以使用 evaluateJavaScript 方法来调用 JS 代码。

[self.webView evaluateJavaScript:@"document.body.offsetHeight;" completionHandler:^(id _Nullable response, NSError * _Nullable error) {
    // 获取返回值 response
    }];
```



#### JS Bridge 设计

前面讲完了 JS 和 Native 互调的所有方法，这里来介绍一下我们这边 JS Bridge 的设计吧。

我们这边的 JS Bridge 通信是基于 WebViewJavascriptBridge 这个库来实现的。

主要是结合 Scheme 协议+上下文注入来做。考虑到 Android 和 iOS 不一样的通信方式，这里进行了封装，保证提供给外部的 API 一致。

具体功能的调用我们封装成了 npm 包，下面的是几个基础 API：

1. callHandler(name, params, callback)：这个是调用 Native 功能的方法，传模块名、参数、回调函数给 Native。
2. hasHandler(name)：这个是检查客户端是否支持某个功能的调用。
3. registerHandler(name)：这个是提前注册一个函数，等待 Native 回调，比如 `pageDidBack` 这种场景。