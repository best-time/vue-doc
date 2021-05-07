https://segmentfault.com/a/1190000039694578



// new promise 会直接执行 函数
new Promise(function() {})
then方法的第一个参数是resolved状态的回调函数，第二个参数是rejected状态的回调函数，它们都是可选的
.then().then()
.then(() => {}, () => {})

如果异步操作抛出错误，状态就会变为rejected，就会调用catch()方法指定的回调函数，处理这个错误。
另外，then()方法指定的回调函数，如果运行中抛出错误，也会被catch()方法捕获

☆ Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个catch语句捕获。
☆
一般来说，不要在then()方法里面定义 Reject 状态的回调函数（即then的第二个参数），总是使用catch方法。

☆ Promise 内部的错误不会影响到 Promise 外部的代码，通俗的说法就是“Promise 会吃掉错误”

☆ catch()方法返回的还是一个 Promise 对象，因此后面还可以接着调用then()方法

finally 都会执行


Promise.all()方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

const p = Promise.all([p1, p2, p3]);
p的状态由p1、p2、p3决定，分成两种情况。

（1）只有p1、p2、p3的状态都变成fulfilled，p的状态才会变成fulfilled，此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数。

（2）只要p1、p2、p3之中有一个被rejected，p的状态就变成rejected，此时第一个被reject的实例的返回值，会传递给p的回调函数。

☆ 注意，如果作为参数的 Promise 实例，自己定义了catch方法，
  那么它一旦被rejected，并不会触发Promise.all()的catch方法。


Promise.race()方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。
const p = Promise.race([p1, p2, p3]);
只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给p的回调函数


Promise.allSettled()
只有等到所有这些参数实例都返回结果，不管是fulfilled还是rejected，包装实例才会结束

Promise.any()
只要参数实例有一个变成fulfilled状态，包装实例就会变成fulfilled状态；如果所有参数实例都变成rejected状态，
包装实例就会变成rejected状态。

Promise.resolve()
有时需要将现有对象转为 Promise 对象，Promise.resolve()方法就起到这个作用。

const jsPromise = Promise.resolve($.ajax('/whatever.json'));

Promise.reject(reason)
方法也会返回一个新的 Promise 实例，该实例的状态为rejected。


```
const promise = new Promise(function(resolve, reject) {
  throw new Error('test');
  // try catch
  // reject(new Error('test))
});
promise.catch(function(error) {
  console.log(error);
});
// Error: test

等同于下面两种写法
1.
const promise = new Promise(function(resolve, reject) {
  try {
    throw new Error('test');
  } catch(e) {
    reject(e);
  }
});
promise.catch(function(error) {
  console.log(error);
});

2.
const promise = new Promise(function(resolve, reject) {
  reject(new Error('test'));
});
promise.catch(function(error) {
  console.log(error);
});

```


```

Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => {
      return P
            .resolve(callback())
            .then(() => {
              return value
            })
    },
    reason => {
      return P
            .resolve(callback())
            .then(() => {
              throw reason
            })
    }
  );
};

promise
.finally(() => {
  // 语句
});

// 等同于
promise
.then(
  result => {
    // 语句
    return result;
  },
  error => {
    // 语句
    throw error;
  }
);
```



```
p
.then((val) => {
  console.log('fulfilled:', val)
})
.catch((err) => {
  console.log('rejected', err)
});

// 等同于
p
.then((val) => {
  console.log('fulfilled:', val)
})
.then(
  null,
  (err) => {
    console.log("rejected:", err)
  });
```

```
// 异步加载图片
function loadImageAsync(url) {
  return new Promise(function(resolve, reject) {
    const image = new Image();

    image.onload = function() {
      resolve(image);
    };

    image.onerror = function() {
      reject(new Error('Could not load image at ' + url));
    };

    image.src = url;
  });
}

```

```
// promise 实现ajax

const getJSON = function(url) {
  const promise = new Promise(function(resolve, reject){
    const handler = function() {
      if (this.readyState !== 4) {
        return;
      }
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
    const client = new XMLHttpRequest();
    client.open("GET", url);
    client.onreadystatechange = handler;
    client.responseType = "json";
    client.setRequestHeader("Accept", "application/json");
    client.send();

  });

  return promise;
};

getJSON("/posts.json").then(function(json) {
  console.log('Contents: ' + json);
}, function(error) {
  console.error('出错了', error);
});
```