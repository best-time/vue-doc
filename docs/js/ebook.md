## 字符串借用数组方法

```javascript
var a = "foo"
var c = a
var d = a
Array.prototype.join.call( a, "-" );
Array.prototype.map.call( a, function(v){
  return v.toUpperCase() + ".";
} ).join( "" );

c; // "f-o-o"
d; // "F.O.O."
```

## 数字表示方式

```javascript
1E3  // 1 * 10^3

是否是整数


if (!Number.isInteger) { 
	Number.isInteger = function(num) {
		return typeof num == "number" && num % 1 == 0; 
	};
}

是否是安全整数
if (!Number.isSafeInteger) { 
	Number.isSafeInteger = function(num) {
		return Number.isInteger( num ) &&
		Math.abs( num ) <= Number.MAX_SAFE_INTEGER;
	}; 
}


if (!Number.isNaN) { 
	Number.isNaN = function(n) {
		return (
			typeof n === "number" && window.isNaN( n )
		);
	}
}


实际上还有一个更简单的方法，即利用 NaN 不等于自身这个特点。
NaN 是 JavaScript 中唯 一一个不等于自身的值。
于是我们可以这样:
if (!Number.isNaN) { 
	Number.isNaN = function(n) {
             return n !== n;
         };
}


// 是否是 -0
function isNegZero(n) {
         n = Number( n );
	return (n === 0) && (1 / n === -Infinity); 
}


es6 提供了 Object.is(0, -0) 
主要用来处理那些特殊的相等比较。



```

## void

```javascript
return void setTimeout( doSomething,100 );

等于

setTimeout( doSomething,100 );
return;
```

## Date
```javascript


if (!Date.now) {
	Date.now = function(){
		return (new Date()).getTime();
	 };
}
```

## ~
```javascript
~x 大致等同于 -(x+1)
对于  indexOf 为-1的时候 可以使用
```

## ~~

```javascript
取整
~~2.1   // 2
~~2.9  // 2

~~-1.1 // -1
```

## json.stringify
```javascript
JSON.stringify( a, 
	function(key,val){ 
	if (typeof val == "function") {
	// 函数的ToBoolean强制类型转换
	             return !!val;
	         } else {
	             return val;
	} 
} );


// toJSON()
JSON.stringify({ x: 5, y: 6, toJSON(){ return this.x + this.y; } });
// '11'



toJSON()

Boolean, Number, and String  本身

undefined, Functions, and Symbols =>  undefined

Symbol 的可以, 会被忽视, 及时传了toJSON()

Infinity NaN null   => null

Map, Set, WeakMap, and WeakSet  返回可枚举的key值



JSON.stringify({});                    // '{}'
JSON.stringify(true);                  // 'true'
JSON.stringify('foo');                 // '"foo"'
JSON.stringify([1, 'false', false]);   // '[1,"false",false]'
JSON.stringify([NaN, null, Infinity]); // '[null,null,null]'
JSON.stringify({ x: 5 });              // '{"x":5}'

JSON.stringify(new Date(2006, 0, 2, 15, 4, 5)) 
// '"2006-01-02T15:04:05.000Z"'

JSON.stringify({ x: 5, y: 6 });
// '{"x":5,"y":6}'
JSON.stringify([new Number(3), new String('false'), new Boolean(false)]);
// '[3,"false",false]'

// String-keyed array elements are not enumerable and make no sense in JSON
let a = ['foo', 'bar'];
a['baz'] = 'quux';      // a: [ 0: 'foo', 1: 'bar', baz: 'quux' ]
JSON.stringify(a); 
// '["foo","bar"]'

JSON.stringify({ x: [10, undefined, function(){}, Symbol('')] }); 
// '{"x":[10,null,null,null]}' 

// Standard data structures
JSON.stringify([new Set([1]), new Map([[1, 2]]), new WeakSet([{a: 1}]), new WeakMap([[{a: 1}, 2]])]);
// '[{},{},{},{}]'

// TypedArray
JSON.stringify([new Int8Array([1]), new Int16Array([1]), new Int32Array([1])]);
// '[{"0":1},{"0":1},{"0":1}]'
JSON.stringify([new Uint8Array([1]), new Uint8ClampedArray([1]), new Uint16Array([1]), new Uint32Array([1])]);
// '[{"0":1},{"0":1},{"0":1},{"0":1}]'
JSON.stringify([new Float32Array([1]), new Float64Array([1])]);
// '[{"0":1},{"0":1}]'
 
// toJSON()
JSON.stringify({ x: 5, y: 6, toJSON(){ return this.x + this.y; } });
// '11'

// Symbols:
JSON.stringify({ x: undefined, y: Object, z: Symbol('') });
// '{}'
JSON.stringify({ [Symbol('foo')]: 'foo' });
// '{}'
JSON.stringify({ [Symbol.for('foo')]: 'foo' }, [Symbol.for('foo')]);
// '{}'
JSON.stringify({ [Symbol.for('foo')]: 'foo' }, function(k, v) {
  if (typeof k === 'symbol') {
    return 'a symbol';
  }
});
// undefined

// Non-enumerable properties:
JSON.stringify( Object.create(null, { x: { value: 'x', enumerable: false }, y: { value: 'y', enumerable: true } }) );
// '{"y":"y"}'


// BigInt values throw
JSON.stringify({x: 2n});
// TypeError: BigInt value can't be serialized in JSON





```

## 字符串

