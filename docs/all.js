// 事件绑定

const EventUtils = {
  // 视能力分别使用dom0||dom2||IE方式 来绑定事件
  // 添加事件
  addEvent: function (element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, handler);
    } else {
      element['on' + type] = handler;
    }
  },

  // 移除事件
  removeEvent: function (element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) {
      element.detachEvent('on' + type, handler);
    } else {
      element['on' + type] = null;
    }
  },

  // 获取事件目标
  getTarget: function (event) {
    return event.target || event.srcElement;
  },

  // 获取 event 对象的引用，取到事件的所有信息，确保随时能使用 event
  getEvent: function (event) {
    return event || window.event;
  },

  // 阻止事件（主要是事件冒泡，因为 IE 不支持事件捕获）
  stopPropagation: function (event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
  },

  // 取消事件的默认行为
  preventDefault: function (event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  },
};

// map 实现
function map(arr, mapCallback) {
  // 首先，检查传递的参数是否正确。
  if (!Array.isArray(arr) || !arr.length || typeof mapCallback !== 'function') {
    return [];
  } else {
    let result = [];
    // 每次调用此函数时，我们都会创建一个 result 数组
    // 因为我们不想改变原始数组。
    for (let i = 0, len = arr.length; i < len; i++) {
      result.push(mapCallback(arr[i], i, arr));
      // 将 mapCallback 返回的结果 push 到 result 数组中
    }
    return result;
  }
}

// filter 实现

function filter(arr, filterCallback) {
  // 首先，检查传递的参数是否正确。
  if (
    !Array.isArray(arr) ||
    !arr.length ||
    typeof filterCallback !== 'function'
  ) {
    return [];
  } else {
    let result = [];
    // 每次调用此函数时，我们都会创建一个 result 数组
    // 因为我们不想改变原始数组。
    for (let i = 0, len = arr.length; i < len; i++) {
      // 检查 filterCallback 的返回值是否是真值
      if (filterCallback(arr[i], i, arr)) {
        // 如果条件为真，则将数组元素 push 到 result 中
        result.push(arr[i]);
      }
    }
    return result; // return the result array
  }
}

// reduce 实现

function reduce(arr, reduceCallback, initialValue) {
  // 首先，检查传递的参数是否正确。
  if (
    !Array.isArray(arr) ||
    !arr.length ||
    typeof reduceCallback !== 'function'
  ) {
    return [];
  } else {
    // 如果没有将initialValue传递给该函数，我们将使用第一个数组项作为initialValue
    let hasInitialValue = initialValue !== undefined;
    let value = hasInitialValue ? initialValue : arr[0];

    // 如果有传递 initialValue，则索引从 1 开始，否则从 0 开始
    for (let i = hasInitialValue ? 1 : 0, len = arr.length; i < len; i++) {
      value = reduceCallback(value, arr[i], i, arr);
    }
    return value;
  }
}

//深拷贝
// JSON.parse(JSON.stringify(object))，缺点诸多（会忽略undefined、symbol、函数；不能解决循环引用；不能处理正则、new Date()）
// 普通 object 和 array 类型
function cloneDeep(target, map = new WeakMap()) {
  if (typeof target === 'object') {
    let cloneTarget = Array.isArray(target) ? [] : {};

    if (map.get(target)) {
      return target;
    }
    map.set(target, cloneTarget);
    for (const key in target) {
      cloneTarget[key] = cloneDeep(target[key], map);
    }
    return cloneTarget;
  } else {
    return target;
  }
}

