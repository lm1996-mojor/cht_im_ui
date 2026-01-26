# vconsole-uni

一个面向 UniApp 的可视化调试面板，提供日志捕获、网络请求抓取、存储查看与系统信息展示，内置悬浮按钮，随时唤起调试界面。

## 特性

- 日志：捕获 `console.log/debug/warn/error`
- 网络：自动抓取请求与响应，方法/状态/耗时、请求/响应头体等
- 存储：查看本地存储项
- 系统：设备与 App 信息概览

## 安装

```bash
# 通过 uni_modules 安装（推荐）
# 直接将 vconsole-uni 文件夹放入 src/uni_modules/ 目录下即可
```

## 快速开始

1. 初始化调试捕获（在 `main.ts` 中调用）

```ts
// main.ts
import { initVConsole } from '@/uni_modules/vconsole-uni';

// 仅在开发环境启用（示例，视项目构建环境而定）
initVConsole({
  enableDebug: true, // 生产建议设为 false 或使用环境变量控制
  maxLogNumber: 1000, // 保留日志条数（默认 1000）
  maxNetNumber: 1000, // 保留网络记录条数（默认 1000）
});
```

2. 挂载 UI 组件（建议在 `App.uvue` 或全局入口处）

```vue
<template>
  <VconsoleUni />
</template>

<script lang="ts" setup></script>
```

## API

- `initVConsole(options?: VConsoleOptions): void`
  - `enableDebug?: boolean` 是否启用调试（默认 `true`；为 `false` 时不初始化）
  - `maxLogNumber?: number` 内存中保留的最大日志条数（默认 `1000`）
  - `maxNetNumber?: number` 内存中保留的最大网络记录条数（默认 `1000`）

## 最佳实践

- 仅在开发/测试环境启用：`initVConsole({ enableDebug: import.meta.env?.DEV === true })`
- 生产环境禁用或按需开关，避免额外的运行时开销
- 若未捕获到网络请求，请确认初始化在应用启动阶段调用（尽量靠前）
