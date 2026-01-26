import $test from '../libs/test';

describe('test utils', () => {
  describe('email validation', () => {
    test('should validate correct email formats', () => {
      expect($test.email('test@example.com')).toBe(true);
      expect($test.email('user.name@domain.co.uk')).toBe(true);
      expect($test.email('user+tag@example.org')).toBe(true);
      expect($test.email('123@test.com')).toBe(true);
    });

    test('should reject invalid email formats', () => {
      expect($test.email('invalid-email')).toBe(false);
      expect($test.email('@example.com')).toBe(false);
      expect($test.email('test@')).toBe(false);
      expect($test.email('test.example.com')).toBe(false);
      expect($test.email('')).toBe(false);
    });
  });

  describe('mobile validation', () => {
    test('should validate correct mobile numbers', () => {
      expect($test.mobile('13812345678')).toBe(true);
      expect($test.mobile('15987654321')).toBe(true);
      expect($test.mobile('18612345678')).toBe(true);
    });

    test('should reject invalid mobile numbers', () => {
      expect($test.mobile('12812345678')).toBe(false);
      expect($test.mobile('1381234567')).toBe(false);
      expect($test.mobile('138123456789')).toBe(false);
      expect($test.mobile('abcdefghijk')).toBe(false);
      expect($test.mobile('')).toBe(false);
    });
  });

  describe('url validation', () => {
    test('should validate correct URLs', () => {
      expect($test.url('https://www.example.com')).toBe(true);
      expect($test.url('http://example.com')).toBe(true);
      expect($test.url('ftp://files.example.com')).toBe(true);
      expect($test.url('https://sub.domain.com/path?query=1')).toBe(true);
    });

    test('should reject invalid URLs', () => {
      expect($test.url('not-a-url')).toBe(false);
      expect($test.url('www.example.com')).toBe(false);
      expect($test.url('example.com')).toBe(false);
      expect($test.url('')).toBe(false);
    });
  });

  describe('number validation', () => {
    test('should validate numbers', () => {
      expect($test.number('123')).toBe(true);
      expect($test.number('123.45')).toBe(true);
      expect($test.number('-123')).toBe(true);
      expect($test.number('+123.45')).toBe(true);
      expect($test.number('.5')).toBe(true);
      expect($test.number(123)).toBe(true);
    });

    test('should reject non-numbers', () => {
      expect($test.number('abc')).toBe(false);
      expect($test.number('12a')).toBe(false);
      expect($test.number('')).toBe(false);
      expect($test.number('.')).toBe(false);
    });
  });

  describe('string validation', () => {
    test('should validate strings', () => {
      expect($test.string('hello')).toBe(true);
      expect($test.string('')).toBe(true);
      expect($test.string('123')).toBe(true);
    });

    test('should reject non-strings', () => {
      expect($test.string(123)).toBe(false);
      expect($test.string(null)).toBe(false);
      expect($test.string(undefined)).toBe(false);
      expect($test.string({})).toBe(false);
      expect($test.string([])).toBe(false);
    });
  });

  describe('array validation', () => {
    test('should validate arrays', () => {
      expect($test.array([])).toBe(true);
      expect($test.array([1, 2, 3])).toBe(true);
      expect($test.array(['a', 'b'])).toBe(true);
      expect($test.array([{}, []])).toBe(true);
    });

    test('should reject non-arrays', () => {
      expect($test.array({})).toBe(false);
      expect($test.array('string')).toBe(false);
      expect($test.array(123)).toBe(false);
      expect($test.array(null)).toBe(false);
      expect($test.array(undefined)).toBe(false);
    });
  });

  describe('object validation', () => {
    test('should validate objects', () => {
      expect($test.object({})).toBe(true);
      expect($test.object({ a: 1 })).toBe(true);
      expect($test.object({ nested: { obj: true } })).toBe(true);
    });

    test('should reject non-objects', () => {
      expect($test.object([])).toBe(false);
      expect($test.object('string')).toBe(false);
      expect($test.object(123)).toBe(false);
      expect($test.object(null)).toBe(false);
      expect($test.object(undefined)).toBe(false);
    });
  });

  describe('function validation', () => {
    test('should validate functions', () => {
      expect($test.func(() => {})).toBe(true);
      expect($test.func(function () {})).toBe(true);
      expect($test.func(Math.max)).toBe(true);
    });

    test('should reject non-functions', () => {
      expect($test.func({})).toBe(false);
      expect($test.func('string')).toBe(false);
      expect($test.func(123)).toBe(false);
      expect($test.func(null)).toBe(false);
    });
  });

  describe('promise validation', () => {
    test('should validate promises', () => {
      expect($test.promise(Promise.resolve())).toBe(true);
      expect($test.promise((async () => {})())).toBe(true);
    });

    test('should reject non-promises', () => {
      expect($test.promise('string')).toBe(false);
      expect($test.promise({})).toBe(false);
      expect($test.promise({ then: () => {} })).toBe(false);
    });
  });

  describe('chinese validation', () => {
    test('should validate Chinese characters', () => {
      expect($test.chinese('中文')).toBe(true);
      expect($test.chinese('测试')).toBe(true);
      expect($test.chinese('你好世界')).toBe(true);
    });

    test('should reject non-Chinese text', () => {
      expect($test.chinese('hello')).toBe(false);
      expect($test.chinese('中文hello')).toBe(false);
      expect($test.chinese('123')).toBe(false);
      expect($test.chinese('')).toBe(false);
    });
  });

  describe('range validation', () => {
    test('should validate values in range', () => {
      expect($test.range(5, [1, 10])).toBe(true);
      expect($test.range(1, [1, 10])).toBe(true);
      expect($test.range(10, [1, 10])).toBe(true);
    });

    test('should reject values out of range', () => {
      expect($test.range(0, [1, 10])).toBe(false);
      expect($test.range(11, [1, 10])).toBe(false);
      expect($test.range(-5, [1, 10])).toBe(false);
    });
  });

  describe('rangeLength validation', () => {
    test('should validate string length in range', () => {
      expect($test.rangeLength('hello', [3, 10])).toBe(true);
      expect($test.rangeLength('hi', [2, 5])).toBe(true);
      expect($test.rangeLength('test', [4, 4])).toBe(true);
    });

    test('should validate array length in range', () => {
      expect($test.rangeLength([1, 2, 3], [2, 5])).toBe(true);
      expect($test.rangeLength([], [0, 2])).toBe(true);
    });

    test('should reject length out of range', () => {
      expect($test.rangeLength('hi', [3, 10])).toBe(false);
      expect($test.rangeLength('very long string', [1, 5])).toBe(false);
      expect($test.rangeLength([1, 2, 3, 4, 5, 6], [1, 3])).toBe(false);
    });
  });

  describe('jsonString validation', () => {
    test('should validate JSON strings', () => {
      expect($test.jsonString('{"key": "value"}')).toBe(true);
      expect($test.jsonString('[1, 2, 3]')).toBe(true);
      expect($test.jsonString('{"nested": {"obj": true}}')).toBe(true);
    });

    test('should reject invalid JSON strings', () => {
      expect($test.jsonString('not json')).toBe(false);
      expect($test.jsonString('{key: value}')).toBe(false);
      expect($test.jsonString('{"incomplete":')).toBe(false);
      expect($test.jsonString('')).toBe(false);
    });
  });

  describe('nullish validation', () => {
    test('should validate null and undefined', () => {
      expect($test.nullish(null)).toBe(true);
      expect($test.nullish(undefined)).toBe(true);
    });

    test('should reject non-nullish values', () => {
      expect($test.nullish('')).toBe(false);
      expect($test.nullish(0)).toBe(false);
      expect($test.nullish(false)).toBe(false);
      expect($test.nullish([])).toBe(false);
      expect($test.nullish({})).toBe(false);
      expect($test.nullish('null')).toBe(false);
      expect($test.nullish(NaN)).toBe(false);
    });
  });

  describe('emptyString validation', () => {
    test('should validate empty strings', () => {
      expect($test.emptyString('')).toBe(true);
    });

    test('should reject non-empty strings and non-strings', () => {
      expect($test.emptyString(' ')).toBe(false);
      expect($test.emptyString('hello')).toBe(false);
      expect($test.emptyString('0')).toBe(false);
      expect($test.emptyString(null)).toBe(false);
      expect($test.emptyString(undefined)).toBe(false);
      expect($test.emptyString(0)).toBe(false);
      expect($test.emptyString([])).toBe(false);
      expect($test.emptyString({})).toBe(false);
    });
  });

  describe('whitespaceString validation', () => {
    test('should validate whitespace-only strings', () => {
      expect($test.whitespaceString(' ')).toBe(true);
      expect($test.whitespaceString('  ')).toBe(true);
      expect($test.whitespaceString('\t')).toBe(true);
      expect($test.whitespaceString('\n')).toBe(true);
      expect($test.whitespaceString(' \t\n ')).toBe(true);
    });

    test('should reject empty strings, non-whitespace strings and non-strings', () => {
      expect($test.whitespaceString('')).toBe(false);
      expect($test.whitespaceString('hello')).toBe(false);
      expect($test.whitespaceString(' hello ')).toBe(false);
      expect($test.whitespaceString('0')).toBe(false);
      expect($test.whitespaceString(null)).toBe(false);
      expect($test.whitespaceString(undefined)).toBe(false);
      expect($test.whitespaceString(0)).toBe(false);
      expect($test.whitespaceString([])).toBe(false);
      expect($test.whitespaceString({})).toBe(false);
    });
  });

  describe('emptyArray validation', () => {
    test('should validate empty arrays', () => {
      expect($test.emptyArray([])).toBe(true);
    });

    test('should reject non-empty arrays and non-arrays', () => {
      expect($test.emptyArray([1])).toBe(false);
      expect($test.emptyArray([1, 2, 3])).toBe(false);
      expect($test.emptyArray([''])).toBe(false);
      expect($test.emptyArray([null])).toBe(false);
      expect($test.emptyArray([undefined])).toBe(false);
      expect($test.emptyArray({})).toBe(false);
      expect($test.emptyArray('')).toBe(false);
      expect($test.emptyArray(null)).toBe(false);
      expect($test.emptyArray(undefined)).toBe(false);
      expect($test.emptyArray(0)).toBe(false);
    });
  });

  describe('emptyObject validation', () => {
    test('should validate empty plain objects', () => {
      expect($test.emptyObject({})).toBe(true);
    });

    test('should reject non-empty objects and non-plain-objects', () => {
      expect($test.emptyObject({ a: 1 })).toBe(false);
      expect($test.emptyObject({ a: undefined })).toBe(false);
      expect($test.emptyObject([])).toBe(false);
      expect($test.emptyObject(new Date())).toBe(false);
      expect($test.emptyObject(new RegExp(''))).toBe(false);
      expect($test.emptyObject(null)).toBe(false);
      expect($test.emptyObject(undefined)).toBe(false);
      expect($test.emptyObject('')).toBe(false);
      expect($test.emptyObject(0)).toBe(false);
      expect($test.emptyObject(function() {})).toBe(false);
    });
  });

  describe('nan validation', () => {
    test('should validate NaN', () => {
      expect($test.nan(NaN)).toBe(true);
      expect($test.nan(Number.NaN)).toBe(true);
      expect($test.nan(0 / 0)).toBe(true);
      expect($test.nan(parseInt('abc'))).toBe(true);
    });

    test('should reject non-NaN values', () => {
      expect($test.nan(0)).toBe(false);
      expect($test.nan(1)).toBe(false);
      expect($test.nan(-1)).toBe(false);
      expect($test.nan(Infinity)).toBe(false);
      expect($test.nan(-Infinity)).toBe(false);
      expect($test.nan('NaN')).toBe(false);
      expect($test.nan(null)).toBe(false);
      expect($test.nan(undefined)).toBe(false);
      expect($test.nan('')).toBe(false);
      expect($test.nan([])).toBe(false);
      expect($test.nan({})).toBe(false);
    });
  });

  describe('empty validation (comprehensive)', () => {
    test('should validate all empty values', () => {
      // nullish values
      expect($test.empty(null)).toBe(true);
      expect($test.empty(undefined)).toBe(true);
      
      // NaN
      expect($test.empty(NaN)).toBe(true);
      
      // empty strings
      expect($test.empty('')).toBe(true);
      
      // whitespace strings
      expect($test.empty(' ')).toBe(true);
      expect($test.empty('  ')).toBe(true);
      expect($test.empty('\t')).toBe(true);
      expect($test.empty('\n')).toBe(true);
      expect($test.empty(' \t\n ')).toBe(true);
      
      // empty arrays
      expect($test.empty([])).toBe(true);
      
      // empty objects
      expect($test.empty({})).toBe(true);
    });

    test('should reject non-empty values', () => {
      // numbers (including 0)
      expect($test.empty(0)).toBe(false);
      expect($test.empty(1)).toBe(false);
      expect($test.empty(-1)).toBe(false);
      expect($test.empty(Infinity)).toBe(false);
      
      // booleans
      expect($test.empty(false)).toBe(false);
      expect($test.empty(true)).toBe(false);
      
      // non-empty strings
      expect($test.empty('hello')).toBe(false);
      expect($test.empty('0')).toBe(false);
      expect($test.empty(' hello ')).toBe(false);
      
      // non-empty arrays
      expect($test.empty([1])).toBe(false);
      expect($test.empty([''])).toBe(false);
      expect($test.empty([null])).toBe(false);
      
      // non-empty objects
      expect($test.empty({ a: 1 })).toBe(false);
      expect($test.empty({ a: undefined })).toBe(false);
      
      // special objects
      expect($test.empty(new Date())).toBe(false);
      expect($test.empty(new RegExp(''))).toBe(false);
      expect($test.empty(function() {})).toBe(false);
    });
  });
});
