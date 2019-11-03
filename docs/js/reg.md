## 字面量方式、实例创建的方式
```
//->实例创建第一参数值是字符串
//->想要和字面量方式保持统一的话,对于\d \w \n...这些都需要多加一个\,
使其\d具有自己的特殊的意义

var reg = /^\d+$/ig;
console.log(reg.test("2016"));//->true
reg = new RegExp("^\d+$", "ig");
console.log(reg.test("2016"));//->false
reg = new RegExp("^\\d+$", "ig");
console.log(reg.test("2016"));//->true

```
## gim
```
g(global)->全局匹配
i(ignoreCase)->忽略大小写匹配
m(multiline)->换行匹配
```

## reg
```
元字符: ^ $ . * + ? | \ / ( ) [ ] { } = ! : - ,

\d -> 匹配一个0-9的数字,相当于[0-9]
\D ->匹配一个除了0-9的任意字符
\w -> 匹配一个0-9、a-z、A-Z、_的数字或字符,相当于[0-9a-zA-Z_]
\W是[^0-9a-zA-Z_]。非单词字符。
\s -> 匹配一个空白字符(空格、制表符...)
\S是[^ \t\v\n\r\f]。 非空白符。
\b -> 匹配一个单词的边界
\t -> 匹配一个制表符
\n -> 匹配一个换行
. -> 匹配一个除了\n以外的任意字符
^ -> 以某一个元字符开头
$ -> 以某一个元字符结尾
\ -> 转义字符
x|y -> x或者y的一个
[xyz] -> x、y、z中的任意一个
[^xyz] -> 除了xyz中的任意一个字符
[a-z] -> 匹配a-z中的任意一个字符
[^a-z] -> 匹配除了a-z中的任意一个字符
() -> 正则中的分组
->+ : 出现一到多次
->* : 出现零到多次
->? : 出现零到一次
->{n} : 出现n次
->{n,} : 出现n到多次
->{n,m} : 出现n-m次

要匹配任意字符, 可以使用[\d\D]、[\w\W]、[\s\S]和[^]中任何的一个
\b是单词边界，具体就是\w和\W之间的位置，也包括\w和^之间的位置，也包括\w和$之间的位置。
\B就是\b的反面的意思，非单词边界。例如在字符串中所有位置中，扣掉\b，剩下的都是\B的。
具体说来就是\w与\w、\W与\W、^与\W，\W与$之间的位置。
```


### [ ]
```
//->在中括号中出现的所有字符(不管之前代表什么意思),在这里都是只代表本身的意思
//var reg = /^[2.3]$/;//->.这里只代表小数点,不是任意字符了
//reg = /^[\dz]$/;//->\d本身整体就是0-9之间的数字,在这里还是这个意思
//->在中括号中出现的两位数不是一个两位数，而是左边或者右边的
//var reg = /^[10-23]$/;//->1或者0-2或者3

在中括号中"-"具有连字符的作用,如果只想表示-,要么放在开头，要么放在结尾，要么转义
//var reg = /^[12-]$/;

//->中括号本身也有特殊的意思,如果需要只代表中括号本身的意思,需要进行转义
//var reg = /^\[\d+\]$/;//->"[200]"

```

## |
```
//var reg = /^1|2$/;//->和这个有区别:/^[12]$/
//->1、2、12

//var reg = /^10|28$/;
//->10、28、1028、102、108、128、028 ->不是我们想要的那个10或者28了
```

```
(?=p)，其中p是一个子模式，即p前面的位置。比如(?=l)，表示'l'字符前面的位置，例如：
var result = "hello".replace(/(?=l)/g, '#');
console.log(result); 
// => "he#l#lo"

而(?!p)就是(?=p)的反面意思，比如：
var result = "hello".replace(/(?!l)/g, '#');
console.log(result); 
// => "#h#ell#o#"

```

不匹配任何东西的正则: /.^/

