const fs = require('fs');

const readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function (error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
};

// generator 使用
let gen = function* () {
  const f1 = yield readFile('/etc/fstab');
  const f2 = yield readFile('/etc/fstab');
  console.log(f1.toString(), f2.toString());
};

// async 使用
let asyncRead = async function () {
  const f1 = await readFile('/etc/fstab');
  const f2 = await readFile('/etc/fstab');
  console.log(f1.toString(), f2.toString());
};

function co(it) {
  return new Promise((resolve, reject) => {
    // 异步迭代 next
    function next(data) {
      let {value, done} = it.next(data);
      if (!done) {
        Promise.resolve(value).then((data) => {
          next(data);
        }, reject);
      } else {
        resolve(value);
      }
    }
    next();
  });
}
/*
async函数对 Generator 函数的改进:
1. 内置执行器
generator 需要 next()或co模块, 才能真正执行
2. 更好的语义
3. 更广的适用性
yield 后面只能是Thunk函数和Promise对象
await 可以是Promise对象和原始类型的值(自动转成resolved的Promise对象)
4. 返回的是Promise
generator返回的是Iterator
*/

//------------- 指定特定秒后输出一个值
function timeout(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function asyncPrint(value, ms) {
  await timeout(ms);
  console.log(value);
}

asyncPrint('hello world', 50);

//------------- async 错误处理机制

// return返回的值会成为then回调函数的参数
async function f() {
  return 'hello world';
}

f().then(v => console.log(v))
// "hello world"

// async函数内部抛出错误，会导致返回的 Promise 对象变为reject状态。
// 抛出的错误对象会被catch方法回调函数接收到。

async function f1() {
  throw new Error('出错了');
}

f1().then(
  v => console.log('resolve', v),
  e => console.log('reject', e)
)



//------------- Promise 对象的状态变化

// async函数返回的 Promise 对象，必须等到内部所有await命令后面的 Promise 对象执行完，
// 才会发生状态改变，除非遇到return语句或者抛出错误。
// 也就是说，只有async函数内部的异步操作执行完，才会执行then方法指定的回调函数

// 正常情况下，await命令后面是一个 Promise 对象，返回该对象的结果。
// 如果不是 Promise 对象，就直接返回对应的值。

async function f3() {
  // 等同于
  // return 123;
  return await 123;
}

f3().then(v => console.log(v))
// 123

// 另一种情况是，await命令后面是一个thenable对象（即定义了then方法的对象），
// 那么await会将其等同于 Promise 对象

class Sleep {
  constructor(timeout) {
    this.timeout = timeout;
  }
  then(resolve, reject) {
    const startTime = Date.now();
    setTimeout(
      () => resolve(Date.now() - startTime),
      this.timeout
    );
  }
}

(async () => {
  const sleepTime = await new Sleep(1000);
  console.log(sleepTime);
})();
// 1000


// 休眠实现
function sleep2(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  })
}

// 用法
async function one2FiveInAsync() {
  for(let i = 1; i <= 3; i++) {
    console.log(i);
    await sleep2(2000);
  }
}

one2FiveInAsync();



// await命令后面的 Promise 对象如果变为reject状态，
// 则reject的参数会被catch方法的回调函数接收到
async function f4() {
  await Promise.reject('出错了');
}

f4()
.then(v => console.log(v))
.catch(e => console.log(e)); // 出错了




// 任何一个await语句后面的 Promise 对象变为reject状态，那么整个async函数都会中断执行。

async function f5() {
  await Promise.reject('出错了');
  await Promise.resolve('hello world'); // 不会执行
}

// 有时，我们希望即使前一个异步操作失败，也不要中断后面的异步操作。
// 这时可以将第一个await放在try...catch结构里面，这样不管这个异步操作是否成功，
// 第二个await都会执行。

async function f6() {
  try {
    await Promise.reject('出错了');
  } catch(e) {
  }
  return await Promise.resolve('hello world');
}

f6()
.then(v => console.log(v)); // hello world


// 另一种方法是await后面的 Promise 对象再跟一个catch方法，处理前面可能出现的错误
async function f7() {
  await Promise.reject('出错了').catch(e => console.log(e));
  return await Promise.resolve('hello world');
}

f7()
.then(v => console.log(v))
// 出错了
// hello world


//------------- Promise 错误处理

// 如果await后面的异步操作出错，那么等同于async函数返回的 Promise 对象被reject。

async function f8() {
  await new Promise(function (resolve, reject) {
    throw new Error('出错了');
  });
}

f8()
.then(v => console.log(v))
.catch(e => console.log(e))
// Error：出错了



async function f9() {
  try {
    await new Promise(function (resolve, reject) {
      throw new Error('出错了');
    });
  } catch(e) {
    console.log(e);
  }
  return await('hello world');
}

f9()
.then(v => console.log(v))
.catch(e => console.log(e))


function dbFuc(db) { //这里不需要 async
  let docs = [{}, {}, {}];

  // 可能得到错误结果
  docs.forEach(async function (doc) {
    await db.post(doc);
  });
}
// 上面代码可能不会正常工作，原因是这时三个db.post()操作将是并发执行，
// 也就是同时执行，而不是继发执行

// 正确的写法
async function dbFuc(db) {
  let docs = [{}, {}, {}];

  for (let doc of docs) {
    await db.post(doc);
  }
}
// 或

async function dbFuc(db) {
  let docs = [{}, {}, {}];

  await docs.reduce(async (_, doc) => {
    await _;
    await db.post(doc);
  }, undefined);
}


// async 函数可以保留运行堆栈。

const a = () => {
  b().then(() => c());
};
// 上面代码中，函数a内部运行了一个异步任务b()。
// 当b()运行的时候，函数a()不会中断，而是继续执行。
// 等到b()运行结束，可能a()早就运行结束了，b()所在的上下文环境已经消失了。
// 如果b()或c()报错，错误堆栈将不包括a()。




/*
const promises = [
  Promise.reject('ERROR A'),
  Promise.reject('ERROR B'),
  Promise.reject('ERROR C'),
]

Promise.any(promises).then((value) => {
  console.log('value：', value)
}).catch((err) => {
  console.log('err：', err)
  console.log(err.message)
  console.log(err.name)
  console.log(err.errors)
})

 err：AggregateError: All promises were rejected
 All promises were rejected
 AggregateError
 ["ERROR A", "ERROR B", "ERROR C"]
*/

// 手写 Promise.any
let MyPromise = {}
MyPromise.any = function(promises){
  return new Promise((resolve,reject)=>{
    promises = Array.isArray(promises) ? promises : []
    let len = promises.length
    // 用于收集所有 reject
    let errs = []
    // 如果传入的是一个空数组，那么就直接返回 AggregateError
    if(len === 0) return reject(new AggregateError('All promises were rejected'))
    promises.forEach((promise)=>{
      promise.then(value=>{
        resolve(value)
      },err=>{
        len--
        errs.push(err)
        if(len === 0){
          reject(new AggregateError(errs))
        }
      })
    })
  })
}