
/**
 旧 VNode	新 VNode	操作
❌	✅	调用 mount 函数
✅	❌	移除 DOM
✅	✅	调用 patch 函数
 */

 // mount patch
function render(vnode, container) {
  const prevVNode = container.vnode;
  if (prevVNode == null) {
    if (vnode) {
      // 使用 `mount` 函数挂载全新的 VNode
      mount(vnode, container);
      // 将新的 VNode 添加到 container.vnode 属性下
      container.vnode = vnode;
    }
  } else {
    if (vnode) {
      // 有旧的 VNode，则调用 `patch` 函数打补丁
      patch(prevVNode, vnode, container);
      container.vnode = vnode;
    } else {
      // 有旧的 VNode 但是没有新的 VNode，这说明应该移除 DOM，
      container.removeChild(prevVNode.el);
      container.vnode = null;
    }
  }
}

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
    mountStatefulComponent(vnode, container, isSVG);
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

function patch(prevVNode, nextVNode, container) {
  const nextFlags = nextVNode.flags;
  const prevFlags = prevVNode.flags;

  if (nextFlags !== prevFlags) {
    replaceVNode(prevVNode, nextVNode, container);
  } else if (nextFlags & VNodeFlags.ELEMENT) {
    patchElement(prevVNode, nextVNode, container);
  } else if (nextFlags & VNodeFlags.COMPONENT) {
    patchComponent(prevVNode, nextVNode, container);
  } else if (nextFlags & VNodeFlags.TEXT) {
    patchText(prevVNode, nextVNode, container);
  } else if (nextFlags & VNodeFlags.FRAGMENT) {
    patchFragment(prevVNode, nextVNode, container);
  } else if (nextFlags & VNodeFlags.PORTAL) {
    patchPortal(prevVNode, nextVNode, container);
  }
}

function replaceVNode(prevVNode, nextVNode, container) {
  container.removeChild(prevVNode.el);
  if (prevVNode.flags & VNodeFlags.COMPONENT_STATEFUL_NORMAL) {
    const instance = prevVNode.children;
    instance.unmounted && instance.unmounted;
  }
  mount(nextVNode, container);
}

function patchElement(prevVNode, nextVNode, container) {
  if (prevVNode.tag !== nextVNode.tag) {
    replaceVNode(prevVNode, nextVNode, container);
    return;
  }

  const el = (nextVNode.el = prevVNode.el);
  const prevData = prevVNode.data;
  const nextData = nextVNode.data;

  if (nextData) {
    for (let key in nextData) {
      const prevValue = prevData[key];
      const nextValue = nextData[key];
      patchData(el, key, prevValue, nextValue);
    }
  }

  if (prevData) {
    for (let key in prevData) {
      const prevValue = prevData[key];
      if (prevValue && !nextData.hasOwnProperty(key)) {
        patchData(el, key, prevValue, null);
      }
    }
  }

  patchChildren(
    prevVNode.childFlags, // 旧的 VNode 子节点的类型
    nextVNode.childFlags, // 新的 VNode 子节点的类型
    prevVNode.children, // 旧的 VNode 子节点
    nextVNode.children, // 新的 VNode 子节点
    el // 当前标签元素，即这些子节点的父节点
  );
}

function patchData(el, key, prevValue, nextValue) {
  switch (key) {
    case 'style':
      for (let k in nextValue) {
        el.style[k] = nextValue[k]
      }
      for (let k in prevValue) {
        if (!nextValue.hasOwnProperty(k)) {
          el.style[k] = ''
        }
      }
      break
    case 'class':
      el.className = nextValue
      break
    default:
      if (key.startsWith('on')) {
        // 事件
        // 移除旧事件
        if (prevValue) {
          el.removeEventListener(key.slice(2), prevValue)
        }
        // 添加新事件
        if (nextValue) {
          el.addEventListener(key.slice(2), nextValue)
        }
      } else if (domPropsRE.test(key)) {
        // 当作 DOM Prop 处理
        el[key] = nextValue
      } else {
        // setAttribute 函数为元素设置属性时，无论你传递的值是什么类型，它都会将该值转为字符串再设置到元素上
        // 当作 Attr 处理
        el.setAttribute(key, nextValue)
      }
      break
  }
}

/*
一些特殊的 attribute，比如 checked/disabled 等，只要出现了，对应的 property 就会被初始化为 true，
无论设置的值是什么,只有调用 removeAttribute 删除这个 attribute，对应的 property 才会变成 false。

这就指引我们有些属性不能通过 setAttribute 设置，而是应该直接通过 DOM 元素设置：el.checked = true。
好在这样的属性不多，我们可以列举出来：value、checked、selected、muted。
除此之外还有一些属性也需要使用 Property 的方式设置到 DOM 元素上，例如 innerHTML 和 textContent 等等。
*/

