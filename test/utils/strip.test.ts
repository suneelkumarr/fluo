
import { describe, it, expect } from 'vitest';
import { stripAnsi } from '../../src/utils/strip';

describe('Strip Utilities', () => {
  it('should strip ansi codes', () => {
    expect(stripAnsi('\x1b[31mRed\x1b[39m')).toBe('Red');
    expect(stripAnsi('\x1b[1mBold\x1b[22m')).toBe('Bold');
    expect(stripAnsi('\x1b[38;2;255;0;0mRGB\x1b[39m')).toBe('RGB');
  });

  it('should handle nested codes', () => {
    expect(stripAnsi('\x1b[31mRed \x1b[1mBold\x1b[22m Red\x1b[39m')).toBe('Red Bold Red');
  });

  it('should return empty string for empty input', () => {
    expect(stripAnsi('')).toBe('');
  });

  it('should return plain text unchanged', () => {
    expect(stripAnsi('Hello World')).toBe('Hello World');
  });
});