## 分组
```
var regex = /(\d{4})-(\d{2})-(\d{2})/;
var string = "2017-06-12";
console.log( string.match(regex) ); 
// => ["2017-06-12", "2017", "06", "12", index: 0, input: "2017-06-12"]

match返回的一个数组，第一个元素是整体匹配结果，然后是各个分组（括号里）匹配的内容，然后是匹配下标，最后是输入的文本。（注意：如果正则是否有修饰符g，match返回的数组格式是不一样的）

exec
var regex = /(\d{4})-(\d{2})-(\d{2})/;
var string = "2017-06-12";
console.log( regex.exec(string) ); 
// => ["2017-06-12", "2017", "06", "12", index: 0, input: "2017-06-12"]

$1 - $9
var regex = /(\d{4})-(\d{2})-(\d{2})/;
var string = "2017-06-12";

regex.test(string); // 正则操作即可，例如
//regex.exec(string);
//string.match(regex);

console.log(RegExp.$1); // "2017"
console.log(RegExp.$2); // "06"
console.log(RegExp.$3); // "12"

替换

var regex = /(\d{4})-(\d{2})-(\d{2})/;
var string = "2017-06-12";
var result = string.replace(regex, "$2/$3/$1");
console.log(result); 
// => "06/12/2017"

等价于
var regex = /(\d{4})-(\d{2})-(\d{2})/;
var string = "2017-06-12";
var result = string.replace(regex, function() {
	return RegExp.$2 + "/" + RegExp.$3 + "/" + RegExp.$1;
});
console.log(result); 
// => "06/12/2017"

也等价于
var regex = /(\d{4})-(\d{2})-(\d{2})/;
var string = "2017-06-12";
var result = string.replace(regex, function(match, year, month, day) {
	return month + "/" + day + "/" + year;
});
console.log(result); 
// => "06/12/2017"

反向引用 ⭐️
var regex = /\d{4}(-|\/|\.)\d{2}\1\d{2}/;
var string1 = "2017-06-12";
var string2 = "2017/06/12";
var string3 = "2017.06.12";
var string4 = "2016-06/12";
console.log( regex.test(string1) ); // true
console.log( regex.test(string2) ); // true
console.log( regex.test(string3) ); // true
console.log( regex.test(string4) ); // false
注意里面的\1，表示的引用之前的那个分组(-|\/|\.)。不管它匹配到什么（比如-），\1都匹配那个同样的具体某个字符。

我们知道了\1的含义后，那么\2和\3的概念也就理解了，即分别指代第二个和第三个分组。

括号嵌套怎么办？

以左括号（开括号）为准。比如：

var regex = /^((\d)(\d(\d)))\1\2\3\4$/;
var string = "1231231233";
console.log( regex.test(string) ); // true
console.log( RegExp.$1 ); // 123
console.log( RegExp.$2 ); // 1
console.log( RegExp.$3 ); // 23
console.log( RegExp.$4 ); // 3

第一个字符是数字，比如说1，
第二个字符是数字，比如说2，
第三个字符是数字，比如说3，
接下来的是\1，是第一个分组内容，那么看第一个开括号对应的分组是什么，是123，
接下来的是\2，找到第2个开括号，对应的分组，匹配的内容是1，
接下来的是\3，找到第3个开括号，对应的分组，匹配的内容是23，
最后的是\4，找到第3个开括号，对应的分组，匹配的内容是3。


因为反向引用，是引用前面的分组，但我们在正则里引用了不存在的分组时，此时正则不会报错，只是匹配反向引用的字符本身。例如\2，就匹配"\2"。注意"\2"表示对"2"进行了转意。
var regex = /\1\2\3\4\5\6\7\8\9/;
console.log( regex.test("\1\2\3\4\5\6\7\8\9") ); 
console.log( "\1\2\3\4\5\6\7\8\9".split("") );


非捕获分组 (?:p)



匹配成对标签，那就需要使用反向引用

var regex = /<([^>]+)>[\d\D]*<\/\1>/;
var string1 = "<title>regular expression</title>";
var string2 = "<p>laoyao bye bye</p>";
var string3 = "<title>wrong!</p>";
console.log( regex.test(string1) ); // true
console.log( regex.test(string2) ); // true
console.log( regex.test(string3) ); // false


var string = "12345";
var regex = /(\d{1,3})(\d{1,3})/;
console.log( string.match(regex) );
// => ["12345", "123", "45", index: 0, input: "12345"]

惰性
var string = "12345";
var regex = /(\d{1,3}?)(\d{1,3})/;
console.log( string.match(regex) );
// => ["1234", "1", "234", index: 0, input: "12345"]


```

## 正则表达式的拆分

```
优先级由高到低
1.转义符 \
2.括号和方括号 (...)、(?:...)、(?=...)、(?!...)、[...]
3.量词限定符 {m}、{m,n}、{m,}、?、*、+
4.位置和序列 ^ 、$、 \元字符、 一般字符
5. 管道符（竖杠）|
```



