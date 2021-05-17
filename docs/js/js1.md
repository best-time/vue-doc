## JavaScript垃圾回收机制

标记清除（ mark and sweep）

这是 JavaScript最常见的垃圾回收方式。当变量进入执行环境的时候，比如在函数中声明一个变量，垃圾回收器将其标记为“进入环境”。
当变量离开环境的时候（函数执行结束），将其标记为“离开环境”。

垃圾回收器会在运行的时候给存储在内存中的所有变量加上标记，然后去掉环境中的变量，以及被环境中变量所引用的变量（闭包）的标记。
在完成这些之后仍然存在的标记就是要删除的变量。


引用计数（ reference counting）

在低版本的E中经常会发生内存泄漏，很多时候就是因为它采用引用计数的方式进行垃圾回收。引用计数的策略是跟踪记录每个值被使用的次数。

当声明了一个变量并将个引用类型赋值给该变量的时候，这个值的引用次数就加1.如果该变量的值变成了另外一个，则这个值的引用次数减1.当这个值的引用次数变为0的时候，说明没有变量在使用，这个值没法被访问。

因此，可以将它占用的空间回收，这样垃圾回收器会在运行的时候清理引用次数为0的值占用的空间在正中虽然 JavaScript对象通过标记清除的方式进行垃圾回收，但是BOM与DOM对象是用引用计数的方式回收垃圾的。

也就是说，只要涉及BOM和DOM，就会出现循环引用问题


## script标签中 defer和 async属性的区别

（1） defer属性规定是否延迟执行脚本，直到页面加载为止， async属性规定脚本一旦可用，就异步执行。
（2） defer并行加载 JavaScript文件，会按照页面上 script标签的顺序执行，
  async并行加载 JavaScript文件，下载完成立即执行，不会按照页面上 script标签的顺序执行。

## 在DOM操作中怎样创建、添加、移除、替换、插入和查找节点
```
1）通过以下代码创建新节点。

createDocumentFragment ()
//创建一个D0M片段

createElement ()
//创建一个具体的元素

createTextNode ()
//创建一个文本节点


（2）通过以下代码添加、移除、替换、插入节点

appendchild()
removechild()
eplacechild ()
insertBefore ()
//并没有 insertAfter（）
（3）通过以下代码查找节点。
getElementsByTagName ()
//通过标签名称查找节点
getElementsByName ()
//通过元素的name属性的值查找节点（IE容错能力较强，会得到一个数//组，其中包括id等于name值的节点）
getElementById()
//通过元素Id查找节点，具有唯一性
```


## new操作符的作用

（1）创建一个空对象。
（2）由this变量引用该对象
（3）该对象继承该函数的原型（更改原型链的指向）
（4）把属性和方法加入到this引用的对象中。
（5）新创建的对象由this引用，最后隐式地返回this

## 对象属性类型
Configurable: 表示是否通过delete删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为访问器属性。默认值是true

Enumerable: 表示能否通过for-in循环返回属性。默认值是true

Writable: 表述能否修改属性。默认值是true

Value: 包含这个属性的数据值。默认值是true


## 跨域
　1. jsonp: 需要服务器配合一个callback函数
　2. CORS: 需要服务器设置header ：Access-Control-Allow-Origin
　3. window.name + iframe: 需要目标服务器响应window.name。
　4. document.domain : 仅限主域相同，子域不同的跨域应用场景。(原理: 两个页面都通过js强制设置document.domain为基础主域，就实现了同域)
　5. html5的 postMessage + iframe: 需要服务器或者目标页面写一个postMessage，主要侧重于前端通讯。
　6. nginx反向代理: 不用服务器配合，需要搭建一个中转nginx服务器，用于转发请求。

