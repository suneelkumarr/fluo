
import { describe, it, expect, beforeAll } from 'vitest';
import fluo, { b, options } from '../src/index';
import { stripAnsi } from '../src/utils/strip';

describe('Fluo Main API', () => {
  beforeAll(() => {
    options.level = 3;
  });

  it('should export fluent api', () => {
    expect(typeof fluo).toBe('function');
    expect(typeof fluo.red).toBe('function');
    expect(typeof fluo.bold).toBe('function');
  });

  it('should alias as b', () => {
    expect(b).toBe(fluo);
  });

  it('should support chaining', () => {
    const result = fluo.red.bold('text');
    expect(result).toContain('\x1b[31m');
    expect(result).toContain('\x1b[1m');
    expect(stripAnsi(result)).toBe('text');
  });

  it('should support nesting', () => {
    const result = fluo.red(`Hello ${fluo.blue('World')}`);
    // Should contain red, blue, and reset codes properly
    expect(result).toContain('\x1b[31m');
    expect(result).toContain('\x1b[34m');
    expect(stripAnsi(result)).toBe('Hello World');
  });

  it('should support RGB', () => {
    const result = fluo.rgb(255, 0, 0)('Red');
    expect(stripAnsi(result)).toBe('Red');
  });

  it('should support Hex', () => {
    const result = fluo.hex('#ff0000')('Red');
    expect(stripAnsi(result)).toBe('Red');
  });

  it('should support template literals', () => {
    const result = fluo.red`Hello ${'World'}`;
    expect(stripAnsi(result)).toBe('Hello World');
    expect(result).toContain('\x1b[31m');
  });
});
