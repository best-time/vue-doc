const Fragment = Symbol();
const Portal = Symbol();

function h(tag, data = null, children = null) {
  let flags = null;
  if (typeof tag === "string") {
    flags = tag === "svg" ? VNodeFlags.ELEMENT_SVG : VNodeFlags.ELEMENT_HTML;
    if(data) {
      data.class = normalizeClass(data.class)
    }
  } else if (tag === Fragment) {
    flags = VNodeFlags.FRAGMENT;
  } else if (tag === Portal) {
    flags = VNodeFlags.PORTAL;
    tag = data && data.target;
  } else {
    // 组件, 因为很少会用h函数去创建文本
    if (tag !== null && typeof tag === "object") {
      flags = tag.functional
        ? VNodeFlags.COMPONENT_FUNCTIONAL
        : VNodeFlags.COMPONENT_STATEFUL_NORMAL;
    }
  }

  let childFlags = null;
  if (Array.isArray(children)) {
    const { length } = children;
    if (length === 0) {
      // 没有子节点
      childFlags = ChildrenFlags.NO_CHILDREN;
    } else if (length === 1) {
      // 单子节点
      childFlags = ChildrenFlags.SINGLE_VNODE;
      children = children[0];
    } else {
      // 多个子节点，且子节点使用key
      childFlags = ChildrenFlags.KEYED_VNODES;
      children = normalizeVNodes(children);
    }
  } else if (children == null) {
    // 没子节点
    childFlags = ChildrenFlags.NO_CHILDREN;
  } else if (children._isVNode) {
    // 单子节点
    childFlags = ChildrenFlags.SINGLE_VNODE;
  } else {
    // 其他情况都作为文本节点处理，即单个子节点，会调用 createTextVNode 创建纯文本类型的 VNode
    childFlags = ChildrenFlags.SINGLE_VNODE;
    children = createTextVNode(children + "");
  }

  return {
    tag,
    flags,
    data,
    children,
    childFlags,
    el: null,
    _isVNode: true
  };
}

function normalizeVNodes(children) {
  const newChildren = [];
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.key == null) {
      // 如果原来的 VNode 没有key，则使用竖线(|)与该VNode在数组中的索引拼接而成的字符串作为key
      child.key = `|${i}`;
    }
    newChildren.push(child);
  }
  return newChildren;
}

function normalizeClass(classValue) {
  let res = ''
  if(typeof classValue === 'string') {
    res = classValue
  } else if (Array.isArray(classValue)) {
    for(let i=0; i < classValue.length; i++) {
      res += classValue[i]
    }
  } else if (typeof classValue === 'object') {
    for(let key in classValue) {
      classValue[key] && (res += name +' ')
    }
  }
  return res.trim()
}

// 文本节点
function createTextVNode(text) {
  return {
    _isVNode: true,
    flags: VNodeFlags.TEXT,
    tag: null,
    data: null,
    // 纯文本类型的 VNode，其 children 属性存储的是与之相符的文本内容
    children: text,
    // 文本节点没有子节点
    childFlags: ChildrenFlags.NO_CHILDREN,
    el: null
  };
}