// 终极版 深拷贝
(function () {
  const mapTag = '[object Map]';
  const setTag = '[object Set]';
  const arrayTag = '[object Array]';
  const objectTag = '[object Object]';
  const argsTag = '[object Arguments]';

  const boolTag = '[object Boolean]';
  const dateTag = '[object Date]';
  const numberTag = '[object Number]';
  const stringTag = '[object String]';
  const symbolTag = '[object Symbol]';
  const errorTag = '[object Error]';
  const regexpTag = '[object RegExp]';
  const funcTag = '[object Function]';

  const deepTag = [mapTag, setTag, arrayTag, objectTag, argsTag];

  function forEach(array, iteratee) {
    let index = -1;
    const length = array.length;
    while (++index < length) {
      iteratee(array[index], index);
    }
    return array;
  }

  function isObject(target) {
    const type = typeof target;
    return target !== null && (type === 'object' || type === 'function');
  }

  function getType(target) {
    return Object.prototype.toString.call(target);
  }

  function getInit(target) {
    const Ctor = target.constructor;
    return new Ctor();
  }

  function cloneSymbol(targe) {
    return Object(Symbol.prototype.valueOf.call(targe));
  }

  function cloneReg(targe) {
    const reFlags = /\w*$/;
    const result = new targe.constructor(targe.source, reFlags.exec(targe));
    result.lastIndex = targe.lastIndex;
    return result;
  }

  function cloneFunction(func) {
    const bodyReg = /(?<={)(.|\n)+(?=})/m;
    const paramReg = /(?<=\().+(?=\)\s+{)/;
    const funcString = func.toString();
    if (func.prototype) {
      const param = paramReg.exec(funcString);
      const body = bodyReg.exec(funcString);
      if (body) {
        if (param) {
          const paramArr = param[0].split(',');
          return new Function(...paramArr, body[0]);
        } else {
          return new Function(body[0]);
        }
      } else {
        return null;
      }
    } else {
      return eval(funcString);
    }
  }

  function cloneOtherType(targe, type) {
    const Ctor = targe.constructor;
    switch (type) {
      case boolTag:
      case numberTag:
      case stringTag:
      case errorTag:
      case dateTag:
        return new Ctor(targe);
      case regexpTag:
        return cloneReg(targe);
      case symbolTag:
        return cloneSymbol(targe);
      case funcTag:
        return cloneFunction(targe);
      default:
        return null;
    }
  }

  function clone(target, map = new WeakMap()) {
    // 克隆原始类型
    if (!isObject(target)) {
      return target;
    }

    // 初始化
    const type = getType(target);
    let cloneTarget;
    if (deepTag.includes(type)) {
      cloneTarget = getInit(target, type);
    } else {
      return cloneOtherType(target, type);
    }

    // 防止循环引用
    if (map.get(target)) {
      return map.get(target);
    }
    map.set(target, cloneTarget);

    // 克隆set
    if (type === setTag) {
      target.forEach((value) => {
        cloneTarget.add(clone(value, map));
      });
      return cloneTarget;
    }

    // 克隆map
    if (type === mapTag) {
      target.forEach((value, key) => {
        cloneTarget.set(key, clone(value, map));
      });
      return cloneTarget;
    }

    // 克隆对象和数组
    const keys = type === arrayTag ? undefined : Object.keys(target);
    forEach(keys || target, (value, key) => {
      if (keys) {
        key = value;
      }
      cloneTarget[key] = clone(target[key], map);
    });

    return cloneTarget;
  }
})();

/*
call 函数的实现步骤：

1.判断调用对象是否为函数，即使我们是定义在函数的原型上的，但是可能出现使用 call 等方式调用的情况。
2.判断传入上下文对象是否存在，如果不存在，则设置为 window 。
3.处理传入的参数，截取第一个参数后的所有参数。
4.将函数作为上下文对象的一个属性。
5.使用上下文对象来调用这个方法，并保存返回结果。
6.删除刚才新增的属性。
7.返回结果。

*/

// call函数实现
Function.prototype.myCall = function (context) {
  // 判断调用对象
  if (typeof this !== 'function') {
    console.error('type error');
  }

  // 获取参数
  let args = [...arguments].slice(1),
    result = null;

  // 判断 context 是否传入，如果未传入则设置为 window
  context = context || window;

  // 将调用函数设为对象的方法
  context.fn = this;

  // 调用函数
  result = context.fn(...args);

  // 将属性删除
  delete context.fn;

  return result;
};

/*
apply 函数的实现步骤：

判断调用对象是否为函数，即使我们是定义在函数的原型上的，但是可能出现使用 call 等方式调用的情况。

判断传入上下文对象是否存在，如果不存在，则设置为 window 。

将函数作为上下文对象的一个属性。

判断参数值是否传入

使用上下文对象来调用这个方法，并保存返回结果。

删除刚才新增的属性

返回结果

*/

Function.prototype.myApply = function (context) {
  // 判断调用对象是否为函数
  if (typeof this !== 'function') {
    throw new TypeError('Error');
  }

  let result = null;

  // 判断 context 是否存在，如果未传入则为 window
  context = context || window;

  // 将函数设为对象的方法
  context.fn = this;

  // 调用方法
  if (arguments[1]) {
    result = context.fn(...arguments[1]);
  } else {
    result = context.fn();
  }

  // 将属性删除
  delete context.fn;

  return result;
};

/*
bind 函数的实现步骤：

1.判断调用对象是否为函数，即使我们是定义在函数的原型上的，但是可能出现使用 call 等方式调用的情况。
2.保存当前函数的引用，获取其余传入参数值。
3.创建一个函数返回
4.函数内部使用 apply 来绑定函数调用，需要判断函数作为构造函数的情况，这个时候需要传入当前函数的 this 给 apply 调用，其余情况都传入指定的上下文对象。

*/
Function.prototype.myBind = function (context) {
  // 判断调用对象是否为函数
  if (typeof this !== 'function') {
    throw new TypeError('Error');
  }

  // 获取参数
  var args = [...arguments].slice(1),
    fn = this;

  return function Fn() {
    // 根据调用方式，传入不同绑定值
    return fn.apply(
      this instanceof Fn ? this : context,
      args.concat(...arguments)
    );
  };
};

// 柯里化 实现
// 函数柯里化指的是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。

function curry(fn, args) {
  // 获取函数需要的参数长度
  let length = fn.length;

  args = args || [];

  return function () {
    let subArgs = args.slice(0);

    // 拼接得到现有的所有参数
    for (let i = 0; i < arguments.length; i++) {
      subArgs.push(arguments[i]);
    }

    // 判断参数的长度是否已经满足函数所需参数的长度
    if (subArgs.length >= length) {
      // 如果满足，执行函数
      return fn.apply(this, subArgs);
    } else {
      // 如果不满足，递归返回科里化的函数，等待参数的传入
      return curry.call(this, fn, subArgs);
    }
  };
}

// es6 实现
function curry(fn, ...args) {
  return fn.length <= args.length ? fn(...args) : curry.bind(null, fn, ...args);
}

/*
new 实现
创建一个空的简单JavaScript对象（即{}）；
链接该对象（即设置该对象的构造函数）到另一个对象 ；
将步骤1新创建的对象作为this的上下文 ；
如果该函数没有返回对象，则返回this。
*/

function objectFactory() {
  var obj = {};
  //取得该方法的第一个参数(并删除第一个参数)，该参数是构造函数
  var Constructor = [].shift.apply(arguments);
  //将新对象的内部属性__proto__指向构造函数的原型，这样新对象就可以访问原型中的属性和方法
  obj.__proto__ = Constructor.prototype;
  //取得构造函数的返回值
  var ret = Constructor.apply(obj, arguments);
  //如果返回值是一个对象就返回该对象，否则返回构造函数的一个实例对象
  return typeof ret === 'object' ? ret : obj;
}

// promise 手写  面试

(function () {
  function myPromise(constructor) {
    let self = this;
    self.status = 'pending'; //定义状态改变前的初始状态
    self.value = undefined; //定义状态为resolved的时候的状态
    self.reason = undefined; //定义状态为rejected的时候的状态
    function resolve(value) {
      //两个==="pending"，保证了状态的改变是不可逆的
      if (self.status === 'pending') {
        self.value = value;
        self.status = 'resolved';
      }
    }
    function reject(reason) {
      //两个==="pending"，保证了状态的改变是不可逆的
      if (self.status === 'pending') {
        self.reason = reason;
        self.status = 'rejected';
      }
    }
    //捕获构造异常
    try {
      constructor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  // 定义链式调用的then方法
  myPromise.prototype.then = function (onFullfilled, onRejected) {
    let self = this;
    switch (self.status) {
      case 'resolved':
        onFullfilled(self.value);
        break;
      case 'rejected':
        onRejected(self.reason);
        break;
      default:
    }
  };
})()(
  // ajax

  function () {
    function getJSON(url) {
      // 创建一个 promise 对象
      let promise = new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();

        // 新建一个 http 请求
        xhr.open('GET', url, true);

        // 设置状态的监听函数
        xhr.onreadystatechange = function () {
          if (this.readyState !== 4) return;

          // 当请求成功或失败时，改变 promise 的状态
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error(this.statusText));
          }
        };

        // 设置错误监听函数
        xhr.onerror = function () {
          reject(new Error(this.statusText));
        };

        // 设置响应的数据类型
        xhr.responseType = 'json';

        // 设置请求头信息
        xhr.setRequestHeader('Accept', 'application/json');

        // 发送 http 请求
        xhr.send(null);
      });

      return promise;
    }
  }
)();

