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