function patchChildren(
  prevChildFlags,
  nextChildFlags,
  prevChildren,
  nextChildren,
  container
) {
  switch (prevChildFlags) {
    // 旧的 children 是单个子节点
    case ChildrenFlags.SINGLE_VNODE:
      if (nextChildFlags === ChildrenFlags.SINGLE_VNODE) {
        patch(prevChildren, nextChildren, container);
      } else if (nextChildFlags === ChildrenFlags.NO_CHILDREN) {
        container.removeChild(prevChildren.el);
      } else {
        container.removeChild(prevChildren.el);
        for (let i = 0; i < nextChildren.length; i++) {
          mount(nextChildren[i], container);
        }
      }
      break;
    // 旧的 children 没有子节点
    case ChildrenFlags.NO_CHILDREN:
      if (nextChildFlags === ChildrenFlags.SINGLE_VNODE) {
        // 新的 children 是单个子节点时
        mount(nextChildren, container);
        break;
      } else if (nextChildFlags === ChildrenFlags.NO_CHILDREN) {
      } else {
        for (let i = 0; i < nextChildren.length; i++) {
          mount(nextChildren[i], container);
        }
      }
      break;
    // 旧的 children 中有多个子节点时
    default:
      if (nextChildFlags === ChildrenFlags.SINGLE_VNODE) {
        for (let i = 0; i < prevChildren.length; i++) {
          container.removeChild(prevChildren[i].el);
        }
        mount(nextChildren, container);
      } else if (nextChildFlags === ChildrenFlags.NO_CHILDREN) {
        for (let i = 0; i < prevChildren.length; i++) {
          container.removeChild(prevChildren[i].el);
        }
      } else {
        // 新children 多子节点
        // '双端'比较
        let oldStartIdx = 0;
        let oldEndIdx = prevChildren.length - 1;
        let newStartIdx = 0;
        let newEndIdx = nextChildren.length - 1;
        let oldStartVNode = prevChildren[oldStartIdx];
        let oldEndVNode = prevChildren[oldEndIdx];
        let newStartVNode = nextChildren[newStartIdx];
        let newEndVNode = nextChildren[newEndIdx];
      }

      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (oldStartVNode.key === newStartVNode.key) {
          // 新/老start
          patch(oldStartVNode, newStartVNode, container);
          oldStartVNode = prevChildren[++oldStartIdx];
          newStartVNode = nextChildren[++newStartIdx];
        } else if (oldEndVNode.key === newEndVNode.key) {
          // 新/老end节点
          patch(oldEndVNode, newEndVNode, container);
          oldEndVNode = prevChildren[--oldEndIdx];
          newEndVNode = newEndVNode[--newEndIdx];
        } else if (oldStartVNode.key === newEndVNode.key) {
          // 老start 新end
          patch(oldStartVNode, newEndVNode, container);
          container.insertBefore(oldStartVNode.el, oldEndVNode.el.nextSibling);
          oldStartVNode = prevChildren[++oldStartIdx];
          newEndVNode = nextChildren[--newEndIdx];
        } else if (oldEndVNode.key === newStartVNode.key) {
          // 老end 新start
          patch(oldEndVNode, newStartVNode, container);
          container.insertBefore(oldEndVNode.el, oldStartVNode.el);
          oldEndVNode = prevChildren[--oldEndIdx];
          newStartVNode = nextChildren[++newStartIdx];
        }
      }
      break;
  }
}

function patchText(prevVNode, nextVNode) {
  // 拿到文本节点 el，同时让 nextVNode.el 指向该文本节点
  const el = (nextVNode.el = prevVNode.el);
  // 只有当新旧文本内容不一致时才有必要更新
  if (nextVNode.children !== prevVNode.children) {
    el.nodeValue = nextVNode.children;
  }
}

function patchFragment(prevVNode, nextVNode, container) {
  // 直接调用 patchChildren 函数更新 新旧片段的子节点即可
  patchChildren(
    prevVNode.childFlags, // 旧片段的子节点类型
    nextVNode.childFlags, // 新片段的子节点类型
    prevVNode.children, // 旧片段的子节点
    nextVNode.children, // 新片段的子节点
    container
  );

  switch (nextVNode.childFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      nextVNode.el = nextVNode.children.el;
      break;
    case ChildrenFlags.NO_CHILDREN:
      nextVNode.el = prevVNode.el;
      break;
    default:
      nextVNode.el = nextVNode.children[0].el;
  }
}
function patchPortal(prevVNode, nextVNode) {
  patchChildren(
    prevVNode.childFlags,
    nextVNode.childFlags,
    prevVNode.children,
    nextVNode.children,
    prevVNode.tag // 注意 container 是旧的 container
  );
  // 让 nextVNode.el 指向 prevVNode.el
  nextVNode.el = prevVNode.el;

  // 如果新旧容器不同，才需要搬运
  if (nextVNode.tag !== prevVNode.tag) {
    // 获取新的容器元素，即挂载目标
    const container =
      typeof nextVNode.tag === "string"
        ? document.querySelector(nextVNode.tag)
        : nextVNode.tag;

    switch (nextVNode.childFlags) {
      case ChildrenFlags.SINGLE_VNODE:
        // 如果新的 Portal 是单个子节点，就把该节点搬运到新容器中
        container.appendChild(nextVNode.children.el);
        break;
      case ChildrenFlags.NO_CHILDREN:
        // 新的 Portal 没有子节点，不需要搬运
        break;
      default:
        // 如果新的 Portal 是多个子节点，遍历逐个将它们搬运到新容器中
        for (let i = 0; i < nextVNode.children.length; i++) {
          container.appendChild(nextVNode.children[i].el);
        }
        break;
    }
  }
}

function patchComponent(prevVNode, nextVNode, container) {
  if (nextVNode.tag !== prevVNode.tag) {
    replaceVNode(prevVNode, nextVNode, container);
  } else if (nextVNode.flags & VNodeFlags.COMPONENT_STATEFUL_NORMAL) {
    // 获取组件实例
    const instance = (nextVNode.children = prevVNode.children);
    // 更新 props
    instance.$props = nextVNode.data;
    // 更新组件
    instance._update();
  } else {
    // 更新函数式组件
    const handle = (nextVNode.handle = prevVNode.handle);
    handle.prev = prevVNode;
    handle.next = nextVNode;
    handle.container = container;

    handle.update();
  }
}
