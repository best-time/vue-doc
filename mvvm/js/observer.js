class Observer {
  constructor(data) {
    this.observe(data);
  }

  observe(data) {
    // 添加set get
    if (!data || typeof data !== "object") return;
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key]);
      this.observe(data[key]);
    });
  }

  defineReactive(obj, key, value) {
    // let _this = this;
    let dep = new Dep();
    Object.defineProperty(obj, key, {
      enumerable: true, // for in
      configurable: true, // 可删除
      get() {
        Dep.target && dep.addSub(Dep.target);
        return value;
      },
      set: (newVal) => {
        if (newVal !== value) {
          this.observe(newVal);
          value = newVal;
          dep.notify()
        }
      }
    });
  }
}

class Dep {
  constructor() {
    this.subs = [];
  }

  addSub(watcher) {
    this.subs.push(watcher);
  }
  notify() {
    this.subs.forEach(watcher => {
      if (typeof watcher.update === "function") watcher.update();
    });
  }
}
