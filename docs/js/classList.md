## Element.classList

是一个只读属性，返回一个元素的类属性的实时 [`DOMTokenList`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMTokenList) 集合。

```
方法
add( String [, String [, ...]] )
添加指定的类值（class value）。如果这些类已经存在于元素的属性中，那么它们将被忽略。

remove( String [, String [, ...]] )
删除指定的类值。
注意： 即使删除不存在的类值也不会导致抛出异常。

item( Number )
按集合中的索引返回类值。

toggle( String [, force] )
当只有一个参数时：切换类值；也就是说，即如果类值存在，则删除它并返回 false，如果不存在，则添加它并返回 true。
当存在第二个参数时：若第二个参数的执行结果为 true，则添加指定的类值，若执行结果为 false，则删除它。

contains( String )
检查元素的类 class 属性中是否存在指定的类值。

replace( oldClass, newClass )
用一个新类值替换已有的类值。
```



```javascript
// 示例
const div = document.createElement('div');
div.className = 'foo';

// 初始状态：<div class="foo"></div>
console.log(div.outerHTML);

// 使用 classList API 移除、添加类值
div.classList.remove("foo");
div.classList.add("anotherclass");

// 得到；<div class="anotherclass"></div>
console.log(div.outerHTML);

// 如果 visible 类值已存在，则移除它，否则添加它
div.classList.toggle("visible");

// add/remove visible, depending on test conditional, i less than 10
div.classList.toggle("visible", i < 10 );

console.log(div.classList.contains("foo"));

// 添加或移除多个类值
div.classList.add("foo", "bar", "baz");
div.classList.remove("foo", "bar", "baz");

// 使用展开语法添加或移除多个类值
const cls = ["foo", "bar"];
div.classList.add(...cls); 
div.classList.remove(...cls);

// 将类值 "foo" 替换成 "bar"
div.classList.replace("foo", "bar");
```

