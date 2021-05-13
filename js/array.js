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
