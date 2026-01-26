import $test from './test';
import { trim } from './object';

/**
 * @description 添加单位，如果有rpx，upx，%，px等单位结尾或者值为auto，直接返回，否则加上px单位结尾
 *
 * @param {string|number} value 需要添加单位的值
 * @param {string} unit 添加的单位名，默认：px
 */
export function addUnit(value: string | number = 'auto', unit: string = 'px'): string {
  const newValue = String(value);
  return $test.number(newValue) ? `${newValue}${unit}` : newValue;
}

/**
 * @description 移除单位，如果有 px | rpx | upx | % | em | rem | vw | vh 等单位
 */
export function removeUnit(value: string | number): string {
  const newValue = String(value);
  return $test.number(newValue) ? newValue : newValue.replace(/(px|rpx|upx|%|em|rem|vw|vh)$/, '');
}

/**
 * @description 样式转换，对象转字符串，或者字符串转对象
 *
 * @param {object | string} customStyle 需要转换的目标
 * @param {String} target 转换的目的，object-转为对象，string-转为字符串
 */
// 函数重载：当 target 为 'object' 时，返回对象类型
export function convertStyle(
  customStyle: Record<string, any> | string,
  target: 'object',
): Record<string, any>;

// 函数重载：当 target 为 'string' 时，返回字符串类型
export function convertStyle(customStyle: Record<string, any> | string, target: 'string'): string;

// 函数重载：当 target 为默认值时，返回对象类型
export function convertStyle(customStyle: Record<string, any> | string): Record<string, any>;

// 实际实现
export function convertStyle(
  customStyle: Record<string, any> | string,
  target: 'object' | 'string' = 'object',
): Record<string, any> | string {
  // 处理空值情况
  if (!customStyle) {
    return target === 'object' ? {} : '';
  }

  // 字符串转字符串，对象转对象情形，直接返回
  if (
    (target === 'object' && typeof customStyle === 'object') ||
    (target === 'string' && typeof customStyle === 'string')
  ) {
    return customStyle;
  }

  // 字符串转对象
  if (target === 'object') {
    const trimmedStyle = trim(customStyle as string);
    if (!trimmedStyle) return {};

    const style: Record<string, string> = {};

    trimmedStyle.split(';').forEach((declaration) => {
      const trimmedDeclaration = trim(declaration);
      if (!trimmedDeclaration) return;

      // 找到第一个冒号的位置，支持属性值中包含冒号的情况
      const colonIndex = trimmedDeclaration.indexOf(':');
      if (colonIndex === -1) return;

      const property = trim(trimmedDeclaration.slice(0, colonIndex));
      const value = trim(trimmedDeclaration.slice(colonIndex + 1));

      if (property && value) {
        style[property] = value;
      }
    });

    return style;
  }

  // 对象转字符串形式
  return Object.entries(customStyle as Record<string, any>)
    .map(([key, value]) => {
      // 驼峰转为中划线的形式，否则css内联样式，无法识别驼峰样式属性名
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cssKey}:${value}`;
    })
    .join(';');
}