```
// jsonp

<script>
    var script = document.createElement('script');
    script.type = 'text/javascript';

    // 传参一个回调函数名给后端，方便后端返回时执行这个在前端定义的回调函数
    script.src = 'http://xxxxxxx:8080/login?callback=handleCallback';
    document.head.appendChild(script);

    function handleCallback(res) {
        alert(JSON.stringify(res));
    }
</script>

<?php
  $callback = $_GET['callback'];//得到回调函数名
  $data = array('a','b','c');//要返回的数据
  echo $callback.'('.json_encode($data).')';//输出
?>
```

```
在父页面 http://xxx.com/a.html 中设置document.domain

<iframe id = "iframe" src="http://xxx.com/b.html" onload = "test()"></iframe>
<script type="text/javascript">
    document.domain = 'xxx.com';//设置成主域
    function test(){
       alert(document.getElementById('￼iframe').contentWindow);
       //contentWindow 可取得子窗口的 window 对象
    }
</script>

在子页面http://xxx.com/b.html 中设置document.domain

<script type="text/javascript">
    document.domain = 'xxx.com';
    //在iframe载入这个页面也设置document.domain，使之与主页面的document.domain相同
</script>
```


```
postMessage(data, origin)方法接受两个参数：

data：html5规范支持任意基本类型或可复制的对象，但部分浏览器只支持字符串，所以传参时最好用JSON.stringify()序列化。

origin：协议+主机+端口号，也可以设置为"*"，表示可以传递给任意窗口，如果要指定和当前窗口同源的话设置为"/"。

栗子：
假如有一个页面，页面中拿到部分用户信息，点击进入另外一个页面，另外的页面默认是取不到用户信息的，你可以通过window.postMessage把部分用户信息传到这个页面中。（需要考虑安全性等方面。）

发送消息：

// 弹出一个新窗口
var domain = 'http://haorooms.com';
var myPopup = window.open(`${domain}/windowPostMessageListener.html`,'myWindow');

// 发送消息
setTimeout(function(){
  var message = {name:"站点",sex:"男"};
  console.log('传递的数据是  ' + message);
  myPopup.postMessage(message, domain);
}, 1000);


接收消息：

// 监听消息反馈
window.addEventListener('message', function(event) {
  // 判断域名是否正确
  if (event.origin !== 'http://haorooms.com') return;
  console.log('received response: ', event.data);
}, false);



使用iframe，代码应该这样写：

// 捕获iframe
var domain = 'http://haorooms.com';
var iframe = document.getElementById('myIFrame').contentWindow;

// 发送消息
setTimeout(function(){
    var message = {name:"站点",sex:"男"};
    console.log('传递的数据是:  ' + message);
    iframe.postMessage(message, domain);
},1000);
接收数据并反馈信息：

// 响应事件
window.addEventListener('message',function(event) {
    if(event.origin !== 'http://haorooms.com') return;
    console.log('message received:  ' + event.data, event);
    event.source.postMessage(event.origin);
}, false);


source – 消息源，消息的发送窗口/iframe。
origin – 消息源的URI(可能包含协议、域名和端口)，用来验证数据源。
data – 发送方发送给接收方的数据。

```


```
window.name

原理：
window对象有个name属性，该属性有个特征：即在一个窗口(window)的生命周期内,窗口载入的所有的页面都是共享一个window.name，每个页面对window.name都有读写的权限，window.name是持久存在一个窗口载入过的所有页面中的。

栗子：
在子页面(b.com/data.html) 设置window.name：

/* b.com/data.html */
<script type="text/javascript">
   window.name = 'I was there!';
   // 这里是要传输的数据，大小一般为2M，IE和firefox下可以大至32M左右
   // 数据格式可以自定义，如json、字符串
</script>
在父页面（a.com/app.html）中创建一个iframe，把其src指向子页面。在父页面监听iframe的onload事件，获取子页面数据：

/* a.com/app.html */
<script type="text/javascript">
    var iframe = document.createElement('iframe');
    iframe.src = 'http://b.com/data.html';
    function iframelLoadFn() {
      var data = iframe.contentWindow.name;
      console.log(data);
      // 获取数据以后销毁iframe，释放内存；这也保证了安全（不被其他域frame js访问）。
      iframeDestoryFn();
    }

    function iframeDestoryFn() {
      iframe.contentWindow.document.write('');
      iframe.contentWindow.close();
      document.body.removeChild(iframe);
    }

    if (iframe.attachEvent) {
        iframe.attachEvent('onload', iframelLoadFn);
    } else {
        iframe.onload = iframelLoadFn;
    }
    document.body.appendChild(iframe);
</script>
```


