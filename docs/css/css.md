# 常用css片段

## 一行文本...

```css
overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
```

## 多行文本...

```css
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 3;
overflow: hidden;

```

## IOS 手机容器滚动条滑动不流畅

```css
overflow: auto;
-webkit-overflow-scrolling: touch;
```

## 固定子容器在固定的父容器下水平垂直居中

```css
思路1：绝对定位，通过移动子元素实现；

设置top、left距离为 50%，
然后再将元素往回移动自身的50%距离；
具体方法可以是通过calc计算折合到top、left中，
或者 调整 margin-left、margin-top 为负值，
或者使用 transform 属性进行平移；
思路2：flex 弹性盒子，
设置 align-items 和 justify-content 为 center
或者 设置子元素的 margin 为 auto
思路3：添加伪元素 ::after
在子元素后添加 空的、inline-block 的伪元素
将伪元素的 height 设置为 100%，并设置 vertical-align 为 middle，以此实现垂直居中
设置容器text-align: center，实现水平居中
思路4：设置 table
容器设置为 table
在元素和容器中间，加一层中间容器，设置为 table-cell
通过设置 table-cell 容器的 vertical-align: middle、text-align: center，实现水平垂直居中

/* 方法一 */
        .father {
            width: 300px;
            height: 300px;
            border: 1px solid black;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .son {
            width: 100px;
            height: 100px;
            background: cadetblue;
        }
        /* 方法二 */
        .father {
            width: 300px;
            height: 300px;
            border: 1px solid black;
            position: relative;
        }
        .son {
            width: 100px;
            height: 100px;
            background: cadetblue;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
        }
        /* 方法三 */
        .father {
            width: 300px;
            height: 300px;
            border: 1px solid black;
            position: relative;
        }
        .son {
            width: 100px;
            height: 100px;
            background: cadetblue;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -50px;
            margin-left: -50px;
        }
        /* 方法四 */
        .father {
            width: 300px;
            height: 300px;
            border: 1px solid black;
            position: relative;
        }
        .son {
            width: 100px;
            height: 100px;
            background: cadetblue;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
        }
```

## 如何形成BFC

```
根元素
float的值不为none
overflow的值不为visible
display的值为inline-block、table-cell、table-caption
position的值为absolute或fixed
```

## 取消页面中选中的文字

```
user-select: none;
/* browser-specific values */
-moz-user-select: none;
-webkit-user-select: none;
-ms-user-select: none;
```

## 为什么伪类的content不能被选

- 伪类不是真正的DOM,无DOM相关的属性和方法

## 背景虚化  filter: blur(5px)



## background-repeat的新属性值：round和space的作用是什么

space 背景图不会产生缩放，会被裁切
round 缩放背景图至容器大小（非等比例缩放）



## 阻止:hover、:active

pointer-events: none

## 图像自适应外框

`object-fit` ，用法类似`background-size`，可选的值：`cover`、`contain`、`fill`等



## 伪元素实现换行

使用`\A `换行，并且指定`white-space: pre`保留换行效果

```
.foo::after {
  content: '123\A 456';
  white-space: pre;
}

css显示a链接的url
content: attr(href);

可以利用 css 的伪类 :hover :active :focus 之类的监听用户行为，然后给指定的url 发送请求。

#link:active::after {

content:url('xxx/xxx?active');

}
```

## box-sizing

这个得根据box-sizing来计算：

1.box-sizing: content-box;
width = width + 2border + 2padding

2.box-sizing: border-box;
width = width
但是元素内部会被压缩，content = width - 2border - 2padding

## 文字模糊
简易实现
color: transparent;
text-shadow: #111 0 0 5px;


## 图片占位
width: 150px;
    height: 100px;
    object-fit: cover;
    object-position: 50% 100%;  // 类似background-position

图片丢失或报错(容错方案)
<img src="test.png" alt="图片描述" onerror="this.classList.add('error');">

img.error {
    position: relative;
    display: inline-block;
}

img.error::before {
    content: "";
    /** 定位代码 **/
    background: url(error-default.png);
}

img.error::after {
    content: attr(alt);
    /** 定位代码 **/
}

## 平滑滚动
scroll-behavior: smooth

使用 scroll-snap-type 优化滚动效果


## 快速选择优化
user-select: all