## demo
```
金额添加符号,
var reg = /(?!^)(?=(\d{3})+$)/g;
var result = "12345678".replace(reg, ',')
console.log(result); 
// => "12,345,678"

trim 两种实现

第一种，匹配到开头和结尾的空白符，然后替换成空字符
function trim(str) {
	return str.replace(/^\s+|\s+$/g, '');
}
console.log( trim("  foobar   ") ); 
// => "foobar"

第二种，匹配整个字符串，然后用引用来提取出相应的数据
function trim(str) {
	return str.replace(/^\s*(.*?)\s*$/g, "$1");
}
console.log( trim("  foobar   ") ); 
// => "foobar"


将每个单词的首字母转换为大写

function titleize(str) {
	return str.toLowerCase().replace(/(?:^|\s)\w/g, function(c) {
		return c.toUpperCase();
	});
}
console.log( titleize('my name is epeli') ); 
// => "My Name Is Epeli"


驼峰化

function camelize(str) {
	return str.replace(/[-_\s]+(.)?/g, function(match, c) {
		return c ? c.toUpperCase() : '';
	});
}
console.log( camelize('-moz-transform') ); 
// => "MozTransform"

中划线化

function dasherize(str) {
	return str.replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
}
console.log( dasherize('MozTransform') ); 
// => "-moz-transform"


html 转义和反转义

// 将HTML特殊字符转换成等值的实体
function escapeHTML(str) {
	var escapeChars = {
	  '¢' : 'cent',
	  '£' : 'pound',
	  '¥' : 'yen',
	  '€': 'euro',
	  '©' :'copy',
	  '®' : 'reg',
	  '<' : 'lt',
	  '>' : 'gt',
	  '"' : 'quot',
	  '&' : 'amp',
	  '\'' : '#39'
	};
	return str.replace(new RegExp('[' + Object.keys(escapeChars).join('') +']', 'g'), function(match) {
		return '&' + escapeChars[match] + ';';
	});
}
console.log( escapeHTML('<div>Blah blah blah</div>') );
// => "&lt;div&gt;Blah blah blah&lt;/div&gt";

// 实体字符转换为等值的HTML。
function unescapeHTML(str) {
	var htmlEntities = {
	  nbsp: ' ',
	  cent: '¢',
	  pound: '£',
	  yen: '¥',
	  euro: '€',
	  copy: '©',
	  reg: '®',
	  lt: '<',
	  gt: '>',
	  quot: '"',
	  amp: '&',
	  apos: '\''
	};
	return str.replace(/\&([^;]+);/g, function(match, key) {
		if (key in htmlEntities) {
			return htmlEntities[key];
		}
		return match;
	});
}
console.log( unescapeHTML('&lt;div&gt;Blah blah blah&lt;/div&gt;') );
// => "<div>Blah blah blah</div>"

```


从上面可以看出用于正则操作的方法，共有6个，字符串实例4个，正则实例2个：

String#search

String#split

String#match

String#replace

RegExp#test

RegExp#exec


```
注意点:
search和match，会把字符串转换为正则的。
match返回结果的格式，与正则对象是否有修饰符g有关
exec正则实例lastIndex属性，表示下一次匹配开始的位置
正则实例的两个方法exec、test，当正则是全局匹配时，每一次匹配完成后，都会修改lastIndex

split相关注意事项
第一，它可以有第二个参数，表示结果数组的最大长度：
var string = "html,css,javascript";
console.log( string.split(/,/, 2) );
// =>["html", "css"]
第二，正则使用分组时，结果数组中是包含分隔符的：
var string = "html,css,javascript";
console.log( string.split(/(,)/) );
// =>["html", ",", "css", ",", "javascript"]

replace有两种使用形式，这是因为它的第二个参数，可以是字符串，也可以是函数

当第二个参数是字符串时，如下的字符有特殊的含义：

$1,$2,...,$99 匹配第1~99个分组里捕获的文本
$& 匹配到的子串文本
$` 匹配到的子串的左边文本 
$' 匹配到的子串的右边文本
$$ 美元符号

当第二个参数是函数时，我们需要注意该回调函数的参数具体是什么
"1234 2345 3456".replace(/(\d)\d{2}(\d)/g, function(match, $1, $2, index, input) {
	console.log([match, $1, $2, index, input]);
});
// => ["1234", "1", "4", 0, "1234 2345 3456"]
// => ["2345", "2", "5", 5, "1234 2345 3456"]
// => ["3456", "3", "6", 10, "1234 2345 3456"]


正则实例对象属性，除了global、ingnoreCase、multiline、lastIndex属性之外，还有一个source属性。

在构建动态的正则表达式时，可以通过查看该属性，来确认构建出的正则到底是什么
var className = "high";
var regex = new RegExp("(^|\\s)" + className + "(\\s|$)");
console.log( regex.source )
// => (^|\s)high(\s|$) 即字符串"(^|\\s)high(\\s|$)"



构造函数属性构造函数的静态属性基于所执行的最近一次正则操作而变化。除了是$1,...,$9之外，还有几个不太常用的属性（有兼容性问题）：RegExp.input 最近一次目标字符串，简写成RegExp["$_"]RegExp.lastMatch 最近一次匹配的文本，简写成RegExp["$&"]RegExp.lastParen 最近一次捕获的文本，简写成RegExp["$+"]RegExp.leftContext 目标字符串中lastMatch之前的文本，简写成RegExp["$`"]RegExp.rightContext 目标字符串中lastMatch之后的文本，简写成RegExp["$'"]

var regex = /([abc])(\d)/g;
var string = "a1b2c3d4e5";
string.match(regex);

console.log( RegExp.input );
console.log( RegExp["$_"]);
// => "a1b2c3d4e5"

console.log( RegExp.lastMatch );
console.log( RegExp["$&"] );
// => "c3"

console.log( RegExp.lastParen );
console.log( RegExp["$+"] );
// => "3"

console.log( RegExp.leftContext );
console.log( RegExp["$`"] );
// => "a1b2"

console.log( RegExp.rightContext );
console.log( RegExp["$'"] );
// => "d4e5"




```


[正则全面讲解](https://juejin.im/post/5965943ff265da6c30653879#heading-26)


