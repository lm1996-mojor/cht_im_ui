/**
 * @description 验证电子邮箱格式
 */
function email(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * @description 验证手机格式
 */
function mobile(value: string): boolean {
  return /^1([3589]\d|4[5-9]|6[1-2,4-7]|7[0-8])\d{8}$/.test(value);
}

/**
 * @description 验证URL格式
 */
function url(value: string): boolean {
  return /^((https|http|ftp|rtsp|mms):\/\/)(([0-9a-zA-Z_!~*'().&=+$%-]+: )?[0-9a-zA-Z_!~*'().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-zA-Z_!~*'()-]+.)*([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z].[a-zA-Z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+\/?)$/.test(
    value,
  );
}

/**
 * @description 验证日期格式
 */
function date(value: string | number | Date): boolean {
  if (!value) {
    return false;
  }

  // 判断是否数值或者字符串数值(意味着为时间戳)，转为数值，否则new Date无法识别字符串时间戳
  if (number(value as string)) value = +value;
  return !/Invalid|NaN/.test(new Date(value).toString());
}

/**
 * @description 验证ISO类型的日期格式
 */
function dateISO(value: string): boolean {
  return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value);
}

/**
 * @description 验证十进制数字
 */
function number(value: string | number): boolean {
  return /^[\+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/.test(String(value));
}

/**
 * @description 验证字符串
 */
function string(value: any): boolean {
  return typeof value === 'string';
}

/**
 * @description 验证整数
 */
function digits(value: string | number): boolean {
  return /^\d+$/.test(String(value));
}

/**
 * @description 验证身份证号码
 */
function idCard(value: string): boolean {
  return /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value);
}

/**
 * @description 是否车牌号
 */
function carNo(value: string): boolean {
  // 新能源车牌
  const xreg =
    /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
  // 旧车牌
  const creg =
    /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
  if (value.length === 7) {
    return creg.test(value);
  }
  if (value.length === 8) {
    return xreg.test(value);
  }
  return false;
}

/**
 * @description 金额,只允许2位小数
 */
function amount(value: string | number): boolean {
  // 金额，只允许保留两位小数
  return /^[1-9]\d*(,\d{3})*(\.\d{1,2})?$|^0\.\d{1,2}$/.test(String(value));
}

/**
 * @description 中文
 */
function chinese(value: string): boolean {
  const reg = /^[\u4e00-\u9fa5]+$/gi;
  return reg.test(value);
}

/**
 * @description 只能输入字母
 */
function letter(value: string): boolean {
  return /^[a-zA-Z]*$/.test(value);
}

/**
 * @description 只能是字母或者数字
 */
function enOrNum(value: string): boolean {
  // 英文或者数字
  const reg = /^[0-9a-zA-Z]*$/g;
  return reg.test(value);
}

/**
 * @description 验证是否包含某个值
 */
function contains(value: string, param: string): boolean {
  return value.indexOf(param) >= 0;
}

/**
 * @description 验证一个值范围[min, max]
 */
function range(value: number, param: [number, number]): boolean {
  return value >= param[0] && value <= param[1];
}

/**
 * @description 验证一个长度范围[min, max]
 */
function rangeLength(value: string | any[], param: [number, number]): boolean {
  return value.length >= param[0] && value.length <= param[1];
}

/**
 * @description 是否固定电话
 */
function landline(value: string): boolean {
  const reg = /^\d{3,4}-\d{7,8}(-\d{3,4})?$/;
  return reg.test(value);
}

/**
 * @description 是否json字符串
 */
function jsonString(value: string): boolean {
  if (typeof value === 'string') {
    try {
      const obj = JSON.parse(value);
      if (typeof obj === 'object' && obj) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
  return false;
}

/**
 * @description 是否数组
 */
function array(value: any): boolean {
  if (typeof Array.isArray === 'function') {
    return Array.isArray(value);
  }
  return Object.prototype.toString.call(value) === '[object Array]';
}

/**
 * @description 是否对象
 */
function object(value: any): boolean {
  return Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * @description 是否短信验证码
 */
function code(value: string | number, len: number = 6): boolean {
  return new RegExp(`^\\d{${len}}$`).test(String(value));
}

/**
 * @description 是否函数方法
 */
function func(value: any): boolean {
  return typeof value === 'function';
}

/**
 * @description 是否promise对象
 */
function promise(value: any): boolean {
  return Object.prototype.toString.call(value) === '[object Promise]';
}

/**
 * @description 是否图片格式
 */
function image(value: string): boolean {
  const newValue = value.split('?')[0];
  const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i;
  return IMAGE_REGEXP.test(newValue);
}

/**
 * @description 是否视频格式
 */
function video(value: string): boolean {
  const VIDEO_REGEXP = /\.(mp4|mpg|mpeg|dat|asf|avi|rm|rmvb|mov|wmv|flv|mkv|m3u8)/i;
  return VIDEO_REGEXP.test(value);
}

/**
 * @description 是否为正则对象
 */
function regExp(value: any): boolean {
  return Object.prototype.toString.call(value) === '[object RegExp]';
}

/**
 * @description 是否定义
 */
function def(value: any): boolean {
  return value !== undefined && value !== null;
}

/**
 * @description 是否为null或undefined
 */
function nullish(value: any): boolean {
  return value === null || value === undefined;
}

/**
 * @description 是否为空字符串
 */
function emptyString(value: any): boolean {
  return typeof value === 'string' && value === '';
}

/**
 * @description 是否为只包含空白字符的字符串
 */
function whitespaceString(value: any): boolean {
  return typeof value === 'string' && value.trim() === '' && value !== '';
}

/**
 * @description 是否为空数组
 */
function emptyArray(value: any): boolean {
  return Array.isArray(value) && value.length === 0;
}

/**
 * @description 是否为空对象
 */
function emptyObject(value: any): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    value.constructor === Object &&
    Object.keys(value).length === 0
  );
}

/**
 * @description 是否为NaN
 */
function nan(value: any): boolean {
  return typeof value === 'number' && isNaN(value);
}

/**
 * @description 是否为空
 */
function empty(value: any): boolean {
  return (
    nullish(value) ||
    nan(value) ||
    emptyString(value) ||
    whitespaceString(value) ||
    emptyArray(value) ||
    emptyObject(value)
  );
}

export default {
  email,
  mobile,
  url,
  date,
  dateISO,
  number,
  digits,
  idCard,
  carNo,
  amount,
  chinese,
  letter,
  enOrNum,
  contains,
  range,
  rangeLength,
  jsonString,
  landline,
  object,
  array,
  code,
  func,
  promise,
  video,
  image,
  regExp,
  string,
  def,
  empty,
  nullish,
  emptyString,
  whitespaceString,
  emptyArray,
  emptyObject,
  nan,
};
