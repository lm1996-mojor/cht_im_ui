import { trim, deepClone, deepMerge } from '../libs/object';

describe('object utils', () => {
  describe('trim', () => {
    test('should trim both sides by default', () => {
      expect(trim('  hello world  ')).toBe('hello world');
      expect(trim('  test  ')).toBe('test');
      expect(trim('')).toBe('');
    });

    test('should trim left side only', () => {
      expect(trim('  hello world  ', 'left')).toBe('hello world  ');
      expect(trim('   test', 'left')).toBe('test');
    });

    test('should trim right side only', () => {
      expect(trim('  hello world  ', 'right')).toBe('  hello world');
      expect(trim('test   ', 'right')).toBe('test');
    });

    test('should trim all spaces', () => {
      expect(trim('  hello world  ', 'all')).toBe('helloworld');
      expect(trim(' h e l l o ', 'all')).toBe('hello');
    });

    test('should handle numbers', () => {
      expect(trim(123)).toBe('123');
      expect(trim(0)).toBe('0');
    });

    test('should handle edge cases', () => {
      expect(trim('')).toBe('');
      expect(trim('   ')).toBe('');
      expect(trim('no-spaces')).toBe('no-spaces');
    });
  });

  describe('deepClone', () => {
    test('should clone primitive values', () => {
      expect(deepClone(null)).toBe(null);
      expect(deepClone(undefined)).toBe(undefined);
      expect(deepClone(NaN)).toBeNaN();
      expect(deepClone(false)).toBe(false);
      expect(deepClone(123)).toBe(123);
      expect(deepClone('hello')).toBe('hello');
    });

    test('should clone arrays', () => {
      const arr = [1, 2, 3, [4, 5]];
      const cloned = deepClone(arr);

      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
      expect(cloned[3]).not.toBe(arr[3]);
    });

    test('should clone objects', () => {
      const obj = {
        a: 1,
        b: 'hello',
        c: {
          d: 2,
          e: [1, 2, 3],
        },
      };
      const cloned = deepClone(obj);

      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.c).not.toBe(obj.c);
      expect(cloned.c.e).not.toBe(obj.c.e);
    });

    test('should handle complex nested structures', () => {
      const complex = {
        arr: [1, { nested: true }, [2, 3]],
        obj: {
          deep: {
            deeper: {
              value: 'test',
            },
          },
        },
      };
      const cloned = deepClone(complex);

      expect(cloned).toEqual(complex);
      expect(cloned.arr[1]).not.toBe(complex.arr[1]);
      expect(cloned.obj.deep.deeper).not.toBe(complex.obj.deep.deeper);
    });
  });

  describe('deepMerge', () => {
    test('should merge simple objects', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };
      const result = deepMerge(target, source);

      expect(result).toEqual({ a: 1, b: 3, c: 4 });
      expect(result).not.toBe(target);
    });

    test('should merge nested objects', () => {
      const target = {
        a: 1,
        nested: {
          x: 1,
          y: 2,
        },
      };
      const source = {
        nested: {
          y: 3,
          z: 4,
        },
        b: 2,
      };
      const result = deepMerge(target, source);

      expect(result).toEqual({
        a: 1,
        b: 2,
        nested: {
          x: 1,
          y: 3,
          z: 4,
        },
      });
    });

    test('should concatenate arrays', () => {
      const target = { arr: [1, 2] };
      const source = { arr: [3, 4] };
      const result = deepMerge(target, source);

      expect(result).toEqual({ arr: [1, 2, 3, 4] });
    });

    test('should handle non-object inputs', () => {
      expect(deepMerge('string' as any, {})).toBe(false);
      expect(deepMerge({}, 'string' as any)).toBe(false);
      expect(deepMerge(null as any, {})).toBe(false);
    });

    test('should handle empty inputs', () => {
      const target = { a: 1 };
      expect(deepMerge(target, {})).toEqual({ a: 1 });
      expect(deepMerge({}, target)).toEqual({ a: 1 });
    });

    test('should override primitive values with objects', () => {
      const target = { a: 'string' };
      const source = { a: { nested: true } };
      const result = deepMerge(target, source);

      expect(result).toEqual({ a: { nested: true } });
    });
  });
});
