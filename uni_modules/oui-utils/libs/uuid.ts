/**
 * 生成随机十六进制字符
 * @param length 长度
 * @returns 随机十六进制字符串
 */
function getRandomHex(length: number): string {
  let result = '';
  const chars = '0123456789abcdef';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * 16)];
  }
  return result;
}

/**
 * 生成UUID v4（符合RFC 4122标准）
 *
 * UUID v4格式: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 * 其中 x 是随机十六进制数字，y 是 8、9、a 或 b 中的一个
 *
 * @returns 返回一个标准的UUID v4字符串
 */
export function generateUUID(): string {
  const part1 = getRandomHex(8);
  const part2 = getRandomHex(4);
  const part3 = '4' + getRandomHex(3); // 版本号4
  const part4 = ['8', '9', 'a', 'b'][Math.floor(Math.random() * 4)] + getRandomHex(3);
  const part5 = getRandomHex(12);

  return `${part1}-${part2}-${part3}-${part4}-${part5}`;
}

/**
 * 生成短UUID（去掉连字符）
 * @returns 返回一个不包含连字符的UUID字符串
 */
export function generateShortUUID(): string {
  return generateUUID().replace(/-/g, '');
}
