let vm = new MVVM({
  el: "#app",
  data: {
    message: {
      a: "hello",
      b: "message-b"
    },
    b: " this is b ",
    c: " and c "
  },
  computed: {
    hello() {
      return this.b + this.c + this.message.a;
    }
  }
});

// 旧的 VNode
const prevVNode = h("div", null, [
  h("p", { key: "a" }, "节点1"),
  h("p", { key: "b" }, "节点2"),
  h("p", { key: "c" }, "节点3")
]);

// 新的 VNode
const nextVNode = h("div", null, [
  h("p", { key: "c" }, "节点3"),
  h("p", { key: "a" }, "节点1"),
  h("p", { key: "b" }, "节点2")
]);
/*

render(prevVNode, document.getElementById('app'))

// 2秒后更新
setTimeout(() => {
render(nextVNode, document.getElementById('app'))
}, 2000)

*/

let $box = document.getElementById("box");
let vdiv = h(
  "div",
  { style: { width: "100px", height: "100px", backgroundColor: "red" }, class: 'cls-a cls-b' },
  h("div", {
    style: {
      height: "50px",
      width: "50px",
      background: "green"
    }
  })
);
render(vdiv, $box);
