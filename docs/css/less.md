# less

## imports
```
The following import directives have been implemented:

reference: use a Less file but do not output it
inline: include the source file in the output but do not process it
less: treat the file as a Less file, no matter what the file extension
css: treat the file as a CSS file, no matter what the file extension
once: only include the file once (this is default behavior)
multiple: include the file multiple times
optional: continue compiling when file is not found


Example: @import (optional, reference) "foo.less";
```

## 变量
```
Variables are lazy loaded and do not have to be declared before being used.


@nice-blue: #5B83AD;
@light-blue: @nice-blue + #111;

#header {
  color: @light-blue;
}


@fnord:  "I am fnord.";
@var:    "fnord";
content: @@var;

=>

content: "I am fnord.";

```


## mixins

```
.bordered {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}

.post a {
  color: red;
  .bordered;
}
```

## nested rules

```
.a {
	&-b {

	}
}
```

## functions
```
@base: #f04615;
@width: 0.5;

.class {  // 会直接渲染
  width: percentage(@width); // returns `50%`
  color: saturate(@base, 5%);
  background-color: spin(lighten(@base, 25%), 8);
}

.class() { // 不会直接渲染出来

}
```

## scope

```
@var: red;

#page {
  @var: white;
  #header {
    color: @var; // white
  }
}

@var: red;

#page {
  #header {
    color: @var; // white
  }
  @var: white;
}
```

## 导入

```
@import "library"; // library.less
@import "typo.css";
```

## 变量作为属性

```
// Variables
@my-selector: banner;

// Usage
.@{my-selector} {
  font-weight: bold;
  line-height: 40px;
  margin: 0 auto;
}

=>

.banner {
  font-weight: bold;
  line-height: 40px;
  margin: 0 auto;
}


urls

// Variables
@images: "../img";

// Usage
body {
  color: #444;
  background: url("@{images}/white-sand.png");
}


@property: color;

.widget {
  @{property}: #0ee;
  background-@{property}: #999;
}

=>

.widget {
  color: #0ee;
  background-color: #999;
}
```

## extend
```
nav ul {
  &:extend(.inline);
  background: blue;
}
.inline {
  color: red;
}

=>

nav ul {
  background: blue;
}
.inline,
nav ul {
  color: red;
}

```

## Extend Syntax
```

.a:extend(.b) {}

// the above block does the same thing as the below block
.a {
  &:extend(.b);
}


.c:extend(.d all) {
  // extends all instances of ".d" e.g. ".x.d" or ".d.x"
}
.c:extend(.d) {
  // extends only instances where the selector will be output as just ".d"
}

.e:extend(.f) {}
.e:extend(.g) {}

// the above an the below do the same thing
.e:extend(.f, .g) {}

.big-division,
.big-bag:extend(.bag),
.big-bucket:extend(.bucket) {
  // body
}

pre:hover,
.some-class {
  &:extend(div pre);
}

=>

pre:hover:extend(div pre),
.some-class:extend(div pre) {}


.bucket {
  tr { // nested ruleset with target selector
    color: blue;
  }
}
.some-class:extend(.bucket tr) {} // nested ruleset is recognized

=>

.bucket tr,
.some-class {
  color: blue;
}


.bucket {
  tr & { // nested ruleset with target selector
    color: blue;
  }
}
.some-class:extend(tr .bucket) {} // nested ruleset is recognized

=>

tr .bucket,
.some-class {
  color: blue;
}

1n + 3 n+3
[title=identifier] [title='identifier'] [title="identifier"]
都认为是不同的selector



extend "all"  ---------------------------------------------

.a.b.test,
.test.c {
  color: orange;
}
.test {
  &:hover {
    color: green;
  }
}

.replacement:extend(.test all) {}

=>

.a.b.test,
.test.c,
.a.b.replacement,
.replacement.c {
  color: orange;
}
.test:hover,
.replacement:hover {
  color: green;
}


```

