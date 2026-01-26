# oui-utils

OUI 工具包 - 一个功能丰富的 TypeScript 工具库，提供了一些常用的工具函数，如对象操作、样式处理、数据验证等。

## 特性

- **TypeScript 支持** - 完整的类型定义，提供优秀的开发体验
- **轻量级** - 按需导入，不会增加不必要的包体积
- **功能丰富** - 涵盖对象操作、样式处理、数据验证等常用场景
- **uni-app 优化** - 专为 uni-app 项目设计，支持多端运行
- **类型安全** - 使用 TypeScript 类型保护，减少运行时错误

## 兼容性

### 平台支持

- H5
- 小程序（微信/支付宝/百度/字节跳动/QQ/钉钉/快手/飞书/京东）
- App (Vue/nvue/uvue)
- 快应用

### 框架支持

- Vue 2
- Vue 3

## 安装

```bash
# 通过 uni_modules 安装
# 将 oui-utils 文件夹放入项目的 uni_modules 目录中
```

## 快速开始

```typescript
import { trim } from '@/uni_modules/oui-utils';
```

## API 文档

### 对象工具

#### `trim(str, pos?)`

去除字符串空格

**参数：**

- `str: string | number` - 需要去除空格的字符串
- `pos?: 'both' | 'left' | 'right' | 'all'` - 去除位置，默认 'both'

**返回值：** `string`

```typescript
trim('  hello world  '); // 'hello world'
trim('  hello world  ', 'left'); // 'hello world  '
trim('  hello world  ', 'right'); // '  hello world'
trim('  hello world  ', 'all'); // 'helloworld'
```

#### `deepClone<T>(obj)`

深度克隆对象

**参数：**

- `obj: T` - 需要深度克隆的对象

**返回值：** `T`

```typescript
const original = { a: 1, b: { c: 2 } };
const cloned = deepClone(original);
cloned.b.c = 3;
console.log(original.b.c); // 2 (原对象未被修改)
```

#### `deepMerge<T>(target?, source?)`

深度合并对象

**参数：**

- `target?: T` - 目标对象，默认 `{}`
- `source?: Partial<T>` - 源对象，默认 `{}`

**返回值：** `T | false`

```typescript
const target = { a: 1, b: { c: 2 } };
const source = { b: { d: 3 }, e: 4 };
const result = deepMerge(target, source);
// result: { a: 1, b: { c: 2, d: 3 }, e: 4 }
```

### 样式工具

#### `addUnit(value?, unit?)`

为数值添加单位

**参数：**

- `value?: string | number` - 需要添加单位的值，默认 'auto'
- `unit?: string` - 单位名称，默认 'px'

**返回值：** `string`

```typescript
addUnit(20); // '20px'
addUnit(20, 'rem'); // '20rem'
addUnit('auto'); // 'auto'
addUnit('20px'); // '20px' (已有单位，直接返回)
```

#### `removeUnit(value)`

移除数值单位

**参数：**

- `value: string | number` - 需要移除单位的值

**返回值：** `string`

```typescript
removeUnit('20px'); // '20'
removeUnit('1.5rem'); // '1.5'
removeUnit(20); // '20'
```

#### `convertStyle(customStyle, target?)`

样式格式转换（对象 ↔ 字符串）

**参数：**

- `customStyle: Record<string, any> | string` - 需要转换的样式
- `target?: 'object' | 'string'` - 转换目标，默认 'object'

**返回值：** `Record<string, any> | string`

```typescript
// 字符串转对象
convertStyle('color: red; font-size: 14px');
// { color: 'red', 'font-size': '14px' }

// 对象转字符串
convertStyle({ color: 'red', fontSize: '14px' }, 'string');
// 'color:red;font-size:14px;'
```

### 验证工具

#### 基础验证

```typescript
test.email('test@example.com'); // true - 验证邮箱格式
test.mobile('13800138000'); // true - 验证手机号格式
test.url('https://example.com'); // true - 验证URL格式
test.number('123.45'); // true - 验证数字格式
test.string('hello'); // true - 验证字符串类型
test.digits('123'); // true - 验证整数
test.empty(''); // true - 空验证：空字符串、空格字符串、空数组、空对象、NaN、null、undefined
```

#### 身份验证

```typescript
test.idCard('110101199001011234'); // true - 验证身份证号
test.carNo('京A12345'); // true - 验证车牌号
test.landline('010-12345678'); // true - 验证固定电话
test.code('123456'); // true - 验证验证码(默认6位)
test.code('1234', 4); // true - 验证4位验证码
```

#### 内容验证

```typescript
test.chinese('中文'); // true - 验证中文字符
test.letter('abc'); // true - 验证字母
test.enOrNum('abc123'); // true - 验证字母或数字
test.amount('123.45'); // true - 验证金额格式
```

#### 日期验证

```typescript
test.date('2023-12-01'); // true - 验证日期格式
test.dateISO('2023/12/01'); // true - 验证ISO日期格式
```

#### 范围验证

```typescript
test.range(5, [1, 10]); // true - 验证数值范围
test.rangeLength('hello', [3, 10]); // true - 验证长度范围
test.contains('hello world', 'world'); // true - 验证包含关系
```

#### 类型验证

```typescript
test.array([1, 2, 3]); // true - 验证数组类型
test.object({ a: 1 }); // true - 验证对象类型
test.func(() => {}); // true - 验证函数类型
test.promise(Promise.resolve()); // true - 验证Promise类型
test.regExp(/test/); // true - 验证正则表达式
test.def(null); // false - 验证非 null、undefined 值
```

#### 文件类型验证

```typescript
test.image('photo.jpg'); // true - 验证图片格式
test.video('movie.mp4'); // true - 验证视频格式
test.jsonString('{"a": 1}'); // true - 验证JSON字符串
```

### UUID 工具

#### `generateUUID()`

生成 UUID

**返回值：** `string`

```typescript
generateUUID(); // '123e4567-e89b-12d3-a456-426614174000'
```

#### `generateShortUUID()`

生成短 UUID

**返回值：** `string`

```typescript
generateShortUUID(); // '123e4567e89b12d3a456426614174000'
```
