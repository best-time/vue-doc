function mount(vnode, container, isSVG, refNode) {
  const { flags } = vnode;
  if (flags & VNodeFlags.ELEMENT) {
    // 挂载普通标签
    mountElement(vnode, container, isSVG, refNode);
  } else if (flags & VNodeFlags.COMPONENT) {
    // 挂载组件
    mountComponent(vnode, container, isSVG);
  } else if (flags & VNodeFlags.TEXT) {
    // 挂载纯文本
    mountText(vnode, container);
  } else if (flags & VNodeFlags.FRAGMENT) {
    // 挂载 Fragment
    mountFragment(vnode, container, isSVG);
  } else if (flags & VNodeFlags.PORTAL) {
    // 挂载 Portal
    mountPortal(vnode, container, isSVG);
  }
}

const domPropsRE = /\W|^(?:value|checked|selected|muted)$/;
function mountElement(vnode, container, isSVG, refNode) {
  isSVG = isSVG || vnode.flags & VNodeFlags.ELEMENT_SVG;
  const el = isSVG
    ? document.createElementNS("http://www.w3.org/2000/svg")
    : document.createElement(vnode.tag);
  vnode.el = el;
  const data = vnode.data;
  if (data) {
    for (let k in data) {
      patchData(el, k, null, data[k]);
    }
  }

  const childFlags = vnode.childFlags;
  const children = vnode.children;
  if (childFlags !== ChildrenFlags.NO_CHILDREN) {
    if (childFlags & ChildrenFlags.SINGLE_VNODE) {
      mount(children, el, isSVG);
    } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
      for (let i = 0; i < children.length; i++) {
        mount(children[i], el, isSVG);
      }
    }
  }

  if (refNode) {
    container.insertBefore(el, refNode);
  } else {
    container.appendChild(el);
  }
}

function mountText(vnode, container) {
  const el = document.createTextNode(vnode.children);
  vnode.el = el;
  container.appendChild(el);
}

function mountFragment(vnode, container, isSVG) {
  const { children, childFlags } = vnode;
  switch (childFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      mount(children, container, isSVG);
      break;
    case ChildrenFlags.NO_CHILDREN:
      const placeholder = createTextVNode("");
      mountText(placeholder, container);
      break;
    default:
      for (let i = 0; i < children.length; i++) {
        mount(children[i], container, isSVG);
      }
      break;
  }
}

function mountPortal(vnode, container) {
  const { tag, children, childFlags } = vnode;
  const target = typeof tag === "string" ? document.querySelector(tag) : tag;
  if (childFlags & ChildrenFlags.SINGLE_VNODE) {
    // 将 children 挂在到 target 上，而非 container
    mount(children, target);
  } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
    for (let i = 0; i < children.length; i++) {
      mount(children[i], target);
    }
  }

  // 占位的空文本节点
  const placeholder = createTextVNode("");
  // 将该节点挂载到 container 中
  mountText(placeholder, container, null);
  // el 属性引用该节点
  vnode.el = placeholder.el;
}

function mountComponent(vnode, container, isSVG) {
  if (vnode.flags & VNodeFlags.COMPONENT_STATEFUL) {
    vnode, container, isSVG;
  } else {
    mountFunctionalComponent(vnode, container, isSVG);
  }
}

function mountStatefulComponent(vnode, container, isSVG) {
  const instance = (vnode.children = new vnode.tag());
  instance.$props = vnode.data;

  instance._update = () => {
    if (instance._mounted) {
      // 更新
      // 拿到旧的 VNode
      const prevVNode = instance.$vnode;
      // 重渲染新的 VNode
      const nextVNode = (intance.$vnode = instance.render());
      // patch 更新
      patch(prevVNode, nextVNode, prevVNode.el.parentNode);
      // 4、更新 vnode.el 和 $el
      instance.$el = vnode.el = instance.$vnode.el;
    } else {
      // 1、渲染VNode
      instance.$vnode = instance.render();
      // 2、挂载
      mount(instance.$vnode, container, isSVG);

      instance._mounted = true;
      // 4、el 属性值 和 组件实例的 $el 属性都引用组件的根DOM元素
      instance.$el = vnode.el = instance.$vnode.el;
      // 调用 mounted 钩子
      instance.mounted && instance.mounted();
    }
  };

  instance._update();
}

function mountFunctionalComponent(vnode, container, isSVG) {
  vnode.handle = {
    prev: null,
    next: vnode,
    container,
    update: () => {
      if (vnode.handle.prev) {
        // prevVNode 是旧的组件VNode，nextVNode 是新的组件VNode
        const prevVNode = vnode.handle.prev;
        const nextVNode = vnode.handle.next;
        // prevTree 是组件产出的旧的 VNode
        const prevTree = prevVNode.children;
        // nextTree 是组件产出的新的 VNode
        const props = vnode.data;
        const nextTree = (nextVNode.children = nextVNode.tag(props));
        // 调用 patch 函数更新
        patch(prevTree, nextTree, vnode.handle.container);
      } else {
        const props = vnode.data;
        // 获取 VNode
        const $vnode = (vnode.children = vnode.tag(props));
        // 挂载
        mount($vnode, container, isSVG);
        // el 元素引用该组件的根元素
        vnode.el = $vnode.el;
      }
    }
  };
  // 立即调用 vnode.handle.update 完成初次挂载
  vnode.handle.update();
}
