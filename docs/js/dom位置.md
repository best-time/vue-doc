# dom位置

## offsetTop/offsetLeft

```javascript
/*
如果所有祖先元素都是静态定位 position:static;（这是默认的情况），
offsetTop 表示与文档最上方的高度差（文档最上方可能已经滚出视口，这个高度可能大于视口高度）。

如果存在绝对定位的祖先元素 position:absolute/fixed，offsetTop 就会相对于这个元素。
因此为了获取相对于文档最上方的高度差，需要递归地调用：
*/
function getOffsetTop(el){
    return el.offsetParent
        ? el.offsetTop + getOffsetTop(el.offsetParent)
        : el.offsetTop
}
/*
el.offsetParent 是当前元素的定位容器（positioning container）， 
如果当前元素没有绝对定位的祖先节点，这个属性的值就是 null。

兼容性和限制：几乎所有浏览器都支持该属性。如果元素被隐藏它的值就是 0，但在 IE9 下没有影响
*/
```

## getBoundingClientRect()

```javascript
// Element.getBoundingClientRect() 用于获取元素的大小，以及相对于视口（viewport）的位置， 返回一个 DOMRect 对象。

> document.querySelector('span').getBoundingClientRect()
DOMRect {x: 2.890625, y: 218.890625, width: 1264, height: 110, top: 218.890625, …}
bottom: 328.890625
height: 110
left: 2.890625
right: 1266.890625
top: 218.890625
width: 1264
x: 2.890625
y: 218.890625

// 如果要获取相对于文档左上角的位置，需要在上述 top 和 left 的基础上再加滚动位置。 如下代码来自 MDN，可兼容几乎所有浏览器：

// For scrollX
(((t = document.documentElement) || (t = document.body.parentNode))
  && typeof t.scrollLeft == 'number' ? t : document.body).scrollLeft
// For scrollY
(((t = document.documentElement) || (t = document.body.parentNode))
  && typeof t.scrollTop == 'number' ? t : document.body).scrollTop

//兼容性和限制：同样是 CSSOM View Module 的特性，但几乎兼容所有浏览器，可参考 https://caniuse.com/#feat=getboundingclientrect IE 下窗口的左上角可能不是 0,0，在 IE9 可以这样把它设置为 0,0：

<meta http-equiv="x-ua-compatible" content="ie=edge"/>
```



## getClientRects()

```js
// Element.getClientRects() 用来获得 DOM 元素中的所有 CSS 盒模型 对应的 DOMRect 组成的集合。

// 如果是一个块级元素，返回的集合中应该只有一个元素，即这个块的大小和位置。 
// 但如果是一个行内元素（或者 SVG 内的元素），则会返回其中每个 CSS 盒子。比如一个普通的被默认折行的 <span>：

> document.querySelector('span').getClientRects()
DOMRectList {0: DOMRect, 1: DOMRect, 2: DOMRect, length: 5}
0: DOMRect {x: 2.890625, y: 262.890625, width: 1264, height: 22, top: 262.890625, …}
1: DOMRect {x: 2.890625, y: 284.890625, width: 1264, height: 22, top: 284.890625, …}
2: DOMRect {x: 2.890625, y: 306.890625, width: 768,  height: 22, top: 306.890625, …}
// 这个 <span> 有三行，其中第三行的长度不足一行，每次折行都形成了一个新的 CSS 盒子。

// 兼容性和限制：在 IE8 及以下会返回 IE 独有的 TextRectangle 对象（而不是 ClientRect）， 
// 这个对象不具有 width 和 height 属性，而且无法给它设置属性。
```

