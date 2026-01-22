
import { describe, it, expect } from 'vitest';
import { visibleLength, visibleTruncate, visiblePadEnd } from '../../src/utils/visible';

describe('Visible Utilities', () => {
  describe('visibleLength', () => {
    it('should calculate length without ansi codes', () => {
      expect(visibleLength('\x1b[31mHello\x1b[39m')).toBe(5);
      expect(visibleLength('Hello')).toBe(5);
    });

    it('should handle wide characters', () => {
      expect(visibleLength('你好', { wide: true })).toBe(4);
      expect(visibleLength('🌟', { wide: true })).toBe(2);
    });

    it('should handle mixed content', () => {
      expect(visibleLength('\x1b[31m你好\x1b[39m', { wide: true })).toBe(4);
    });
  });

  describe('visibleTruncate', () => {
    it('should truncate string to visible length', () => {
      expect(visibleTruncate('Hello World', 5)).toBe('Hell…');
      expect(visibleTruncate('\x1b[31mHello World\x1b[39m', 5)).toBe('\x1b[31mHell…');
    });

    it('should handle custom ellipsis', () => {
      expect(visibleTruncate('Hello World', 5, { ellipsis: '.' })).toBe('Hell.');
    });
  });

  describe('visiblePadEnd', () => {
    it('should pad string to visible length', () => {
      expect(visiblePadEnd('Hello', 10)).toBe('Hello     ');
      expect(visiblePadEnd('\x1b[31mHello\x1b[39m', 10)).toBe('\x1b[31mHello\x1b[39m     ');
    });
  });
});
