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
  // 如果将要被移除的 VNode 类型是组件，则需要调用该组件实例的 unmounted 钩子函数
  if (prevVNode.flags & VNodeFlags.COMPONENT_STATEFUL_NORMAL) {
    // 类型为有状态组件的 VNode，其 children 属性被用来存储组件实例对象
    const instance = prevVNode.children;
    instance.unmounted && instance.unmounted();
  }
  mount(nextVNode, container);
}

function patchElement(prevVNode, nextVNode, container) {
  if (prevVNode.tag !== nextVNode.tag) {
    replaceVNode(prevVNode, nextVNode, container);
    return;
  }

  // nextVNode.el 也引用该元素
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
    case "style":
      for (let k in nextValue) {
        el.style[k] = nextValue[k];
      }
      for (let k in prevValue) {
        if (!nextValue.hasOwnProperty(k)) {
          el.style[k] = "";
        }
      }
      break;
    case "class":
      el.className = nextValue;
      break;
    default:
      if (key.startsWith("on")) {
        // 事件
        // 移除旧事件
        if (prevValue) {
          el.removeEventListener(key.slice(2), prevValue);
        }
        // 添加新事件
        if (nextValue) {
          el.addEventListener(key.slice(2), nextValue);
        }
      } else if (domPropsRE.test(key)) {
        // 当作 DOM Prop 处理
        el[key] = nextValue;
      } else {
        // setAttribute 函数为元素设置属性时，无论你传递的值是什么类型，它都会将该值转为字符串再设置到元素上
        // 当作 Attr 处理
        el.setAttribute(key, nextValue);
      }
      break;
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
            container.insertBefore(
              oldStartVNode.el,
              oldEndVNode.el.nextSibling
            );
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
      }
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
