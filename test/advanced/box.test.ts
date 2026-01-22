
import { describe, it, expect, beforeAll } from 'vitest';
import { box } from '../../src/advanced/box';
import { stripAnsi } from '../../src/utils/strip';
import { setColorLevel } from '../../src/core/detect';

describe('Box Drawing', () => {
  beforeAll(() => {
    setColorLevel(3);
  });

  it('should create a simple box', () => {
    const content = 'Hello';
    const result = box(content);
    const stripped = stripAnsi(result);
    
    expect(stripped).toContain('┌───────┐');
    expect(stripped).toContain('│ Hello │');
    expect(stripped).toContain('└───────┘');
  });

  it('should support double border style', () => {
    const result = box('Double', { borderStyle: 'double' });
    const stripped = stripAnsi(result);
    
    expect(stripped).toContain('╔════════╗');
    expect(stripped).toContain('║ Double ║');
    expect(stripped).toContain('╚════════╝');
  });

  it('should support padding', () => {
    const result = box('Pad', { padding: 1 });
    const stripped = stripAnsi(result);
    
    expect(stripped).toContain('┌─────┐');
    expect(stripped).toContain('│     │');
    expect(stripped).toContain('│ Pad │');
    expect(stripped).toContain('│     │');
    expect(stripped).toContain('└─────┘');
  });

  it('should support title', () => {
    const result = box('Content', { title: 'Title' });
    const stripped = stripAnsi(result);
    
    expect(stripped).toContain('┌─ Title ─┐');
  });
});