## ajax
all.js


## Iterator Generator


## instanceof
instanceof 运算符用来测试一个对象在其原型链中是否存在一个构造函数的 prototype 属性
console.log(2 instanceof Number);                    // false
console.log(true instanceof Boolean);                // false
console.log('str' instanceof String);                // false

## null 为什么判断成object
其实 null 不是对象，虽然 typeof null 会输出 object，但是这只是 JS 存在的一个悠久 Bug。
在 JS 的最初版本中使用的是 32 位系统，为了性能考虑使用低位存储变量的类型信息，000 开头代表是对象，
然而 null 表示为全零，所以将它错误的判断为 object 。虽然现在的内部类型判断代码已经改变了，但是对于这个 Bug 却是一直流传下来。


## this call apply 理解
在浏览器里，在全局范围内this 指向window对象；
在函数中，this永远指向最后调用他的那个对象；
构造函数中，this指向new出来的那个新的对象；
call、apply、bind中的this被强绑定在指定的那个对象上；
箭头函数中this比较特殊,箭头函数this为父作用域的this，不是调用时的this.要知道前四种方式,都是调用时确定,也就是动态的,而箭头函数的this指向是静态的,声明的时候就确定了下来；
apply、call、bind都是js给函数内置的一些API，调用他们可以为函数指定this的执行,同时也可以传参。


## 原型，原型链？ 有什么特点
在 js 中我们是使用构造函数来新建一个对象的，每一个构造函数的内部都有一个 prototype 属性值，这个属性值是一个对
象，这个对象包含了可以由该构造函数的所有实例共享的属性和方法。当我们使用构造函数新建一个对象后，在这个对象的内部
将包含一个指针，这个指针指向构造函数的 prototype 属性对应的值，在 ES5 中这个指针被称为对象的原型。一般来说我们
是不应该能够获取到这个值的，但是现在浏览器中都实现了 proto 属性来让我们访问这个属性，但是我们最好不要使用这
个属性，因为它不是规范中规定的。ES5 中新增了一个 Object.getPrototypeOf() 方法，我们可以通过这个方法来获取对
象的原型。
当我们访问一个对象的属性时，如果这个对象内部不存在这个属性，那么它就会去它的原型对象里找这个属性，这个原型对象又
会有自己的原型，于是就这样一直找下去，也就是原型链的概念。原型链的尽头一般来说都是 Object.prototype 所以这就
是我们新建的对象为什么能够使用 toString() 等方法的原因。
特点：
JavaScript 对象是通过引用来传递的，我们创建的每个新对象实体中并没有一份属于自己的原型副本。当我们修改原型时，与
之相关的对象也会继承这一改变。

获取原型的方法？
p.proto
p.constructor.prototype
Object.getPrototypeOf(p)


## JSON.parse(JSON.stringify(obj))实现深拷贝的弊端
1. new Date()时间将只是字符串的形式。而不是时间对象
2. RegExp、Error对象，则序列化的结果将只得到空对象
3. 函数，undefined，则序列化的结果会把函数或 undefined丢失
4. NaN、Infinity和-Infinity，则序列化的结果会变成null
5. 只能序列化对象的可枚举的自有属性，例如 如果obj中的对象是有构造函数生成的，
则使用JSON.parse(JSON.stringify(obj))深拷贝后，会丢弃对象的constructor
6. 存在循环引用的情况也无法正确实现深拷贝

## 页面通信
1.
window.open() + functionName
window.opener.functionName

2. iframe
parent.window 通过contentWindow，我们可以拿到iframe内部的方法和dom元素，进而可以操控iframe页面
parent.window拿到父页面的window