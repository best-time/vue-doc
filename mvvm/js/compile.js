class Compile {
  constructor(el, vm) {
    this.el = this.isElementNode(el) ? el : document.querySelector(el);
    this.vm = vm;
    if (this.el) {
      // 先把真实dom放到内存中, fragment
      let fragment = this.node2fragment(this.el);
      // 编译v-model 和 {{}}
      this.compile(fragment);
      // fragment 放回页面
      this.el.appendChild(fragment);
    }
  }
  // 工具
  isElementNode(node) {
    return node.nodeType === 1;
  }
  isDirective(name) {
    // startsWidth
    return name.includes("v-");
  }

  // 核心方法
  compile(fragment) {
    let childNodes = fragment.childNodes; // 类数组
    Array.from(childNodes).forEach(node => {
      if (this.isElementNode(node)) {
        this.compileElement(node);
        this.compile(node);
      } else {
        this.compileText(node);
      }
    });
  }

  compileElement(node) {
    // v-model
    let attrs = node.attributes;
    Array.from(attrs).forEach(attr => {
      // name value
      let attrName = attr.name;
      if (this.isDirective(attrName)) {
        let expr = attr.value;
        let [, type] = attrName.split("-");
        CompileUtil[type](node, this.vm, expr);
      }
    });
  }

  compileText(node) {
    // {{}}
    let expr = node.textContent;
    let reg = /\{\{([^}]+)\}\}/gi;
    if (reg.test(expr)) {
      CompileUtil["text"](node, this.vm, expr);
    }
  }

  node2fragment(el) {
    let fragment = document.createDocumentFragment();
    let firstChild;
    while ((firstChild = el.firstChild)) {
      fragment.appendChild(firstChild);
    }
    return fragment; // 内存中节点
  }
}

CompileUtil = {
  getVal(vm, expr) {
    expr = expr.split(".");
    return expr.reduce((prev, next) => {
      return prev[next];
    }, vm); // todo
  },
  getTextVal(vm, expr) {
    return expr.replace(/\{\{([^}]+)\}\}/gi, (...rest) => {
      return this.getVal(vm, rest[1]);
    });
  },
  setVal(vm, expr, value) {
    expr = expr.split(".")
    return expr.reduce((prev, next, currentIndex) => {
        if(currentIndex === expr.length -1) {
            return prev[next] = value
        }
        return prev[next]
    }, vm) // todo
  },
  text(node, vm, expr) {
    let updateFn = this.updater["textUpdater"];
    let value = this.getTextVal(vm, expr);

    // {{a}} {{b}}
    expr.replace(/\{\{([^}]+)\}\}/gi, (...rest) => {
      new Watcher(vm, rest[1], newValue => {
        updateFn && updateFn(node, this.getTextVal(vm, expr));
      });
    });

    updateFn && updateFn(node, value);
  },
  model(node, vm, expr) {
    let updateFn = this.updater["modelUpdater"];
    // 添加监控
    new Watcher(vm, expr, newValue => {
      // 当值变化后, 讲新值传入
      updateFn && updateFn(node, this.getVal(vm, expr));
    });
    node.addEventListener("input", (e) => {
        let newValue = e.target.value
        this.setVal(vm, expr, newValue)
    })
    updateFn && updateFn(node, this.getVal(vm, expr));
  },

  updater: {
    textUpdater(node, value) {
      node.textContent = value;
    },
    modelUpdater(node, value) {
      node.value = value;
    }
  }
  // html() {

  // }
};
