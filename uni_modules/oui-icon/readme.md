# oui-icon

一个功能丰富的字体图标库，基于 iconfont 字体文件，提供了丰富的图标资源。

## 特性

- **丰富图标库**：包含 600+ 个精美图标，涵盖常用场景
- **多端兼容**：支持 uni-app 全平台（H5、小程序、App）
- **灵活配置**：支持自定义大小、颜色、样式
- **图片支持**：除字体图标外，还支持图片图标
- **轻量高效**：基于字体文件，体积小，渲染快
- **易于使用**：简单的 API 设计，开箱即用

## 安装

```bash
# 通过 uni_modules 安装（推荐）
# 直接将 oui-icon 文件夹放入 src/uni_modules/ 目录下即可
```

## 基础用法

### 字体图标

```vue
<template>
  <view>
    <!-- 基础用法 -->
    <oui-icon name="home" />

    <!-- 自定义大小和颜色 -->
    <oui-icon name="heart" size="24" color="#ff4757" />
  </view>
</template>
```

### 图片图标

```vue
<template>
  <view>
    <!-- 使用图片路径 -->
    <oui-icon name="/static/icons/custom-icon.png" size="24" />
  </view>
</template>
```

### 事件处理

```vue
<template>
  <view>
    <oui-icon name="setting" @click="handleClick" />
  </view>
</template>

<script setup>
const handleClick = (event) => {
  console.log('图标被点击了', event);
};
</script>
```

## API

### Props

| 参数        | 类型             | 默认值   | 说明                               |
| ----------- | ---------------- | -------- | ---------------------------------- |
| name        | String           | -        | 图标名称或图片路径（必填）         |
| size        | String \| Number | 16       | 图标大小，支持数字或带单位的字符串 |
| color       | String           | #000000  | 图标颜色                           |
| classPrefix | String           | oui-icon | 图标类名前缀，用于自定义图标       |
| customClass | String           | -        | 自定义类名                         |
| customStyle | String           | -        | 自定义样式                         |

### Events

| 事件名 | 说明           | 回调参数     |
| ------ | -------------- | ------------ |
| click  | 点击图标时触发 | event: unknown |

## 图标列表

### 常用图标

```vue
<!-- 基础图标 -->
<oui-icon name="home" />
<!-- 首页 -->
<oui-icon name="user" />
<!-- 用户 -->
<oui-icon name="setting" />
<!-- 设置 -->
<oui-icon name="search" />
<!-- 搜索 -->
<oui-icon name="heart" />
<!-- 喜欢 -->
<oui-icon name="star" />
<!-- 星标 -->
<oui-icon name="location" />
<!-- 位置 -->
<oui-icon name="phone" />
<!-- 电话 -->
<oui-icon name="mail" />
<!-- 邮件 -->
<oui-icon name="camera" />
<!-- 相机 -->

<!-- 方向图标 -->
<oui-icon name="left" />
<!-- 左箭头 -->
<oui-icon name="right" />
<!-- 右箭头 -->
<oui-icon name="up" />
<!-- 上箭头 -->
<oui-icon name="down" />
<!-- 下箭头 -->

<!-- 操作图标 -->
<oui-icon name="plus" />
<!-- 加号 -->
<oui-icon name="minus" />
<!-- 减号 -->
<oui-icon name="close" />
<!-- 关闭 -->
<oui-icon name="check" />
<!-- 勾选 -->
<oui-icon name="edit" />
<!-- 编辑 -->
<oui-icon name="delete" />
<!-- 删除 -->
```

### 社交图标

```vue
<oui-icon name="wechat" />
<!-- 微信 -->
<oui-icon name="qq" />
<!-- QQ -->
<oui-icon name="weibo" />
<!-- 微博 -->
<oui-icon name="alipay" />
<!-- 支付宝 -->
<oui-icon name="facebook" />
<!-- Facebook -->
<oui-icon name="twitter" />
<!-- Twitter -->
<oui-icon name="linkedin" />
<!-- LinkedIn -->
<oui-icon name="github" />
<!-- GitHub -->
```

### 文件图标

```vue
<oui-icon name="file" />
<!-- 文件 -->
<oui-icon name="folder" />
<!-- 文件夹 -->
<oui-icon name="file-text" />
<!-- 文本文件 -->
<oui-icon name="file-pdf" />
<!-- PDF文件 -->
<oui-icon name="file-excel" />
<!-- Excel文件 -->
<oui-icon name="file-word" />
<!-- Word文件 -->
<oui-icon name="file-ppt" />
<!-- PPT文件 -->
<oui-icon name="file-image" />
<!-- 图片文件 -->
```

> 💡 **提示**：组件包含 600+ 个图标，完整图标列表请查看 `components/oui-icon/icons.scss` 文件，或在项目中使用开发者工具查看所有可用图标类名。
