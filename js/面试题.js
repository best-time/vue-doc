https://github.com/mqyqingfeng
https://github.com/CavsZhouyou

百度
一面

webpack 中 chunkHash 与 contentHash 区别；
写过 webpack 的 loader 和 plugin 么；
webpack 处理 image 是用哪个 loader，限制成 image 大小的是...；
webpack 将 css 合并成一个；
webpack 的摇树对 commonjs 和 es6 module 都生效么，原理是；
实现一下「模版字符串」功能；
实现一下 Promise.all (Promise 不用写)；
怎么实现响应式布局的；
css flex 的各个属性值；
css 动画 animation 各个时间值含义；
css 如何实现让一个元素旋转并横向移动，如果只用一个 css 属性；
less 与 sass 区别，技术选型时如何取舍；
ES6 symbol 如何使用以及使用场景；
ES6 Proxy 如何使用以及使用场景，说说 Reflect；
generator 有什么应用场景;
async await 如何实现的；
git reset 与 revert 区别，revert 多个 mr 改如何处理；
git 如何撤回 add 后的内容；
http2 与 http1.1 区别，了解 http3 么，说说；
tcp 与 udp 的区别；

二面

介绍一下项目；
手写在 给定的 n 个数中随机取出 m 个数，要求等概率；
手写一下防抖节流函数；
设计实现一个「星级评分」组件；
说说 http 缓存；
call、apply、bind 三者的区别，如何实现 bind；


题目一: 请实现 find 函数，使下列的代码调用正确。
// 约定：
// title数据类型为String
// userId为主键，数据类型为Number
var data = [
  {userId: 8,  title: 'title1'},
  {userId: 11, title: 'other'},
  {userId: 15, title: null},
  {userId: 19, title: 'title2'}
];
var find = function(origin) {
  // your code are here...
}
// 查找 data 中，符合条件的数据，并进行排序
var result = find(data).where({
  'title': /\d$/
}).orderBy('userId', 'desc');

console.log(result);// [{ userId: 19, title: 'title2'}, { userId: 8, title: 'title1' }];




一面

介绍一下你自己，以及项目，简单说一下你做了什么，有什么难点及亮点；
js 有哪些基本类型，说说 typeof 与 instanceof；
说说 new 操作符；
什么是 event loop；
Promise 的用法？了解 allSettled 方法么，怎么实现？
说说闭包；
ES5 实现继承的方法;
说说跨域；
commonJS 与 ES6 模块化区别；
webpack 了解么？loader、plugin 分别是干嘛的？如何实现一个 loader？
webpack 如何优化打包速度；
说一下 css 盒模型，border-box 和 content-box 区别；
说说 BFC；
移动端响应式布局怎么实现的；
说一说 flex 布局，有了解 Grid 么；
有兼容 retina 屏幕的经历吗？如何在移动端实现 1 px 的线;
说一下 react 组件的生命周期；
react 组件如何做性能优化，说说 pureComponent；
调用 setState 之后发生了什么;
了解 fiber 么？解决了什么问题？具体原理是；
有用过 hooks 么？怎么看待 hooks？它的原理是；
了解过 react 最新的一些动态么？time slice 、suspense、server component 能说说么；
了解最近一些新技术么，webpack5 做了哪些新突破；
为什么 vite、snowpack 可以比 webpack 快那么多？具体原理是；
什么是 CSRF 攻击，怎么预防；
为什么说用 css 实现动画比 js 动画性能好；
什么是 合成层；
http2 与 http1.1 区别；
说一说 http 缓存；
http 状态码；



腾讯
一面

手写大数相加方法；
实现一个方块的拖拽；
问了一些项目的问题，以及相关技术细节；
从一个 URL 输入到页面渲染，经历了哪些过程，尽可能的详细；
tcp 握手 回收过程，了解泛洪攻击么；
说说 event loop（并出了一道题，写输出顺序）；
SSR 怎么做的，怎么保证同构？server 端的数据都 renderToSting 消费了，为什么还要给到 client 端；
js 的严格模式；
说说 Iterator 的使用；
说一说快速排序的过程；
node 如何捕捉错误，内存泄漏怎么排查；


二面

依旧是项目问题...
性能优化怎么做的，怎么衡量收益的；
为什么要做 SSR；
E2E 测试怎么做的，怎么保证测试覆盖率和准确性；
如何合理分配 node 服务资源；



三面

项目...;
hybrid 通信原理；
如何看待小程序，它的技术原理是；
设计一个协同文档的技术流程；
离线包怎么做的，现在公司的 app 提供了哪些特殊能力；
质量保障平台如何做的，项目中单元测试怎么做的，为什么要有 E2E 测试；


四面

希尔排序，堆排，快排；
this 指向问题，说出输出内容；
如何设计一个组件库；
用过 TypeScript 么，了解哪些新特性；
说说 React Fiber...;
为什么 Fiber 双向链表的结构可以解决递归慢的问题；
了解设计模式么，说说单例模式的优缺点;


抖音和滴滴
这两家公司具体的经历我就不一一赘述，很多问题和上面三家差不多... 就简单讲讲抖音考了那几道笔试题：

二维数组中的查找；
从先序遍历还原二叉树
手写一个版本比较函数；
实现一下 cache request（请求过的数据不再请求）

// -------------------------------------------

手写代码比较常见的几道题目：

防抖节流；
手写 Promise 及相关 api 实现；
实现 bind、apply、call；
request cache；
实现模版字符串；
es6 class 转成 es5 ；
实现 Array flat 等相关 API；
实现一个版本比较函数；

实现一下some, every
flatten实现



一、携程

对着简历问一遍
rem, 计算出375的屏幕，1rem,单位出现小数怎么处理
javascript精度问题的原因
axios用途
性能优化的点，webpack分包，首页资源大小，请求优化，gzip之前还是之后，React重新渲染
国际化站点，cdn, 在页面什么阶段加载国际化文件，如果有20多个语言该怎么做
ssr有没有用过
项目中websocket是解决了什么问题
DOM, BOM, js的关系
React dom绑定事件，与原生事件有什么区别
http2多路复用




米哈游：

http状态 301，302， 304,缓存相关字段
cookie、ws是否跨域
触发bfc的方式
rem和vw的使用场景
伪代码实现下懒加载



AST作用 or babel实现原理



美团：

一、
自我介绍中提到了性能优化， 说了说性能优化的点
不同域名共享cookie
on, emit, 实现
防抖的实现
输入url到页面返回结果
缓存的实现方式
React组件重复渲染
webpack分包



字节：

一、
Webpack 插件，生命周期
umi约定式路由怎么实现的
babel实现远原理
React ref
fib实现，如何优化


太美医疗：

generate函数和async区别
webpack插件实现
叮咚买菜：

一、
Vue， React使用情况
父子组件的mounted 调用顺序
$nextTick实现原理
子元素水平垂直居中
斐波那契数列如何优化
业务题：封装一个全局的弹窗，在任何组件内都可以调用。追加：如何同时打开5个弹窗，关闭顺序又如何
二、
封装Vue插件
5个弹窗
$nextTick原理
手机号码分割 _ _ _ - _ _ _ _ - _ _ _ _
最大字符串数， “abcdabcda” 求最长的不重复字符串
兄弟组件通信
vuex 模块化怎么做
不同域名如何共享cookie