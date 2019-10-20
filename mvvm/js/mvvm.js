class MVVM {
  constructor(option) {
    this.$option = option
    this.$el = this.$option.el;
    this.$data = this.$option.data;
    if (this.$el) {
      // 数据劫持
      new Observer(this.$data);

      this.proxyData(this.$data)

      this.initComputed()

      // 数据和dom元素编译
      new Compile(this.$el, this);
    }
  }

  proxyData(data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        get() {
          return data[key]
        },
        set(newValue) {
          data[key] = newValue
        }
      })
    });
  }

  initComputed() {
    let computed = this.$option.computed
    Object.keys(computed).forEach(key => {
      Object.defineProperty(this, key, {
        get:() => {
          let res = typeof computed[key] === 'function' ? computed[key].call(this) : computed[key].get
          return  res
        },
        set(newValue) {
        }
      })
    })
  }
}
