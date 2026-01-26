import { generateUUID, generateShortUUID } from '../libs/uuid';

describe('uuid utils', () => {
  describe('generateUUID', () => {
    test('should generate valid UUID v4 format', () => {
      const uuid = generateUUID();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      expect(uuid).toMatch(uuidRegex);
      expect(uuid.length).toBe(36);
    });

    test('should generate unique UUIDs', () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      const uuid3 = generateUUID();

      expect(uuid1).not.toBe(uuid2);
      expect(uuid2).not.toBe(uuid3);
      expect(uuid1).not.toBe(uuid3);
    });

    test('should have correct version number (4)', () => {
      const uuid = generateUUID();
      const versionChar = uuid.charAt(14);

      expect(versionChar).toBe('4');
    });

    test('should have correct variant bits', () => {
      const uuid = generateUUID();
      const variantChar = uuid.charAt(19);

      expect(['8', '9', 'a', 'b']).toContain(variantChar.toLowerCase());
    });

    test('should generate multiple valid UUIDs', () => {
      const uuids = Array.from({ length: 100 }, () => generateUUID());
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      uuids.forEach((uuid) => {
        expect(uuid).toMatch(uuidRegex);
      });

      // Check uniqueness
      const uniqueUuids = new Set(uuids);
      expect(uniqueUuids.size).toBe(100);
    });
  });

  describe('generateShortUUID', () => {
    test('should generate UUID without hyphens', () => {
      const shortUuid = generateShortUUID();
      const shortUuidRegex = /^[0-9a-f]{32}$/i;

      expect(shortUuid).toMatch(shortUuidRegex);
      expect(shortUuid.length).toBe(32);
      expect(shortUuid).not.toContain('-');
    });

    test('should generate unique short UUIDs', () => {
      const shortUuid1 = generateShortUUID();
      const shortUuid2 = generateShortUUID();
      const shortUuid3 = generateShortUUID();

      expect(shortUuid1).not.toBe(shortUuid2);
      expect(shortUuid2).not.toBe(shortUuid3);
      expect(shortUuid1).not.toBe(shortUuid3);
    });

    test('should be equivalent to generateUUID without hyphens', () => {
      const uuid = generateUUID();
      const shortUuid = generateShortUUID();
      const uuidWithoutHyphens = uuid.replace(/-/g, '');

      expect(shortUuid.length).toBe(uuidWithoutHyphens.length);
      expect(shortUuid).toMatch(/^[0-9a-f]{32}$/i);
    });

    test('should maintain version and variant information', () => {
      const shortUuid = generateShortUUID();

      // Version should be 4 (at position 12 in short format)
      expect(shortUuid.charAt(12)).toBe('4');

      // Variant should be 8, 9, a, or b (at position 16 in short format)
      const variantChar = shortUuid.charAt(16);
      expect(['8', '9', 'a', 'b']).toContain(variantChar.toLowerCase());
    });
  });
});
