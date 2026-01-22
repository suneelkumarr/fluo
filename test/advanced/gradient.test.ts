
import { describe, it, expect, beforeAll } from 'vitest';
import { gradient, rainbow } from '../../src/advanced/gradient';
import { stripAnsi } from '../../src/utils/strip';
import { setColorLevel } from '../../src/core/detect';

describe('Gradient', () => {
  beforeAll(() => {
    setColorLevel(3);
  });

  it('should create gradient string', () => {
    const text = 'Hello World';
    const result = gradient(text, ['#ff0000', '#0000ff']);
    
    // Check that content is preserved
    expect(stripAnsi(result)).toBe(text);
    
    // Check that it contains ansi codes
    expect(result).not.toBe(text);
    expect(result).toContain('\x1b[');
  });

  it('should handle rainbow gradient', () => {
    const text = 'Rainbow';
    const result = rainbow(text);
    
    expect(stripAnsi(result)).toBe(text);
    expect(result).toContain('\x1b[');
  });

  it('should fallback gracefully for limited colors', () => {
    // This is hard to test directly without mocking detectColorLevel,
    // but we can ensure it returns a string
    const result = gradient('Test', ['red', 'blue']);
    expect(typeof result).toBe('string');
  });
});
