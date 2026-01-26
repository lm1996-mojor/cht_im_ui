import { addUnit, removeUnit, convertStyle } from '../libs/style';

describe('style utils', () => {
  describe('addUnit', () => {
    test('should add px unit to numbers', () => {
      expect(addUnit(100)).toBe('100px');
      expect(addUnit('100')).toBe('100px');
      expect(addUnit(0)).toBe('0px');
    });

    test('should add custom unit', () => {
      expect(addUnit(100, 'rem')).toBe('100rem');
      expect(addUnit('50', 'vh')).toBe('50vh');
    });

    test('should not add unit to values with existing units', () => {
      expect(addUnit('100px')).toBe('100px');
      expect(addUnit('50rpx')).toBe('50rpx');
      expect(addUnit('100%')).toBe('100%');
      expect(addUnit('auto')).toBe('auto');
    });

    test('should handle edge cases', () => {
      expect(addUnit()).toBe('auto');
      expect(addUnit('')).toBe('');
      expect(addUnit('inherit')).toBe('inherit');
    });
  });

  describe('removeUnit', () => {
    test('should remove common units', () => {
      expect(removeUnit('100px')).toBe('100');
      expect(removeUnit('50rpx')).toBe('50');
      expect(removeUnit('75%')).toBe('75');
      expect(removeUnit('2em')).toBe('2');
      expect(removeUnit('1.5rem')).toBe('1.5');
      expect(removeUnit('100vw')).toBe('100');
      expect(removeUnit('50vh')).toBe('50');
    });

    test('should handle numbers without units', () => {
      expect(removeUnit(100)).toBe('100');
      expect(removeUnit('100')).toBe('100');
    });

    test('should handle values without units', () => {
      expect(removeUnit('auto')).toBe('auto');
      expect(removeUnit('inherit')).toBe('inherit');
    });
  });

  describe('convertStyle', () => {
    describe('string to object conversion', () => {
      test('should convert simple style string to object', () => {
        const styleString = 'color: red; font-size: 14px';
        const result = convertStyle(styleString, 'object');

        expect(result).toEqual({
          color: 'red',
          'font-size': '14px',
        });
      });

      test('should handle style string with extra spaces', () => {
        const styleString = '  color : red ;  font-size : 14px  ; ';
        const result = convertStyle(styleString, 'object');

        expect(result).toEqual({
          color: 'red',
          'font-size': '14px',
        });
      });

      test('should handle style string with colons in values', () => {
        const styleString = 'background-image: url(http://example.com/image.jpg)';
        const result = convertStyle(styleString, 'object');

        expect(result).toEqual({
          'background-image': 'url(http://example.com/image.jpg)',
        });
      });

      test('should handle empty or invalid style strings', () => {
        expect(convertStyle('', 'object')).toEqual({});
        expect(convertStyle('   ', 'object')).toEqual({});
        expect(convertStyle('invalid-style', 'object')).toEqual({});
      });
    });

    describe('object to string conversion', () => {
      test('should convert simple object to style string', () => {
        const styleObj = {
          color: 'red',
          fontSize: '14px',
          marginTop: '10px',
        };
        const result = convertStyle(styleObj, 'string');

        expect(result).toBe('color:red;font-size:14px;margin-top:10px');
      });

      test('should handle camelCase properties', () => {
        const styleObj = {
          backgroundColor: 'blue',
          borderRadius: '5px',
          textAlign: 'center',
        };
        const result = convertStyle(styleObj, 'string');

        expect(result).toBe('background-color:blue;border-radius:5px;text-align:center');
      });

      test('should handle empty object', () => {
        expect(convertStyle({}, 'string')).toBe('');
      });
    });

    describe('default behavior and edge cases', () => {
      test('should default to object conversion', () => {
        const styleString = 'color: red';
        const result = convertStyle(styleString);

        expect(result).toEqual({ color: 'red' });
      });

      test('should return same type when no conversion needed', () => {
        const styleObj = { color: 'red' };
        const styleString = 'color: red';

        expect(convertStyle(styleObj, 'object')).toBe(styleObj);
        expect(convertStyle(styleString, 'string')).toBe(styleString);
      });

      test('should handle null and undefined inputs', () => {
        expect(convertStyle(null as any, 'object')).toEqual({});
        expect(convertStyle(undefined as any, 'object')).toEqual({});
        expect(convertStyle(null as any, 'string')).toBe('');
        expect(convertStyle(undefined as any, 'string')).toBe('');
      });
    });
  });
});
