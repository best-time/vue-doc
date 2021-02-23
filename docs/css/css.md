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

