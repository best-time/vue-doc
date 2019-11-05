// 收集依赖, 数据变化后执行对应方法
class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;

    this.value = this.get();
  }

  getVal(vm, expr) {
    expr = expr.split(".");
    return expr.reduce((prev, next) => {
      return prev[next];
    }, vm); // todo
  }

  get() {
    Dep.target = this;
    let value = this.getVal(this.vm, this.expr);
    Dep.target = null;
    return value;
  }

  update() {
    let newVal = this.getVal(this.vm, this.expr);
    let oldVal = this.value;

    if (newVal !== oldVal) {
      this.cb(newVal, oldVal);
    }
  }
}
