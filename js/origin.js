function New(fn, ...args) {
  const result = {};

  if (fn.prototype !== null) {
    Object.setPrototypeOf(result, fn.prototype);
  }

  const returnResult = fn.apply(result, args);
  let isObjLike =
    typeof returnResult === 'object' || typeof returnResult === 'function';
  if (isObjLike && returnResult !== null) {
    return returnResult;
  }

  return result;
}

function objectCreate(proto, propertiesObject) {
  if (
    typeof proto !== 'object' &&
    typeof proto !== 'function' &&
    proto !== null
  ) {
    throw new Error(`Object prototype may only be an Object or null:${proto}`);
  }
  // 新建一个对象
  const result = {};
  // 将该对象的原型设置为proto
  Object.setPrototypeOf(result, proto);
  // 将属性赋值给该对象
  Object.defineProperties(result, propertiesObject);
  // 返回该对象
  return result;
}

function _new(fn, ...rest) {
  const obj = Object.create(fn.prototype);

  const res = fn.apply(obj, rest);

  return typeof res === 'object' ? res : obj;
}
