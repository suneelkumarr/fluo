
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { detectColorLevel, setColorLevel, resetColorLevel } from '../../src/core/detect';

describe('Detect Utilities', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    resetColorLevel();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should detect NO_COLOR', () => {
    process.env.NO_COLOR = '1';
    expect(detectColorLevel()).toBe(0);
  });

  it('should detect FORCE_COLOR', () => {
    process.env.FORCE_COLOR = '3';
    expect(detectColorLevel()).toBe(3);
  });

  it('should detect CI', () => {
    process.env.CI = 'true';
    delete process.env.NO_COLOR;
    expect(detectColorLevel()).toBeGreaterThanOrEqual(1);
  });

  it('should respect manual override', () => {
    setColorLevel(2);
    expect(detectColorLevel()).toBe(2);
  });
});