```
var s1 = Symbol( "cool" );
String( s1 ); // "Symbol(cool)"

var s2 = Symbol( "not cool" ); 
s2 + ""; // TypeError
```

## ==  和 ===
```javascript
有人觉得 == 会比 === 慢，实际上虽然强制类型转换确实要多花点时间，
但仅仅是微秒级 (百万分之一秒)的差别而已。

规范 11.9.3.6-7 是这样说的:
(1) 如果 Type(x) 是布尔类型，则返回 ToNumber(x) == y 的结果;
(2) 如果 Type(y) 是布尔类型，则返回 x == ToNumber(y) 的结果。 
仔细分析例子，首先:
var x = true; 
var y = "42";
x == y; // false

避免了 == true 和 == false(也叫作布尔值的宽松相等)
之后我们就不用担心这些坑了


对象和非对象之间的相等比较
关于对象(对象 / 函数 / 数组)和标量基本类型(字符串 / 数字 / 布尔值)之间的相等比 较，ES5 规范 11.9.3.8-9 做如下规定:
(1) 如果 Type(x) 是字符串或数字，Type(y) 是对象，则返回 x == ToPrimitive(y) 的结果; 
(2) 如果 Type(x) 是对象，Type(y) 是字符串或数字，则返回 ToPromitive(x) == y 的结果。

 var a = 42;
 var b = [ 42 ];
a == b; // true


⭐️⭐️⭐️⭐️⭐️⭐️⭐️
安全运用隐式强制类型转换
我们要对 == 两边的值认真推敲，以下两个原则可以让我们有效地避免出错。
• 如果两边的值中有 true 或者 false，千万不要使用 ==。
• 如果两边的值中有 []、"" 或者 0，尽量不要使用 ==。




```


## try .. finally
```javascript
function foo() {
             try {
	return 42;
	}
	finally {
		console.log( "Hello" ); 
	 }
	 console.log( "never runs" );
}
console.log( foo() ); 
// Hello
// 42

function foo() {
       try {
		throw 42; 
		}
	finally {
		console.log( "Hello" );
	}
console.log( "never runs" );
}
console.log( foo() );
// Hello
// Uncaught Exception: 42



finally 中的 return 会覆盖 try 和 catch 中 return 的返回值:

function foo() {
        try {
                return 42;
        finally {
		// 没有返回语句，所以没有覆盖
		} 
}

function bar() {
        try {
		 return 42;
		}
	finally {
	// 覆盖前面的 return 42
	return; 
	}
}
     function baz() {
             try {
			return 42;
		}
		finally {
		// 覆盖前面的 return 42 
			return "Hello";
		}
 }
foo();  // 42
bar();  // undefined
baz();  // Hello

```



## 迭代器

```javascript
// 多个迭代器
function *foo() {
    var x = yield 2;
    z++;
    var y = yield (x * z);
    console.log( x, y, z );
}

var z = 1;
var it1 = foo();
var it2 = foo();

var val1 = it1.next().value; // 2 <-- yield 2
var val2 = it2.next().value; // 2 <-- yield 2

val1 = it1.next( val2 * 10 ).value; // 40 <-- x:20, z:2
val2 = it2.next( val1 * 5 ).value; // 600 <-- x:200, z:3

it1.next( val2 / 2 ); // y:300
// 20 300 3
it2.next( val1 / 4 ); // y:10
// 200 10 3

流程分析:
(1) *foo() 的两个实例同时启动，两个 next() 分别从 yield 2 语句得到值 2 。
(2) val2 * 10 也就是 2 * 10 ，发送到第一个生成器实例 it1 ，因此 x 得到值 20 。 z 从 1 增
加到 2 ，然后 20 * 2 通过 yield 发出，将 val1 设置为 40 。
(3) val1 * 5 也就是 40 * 5 ，发送到第二个生成器实例 it2 ，因此 x 得到值 200 。 z 再次从 2
递增到 3 ，然后 200 * 3 通过 yield 发出，将 val2 设置为 600 。
(4) val2 / 2 也就是 600 / 2 ，发送到第一个生成器实例 it1 ，因此 y 得到值 300 ，然后打印
出 x y z 的值分别是 20 300 3 。
(5) val1 / 4 也就是 40 / 4 ，发送到第二个生成器实例 it2 ，因此 y 得到值 10 ，然后打印出
x y z 的值分别为 200 10 3 。



demo2 
function *foo() {
    var x = yield 2;
	console.log(x, 'xxx')
    z++;
    var y = yield (x * z);
    console.log( x, y, z );
}

var z = 1;
var aa = foo()

执行1
aa.next() // {value: 2, done: false}
aa.next(9) // 9 "xxx"  {value: 18, done: false}
aa.next(99) // 9 99 2 {value: undefined, done: true}

执行2
aa.next() // {value: 2, done: false}
aa.next() // undefined "xxx"  {value: NaN, done: false}
aa.next() // undefined undefined 2  {value: undefined, done: true}



从 ES6 开始，从一个 iterable 中提取迭代器的方法是：
iterable 必须支持一个函数，其名称
是专门的 ES6 符号值 Symbol.iterator 。调用这个函数时，
它会返回一个迭代器。通常每
次调用会返回一个全新的迭代器，虽然这一点并不是必须的
var a = [1,3,5,7,9];
var it = a[Symbol.iterator]();
it.next().value; // 1
it.next().value; // 3
it.next().value; // 5




```

















