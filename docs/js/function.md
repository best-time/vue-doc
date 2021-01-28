# 函数式

```javascript

function compose(...args) {
  return function (x) {
    args.reduce((acc, func) => {
      return func(acc)
    }, x)
  }
}

// function lowerCase(input) {
//   return input && typeof input === "string" ? input.toLowerCase() : input;
// }

// function upperCase(input) {
//   return input && typeof input === "string" ? input.toUpperCase() : input;
// }

// function trim(input) {
//   return typeof input === "string" ? input.trim() : input;
// }

// function split(input, delimiter = ",") {
//   return typeof input === "string" ? input.split(delimiter) : input;
// }

// // compose函数的实现，请参考 “组合函数的实现” 部分。
// const trimLowerCaseAndSplit = compose(trim, lowerCase, split);
// trimLowerCaseAndSplit(" a,B,C "); // ["a", "b", "c"]






```



## 柯里化

```javascript
// 函数柯里化：将多个入参的函数转化为一个入参的函数;
function curry(func) {
  return function curried(...args) {
    // func.length 通过函数的length属性，来获取函数的形参个数
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  }
}
// const add = function (a, b) {
//   return a + b;
// };

// const curried = curry(add);
// const plusOne = curried(1);
// console.log(plusOne(2))
```



## 偏函数

```javascript
// 偏函数: 将多个入参的函数转化成两部分;
function partial(fn, ...rest) {
  return function (...arg2) {
    const newArgs = rest.concat(arg2);
    return fn.apply(this, newArgs);
  };
}
```

## 缓存

```javascript



function memorize(fn) {
  const cache = Object.create(null); // 存储缓存数据的对象
  return function (...args) {
    const _args = JSON.stringify(args);
    return cache[_args] || (cache[_args] = fn.apply(fn, args));
  };
};
```