/*
实现 instanceof：

首先获取类型的原型
然后获得对象的原型
然后一直循环判断对象的原型是否等于类型的原型，直到对象原型为 null，因为原型链最终为 null
*/

function myInstanceof(left, right) {
  let prototype = right.prototype;
  left = left.__proto__;
  while (true) {
    if (left === null || left === undefined) return false;
    if (prototype === left) return true;
    left = left.__proto__;
  }
}

/*
节流
防抖
*/

(function () {
  // 函数防抖的实现
  function debounce(fn, wait) {
    var timer = null;

    return function () {
      var context = this,
        args = arguments;

      // 如果此时存在定时器的话，则取消之前的定时器重新记时
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      // 设置定时器，使事件间隔指定事件后执行
      timer = setTimeout(() => {
        fn.apply(context, args);
      }, wait);
    };
  }

  // 函数节流的实现;
  function throttle(fn, delay) {
    var preTime = Date.now();

    return function () {
      var context = this,
        args = arguments,
        nowTime = Date.now();

      // 如果两次时间间隔超过了指定时间，则执行函数。
      if (nowTime - preTime >= delay) {
        preTime = Date.now();
        return fn.apply(context, args);
      }
    };
  }
})()(
  // -------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------
  // https://juejin.cn/post/6844904032826294286#heading-38
  // -------------------------------------------------------------------------------------------

  function () {
    // ========================================  单一职责 开放封闭原则 =================================================
    let checkType = (function () {
      let rules = {
        email(str) {
          return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
        },
        mobile(str) {
          return /^1[3|4|5|7|8][0-9]{9}$/.test(str);
        },
      };
      //暴露接口
      return {
        //校验
        check(str, type) {
          return rules[type] ? rules[type](str) : false;
        },
        //添加规则
        addRule(type, fn) {
          rules[type] = fn;
        },
      };
    })();

    //调用方式
    //使用mobile校验规则
    console.log(checkType.check('188170239', 'mobile'));
    //添加金额校验规则
    checkType.addRule('money', function (str) {
      return /^[0-9]+(.[0-9]{2})?$/.test(str);
    });
    //使用金额校验规则
    console.log(checkType.check('18.36', 'money'));



    // ======================================== 工厂模式 =================================================
    class Product {
      constructor(name) {
        this.name = name;
      }
      init() {
        console.log('init');
      }
      fun() {
        console.log('fun');
      }
    }

    class Factory {
      create(name) {
        return new Product(name);
      }
    }

    // use
    let factory = new Factory();
    let p = factory.create('p1');
    p.init();
    p.fun();

    /*
  适用场景

  如果你不想让某个子系统与较大的那个对象之间形成强耦合，而是想运行时从许多子系统中进行挑选的话，那么工厂模式是一个理想的选择
  将new操作简单封装，遇到new的时候就应该考虑是否用工厂模式；
  需要依赖具体环境创建不同实例，这些实例都有相同的行为,这时候我们可以使用工厂模式，
  简化实现的过程，同时也可以减少每种对象所需的代码量，有利于消除对象间的耦合，提供更大的灵活性


  优点

  创建对象的过程可能很复杂，但我们只需要关心创建结果。
  构造函数和创建者分离, 符合“开闭原则”
  一个调用者想创建一个对象，只要知道其名称就可以了。
  扩展性高，如果想增加一个产品，只要扩展一个工厂类就可以。

  缺点

  添加新产品时，需要编写新的具体产品类,一定程度上增加了系统的复杂度
  考虑到系统的可扩展性，需要引入抽象层，在客户端代码中均使用抽象层进行定义，增加了系统的抽象性和理解难度

*/

    // ======================================== 单例模式 =================================================

    class LoginForm {
      constructor() {
        this.state = 'hide';
      }
      show() {
        if (this.state === 'show') {
          alert('已经显示');
          return;
        }
        this.state = 'show';
        console.log('登录框显示成功');
      }
      hide() {
        if (this.state === 'hide') {
          alert('已经隐藏');
          return;
        }
        this.state = 'hide';
        console.log('登录框隐藏成功');
      }
    }
    LoginForm.getInstance = (function () {
      let instance;
      return function () {
        if (!instance) {
          instance = new LoginForm();
        }
        return instance;
      };
    })();

    let obj1 = LoginForm.getInstance();
    obj1.show();

    let obj2 = LoginForm.getInstance();
    obj2.hide();

    console.log(obj1 === obj2);

    /*
  优点

  划分命名空间，减少全局变量
  增强模块性，把自己的代码组织在一个全局变量名下，放在单一位置，便于维护
  且只会实例化一次。简化了代码的调试和维护

  缺点

  由于单例模式提供的是一种单点访问，所以它有可能导致模块间的强耦合 从而不利于单元测试。
  无法单独测试一个调用了来自单例的方法的类，而只能把它与那个单例作为一个单元一起测试。

  场景例子

  定义命名空间和实现分支型方法
  登录框
  vuex 和 redux中的store

  */

    // ========================================  适配器模式 =================================================
    class Plug {
      getName() {
        return 'iphone充电头';
      }
    }

    class Target {
      constructor() {
        this.plug = new Plug();
      }
      getName() {
        return this.plug.getName() + ' 适配器Type-c充电头';
      }
    }

    let target = new Target();
    target.getName(); // iphone充电头 适配器转Type-c充电头
    /*
  优点

  可以让任何两个没有关联的类一起运行。
  提高了类的复用。
  适配对象，适配库，适配数据

  缺点

  额外对象的创建，非直接调用，存在一定的开销（且不像代理模式在某些功能点上可实现性能优化)
  如果没必要使用适配器模式的话，可以考虑重构，如果使用的话，尽量把文档完善

  */

    //   使用场景

    // 整合第三方SDK
    // 封装旧接口

    // 自己封装的ajax， 使用方式如下
    ajax({
      url: '/getData',
      type: 'Post',
      dataType: 'json',
      data: {
        test: 111,
      },
    }).done(function () {});
    // 因为历史原因，代码中全都是：
    // $.ajax({....})

    // 做一层适配器
    var $ = {
      ajax: function (options) {
        return ajax(options);
      },
    };

    {
      /* <template>
    <div id="example">
        <p>Original message: "{{ message }}"</p>  <!-- Hello -->
        <p>Computed reversed message: "{{ reversedMessage }}"</p>  <!-- olleH -->
    </div>
</template>
<script type='text/javascript'>
    export default {
        name: 'demo',
        data() {
            return {
                message: 'Hello'
            }
        },
        computed: {
            reversedMessage: function() {
                return this.message.split('').reverse().join('')
            }
        }
    }
</script> */
    }



    // ========================================  装饰者模式 =================================================
    // 动态地给某个对象添加一些额外的职责，，是一种实现继承的替代方案
    // 在不改变原对象的基础上，通过对其进行包装扩展，使原有对象可以满足用户的更复杂需求，而不会影响从这个类中派生的其他对象

    class Cellphone {
      create() {
        console.log('生成一个手机');
      }
    }
    class Decorator {
      constructor(cellphone) {
        this.cellphone = cellphone;
      }
      create() {
        this.cellphone.create();
        this.createShell(cellphone);
      }
      createShell() {
        console.log('生成手机壳');
      }
    }
    // 测试代码
    let cellphone = new Cellphone();
    cellphone.create();

    console.log('------------');
    let dec = new Decorator(cellphone);
    dec.create();

    /*
    优点
    装饰类和被装饰类都只关心自身的核心业务，实现了解耦。
    方便动态的扩展功能，且提供了比继承更多的灵活性。

    缺点
    多层装饰比较复杂。
    常常会引入许多小对象，看起来比较相似，实际功能大相径庭，从而使得我们的应用程序架构变得复杂起来
  */

    // ========================================  代理模式 =================================================
    let Flower = function () {};
    let xiaoming = {
      sendFlower: function (target) {
        let flower = new Flower();
        target.receiveFlower(flower);
      },
    };
    let B = {
      receiveFlower: function (flower) {
        A.listenGoodMood(function () {
          A.receiveFlower(flower);
        });
      },
    };
    let A = {
      receiveFlower: function (flower) {
        console.log('收到花:');
        console.log(flower);
      },
      listenGoodMood: function (fn) {
        setTimeout(function () {
          fn();
        }, 1000);
      },
    };
    xiaoming.sendFlower(B);

    /*
    优点

  代理模式能将代理对象与被调用对象分离，降低了系统的耦合度。代理模式在客户端和目标对象之间起到一个中介作用，这样可以起到保护目标对象的作用
  代理对象可以扩展目标对象的功能；通过修改代理对象就可以了，符合开闭原则；

  缺点
  处理请求速度可能有差别，非直接访问存在开销
  不同点
  装饰者模式实现上和代理模式类似

  装饰者模式：  扩展功能，原有功能不变且可直接使用
  代理模式： 显示原有功能，但是经过限制之后的

  */

    // ========================================  外观模式 =================================================

    let addMyEvent = function (el, ev, fn) {
      if (el.addEventListener) {
        el.addEventListener(ev, fn, false);
      } else if (el.attachEvent) {
        el.attachEvent('on' + ev, fn);
      } else {
        el['on' + ev] = fn;
      }
    };

    /*
      设计初期，应该要有意识地将不同的两个层分离，比如经典的三层结构，在数据访问层和业务逻辑层、业务逻辑层和表示层之间建立外观Facade
      在开发阶段，子系统往往因为不断的重构演化而变得越来越复杂，增加外观Facade可以提供一个简单的接口，减少他们之间的依赖。
      在维护一个遗留的大型系统时，可能这个系统已经很难维护了，这时候使用外观Facade也是非常合适的，为系系统开发一个外观Facade类，为设计粗糙和高度复杂的遗留代码提供比较清晰的接口，让新系统和Facade对象交互，Facade与遗留代码交互所有的复杂工作。

      参考： 大话设计模式

      优点

      减少系统相互依赖。
      提高灵活性。
      提高了安全性

      缺点

      不符合开闭原则，如果要改东西很麻烦，继承重写都不合适

      */

    // ========================================  观察者模式 =================================================

    (function () {
      // 主题 保存状态，状态变化之后触发所有观察者对象
      class Subject {
        constructor() {
          this.state = 0;
          this.observers = [];
        }
        getState() {
          return this.state;
        }
        setState(state) {
          this.state = state;
          this.notifyAllObservers();
        }
        notifyAllObservers() {
          this.observers.forEach((observer) => {
            observer.update();
          });
        }
        push(observer) {
          this.observers.push(observer);
        }
      }

      // 观察者
      class Observer {
        constructor(name, subject) {
          this.name = name;
          this.subject = subject;
          this.subject.push(this);
        }
        update() {
          console.log(`${this.name} update, state: ${this.subject.getState()}`);
        }
      }

      // 测试
      let s = new Subject();
      let o1 = new Observer('o1', s);
      let o2 = new Observer('02', s);

      s.setState(12);
    })();

    /*
发布 & 订阅
一对多

优点

支持简单的广播通信，自动通知所有已经订阅过的对象
目标对象与观察者之间的抽象耦合关系能单独扩展以及重用
增加了灵活性
观察者模式所做的工作就是在解耦，让耦合的双方都依赖于抽象，而不是依赖于具体。从而使得各自的变化都不会影响到另一边的变化。

缺点
过度使用会导致对象与对象之间的联系弱化，会导致程序难以跟踪维护和理解

*/

    // ========================================  状态模式 =================================================

    (function () {
      // 状态 （弱光、强光、关灯）
      class State {
        constructor(state) {
          this.state = state;
        }
        handle(context) {
          console.log(`this is ${this.state} light`);
          context.setState(this);
        }
      }

      class Context {
        constructor() {
          this.state = null;
        }
        getState() {
          return this.state;
        }
        setState(state) {
          this.state = state;
        }
      }

      // test
      let context = new Context();
      let weak = new State('weak');
      let strong = new State('strong');
      let off = new State('off');

      // 弱光
      weak.handle(context);
      console.log(context.getState());

      // 强光
      strong.handle(context);
      console.log(context.getState());

      // 关闭
      off.handle(context);
      console.log(context.getState());

      /*

      场景

      一个对象的行为取决于它的状态，并且它必须在运行时刻根据状态改变它的行为
      一个操作中含有大量的分支语句，而且这些分支语句依赖于该对象的状态

      优点

      定义了状态与行为之间的关系，封装在一个类里，更直观清晰，增改方便
      状态与状态间，行为与行为间彼此独立互不干扰
      用对象代替字符串来记录当前状态，使得状态的切换更加一目了然


      缺点

      会在系统中定义许多状态类
      逻辑分散



      */
    })();

    // ========================================  迭代器模式 =================================================

    (function () {
      class Iterator {
        constructor(conatiner) {
          this.list = conatiner.list;
          this.index = 0;
        }
        next() {
          if (this.hasNext()) {
            return this.list[this.index++];
          }
          return null;
        }
        hasNext() {
          if (this.index >= this.list.length) {
            return false;
          }
          return true;
        }
      }

      class Container {
        constructor(list) {
          this.list = list;
        }
        getIterator() {
          return new Iterator(this);
        }
      }

      // 测试代码
      let container = new Container([1, 2, 3, 4, 5]);
      let iterator = container.getIterator();
      while (iterator.hasNext()) {
        console.log(iterator.next());
      }

      /*
  特点

访问一个聚合对象的内容而无需暴露它的内部表示。
为遍历不同的集合结构提供一个统一的接口，从而支持同样的算法在不同的集合结构上进行操作

总结
对于集合内部结果常常变化各异，不想暴露其内部结构的话，但又想让客户代码透明的访问其中的元素，可以使用迭代器模式

  */
    })();

    // ========================================  桥接模式 =================================================

    (function () {
      class Color {
        constructor(name) {
          this.name = name;
        }
      }
      class Shape {
        constructor(name, color) {
          this.name = name;
          this.color = color;
        }
        draw() {
          console.log(`${this.color.name} ${this.name}`);
        }
      }

      //测试
      let red = new Color('red');
      let yellow = new Color('yellow');
      let circle = new Shape('circle', red);
      circle.draw();
      let triangle = new Shape('triangle', yellow);
      triangle.draw();

      /*
优点
有助于独立地管理各组成部分， 把抽象化与实现化解耦
提高可扩充性
缺点
大量的类将导致开发成本的增加，同时在性能方面可能也会有所减少。
*/
    })();

    // ========================================  组合模式 =================================================

    (function () {
      class TrainOrder {
        create() {
          console.log('创建火车票订单');
        }
      }
      class HotelOrder {
        create() {
          console.log('创建酒店订单');
        }
      }

      class TotalOrder {
        constructor() {
          this.orderList = [];
        }
        addOrder(order) {
          this.orderList.push(order);
          return this;
        }
        create() {
          this.orderList.forEach((item) => {
            item.create();
          });
          return this;
        }
      }
      // 可以在购票网站买车票同时也订房间
      let train = new TrainOrder();
      let hotel = new HotelOrder();
      let total = new TotalOrder();
      total.addOrder(train).addOrder(hotel).create();

      /*
      场景
      表示对象-整体层次结构
      希望用户忽略组合对象和单个对象的不同，用户将统一地使用组合结构中的所有对象（方法）
      缺点
      如果通过组合模式创建了太多的对象，那么这些对象可能会让系统负担不起。
      */
    })();
    (
      // ========================================  原型模式 =================================================

      function () {
        class Person {
          constructor(name) {
            this.name = name;
          }
          getName() {
            return this.name;
          }
        }
        class Student extends Person {
          constructor(name) {
            super(name);
          }
          sayHello() {
            console.log(`Hello， My name is ${this.name}`);
          }
        }

        let student = new Student('xiaoming');
        student.sayHello();

        /*
          原型模式，就是创建一个共享的原型，通过拷贝这个原型来创建新的类，用于创建重复的对象，带来性能上的提升。
       */
      }
    )();

    (
      // ========================================  策略模式 =================================================

      function () {
        const strategies = {
          isNoEmpty: function (value, errorMsg) {
            if (value === '') {
              return errorMsg;
            }
          },
          isNoSpace: function (value, errorMsg) {
            if (value.trim() === '') {
              return errorMsg;
            }
          },
          minLength: function (value, length, errorMsg) {
            if (value.trim().length < length) {
              return errorMsg;
            }
          },
          maxLength: function (value, length, errorMsg) {
            if (value.length > length) {
              return errorMsg;
            }
          },
          isMobile: function (value, errorMsg) {
            if (
              !/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[7]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(
                value
              )
            ) {
              return errorMsg;
            }
          },
        };

        // 验证类
        class Validator {
          constructor() {
            this.cache = [];
          }
          add(dom, rules) {
            for (let i = 0, rule; (rule = rules[i++]); ) {
              let strategyAry = rule.strategy.split(':');
              let errorMsg = rule.errorMsg;
              this.cache.push(() => {
                let strategy = strategyAry.shift();
                strategyAry.unshift(dom.value);
                strategyAry.push(errorMsg);
                return strategies[strategy].apply(dom, strategyAry);
              });
            }
          }
          start() {
            for (
              let i = 0, validatorFunc;
              (validatorFunc = this.cache[i++]);

            ) {
              let errorMsg = validatorFunc();
              if (errorMsg) {
                return errorMsg;
              }
            }
          }
        }

        // 调用代码
        let registerForm = document.getElementById('registerForm');

        let validataFunc = function () {
          let validator = new Validator();
          validator.add(registerForm.userName, [
            {
              strategy: 'isNoEmpty',
              errorMsg: '用户名不可为空',
            },
            {
              strategy: 'isNoSpace',
              errorMsg: '不允许以空白字符命名',
            },
            {
              strategy: 'minLength:2',
              errorMsg: '用户名长度不能小于2位',
            },
          ]);
          validator.add(registerForm.password, [
            {
              strategy: 'minLength:6',
              errorMsg: '密码长度不能小于6位',
            },
          ]);
          validator.add(registerForm.phoneNumber, [
            {
              strategy: 'isMobile',
              errorMsg: '请输入正确的手机号码格式',
            },
          ]);
          return validator.start();
        };

        registerForm.onsubmit = function () {
          let errorMsg = validataFunc();
          if (errorMsg) {
            alert(errorMsg);
            return false;
          }
        };

        /*
        场景例子

        如果在一个系统里面有许多类，它们之间的区别仅在于它们的'行为'，那么使用策略模式可以动态地让一个对象在许多行为中选择一种行为。
        一个系统需要动态地在几种算法中选择一种。
        表单验证

        优点

        利用组合、委托、多态等技术和思想，可以有效的避免多重条件选择语句
        提供了对开放-封闭原则的完美支持，将算法封装在独立的strategy中，使得它们易于切换，理解，易于扩展
        利用组合和委托来让Context拥有执行算法的能力，这也是继承的一种更轻便的代替方案

        缺点

        会在程序中增加许多策略类或者策略对象
        要使用策略模式，必须了解所有的strategy，必须了解各个strategy之间的不同点，这样才能选择一个合适的strategy
       */
      }
    )();


    (
      // ========================================  享元模式 =================================================

      function () {
        let examCarNum = 0; // 驾考车总数
        /* 驾考车对象 */
        class ExamCar {
          constructor(carType) {
            examCarNum++;
            this.carId = examCarNum;
            this.carType = carType ? '手动档' : '自动档';
            this.usingState = false; // 是否正在使用
          }

          /* 在本车上考试 */
          examine(candidateId) {
            return new Promise((resolve) => {
              this.usingState = true;
              console.log(
                `考生- ${candidateId} 开始在${this.carType}驾考车- ${this.carId} 上考试`
              );
              setTimeout(() => {
                this.usingState = false;
                console.log(
                  `%c考生- ${candidateId} 在${this.carType}驾考车- ${this.carId} 上考试完毕`,
                  'color:#f40'
                );
                resolve(); // 0~2秒后考试完毕
              }, Math.random() * 2000);
            });
          }
        }

        /* 手动档汽车对象池 */
        ManualExamCarPool = {
          _pool: [], // 驾考车对象池
          _candidateQueue: [], // 考生队列

          /* 注册考生 ID 列表 */
          registCandidates(candidateList) {
            candidateList.forEach((candidateId) =>
              this.registCandidate(candidateId)
            );
          },

          /* 注册手动档考生 */
          registCandidate(candidateId) {
            const examCar = this.getManualExamCar(); // 找一个未被占用的手动档驾考车
            if (examCar) {
              examCar
                .examine(candidateId) // 开始考试，考完了让队列中的下一个考生开始考试
                .then(() => {
                  const nextCandidateId =
                    this._candidateQueue.length && this._candidateQueue.shift();
                  nextCandidateId && this.registCandidate(nextCandidateId);
                });
            } else this._candidateQueue.push(candidateId);
          },

          /* 注册手动档车 */
          initManualExamCar(manualExamCarNum) {
            for (let i = 1; i <= manualExamCarNum; i++) {
              this._pool.push(new ExamCar(true));
            }
          },

          /* 获取状态为未被占用的手动档车 */
          getManualExamCar() {
            return this._pool.find((car) => !car.usingState);
          },
        };

        ManualExamCarPool.initManualExamCar(3); // 一共有3个驾考车
        ManualExamCarPool.registCandidates([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // 10个考生来考试

        /*
        场景例子

        文件上传需要创建多个文件实例的时候
        如果一个应用程序使用了大量的对象，而这些大量的对象造成了很大的存储开销时就应该考虑使用享元模式

        优点

        大大减少对象的创建，降低系统的内存，使效率提高。

        缺点

        提高了系统的复杂度，需要分离出外部状态和内部状态，而且外部状态具有固有化的性质，

       */
      }
    )();

    // ========================================  模板方式模式 =================================================

    (function () {
      class Beverage {
        constructor({brewDrink, addCondiment}) {
          this.brewDrink = brewDrink;
          this.addCondiment = addCondiment;
        }
        /* 烧开水，共用方法 */
        boilWater() {
          console.log('水已经煮沸=== 共用');
        }
        /* 倒杯子里，共用方法 */
        pourCup() {
          console.log('倒进杯子里===共用');
        }
        /* 模板方法 */
        init() {
          this.boilWater();
          this.brewDrink();
          this.pourCup();
          this.addCondiment();
        }
      }
      /* 咖啡 */
      const coffee = new Beverage({
        /* 冲泡咖啡，覆盖抽象方法 */
        brewDrink: function () {
          console.log('冲泡咖啡');
        },
        /* 加调味品，覆盖抽象方法 */
        addCondiment: function () {
          console.log('加点奶和糖');
        },
      });
      coffee.init();

      /*
      场景例子
      一次性实现一个算法的不变的部分，并将可变的行为留给子类来实现
      子类中公共的行为应被提取出来并集中到一个公共父类中的避免代码重复

      优点
      提取了公共代码部分，易于维护

      缺点
      增加了系统复杂度，主要是增加了的抽象类和类间联系
       */
    })();

    // ========================================  职责链模式 =================================================

    (function () {
      // 请假审批，需要组长审批、经理审批、总监审批
      class Action {
        constructor(name) {
          this.name = name;
          this.nextAction = null;
        }
        setNextAction(action) {
          this.nextAction = action;
        }
        handle() {
          console.log(`${this.name} 审批`);
          if (this.nextAction != null) {
            this.nextAction.handle();
          }
        }
      }

      let a1 = new Action('组长');
      let a2 = new Action('经理');
      let a3 = new Action('总监');
      a1.setNextAction(a2);
      a2.setNextAction(a3);
      a1.handle();

      /*
      场景例子

      JS 中的事件冒泡
      作用域链
      原型链

      优点

      降低耦合度。它将请求的发送者和接收者解耦。
      简化了对象。使得对象不需要知道链的结构
      增强给对象指派职责的灵活性。通过改变链内的成员或者调动它们的次序，允许动态地新增或者删除责任
      增加新的请求处理类很方便。

      缺点

      不能保证某个请求一定会被链中的节点处理，这种情况可以在链尾增加一个保底的接受者节点来处理这种即将离开链尾的请求。
      使程序中多了很多节点对象，可能再一次请求的过程中，大部分的节点并没有起到实质性的作用。他们的作用仅仅是让请求传递下去，从性能当面考虑，要避免过长的职责链到来的性能损耗。

       */
    })();

    // ========================================  命令模式 =================================================

    (function () {
      // 接收者类
      class Receiver {
        execute() {
          console.log('接收者执行请求');
        }
      }

      // 命令者
      class Command {
        constructor(receiver) {
          this.receiver = receiver;
        }
        execute() {
          console.log('命令');
          this.receiver.execute();
        }
      }
      // 触发者
      class Invoker {
        constructor(command) {
          this.command = command;
        }
        invoke() {
          console.log('开始');
          this.command.execute();
        }
      }

      // 仓库
      const warehouse = new Receiver();
      // 订单
      const order = new Command(warehouse);
      // 客户
      const client = new Invoker(order);
      client.invoke();

      /*
优点
对命令进行封装，使命令易于扩展和修改
命令发出者和接受者解耦，使发出者不需要知道命令的具体执行过程即可执行
缺点
使用命令模式可能会导致某些系统有过多的具体命令类。
       */
    })();

    // ========================================  备忘录模式 =================================================

    (function () {
      //备忘类
      class Memento {
        constructor(content) {
          this.content = content;
        }
        getContent() {
          return this.content;
        }
      }
      // 备忘列表
      class CareTaker {
        constructor() {
          this.list = [];
        }
        add(memento) {
          this.list.push(memento);
        }
        get(index) {
          return this.list[index];
        }
      }
      // 编辑器
      class Editor {
        constructor() {
          this.content = null;
        }
        setContent(content) {
          this.content = content;
        }
        getContent() {
          return this.content;
        }
        saveContentToMemento() {
          return new Memento(this.content);
        }
        getContentFromMemento(memento) {
          this.content = memento.getContent();
        }
      }

      //测试代码

      let editor = new Editor();
      let careTaker = new CareTaker();

      editor.setContent('111');
      editor.setContent('222');
      careTaker.add(editor.saveContentToMemento());
      editor.setContent('333');
      careTaker.add(editor.saveContentToMemento());
      editor.setContent('444');

      console.log(editor.getContent()); //444
      editor.getContentFromMemento(careTaker.get(1));
      console.log(editor.getContent()); //333

      editor.getContentFromMemento(careTaker.get(0));
      console.log(editor.getContent()); //222

      /*
场景例子
分页控件
撤销组件
优点
给用户提供了一种可以恢复状态的机制，可以使用户能够比较方便地回到某个历史的状态
缺点
消耗资源。如果类的成员变量过多，势必会占用比较大的资源，而且每一次保存都会消耗一定的内存。
       */
    })();

    // ========================================  中介者模式 =================================================

    (function () {
      class A {
        constructor() {
          this.number = 0;
        }
        setNumber(num, m) {
          this.number = num;
          if (m) {
            m.setB();
          }
        }
      }
      class B {
        constructor() {
          this.number = 0;
        }
        setNumber(num, m) {
          this.number = num;
          if (m) {
            m.setA();
          }
        }
      }
      class Mediator {
        constructor(a, b) {
          this.a = a;
          this.b = b;
        }
        setA() {
          let number = this.b.number;
          this.a.setNumber(number * 10);
        }
        setB() {
          let number = this.a.number;
          this.b.setNumber(number / 10);
        }
      }

      let a = new A();
      let b = new B();
      let m = new Mediator(a, b);
      a.setNumber(10, m);
      console.log(a.number, b.number);
      b.setNumber(10, m);
      console.log(a.number, b.number);

      /*
场景例子

系统中对象之间存在比较复杂的引用关系，导致它们之间的依赖关系结构混乱而且难以复用该对象
想通过一个中间类来封装多个类中的行为，而又不想生成太多的子类。

优点

使各对象之间耦合松散，而且可以独立地改变它们之间的交互
中介者和对象一对多的关系取代了对象之间的网状多对多的关系
如果对象之间的复杂耦合度导致维护很困难，而且耦合度随项目变化增速很快，就需要中介者重构代码

缺点

系统中会新增一个中介者对象，因 为对象之间交互的复杂性，转移成了中介者对象的复杂性，使得中介者对象经常是巨大的。中介 者对象自身往往就是一个难以维护的对象。


       */
    })();

    // ========================================  解释器模式 =================================================

    (function () {
      class Context {
        constructor() {
          this._list = []; // 存放 终结符表达式
          this._sum = 0; // 存放 非终结符表达式(运算结果)
        }

        get sum() {
          return this._sum;
        }
        set sum(newValue) {
          this._sum = newValue;
        }
        add(expression) {
          this._list.push(expression);
        }
        get list() {
          return [...this._list];
        }
      }

      class PlusExpression {
        interpret(context) {
          if (!(context instanceof Context)) {
            throw new Error('TypeError');
          }
          context.sum = ++context.sum;
        }
      }
      class MinusExpression {
        interpret(context) {
          if (!(context instanceof Context)) {
            throw new Error('TypeError');
          }
          context.sum = --context.sum;
        }
      }

      /** 以下是测试代码 **/
      const context = new Context();

      // 依次添加: 加法 | 加法 | 减法 表达式
      context.add(new PlusExpression());
      context.add(new PlusExpression());
      context.add(new MinusExpression());

      // 依次执行: 加法 | 加法 | 减法 表达式
      context.list.forEach((expression) => expression.interpret(context));
      console.log(context.sum);

      /*
优点
易于改变和扩展文法。
由于在解释器模式中使用类来表示语言的文法规则，因此可以通过继承等机制来改变或扩展文法
缺点
执行效率较低，在解释器模式中使用了大量的循环和递归调用，因此在解释较为复杂的句子时其速度慢
对于复杂的文法比较难维护

       */
    })();

    // ========================================  访问者模式 =================================================

    (function () {
      // 访问者
      class Visitor {
        constructor() {}
        visitConcreteElement(ConcreteElement) {
          ConcreteElement.operation();
        }
      }
      // 元素类
      class ConcreteElement {
        constructor() {}
        operation() {
          console.log('ConcreteElement.operation invoked');
        }
        accept(visitor) {
          visitor.visitConcreteElement(this);
        }
      }
      // client
      let visitor = new Visitor();
      let element = new ConcreteElement();
      element.accept(visitor);

      /*
场景例子

对象结构中对象对应的类很少改变，但经常需要在此对象结构上定义新的操作
需要对一个对象结构中的对象进行很多不同的并且不相关的操作，而需要避免让这些操作"污染"这些对象的类，也不希望在增加新操作时修改这些类。

优点

符合单一职责原则
优秀的扩展性
灵活性

缺点

具体元素对访问者公布细节，违反了迪米特原则
违反了依赖倒置原则，依赖了具体类，没有依赖抽象。
具体元素变更比较困难


       */
    })();

    (function () {
      /*

       */
    })();

    (function () {
      /*

       */
    })();

    (function () {
      /*

       */
    })();

    (function () {
      /*

       */
    })();

    (function () {})();
    (function () {})();
    (function () {})();
    (function () {})();
    (function () {})();
    (function () {})();
    (function () {})();
    (function () {})();
    (function () {})();
    (function () {})();
  }
)();
