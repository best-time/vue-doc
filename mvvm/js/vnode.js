/*

{
    tag: "div",
    data: {
        style: {
            width: "100px",
            height: "100px",
            backgroundColor: "red"
        }
    },
    children: [
        {
            tag: "h1",
            data: null
        },
        {
            tag: "p",
            data: null
        }
    ]
}

children:
无非有以下几种：

没有子节点
只有一个子节点
多个子节点
    有 key
    无 key
不知道子节点的情况


export interface VNode {
  // 它是一个始终为 true 的值，有了它，我们就可以判断一个对象是否是 VNode 对象
  _isVNode: true
  // 当一个 VNode 被渲染为真实 DOM 之后，el 属性的值会引用该真实DOM
  el: Element | null
  flags: VNodeFlags
  tag: string | FunctionalComponent | ComponentClass | null
  data: VNodeData | null
  children: VNodeChildren
  childFlags: ChildrenFlags
}

 
 */