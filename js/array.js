// 手写map
Array.prototype.myMap = function (fn, context) {
  var res = [];
  const me = this;
  const ctx = context || me;
  if (typeof fn !== 'function') {
    throw new Error(`${fn} is not a function`);
  }
  me.forEach((item, index) => {
    res[res.length] = fn.call(ctx, item, index, me);
  });
  return res;
};

let a = [1, 2, 3, 4];
a.myMap(
  function (item, index) {
    console.log(item, index, this.name);
  },
  {name: 'c'}
);

// map2
Array.prototype.map2 = function(callback, thisArg) {
  if (this == undefined) {
    throw new TypeError('this is null or not defined');
  }
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }
  const res = [];
  // 同理
  const O = Object(this);
  const len = O.length >>> 0;
  for(let i = 0; i< len; i++) {
    if(i in O) {
      res[i] = callback.call(thisArg, O[i],i, this)
    }
  }
  return res;
}


// 手写filter
// arr.filter(callback(element[, index [, array]])[, thisArg])
Array.prototype.myFilter =function(callback, thisArg) {
  if(this == undefined) {
    throw new TypeError("this is null or not undefined")
  }
  if(typeof callback !== 'function') {
    throw new TypeError(callback + " is not a function")
  }
  const res = []
   // 让O成为回调函数的对象传递（强制转换对象）
   const O = Object(this);
   // >>>0 保证len为number，且为正整数
   const len = O.length >>> 0;
  for(let i = 0; i< len; i++) {
    if (i in O) {
      if(callback.call(thisArg, O[i], i, O)) {
        res.push(O[i])
      }
    }
  }
  return res
}

let a = [1,2,3].myFilter(it => {
  return it > 1
})
console.log(a)

// forEach
Array.prototype.forEach2 = function(callback, thisArg) {
  if (this == null) {
    throw new TypeError('this is null or not defined');
  }
  if (typeof callback !== "function") {
    throw new TypeError(callback + ' is not a function');
  }
  const O = Object(this);
  const len = O.length >>> 0;
  let k = 0;
  while (k < len) {
    if (k in O) {
      callback.call(thisArg, O[k], k, O);
    }
    k++;
  }
}


// reduce
Array.prototype.reduce = function(callback, initialValue) {
  if (this == undefined) {
    throw new TypeError('this is null or not defined');
  }
  if (typeof callback !== 'function') {
    throw new TypeError(callbackfn + ' is not a function');
  }
  const O = Object(this);
  const len = this.length >>> 0;
  let accumulator = initialValue;
  let k = 0;
  // 如果第二个参数为undefined的情况下
  // 则数组的第一个有效值作为累加器的初始值
  if (accumulator === undefined) {
    while (k < len && !(k in O)) {
      k++;
    }
    // 如果超出数组界限还没有找到累加器的初始值，则TypeError
    if (k >= len) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    accumulator = O[k++];
  }
  while (k < len) {
    if (k in O) {
      accumulator = callback.call(undefined, accumulator, O[k], k, O);
    }
    k++;
  }
  return accumulator;
}


([1,2,3]).reduce(function(accu, n, index, origin) {
  return accu + n
})