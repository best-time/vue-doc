## 字符串借用数组方法

```
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

```
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

```
return void setTimeout( doSomething,100 );

等于

setTimeout( doSomething,100 );
return;
```

## Date
```


if (!Date.now) {
	Date.now = function(){
		return (new Date()).getTime();
	 };
}
```

## ~
```
~x 大致等同于 -(x+1)
对于  indexOf 为-1的时候 可以使用
```

## ~~

```
取整
~~2.1   // 2
~~2.9  // 2

~~-1.1 // -1
```

## json.stringify
```
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
```
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
```
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



















