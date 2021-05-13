## 注意点

数组操作api
  改变原数组:
    pop()
    push()
    shift()
    unshift()
    splice()
    sort()
    reverse()
    fill()
    copyWithin()
  不改变原数组:
    concat()
    join()
    slice()
    map()
    forEach()
    every()
    some()
    filter()
    reduce()
    find()
    entries()

// slice 返回新的数组
let a = [1]; a.slice(0, -1) // []
let a = [1, 2]; a.slice(0, -1) // [2]

// reduce
[].reduce((prev, now) => {return prev[now]}, {a: 1}) // {a: 1}