## use cases for Extend
```
.animal {
  background-color: black;
  color: white;
}
and you want to have a subtype of animal which overrides the background
color then you have two options, firstly change your HTML

<a class="animal bear">Bear</a>
.animal {
  background-color: black;
  color: white;
}
.bear {
  background-color: brown;
}


or have simplified html and use extend in your less. e.g.

<a class="bear">Bear</a>
.animal {
  background-color: black;
  color: white;
}
.bear {
  &:extend(.animal);
  background-color: brown;
}

```

## Reducing CSS Size

Example - with mixin:

```

.my-inline-block() {
    display: inline-block;
  font-size: 0;
}
.thing1 {
  .my-inline-block;
}
.thing2 {
  .my-inline-block;
}
```

Outputs

```

.thing1 {
  display: inline-block;
  font-size: 0;
}
.thing2 {
  display: inline-block;
  font-size: 0;
}
```
Example (with extends):

```

.my-inline-block {
  display: inline-block;
  font-size: 0;
}
.thing1 {
  &:extend(.my-inline-block);
}
.thing2 {
  &:extend(.my-inline-block);
}
```
Outputs

```

.my-inline-block,
.thing1,
.thing2 {
  display: inline-block;
  font-size: 0;
}
```

```
li.list > a {
  // list styles
}
button.list-style {
  &:extend(li.list > a); // use the same list styles
}
```

## namspace
```
#outer {
  .inner {
    color: red;
  }
}

.c {
  #outer > .inner;
}



#my-library {
  .my-mixin() {
    color: black;
  }
}
// which can be used like this
.class {
  #my-library > .my-mixin();
}

@mode: huge
@mode: huge1
#namespace when (@mode=huge) {
  .mixin() { /* */ }
}

#namespace when (@mode=huge1) {
  .mixin() { /* */ }
}

#namespace {
  .mixin() when (@mode=huge) { /* */ }
}

```


## !important
```
.foo (@bg: #f5f5f5, @color: #900) {
  background: @bg;
  color: @color;
}
.unimportant {
  .foo();
}
.important {
  .foo() !important;
}

=>

.unimportant {
  background: #f5f5f5;
  color: #900;
}
.important {
  background: #f5f5f5 !important;
  color: #900 !important;
}
```

## arguments
```

.box-shadow(@x: 0; @y: 0; @blur: 1px; @color: #000) {
  -webkit-box-shadow: @arguments;
     -moz-box-shadow: @arguments;
          box-shadow: @arguments;
}
.big-block {
  .box-shadow(2px; 5px);
}

=>

.big-block {
  -webkit-box-shadow: 2px 5px 1px #000;
     -moz-box-shadow: 2px 5px 1px #000;
          box-shadow: 2px 5px 1px #000;
}

```

## LOOPS

```
.generate-columns(4);

.generate-columns(@n, @i: 1) when (@i =< @n) {
  .column-@{i} {
    width: (@i * 100% / @n);
  }
  .generate-columns(@n, (@i + 1));
}

=>

.column-1 {
  width: 25%;
}
.column-2 {
  width: 50%;
}
.column-3 {
  width: 75%;
}
.column-4 {
  width: 100%;
}

```

## Merge
```
merge is useful for properties such as background and transform.

.mixin() {
  box-shadow+: inset 0 0 10px #555;
}
.myclass {
  .mixin();
  box-shadow+: 0 0 20px black;
}

=>

.myclass {
  box-shadow: inset 0 0 10px #555, 0 0 20px black;
}


.mixin() {
  transform+_: scale(2);
}
.myclass {
  .mixin();
  transform+_: rotate(15deg);
}

=>

.myclass {
  transform: scale(2) rotate(15deg);
}

```

[less文档](https://www.w3cschool.cn/less/nested_directives_bubbling.html)
[less文档2](https://www.yiibai.com/less/less_installation.html)