// R 是否存在于L的原型链上
function instanceOf(L, R) {
  const baseType = ["string", "boolean", 'number', 'undefined', 'symbol']
  if(baseType.includes(typeof L)) {
    return false
  }

  let RP = R.prototype
  L = L.__proto__
  while(1) {
    if(L === null) {
      return false
    }
    if(L === RP) {
      return true
    }
    L = L.__proto__
  }

}