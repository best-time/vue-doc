function enhancedArray(arr) {
  return new Proxy(arr, {
    get(target, property, receiver) {
      // debugger
      console.log(property, typeof property);
      const indices = getRange(property) || getIndices(property);
      const values = indices.map((index) => {
        const key = index < 0 ? `${target.length + index}` : index;
        return Reflect.get(target, key, receiver);
      });
      return values.length === 1 ? values[0] : values;
    },
  });

  function getRange(str) {
    let [start, end] = `${str}`.split(':').map(Number);

    if (typeof end === 'undefined') return false;

    let range = [];
    for (let i = start; i < end; i++) {
      range = range.concat(i);
    }
    return range;
  }

  function getIndices(str) {
    return `${str}`.split(',').map(Number);
  }
}

const arr = enhancedArray([1, 2, 3, 4, 5]);

// console.log(arr[-1]); //=> 5
// console.log(arr[[[2, 4]]]); //=> [ 3, 5 ]

console.log(arr[[2, -2, 1]]); //=> [ 3, 4, 2 ]
// console.log(arr["2:4"]); //=> [ 3, 4]
// console.log(arr["-2:3"]); //=> [ 4, 5, 1, 2, 3 ]

// generator 简易实现
function generator(cb) {
  return (function () {
    var object = {
      next: 0,
      stop: function () {},
    };

    return {
      next: function () {
        var ret = cb(object);
        if (ret === undefined) return {value: undefined, done: true};
        return {
          value: ret,
          done: false,
        };
      },
    };
  })();
}

/*
async function fn(args) {

}
等同于
function fn(args) {
  return spawn(function * () {})
}
*/
// 自执行
function spawn(genF) {
  return new Promise((resolve, reject) => {
    const gen = genF();
    function step(nextF) {
      let next;
      try {
        next = nextF();
      } catch (error) {
        return reject(error);
      }
      if (next.done) {
        return resolve(next.value);
      }
      Promise.resolve(next.value).then(
        (v) => {
          step(function () {
            return gen.next(v);
          });
        },
        (e) => {
          step(function () {
            return gen.throw(e);
          });
        }
      );
    }
    step(function () {
      return gen.next(undefined);
    });
  });
}


// 顶层 await
// awaiting.js
let output;
export default (async function main() {
  const dynamic = await import(someMission);
  const data = await fetch(url);
  output = someProcess(dynamic.default, data);
})();
export { output };

// usage.js
import promise, { output } from "./awaiting.js";

function outputPlusValue(value) { return output + value }

promise.then(() => {
  console.log(outputPlusValue(100));
  setTimeout(() => console.log(outputPlusValue(100), 1000);
});


// --------------------- 2

// awaiting.js
const dynamic = import(someMission);
const data = fetch(url);
export const output = someProcess((await dynamic).default, await data)

// 使用
// usage.js
import { output } from "./awaiting.js";
function outputPlusValue(value) { return output + value }

console.log(outputPlusValue(100));
setTimeout(() => console.log(outputPlusValue(100), 1000);