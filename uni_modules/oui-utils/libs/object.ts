import $test from './test';

/**
 * @description 去除空格
 */
export function trim(
  str: string | number,
  pos: 'both' | 'left' | 'right' | 'all' = 'both',
): string {
  str = String(str);
  if (pos == 'both') {
    return str.replace(/^\s+|\s+$/g, '');
  }
  if (pos == 'left') {
    return str.replace(/^\s*/, '');
  }
  if (pos == 'right') {
    return str.replace(/(\s*$)/g, '');
  }
  if (pos == 'all') {
    return str.replace(/\s+/g, '');
  }
  return str;
}

/**
 * 内部递归克隆函数
 * @param obj 要克隆的对象
 * @param visited 已访问对象的映射，用于处理循环引用
 */
function cloneRecursive<T>(obj: T, visited: WeakMap<any, any>): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  // 检查循环引用
  if (visited.has(obj as any)) {
    return visited.get(obj as any);
  }

  let cloned: any;

  if (obj instanceof Date) {
    cloned = new Date(obj.getTime());
    visited.set(obj as any, cloned);
  } else if (obj instanceof RegExp) {
    cloned = new RegExp(obj.source, obj.flags);
    visited.set(obj as any, cloned);
  } else if ($test.array(obj)) {
    cloned = [];
    visited.set(obj as any, cloned);
    const arr = obj as any;
    for (let i = 0; i < arr.length; i++) {
      cloned[i] = cloneRecursive(arr[i], visited);
    }
  } else if ($test.object(obj)) {
    cloned = {};
    visited.set(obj as any, cloned);
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = cloneRecursive((obj as any)[key], visited);
      }
    }
  } else {
    return obj;
  }

  return cloned as T;
}

/**
 * @description 深度克隆对象
 * @param {T} obj 需要深度克隆的值，可以是任何类型
 * @returns {T} 克隆后的对象或者原值（原始类型）
 *
 * @example
 * const original = { a: 1, b: { c: 2 }, d: [1, 2, 3] };
 * const cloned = deepClone(original);
 * cloned.b.c = 999;
 * console.log(original.b.c); // 2 (原对象未被修改)
 *
 * @example
 * // 处理循环引用
 * const obj: any = { a: 1 };
 * obj.self = obj;
 * const cloned = deepClone(obj); // 不会无限递归
 */
export function deepClone<T>(obj: T): T {
  return cloneRecursive(obj, new WeakMap());
}

/**
 * @description JS对象深度合并
 * @param {Record<string, any>} target 目标对象，默认为空对象
 * @param {Record<string, any>} source 源对象，默认为空对象
 * @returns {T | false} 合并后的对象，如果输入参数无效则返回 false
 *
 * @example
 * const target = { a: 1, b: { c: 2 } };
 * const source = { b: { d: 3 }, e: 4 };
 * const result = deepMerge(target, source);
 * // result: { a: 1, b: { c: 2, d: 3 }, e: 4 }
 *
 * @example
 * // 数组合并
 * const target = { arr: [1, 2] };
 * const source = { arr: [3, 4] };
 * const result = deepMerge(target, source);
 * // result: { arr: [1, 2, 3, 4] }
 */
export function deepMerge<T extends Record<string, any>>(
  target: Record<string, any> = {},
  source: Record<string, any> = {},
): T | false {
  // 检查输入参数的有效性，确保都是普通对象
  if (!$test.object(target) || !$test.object(source)) {
    return false;
  }

  // 深克隆目标对象，避免修改原对象
  const result = deepClone(target);

  // 遍历源对象的所有可枚举属性
  for (const key in source) {
    // 使用安全的属性检查方法
    if (!Object.prototype.hasOwnProperty.call(source, key)) {
      continue;
    }

    const sourceValue = source[key];
    const targetValue = result[key];

    // 如果源值和目标值都是数组，则合并数组
    if ($test.array(sourceValue) && $test.array(targetValue)) {
      result[key] = [...targetValue, ...sourceValue];
    }
    // 如果源值和目标值都是对象，则递归合并
    else if ($test.object(sourceValue) && $test.object(targetValue)) {
      const mergedValue = deepMerge(targetValue, sourceValue);
      // 处理递归调用可能返回 false 的情况
      if (mergedValue === false) {
        result[key] = deepClone(sourceValue);
      } else {
        result[key] = mergedValue;
      }
    }
    // 其他情况直接覆盖，并深克隆以避免引用问题
    else {
      result[key] = deepClone(sourceValue);
    }
  }

  return result as T;
}
